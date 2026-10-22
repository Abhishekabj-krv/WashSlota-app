/**
 * Minimal Zero-Dependency Production HTTP Server for WashSlot
 * Serves the pre-built 'dist' folder with Single-Page Application (SPA) fallback
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

if (!fs.existsSync(DIST_DIR)) {
  console.error("❌ 'dist' directory not found. Please run 'npm run build' first.");
  process.exit(1);
}

const server = http.createServer((req, res) => {
  // Strip query strings
  const cleanUrl = req.url.split('?')[0];
  let filePath = path.join(DIST_DIR, cleanUrl);

  // If path is root or directory, serve index.html
  if (cleanUrl === '/' || !path.extname(cleanUrl)) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  // Check file existence
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback for SPA routing (React Router)
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        return;
      }

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000'
      });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`\n========================================================`);
  console.log(` WashSlot Local Server is running!`);
  console.log(` App URL: http://localhost:${PORT}`);
  console.log(`========================================================\n`);
});
