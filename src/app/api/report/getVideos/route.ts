import { connect } from "@/dbConfig/dbConfig";
import Videos from "@/models/videoModel";
import { NextResponse } from "next/server";

connect();

export async function POST() {
//   const reqBody = await request.json();
//   const { category } = reqBody;

  try {
    const report = await Videos.find();

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
