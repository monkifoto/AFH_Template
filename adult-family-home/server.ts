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
    res.render(indexHtml, { req }, (err, html) => {
      if (err) {
        console.error('❌ SSR Render Error:', err);
        res.status(500).send(err.message);
      } else {
        console.log('\n🔍 --- BEGIN SSR HTML OUTPUT ---');
        console.log(html.slice(0, 1000)); // print first 1000 characters of HTML
        console.log('🔍 --- END SSR HTML OUTPUT ---\n');

        res.send(html);
      }
    });
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
