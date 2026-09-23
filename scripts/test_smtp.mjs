import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '465', 10),
  secure: (process.env.EMAIL_PORT || '465') === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function main() {
  console.log(`Verifying SMTP connection for user: ${process.env.EMAIL_USER} ...`);
  await transporter.verify();
  console.log('✓ SMTP Connection Verified with Google Mail Servers!');

  console.log(`Dispatching live confirmation email to: ${process.env.NOTIFICATION_EMAIL} ...`);
  const info = await transporter.sendMail({
    from: `"Shekhar Birda Portfolio" <${process.env.EMAIL_USER}>`,
    to: process.env.NOTIFICATION_EMAIL,
    subject: '✦ Direct Portfolio Transmission Connected: Shekhar Birda',
    text: `Hello Shekhar,\n\nYour portfolio email notification system is now LIVE and verified!\n\nAll direct client inquiries and support tickets will now be delivered instantly to this inbox.\n\nTimestamp: ${new Date().toISOString()}`,
    html: `
      <div style="font-family: sans-serif; padding: 24px; border: 1px solid #38bdf8; border-radius: 12px; background: #030712; color: #f8fafc; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #38bdf8; margin-top: 0;">✦ Transmission Verified: Email Delivery Active!</h2>
        <p>Hello Shekhar,</p>
        <p>Your portfolio email notification pipeline is now <strong>fully operational</strong>.</p>
        <p>Whenever a client or recruiter submits a message in the <strong>Contact Modal</strong> or opens a <strong>Support Ticket</strong>, it will be delivered directly to this inbox (<strong>${process.env.NOTIFICATION_EMAIL}</strong>) as well as backed up to your live Firebase Cloud Firestore database.</p>
        <hr style="border: none; border-top: 1px solid #1e293b; margin: 20px 0;" />
        <div style="font-size: 13px; color: #94a3b8;">
          <p><strong>Configured Service:</strong> Gmail SMTP (${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT})</p>
          <p><strong>Database Connection:</strong> Firebase Firestore (shekhar-jaat-portfolio)</p>
          <p><strong>System Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `,
  });

  console.log(`✓ Email Sent Successfully! Message ID: ${info.messageId}`);
  process.exit(0);
}

main().catch((err) => {
  console.error('✗ SMTP Dispatch Failed:', err);
  process.exit(1);
});
