import * as functions from 'firebase-functions';
// import {ssrFunction} from '../../in work/ssr';
import {sendContactEmail} from './sendContactEmail';

console.log('✅ Exporting SSR and email functions');

// exports.ssrFunction = functions.https.onRequest(ssrFunction);
exports.sendContactEmail = functions.https.onRequest(sendContactEmail);
