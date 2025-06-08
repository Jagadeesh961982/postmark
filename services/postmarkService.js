import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,           // Your Gmail address
    pass: process.env.GMAIL_APP_PASSWORD    // App-specific password
  }
});

// console.log("✅ Nodemailer transporter initialized");

export async function sendReply(subject, userEmail, replyText) {
  // console.log("📧 Sending reply with nodemailer...", { subject, userEmail });

  try {
    const info = await transporter.sendMail({
      from: `feedbacksonlinestore@gmail.com`,
      to: userEmail,
      subject: "Re: " + subject,
      text: replyText
    });

  } catch (err) {
    console.error("❌ Error sending email:", err.message);
  }
}

