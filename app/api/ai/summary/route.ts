import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateArticleSummary } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in to use AI summaries" },
        { status: 401 },
      );
    }

    const body = await request.json();

    const title =
      typeof body.title === "string" ? body.title.trim() : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    if (!title) {
      return NextResponse.json(
        { error: "Article title is required" },
        { status: 400 },
      );
    }

    if (title.length > 500 || description.length > 5000) {
      return NextResponse.json(
        { error: "Article content is too long" },
        { status: 400 },
      );
    }

    const summary = await generateArticleSummary(
      title,
      description,
    );
    
    return NextResponse.json(summary);
  } catch (error) {
    console.error("AI summary error:", error);

    return NextResponse.json(
      { error: "Unable to generate AI summary" },
      { status: 500 },
    );
  }
}