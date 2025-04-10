
import * as functions from 'firebase-functions';
import * as express from 'express';
import * as nodemailer from 'nodemailer';
import { join } from 'path';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { AppServerModule } from '../dist/adult-family-home/server/main';
import { existsSync } from 'fs';

// ---------- SSR SETUP ----------
const app = express();
const distFolder = join(process.cwd(), 'dist/adult-family-home/browser');
const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index.html';

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModule,
}));

app.set('view engine', 'html');
app.set('views', distFolder);

// Serve static files
app.get('*.*', express.static(distFolder, {
  maxAge: '1y'
}));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render(indexHtml, { req });
});

export const ssr = functions.https.onRequest(app);

// ---------- EMAIL FUNCTION ----------
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.pass
  }
});

export const sendEmail = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const { to, subject, text } = req.body;

  try {
    const info = await transporter.sendMail({
      from: `"AFH Website" <${functions.config().email.user}>`,
      to,
      subject,
      text
    });
    res.status(200).send(`Email sent: ${info.messageId}`);
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send email');
  }
});
