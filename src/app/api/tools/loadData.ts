
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import {
  get_education_information,
  get_personal_data,
  save_username,
} from "@/app/configs/data/loadData";
import surajData from "@/app/configs/data/allData";

/* ========================== 🎓 EDUCATION TOOL ========================== */
const getEducationTool = tool(
  async () => {
    try {
      const rows = await get_education_information();
      const educationData = rows.filter(
        (row) => row.school || row.college || row.degree
      );

      if (educationData.length === 0) return "❌ No education information found.";

      const formattedEducation = educationData
        .map(
          (edu) => `
- 📘 **School:** ${edu.school || "N/A"}
- 🏫 **College:** ${edu.college || "N/A"}
- 🎓 **Degree:** ${edu.degree || "N/A"}
- 📜 **Certification:** ${edu.certification || "N/A"}`
        )
        .join("\n\n---\n\n");

      return `## 🎓 Suraj's Education\n${formattedEducation}`;
    } catch (error) {
      console.error("Education tool error:", error);
      return "⚠️ Error fetching education information.";
    }
  },
  { name: "get_user_education_details", description: "Get Suraj's education details.", schema: z.object({}) }
);

/* ========================== 🛠️ SKILLS TOOL ========================== */
const getSkillsTool = tool(
  async () => {
    try {
      const rows = await get_education_information();

      const allSkills = rows
        .filter((row) => row.skills)
        .flatMap((row) => row.skills.split(",").map((s: string) => s.trim()))
        .filter((s, i, arr) => arr.indexOf(s) === i);

      if (allSkills.length === 0) return "❌ No skills information found.";

      return `## 🛠️ Suraj's Skills\n${allSkills.map((s) => `- ${s}`).join("\n")}`;
    } catch (error) {
      console.error("Skills tool error:", error);
      return "⚠️ Error fetching skills information.";
    }
  },
  { name: "get_user_skills", description: "Get Suraj's skills.", schema: z.object({}) }
);

/* ========================== 💻 PROJECTS TOOL ========================== */
const getProjectsTool = tool(
  async () => {
    try {
      const rows = await get_education_information();
      const projects = rows.filter((row) => row.project).map((row) => row.project);

      if (projects.length === 0) return "❌ No projects information found.";

      return `## 💻 Suraj's Projects\n${projects
        .map((p, i) => `- 🔹 **Project ${i + 1}:** ${p}`)
        .join("\n\n")}`;
    } catch (error) {
      console.error("Projects tool error:", error);
      return "⚠️ Error fetching projects information.";
    }
  },
  { name: "get_user_projects", description: "Get Suraj's projects.", schema: z.object({}) }
);

/* ========================== 📌 OVERVIEW TOOL ========================== */
const getOverviewTool = tool(
  async () => {
    try {
      return `## 📌 Suraj's Overview

### 👤 Personal
- Name: ${surajData.personal.full_name}
- Email: ${surajData.personal.email}
- LinkedIn: ${surajData.personal.linkedin}
- Portfolio: ${surajData.personal.portfolio}

### 🎓 Education
${surajData.education.map((edu) => `- ${edu.degree} (${edu.year}) — ${edu.institution}`).join("\n")}

### 🛠️ Skills
- Programming: ${surajData.skills.programming.join(", ")}
- Web: ${surajData.skills.web.join(", ")}
- Database: ${surajData.skills.database.join(", ")}
- Tools: ${surajData.skills.tools.join(", ")}

### 💻 Projects
${surajData.projects.slice(0, 2).map((p) => `- **${p.title}**: ${p.description}`).join("\n")}

### 🚀 Current Focus
Learning and working with LLMs, Agents, LangChain, Gemini & OpenAI.`;
    } catch (error) {
      console.error("Overview tool error:", error);
      return "⚠️ Error generating overview.";
    }
  },
  { name: "get_suraj_overview", description: "Get overview of Suraj.", schema: z.object({}) }
);

