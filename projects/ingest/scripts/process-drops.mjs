#!/usr/bin/env node

// Process Drops — GitHub Action script
// Reads unprocessed drops from Gist, classifies with Gemini Flash, writes back
// Sends TG summary when done

const GIST_ID = process.env.GIST_ID;
const GH_PAT = process.env.GH_PAT;
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;
const TG_CHAT_ID = process.env.TG_CHAT_ID || '-1003655798000';
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

// Fetch content from YouTube links (subtitles via oEmbed metadata)
async function enrichYouTubeLink(url) {
  try {
    const oembedRes = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
    if (oembedRes.ok) {
      const meta = await oembedRes.json();
      return `[YouTube] "${meta.title}" by ${meta.author_name}`;
    }
  } catch (_) {}
  return null;
}

// Fetch content from Twitter/X links (basic metadata via publish API)
async function enrichTwitterLink(url) {
  try {
    const oembedRes = await fetch(`https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}&omit_script=true`);
    if (oembedRes.ok) {
      const meta = await oembedRes.json();
      // Strip HTML tags from the embed to get plain text
      const plainText = meta.html?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      return plainText ? `[Tweet] ${meta.author_name}: ${plainText.slice(0, 300)}` : null;
    }
  } catch (_) {}
  return null;
}

// Enrich drops that have URLs but minimal text
async function enrichDrop(drop) {
  const text = drop.text || '';
  const urls = text.match(/https?:\/\/[^\s]+/g) || [];
  const enrichments = [];

  for (const url of urls) {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const ytInfo = await enrichYouTubeLink(url);
      if (ytInfo) enrichments.push(ytInfo);
    } else if (url.includes('twitter.com') || url.includes('x.com')) {
      const twInfo = await enrichTwitterLink(url);
      if (twInfo) enrichments.push(twInfo);
    }
  }

  if (enrichments.length > 0) {
    drop.enrichedText = text + '\n---\n' + enrichments.join('\n');
    return true;
  }
  return false;
}

// Send TG summary when processing completes
async function sendTGSummary(total, classified, enriched, results) {
  if (!TG_BOT_TOKEN) {
    console.log('No TG_BOT_TOKEN — skipping notification.');
    return;
  }

  // Count categories
  const cats = {};
  for (const r of results) {
    if (r.classification?.category) {
      cats[r.classification.category] = (cats[r.classification.category] || 0) + 1;
    }
  }

  // Find high priority items
  const highPri = results
    .filter(r => r.classification?.priority === 'high')
    .map(r => r.classification?.summary || r.text?.slice(0, 40))
    .slice(0, 3);

  const catLine = Object.entries(cats)
    .map(([k, v]) => `${v} ${k}${v > 1 ? 's' : ''}`)
    .join(', ');

  let msg = `⚡ ${classified}/${total} drops processed`;
  if (enriched > 0) msg += ` (${enriched} enriched)`;
  msg += `\n${catLine}`;
  if (highPri.length > 0) {
    msg += `\n\n🔴 High priority:\n${highPri.map(h => `• ${h}`).join('\n')}`;
  }
  msg += `\n\n📊 https://ingest-pi.vercel.app`;

  try {
    await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TG_CHAT_ID, text: msg }),
    });
    console.log('TG notification sent.');
  } catch (err) {
    console.error('TG send failed:', err.message);
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
  let enriched = 0;

  for (const drop of unprocessed) {
    console.log(`Processing: "${(drop.text || '').slice(0, 50)}..."`);

    // Enrich links (YouTube, Twitter/X) before classifying
    const wasEnriched = await enrichDrop(drop);
    if (wasEnriched) enriched++;

    if (GEMINI_KEY) {
      // Use enriched text for classification if available
      const classifyDrop_ = { ...drop, text: drop.enrichedText || drop.text };
      const result = await classifyDrop(classifyDrop_);
      if (result) {
        drop.classification = result;
        classified++;
      }
    }

    drop.processed = true;
    drop.processedAt = new Date().toISOString();
  }

  console.log(`Classified ${classified}/${unprocessed.length} drops. Enriched: ${enriched}.`);
  console.log('Writing back to Gist...');
  await writeDrops(data);

  // Send TG notification
  await sendTGSummary(unprocessed.length, classified, enriched, unprocessed);

  console.log('Done.');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
