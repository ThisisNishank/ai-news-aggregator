"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const categories = [
  { value: "technology", label: "Technology" },
  { value: "business", label: "Business" },
  { value: "sports", label: "Sports" },
  { value: "science", label: "Science" },
  { value: "health", label: "Health" },
  { value: "entertainment", label: "Entertainment" },
];

export default function PreferencesPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [language, setLanguage] = useState("en");
  const [country, setCountry] = useState("in");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (!session) {
      router.replace("/login");
      return;
    }

    async function loadPreferences() {
      try {
        const response = await fetch("/api/preferences");

        if (!response.ok) {
          throw new Error("Unable to fetch preferences");
        }

        const data = await response.json();
        const preferences = data.preferences;

        setSelectedCategories(preferences.categories ?? []);
        setLanguage(preferences.language ?? "en");
        setCountry(preferences.country ?? "in");
      } catch {
        setMessage("Unable to load your preferences.");
      } finally {
        setIsLoading(false);
      }
    }

    loadPreferences();
  }, [isPending, session, router]);

  function toggleCategory(category: string) {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  }

  async function handleSave() {
    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categories: selectedCategories,
          language,
          country,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to save preferences");
      }

      setMessage("Preferences saved successfully.");
    } catch {
      setMessage("Unable to save your preferences.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isPending || isLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </main>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Settings className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Your Preferences
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Customize the news you want to see on KhabarJunction.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-lg font-semibold">
              Choose your favorite categories
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Select one or more topics you're interested in.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => {
                const isSelected = selectedCategories.includes(
                  category.value,
                );

                return (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => toggleCategory(category.value)}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-primary/5"
                    }`}
                  >
                    <span>{category.label}</span>

                    {isSelected && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="language"
                className="text-sm font-semibold"
              >
                Language
              </label>

              <select
                id="language"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="en">English</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="country"
                className="text-sm font-semibold"
              >
                Country
              </label>

              <select
                id="country"
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm uppercase outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="in">India</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm">
              {message && (
                <p
                  className={
                    message.includes("successfully")
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {message}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {isSaving ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}