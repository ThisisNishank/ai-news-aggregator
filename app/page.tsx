"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import Header from "@/components/Header";
import NewsCard from "@/components/NewsCard";
import { NewsArticle } from "@/types/news";

const NewsGlobe = dynamic(() => import("@/components/NewsGlobe"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[460px] w-full items-center justify-center lg:h-[560px]">
      <div className="h-64 w-64 animate-pulse rounded-full bg-blue-500/10 blur-sm" />
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
  const router = useRouter();

  const category = searchParams.get("category");
  const searchQuery = searchParams.get("q") ?? "";

  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [searchError, setSearchError] = useState("");
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    async function loadNews() {
      setSearchError("");

      try {
        const params = new URLSearchParams();

        if (category) {
          params.set("category", category);
        }

        if (searchQuery) {
          params.set("q", searchQuery);
        }

        const endpoint = params.toString()
          ? `/api/news/search?${params.toString()}`
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
  }, [category, searchQuery]);

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

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="absolute right-0 top-0 h-[520px] w-[520px] rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-start px-4 pb-16 pt-8 sm:px-6 md:pb-20 md:pt-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-8">
          <div className="relative z-20 max-w-2xl pt-0 lg:pr-4 lg:pt-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm backdrop-blur-md">
              <Sparkles className="h-4 w-4" />
              AI-Powered News
            </div>

            <h1 className="mt-6 text-[3.25rem] font-extrabold leading-[0.94] tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-[4.7rem]">
              Stay informed.
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Understand more.
              </span>
            </h1>

            <div className="mt-7 flex min-h-7 items-center text-base font-medium text-slate-500 sm:text-lg">
              <span>{typedText}</span>
              <span className="ml-1 inline-block h-5 w-px animate-pulse bg-blue-600" />
            </div>

            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Discover trusted stories from around the world, explore the
              topics that matter to you, and gain a clearer perspective on
              what&apos;s happening.
            </p>

            
          </div>

          <div className="relative -mr-4 -mt-12 flex min-h-[500px] items-start justify-center sm:-mr-8 lg:-mr-10 lg:-mt-12 lg:min-h-[500px]">
            <div className="absolute h-[320px] w-[320px] rounded-full bg-blue-500/15 blur-3xl sm:h-[400px] sm:w-[400px] lg:h-[450px] lg:w-[450px]" />

            <div className="relative z-10 w-full">
              <NewsGlobe />
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 h-10 w-full bg-gradient-to-t from-white/90 to-transparent" />
      </section>


<section className="relative overflow-hidden bg-gradient-to-br from-blue-50/70 via-white to-indigo-50/70">
  <div className="pointer-events-none absolute inset-0">
    <div className="absolute -left-32 top-10 h-64 w-64 rounded-full bg-blue-400/5 blur-3xl" />
    <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-indigo-400/5 blur-3xl" />
  </div>

  <div className="relative mx-auto max-w-7xl px-4 -translate-y-16 py-14 sm:px-6 lg:px-8">
    <div className="text-center">
      <div className="flex items-center justify-center gap-3">
        <span className="text-3xl font-bold text-blue-600">✦</span>

        <h2 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
          Trending{" "}
          <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            Now
          </span>
        </h2>
      </div>

      <p className="mt-3 text-base text-slate-500 sm:text-lg">
        Explore what&apos;s capturing the world&apos;s attention right now.
      </p>
    </div>

    <div className="mt-10 flex items-center justify-center gap-4">
      {[
        {
          name: "AI",
          icon: "✦",
          active: true,
        },
        {
          name: "Technology",
          icon: "⌘",
          active: false,
        },
        {
          name: "Business",
          icon: "▥",
          active: false,
        },
        {
          name: "Sports",
          icon: "🏆",
          active: false,
        },
        {
          name: "Science",
          icon: "⚗",
          active: false,
        },
      ].map((topic) => (
        <button
          key={topic.name}
          type="button"
          onClick={() =>
            router.push(`/?q=${encodeURIComponent(topic.name)}`)
          }
          className={`group flex h-20 min-w-[190px] items-center justify-between rounded-2xl border px-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
            topic.active
              ? "border-blue-400 bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700"
              : "border-slate-200 bg-white text-slate-800 shadow-sm hover:border-blue-300 hover:shadow-blue-500/10"
          }`}
        >
          <span
            className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl transition-transform duration-300 group-hover:scale-110 ${
              topic.active
                ? "bg-white/15"
                : "bg-slate-100 text-blue-600 group-hover:bg-blue-50"
            }`}
          >
            {topic.icon}
          </span>

          <span className="text-base font-bold">{topic.name}</span>

          <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      ))}
    </div>
  </div>
</section>


      <section className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />

              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                News Feed
              </span>
            </div>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {searchQuery
                ? "Search Results"
                : category
                  ? `${category.charAt(0).toUpperCase()}${category.slice(1)} News`
                  : "Latest News"}
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              {searchQuery
                ? `Discover the latest stories matching "${searchQuery}".`
                : category
                  ? `Stay updated with the latest ${category} stories.`
                  : "Stay up to date with the latest stories from trusted sources."}
            </p>
          </div>

          {articles.length > 0 && (
            <span className="w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
              {articles.length} stories
            </span>
          )}
        </div>

        {searchError && (
          <p className="mt-8 text-center text-sm text-red-500">
            {searchError}
          </p>
        )}

        {!searchError && articles.length === 0 && (
          <p className="mt-8 text-center text-sm text-slate-500">
            No news stories found.
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

      <footer className="border-t bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
                  <span className="text-sm font-bold">N</span>
                </div>

                <span className="text-xl font-bold tracking-tight">
                  NewsHub
                </span>
              </div>

              <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">
                A smarter way to discover, explore, and understand the latest
                news from trusted sources.
              </p>

              <p className="mt-5 text-xs text-slate-400">
                Built with Next.js, TypeScript, and AI.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Explore
              </h3>

              <div className="mt-4 flex flex-col gap-3 text-sm text-slate-500">
                <Link
                  href="/"
                  className="w-fit transition-colors duration-200 hover:text-blue-600"
                >
                  Latest News
                </Link>

                <Link
                  href="/?category=technology"
                  className="w-fit transition-colors duration-200 hover:text-blue-600"
                >
                  Technology
                </Link>

                <Link
                  href="/?category=business"
                  className="w-fit transition-colors duration-200 hover:text-blue-600"
                >
                  Business
                </Link>

                <Link
                  href="/?category=sports"
                  className="w-fit transition-colors duration-200 hover:text-blue-600"
                >
                  Sports
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                About
              </h3>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                NewsHub brings news from multiple sources into one clean,
                easy-to-use experience.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 NewsHub. All rights reserved.</p>
            <p>Made for curious minds.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}