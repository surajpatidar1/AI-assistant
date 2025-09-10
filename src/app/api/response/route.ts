import { NextRequest, NextResponse } from "next/server";
import { HumanMessage } from "@langchain/core/messages";
import agent from "../agent/mainAgent";


export async function POST(req: NextRequest) {
  try {
    const { input, userName, sessionId } = await req.json();
    console.log(input, userName, sessionId)

  
    if (!input) {
      return NextResponse.json(
        { success: false, message: "Input required" },
        { status: 400 }
      );
    }
    
    
    const user = userName || "Guest";


    const  response = await agent.invoke(
        { messages: [new HumanMessage(input)] },
        { configurable: { thread_id: sessionId, user_name: user } }
      );
 

    const aiMessage = response.messages[response.messages.length - 1];
    const finalText = Array.isArray(aiMessage.content)
      ? aiMessage.content.map((c: any) => c?.text || "").join(" ")
      : aiMessage.content;

    
    return NextResponse.json({
      success: true,
      content: finalText,
      user,
      sessionId,
    });
  } catch (err) {
    console.error("Agent Error:", err);
    return NextResponse.json(
      { success: false, message: "Agent error" },
      { status: 500 }
    );
  }
}
