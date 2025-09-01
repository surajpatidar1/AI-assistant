
import sql from '@/app/configs/postgres/connectDb';
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req:NextRequest) {
    const body = await req.json(); 

    const {name,skills,college,school,project, interships, degree} = body

     let id=0;

    if(!name || !skills || !college || !school || !project || !degree){
        return NextResponse.json({success: false, message: "Fields are required"},{status: 400})
    }else{
        ++id;
    }

    try {
        
         const rows = await sql` INSERT INTO information (id, name, skills, college, school, project, internship, degree) 
                        VALUES (${id}, ${name}, ${skills}, ${college},${school}, ${project}, ${interships}, ${degree}) RETURNING *;`;

        if(!rows){
            return NextResponse.json({success: false, message: "Failed to save data !"},{status: 400 })
        }

        return NextResponse.json({success: true, message:" Data was saved successfully"},{status: 201})
    } catch (error:any) {
        console.error("Something went wrong with saving query please check !", error.message);
        return NextResponse.json({success: false, message:error.message})
    }

   


}
