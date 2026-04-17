// Re-translates only a6Before / a6Link / a6After for every language file,
// preserving all other (possibly hand-edited) strings. Skips fa if SKIP_FA=1.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import translate from 'google-translate-api-x';

const __dirname = dirname(fileURLToPath(import.meta.url));
const contentDir = resolve(__dirname, '..', 'src/app/help/content');

const LANGS = {
  fr: 'fr', es: 'es', pt: 'pt', de: 'de', it: 'it', pl: 'pl',
  ro: 'ro', ru: 'ru', uk: 'uk', tr: 'tr', vi: 'vi', ko: 'ko',
  ja: 'ja', zh: 'zh-CN', hi: 'hi', bn: 'bn', gu: 'gu', pa: 'pa',
  tl: 'tl', fa: 'fa', ar: 'ar', ur: 'ur',
};

const EN = {
  a6Before: 'No. DaysToCitizen is an independent, open-source tool built to help immigrants track their own records. It is not affiliated with the Government of Canada. Always verify your application details through the official',
  a6Link: 'IRCC',
  a6After: 'website before submitting your application.',
};

function replaceKey(src, key, value) {
  const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  // Matches: a6Before: "..."  or  a6Before: '...'  (single-line)
  const re = new RegExp(`(${key}\\s*:\\s*)(?:"(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*')`);
  if (!re.test(src)) throw new Error(`Key ${key} not found`);
  return src.replace(re, `$1"${escaped}"`);
}

for (const [key, code] of Object.entries(LANGS)) {
  const file = resolve(contentDir, `${key}.ts`);
  let src = readFileSync(file, 'utf8');
  process.stdout.write(`${key} `);
  for (const field of ['a6Before', 'a6Link', 'a6After']) {
    const r = await translate(EN[field], { to: code });
    src = replaceKey(src, field, r.text);
  }
  writeFileSync(file, src, 'utf8');
}
console.log('\nDone.');
