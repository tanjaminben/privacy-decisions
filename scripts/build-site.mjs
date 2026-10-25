import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
execFileSync(process.execPath, ['scripts/prepare-privacy-guides.mjs'], { cwd: root, stdio: 'inherit' });
const out = path.join(root, 'dist');
await fs.mkdir(out, { recursive: true });
await fs.cp(path.join(root, 'site'), out, { recursive: true });
await fs.cp(path.join(root, '.local/privacy-guides-runtime'), path.join(out, 'tools/privacy-guides/runtime'), { recursive: true });
await fs.writeFile(path.join(out, 'index.html'), '<!doctype html><html lang="en"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/tools/privacy-guides/"><title>Privacy Decision Guides</title><a href="/tools/privacy-guides/">Open Privacy Decision Guides</a></html>\n');
console.log('Built complete Privacy Decision Guides page in dist/');
