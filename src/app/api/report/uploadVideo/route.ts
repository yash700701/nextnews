import { connect } from "@/dbConfig/dbConfig";
import Videos from "@/models/videoModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest){
    try { 
        const reqBody = await request.json()
        const { name, email, time, date, category, videoHeadline, videoContent, videoUrl } = reqBody
        
        // create new report
        const newReport = new Videos({
            userName: name,
            email,
            videoHeadline,
            videoContent,
            time, 
            category,
            date,
            videoUrl,
        })
         
        const savedReport = await newReport.save()
        
        return NextResponse.json({
            mesage: "reporrt created succsessfully", 
            status: true,
            savedReport
        })
        
    } catch (error: unknown) {
        // Use `unknown` and narrow it to `Error` where necessary
        if (error instanceof Error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
      }
}