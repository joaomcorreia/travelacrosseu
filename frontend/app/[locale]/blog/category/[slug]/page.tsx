import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchBlogCategory, type BlogCategoryWithPosts } from "@/lib/api/blog";
import { isSupportedLocale, type Locale } from "@/lib/locales";
import { buildBlogCategoryMetadata } from "@/lib/seo";

type BlogCategoryPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: {
  params: BlogCategoryPageProps["params"];
}) {
  const { locale, slug } = await params;
  const safeLocale = isSupportedLocale(locale) ? locale : "en";

  // Try to fetch category for metadata
  let categoryData: BlogCategoryWithPosts | null = null;
  try {
    categoryData = await fetchBlogCategory(slug, safeLocale);
  } catch (error) {
    console.warn("Failed to fetch blog category for SEO metadata:", error);
  }

  // Transform category data for SEO helper
  const cmsData = categoryData ? {
    title: categoryData.category.name,
    meta_title: `${categoryData.category.name} - Travel Blog | TravelAcrossEU`,
    meta_description: `Explore ${categoryData.category.name.toLowerCase()} articles and guides for your European adventures. Expert insights and travel stories.`,
    body: `Discover our collection of ${categoryData.category.name.toLowerCase()} articles and travel guides.`
  } : undefined;

  return buildBlogCategoryMetadata(safeLocale, slug, cmsData);
}

export default async function BlogCategoryPage({
  params,
}: BlogCategoryPageProps) {
  const { locale, slug } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const activeLocale = locale as Locale;

  // Fetch category data
  let categoryData: BlogCategoryWithPosts | null = null;

  try {
    categoryData = await fetchBlogCategory(slug, activeLocale);
  } catch (error) {
    console.error(`Failed to fetch blog category ${slug}:`, error);
    notFound();
  }

  if (!categoryData) {
    notFound();
  }

  const { category, posts } = categoryData;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href={`/${activeLocale}/blog`} className="hover:text-blue-600">
                Blog
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{category.name}</span>
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {category.name}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our collection of {category.name.toLowerCase()} articles and guides for your European adventures
          </p>
          <div className="mt-4 text-sm text-gray-500">
            {posts.length} {posts.length === 1 ? 'article' : 'articles'} in this category
          </div>
        </div>

        {/* Blog Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/${activeLocale}/blog/${post.slug}`}
                className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  {post.hero_image ? (
                    <Image
                      src={post.hero_image.includes('travel-stories/') ? `/images/blog/travel-stories/${post.hero_image.split('/').pop()}` : post.hero_image}
                      alt={post.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-r from-green-400 to-blue-500 rounded-t-lg flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">{post.title[0]}</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <time className="text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString()}
                    </time>
                    {post.translation_missing && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        Translation missing
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  {post.subtitle && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {post.subtitle}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{post.sections?.length || 0} sections</span>
                    <span className="text-blue-600 group-hover:text-blue-800">Read more →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No posts yet</h2>
            <p className="text-gray-600">
              Articles in {category.name} will appear here once they are published.
            </p>
          </div>
        )}

        {/* Back navigation */}
        <div className="text-center mt-12">
          <Link
            href={`/${activeLocale}/blog`}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to all blog posts
          </Link>
        </div>
      </div>
    </div>
  );
}