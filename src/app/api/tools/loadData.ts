
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import {
  get_education_information,
  get_personal_data,
  save_username,
} from "@/app/configs/data/loadData";
import surajData from "@/app/configs/data/allData";

// ================= EDUCATION =================
const getEducationTool = tool(
  async () => {
    try {
      const rows = await get_education_information();
      console.log("💾 EDUCATION USER TOOL TRIGGERED");

      const educationData = rows.filter(
        (row) => row.school || row.college || row.degree
      );

      if (educationData.length > 0) {
        const formattedEducation = educationData
          .map((edu) => {
            return `
📘 School: ${edu.school || "N/A"}
🏫 College: ${edu.college || "N/A"}
🎓 Degree: ${edu.degree || "N/A"}
📜 Certification: ${edu.certification || "N/A"}
            `;
          })
          .join("\n------------------\n");

        return `📖 Suraj's Education:\n${formattedEducation}`;
      } else {
        return "❌ No education information found in database.";
      }
    } catch (error) {
      console.error("Education tool error:", error);
      return "⚠️ Error fetching education information.";
    }
  },
  {
    name: "get_user_education_details",
    description:
      "Get Suraj's education details (school, college, degree, certifications).",
    schema: z.object({}),
  }
);

// ================= SKILLS =================
const getSkillsTool = tool(
  async () => {
    try {
      const rows = await get_education_information();
      console.log("💾 SKILLS USER TOOL TRIGGERED");

      const allSkills = rows
        .filter((row) => row.skills)
        .flatMap((row) =>
          row.skills.split(",").map((s: string) => s.trim())
        )
        .filter((s, i, arr) => arr.indexOf(s) === i); // remove duplicates

      if (allSkills.length > 0) {
        const formattedSkills = allSkills
          .map((s) => `• ${s}`)
          .join("\n");

        return `🛠️ Suraj's Skills:\n${formattedSkills}`;
      } else {
        return "❌ No skills information found in database.";
      }
    } catch (error) {
      console.error("Skills tool error:", error);
      return "⚠️ Error fetching skills information.";
    }
  },
  {
    name: "get_user_skills",
    description:
      "GET SURAJ'S SKILLS. Use this when user asks about Suraj's technical skills, programming languages, frameworks, technologies, or capabilities.",
    schema: z.object({}),
  }
);

// ================= PROJECTS =================
const getProjectsTool = tool(
  async () => {
    try {
      const rows = await get_education_information();
      console.log("💾 PROJECTS USER TOOL TRIGGERED");

      const projects = rows
        .filter((row) => row.project)
        .map((row) => row.project);

      if (projects.length > 0) {
        return `💻 Suraj's Projects:\n${projects
          .map((p, i) => `🔹 Project ${i + 1}: ${p}`)
          .join("\n\n")}`;
      } else {
        return "❌ No projects information found in database.";
      }
    } catch (error) {
      console.error("Projects tool error:", error);
      return "⚠️ Error fetching projects information.";
    }
  },
  {
    name: "get_user_projects",
    description: "Get Suraj's projects (apps, websites, portfolio work).",
    schema: z.object({}),
  }
);

// ================= PERSONAL INFO =================
const getPersonalTool = tool(
  async () => {
    try {
      const rows = await get_personal_data();
      console.log("💾 PERSONAL USER TOOL TRIGGERED");

      if (rows && rows.length > 0) {
        const p = rows[0];
        return `👤 Suraj's Personal Information:
- 🏷️ Name: ${p.full_name}
- 📧 Email: ${p.email}
- 📱 Phone: ${p.phone}
- 🎂 DOB: ${new Date(p.date_of_birth).toLocaleDateString()}
- 🚹 Gender: ${p.gender}`;
      } else {
        return "❌ No personal information found in database.";
      }
    } catch (error) {
      console.error("Personal tool error:", error);
      return "⚠️ Error fetching personal information.";
    }
  },
  {
    name: "get_user_personal_details",
    description: "Get Suraj's personal details (name, contact, DOB, gender).",
    schema: z.object({}),
  }
);

// ================= SAVE USER =================
const saveUserTool = tool(
  async ({ name }: { name: string }) => {
    console.log("💾 SAVE USER TOOL TRIGGERED with name:", name);
    try {
      const result = await save_username({ name });
      console.log("Save user tool result:", result);
      return `✅ User "${name}" saved successfully!`;
    } catch (error) {
      console.error("Save user tool error:", error);
      return "⚠️ Error saving user name.";
    }
  },
  {
    name: "save_username",
    description: "Save user's name when they introduce themselves.",
    schema: z.object({
      name: z.string().min(1).describe("User's name extracted from input"),
    }),
  }
);


// ================ALL DATA ================

const readSurajDataTool = tool(
  async ({ category }: { category: string }) => {
    console.log("📖 READ SURAJ DATA TOOL TRIGGERED for:", category);

    switch (category.toLowerCase()) {
      case "personal":
        return `👤 Suraj's Personal Info:
- Name: ${surajData.personal.full_name}
- Email: ${surajData.personal.email}
- Phone: ${surajData.personal.phone}
- LinkedIn: ${surajData.personal.linkedin}
- Portfolio: ${surajData.personal.portfolio}`;

      case "skills":
        return `🛠️ Suraj's Skills:
- Programming: ${surajData.skills.programming.join(", ")}
- Web: ${surajData.skills.web.join(", ")}
- Database: ${surajData.skills.database.join(", ")}
- Tools: ${surajData.skills.tools.join(", ")}
- Soft Skills: ${surajData.skills.softSkills.join(", ")}`;

      case "education":
        return `📘 Suraj's Education:\n${surajData.education
          .map(
            (edu) =>
              `🎓 ${edu.degree} — ${edu.institution} (${edu.year})`
          )
          .join("\n")}`;

      case "projects":
        return `💻 Suraj's Projects:\n${surajData.projects
          .map(
            (p, i) =>
              `🔹 ${p.title}\n   ${p.description}\n   Tech: ${p.tech.join(", ")}`
          )
          .join("\n\n")}`;

      case "certifications":
        return `📜 Certifications:\n${surajData.certifications
          .map((c) => `- ${c}`)
          .join("\n")}`;

      case "hobbies":
        return `🎯 Hobbies: ${surajData.hobbies.join(", ")}`;

      case "experience":
        return `💼 Work Experience:
- Suraj is a **Fresher**, currently focusing on building projects and gaining internship opportunities.
- Hands-on experience with MERN stack, Next.js, and TypeScript through personal projects.`;

      case "current_tech":
      case "technology":
      case "learning":
        return `🚀 Suraj is currently learning and working with:
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
    description:
      "Read structured information about Suraj (personal, skills, education, projects, certifications, hobbies, experience, current_tech).",
    schema: z.object({
      category: z
        .string()
        .describe(
          "The category to fetch, e.g. personal, skills, education, projects, certifications, hobbies, experience, current_tech"
        ),
    }),
  }
);



// ================= EXPORT ALL =================
const tools = [
  getEducationTool,
  getSkillsTool,
  getProjectsTool,
  getPersonalTool,
  saveUserTool,
  readSurajDataTool
];

export default tools;
