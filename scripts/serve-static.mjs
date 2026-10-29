import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('out');
const types = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.json':'application/json', '.png':'image/png', '.svg':'image/svg+xml', '.webp':'image/webp', '.woff2':'font/woff2', '.ico':'image/x-icon', '.txt':'text/plain' };
http.createServer(async (req,res) => {
 try {
  const url = new URL(req.url, 'http://localhost');
  let file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
  if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403).end(); return; }
  if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
  const data = await readFile(file);
  res.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream'}).end(data);
 } catch { res.writeHead(404, {'Content-Type':'text/html'}).end(await readFile(path.join(root,'404.html'))); }
}).listen(Number(process.env.PORT || 3210), '127.0.0.1');
