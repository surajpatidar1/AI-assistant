import { NextRequest, NextResponse } from "next/server";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import agent from "../agent/mainAgent";

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

    const systemMessage = new SystemMessage(`
You are Suraj's personal assistant. 
The current user is "${userName}". Always address them by their name.

Tool usage rules:
1. ⚡ First priority → Always call "save_username" tool with the given user name ("${userName}") 
   and save it in the database at the start of the session. Do this only once per session.
2. If user asks about education → call get_user_education_details
3. If user asks about skills → call get_user_skills
4. If user asks about projects → call get_user_projects
5. If user asks about personal info → call get_user_personal_details
6. If user provides another name (e.g. "Mera naam Rahul hai") → call save_username with that name
7. ⚡ If query does NOT match above tools, ALWAYS call "read_suraj_data" 
   with the most relevant category (personal, skills, education, projects, certifications, hobbies).
8. Always give structured, friendly answers.
    `);

    const response = await agent.invoke(
      { messages: [systemMessage, new HumanMessage(input)] },
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
