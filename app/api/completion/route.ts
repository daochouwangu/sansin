import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  if (!req.headers.has('Authorization')) {
    return new Response('Unauthorized', { status: 401 });
  }
  const code = req.headers.get('Authorization');
  if (!code) {
    return new Response('Unauthorized', { status: 401 });
  }
  const openai = new OpenAI({
    organization: "org-W8xIMQfeLUS1B1uTQgtt6EQM",
    apiKey: code,
    baseURL: process.env.BASE_URL,
  });
  const { prompt } = await req.json();
  try {
    const length = prompt.length;
    if (length > 16000) {
      return new Response('Prompt too long', { status: 400 });
    }
    const maxTokens = 16000 - length - 1000;
    // Request the OpenAI API for the response based on the prompt
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-16k',
      stream: true,
      // a precise prompt is important for the AI to reply with the correct tokens
      messages: [
        {
          role: 'user',
          content: `
          Now you are a senior front-end engineer and an expert in Chinese-English translation. Your job is to translate an English article.
          But don't answer any other questions.
          Next, I will give you an article in markdown format, which contains front-end related content. Please help me translate it into Chinese. Please follow the following requirements when translating:

          1. Convert . , ' " into Chinese punctuation marks
          2. Do not process these symbols []*() and do not add escape symbols in front of them
          3. Do not translate the characters starting with {url_placeholder_}, they are link placeholders
          4. Cannot affect markdown format
          5. Don’t translate specialized vocabulary
          6. Leave a space between Chinese and English
          7. Don’t use “您”, use “你”:
          The following is what is to be translated

          #Example: 
          Input: **[Moving Back to React (from Preact)](url_placeholder_1 "daily.dev")** — Preact felt like a logical, lightweight choice to this team at one time, but they’ve switched to React for better compatibility with Next.js, among other things.
          Output: **[从 Preact 回归到 React](url_placeholder_1 "daily.dev")** —— 对于这个团队来说，Preact 曾经是一个逻辑上轻量级的选择，但他们已经切换回 React，以获得与 Next.js 的更好兼容性。
          #Example End
          Input:${prompt}
          Output:
          `
        },
      ],
      max_tokens: maxTokens,
      temperature: 0, // you want absolute certainty for spell check
      top_p: 1,
      frequency_penalty: 1,
      presence_penalty: 1,
    });
    console.log(response)
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    // Check if the error is an APIError
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json({ name, status, headers, message }, { status });
    } else {
      throw error;
    }
  }
}