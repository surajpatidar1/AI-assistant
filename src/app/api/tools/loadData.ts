// tools/loadData.ts
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import {
  get_education_information,
  get_personal_data,
  save_username,
} from "@/app/configs/data/loadData";

const getEducationTool = tool(
  async () => {
   
    try {
      const rows = await get_education_information();
      console.log("💾 EDUCATION USER TOOL TRIGGERED with name:");
      const educationData = rows.filter(row => row.school || row.college || row.degree);
      
      if (educationData.length > 0) {
        const formattedEducation = educationData.map(edu => ({
          school: edu.school,
          college: edu.college,
          degree: edu.degree,
          certification: edu.certification
        })).filter(edu => edu.school || edu.college || edu.degree); // Remove empty entries
        
        return `Suraj's Education:\n${JSON.stringify(formattedEducation, null, 2)}`;
      } else {
        return "No education information found in database";
      }
    } catch (error) {
      console.error("Education tool error:", error);
      return "Error fetching education information";
    }
  },
  {
    name: "get_user_education_details",
    description: "GET SURAJ'S EDUCATION INFORMATION. Use this when user asks about Suraj's school, education, degree, college, university, courses, or academic background.",
    schema: z.object({}),
  }
);

const getSkillsTool = tool(
  async () => {
    
    try {
      const rows = await get_education_information();
       console.log("💾 SKILLS USER TOOL TRIGGERED with name:");
      
      const allSkills = rows
        .filter(row => row.skills)
        .flatMap(row => row.skills.split(',').map((skill: string) => skill.trim()))
        .filter((skill, index, array) => array.indexOf(skill) === index); // Remove duplicates
      
      if (allSkills.length > 0) {
        return `Suraj's Skills: ${allSkills.join(', ')}`;
      } else {
        return "No skills information found in database";
      }
    } catch (error) {
      console.error("Skills tool error:", error);
      return "Error fetching skills information";
    }
  },
  {
    name: "get_user_skills",
    description: "GET SURAJ'S SKILLS. Use this when user asks about Suraj's technical skills, programming languages, technologies, or capabilities.",
    schema: z.object({}),
  }
);

const getProjectsTool = tool(
  async () => {
   
    try {
      const rows = await get_education_information();
      
      console.log("💾 PROJECT USER TOOL TRIGGERED with name:");
      const projects = rows
        .filter(row => row.project)
        .map(row => row.project);
      
      if (projects.length > 0) {
        return `Suraj's Projects:\n${projects.join('\n\n')}`;
      } else {
        return "No projects information found in database";
      }
    } catch (error) {
      console.error("Projects tool error:", error);
      return "Error fetching projects information";
    }
  },
  {
    name: "get_user_projects",
    description: "GET SURAJ'S PROJECTS. Use this when user asks about Suraj's projects, portfolio, work samples, or applications he has built.",
    schema: z.object({}),
  }
);

const getPersonalTool = tool(
  async () => {

    try {
      const rows = await get_personal_data();
   console.log("💾 PERSONAL USER TOOL TRIGGERED with name:");
      
      if (rows && rows.length > 0) {
        const personalInfo = rows[0]; // Get first record
        return `Suraj's Personal Information:
- Name: ${personalInfo.full_name}
- Email: ${personalInfo.email}
- Phone: ${personalInfo.phone}
- Date of Birth: ${new Date(personalInfo.date_of_birth).toLocaleDateString()}
- Gender: ${personalInfo.gender}`;
      } else {
        return "No personal information found in database";
      }
    } catch (error) {
      console.error("Personal tool error:", error);
      return "Error fetching personal information";
    }
  },
  {
    name: "get_user_personal_details", 
    description: "GET SURAJ'S PERSONAL INFORMATION. Use this when user asks about Suraj's personal details, contact information, background, or basic info.",
    schema: z.object({}),
  }
);

const saveUserTool = tool(
  async ({ name }: { name: string }) => {
    console.log("💾 SAVE USER TOOL TRIGGERED with name:", name);
    try {
      const result = await save_username({ name });
      console.log("Save user tool result:", result);
      return `User ${name} saved successfully!`;
    } catch (error) {
      console.error("Save user tool error:", error);
      return "Error saving user name";
    }
  },
  {
    name: "save_username",  // ✅ Changed to match function name
    description: "SAVE USER NAME. Use this when user provides their name or asks to be remembered.",
    schema: z.object({ name: z.string().min(1) }),
  }
);


const tools = [getEducationTool, getSkillsTool, getProjectsTool, getPersonalTool, saveUserTool];

export default tools;