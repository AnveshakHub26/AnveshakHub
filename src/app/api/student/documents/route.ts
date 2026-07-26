import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json([]);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({
      id: `doc-${Date.now()}`,
      name: body.name || "Uploaded Document.pdf",
      category: body.category || "DOCUMENT",
      fileUrl: body.fileUrl || "https://storage.anvesha.in/docs/uploaded.pdf",
      fileSizeMb: 2.0,
      status: "VERIFIED",
      uploadedAt: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to upload document" }, { status: 500 });
  }
}
