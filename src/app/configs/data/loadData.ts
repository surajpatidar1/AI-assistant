import sql from "../postgres/connectDb";


export const get_education_information = async ()=>{

    const rows = await sql` SELECT * FROM  information ;`
    return rows;
}

export const get_personal_data = async ()=>{

    const rows = await sql`SELECT * FROM personal_information `;
    return rows;
}

export const save_username = async ({name}:any)=>{

    const rows = await sql` INSERT INTO users (name) VALUES (${name}) RETURNING *;`
    return rows;
}

