"use client";

import dynamic from "next/dynamic";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import Header from "@/components/Header";
import NewsCard from "@/components/NewsCard";
import { NewsArticle } from "@/types/news";

const NewsGlobe = dynamic(() => import("@/components/NewsGlobe"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[520px] w-full items-center justify-center lg:h-[600px]">
      <div className="h-72 w-72 animate-pulse rounded-full bg-blue-500/10 blur-sm" />
    </div>
  ),
});

const typingMessages = [
  "Discover what's happening today.",
  "Understand the story behind the headline.",
  "Stay curious. Stay informed.",
];

export default function Home() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    async function loadNews() {
      setSearchError("");

      try {
        const endpoint = category
          ? `/api/news/search?category=${encodeURIComponent(category)}`
          : "/api/news/search";

        const response = await fetch(endpoint);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load news");
        }

        setArticles(data.articles);
      } catch {
        setArticles([]);
        setSearchError("Unable to load news right now. Please try again.");
      }
    }

    loadNews();
  }, [category]);

  useEffect(() => {
    let messageIndex = 0;
    let characterIndex = 0;
    let isDeleting = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    function typeMessage() {
      const currentMessage = typingMessages[messageIndex];

      if (!isDeleting) {
        characterIndex += 1;
        setTypedText(currentMessage.slice(0, characterIndex));

        if (characterIndex === currentMessage.length) {
          isDeleting = true;
          timeoutId = setTimeout(typeMessage, 1800);
          return;
        }
      } else {
        characterIndex -= 1;
        setTypedText(currentMessage.slice(0, characterIndex));

        if (characterIndex === 0) {
          isDeleting = false;
          messageIndex = (messageIndex + 1) % typingMessages.length;
        }
      }

      timeoutId = setTimeout(typeMessage, isDeleting ? 35 : 65);
    }

    typeMessage();

    return () => clearTimeout(timeoutId);
  }, []);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) {
      return;
    }

    setIsSearching(true);
    setSearchError("");

    try {
      const response = await fetch(
        `/api/news/search?q=${encodeURIComponent(query)}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to search news");
      }

      setArticles(data.articles);
    } catch {
      setArticles([]);
      setSearchError("Unable to search news right now. Please try again.");
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      <section className="relative overflow-hidden border-b bg-gradient-to-br from-blue-50 via-white to-indigo-50">
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />
    <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-3xl" />
  </div>

  <div className="relative mx-auto grid max-w-7xl items-center gap-4 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-0 lg:px-8 lg:py-14">
    <div className="relative z-10 max-w-2xl">
      <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm backdrop-blur">
        <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
        AI-Powered News
      </div>

      <h1 className="mt-7 text-5xl font-extrabold leading-[0.95] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
        Stay informed.
        <br />
        <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
          Understand more.
        </span>
      </h1>

      <div className="mt-7 flex min-h-8 items-center text-lg font-medium text-slate-600 sm:text-xl">
        <span>{typedText}</span>
        <span className="ml-1 inline-block h-6 w-px animate-pulse bg-blue-600" />
      </div>

      <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
        Discover the latest stories from trusted sources, search the topics
        that matter to you, and make sense of the news with AI.
      </p>

      <form
        onSubmit={handleSearch}
        className="mt-8 flex max-w-2xl items-center rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-blue-900/5 transition-all duration-300 focus-within:border-blue-400 focus-within:shadow-2xl focus-within:shadow-blue-500/10"
      >
        <Search className="ml-4 h-5 w-5 shrink-0 text-slate-400" />

        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search for news, topics, or stories..."
          className="h-12 flex-1 bg-transparent px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 sm:text-base"
        />

        <button
          type="submit"
          disabled={isSearching}
          className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSearching ? "Searching..." : "Search"}
        </button>
      </form>

      <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <span className="mr-1 font-medium">Trending:</span>

        {["AI", "Technology", "Business", "Sports"].map((topic) => (
          <button
            key={topic}
            type="button"
            onClick={() => setSearchQuery(topic)}
            className="rounded-full border border-blue-100 bg-white/80 px-3.5 py-1.5 font-medium text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
          >
            {topic}
          </button>
        ))}
      </div>
    </div>

    <div className="relative -my-4 flex min-h-[520px] items-center justify-center lg:-my-8 lg:min-h-[600px]">
      <div className="absolute h-[380px] w-[380px] rounded-full bg-blue-500/10 blur-3xl lg:h-[500px] lg:w-[500px]" />

      <div className="relative z-10 w-full">
        <NewsGlobe />
      </div>

      <div className="pointer-events-none absolute right-4 top-16 hidden rounded-2xl border border-white/40 bg-white/70 px-4 py-3 shadow-lg backdrop-blur-md sm:block lg:right-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          Connected World
        </p>
        <p className="mt-1 text-sm font-medium text-slate-700">
          News travels everywhere.
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-16 left-4 hidden rounded-2xl border border-white/40 bg-white/80 px-5 py-4 shadow-xl backdrop-blur-md sm:block lg:left-0">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
            <span className="text-lg font-bold">N</span>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500">
              Global Stories
            </p>
            <p className="text-lg font-bold text-slate-900">
              One connected world
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div className="pointer-events-none absolute bottom-0 left-0 h-16 w-full bg-gradient-to-t from-white/80 to-transparent" />
</section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                News Feed
              </span>
            </div>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {searchQuery.trim()
                ? "Search Results"
                : category
                  ? `${category.charAt(0).toUpperCase()}${category.slice(1)} News`
                  : "Latest News"}
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              {searchQuery.trim()
                ? `Discover the latest stories matching "${searchQuery.trim()}".`
                : category
                  ? `Stay updated with the latest ${category} stories.`
                  : "Stay up to date with the latest stories from trusted sources."}
            </p>
          </div>

          {articles.length > 0 && (
            <span className="w-fit rounded-full border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
              {articles.length} stories
            </span>
          )}
        </div>

        {searchError && (
          <p className="mt-8 text-center text-sm text-destructive">
            {searchError}
          </p>
        )}

        {!searchError && articles.length === 0 && (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Search for a topic to discover news.
          </p>
        )}

        {articles.length > 0 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.slice(0, 6).map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>

     <footer className="border-t bg-muted/30">
  <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <span className="text-sm font-bold">N</span>
          </div>

          <span className="text-xl font-bold tracking-tight">
            NewsHub
          </span>
        </div>

        <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
          A smarter way to discover, explore, and understand the latest
          news from trusted sources.
        </p>

        <p className="mt-5 text-xs text-muted-foreground">
          Built with Next.js, TypeScript, and AI.
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground">
          Explore
        </h3>

        <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
          <Link
            href="/"
            className="w-fit transition-colors duration-200 hover:text-primary"
          >
            Latest News
          </Link>

          <Link
            href="/?category=technology"
            className="w-fit transition-colors duration-200 hover:text-primary"
          >
            Technology
          </Link>

          <Link
            href="/?category=business"
            className="w-fit transition-colors duration-200 hover:text-primary"
          >
            Business
          </Link>

          <Link
            href="/?category=sports"
            className="w-fit transition-colors duration-200 hover:text-primary"
          >
            Sports
          </Link>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground">
          About
        </h3>

        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          NewsHub brings news from multiple sources into one clean,
          easy-to-use experience.
        </p>
      </div>
    </div>

    <div className="mt-10 flex flex-col gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <p>© 2026 NewsHub. All rights reserved.</p>

      <p>
        Made for curious minds.
      </p>
    </div>
  </div>
</footer>
    </main>
  );
}