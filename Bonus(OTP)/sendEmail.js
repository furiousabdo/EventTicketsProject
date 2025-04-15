//Bonus part (OTP)
import nodemailer from "nodemailer";

const sendEmail = async (email, subject, message) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Event Ticketing" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html: message,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
