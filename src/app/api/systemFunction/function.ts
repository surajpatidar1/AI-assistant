import { NextResponse } from "next/server";

// Tool mapping
export const TOOL_MAPPING = {
  education: ['education', 'school', 'college', 'degree', 'university', 'academic', 'study', 'course'],
  skills: ['skill', 'technology', 'programming', 'language', 'framework', 'tool', 'stack'],
  projects: ['project', 'portfolio', 'application', 'app', 'build', 'developed', 'work sample'],
  personal: ['personal', 'about', 'contact', 'info', 'background', 'experience', 'achievement'],
  save_user: ['my name is', 'i am', 'call me', 'remember me as', 'username is']
};

// Quick responses
export const QUICK_RESPONSES: { [key: string]: { content: string; interactive?: boolean; suggestions?: string[] } } = {
  'suraj': { content: `Yes, that's me! 🎯 I'm Suraj's AI assistant. How can I help you today?`, interactive: true, suggestions: ["Education", "Skills", "Projects", "Experience", "Contact"] },
  'skills': { content: `Sure! Suraj has expertise in various technologies. Would you like a detailed list?` },
  'education': { content: `Suraj has educational background in Computer Science. Want to know more?` },
  'projects': { content: `Suraj has built several projects. Should I list them?` },
  'experience': { content: `Suraj has professional experience in software development. Need details?` },
  'github': { content: `You can find Suraj's projects on GitHub. Want the link?` },
  'linkedin': { content: `Suraj is on LinkedIn for professional connections. Need his profile?` },
  'contact': { content: `I can share Suraj's contact information. Interested?` },
  'hello': { content: `Hello! 👋 I'm Suraj's AI assistant. How can I help you today?`, interactive: true, suggestions: ["About Suraj", "Skills", "Projects", "Contact"] },
  'hi': { content: `Hi there! 🤖 I'm here to tell you about Suraj. What would you like to know?` },
  'hey': { content: `Hey! I'm Suraj's assistant. Ready to explore his portfolio?` },
  'help': { content: `I'm here to help you learn about Suraj! Here's what you can ask:`, interactive: true, suggestions: ["Education", "Technical Skills", "Projects", "Experience", "Contact Info"] },
  '?': { content: `Ask me about Suraj's education, skills, projects, or contact information!` }
};

// Greetings
export const GREETINGS = ['hello', 'hi', 'hey', 'hola', 'namaste', 'greetings', 'howdy'];
export const WHO_ARE_YOU_PATTERNS = [
  /^who are you$/i, /^what is your name$/i, /^introduce yourself$/i, /^tell me about yourself$/i, /^what do you do$/i
];

// Input validation
export function validateInput(userInput: string, userIdentifier: string) {
  if (!userIdentifier || userIdentifier.trim() === '' || userIdentifier === 'Guest') {
    return NextResponse.json({
      success: false,
      message: "Please provide your name to continue the conversation"
    }, { status: 400 });
  }

  if (!userInput || typeof userInput !== 'string' || userInput.trim() === '') {
    return NextResponse.json({
      success: false,
      message: "Message is required and must be a non-empty string"
    }, { status: 400 });
  }

  return null;
}

// Handle quick responses
export function handleQuickResponses(trimmedInput: string, userIdentifier: string) {
  if (QUICK_RESPONSES[trimmedInput]) {
    const response = QUICK_RESPONSES[trimmedInput];
    return NextResponse.json({
      success: true,
      content: response.content,
      interactive: response.interactive,
      suggestions: response.suggestions,
      user: userIdentifier
    });
  }
  return null;
}

// Handle greetings
export function handleGreetings(trimmedInput: string, userIdentifier: string) {
  if (GREETINGS.includes(trimmedInput)) {
    return NextResponse.json({
      success: true,
      content: `Hello ${userIdentifier}! 👋 I'm Suraj's AI assistant. How can I help you learn about Suraj today?`,
      interactive: true,
      suggestions: ["Education", "Skills", "Projects", "Contact"],
      user: userIdentifier
    });
  }
  return null;
}

