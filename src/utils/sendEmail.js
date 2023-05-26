const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtplw.com.br',
  port: 123,
  auth: {
    user: '',
    pass: '',
  },
});

module.exports = function sendEmail(message) {
  try {
    const info = transporter.sendMail(message);

    console.log('sendEmail | URL: ', nodemailer.getTestMessageUrl(info));

    return info;
  } catch (error) {
    console.log('sendEmail | error: ', error);
    return error;
  }
};
