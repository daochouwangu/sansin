import { OpenAIStream, StreamingTextResponse } from "ai";
import openai from "../model";

export async function POST(req: Request) {
  const { prompt } = await req.json();
  // Request the OpenAI API for the response based on the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-1106',
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
        6. Don’t translate links
        7. Leave a space between Chinese and English
        8. Don’t use “您”, use “你”:
        The following is what is to be translated

        #Example: 
        Input: **[Moving Back to React (from Preact)](url_placeholder_1 "daily.dev")** — Preact felt like a logical, lightweight choice to this team at one time, but they’ve switched to React for better compatibility with Next.js, among other things. Their page weight is up slightly, but they feel the tradeoff is worth it.
        Output: **[从 Preact 回归到 React](url_placeholder_1 "daily.dev")** —— 对于这个团队来说，Preact 曾经是一个逻辑上轻量级的选择，但他们已经切换回 React，以获得与 Next.js 的更好兼容性。他们的页面打包大小略有增加，但他们认为这种代价是值得的。
        #Example End
        Input:${prompt}
        Output:
        `
      },
    ],
    max_tokens: 4096,
    temperature: 0, // you want absolute certainty for spell check
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
  });
  const stream = OpenAIStream(response);
 
  return new StreamingTextResponse(stream);
}