# Claude Code + Meser 10: email starter

Build your own email logic with Claude Code and send through [Meser 10](https://www.meser10.co.il/integrations/claude-code/): one API call for an email, one for an SMS, and an MCP server that lets Claude Code work with your account.

You keep the templates, the automations and the logic. Meser 10 does the sending.

## What is in this repo

| File | What it does |
|---|---|
| `CLAUDE.md` | Rules Claude Code reads before it writes code against the Meser 10 API |
| `send-email.mjs` | Sends one email to one recipient through the JSON API |
| `send-sms.mjs` | Sends one SMS through the JSON API |
| `mcp.example.json` | Copy it to `.mcp.json` to connect the Meser 10 MCP server to Claude Code, read-only |
| `.env.example` | The environment variables the scripts read |

## Before you start

1. Open a Meser 10 account: https://www.meser10.co.il/
2. Issue an API key in the account: My account, Advanced settings, API settings.
3. Node.js 18 or later.

No key is stored in this repo. The scripts read `MESER10_API_KEY` from the environment.

## Send an email

```bash
export MESER10_API_KEY=your-key
node send-email.mjs person@example.com "Hello" "<p>It works.</p>" reply@yourdomain.com
```

The call sends one message to one recipient. It has no attachments, CC or BCC. Sending to lists, campaigns and reports are available through the SOAP service and through the MCP server.

Before you send from your own domain, set its SPF, DKIM and DMARC records. A free check: https://www.meser10.co.il/tools/domain-ready/

## Send an SMS

```bash
node send-sms.mjs 050XXXXXXX "Your appointment is tomorrow at 10:00" MyShop
```

The sender name has to be verified in your account before the first SMS. Until then the call returns `ErrorCode 4`.

## Connect the MCP server to Claude Code

Copy `mcp.example.json` to `.mcp.json`, set the two variables and start Claude Code in the folder:

```bash
cp mcp.example.json .mcp.json
export MESER10_API_KEY=your-key
export MESER10_USER_ID=your-account-number
claude
```

Or add it yourself:

```bash
claude mcp add --env MESER10_API_KEY=your-key --env MESER10_USER_ID=your-account-number \
  --env MESER10_MODE=read --transport stdio meser10 -- npx -y @meser10/mcp-server@1.0.2
```

The server starts read-only. Writing, sending and deleting are separate levels that you open yourself. Details: https://www.meser10.co.il/features/mcp-server/ and https://github.com/meser10/meser10-mcp

## Good to know

- The API answers HTTP 200 also when a call fails. Only `ErrorCode` says what happened. `0` is success.
- Send your own `User-Agent` header. Without one the request can be blocked with a 403 before it reaches the API.
- `ReplyToEMail` is required when sending an email.
- A recipient who unsubscribes stops receiving mail from your account, including sends made through the API.
- Dates in API responses are Israel time without a time zone.

Docs: https://www.meser10.co.il/api-docs/ · OpenAPI spec: https://www.meser10.co.il/api-docs/meser10-json-api.json

## License

MIT
