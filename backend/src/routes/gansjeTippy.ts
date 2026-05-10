import Anthropic from '@anthropic-ai/sdk';
import type { Context } from 'hono';

const client = new Anthropic();

const SYSTEM_PROMPT = `Je bent GansjeTippy 🪿 — een lokale ontdekkingsagent voor IDidHere.
Je genereert locatietips die VERRASSEND zijn — niet wat iedereen al weet.
Geen toeristische clichés. Denk aan: verborgen plekken, lokale markten,
onbekende uitkijkpunten, authentieke eetgelegenheden die locals gebruiken.

ANTWOORD ALLEEN IN GELDIG JSON. Geen preamble, geen markdown, geen uitleg.

Schema:
{
  "tips": [
    {
      "name": "string",
      "description": "string (max 150 tekens)",
      "lat": number,
      "lon": number,
      "category": "food|nature|culture|nightlife|market|viewpoint|hidden",
      "bestTime": "morning|afternoon|evening|anytime",
      "confidence": "human|ai_generated",
      "tags": ["string"]
    }
  ]
}`;

interface TipRequest {
  destination: string;
  userProfile?: Record<string, unknown>;
  existingTips?: Array<{ name: string }>;
}

interface Tip {
  name: string;
  description: string;
  lat: number;
  lon: number;
  category: string;
  bestTime: string;
  confidence: string;
  tags: string[];
}

export async function gansjeTippyHandler(c: Context) {
  let body: TipRequest;
  try {
    body = await c.req.json<TipRequest>();
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400);
  }

  const { destination, userProfile = {}, existingTips = [] } = body;

  if (!destination || typeof destination !== 'string' || destination.trim().length === 0) {
    return c.json({ error: 'destination is required' }, 400);
  }

  const skipNames = existingTips.map((t) => t.name).filter(Boolean).join(', ') || 'geen';

  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 2048,
      thinking: { type: 'adaptive' },
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: `Genereer 10-15 verrassende locatietips voor: ${destination.trim()}
Gebruikersprofiel: ${JSON.stringify(userProfile)}
Al bekende tips om te vermijden: ${skipNames}`,
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === 'text');
    const text = textBlock && textBlock.type === 'text' ? textBlock.text : '';

    let parsed: { tips: Tip[] };
    try {
      parsed = JSON.parse(text);
    } catch {
      return c.json({ error: 'Parse error', raw: text }, 500);
    }

    if (!Array.isArray(parsed.tips)) {
      return c.json({ error: 'Unexpected response shape', raw: parsed }, 500);
    }

    const u = response.usage as {
      input_tokens: number;
      output_tokens: number;
      cache_read_input_tokens?: number;
      cache_creation_input_tokens?: number;
    };

    return c.json({
      tips: parsed.tips,
      usage: {
        input_tokens: u.input_tokens,
        output_tokens: u.output_tokens,
        cache_read_input_tokens: u.cache_read_input_tokens ?? 0,
        cache_creation_input_tokens: u.cache_creation_input_tokens ?? 0,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return c.json({ error: 'Anthropic API error', detail: message }, 502);
  }
}
