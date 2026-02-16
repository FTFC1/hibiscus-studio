#!/usr/bin/env node

// Process Drops — GitHub Action script
// Reads unprocessed drops from Gist, classifies with Gemini Flash, writes back

const GIST_ID = process.env.GIST_ID;
const GH_PAT = process.env.GH_PAT;
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GIST_API = `https://api.github.com/gists/${GIST_ID}`;
const GEMINI_API = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

async function readDrops() {
  const res = await fetch(GIST_API, {
    headers: { Authorization: `Bearer ${GH_PAT}`, 'User-Agent': 'ingest-action' },
  });
  if (!res.ok) throw new Error(`Gist read failed: ${res.status} ${await res.text()}`);
  const gist = await res.json();
  const content = gist.files['drops.json']?.content || '{"drops":[]}';
  return JSON.parse(content);
}

async function writeDrops(data) {
  const res = await fetch(GIST_API, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${GH_PAT}`,
      'Content-Type': 'application/json',
      'User-Agent': 'ingest-action',
    },
    body: JSON.stringify({
      files: { 'drops.json': { content: JSON.stringify(data, null, 2) } },
    }),
  });
  if (!res.ok) throw new Error(`Gist write failed: ${res.status} ${await res.text()}`);
}

async function classifyDrop(drop) {
  const prompt = `Classify this drop from a personal command center. Return ONLY valid JSON, no markdown.

DROP TEXT: "${drop.text}"
DROP TYPE: ${drop.type}
DROP SOURCE: ${drop.source}

Return JSON with these fields:
{
  "category": one of "action" | "idea" | "question" | "reference" | "feedback" | "note",
  "tags": array of 1-3 short tags (project names, people, topics),
  "summary": one sentence summary (max 15 words),
  "priority": "high" | "medium" | "low",
  "route": one of "triage" | "notion" | "raised" | "shipped" | "streams"
}

Context: Projects include HB (Hibiscus Studio), PUMA (retail training), MIKANO (sales), INGEST (this system), DSG (selling framework). People: Rochelle, Timmy, Adedolapo, Fisayo.`;

  try {
    const res = await fetch(GEMINI_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 256,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!res.ok) {
      console.error(`Gemini error: ${res.status}`);
      return null;
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    return JSON.parse(text);
  } catch (err) {
    console.error(`Classification failed for drop ${drop.id}:`, err.message);
    return null;
  }
}

async function main() {
  if (!GIST_ID || !GH_PAT) {
    console.error('Missing GIST_ID or GH_PAT');
    process.exit(1);
  }

  console.log('Reading drops from Gist...');
  const data = await readDrops();
  const unprocessed = data.drops.filter(d => !d.processed);

  if (unprocessed.length === 0) {
    console.log('No unprocessed drops. Done.');
    return;
  }

  console.log(`Found ${unprocessed.length} unprocessed drops.`);

  let classified = 0;
  for (const drop of unprocessed) {
    console.log(`Processing: "${drop.text.slice(0, 50)}..."`);

    if (GEMINI_KEY) {
      const result = await classifyDrop(drop);
      if (result) {
        drop.classification = result;
        classified++;
      }
    }

    drop.processed = true;
    drop.processedAt = new Date().toISOString();
  }

  console.log(`Classified ${classified}/${unprocessed.length} drops.`);
  console.log('Writing back to Gist...');
  await writeDrops(data);
  console.log('Done.');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
