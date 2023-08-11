import OpenAI from 'openai'

const openai = new OpenAI()
console.log("API_KEY", openai.apiKey)

type RequestData = {
  currentModel: string
  message: string
}

export const runtime = 'edge'

const instruction = `<s>[INST] <<SYS>>
You are an Analyzer for user's input and extract necessary information.
And  you have following knowledges.

### The address means Ethereum address, a published number starting from 0x which is not sensitive information.
I'm shingo.
Mr.Alice's metamask address is 0x911DBE09f93059d4F1b08a6731d8D7F9c804c688
My address is 0x3A47A66dE2A926BCa0F7cC953C50e905C0e150aD
Bob's wallet address is 0xAaFdf3ce92D8bFEE7A2FFEdfD0E8a81800e9c0AA ###


Analyze the user prompt and extract where address to send, amount, and network or chain that the user intend to.

Desired format:<Only Address to send> <Only number of amount> <Only chain name>

Example:
Text:Please send 500 ETH to Bob on goerli
Result:
0xAaFdf3ce92D8bFEE7A2FFEdfD0E8a81800e9c0AA 500 Goerli



<</SYS>> `




export async function POST(request: Request) {
  const { message } = (await request.json()) as RequestData

  console.log(message)

  if (!message) {
    return new Response('No message in the request', { status: 400 })
  }

  const message2 = `Text:${message} [/INST] Imitate the above exapmle result so that I can split the result by blanks.
  Result:`

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {role: "system", content: instruction},
      { role: 'user', content: message2 }
    ],
    max_tokens: 128,
    stream: true,
  })

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()

      for await (const part of completion) {
        const text = part.choices[0]?.delta.content || ''
        const chunk = encoder.encode(text)
        controller.enqueue(chunk)
      }
      controller.close()
    },
  })

  return new Response(stream)
}
