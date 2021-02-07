import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, html: string) => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'zrexrndqrt7tk7rd@ethereal.email', // generated ethereal user
      pass: '47zvSU57HdHWcVUHMz', // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: '"NAGAI" <foo@example.com>', // sender address
    to: to, // list of receivers
    subject: 'Registration Successful', // Subject line
    html: html,
  });

  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};
