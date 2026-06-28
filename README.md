# Tokoscope SDK

> Audit, compress, and monitor your LLM token usage in 2 lines of code.

[![npm version](https://img.shields.io/npm/v/tokoscope?color=00E5A0&style=flat-square)](https://www.npmjs.com/package/tokoscope)
[![npm downloads](https://img.shields.io/npm/dm/tokoscope?color=00E5A0&style=flat-square)](https://www.npmjs.com/package/tokoscope)
[![License: MIT](https://img.shields.io/badge/License-MIT-00E5A0.svg?style=flat-square)](https://opensource.org/licenses/MIT)

Tokoscope sits between your app and any LLM API. It tracks every call, scores your prompts for waste, compresses bloated inputs automatically, and shows you exactly where your token budget is going.

**Works with OpenAI and Anthropic out of the box.**

---

## The problem

Most teams building on LLMs have zero visibility into token usage. No breakdown by feature. No waste detection. No alerts before costs spike. Just a monthly invoice that keeps growing.

40–70% of tokens in the average production prompt are pure waste — redundant instructions, stuffed context windows, repeated phrases the model ignores.

Tokoscope fixes that.

---

## Installation

### JavaScript
```bash
npm install tokoscope
```

### Python
```bash
pip install tokoscope
```

---

## Quick start

### OpenAI

```javascript
import OpenAI from 'openai'
import { wrap } from 'tokoscope'

const client = wrap(new OpenAI(), {
  apiKey: 'ts_live_...' // get your key at app.tokoscope.com
})

const response = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Hello' }]
})
```

### Anthropic

```javascript
import Anthropic from '@anthropic-ai/sdk'
import { wrap } from 'tokoscope'

const client = wrap(new Anthropic(), {
  apiKey: 'ts_live_...'
})

const response = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Hello' }]
})
```

### Gemini

```javascript
import { GoogleGenerativeAI } from '@google/generative-ai'
import { wrap } from 'tokoscope'

const genAI = wrap(new GoogleGenerativeAI('GEMINI_KEY'), {
  apiKey: 'ts_live_...'
})

const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
const result = await model.generateContent('Hello')
```

That's it. Every API call is now tracked automatically.

---

## Quick start

### OpenAI

```javascript
import OpenAI from 'openai'
import { wrap } from 'tokoscope'

const client = wrap(new OpenAI(), {
  apiKey: 'ts_live_...' // get your key at app.tokoscope.com
})

// All your existing calls work unchanged
const res = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Hello' }]
})
```

### Anthropic

```javascript
import Anthropic from '@anthropic-ai/sdk'
import { wrap } from 'tokoscope'

const client = wrap(new Anthropic(), {
  apiKey: 'ts_live_...'
})

const res = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Hello' }]
})
```

That's it. Every API call is now tracked automatically.

---

## What you get

Once integrated, your [Tokoscope dashboard](https://app.tokoscope.com) shows:

- **Token usage** broken down by model, endpoint, and provider
- **Cost per request** calculated automatically using current pricing
- **Waste score** for every prompt — flags redundant instructions, bloated context, and repeated phrases
- **Auto-compression** — prompts with high waste scores are automatically rewritten to their minimum effective form
- **Budget alerts** — get notified before costs spike, not after the invoice lands

---

## Real example

**Original prompt:** 113 tokens

```
Please note that it is very important that you make sure to respond 
to my question. As an AI, I want you to please make sure that you 
understand that I need you to help me. Make sure to note that what 
I am asking you is the following question which is important: 
What is the capital of France?
```

**Tokoscope compressed:** 8 tokens

```
What is the capital of France? Answer concisely.
```

**Result:** 90% token reduction. Same answer.

---

## Pricing

| Plan | Price | Tokens monitored |
|---|---|---|
| Free | $0/month | 500K tokens |
| Pro | $49/month | Unlimited |
| Team | $99/month | Unlimited + per-user attribution |

[Get started free →](https://tokoscope.com)

---

## Dashboard

Sign in at [app.tokoscope.com](https://app.tokoscope.com) to:
- Get your API key
- View live token usage and costs
- Review prompt waste scores
- See compressed vs original prompts
- Set budget alerts

---

## Supported providers

| Provider | JavaScript | Python |
|---|---|---|
| OpenAI | ✅ Supported | ✅ Supported |
| Anthropic | ✅ Supported | ✅ Supported |
| Gemini | ✅ Supported | ✅ Supported |
| Mistral | 🔜 Coming soon | 🔜 Coming soon |
| Ollama | 🔜 Coming soon | 🔜 Coming soon |

---

## License

MIT — see [LICENSE](LICENSE)

---

## Links

- [Website](https://tokoscope.com)
- [Dashboard](https://app.tokoscope.com)
- [npm package](https://www.npmjs.com/package/tokoscope)
- [Contact](mailto:hello@tokoscope.com)