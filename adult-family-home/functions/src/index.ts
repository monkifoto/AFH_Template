import * as functions from 'firebase-functions';
import {ssr} from './ssr';
import {sendContactEmail} from './sendContactEmail';

console.log('✅ Exporting SSR and email functions');

exports.ssrFunction = functions.https.onRequest(ssr);
exports.sendContactEmail = functions.https.onRequest(sendContactEmail);
