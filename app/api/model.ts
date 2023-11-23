import OpenAI from "openai";

const openai = new OpenAI({
  organization: "org-W8xIMQfeLUS1B1uTQgtt6EQM",
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.BASE_URL,
});
export default openai;