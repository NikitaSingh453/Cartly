const MODEL = 'gemini-3.8-flash';

function apiKey() {
  const k = import.meta.env.VITE_GEMINI_API_KEY;
  if (!k) throw new Error('Add VITE_GEMINI_API_KEY to frontend/.env.local');
  return k;
}

async function callGemini(contents, systemInstruction, config = {}, retries = 1) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey()}`;
  const body = {
    contents,
    ...(systemInstruction ? { systemInstruction: { parts: [{ text: systemInstruction }] } } : {}),
    generationConfig: { maxOutputTokens: 400, temperature: 0.7, ...config },
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    const msg = data.error?.message || `Gemini error ${res.status}`;
    const isQuota = msg.includes('quota') || msg.includes('Quota') || msg.includes('rate') || msg.includes('429');
    if (isQuota) throw new Error('Rate limit reached (free tier: 5 req/min). Please wait a moment and try again.');
    if (retries > 0 && res.status === 503) {
      await new Promise(r => setTimeout(r, 2000));
      return callGemini(contents, systemInstruction, config, retries - 1);
    }
    throw new Error(msg);
  }
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
}

/** Single prompt → response */
export async function geminiGenerate(prompt, { systemInstruction, ...config } = {}) {
  return callGemini([{ role: 'user', parts: [{ text: prompt }] }], systemInstruction, config);
}

/** Multi-turn chat. messages = [{ role: 'user'|'model', text: '...', initial?: true }] */
export async function geminiChat(messages, systemInstruction) {
  const filtered = messages.filter((m) => !m.initial && m.text?.trim());
  const start = filtered.findIndex((m) => m.role === 'user');
  if (start < 0) throw new Error('No user message in history');
  const contents = filtered.slice(start).map((m) => ({
    role: m.role,
    parts: [{ text: m.text }],
  }));
  return callGemini(contents, systemInstruction);
}

/** Parse JSON safely from a Gemini response that may wrap it in markdown */
export function parseGeminiJSON(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON in response');
  return JSON.parse(match[0]);
}
