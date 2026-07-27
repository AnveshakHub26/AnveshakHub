import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({
      opportunities: [],
      total: 0
    });
  } catch (error: any) {
    return NextResponse.json({ opportunities: [], total: 0 });
  }
}
