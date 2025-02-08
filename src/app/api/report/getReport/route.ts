import { connect } from "@/dbConfig/dbConfig";
import Reports from "@/models/newsModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  const reqBody = await request.json();
  const { category } = reqBody;

  try {
    let report;

    if (category == "all") {
      report = await Reports.find(); // Fetch all reports if category is empty
    } else {
      report = await Reports.find({ category });
    }

    return NextResponse.json({
      status: true,
      report,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}
