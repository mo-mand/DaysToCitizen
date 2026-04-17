#!/usr/bin/env node
// Generates src/app/help/content/{lang}.ts for all non-English languages
// using the free google-translate-api-x package (no API key).
//
//   npm i -D google-translate-api-x
//   node scripts/translate-help.mjs
//
// Re-run any time en.ts changes. Farsi (fa) should be hand-corrected after.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import translate from 'google-translate-api-x';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const contentDir = resolve(root, 'src/app/help/content');

const LANGS = {
  fr: 'fr', es: 'es', pt: 'pt', de: 'de', it: 'it', pl: 'pl',
  ro: 'ro', ru: 'ru', uk: 'uk', tr: 'tr', vi: 'vi', ko: 'ko',
  ja: 'ja', zh: 'zh-CN', hi: 'hi', bn: 'bn', gu: 'gu', pa: 'pa',
  tl: 'tl', fa: 'fa', ar: 'ar', ur: 'ur',
};

// Load en.ts by stripping TS wrapper and evaluating the object literal.
const enRaw = readFileSync(resolve(contentDir, 'en.ts'), 'utf8');
const match = enRaw.match(/const help\s*=\s*(\{[\s\S]*?\});\s*export default help/);
if (!match) throw new Error('Could not parse en.ts');
const en = eval('(' + match[1] + ')');

// Walk leaves
function mapLeaves(obj, fn) {
  if (typeof obj === 'string') return fn(obj);
  if (Array.isArray(obj)) return obj.map((v) => mapLeaves(v, fn));
  const out = {};
  for (const k of Object.keys(obj)) out[k] = mapLeaves(obj[k], fn);
  return out;
}

async function translateTree(targetCode) {
  const strings = [];
  mapLeaves(en, (s) => { strings.push(s); return s; });

  // Batch with a delimiter so we issue fewer requests.
  const DELIM = '\n@@@\n';
  const BATCH = 40;
  const translated = [];
  for (let i = 0; i < strings.length; i += BATCH) {
    const chunk = strings.slice(i, i + BATCH);
    const joined = chunk.join(DELIM);
    const res = await translate(joined, { to: targetCode });
    const parts = res.text.split(/\s*@@@\s*/);
    if (parts.length !== chunk.length) {
      // Fallback: translate individually
      for (const s of chunk) {
        const r = await translate(s, { to: targetCode });
        translated.push(r.text);
      }
    } else {
      translated.push(...parts);
    }
    process.stdout.write('.');
  }

  let idx = 0;
  return mapLeaves(en, () => translated[idx++]);
}

function serialize(obj, indent = 2) {
  const pad = ' '.repeat(indent);
  if (typeof obj === 'string') {
    return JSON.stringify(obj);
  }
  const entries = Object.entries(obj).map(([k, v]) => {
    if (typeof v === 'string') return `${pad}${k}: ${JSON.stringify(v)}`;
    return `${pad}${k}: ${serialize(v, indent + 2).replace(/^ +/, '')}`;
  });
  return `{\n${entries.join(',\n')},\n${' '.repeat(indent - 2)}}`;
}

for (const [key, code] of Object.entries(LANGS)) {
  process.stdout.write(`\n${key} `);
  const tree = await translateTree(code);
  const body = `import type { HelpContent } from './en';\n\nconst help: HelpContent = ${serialize(tree)};\n\nexport default help;\n`;
  writeFileSync(resolve(contentDir, `${key}.ts`), body, 'utf8');
}
console.log('\nDone.');
