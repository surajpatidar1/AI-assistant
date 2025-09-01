import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import tools from "../tools/loadData";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0,
  apiKey: process.env.GOOGLE_API_KEY,
}).bind({ tools }); // Bind tools to the LLM

const prompt = ChatPromptTemplate.fromTemplate(`
  You are a helpful assistant.
  When the user asks something, decide which internal function to call.
  User input: {input}
`);

const Datachain = RunnableSequence.from([
  prompt,
  llm
]);

export default Datachain;