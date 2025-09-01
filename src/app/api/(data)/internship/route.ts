import sql from "@/app/configs/postgres/connectDb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, ) {
    
    const body = await req.json();

    const {internship} = body;
    let id=2;
    let lastest

    if(!internship){
        return NextResponse.json({success:false, message: 'intership not get'},{status: 400});
    }else{
       lastest = ++id;
       id = lastest++;
    }

    try {
        
        const rows = await sql`INSERT INTO information  (internship) VALUES (${internship}) RETURNING *;`;

       if(!rows){
        return NextResponse.json({success: false, message:"Failed to save"},{status: 401})
       }

       return NextResponse.json({success: true, message: 'Saved successfully '});
    } catch (error:any) {
        console.error("Error from db", error.message);
        return NextResponse.json({success:false, message: error.message});
    }
}