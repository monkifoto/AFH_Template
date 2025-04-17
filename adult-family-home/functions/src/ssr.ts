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


const SSR_BUSINESS_ID = Symbol.for('SSR_BUSINESS_ID');
const APP_BASE_HREF = Symbol.for('APP_BASE_HREF');

const isTestEnv = process.env.GCLOUD_PROJECT === 'afhdynamicwebsite-test';
const credentialPath = isTestEnv ?
'server/firebase/afhdynamicwebsite-test.json':
'server/firebase/afhdynamicwebsite-prod.json';

// 🔐 Firebase Admin Init
const serviceAccount = JSON.parse(
    readFileSync(join(process.cwd(), credentialPath), 'utf-8')
);
// const serviceAccount = JSON.parse(
//     readFileSync(
//         join(process.cwd(),
//             'server/firebase/afhdynamicwebsite-firebase-adminsdk-hbemk-514f2fcfe2.json'),
//         'utf-8'
//     )
// );
console.log('🧪 GCLOUD_PROJECT:', process.env.GCLOUD_PROJECT);
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
  console.log('🟢 SSR Engine Invoked');
  const req = options.req;
  const businessId = options.businessId;
  const hostname = (req.headers['x-forwarded-host'] || req.hostname || '').toString().toLowerCase();

  try {
    const {AppServerModule, renderModule} =
    await import(join(__dirname, '../lib/angular/main.js'));

    const businessDoc = await adminFirestore.collection('businesses').doc(businessId).get();
    const businessData = businessDoc.exists ? businessDoc.data() : {};

    const htmlTemplate = readFileSync(join(distFolder, indexHtml)).toString();

    const injectedHtml = htmlTemplate
        .replace(/{{title}}/gi, businessData?.metaTitle || businessData?.businessName || '')
        .replace(/{{description}}/gi, businessData?.metaDescription || '')
        .replace(/{{ogTitle}}/gi, businessData?.metaTitle || businessData?.businessName || '')
        .replace(/{{ogDescription}}/gi, businessData?.metaDescription || '')
        .replace(/{{ogImage}}/gi, businessData?.metaImage || '/assets/default-og.jpg')
        .replace(/{{ogUrl}}/gi, `https://${hostname}${req.url}`); // ✅ hostname used here

    const html = await renderModule(AppServerModule, {
      document: injectedHtml,
      url: req.url,
      extraProviders: [
        {provide: APP_BASE_HREF, useValue: req.baseUrl},
        {provide: SSR_BUSINESS_ID, useValue: businessId},
      ],
    });


    const userAgent = req.headers['user-agent'] || '';
    console.log('👀 SSR User Agent:', userAgent);

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
  console.log('🔵 SSR FUNCTION HIT');
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

  res.render(indexHtml, {req, businessId}, (err, html) => {
    const duration = Date.now() - start;
    if (err || !html) {
      console.error('❌ SSR Render Failed:', err);
      return res.status(500).send(err?.message || 'SSR Error');
    }

    if (businessData) {
      const {metaTitle, metaDescription, metaImage, businessName} = businessData;
      console.error('❌ No business data found:', businessData);
      html = html
          .replace('</body>', `<script>window.__BUSINESS_ID__="${businessId}";</script></body>`)
          .replace(/<title>.*<\/title>/i,
              `<title>${metaTitle || businessName || 'Adult Family Home'}</title>`)

          // Standard description meta
          .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
              `<meta name="description" content="${metaDescription || ''}">`)


          // Literal replacements for template placeholders
          .replace(/{{title}}/gi, metaTitle || businessName || 'Adult Family Home')
          .replace(/{{description}}/gi, metaDescription || '')
          .replace(/{{ogTitle}}/gi, metaTitle || businessName || '')
          .replace(/{{ogDescription}}/gi, metaDescription || '')
          .replace(/{{ogImage}}/gi, metaImage || '/assets/default-og.jpg')
          .replace(/{{ogUrl}}/gi, `https://${hostname}${req.url}`)


          // Twitter meta
          .replace(/<meta\s+name="twitter:card"\s+content="[^"]*"\s*\/?>/i,
              `<meta name="twitter:card" content="summary_large_image">`)
          .replace(/<meta\s+property="twitter:domain"\s+content="[^"]*"\s*\/?>/i,
              `<meta property="twitter:domain" content="${hostname}">`)
          .replace(/<meta\s+property="twitter:url"\s+content="[^"]*"\s*\/?>/i,
              `<meta property="twitter:url" content="https://${hostname}${req.url}">`)
          .replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
              `<meta name="twitter:title" content="${metaTitle || businessName || ''}">`)
          .replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
              `<meta name="twitter:description" content="${metaDescription || ''}">`)
          .replace(/<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
              `<meta name="twitter:image" content="${metaImage || '/assets/default-og.jpg'}">`);
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
export const ssrFunction = server;
