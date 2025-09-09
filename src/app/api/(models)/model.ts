import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

export  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    temperature: 0,
    apiKey: process.env.GOOGLE_API_KEY,
  });


  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are the personal AI assistant of Suraj Patidar.
       You have access to Suraj's personal information, achievements, and background.
       Always answer as if you are speaking on behalf of Suraj.`
    ],
    ["human", "{context}\n\nQuestion : {input}"]
  ])


  const promptFormat = async({input,context}:any)=>{
    return prompt.format({input,context})
  };

  const callLlm = async( promptFormat:string)=>{
    console.log("model")
      return await llm.invoke(promptFormat)
  };

  const Askchain = RunnableSequence.from([promptFormat,callLlm])
  
export default Askchain;
  

