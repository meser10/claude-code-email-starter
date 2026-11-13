// Sends one email to one recipient through the Meser 10 JSON API.
// Usage: node send-email.mjs <to> <subject> <html> <reply-to> [from-name]
const [to, subject, html, replyTo, fromName = 'My app'] = process.argv.slice(2);
const key = process.env.MESER10_API_KEY;
if (!key) { console.error('Set MESER10_API_KEY first.'); process.exit(1); }
if (!to || !subject || !html || !replyTo) { console.error('Usage: node send-email.mjs <to> <subject> <html> <reply-to> [from-name]'); process.exit(1); }

const r = await fetch('https://heb.mesereser.com/Services/JsonServices.aspx?f=SendSingleEMailMessage', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'User-Agent': 'claude-code-email-starter/1.0', ApiKey: key },
  body: JSON.stringify({ ToEMail: to, Subject: subject, Body: html, FromName: fromName, ReplyToEMail: replyTo, LinkClickCountType: '' }),
});
const text = await r.text();
let res;
try { res = JSON.parse(text); } catch { console.error('The request was blocked before it reached the API (HTTP ' + r.status + '). Check the User-Agent header and the IP allow-list of the account.'); process.exit(1); }
if (Number(res.ErrorCode) !== 0) { console.error('Not sent. ErrorCode ' + res.ErrorCode + ': ' + (res.Result || res.Message || '')); process.exit(1); }
console.log('Accepted for sending. MessageID ' + res.MessageID);
