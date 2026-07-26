import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { token, email } = await request.json();

    if (!token || !email) {
      return NextResponse.json(
        { error: "Verification token and email are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "signup",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Update Prisma User record emailVerified = true
    if (data.user) {
      await prisma.user.updateMany({
        where: {
          OR: [{ supabaseId: data.user.id }, { email: data.user.email! }]
        },
        data: { emailVerified: true }
      });
    }

    return NextResponse.json({
      success: true,
      message: "Email address successfully verified.",
      user: data.user,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to verify email address" },
      { status: 500 }
    );
  }
}
