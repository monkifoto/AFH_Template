// functions/sendContactEmail.ts
import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';
import cors from 'cors';

const corsHandler = cors({origin: true});

const domainKeyMap: Record<string, string> = {
  'helpinghandafh.com': 'helpinghand',
  'aefamilyhome.com': 'aefamilyhome',
  'sbmediahub.com': 'sbmediahub',
  'countrycrestafh.com': 'countrycrest',
  'prestigecareafh.com': 'prestigecare',
};

const getTransporterForDomain = (domain: string): nodemailer.Transporter => {
  const key = domainKeyMap[domain] || 'default';
  const user = functions.config().email?.[key]?.user;
  const pass = functions.config().email?.[key]?.pass;

  return nodemailer.createTransport({
    service: 'Gmail',
    auth: {user, pass},
  });
};

export const sendContactEmail = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const {name, email, message, website} = req.body;

    if (!email || !name || !message || !website) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, email, or message.',
      });
    }

    const domain = website || '';
    const key = domainKeyMap[domain] || 'default';
    const user = functions.config().email?.[key]?.user;

    try {
      const transporter = getTransporterForDomain(domain);

      const mailOptions = {
        from: user,
        to: user,
        bcc: 'monkifoto@gmail.com',
        subject: `Contact Email from ${domain}`,
        text: `You have a new message from:\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
      };

      await transporter.sendMail(mailOptions);
      return res.status(200).json({success: true, message: 'Email sent successfully'});
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({success: false, message: 'Error sending email', error});
    }
  });
});
