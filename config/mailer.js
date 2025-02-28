const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

const forgotMessage = ({ name, email, token }) => ({
  from: process.env.SMTP_USERNAME,
  to: email,
  subject: "VideoTarget Password Reset",
  text: `Hi ${name}, You recently requested to reset the password for your VideoTarget account. Go to this link to proceed: ${process.env.CLIENT_URL}/password/reset?token=${token}`,
  html: `
    <h4 style="margin-top: 30px; margin-bottom: 0">Hi ${name},</h4>
    <p>
      You recently requested to reset the password for your VideoTarget account. Click the button below to
      proceed.
    </p>
      <a href="${process.env.CLIENT_URL}/reset?token=${token}" style="margin: 30px 0px;  background-color: #212529;padding: 12px 24px;color: white;text-decoration: none;border-radius: 5px;">Reset Password</a>
    <p style="color: dimgray">
      <small>
        If you did not request a password reset, please ignore this email or reply to let us know. This password reset
        link is only valid for the next one hour.
      </small>
    </p>`,
});

const sendForgotMail = (options, callback) => transporter.sendMail(forgotMessage(options), callback);

module.exports = sendForgotMail;
