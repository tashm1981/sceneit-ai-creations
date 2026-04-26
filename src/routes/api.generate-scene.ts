import { createFileRoute } from '@tanstack/react-router';
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/integrations/supabase/client.server';
import type { Database } from '@/integrations/supabase/types';

function pickModel(hd: boolean) {
  return hd
    ? 'google/gemini-3-pro-image-preview'
    : 'google/gemini-2.5-flash-image';
}

export const Route = createFileRoute('/api/generate-scene')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const auth = request.headers.get('authorization');
          if (!auth || !auth.startsWith('Bearer ')) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' },
            });
          }
          const token = auth.slice(7);

          const SUPABASE_URL = process.env.SUPABASE_URL!;
          const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY!;
          const userClient = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
            global: { headers: { Authorization: `Bearer ${token}` } },
            auth: { persistSession: false, autoRefreshToken: false },
          });
          const { data: claimsData, error: claimsErr } = await userClient.auth.getClaims(token);
          if (claimsErr || !claimsData?.claims?.sub) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' },
            });
          }
          const userId = claimsData.claims.sub;

          const body = (await request.json()) as { prompt?: string; hd?: boolean };
          const prompt = (body.prompt ?? '').trim();
          if (prompt.length < 4 || prompt.length > 4000) {
            return new Response(JSON.stringify({ error: 'Invalid prompt' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            });
          }
          const hd = !!body.hd;

          // Check credits
          const { data: cred } = await supabaseAdmin
            .from('user_credits')
            .select('credits')
            .eq('user_id', userId)
            .maybeSingle();
          const current = cred?.credits ?? 0;
          if (current <= 0) {
            return new Response(JSON.stringify({ error: 'Out of credits' }), {
              status: 402,
              headers: { 'Content-Type': 'application/json' },
            });
          }

          const apiKey = process.env.LOVABLE_API_KEY;
          if (!apiKey) {
            return new Response(JSON.stringify({ error: 'AI not configured' }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            });
          }

          const aiResp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: pickModel(hd),
              messages: [{ role: 'user', content: prompt }],
              modalities: ['image', 'text'],
            }),
          });

          if (aiResp.status === 429) {
            return new Response(JSON.stringify({ error: 'Rate limit — try again shortly.' }), {
              status: 429,
              headers: { 'Content-Type': 'application/json' },
            });
          }
          if (aiResp.status === 402) {
            return new Response(JSON.stringify({ error: 'AI workspace credits exhausted.' }), {
              status: 402,
              headers: { 'Content-Type': 'application/json' },
            });
          }
          if (!aiResp.ok) {
            const txt = await aiResp.text();
            console.error('AI gateway error:', aiResp.status, txt);
            return new Response(JSON.stringify({ error: 'AI generation failed' }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            });
          }

          const json = await aiResp.json();
          const dataUrl: string | undefined =
            json?.choices?.[0]?.message?.images?.[0]?.image_url?.url;

          if (!dataUrl || !dataUrl.startsWith('data:image/')) {
            return new Response(JSON.stringify({ error: 'No image returned' }), {
              status: 502,
              headers: { 'Content-Type': 'application/json' },
            });
          }

          const match = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
          if (!match) {
            return new Response(JSON.stringify({ error: 'Invalid image data' }), {
              status: 502,
              headers: { 'Content-Type': 'application/json' },
            });
          }
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
            return new Response(JSON.stringify({ error: 'Failed to save image' }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            });
          }

          const { data: pub } = supabaseAdmin.storage.from('scenes').getPublicUrl(path);
          const url = pub.publicUrl;

          await supabaseAdmin
            .from('user_credits')
            .update({ credits: current - 1, updated_at: new Date().toISOString() })
            .eq('user_id', userId);

          return new Response(JSON.stringify({ url, credits: current - 1 }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (e) {
          console.error('generate-scene error:', e);
          return new Response(
            JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }
      },
    },
  },
});