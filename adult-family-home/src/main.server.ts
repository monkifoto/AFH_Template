import 'zone.js/node';
import { renderModule } from '@angular/platform-server';
import express from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';
import { AppServerModule } from './app/app.server.module';
import { onRequest } from 'firebase-functions/v2/https';

const DIST_FOLDER = join(__dirname, '../../public');
const INDEX_HTML_PATH = join(DIST_FOLDER, 'index.html');

const indexHtml = readFileSync(INDEX_HTML_PATH, 'utf-8');
const app = express();

app.get('*.*', express.static(DIST_FOLDER, {
  maxAge: '1y'
}));

app.get('*', async (req, res) => {
  try {
    const html = await renderModule(AppServerModule, {
      document: indexHtml,
      url: req.originalUrl
    });
    res.status(200).send(html);
  } catch (err) {
    console.error('❌ SSR rendering error:', err);
    res.status(500).send('Server error');
  }
});

// ✅ This is what Firebase SSR needs
export const ssr = onRequest(app);
