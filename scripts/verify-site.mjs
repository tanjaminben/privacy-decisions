import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
for (const [manifest, prefix] of [['SOURCE-PINS.json', ''], ['REVIEWED-PAYLOAD.json', 'dist']]) {
  const value = JSON.parse(await fs.readFile(path.join(root, manifest), 'utf8'));
  for (const item of value.files) {
    const bytes = await fs.readFile(path.join(root, prefix, item.path));
    const actual = crypto.createHash('sha256').update(bytes).digest('hex');
    if (actual !== item.sha256) throw Error(`Reviewed bytes changed: ${manifest} ${item.path}`);
  }
  console.log(`Verified ${value.files.length} exact files from ${manifest}`);
}
