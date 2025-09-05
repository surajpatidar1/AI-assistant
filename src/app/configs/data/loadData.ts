import sql from "../postgres/connectDb";

// Type for education information row
export type EducationInfo = {
  id: number;
  degree: string;
  college: string;
  year: string;
  skills: string;
  school:string;
  project:string;
  internship:string;
  name:string;
  certification :string;
};

// Type for personal information row
export type PersonalData = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
};

// Type for user
export type User = {
  id: number;
  name: string;
};

export const get_education_information = async (): Promise<EducationInfo[]> => {
  const rows = await sql`SELECT * FROM information;`;
  return rows as EducationInfo[]; // Type assertion
};

export const get_personal_data = async (): Promise<PersonalData[]> => {
  const rows = await sql`SELECT * FROM personal_information;`;
  return rows as PersonalData[]; // Type assertion
};

export const save_username = async ({ name }: { name: string }): Promise<User[]> => {
  const rows = await sql`
    INSERT INTO users (name) 
    VALUES (${name}) 
    RETURNING *;
  `;
  return rows as User[]; // Type assertion
};
