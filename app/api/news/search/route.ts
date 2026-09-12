import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import UserPreference from "@/lib/models/UserPreference";
import { NewsArticle } from "@/types/news";

type NewsDataArticle = {
  article_id: string;
  title: string;
  description: string | null;
  link: string;
  creator: string[] | null;
  category: string[] | null;
  pubDate: string;
  image_url: string | null;
  source_name?: string;
};

type NewsDataResponse = {
  status: string;
  results: NewsDataArticle[];
};

function formatArticles(results: NewsDataArticle[]): NewsArticle[] {
  return results.map((article) => ({
    id: article.article_id,
    title: article.title,
    description: article.description ?? "",
    imageUrl: article.image_url,
    source: article.source_name ?? "Unknown Source",
    author: article.creator?.[0] ?? null,
    publishedAt: article.pubDate,
    url: article.link,
    category: article.category?.[0] ?? "General",
  }));
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.NEWS_DATA_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "NEWS_DATA_API_KEY is not configured" },
      { status: 500 },
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q")?.trim();
  const category = searchParams.get("category")?.trim();

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    let preferredCategories: string[] = [];

    if (session?.user) {
      await connectToDatabase();

      const preferences = await UserPreference.findOne({
        userId: session.user.id,
      }).lean();

      preferredCategories = preferences?.categories ?? [];
    }

    const personalizedCategories =
      !query && !category
        ? preferredCategories.slice(0, 5)
        : [];

    const selectedCategories = category
      ? category
      : personalizedCategories.join(",");

    const url = new URL("https://newsdata.io/api/1/latest");

    url.searchParams.set("apikey", apiKey);
    url.searchParams.set("language", "en");
    url.searchParams.set("country", "in");

    if (query) {
      url.searchParams.set("q", query);
    }

    if (selectedCategories) {
      url.searchParams.set("category", selectedCategories);
    }

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `NewsData API request failed: ${response.status}` },
        { status: response.status },
      );
    }

    const data: NewsDataResponse = await response.json();

    if (data.status !== "success") {
      return NextResponse.json(
        { error: "NewsData API returned an unsuccessful response" },
        { status: 502 },
      );
    }

    return NextResponse.json({
      articles: formatArticles(data.results),
      personalized: Boolean(
        session?.user && personalizedCategories.length,
      ),
      preferences: personalizedCategories,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to fetch news at the moment" },
      { status: 500 },
    );
  }
}