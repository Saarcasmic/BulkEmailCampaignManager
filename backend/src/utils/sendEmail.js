const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendSingleEmail(to, subject, content, campaignId) {
  const msg = {
    to,
    from: 'saaragrawal_it21a10_27@dtu.ac.in',
    subject,
    html: content,
    customArgs: { campaignId },
  };
  return sgMail.send(msg);
}

async function sendBulkEmail(recipients, subject, content, campaignId) {
  const messages = recipients.map((to) => ({
    to,
    from: 'saaragrawal_it21a10_27@dtu.ac.in',
    subject,
    html: content,
    customArgs: { campaignId },
  }));
  return sgMail.send(messages);
}

module.exports = { sendSingleEmail, sendBulkEmail }; 