import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { action, status } = body;

  return NextResponse.json({
    success: true,
    id,
    action,
    status: status || "SENT",
    message: `Notification ${id} executed action ${action} successfully.`,
    timestamp: new Date().toISOString()
  });
}
