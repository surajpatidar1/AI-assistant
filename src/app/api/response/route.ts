import { NextRequest, NextResponse } from "next/server";
import { HumanMessage } from "@langchain/core/messages";
import agent from "../agent/mainAgent";
import { decideChain } from "./decideFuction";
import Askchain from "../(models)/model";
import Datachain from "../(models)/modelForDataFetch";

export async function POST(req: NextRequest) {
  try {
    const { input, userName, sessionId } = await req.json();

  
    if (!input) {
      return NextResponse.json(
        { success: false, message: "Input required" },
        { status: 400 }
      );
    }
    
    
    const user = userName || "Guest";

        const target = decideChain(input);
    let response;
    let finalText;

       if (target === "ask") {
      response = await Askchain.invoke({ input, context: "" });
      finalText = response.content ?? JSON.stringify(response);
    } else if (target === "data") {
      response = await Datachain.invoke({ input });
      finalText = response.content ?? JSON.stringify(response);
    } else {
      response = await agent.invoke(
        { messages: [new HumanMessage(input)] },
        { configurable: { thread_id: sessionId, user_name: user } }
      );


    const aiMessage = response.messages[response.messages.length - 1];
     finalText = Array.isArray(aiMessage.content)
      ? aiMessage.content.map((c: any) => c?.text || "").join(" ")
      : aiMessage.content;

    }
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
