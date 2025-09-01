import sql from "@/app/configs/postgres/connectDb";
import { NextResponse } from "next/server";


// POST /api/test
export async function POST(req: Request) {
  try {
    const { name } = await req.json();

     const rows = await sql` INSERT INTO users (name) VALUES (${name}) RETURNING *;`
     if(!rows){
        return NextResponse.json({success:false, messagae: 'failed to save'})
     }

    return NextResponse.json({ success: true, message: "✅ Name saved!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "❌ Failed to save" });
  }
}
