/* ============================================
   Tiny Glitch — Content Loader
   Loads glitches from /glitches/*.md files
   ============================================ */

let CATEGORIES = [];
let TOPICS = {};
let MISSIONS = [];
let GLITCHES = [];

function parseFrontmatter(text) {
  const result = {};
  for (const line of text.split('\n')) {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) result[match[1]] = match[2].trim();
  }
  return result;
}

function parseOption(line) {
  const parts = line.split(' | ');
  return { text: parts[0].trim(), feedback: parts[1] ? parts[1].trim() : null };
}

function extractMermaid(text) {
  // Extract ```mermaid ... ``` blocks, replace with placeholders
  const blocks = [];
  const replaced = text.replace(/```mermaid\n([\s\S]*?)```/g, (_, code) => {
    blocks.push(code.trim());
    return '\n\nMERMAID_BLOCK_' + (blocks.length - 1) + '\n\n';
  });
  return { text: replaced, blocks };
}

function parseBody(body, mermaidBlocks) {
  const paragraphs = body.split(/\n\n+/);
  const chat = [];

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    // Mermaid placeholder
    const mermaidMatch = trimmed.match(/^MERMAID_BLOCK_(\d+)$/);
    if (mermaidMatch) {
      chat.push({ mermaid: mermaidBlocks[parseInt(mermaidMatch[1])] });
      continue;
    }

    const lines = trimmed.split('\n');

    if (lines[0].startsWith('? ')) {
      const question = lines[0].slice(2).trim();
      const options = [];
      let correct = 0;
      let explanation = '';

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('* ')) {
          correct = options.length;
          options.push(parseOption(line.slice(2)));
        } else if (line.startsWith('- ')) {
          options.push(parseOption(line.slice(2)));
        } else if (line.startsWith('! ')) {
          explanation = line.slice(2).trim();
        }
      }

      chat.push({ quiz: { question, options, correct, explanation } });
    } else {
      chat.push({ bot: trimmed.replace(/\n/g, ' ') });
    }
  }

  return chat;
}

function parseMd(text) {
  const fmMatch = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) return null;

  const frontmatter = parseFrontmatter(fmMatch[1]);
  const fullBody = fmMatch[2].trim();

  // Extract mermaid blocks before any splitting
  const { text: cleanBody, blocks: mermaidBlocks } = extractMermaid(fullBody);

  // Split off deepdive section (after +++)
  const deepdiveSplit = cleanBody.split(/\n\+\+\+\n/);
  const body = deepdiveSplit[0].trim();
  const deepdiveRaw = deepdiveSplit[1] ? deepdiveSplit[1].trim() : null;

  const chat = parseBody(body, mermaidBlocks);

  // Parse deepdive — also handle mermaid placeholders
  let deepdive = null;
  if (deepdiveRaw) {
    deepdive = [];
    deepdiveRaw.split(/\n\n+/).forEach(p => {
      const t = p.trim();
      if (!t) return;
      const mm = t.match(/^MERMAID_BLOCK_(\d+)$/);
      if (mm) deepdive.push({ mermaid: mermaidBlocks[parseInt(mm[1])] });
      else deepdive.push(t);
    });
  }

  const flashcard = (frontmatter.flashQ && frontmatter.flashA)
    ? { q: frontmatter.flashQ, a: frontmatter.flashA }
    : null;

  return { id: frontmatter.id, topic: frontmatter.topic, title: frontmatter.title, teaser: frontmatter.teaser, hook: frontmatter.hook || null, chat, deepdive, flashcard };
}

async function loadGlitches() {
  const resp = await fetch('glitches/index.json');
  const index = await resp.json();

  CATEGORIES = index.categories || [];
  TOPICS = index.topics;
  MISSIONS = index.missions;

  GLITCHES = await Promise.all(
    index.glitches.map(async filename => {
      const r = await fetch('glitches/' + filename);
      const text = await r.text();
      return parseMd(text);
    })
  );
}
