import dotenv from 'dotenv';
dotenv.config();

import { emailService } from '../src/lib/email/emailService.js';

async function testService() {
  console.log('EmailService status:', emailService.getStatus());
  const res = await emailService.sendEmail({
    to: process.env.NOTIFICATION_EMAIL || 'shekharjaat751@gmail.com',
    subject: '[Inquiry Test] Senior React Native & 3D WebGL Lead Architect',
    text: 'Test inquiry through EmailService abstraction.',
    html: '<p>Direct inquiry simulation test through EmailService.</p>'
  });
  console.log('Result:', res);
}

testService().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
