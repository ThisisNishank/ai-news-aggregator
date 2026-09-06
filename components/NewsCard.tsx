type NewsCardProps = {
  category: string;
  title: string;
  description: string;
};

export default function NewsCard({
  category,
  title,
  description,
}: NewsCardProps) {
  return (
    <article className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-md">
      <div className="h-40 rounded-lg bg-muted" />

      <div className="mt-5">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">
          {category}
        </p>

        <h3 className="mt-2 text-lg font-semibold">{title}</h3>

        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
    </article>
  );
}