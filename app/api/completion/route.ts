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
        role: 'system',
        content: `
        现在你是前端资深工程师，而且是中英文翻译专家，你的工作是翻译一篇英文文章，除此之外，你还要对文章进行一些修改，使得它更符合中文读者的阅读习惯。
        但是不要回答任何其他问题。
        接下来我会给你一片markdown格式的文章，里面包含了前端相关的内容，请你帮我翻译成中文，翻译时请遵循以下要求：

        1. 将 . , ' " 变成中文的标点符号
        2. 不要处理这些符号 []*() 也不要在前面加转一
        3. 不要翻译 url_placeholder_ 开头的字符，他们是链接占位符
        4. 不能影响markdown格式
        5. 不要翻译专用词汇
        6. 不要翻译链接
        7. 中英文要留出一个空格
        8. 不要用“您”，用“你”：
        ${prompt}`
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