import { connect } from "@/dbConfig/dbConfig";
import Reports from "@/models/newsModel";
import { NextRequest, NextResponse } from "next/server";


connect();

export async function POST(request: NextRequest){
    try { 
        const reqBody = await request.json();
        const {id} = reqBody;
        const report = await Reports.findOne({_id: id}); 
          
        return NextResponse.json({
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