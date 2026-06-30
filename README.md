# Tokoscope SDK

> Audit, compress, and monitor your LLM token usage in 2 lines of code.

[![npm version](https://img.shields.io/npm/v/tokoscope?color=00E5A0&style=flat-square)](https://www.npmjs.com/package/tokoscope)
[![PyPI version](https://img.shields.io/pypi/v/tokoscope?color=00E5A0&style=flat-square)](https://pypi.org/project/tokoscope/)
[![npm downloads](https://img.shields.io/npm/dm/tokoscope?color=00E5A0&style=flat-square)](https://www.npmjs.com/package/tokoscope)
[![License: MIT](https://img.shields.io/badge/License-MIT-00E5A0.svg?style=flat-square)](https://opensource.org/licenses/MIT)

Tokoscope sits between your app and any LLM API. It tracks every call, scores your prompts for waste, compresses bloated inputs automatically, caches responses semantically, and shows you exactly where your token budget is going.

**Works with OpenAI, Anthropic, and Gemini out of the box.**

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

### OpenAI (JavaScript)

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

### Anthropic (JavaScript)

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

### Gemini (JavaScript)

```javascript
import { GoogleGenerativeAI } from '@google/generative-ai'
import { wrap } from 'tokoscope'

const genAI = wrap(new GoogleGenerativeAI('GEMINI_KEY'), {
  apiKey: 'ts_live_...'
})

const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
const result = await model.generateContent('Hello')
```

### OpenAI (Python)

```python
from openai import OpenAI
from tokoscope import wrap

client = wrap(OpenAI(), api_key='ts_live_...', user_id='user_123')

response = client.chat.completions.create(
    model='gpt-4o',
    messages=[{'role': 'user', 'content': 'Hello'}]
)
```

### Anthropic (Python)

```python
from anthropic import Anthropic
from tokoscope import wrap

client = wrap(Anthropic(), api_key='ts_live_...')

response = client.messages.create(
    model='claude-sonnet-4-6',
    max_tokens=1024,
    messages=[{'role': 'user', 'content': 'Hello'}]
)
```

### Gemini (Python)

```python
import google.generativeai as genai
from tokoscope import wrap

client = wrap(genai.GenerativeModel('gemini-2.5-flash'), api_key='ts_live_...')
result = client.generate_content('Hello')
```

That's it. Every API call is now tracked automatically.

---

## Features

### 🔭 Token usage dashboard
Full visibility into token usage broken down by model, endpoint, provider, and end user. See exactly where your budget is going.

### ✂️ Automatic prompt compression
Prompts with high waste scores are automatically rewritten to their minimum effective form. Real example: 113 tokens → 8 tokens. 90% reduction. Same answer.

### ⚡ Semantic caching
Two-layer caching system:
- **Exact match** — identical prompts return cached responses instantly
- **Semantic match** — similar prompts (85%+ similarity) return cached responses using OpenAI embeddings

```
⚡ Tokoscope cache hit [semantic (89.3% match)] — saved 93 tokens ($0.000049)
```

Cache TTL: 7 days. Clear cache anytime from the dashboard.

### 📊 Cost attribution
Break down spend by feature, endpoint, user, or team. Know which part of your product is burning the most — and why.

### 👤 Per-user tracking
Pass a `userId` to track token usage per end user of your app:

```javascript
// JavaScript
const client = wrap(new OpenAI(), {
  apiKey: 'ts_live_...',
  userId: 'user_123'
})
```

```python
# Python
client = wrap(OpenAI(), api_key='ts_live_...', user_id='user_123')
```

### 🚨 Budget alerts
Set monthly spend thresholds. Get emailed before costs spike, not after the invoice lands.

### 🔌 Async support (Python)
Full async support for OpenAI and Anthropic:

```python
response = await client.chat.completions.acreate(
    model='gpt-4o',
    messages=[{'role': 'user', 'content': 'Hello'}]
)
```

### 📡 Streaming support (JavaScript, OpenAI)
Streaming responses are tracked automatically. Chunks pass through unchanged to your application, and token usage is captured once the stream completes:

```javascript
const stream = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Hello' }],
  stream: true
})

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '')
}
// Tracking fires automatically once the stream ends
```

Note: streaming responses skip the cache lookup and are not cached in this version.

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

## Supported providers

| Provider | JavaScript | Python |
|---|---|---|
| OpenAI | ✅ v0.5.0+ | ✅ v0.6.0+ |
| Anthropic | ✅ v0.5.0+ | ✅ v0.6.0+ |
| Gemini | ✅ v0.4.0+ | ✅ v0.4.0+ |
| Mistral | 🔜 Coming soon | 🔜 Coming soon |
| Ollama | 🔜 Coming soon | 🔜 Coming soon |

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
- Review prompt waste scores and compressed versions
- See per-user token breakdown
- Monitor cache hit rate and savings
- Set budget alerts

---

## Changelog

### v0.6.0 (JavaScript)
- Streaming support for OpenAI — chunks pass through unchanged, usage tracked on stream completion

### v0.6.0 (Python)
- Semantic caching with OpenAI embeddings
- Async support via `acreate()`
- Cache hit logging with similarity scores

### v0.5.0
- Semantic caching (85%+ similarity threshold)
- Two-layer cache: exact match + semantic match
- Cache hit type shown in console logs

### v0.4.0
- Gemini support (JavaScript + Python)
- Gemini pricing for all models

### v0.3.0
- 7-day exact match caching
- Cache hit rate and savings on dashboard
- Clear cache from settings

### v0.2.0
- Per-user token tracking via `userId`
- Users page in dashboard

### v0.1.0
- Initial release
- OpenAI + Anthropic support
- Token tracking, waste scoring, prompt compression

---

## License

MIT

---

## Links

- [Website](https://tokoscope.com)
- [Dashboard](https://app.tokoscope.com)
- [npm package](https://www.npmjs.com/package/tokoscope)
- [PyPI package](https://pypi.org/project/tokoscope/)
- [Contact](mailto:hello@tokoscope.com)