import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import tools from "../tools/loadData";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0,
  apiKey: process.env.GOOGLE_API_KEY,
}).bind({ tools });

const prompt = ChatPromptTemplate.fromTemplate(`

You are a highly structured, clean-response assistant.

Your goals:
• Understand the user input.
• If needed, call the correct internal tool/function.
• Make the final answer extremely readable — ALWAYS.

FORMATTING RULES:
1. Always use headings (##)
2. Always use bullet points (•)
3. Never return raw or messy text.
4. Rewrite and clean the tool output before sending.
5. Keep answers short, polished, professional.

User Input: {input}

`);

const Datachain = RunnableSequence.from([
  prompt,
  llm
]);

export default Datachain;
