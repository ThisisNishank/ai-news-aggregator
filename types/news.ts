export type NewsArticle = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  source: string;
  author: string | null;
  publishedAt: string;
  url: string;
  category: string;
};