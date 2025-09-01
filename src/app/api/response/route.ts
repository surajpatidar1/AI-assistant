import { NextRequest, NextResponse } from "next/server";
import agent from "../agent/mainAgent";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import * as SystemHandler from '../systemFunction/function'
import sql from "@/app/configs/postgres/connectDb";

// Execute save_username tool
async function executeSaveUsername(name: string) {
  try {
    // Import the function
    const { save_username } = await import('@/app/configs/data/loadData');
    
    console.log("💾 Saving username:", name);
    const result = await save_username({ name });
    console.log("✅ Save result:", result);
    
    return { success: true, message: `User ${name} saved successfully!` };
  } catch (error) {
    console.error("❌ Save username error:", error);
    return { success: false, message: "Error saving user name" };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Received request:", body);

    // Extract input fields
    const { input, question, sessionId, username, user_name, name, userName } = body;
    
    const userInput = input || question || '';
    const userIdentifier = userName || username || user_name || name || 'Guest';
    

    // Validate input
    const validationError = SystemHandler.validateInput(userInput, userIdentifier);
    if (validationError) return validationError;

    const trimmedInput = userInput.trim().toLowerCase();

    // Handle different input types
    const quickResponse = SystemHandler.handleQuickResponses(trimmedInput, userIdentifier);
    if (quickResponse) return quickResponse;

    const greetingResponse = SystemHandler.handleGreetings(trimmedInput, userIdentifier);
    if (greetingResponse) return greetingResponse;

    const whoAreYouResponse = SystemHandler.handleWhoAreYou(trimmedInput, userIdentifier);
    if (whoAreYouResponse) return whoAreYouResponse;

    const yesNoResponse = SystemHandler.handleYesNoResponses(trimmedInput, userIdentifier);
    if (yesNoResponse) return yesNoResponse;

    const usernameResponse = SystemHandler.handleUsernameSaving(userInput, trimmedInput, userIdentifier);
    if (usernameResponse) return usernameResponse;

    // Handle comprehensive requests
    const inputCategory = SystemHandler.categorizeInput(userInput);
    if (inputCategory === 'comprehensive_request') {
      return SystemHandler.handleComprehensiveRequest(userIdentifier);
    }

    // Handle save_username tool directly
    if (inputCategory === 'save_username') {
      const extractedName = SystemHandler.extractUserName(userInput);
      if (extractedName) {
        const saveResult = await executeSaveUsername(extractedName);
        
        if (saveResult.success) {
          return NextResponse.json({
            success: true,
            content: `Nice to meet you, ${extractedName}! 😊 I've saved your name. How can I help you today?`,
            userName: extractedName,
            interactive: true,
            suggestions: ["About Suraj", "Skills", "Projects", "Contact"]
          });
        } else {
          return NextResponse.json({
            success: false,
            content: `Nice to meet you, ${extractedName}! 😊 There was an issue saving your name, but I'll remember it for this conversation. How can I help you?`,
            userName: extractedName
          });
        }
      }
    }

    // Prepare system message
    const systemMessage = new SystemMessage(`
YOU ARE SURAJ'S PERSONAL ASSISTANT. Your name is "Suraj's Assistant".

USER CONTEXT:
- Current User: ${userIdentifier}
- Conversation ID: ${sessionId || 'new-session'}
- Query Type: ${inputCategory}

IMPORTANT:
1. Always address the user by name: ${userIdentifier}
2. Use tools for Suraj's information
3. Be concise and helpful
4. Never say "I cannot access" - use available tools

AVAILABLE TOOLS:
- Education: get_user_education_details
- Skills: get_user_skills  
- Projects: get_user_projects
- Personal: get_user_personal_details
- Save User: save_username
`);

    // Call agent with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await agent.invoke(
        { 
          messages: [
            systemMessage,
            new HumanMessage(userInput)
          ] 
        },
        { 
          configurable: { 
            thread_id: sessionId ?? "default_session",
            user_name: userIdentifier
          },
          signal: controller.signal
        }
      );

      clearTimeout(timeout);

      // Process agent response
      let finalText = "";
      
      if (response && typeof response === 'object' && 'messages' in response) {
        const messages = response.messages;
        const lastMessage = messages[messages.length - 1];
        
        if (lastMessage?.content) {
          if (typeof lastMessage.content === "string") {
            finalText = lastMessage.content;
          } else if (Array.isArray(lastMessage.content)) {
            finalText = lastMessage.content
              .map((c: any) => c?.text || c?.content || "")
              .filter(Boolean)
              .join(" ");
          }
        }
      }

      // Fallback response
      if (!finalText) {
        finalText = "I'd be happy to help with that! Could you please provide more specific details?";
      }

      return NextResponse.json({
        success: true,
        content: finalText,
        user: userIdentifier,
        sessionId: sessionId,
        category: inputCategory
      });

    } catch (agentError: any) {
      clearTimeout(timeout);
      
      if (agentError.name === 'AbortError') {
        return NextResponse.json({
          success: false,
          message: "Request timeout. Please try a more specific query.",
          error: "Timeout"
        }, { status: 408 });
      }

      throw agentError;
    }

  } catch (error: any) {
    console.error("API Error:", error);
    
    if (error.message?.includes('database') || error.message?.includes('connection')) {
      return NextResponse.json({
        success: false,
        message: "Temporarily unable to access information. Please try again later.",
        error: "Service unavailable"
      }, { status: 503 });
    }
    
    if (error.message?.includes('tool') || error.message?.includes('function')) {
      return NextResponse.json({
        success: false,
        message: "Service temporarily unavailable. Please try again shortly.",
        error: "Tool execution failed"
      }, { status: 503 });
    }

    return NextResponse.json({
      success: false,
      message: "I apologize, but I'm experiencing technical difficulties. Please try again.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    message: "Suraj's Assistant API is running",
    timestamp: new Date().toISOString()
  });
}