import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = await fs.realpath(path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist'));
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.ttf': 'font/ttf', '.txt': 'text/plain', '.json': 'application/json' };
http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://127.0.0.1');
    let file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
    if (file !== root && !file.startsWith(root + path.sep)) throw Error('Outside build');
    if ((await fs.stat(file)).isDirectory()) file = path.join(file, 'index.html');
    const actual = await fs.realpath(file);
    if (!actual.startsWith(root + path.sep)) throw Error('Outside build');
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(await fs.readFile(actual));
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
}).listen(Number(process.env.PORT || 8903), '127.0.0.1', () => console.log(`Privacy Decision Guides: http://127.0.0.1:${process.env.PORT || 8903}/tools/privacy-guides/`));
