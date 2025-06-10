import { NextResponse } from "next/server";

import { signOut } from "@/auth";
import handleError from "@/lib/handlers/error";
import { APIErrorResponse } from "@/types/global";

export async function GET() {
  try {
    await signOut({ redirect: false });

    return NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
