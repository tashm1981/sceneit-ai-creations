import { createFileRoute } from '@tanstack/react-router';
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/integrations/supabase/client.server';
import type { Database } from '@/integrations/supabase/types';

type ModelTier = 'fast' | 'balanced' | 'hd';

function pickModel(tier: ModelTier) {
  switch (tier) {
    case 'hd':
      return 'google/gemini-3-pro-image-preview';
    case 'balanced':
      return 'google/gemini-3.1-flash-image-preview';
    case 'fast':
    default:
      return 'google/gemini-2.5-flash-image';
  }
}

function tierCost(tier: ModelTier) {
  return tier === 'hd' ? 2 : 1;
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

          const body = (await request.json()) as {
            prompt?: string;
            hd?: boolean;
            tier?: ModelTier;
          };
          const prompt = (body.prompt ?? '').trim();
          if (prompt.length < 4 || prompt.length > 4000) {
            return new Response(JSON.stringify({ error: 'Invalid prompt' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            });
          }
          const tier: ModelTier =
            body.tier && ['fast', 'balanced', 'hd'].includes(body.tier)
              ? body.tier
              : body.hd
                ? 'hd'
                : 'balanced';
          const cost = tierCost(tier);

          // Atomically reserve credits to prevent TOCTOU race conditions
          const { data: remainingCredits, error: deductErr } = await supabaseAdmin.rpc(
            'deduct_user_credits',
            { _user_id: userId, _cost: cost }
          );
          if (deductErr) {
            console.error('credit deduction error:', deductErr);
            return new Response(JSON.stringify({ error: 'Internal server error' }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            });
          }
          if (remainingCredits === null || remainingCredits === undefined) {
            return new Response(JSON.stringify({ error: 'Not enough credits' }), {
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
              model: pickModel(tier),
              messages: [{ role: 'user', content: prompt }],
              modalities: ['image', 'text'],
            }),
          });

          // Helper to refund reserved credits if generation fails after deduction
          const refundCredits = async () => {
            await supabaseAdmin.rpc('deduct_user_credits', {
              _user_id: userId,
              _cost: -cost,
            });
          };

          if (aiResp.status === 429) {
            await refundCredits();
            return new Response(JSON.stringify({ error: 'Rate limit — try again shortly.' }), {
              status: 429,
              headers: { 'Content-Type': 'application/json' },
            });
          }
          if (aiResp.status === 402) {
            await refundCredits();
            return new Response(JSON.stringify({ error: 'AI workspace credits exhausted.' }), {
              status: 402,
              headers: { 'Content-Type': 'application/json' },
            });
          }
          if (!aiResp.ok) {
            const txt = await aiResp.text();
            console.error('AI gateway error:', aiResp.status, txt);
            await refundCredits();
            return new Response(JSON.stringify({ error: 'AI generation failed' }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            });
          }

          const json = await aiResp.json();
          const dataUrl: string | undefined =
            json?.choices?.[0]?.message?.images?.[0]?.image_url?.url;

          if (!dataUrl || !dataUrl.startsWith('data:image/')) {
            await refundCredits();
            return new Response(JSON.stringify({ error: 'No image returned' }), {
              status: 502,
              headers: { 'Content-Type': 'application/json' },
            });
          }

          const match = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
          if (!match) {
            await refundCredits();
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
            await refundCredits();
            return new Response(JSON.stringify({ error: 'Failed to save image' }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            });
          }

          const { data: pub } = supabaseAdmin.storage.from('scenes').getPublicUrl(path);
          const url = pub.publicUrl;

          return new Response(JSON.stringify({ url, credits: remainingCredits }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (e) {
          console.error('generate-scene error:', e);
          return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }
      },
    },
  },
});