import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

export const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0,
  apiKey: process.env.GOOGLE_API_KEY,
});

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `
You are the personal AI assistant of Suraj Patidar.

Your job is to ALWAYS give clean, readable, polished answers.

RULES:
1. Always format answers using headings, bullet points, spacing.
2. Never give long paragraphs or messy text.
3. Automatically transform user queries into clean, readable output.
4. Use simple English and clear structure.
5. Whenever listing skills, tools, achievements, etc — ALWAYS format like:

## Heading  
• Point  
• Point  
• Point

6. Always behave like Suraj’s professional assistant.
7. ALWAYS return the best polished version of the answer.
`
  ],

  ["human", "{context}\n\nQuestion: {input}"]
]);

const promptFormat = async ({ input, context }: any) => {
  return prompt.format({ input, context });
};

const callLlm = async (formattedPrompt: string) => {
  return await llm.invoke(formattedPrompt);
};

const Askchain = RunnableSequence.from([promptFormat, callLlm]);

export default Askchain;
