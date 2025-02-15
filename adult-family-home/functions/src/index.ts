import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';
import * as cors from 'cors';

// Configure CORS middleware to allow requests from any origin
const corsHandler = cors({origin: true});

// Domain-to-credentials mapping
const domainToTransporterConfig: Record<string,
{user: string; pass: string}> = {
  'helpinghandafh.com': {
    user: 'helpinghand99.afh@gmail.com',
    pass: 'ylcg rmnn aoqk ymow',
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
    pass: 'xemf vinl sfub dbez'},
};

// Default credentials
const defaultTransporterConfig = {
  user: 'sorin.bucse@gmail.com',
  pass: 'ybdv kmuc ciox nifm',
};

// Function to get the appropriate transporter for a domain
const getTransporterForDomain = (domain: string): nodemailer.Transporter => {
  const config = domainToTransporterConfig[domain] ||
   defaultTransporterConfig;

  return nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
};

export const sendContactEmail = functions.https.onRequest((req, res) => {
  corsHandler(req, res, () => {
    const {name, email, message, website} = req.body;

    if (!email || !name || !message || !website) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, email, or message.',
      });
    }

    // Extract domain from the website URL
    const domain: string = website || '';

    const transporter = getTransporterForDomain(domain);

    const mailOptions = {
      from: domainToTransporterConfig[domain]?.user ||
       defaultTransporterConfig.user,
      to: domainToTransporterConfig[domain]?.user ||
       defaultTransporterConfig.user,
      bcc: 'monkifoto@gmail.com',
      subject: `Contact Email from ${domain}`,
      text: `You have a new message from:
      Name: ${name}
      Email: ${email}
      Message: ${message}`,
    };

    return transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({
          success: false,
          message: 'Error sending email',
          error,
        });
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).json({
          success: true,
          message: 'Email sent successfully',
        });
      }
    });
  });
});
