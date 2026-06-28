const TRACK_ENDPOINT = 'https://us-central1-tokoscope-e8ab2.cloudfunctions.net/trackEvent'
const CACHE_ENDPOINT = 'https://us-central1-tokoscope-e8ab2.cloudfunctions.net/checkCache'

function wrap(client, { apiKey, userId = null }) {
  if (!apiKey) throw new Error('Tokoscope: apiKey is required')

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  }

  async function checkCache(prompt, model) {
    try {
      const res = await fetch(CACHE_ENDPOINT, {
        method: 'POST',
        headers,
        body: JSON.stringify({ prompt, model })
      })
      return await res.json()
    } catch (e) {
      return { hit: false }
    }
  }

  async function track({ provider, model, inputTokens, outputTokens, prompt, endpoint, response }) {
    try {
      await fetch(TRACK_ENDPOINT, {
        method: 'POST',
        headers,
        body: JSON.stringify({ provider, model, inputTokens, outputTokens, prompt, endpoint, endUserId: userId, response })
      })
    } catch (e) {
      // Silent fail
    }
  }

  const isAnthropic = typeof client.messages?.create === 'function' && !client.chat

  if (isAnthropic) {
    const originalCreate = client.messages.create.bind(client.messages)
    client.messages.create = async function(params) {
      const prompt = params.messages?.map(m => typeof m.content === 'string' ? m.content : '').join(' ')

      const cache = await checkCache(prompt, params.model)
      if (cache.hit) {
        console.log(`⚡ Tokoscope cache hit — saved ${cache.savedTokens} tokens ($${cache.savedCost?.toFixed(6)})`)
        return cache.response
      }

      const result = await originalCreate(params)
      await track({
        provider: 'anthropic',
        model: params.model,
        inputTokens: result.usage?.input_tokens || 0,
        outputTokens: result.usage?.output_tokens || 0,
        prompt,
        endpoint: params.model,
        response: result
      })
      return result
    }
  } else {
    const originalCreate = client.chat.completions.create.bind(client.chat.completions)
    client.chat.completions.create = async function(params) {
      const prompt = params.messages?.map(m => m.content || '').join(' ')

      const cache = await checkCache(prompt, params.model)
      if (cache.hit) {
        console.log(`⚡ Tokoscope cache hit — saved ${cache.savedTokens} tokens ($${cache.savedCost?.toFixed(6)})`)
        return cache.response
      }

      const result = await originalCreate(params)
      await track({
        provider: 'openai',
        model: params.model,
        inputTokens: result.usage?.prompt_tokens || 0,
        outputTokens: result.usage?.completion_tokens || 0,
        prompt,
        endpoint: params.model,
        response: result
      })
      return result
    }
  }

  return client
}

module.exports = { wrap }