// Sends one SMS through the Meser 10 JSON API. The sender name must be verified in the account.
// Usage: node send-sms.mjs <phone> <text> <sender-name>
const [phone, body, sender] = process.argv.slice(2);
const key = process.env.MESER10_API_KEY;
if (!key) { console.error('Set MESER10_API_KEY first.'); process.exit(1); }
if (!phone || !body || !sender) { console.error('Usage: node send-sms.mjs <phone> <text> <sender-name>'); process.exit(1); }

const r = await fetch('https://heb.mesereser.com/Services/JsonServices.aspx?f=SendSingleSmsMessage', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'User-Agent': 'claude-code-email-starter/1.0', ApiKey: key },
  body: JSON.stringify({ ToPhone: phone, MessageBody: body, FromName: sender }),
});
const text = await r.text();
let res;
try { res = JSON.parse(text); } catch { console.error('The request was blocked before it reached the API (HTTP ' + r.status + '). Check the User-Agent header and the IP allow-list of the account.'); process.exit(1); }
const ec = res ? res.ErrorCode : undefined;
if (ec === undefined || ec === null || ec === '' || Number(ec) !== 0) { console.error('Not sent. ErrorCode ' + res.ErrorCode + ': ' + (res.Message || res.Result || '')); process.exit(1); }
console.log('Accepted for sending.');
