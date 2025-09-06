import sql from "@/app/configs/postgres/connectDb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, ) {
    
    const body = await req.json();

    const {skills} = body;
    let id=8;
    

    if(!skills){
        return NextResponse.json({success:false, message: 'skill not get'},{status: 400});
    }

    try {
       
        
        const rows = await sql`INSERT INTO information  (id,skills) VALUES (${id},${skills}) RETURNING *;`;

       if(!rows){
        return NextResponse.json({success: false, message:"Failed to save"},{status: 401})
       }

       return NextResponse.json({success: true, message: 'Saved successfully '});
    } catch (error:any) {
        console.error("Error from db", error.message);
        return NextResponse.json({success:false, message: error.message});
    }
}