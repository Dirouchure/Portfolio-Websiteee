const nodemailer = require('nodemailer');

const isMailConfigured = () => {
  return Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  );
};

const getMailTo = async (db) => {
  if (process.env.MAIL_TO) {
    return process.env.MAIL_TO;
  }

  try {
    const [rows] = await db.query('SELECT email FROM profile LIMIT 1');
    if (rows[0]?.email) {
      return rows[0].email;
    }
  } catch (error) {
    console.warn('Could not fetch profile email for notifications:', error.message);
  }

  return 'dirouchure@gmail.com';
};

const createTransporter = () => {
  if (!isMailConfigured()) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendContactNotification = async ({ name, email, subject, message }, db) => {
  if (!isMailConfigured()) {
    console.warn('Email not configured — contact saved to database only. Set SMTP_* vars in .env to enable notifications.');
    return { sent: false, reason: 'not_configured' };
  }

  const transporter = createTransporter();
  const mailTo = await getMailTo(db);
  const mailFrom = process.env.MAIL_FROM || process.env.SMTP_USER;
  const timestamp = new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' });
  const subjectLine = subject || '(No subject)';

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${mailFrom}>`,
      to: mailTo,
      replyTo: email,
      subject: `[Portfolio] New message from ${name}: ${subjectLine}`,
      text: [
        'New contact form submission',
        '',
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subjectLine}`,
        `Received: ${timestamp}`,
        '',
        'Message:',
        message,
      ].join('\n'),
      html: `
        <h2>New Contact Form Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Subject:</strong> ${subjectLine}</p>
        <p><strong>Received:</strong> ${timestamp}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    return { sent: true };
  } catch (error) {
    console.error('Failed to send contact notification email:', error.message);
    return { sent: false, reason: 'send_failed', error: error.message };
  }
};

const sendContactAutoReply = async ({ name, email }) => {
  if (!isMailConfigured() || process.env.MAIL_AUTO_REPLY === 'false') {
    return { sent: false };
  }

  const transporter = createTransporter();
  const mailFrom = process.env.MAIL_FROM || process.env.SMTP_USER;

  try {
    await transporter.sendMail({
      from: `"Diro Uchure" <${mailFrom}>`,
      to: email,
      subject: 'Thanks for reaching out!',
      text: [
        `Hi ${name},`,
        '',
        'Thank you for contacting me through my portfolio website.',
        'I have received your message and will get back to you as soon as possible.',
        '',
        'Best regards,',
        'Diro Uchure',
      ].join('\n'),
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for contacting me through my portfolio website.</p>
        <p>I have received your message and will get back to you as soon as possible.</p>
        <p>Best regards,<br>Diro Uchure</p>
      `,
    });

    return { sent: true };
  } catch (error) {
    console.error('Failed to send auto-reply email:', error.message);
    return { sent: false };
  }
};

module.exports = {
  isMailConfigured,
  sendContactNotification,
  sendContactAutoReply,
};
