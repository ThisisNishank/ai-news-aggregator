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

export async function getLatestNews(): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWS_DATA_API_KEY;

  if (!apiKey) {
    throw new Error("NEWS_DATA_API_KEY is not configured");
  }

  const url = new URL("https://newsdata.io/api/1/latest");

  url.searchParams.set("apikey", apiKey);
  url.searchParams.set("language", "en");
  url.searchParams.set("country", "in");

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`NewsData API request failed: ${response.status}`);
  }

  const data: NewsDataResponse = await response.json();

  if (data.status !== "success") {
    throw new Error("NewsData API returned an unsuccessful response");
  }

  return data.results.map((article) => ({
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