import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import SavedArticle from "@/lib/models/SavedArticle";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in to save articles" },
        { status: 401 },
      );
    }

    const article = await request.json();

    if (!article.id || !article.title || !article.url) {
      return NextResponse.json(
        { error: "Missing required article information" },
        { status: 400 },
      );
    }

    await connectToDatabase();

 const savedArticle = await SavedArticle.findOneAndUpdate(
  {
    userId: session.user.id,
    articleId: article.id,
  },
  {
    userId: session.user.id,
    articleId: article.id,
    title: article.title,
    description: article.description ?? "",
    imageUrl: article.imageUrl ?? undefined,
    source: article.source ?? "Unknown Source",
    publishedAt: new Date(article.publishedAt),
    url: article.url,
    category: article.category ?? "General",
  },
  {
    new: true,
    upsert: true,
  },
);

    return NextResponse.json({ article: savedArticle });
  } catch {
    return NextResponse.json(
      { error: "Unable to save article" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in to remove saved articles" },
        { status: 401 },
      );
    }

    const articleId = request.nextUrl.searchParams.get("articleId");

    if (!articleId) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    await SavedArticle.deleteOne({
      userId: session.user.id,
      articleId,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to remove saved article" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in to view saved articles" },
        { status: 401 },
      );
    }

    await connectToDatabase();

    const articles = await SavedArticle.find({
      userId: session.user.id,
    }).sort({ createdAt: -1 });

    return NextResponse.json({ articles });
  } catch {
    return NextResponse.json(
      { error: "Unable to fetch saved articles" },
      { status: 500 },
    );
  }
}