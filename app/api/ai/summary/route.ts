import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import AISummary from "@/lib/models/AISummary";
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

    const articleId =
      typeof body.articleId === "string" ? body.articleId.trim() : "";

    const title =
      typeof body.title === "string" ? body.title.trim() : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    if (!articleId || !title) {
      return NextResponse.json(
        { error: "Article ID and title are required" },
        { status: 400 },
      );
    }

    if (articleId.length > 300 || title.length > 500 || description.length > 5000) {
      return NextResponse.json(
        { error: "Article information is too long" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const cachedSummary = await AISummary.findOne({
      articleId,
    }).lean();

    if (cachedSummary) {
      return NextResponse.json({
        summary: cachedSummary.summary,
        keyTakeaways: cachedSummary.keyTakeaways,
        cached: true,
      });
    }

    const generatedSummary = await generateArticleSummary(
      title,
      description,
    );

    const savedSummary = await AISummary.findOneAndUpdate(
      {
        articleId,
      },
      {
        articleId,
        title,
        description,
        summary: generatedSummary.summary,
        keyTakeaways: generatedSummary.keyTakeaways,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    ).lean();

    return NextResponse.json({
      summary: savedSummary?.summary ?? generatedSummary.summary,
      keyTakeaways:
        savedSummary?.keyTakeaways ?? generatedSummary.keyTakeaways,
      cached: false,
    });
  } catch (error) {
    console.error("AI summary error:", error);

    return NextResponse.json(
      { error: "Unable to generate AI summary" },
      { status: 500 },
    );
  }
}