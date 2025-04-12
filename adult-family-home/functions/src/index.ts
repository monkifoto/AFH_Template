import * as functions from 'firebase-functions';
import {ssr} from './ssr';
import {sendContactEmail} from './sendContactEmail';

exports.ssrFunction = functions.https.onRequest(ssr);

exports.sendContactEmail = functions.https.onRequest(sendContactEmail);
