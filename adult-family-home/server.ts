/**********************************************************************
 * Angular Universal Express Server with Firebase Admin Meta Injection
 * + Email Cloud Function Export
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
import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';
import cors from 'cors';

/**********************************************************************
 * Firebase Admin SDK Initialization
 **********************************************************************/
const serviceAccount = JSON.parse(
  readFileSync(join(process.cwd(), 'server/firebase/afhdynamicwebsite-firebase-adminsdk-hbemk-514f2fcfe2.json'), 'utf-8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const adminFirestore = getFirestore(admin.app());

/**********************************************************************
 * Business ID Mapping by Hostname
 **********************************************************************/
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

/**********************************************************************
 * Express Server Setup (for SSR)
 **********************************************************************/
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
      { provide: SERVER_REQUEST, useValue: req }
    ]
  })
    .then(html => callback(null, html))
    .catch(err => callback(err));
});

server.set('view engine', 'html');
server.set('views', distFolder);
server.get('*.*', express.static(distFolder, { maxAge: '1y' }));

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

    if (err || !html) {
      console.error('❌ SSR Render Error:', err?.message || err || 'No HTML returned');
      return res.status(500).send(err?.message || 'Server Error');
    }

    if (businessData) {
      console.log('🟢 SSR - Injecting meta tags');
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

function run(): void {
  const port = process.env['PORT'] || 4000;
  server.listen(port, () => {
    console.log(`✅ Node SSR server running on http://localhost:${port}`);
  });
}

run();

/**********************************************************************
 * Firebase Function Exports
 **********************************************************************/

export const ssr = functions.https.onRequest(server);

export const sendEmail = functions.https.onRequest((req, res) => {
  const corsHandler = cors({ origin: true });
  corsHandler(req, res, async () => {
    const { to, subject, text, domain } = req.body;

    const credentialsMap: Record<string, { user: string; pass: string }> = {
      'helpinghandafh.com': {
        user: 'helpinghand99.afh@gmail.com',
        pass: 'your-app-password-here'
      },
      'aefamilyhome.com': {
        user: 'narteae@gmail.com',
        pass: 'fggv tyqw cnkt feex',
      },
      'sbmediahub.com': {
        user: 'sorin.bucse@gmail.com',
        pass: 'ybdv kmuc ciox nifm',
      },
      'countrycrestafh.com': {
        user: 'countrycrestafh@gmail.com',
        pass: 'xemf vinl sfub dbez',
      },
      'prestigecareafh.com': {
        user: 'Prestigecare202@gmail.com',
        pass: 'zgaa sbuk ipcd sbkj',
      },
      // Add other domains as needed
    };

    const creds = credentialsMap[domain];
    if (!creds) {
      return res.status(400).send({ error: 'Invalid domain' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: creds
    });

    try {
      await transporter.sendMail({ from: creds.user, to, subject, text });
      return res.status(200).send({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: err instanceof Error ? err.message : 'An unknown error occurred' });
    }
  });
});

export * from './src/main.server';
