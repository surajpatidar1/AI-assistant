import sql from "@/app/configs/postgres/connectDb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, ) {
    
    const body = await req.json();

    const {internship} = body;
    let id=1;
    

    if(!internship){
        return NextResponse.json({success:false, message: 'intership not get'},{status: 400});
    }

    try {
        
        const rows = await sql`
  UPDATE information
  SET internship = ${internship}
  WHERE id = ${id}
  RETURNING *;
`;

       if(!rows){
        return NextResponse.json({success: false, message:"Failed to save"},{status: 401})
       }

       return NextResponse.json({success: true, message: 'Saved successfully '});
    } catch (error:any) {
        console.error("Error from db", error.message);
        return NextResponse.json({success:false, message: error.message});
    }
}