import 'source-map-support/register'
import 'zone.js/node';
import express from 'express';
import { join } from 'path';
import { existsSync } from 'fs';
import { readFileSync } from 'fs';
import { renderModule } from '@angular/platform-server';
import { AppServerModule } from './src/app/app.server.module';
import { APP_BASE_HREF } from '@angular/common';
import { SERVER_REQUEST } from './src/app/tokens/server-request.token';

export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/adult-family-home/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index.html';

  server.engine('html', (_, options, callback) => {
    const req = (options as any).req;

    renderModule(AppServerModule, {
      document: readFileSync(join(distFolder, indexHtml)).toString(),
      url: req.url,
      extraProviders: [
        { provide: APP_BASE_HREF, useValue: req.baseUrl },
        { provide: SERVER_REQUEST, useValue: req } // 👈 this line is key!
      ]
    })
      .then((html) => callback(null, html))
      .catch((err) => callback(err));
  });

  server.set('view engine', 'html');
  server.set('views', distFolder);

  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  server.get('*', (req, res) => {
    const start = Date.now();
    console.log('\n🟡 SSR render started for URL:', req.url);
    console.log(`🧠 Memory usage at start: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`);

    res.render(indexHtml, { req }, (err, html) => {
      const duration = Date.now() - start;

      if (err) {
        console.error('❌ SSR Render Error:', err.message || err);
        console.error(err.stack || '');
        res.status(500).send(err.message);
        return;
      }

      console.log('✅ SSR finished rendering HTML');
      console.log(`⏱️ Render duration: ${duration}ms`);
      console.log(`🧠 Memory usage at end: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`);

      const preview = html?.slice(0, 1000) || '[no HTML returned]';
      console.log('🔍 --- BEGIN SSR HTML OUTPUT ---');
      console.log(preview);
      console.log('🔍 --- END SSR HTML OUTPUT ---\n');

      res.send(html);
    });

    // Optional: detect if response is taking too long
    setTimeout(() => {
      console.warn('⏳ SSR render still running after 10s. Possible infinite loop or unresolved Promise?');
    }, 10000);
  });


  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;
  const serverApp = app();
  serverApp.listen(port, () => {
    console.log(`✅ Node SSR server running on http://localhost:${port}`);
  });
}

declare const __non_webpack_require__: NodeRequire;
//if (require.main === module) {
  run();
//}

export * from './src/main.server';
