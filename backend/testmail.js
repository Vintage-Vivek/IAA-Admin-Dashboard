// const nodemailer = require('nodemailer');
// require('dotenv').config();

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: Number(process.env.EMAIL_PORT),
//   secure: process.env.EMAIL_SECURE === 'true',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// transporter.sendMail({
//   from: process.env.EMAIL_USER,
//   to: 'viveksir58@gmail.com',
//   subject: 'Mail',
//   text: 'This is a test email sent from Node.js using to you.',
// }, (err, info) => {
//   if (err) {
//     console.error('Error:', err);
//   } else {
//     console.log('Email sent:', info.response);
//   }
// });
