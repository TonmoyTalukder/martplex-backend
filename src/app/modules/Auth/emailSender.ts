import nodemailer from 'nodemailer';
import config from '../../config';

const emailSender = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: config.emailSender.email,
      pass: config.emailSender.app_pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: '"MartPlex Server" <tonmoytalukder.ai@gmail.com>', // sender address
    replyTo: '"Tonmoy Talukder" <tonmoytalukder2000@gmail.com>',
    to: email, // list of receivers
    subject: 'RESET PASSWORD LINK', // Subject line
    text: 'Reset your password within 10 minutes.', // plain text body
    html, // html body
  });

  console.log('Message sent: %s', info.messageId);
};

export default emailSender;
