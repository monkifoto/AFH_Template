import 'zone.js';
import 'reflect-metadata';
import 'source-map-support/register';
import {join} from 'path';
import {readFileSync, existsSync} from 'fs';
import express, {Request, Response} from 'express';
// import {renderModule} from '@angular/platform-server';
import admin from 'firebase-admin';
// eslint-disable-next-line import/no-unresolved
import {getFirestore} from 'firebase-admin/firestore';


const APP_BASE_HREF = Symbol.for('APP_BASE_HREF');
// 🔐 Firebase Admin Init
const serviceAccount = JSON.parse(
    readFileSync(
        join(process.cwd(),
            'server/firebase/afhdynamicwebsite-firebase-adminsdk-hbemk-514f2fcfe2.json'),
        'utf-8'
    )
);
admin.initializeApp({credential: admin.credential.cert(serviceAccount)});
const adminFirestore = getFirestore(admin.app());

// const distFolder = join(process.cwd(), 'dist/adult-family-home/browser');
// const distFolder = join(__dirname, '../../dist/adult-family-home/browser');
// const distFolder = join(__dirname, 'angular/browser');
const distFolder = join(process.cwd(), 'lib/angular/browser');

const indexHtml = existsSync(join(distFolder, 'index.original.html'))?
 'index.original.html': 'index.html';

// 🌐 Hostname to business ID map
const businessIdMap: Record<string, string> = {
  'helpinghandafh.com': 'vfCMoPjAu2ROVBbKvk0D',
  'www.helpinghandafh.com': 'vfCMoPjAu2ROVBbKvk0D',
  'aefamilyhome.com': 'UiSDf9elSjwcbQs2HZb1',
  'www.aefamilyhome.com': 'UiSDf9elSjwcbQs2HZb1',
  'elderlyhomecareafh.com': 'SJgFxBYkopnPR4WibCAf',
  'www.elderlyhomecareafh.com': 'SJgFxBYkopnPR4WibCAf',
  'prestigecareafh.com': 'pDJgpl34XUnRblyIlBA7',
  'www.prestigecareafh.com': 'pDJgpl34XUnRblyIlBA7',
  'countrycrestafh.com': 'yrNc50SvfPqwTSkvvygA',
  'www.countrycrestafh.com': 'yrNc50SvfPqwTSkvvygA',
  'sbmediahub.com': 'MGou3rzTVIbP77OLmZa7',
  'sp.sbmediahub.com': 'KyQfU7hjez0uXRfAjqcu',
  'cc.sbmediahub.com': 'yrNc50SvfPqwTSkvvygA',
  'hh.sbmediahub.com': 'vfCMoPjAu2ROVBbKvk0D',
  'ae.sbmediahub.com': 'UiSDf9elSjwcbQs2HZb1',
  'www.sbmediahub.com': 'MGou3rzTVIbP77OLmZa7',
  'elderlyhc.sbmediahub.com': 'SJgFxBYkopnPR4WibCAf',
  'prestige.sbmediahub.com': 'pDJgpl34XUnRblyIlBA7',
  'afhdynamicwebsite-test.web.app': 'yrNc50SvfPqwTSkvvygA',
  'hh.test.sbmediahub.com': 'vfCMoPjAu2ROVBbKvk0D',
  'ae.test.sbmediahub.com': 'UiSDf9elSjwcbQs2HZb1',
  'test.helpinghandafh.com': 'vfCMoPjAu2ROVBbKvk0D',
  'test.aefamilyhome.com': 'UiSDf9elSjwcbQs2HZb1',
  'test.countrycrestafh.com': 'yrNc50SvfPqwTSkvvygA',
  'test.prestigecareafh.com': 'pDJgpl34XUnRblyIlBA7',
};

// 🛠️ Express server
const server = express();

// 🖼️ Angular Universal View Engine
// import { renderModule } from '@angular/platform-server';

