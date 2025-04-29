import configList from '../config/index';
import { transporter } from './mailer.config';

export const sendMail = async (to: string, subject: string, html: string) => {
  const mailOptions = {
    from: configList.owner_mail,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