/* ========================== 👤 PERSONAL TOOL ========================== */
const getPersonalTool = tool(
  async () => {
    try {
      const rows = await get_personal_data();
      if (!rows || rows.length === 0) return "❌ No personal information found.";

      const p = rows[0];
      return `## 👤 Suraj's Personal Information
- 🏷️ Name: ${p.full_name}
- 📧 Email: ${p.email}
- 📱 Phone: ${p.phone}
- 🎂 DOB: ${new Date(p.date_of_birth).toLocaleDateString()}
- 🚹 Gender: ${p.gender}`;
    } catch (error) {
      console.error("Personal tool error:", error);
      return "⚠️ Error fetching personal information.";
    }
  },
  { name: "get_user_personal_details", description: "Get Suraj's personal details.", schema: z.object({}) }
);

/* ========================== 💾 SAVE USER TOOL ========================== */
const saveUserTool = tool(
  async ({ name }: { name: string }) => {
    try {
      const result = await save_username({ name });
      console.log("Save user tool result:", result);
      return `✅ User **${name}** saved successfully!`;
    } catch (error) {
      console.error("Save user tool error:", error);
      return "⚠️ Error saving user name.";
    }
  },
  {
    name: "save_username",
    description: "Save user's name.",
    schema: z.object({ name: z.string().min(1).describe("User's name extracted from input") }),
  }
);

/* ========================== 📚 READ ALL DATA TOOL ========================== */
const readSurajDataTool = tool(
  async ({ category }: { category: string }) => {
    switch (category.toLowerCase()) {
      case "personal":
        return `## 👤 Suraj's Personal Info
- Name: ${surajData.personal.full_name}
- Email: ${surajData.personal.email}
- Phone: ${surajData.personal.phone}
- LinkedIn: ${surajData.personal.linkedin}
- Portfolio: ${surajData.personal.portfolio}`;

      case "skills":
        return `## 🛠️ Suraj's Skills
- Programming: ${surajData.skills.programming.join(", ")}
- Web: ${surajData.skills.web.join(", ")}
- Database: ${surajData.skills.database.join(", ")}
- Tools: ${surajData.skills.tools.join(", ")}
- Soft Skills: ${surajData.skills.softSkills.join(", ")}`;

      case "education":
        return `## 🎓 Suraj's Education\n${surajData.education
          .map((edu) => `- ${edu.degree} — ${edu.institution} (${edu.year})`)
          .join("\n")}`;

      case "projects":
        return `## 💻 Suraj's Projects\n${surajData.projects
          .map((p) => `- **${p.title}**\n  ${p.description}\n  _Tech:_ ${p.tech.join(", ")}`)
          .join("\n\n")}`;

      case "certifications":
        return `## 📜 Certifications\n${surajData.certifications.map((c) => `- ${c}`).join("\n")}`;

      case "hobbies":
        return `## 🎯 Hobbies\n${surajData.hobbies.map((h) => `- ${h}`).join("\n")}`;

      case "experience":
        return `## 💼 Work Experience
- Suraj is a **Fresher**, currently focusing on building projects and internships.
- Hands-on experience with MERN stack, Next.js, and TypeScript.`;

      case "current_tech":
      case "technology":
      case "learning":
        return `## 🚀 Current Learning / Tech
- LLMs (Large Language Models)
- Agents
- Gemini (OpenAI)
- LangChain`;

      default:
        return "⚠️ Unknown category. Try: personal, skills, education, projects, certifications, hobbies, experience, current_tech.";
    }
  },
  {
    name: "read_suraj_data",
    description: "Read structured info about Suraj.",
    schema: z.object({ category: z.string().describe("The category to fetch.") }),
  }
);

/* ========================== 📦 EXPORT ALL ========================== */
const tools = [
  getEducationTool,
  getSkillsTool,
  getProjectsTool,
  getPersonalTool,
  saveUserTool,
  readSurajDataTool,
  getOverviewTool,
];

export default tools;
