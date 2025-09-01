import sql from "@/app/configs/postgres/connectDb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, ) {
    
    const body = await req.json();
    const {project} = body;
    let id=2;
    let lastest

    if(!project){
        return NextResponse.json({success:false, message: 'project not get'},{status: 400});
    }else{
       lastest = ++id;
       id = lastest++;
    }

    try {
        
        const rows = await sql`INSERT INTO information  (id,project) VALUES (${id},${project}) RETURNING *;`;

       if(!rows){
        return NextResponse.json({success: false, message:"Failed to save"},{status: 401})
       }

       return NextResponse.json({success: true, message: 'Saved successfully '});
    } catch (error:any) {
        console.error("Error from db", error.message);
        return NextResponse.json({success:false, message: error.message});
    }
}