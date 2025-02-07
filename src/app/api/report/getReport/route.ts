import { connect } from "@/dbConfig/dbConfig";
import Reports from "@/models/newsModel";
import { NextResponse } from "next/server";


connect();

export async function GET(){
    try { 
        const report = await Reports.find(); // Sort by date descending
          
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