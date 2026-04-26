import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { supabaseAdmin } from '@/integrations/supabase/client.server';

interface GenerateInput {
  prompt: string;
  hd?: boolean;
}

function pickModel(hd: boolean) {
  // Fast image model by default, pro when HD requested
  return hd
    ? 'google/gemini-3-pro-image-preview'
    : 'google/gemini-2.5-flash-image';
}

export const generateScene = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: GenerateInput) => {
    if (!input || typeof input.prompt !== 'string' || input.prompt.length < 4) {
      throw new Error('Prompt is required');
    }
    if (input.prompt.length > 4000) {
      throw new Error('Prompt too long');
    }
    return { prompt: input.prompt, hd: !!input.hd };
  })
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error('AI is not configured');

    // Check & decrement credits atomically-ish
    const { data: cred } = await supabaseAdmin
      .from('user_credits')
      .select('credits')
      .eq('user_id', userId)
      .maybeSingle();
    const current = cred?.credits ?? 0;
    if (current <= 0) {
      throw new Error('Out of credits');
    }

    const aiResp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: pickModel(data.hd),
        messages: [{ role: 'user', content: data.prompt }],
        modalities: ['image', 'text'],
      }),
    });

    if (aiResp.status === 429) {
      throw new Error('Rate limit exceeded — try again in a moment.');
    }
    if (aiResp.status === 402) {
      throw new Error('AI credits exhausted on this workspace.');
    }
    if (!aiResp.ok) {
      const txt = await aiResp.text();
      console.error('AI gateway error:', aiResp.status, txt);
      throw new Error('AI generation failed');
    }

    const json = await aiResp.json();
    const dataUrl: string | undefined =
      json?.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!dataUrl || !dataUrl.startsWith('data:image/')) {
      throw new Error('No image returned');
    }

    const match = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (!match) throw new Error('Invalid image data');
    const mime = match[1];
    const base64 = match[2];
    const ext = mime.split('/')[1].replace('+xml', '');
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

    const path = `${userId}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabaseAdmin.storage
      .from('scenes')
      .upload(path, bytes, { contentType: mime, upsert: false });

    if (upErr) {
      console.error('upload error:', upErr);
      throw new Error('Failed to save image');
    }

    const { data: pub } = supabaseAdmin.storage.from('scenes').getPublicUrl(path);
    const url = pub.publicUrl;

    // Decrement credits
    await supabaseAdmin
      .from('user_credits')
      .update({ credits: current - 1, updated_at: new Date().toISOString() })
      .eq('user_id', userId);

    return { url, credits: current - 1 };
  });