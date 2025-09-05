
import sql from '@/app/configs/postgres/connectDb';
import { NextRequest, NextResponse } from 'next/server'


interface personalData{
id: string,
fullname: string,
email:string,
phone:  string,
date_of_birth: Date,
gender:string
}

export async function POST(req:NextRequest) {
    const body: personalData = await req.json()
    
    const {fullname,email,phone,date_of_birth,gender} = body;

    let id=0

    if(!fullname || !email || !phone || !date_of_birth || !gender){
        return NextResponse.json({success: false, message: "Fields are required"},{status: 400})
    }else{
        ++id;
    }

    try {
        
         const rows = await sql` INSERT INTO personal_information (id,full_name, email, phone, date_of_birth, gender) 
                        VALUES (${id},${fullname}, ${email}, ${phone},${date_of_birth}, ${gender}) RETURNING *;`;

        if(!rows){
            return NextResponse.json({success: false, message: "Failed to save data !"},{status: 400 })
        }

        return NextResponse.json({success: true, message:" Data was saved successfully"},{status: 201})
    } catch (error:any) {
        console.error("Something went wrong with saving query please check !", error.message);
        return NextResponse.json({success: false, message:error.message})
    }

   


}
