import { NextResponse } from "next/server";

// Enhanced tool mapping with more patterns
export const TOOL_MAPPING = {
  education: ['education', 'school', 'college', 'degree', 'university', 'academic', 'study', 'course', 'qualification', 'background'],
  skills: ['skill', 'technology', 'programming', 'language', 'framework', 'tool', 'stack', 'expertise', 'proficient', 'know'],
  projects: ['project', 'portfolio', 'application', 'app', 'build', 'developed', 'work sample', 'github', 'code'],
  personal: ['personal', 'about', 'contact', 'info', 'background', 'experience', 'achievement', 'bio', 'who is'],
  save_user: ['my name is', 'i am', 'call me', 'remember me as', 'username is', 'this is', 'you can call me']
};

// Enhanced quick responses
export const QUICK_RESPONSES: { [key: string]: { content: string; interactive?: boolean; suggestions?: string[] } } = {
  'suraj': { 
    content: `Yes, that's me! 🎯 I'm Suraj's AI assistant. How can I help you today?`, 
    interactive: true, 
    suggestions: ["Education", "Skills", "Projects", "Experience", "Contact"] 
  },
  'skills': { 
    content: `Sure! Suraj has expertise in various technologies including JavaScript, React, Node.js and more. Would you like a detailed list?`,
    interactive: true,
    suggestions: ["Technical skills", "Programming languages", "Frameworks"]
  },
  'education': { 
    content: `Suraj has educational background in Computer Science. Would you like to know more about his qualifications?`,
    interactive: true,
    suggestions: ["Degrees", "Courses", "Certifications"]
  },
  'projects': { 
    content: `Suraj has built several interesting projects. Should I tell you about them?`,
    interactive: true,
    suggestions: ["Web applications", "Open source", "Recent projects"]
  },
  'experience': { 
    content: `Suraj has professional experience in software development. Need details about his work history?`,
    interactive: true,
    suggestions: ["Work experience", "Companies", "Technologies used"]
  },
  'github': { 
    content: `You can find Suraj's projects on GitHub. Would you like me to provide a link to his profile?`,
    interactive: true,
    suggestions: ["GitHub profile", "View projects", "Source code"]
  },
  'linkedin': { 
    content: `Suraj is on LinkedIn for professional connections. Would you like his profile link?`,
    interactive: true,
    suggestions: ["LinkedIn profile", "Professional network"]
  },
  'contact': { 
    content: `I can share Suraj's contact information. Are you interested in getting in touch with him?`,
    interactive: true,
    suggestions: ["Email", "Phone", "Social media"]
  },
  'hello': { 
    content: `Hello! 👋 I'm Suraj's AI assistant. How can I help you today?`, 
    interactive: true, 
    suggestions: ["About Suraj", "Skills", "Projects", "Contact"] 
  },
  'hi': { 
    content: `Hi there! 🤖 I'm here to tell you about Suraj. What would you like to know?`,
    interactive: true,
    suggestions: ["Education", "Technical Skills", "Projects", "Contact Info"]
  },
  'hey': { 
    content: `Hey! I'm Suraj's assistant. Ready to explore his portfolio?`,
    interactive: true,
    suggestions: ["Skills overview", "Projects", "Experience"]
  },
  'help': { 
    content: `I'm here to help you learn about Suraj! Here's what you can ask:`, 
    interactive: true, 
    suggestions: ["Education", "Technical Skills", "Projects", "Experience", "Contact Info"] 
  },
  '?': { 
    content: `Ask me about Suraj's education, skills, projects, or contact information!`,
    interactive: true,
    suggestions: ["Skills", "Projects", "Education", "Contact"]
  }
};

// Enhanced greetings
export const GREETINGS = ['hello', 'hi', 'hey', 'hola', 'namaste', 'greetings', 'howdy', 'good morning', 'good afternoon', 'good evening'];
export const WHO_ARE_YOU_PATTERNS = [
  /^who are you$/i, /^what is your name$/i, /^introduce yourself$/i, /^tell me about yourself$/i, 
  /^what do you do$/i, /^who created you$/i, /^are you human$/i, /^are you a bot$/i, /^are you ai$/i
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

  // Check for extremely long inputs
  if (userInput.length > 1000) {
    return NextResponse.json({
      success: false,
      message: "Message is too long. Please keep it under 1000 characters."
    }, { status: 400 });
  }

  return null;
}

