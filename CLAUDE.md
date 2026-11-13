# Sending through Meser 10

This project sends email and SMS through the Meser 10 JSON API. Follow these rules when you write or change sending code.

## The API

- Base: `POST https://heb.mesereser.com/Services/JsonServices.aspx?f=<FunctionName>`
- Headers on every call: `Content-Type: application/json`, `ApiKey: <key>`, and a `User-Agent` of our own (for example `my-app/1.0`). A request without a custom User-Agent can get a 403 or an "error code 1010" page that is not JSON.
- The key comes from the environment variable `MESER10_API_KEY`. Never write a key into a file, a commit, a log line or an error message.
- The full contract is the OpenAPI spec: https://www.meser10.co.il/api-docs/meser10-json-api.json . Read it before adding a call that is not in this file.

## Reading the answer

- Every call returns HTTP 200, also when it failed. Decide by `ErrorCode` only. Normalize it with `Number()` first: some functions return it as a string. A missing or empty `ErrorCode` is a failure, not a success.
- `0` success. `1` key wrong, missing or revoked: stop, do not retry in a loop. `3` payload could not be processed, most often a missing required field. `4` a parameter is missing or invalid; for SMS it also means the sender name is not verified. `6` unknown function name.
- If the body is not JSON, treat it as a blocked request (User-Agent or IP allow-list), not as an API answer.

## Email: SendSingleEMailMessage

Fields: `ToEMail`, `Subject`, `Body` (HTML, UTF-8), `FromName` (display name only), `ReplyToEMail` (required), `LinkClickCountType` (empty string is fine).

- One recipient per call. No CC, no BCC, no attachments, no custom From address: the From address comes from the verified domain in the account.
- For Hebrew content wrap the body in `<div dir="rtl">`.
- Do not build an unsubscribe check: a recipient who unsubscribed is skipped by the platform, also for API sends.

## SMS: SendSingleSmsMessage

Fields: `ToPhone`, `MessageBody`, `FromName`.

- `FromName`: up to 11 characters, Latin letters, digits and space, at least one letter, and it must be verified in the account.
- An SMS sent through the API has no unsubscribe link.

## Sending to many people

Do not loop the single-message call over a list for marketing mail. Lists, campaigns and reports go through the Meser 10 MCP server (see `mcp.example.json`, read-only by default) or the SOAP service.

Before any real send, also to one person, show me the text and the recipients and wait for my yes.

## Dates

Date fields in responses are ISO 8601 without a time zone and are always Israel time. Parse them as `Asia/Jerusalem`.
