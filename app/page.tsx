import { Search } from "lucide-react";
import Header from "@/components/Header";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-muted px-3 py-1 text-sm font-medium">
            AI-Powered News
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Stay informed.
            <br />
            <span className="text-primary">Understand more.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Discover the latest news from trusted sources, summarized and
            organized with the help of AI.
          </p>

          {/* Search */}
          <div className="mx-auto mt-8 flex max-w-2xl items-center rounded-xl border bg-background p-2 shadow-sm">
            <Search className="ml-3 h-5 w-5 text-muted-foreground" />

            <input
              type="text"
              placeholder="Search for news..."
              className="h-11 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
            />

            <button
              type="button"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Search
            </button>
          </div>
        </div>

        {/* Latest News */}
        <div className="mt-20">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="text-2xl font-bold">Latest News</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                The latest stories from around the world
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <article
                key={item}
                className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <div className="h-40 rounded-lg bg-muted" />

                <div className="mt-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-primary">
                    Technology
                  </p>

                  <h3 className="mt-2 text-lg font-semibold">
                    News article will appear here
                  </h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Real news articles will be fetched from our news APIs in
                    the next development stage.
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:px-6 lg:px-8">
          <p className="font-medium text-foreground">NewsHub</p>

          <p>
            AI-powered news aggregation built with Next.js and TypeScript.
          </p>
        </div>
      </footer>
    </main>
  );
}