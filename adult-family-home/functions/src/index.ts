import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';
import * as cors from 'cors';

// Configure CORS middleware to allow requests from any origin
const corsHandler = cors({origin: true});

// Configure the email transport using the
// default SMTP transport and a Gmail account.
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'helpinghand99.afh@gmail.com',
    pass: 'ylcg rmnn aoqk ymow',
    // pass: 'ywwu joug obdw ewzr',
    // firebase functions:config:set gmail.email="helpinghand99.afh@gmail.com"
    // gmail.password="ylcg rmnn aoqk ymow"
  },
});

// Create and deploy the Firebase function with CORS support
export const sendContactEmail = functions.https.onRequest((req, res) => {
  corsHandler(req, res, () => {
    const {name, email, message} = req.body;

    const mailOptions = {
      from: 'helpinghand99.afh@gmail.com',
      to: 'helpinghand99.afh@gmail.com',
      bcc: 'monkifoto@gmail.com',
      subject: 'Helping Hand Email',
      text: `You have a new message from:
      Name: ${name}
      Email: ${email}
      Message: ${message}`,
    };

    return transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({success: false,
          message: 'Error sending email', error});
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).json({success: true,
          message: 'Email sent successfully'});
      }
    });
  });
});
