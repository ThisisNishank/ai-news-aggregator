import { NextRequest, NextResponse } from "next/server";
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

export async function GET(request: NextRequest) {
  const apiKey = process.env.NEWS_DATA_API_KEY;
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q")?.trim();

  if (!apiKey) {
    return NextResponse.json(
      { error: "NEWS_DATA_API_KEY is not configured" },
      { status: 500 },
    );
  }

 

  const url = new URL("https://newsdata.io/api/1/latest");

  url.searchParams.set("apikey", apiKey);
  if (query) {
  url.searchParams.set("q", query);
}
  url.searchParams.set("language", "en");
  url.searchParams.set("country", "in");

  try {
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

    const articles: NewsArticle[] = data.results.map((article) => ({
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

    return NextResponse.json({ articles });
  } catch {
    return NextResponse.json(
      { error: "Unable to fetch news at the moment" },
      { status: 500 },
    );
  }
}