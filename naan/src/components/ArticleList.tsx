import Link from "next/link";
import Image from "next/image";
import { Article } from "@/gql/graphql";

interface ArticleListProps {
  articles: Partial<Article>[];
}

export default function ArticleList({ articles }: ArticleListProps) {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
      <div className="mx-auto max-w-2xl lg:text-center mb-12">
        <h2 className="text-base font-semibold leading-7 text-blue-600">
          All Articles
        </h2>
        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Explore Knowledge
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.slug}`}
            className="group flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={article.thumbnail || "/images/placeholder.png"} 
                alt={article.title || "Article thumbnail"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-6">
              <div className="flex-1">
                <p className="text-sm font-medium text-indigo-600">
                  {article.category}
                </p>
                <div className="mt-2 block">
                  <p className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {article.title}
                  </p>
                  {}
                  {}
                </div>
              </div>
              <div className="mt-6 flex items-center">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100">
                  {article.author?.avatar ? (
                    <Image
                      src={article.author.avatar}
                      alt={article.author.name || "Author"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-gray-500">
                      {article.author?.name?.[0] || "?"}
                    </span>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {article.author?.name || "Unknown Author"}
                  </p>
                  <div className="flex space-x-1 text-sm text-gray-500">
                    <time dateTime={article.createdAt}>
                      {new Date(article.createdAt).toLocaleDateString()}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
