import { connect } from "@/dbConfig/dbConfig";
import Reports from "@/models/newsModel";
import { NextRequest, NextResponse } from "next/server";


connect();

export async function POST(request: NextRequest){
    try { 
        const reqBody = await request.json();
        const {id, updatedHeadline, updatedContent} = reqBody
        const report = await Reports.findByIdAndUpdate(id, {headline: updatedHeadline, content: updatedContent});
          
        return NextResponse.json({
            mesage: "update successfully", 
            status: true,
            report
        })
        
    } catch (error: unknown) {
        // Use `unknown` and narrow it to `Error` where necessary
        if (error instanceof Error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
      }
}