const ENDPOINT = 'https://us-central1-tokoscope-e8ab2.cloudfunctions.net/trackEvent'

function wrap(client, { apiKey, userId = null }) {
  if (!apiKey) throw new Error('Tokoscope: apiKey is required')

  async function track({ provider, model, inputTokens, outputTokens, prompt, endpoint }) {
    try {
      await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({ provider, model, inputTokens, outputTokens, prompt, endpoint, endUserId: userId })
      })
    } catch (e) {
      // Silent fail — never break the main app
    }
  }

  const isAnthropic = typeof client.messages?.create === 'function' && !client.chat

  if (isAnthropic) {
    const originalCreate = client.messages.create.bind(client.messages)
    client.messages.create = async function(params) {
      const result = await originalCreate(params)
      const prompt = params.messages?.map(m => typeof m.content === 'string' ? m.content : '').join(' ')
      await track({
        provider: 'anthropic',
        model: params.model,
        inputTokens: result.usage?.input_tokens || 0,
        outputTokens: result.usage?.output_tokens || 0,
        prompt,
        endpoint: params.model
      })
      return result
    }
  } else {
    const originalCreate = client.chat.completions.create.bind(client.chat.completions)
    client.chat.completions.create = async function(params) {
      const result = await originalCreate(params)
      const prompt = params.messages?.map(m => m.content || '').join(' ')
      await track({
        provider: 'openai',
        model: params.model,
        inputTokens: result.usage?.prompt_tokens || 0,
        outputTokens: result.usage?.completion_tokens || 0,
        prompt,
        endpoint: params.model
      })
      return result
    }
  }

  return client
}

module.exports = { wrap }