// Handle quick responses
export function handleQuickResponses(trimmedInput: string, userIdentifier: string) {
  // Check for exact matches
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
  
  // Check for partial matches
  for (const [key, value] of Object.entries(QUICK_RESPONSES)) {
    if (trimmedInput.includes(key)) {
      return NextResponse.json({
        success: true,
        content: value.content,
        interactive: value.interactive,
        suggestions: value.suggestions,
        user: userIdentifier
      });
    }
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
  
  // Check for greetings with name
  if (GREETINGS.some(greeting => trimmedInput.startsWith(greeting))) {
    return NextResponse.json({
      success: true,
      content: `Hello ${userIdentifier}! 👋 I'm Suraj's AI assistant. What would you like to know about Suraj?`,
      interactive: true,
      suggestions: ["Skills", "Projects", "Experience", "Contact"],
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
  const positiveResponses = ['yes', 'yeah', 'y', 'yep', 'sure', 'ok', 'okay', 'certainly', 'absolutely'];
  const negativeResponses = ['no', 'n', 'nope', 'nah', 'not really', 'no thanks'];
  
  if (positiveResponses.includes(trimmedInput)) {
    return NextResponse.json({
      success: true,
      content: `Great! What specific information would you like to know, ${userIdentifier}?`,
      interactive: true,
      suggestions: ["Education details", "Technical skills", "Projects", "Experience"]
    });
  }

  if (negativeResponses.includes(trimmedInput)) {
    return NextResponse.json({
      success: true,
      content: `No problem, ${userIdentifier}! What else would you like to know about Suraj?`,
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
      /username is (\w+)/i,
      /this is (\w+)/i,
      /you can call me (\w+)/i,
      /^(\w+)$/i
    ];

    // Extract name from patterns
    for (const pattern of namePatterns) {
      const match = userInput.match(pattern);
      if (match && match[1]) {
        extractedName = match[1];
        break;
      }
    }

    // If we still have a generic name, try to extract from the input
    if (extractedName === 'Guest' || extractedName.length < 2) {
      const words = userInput.split(' ');
      for (const word of words) {
        if (word.length > 2 && !TOOL_MAPPING.save_user.some(kw => word.includes(kw))) {
          extractedName = word;
          break;
        }
      }
    }

    // Save username to database if it's valid
    if (extractedName && extractedName !== 'Guest' && extractedName.length > 1) {
      try {
        const { save_username } = await import('@/app/configs/data/loadData');
        await save_username({ name: extractedName });
        console.log("✅ Username saved:", extractedName);
      } catch (err) {
        console.error("❌ Error saving username:", err);
        // Continue even if save fails - we'll use the name in the session
      }
    }
    
    return NextResponse.json({
      success: true,
      content: `Nice to meet you, ${extractedName}! 😊 I'm Suraj's AI assistant. How can I help you learn about Suraj today?`,
      userName: extractedName,
      interactive: true,
      suggestions: ["About Suraj", "Skills", "Projects", "Contact"]
    });
  }
  return null;
}

// Enhanced categorize input
export function categorizeInput(input: string): string {
  const normalized = input.trim().toLowerCase().replace(/[^\w\s]/g, '');
  
  if (normalized.includes('all') || normalized.includes('everything') || normalized.includes('complete') || normalized.includes('overview')) {
    return 'comprehensive_request';
  }

  for (const [category, keywords] of Object.entries(TOOL_MAPPING)) {
    if (keywords.some(keyword => normalized.includes(keyword))) {
      return category;
    }
  }

  return 'general';
}

// Handle comprehensive requests
export function handleComprehensiveRequest(userIdentifier: string) {
  return NextResponse.json({
    success: true,
    content: `I'd be happy to give you a comprehensive overview of Suraj, ${userIdentifier}! Let me break this down. Which area would you like to start with?`,
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
    /this is (\w+)/i,
    /you can call me (\w+)/i,
    /^(\w+)$/i
  ];

  for (const pattern of namePatterns) {
    const match = userInput.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  // Fallback: take the first word that's not a greeting or common word
  const commonWords = new Set(['hello', 'hi', 'hey', 'my', 'name', 'is', 'call', 'me', 'this', 'you', 'can']);
  const words = userInput.split(' ');
  for (const word of words) {
    if (word.length > 2 && !commonWords.has(word.toLowerCase())) {
      return word;
    }
  }
  
  return 'Guest';
}