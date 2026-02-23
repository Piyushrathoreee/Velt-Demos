import { NextRequest, NextResponse } from "next/server";

// [Velt] JWT Token Generation
const VELT_API_KEY = process.env.NEXT_PUBLIC_VELT_API_KEY;
const VELT_AUTH_TOKEN = process.env.VELT_AUTH_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, organizationId, email } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    if (!VELT_API_KEY || !VELT_AUTH_TOKEN) {
      console.error("[Velt] Missing VELT API credentials");
      return NextResponse.json(
        { error: "Velt credentials not configured" },
        { status: 500 },
      );
    }

    const response = await fetch("https://api.velt.dev/v2/auth/token/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-velt-api-key": VELT_API_KEY,
        "x-velt-auth-token": VELT_AUTH_TOKEN,
      },
      body: JSON.stringify({
        data: {
          userId,
          userProperties: {
            organizationId: organizationId || "default-org",
            email: email || "",
          },
        },
      }),
    });

    if (!response.ok) {
      console.error("[Velt] Token API error:", await response.text());
      return NextResponse.json(
        { error: "Failed to generate token" },
        { status: 500 },
      );
    }

    const json = await response.json();
    const token = json?.result?.data?.token;
    if (!token) {
      return NextResponse.json(
        { error: "Invalid token response" },
        { status: 500 },
      );
    }

    return NextResponse.json({ token });
  } catch (error) {
    console.error("[Velt] Token generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
