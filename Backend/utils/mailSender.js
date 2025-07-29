const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,      // your email
        pass: process.env.MAIL_PASS,      // your app password
      },
    });

  let info = await transporter.sendMail({
  from: 'simranarora7566@gmail.com',
  to: email,
  subject: title,
  html: body,
});


    console.log("Mail sent →", info.messageId);
    return info;
  } catch (error) {
    console.error("Mail send failed →", error.message);
    throw error;
  }
};

module.exports = mailSender;
