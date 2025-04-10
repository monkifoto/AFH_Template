/**********************************************************************
 * Angular Universal Express Server with Firebase Admin Meta Injection
 **********************************************************************/

import 'zone.js/node';
import 'source-map-support/register';
import express from 'express';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { renderModule } from '@angular/platform-server';
import { AppServerModule } from './src/app/app.server.module';
import { APP_BASE_HREF } from '@angular/common';
import { SERVER_REQUEST } from './src/app/tokens/server-request.token';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// 🧠 Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(
  readFileSync(join(process.cwd(), 'server/firebase/afhdynamicwebsite-firebase-adminsdk-hbemk-514f2fcfe2.json'), 'utf-8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const adminFirestore = getFirestore(admin.app());

// 🌐 Angular build paths
const distFolder = join(process.cwd(), 'dist/adult-family-home/browser');
const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index.html';

// 🧠 Business ID map by hostname
const businessIdMap: Record<string, string> = {
  "helpinghandafh.com": "vfCMoPjAu2ROVBbKvk0D",
  "www.helpinghandafh.com": "vfCMoPjAu2ROVBbKvk0D",
  "aefamilyhome.com": "UiSDf9elSjwcbQs2HZb1",
  "www.aefamilyhome.com": "UiSDf9elSjwcbQs2HZb1",
  "elderlyhomecareafh.com": "SJgFxBYkopnPR4WibCAf",
  "www.elderlyhomecareafh.com": "SJgFxBYkopnPR4WibCAf",
  "prestigecareafh.com": "pDJgpl34XUnRblyIlBA7",
  "www.prestigecareafh.com": "pDJgpl34XUnRblyIlBA7",
  "countrycrestafh.com": "yrNc50SvfPqwTSkvvygA",
  "www.countrycrestafh.com": "yrNc50SvfPqwTSkvvygA",
  "sbmediahub.com": "MGou3rzTVIbP77OLmZa7",
  "sp.sbmediahub.com": "KyQfU7hjez0uXRfAjqcu",
  "cc.sbmediahub.com": "yrNc50SvfPqwTSkvvygA",
  "hh.sbmediahub.com": "vfCMoPjAu2ROVBbKvk0D",
  "ae.sbmediahub.com": "UiSDf9elSjwcbQs2HZb1",
  "www.sbmediahub.com": "MGou3rzTVIbP77OLmZa7",
  "elderlyhc.sbmediahub.com": "SJgFxBYkopnPR4WibCAf",
  "prestige.sbmediahub.com": "pDJgpl34XUnRblyIlBA7",
};

// 🛠️ Create Express server
const server = express();

// 🖼️ View engine for Angular Universal
server.engine('html', (_, options, callback) => {
  const req = (options as any).req;

  renderModule(AppServerModule, {
    document: readFileSync(join(distFolder, indexHtml)).toString(),
    url: req.url,
    extraProviders: [
      { provide: APP_BASE_HREF, useValue: req.baseUrl },
      { provide: SERVER_REQUEST, useValue: req }
    ]
  })
    .then(html => callback(null, html))
    .catch(err => callback(err));
});

server.set('view engine', 'html');
server.set('views', distFolder);

// 📦 Serve static files
server.get('*.*', express.static(distFolder, {
  maxAge: '1y'
}));

// 🧠 SSR handler
server.get('*', async (req, res) => {
  const start = Date.now();
  const hostname = req.hostname;
  const businessId = businessIdMap[hostname] || 'MGou3rzTVIbP77OLmZa7';

  console.log('\n🟡 SSR render started for URL:', req.url);
  console.log('🌐 Hostname:', hostname, '| 🔑 Business ID:', businessId);

  let businessData: any = null;

  try {
    const doc = await adminFirestore.collection('businesses').doc(businessId).get();
    if (doc.exists) {
      businessData = doc.data();
      console.log('✅ Fetched business data for meta injection');
    }
  } catch (err) {
    console.error('❌ Failed to fetch business meta data:', err);
  }

  res.render(indexHtml, { req }, (err, html) => {
    const duration = Date.now() - start;

    if (err) {
      console.error('❌ SSR Render Error:', err.message || err);
      return res.status(500).send(err.message);
    }

    if (!html) {
      console.error('❌ SSR Render Error: No HTML returned');
      return res.status(500).send('Server Error: No HTML returned');
    }

    if (businessData) {
      console.log('🟢 SSR - Injecting meta tags');
      console.log('🟢 SSR - Business Data:', businessData);
      html = html.replace(
        /<meta name="description" content=".*?">/,
        `<meta name="description" content="${businessData.metaDescription || 'Adult Family Home'}">`
      ).replace(
        /<meta property="og:title" content=".*?">/,
        `<meta property="og:title" content="${businessData.metaTitle || businessData.businessName}">`
      ).replace(
        /<meta property="og:description" content=".*?">/,
        `<meta property="og:description" content="${businessData.metaDescription || ''}">`
      ).replace(
        /<meta property="og:image" content=".*?">/,
        `<meta property="og:image" content="${businessData.metaImage || '/assets/default-og.jpg'}">`
      ).replace(
        /<meta property="og:url" content=".*?">/,
        `<meta property="og:url" content="https://${hostname}${req.url}">`
      );
    }

    console.log('✅ SSR finished rendering HTML');
    console.log(`⏱️ Render duration: ${duration}ms`);

    res.send(html);
    return;
  });
});

// 🚀 Start the server
function run(): void {
  const port = process.env['PORT'] || 4000;
  server.listen(port, () => {
    console.log(`✅ Node SSR server running on http://localhost:${port}`);
  });
}

run();

export * from './src/main.server';