// Handle "who are you" questions
export function handleWhoAreYou(trimmedInput: string, userIdentifier: string) {
  if (WHO_ARE_YOU_PATTERNS.some(pattern => pattern.test(trimmedInput))) {
    return NextResponse.json({
      success: true,
      content: `I'm Suraj's AI Assistant! 🤖 My purpose is to help you learn about Suraj - his skills, projects, experience, and background. How can I assist you today, ${userIdentifier}?`,
      interactive: true,
      suggestions: ["Education", "Technical Skills", "Projects", "Contact"],
      user: userIdentifier
    });
  }
  return null;
}

// Handle yes/no responses
export function handleYesNoResponses(trimmedInput: string, userIdentifier: string) {
  if (trimmedInput === 'yes' || trimmedInput === 'yeah' || trimmedInput === 'y') {
    return NextResponse.json({
      success: true,
      content: `Great! What specific information would you like to know, ${userIdentifier}?`,
      interactive: true,
      suggestions: ["Education details", "Technical skills", "Projects", "Experience"]
    });
  }

  if (trimmedInput === 'no' || trimmedInput === 'n' || trimmedInput === 'nope') {
    return NextResponse.json({
      success: true,
      content: `No problem, ${userIdentifier}! What else would you like to know?`,
      interactive: true,
      suggestions: ["Skills", "Projects", "Experience", "Contact"]
    });
  }
  return null;
}

// Handle username saving
export async function handleUsernameSaving(userInput: string, trimmedInput: string, userIdentifier: string) {
  if (TOOL_MAPPING.save_user.some(keyword => trimmedInput.includes(keyword))) {
    let extractedName = userIdentifier;
    const namePatterns = [
      /my name is (\w+)/i,
      /i am (\w+)/i,
      /call me (\w+)/i,
      /remember me as (\w+)/i,
      /username is (\w+)/i
    ];

       const { save_username } = await import('@/app/configs/data/loadData');
    try {
      await save_username({ name: extractedName });
    } catch (err) {
      console.error("❌ Error saving username:", err);
    }
    
    for (const pattern of namePatterns) {
      const match = userInput.match(pattern);
      if (match && match[1]) {
        extractedName = match[1];
        break;
      }
    }

    return NextResponse.json({
      success: true,
      content: `Nice to meet you, ${extractedName}! 😊 How can I help you today?`,
      userName: extractedName,
      interactive: true,
      suggestions: ["About Suraj", "Skills", "Projects", "Contact"]
    });
  }
  return null;
}

// Categorize input
export function categorizeInput(input: string): string {
  const normalized = input.trim().toLowerCase().replace(/[^\w\s]/g, '');
  
  if (normalized.includes('all') || normalized.includes('everything') || normalized.includes('complete')) {
    return 'comprehensive_request';
  }

  if (normalized.includes('education') || normalized.includes('school') || normalized.includes('degree')) {
    return 'education';
  }

  if (normalized.includes('skill') || normalized.includes('technology') || normalized.includes('programming')) {
    return 'skills';
  }

  if (normalized.includes('project') || normalized.includes('portfolio') || normalized.includes('app')) {
    return 'projects';
  }

  if (normalized.includes('personal') || normalized.includes('about') || normalized.includes('contact')) {
    return 'personal';
  }

  if (normalized.includes('my name is') || normalized.includes('i am') || 
      normalized.includes('call me') || normalized.includes('remember me')) {
    return 'save_username';
  }

  return 'general';
}

// Handle comprehensive requests
export function handleComprehensiveRequest(userIdentifier: string) {
  return NextResponse.json({
    success: true,
    content: `I'd be happy to give you a comprehensive overview, ${userIdentifier}! Let me break this down. Which area would you like to start with?`,
    interactive: true,
    suggestions: ["Education first", "Skills overview", "Projects list", "Personal background"],
    user: userIdentifier
  });
}

// Extract name from user input
export function extractUserName(userInput: string): string {
  const namePatterns = [
    /my name is (\w+)/i,
    /i am (\w+)/i,
    /call me (\w+)/i,
    /remember me as (\w+)/i,
    /username is (\w+)/i,
    /^(\w+)$/i
  ];

  
  
  for (const pattern of namePatterns) {
    const match = userInput.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return '';
}