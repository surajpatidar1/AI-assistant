export function decideChain(input: string) {
  const lower = input.toLowerCase();

  // 🔹 1. Askchain (general/personal about Suraj)
  if (
    lower.includes("who are you") ||
    lower.includes("about suraj") ||
    lower.includes("background") ||
    lower.includes("personal") ||
    lower.includes("your name") ||
    lower.includes("achievements")
  ) {
    return "ask";
  }

  // 🔹 2. Datachain → education / projects / skills / certifications / internships
  if (
    lower.includes("education") ||
    lower.includes("degree") ||
    lower.includes("college") ||
    lower.includes("school") ||
    lower.includes("skills") ||
    lower.includes("project") ||
    lower.includes("internship") ||
    lower.includes("certification")
  ) {
    return "data";
  }

  // 🔹 3. Datachain → personal data queries
  if (
    lower.includes("email") ||
    lower.includes("phone") ||
    lower.includes("contact") ||
    lower.includes("date of birth") ||
    lower.includes("dob") ||
    lower.includes("gender") ||
    lower.includes("personal info")
  ) {
    return "data";
  }

  // 🔹 4. Datachain → save username
  if (lower.includes("save my name") || lower.includes("remember my name")) {
    return "data";
  }

  // 🔹 5. Fallback → Agent
  return "agent";
}
