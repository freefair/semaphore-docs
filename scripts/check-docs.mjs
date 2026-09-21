#!/usr/bin/env node
// Check the published Markdown sources directly; no site build or dependencies.
import {readFileSync, readdirSync, existsSync, statSync} from 'node:fs';
import {resolve, dirname, relative, extname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const walk = dir => readdirSync(dir, {withFileTypes: true}).flatMap(e => e.isDirectory()
  ? walk(resolve(dir, e.name)) : e.name.endsWith('.md') ? [resolve(dir, e.name)] : []);
const pages = ['docs', 'translations', 'templates'].flatMap(d => walk(resolve(root, d)))
  .concat(['README.md', 'CLAUDE.md'].map(p => resolve(root, p)));
const failures = [];
const fail = (p, message) => failures.push(`${relative(root, p)}: ${message}`);
function prose(text) {
  let fence = null;
  return text.split('\n').map(line => {
    const stripped = line.replace(/^(?:\s*> ?)+/, '').trimStart();
    const match = stripped.match(/^(`{3,}|~{3,})(.*)$/);
    if (fence) {
      if (match && match[1][0] === fence.character && match[1].length >= fence.length && !match[2].trim()) fence = null;
      return '';
    }
    if (match && !(match[1][0] === '`' && match[2].includes('`'))) {
      fence = {character: match[1][0], length: match[1].length};
      return '';
    }
    return fence ? '' : line;
  }).join('\n');
}
function slug(text) {
  return text.replace(/<[^>]*>/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .toLowerCase().replace(/[^\p{L}\p{N}\p{M}_\-\s]/gu, '').replace(/\s/g, '-');
}
const contents = new Map(pages.map(p => [p, readFileSync(p, 'utf8')]));
const anchors = new Map();
for (const [p, text] of contents) {
  const body = prose(text), ids = new Set(), counts = new Map();
  for (const match of body.matchAll(/^#{1,6}\s+(.+?)\s*#*$/gm)) {
    const id = slug(match[1]), count = counts.get(id) ?? 0;
    ids.add(count ? `${id}-${count}` : id); counts.set(id, count + 1);
  }
  for (const match of body.matchAll(/<(?:a|span)\s+(?:id|name)=["']([^"']+)["'][^>]*>/g)) ids.add(match[1]);
  anchors.set(p, ids);
  if (/semaphoreui\.com/i.test(text)) fail(p, 'upstream website dependency');
  if (/\{#[^}]+\}|@(?:theme|site|docusaurus)\/|<\/?(?:Tabs|TabItem|Pro|Enterprise|FeatureState|EditionsTable|Link)\b|^\s*:::|\{\/\*|useBaseUrl\(/m.test(body)) fail(p, 'site-only syntax');
  if (/^---\n(?:title|description):/.test(text)) fail(p, 'site front matter');
  if (!/^# /m.test(body)) fail(p, 'missing document title');
}
// Scan balanced parentheses so image filenames and URL fragments remain intact.
function links(text) {
  const result = [];
  for (let i = 0; i < text.length - 1; i++) {
    if (text[i] !== ']' || text[i + 1] !== '(') continue;
    let end = i + 2, depth = 1;
    for (; end < text.length && depth; end++) {
      if (text[end] === '\\') { end++; continue; }
      if (text[end] === '(') depth++;
      if (text[end] === ')') depth--;
    }
    if (depth === 0) result.push(text.slice(i + 2, end - 1).replace(/^<|>$/g, '').replace(/\s+"[^"]*"$/, ''));
    i = end - 1;
  }
  for (const m of text.matchAll(/(?:href|src)=["']([^"']+)["']/g)) result.push(m[1]);
  for (const m of text.matchAll(/^\s*\[[^\]]+\]:\s*(\S+)/gm)) result.push(m[1]);
  return result;
}
let checkedLinks = 0;
for (const [p, text] of contents) {
  for (const url of links(prose(text).replace(/`[^`\n]*`/g, ''))) {
    if (/^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith('//')) continue;
    checkedLinks++;
    if (url.startsWith('/')) { fail(p, `site-relative link: ${url}`); continue; }
    const [path, fragment] = url.split('#');
    let decoded, decodedFragment;
    try {
      decoded = decodeURIComponent(path.split('?')[0]);
      decodedFragment = fragment ? decodeURIComponent(fragment) : '';
    } catch { fail(p, `invalid URL: ${url}`); continue; }
    const target = decoded ? resolve(dirname(p), decoded) : p;
    if (!existsSync(target) || !statSync(target).isFile()) { fail(p, `missing file: ${url}`); continue; }
    if (decodedFragment && extname(target) === '.md' && anchors.has(target) && !anchors.get(target).has(decodedFragment)) fail(p, `missing anchor: ${url}`);
  }
}
// Every canonical page must be discoverable without an application sidebar.
const index = contents.get(resolve(root, 'docs/CONTENTS.md')) ?? '';
for (const p of pages.filter(p => p.startsWith(resolve(root, 'docs') + '/') && !p.endsWith('/CONTENTS.md'))) {
  if (!index.includes(`](${relative(resolve(root, 'docs'), p)})`)) fail(p, 'missing from docs/CONTENTS.md');
}
for (const file of ['package.json', 'package-lock.json', 'docusaurus.config.js', 'sidebars.js', '.github/workflows/pages.yml']) {
  if (existsSync(resolve(root, file))) fail(resolve(root, file), 'website toolchain must not be published');
}
if (failures.length) {
  console.error(failures.join('\n'));
  console.error(`Markdown check failed: ${failures.length} problems.`);
  process.exitCode = 1;
} else console.log(`Markdown check passed: ${pages.length} pages, ${checkedLinks} local links; no website dependency or site-only syntax.`);
