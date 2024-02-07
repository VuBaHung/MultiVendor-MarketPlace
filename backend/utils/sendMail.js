const nodemailer = require("nodemailer");

const sendMail = async (option) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });
  const mailOption = {
    from: process.env.SMPT_MAIL,
    to: option.email,
    subject: option.subject,
    text: option.message,
  };
  await transporter.sendMail(mailOption);
};
module.exports = sendMail;