server.engine('html', async (_filePath, options: any, callback) => {
  const req = options.req;

  try {
    // @ts-expect-error: Angular server bundle has no type declarations
    // const {AppServerModule, renderModule} = await import('../lib/main.js');
    // eslint-disable-next-line import/no-unresolved
    const {AppServerModule, renderModule} = await import('./angular/main.js');

    const html = await renderModule(AppServerModule, {
      document: readFileSync(join(distFolder, indexHtml)).toString(),
      url: req.url,
      extraProviders: [{provide: APP_BASE_HREF, useValue: req.baseUrl}],
    });

    callback(null, html);
  } catch (err) {
    console.error('❌ SSR Render Error:', err);
    callback(err as Error);
  }
});

server.set('view engine', 'html');
server.set('views', distFolder);

// 📦 Serve static assets
server.get('*.*', express.static(distFolder, {maxAge: '1y'}));

// 🧠 Dynamic SSR handler
server.get('*', async (req: Request, res: Response) => {
  const start = Date.now();
  const hostname = (req.headers['x-forwarded-host'] || req.hostname || '').toString().toLowerCase();
  const urlId = new URL(`http://${hostname}${req.url}`).searchParams.get('id');
  const businessId = urlId || businessIdMap[hostname] || 'MGou3rzTVIbP77OLmZa7';

  console.log('\n🟡 SSR for:', req.url, '| Host:', hostname, '| Business ID:', businessId);
  console.log(`🟡 SSR HIT -> URL: ${req.url} | HOST: ${req.hostname}`);
  console.log('🧪 SSR hostname:', req.hostname);
  console.log('🧪 SSR x-forwarded-host:', req.headers['x-forwarded-host']);
  console.log('🧪 SSR resolved hostname:', hostname);

  interface BusinessMeta {
    metaTitle?: string;
    metaDescription?: string;
    metaImage?: string;
    businessName?: string;
  }

  let businessData: BusinessMeta | null = null;

  try {
    const doc = await adminFirestore.collection('businesses').doc(businessId).get();
    if (doc.exists) {
      businessData = doc.data() as BusinessMeta;
      console.log('✅ Business meta fetched');
    }
  } catch (err) {
    console.error('❌ Failed to fetch business meta:', err);
  }

  res.render(indexHtml, {req}, (err, html) => {
    const duration = Date.now() - start;
    if (err || !html) {
      console.error('❌ SSR Render Failed:', err);
      return res.status(500).send(err?.message || 'SSR Error');
    }

    if (businessData) {
      const {metaTitle, metaDescription, metaImage, businessName} = businessData;

      html = html
          .replace(/<meta name="description" content=".*?">/,
              `<meta name="description" content="${metaDescription || ''}">`)
          .replace(/<meta property="og:title" content=".*?">/,
              `<meta property="og:title" content="${metaTitle || businessName || ''}">`)
          .replace(/<meta property="og:description" content=".*?">/,
              `<meta property="og:description" content="${metaDescription || ''}">`)
          .replace(/<meta property="og:image" content=".*?">/,
              `<meta property="og:image" content="${metaImage || '/assets/default-og.jpg'}">`)
          .replace(/<meta property="og:url" content=".*?">/,
              `<meta property="og:url" content="https://${hostname}${req.url}">`)
          .replace(/<title>.*<\/title>/,
              `<title>${metaTitle || businessName || 'Adult Family Home'}</title>`);
    }

    console.log(`✅ SSR complete (${duration}ms)`);
    res.send(html);
    return
  });
});

// 🚀 Start local server (for emulator or debug)
/**
 * Starts the local server for SSR, using the specified port from the environment
 * or defaulting to 4000.
 */
function run(): void {
  const port = process.env.PORT || 4000;
  server.listen(port, () => {
    console.log(`✅ SSR server running at http://localhost:${port}`);
  });
}

if (require.main === module) {
  run();
}

// Export for Firebase Function
export const ssr = server;
