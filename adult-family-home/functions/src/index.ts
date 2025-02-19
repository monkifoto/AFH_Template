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

// Dynamic Metadata Handling (SEO Meta Tags)
const businessMetadata: Record<string, {title: string; description: string}> = {
  'helpinghandafh.com': {
    title: 'Helping Hand AFH - Quality Care',
    description: 'Providing exceptional adult family home care services.',
  },
  'countrycrestafh.com': {
    title: 'Country Crest AFH - Quality Care',
    description: 'Providing exceptional adult family home care services.',
  },
  'aefamilyhome.com': {
    title: 'AE Family Home - Trusted Care',
    description: 'Caring for your loved ones with dedication.',
  },
  'sbmediahub.com': {
    title: 'SB Media Hub - Digital Solutions',
    description: 'Helping small businesses grow with digital marketing.',
  },
  'default': {
    title: 'Welcome to Our Platform',
    description: 'Find the best services for your needs.',
  },
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

export const handleSeoMetadata = functions.https.onRequest((req, res) => {
  corsHandler(req, res, () => {
    const hostname = req.hostname;
    const metadata = businessMetadata[hostname] || businessMetadata.default;

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${metadata.title}</title>
        <meta name="description" content="${metadata.description}">
        <meta property="og:title" content="${metadata.title}">
        <meta property="og:description" content="${metadata.description}">
        <meta property="og:image" content="https://example.com/your-image.jpg">
        <meta property="og:url" content="https://${hostname}">
        <meta name="twitter:title" content="${metadata.title}">
        <meta name="twitter:description" content="${metadata.description}">
        <meta name="twitter:image" content="https://example.com/your-image.jpg">
    </head>
    <body>
        <h1>${metadata.title}</h1>
        <p>${metadata.description}</p>
    </body>
    </html>`;

    res.status(200).send(html);
  });
});
