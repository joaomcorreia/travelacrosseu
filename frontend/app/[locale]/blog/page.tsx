import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchBlogPosts, fetchBlogCategories, type BlogPost, type BlogCategory } from "@/lib/api/blog";
import { isSupportedLocale, type Locale } from "@/lib/locales";
import { buildSeoMetadata } from "@/lib/seo";

type BlogIndexPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: {
  params: BlogIndexPageProps["params"];
}) {
  const { locale } = await params;
  const safeLocale = isSupportedLocale(locale) ? locale : "en";

  // Create CMS data for blog index page
  const cmsData = {
    title: "Travel Blog - Stories, Tips & Guides",
    meta_title: "Travel Blog - Stories, Tips & Guides | TravelAcrossEU",
    meta_description: "Discover inspiring travel stories, expert tips, and comprehensive guides for your European adventures. From hidden gems to cultural insights.",
    body: "Explore our collection of travel stories, practical tips, and destination guides for European adventures."
  };

  return buildSeoMetadata({
    locale: safeLocale,
    slug: 'blog',
    cmsData,
    contentType: 'static',
    pagePath: `/${safeLocale}/blog`
  });
}

export default async function BlogIndexPage({
  params,
}: BlogIndexPageProps) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const activeLocale = locale as Locale;

  // Fetch blog posts and categories
  let posts: BlogPost[] = [];
  let categories: BlogCategory[] = [];

  try {
    [posts, categories] = await Promise.all([
      fetchBlogPosts(undefined, activeLocale),
      fetchBlogCategories()
    ]);
  } catch (error) {
    console.error(`Failed to fetch blog data for /${locale}/blog:`, error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Travel Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover inspiring stories, expert tips, and comprehensive guides for your European adventures
          </p>
        </div>

        {/* Categories Section */}
        {categories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Browse by Category
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/${activeLocale}/blog/category/${category.slug}`}
                  className="inline-flex items-center px-6 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300"
                >
                  <span className="font-medium text-gray-900">{category.name}</span>
                  <span className="ml-2 text-sm text-gray-500">({category.posts_count})</span>
                </Link>
              ))}
            </div>
          </div>
        )}

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
                    <div className="w-full h-48 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">{post.title[0]}</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {post.category.name}
                    </span>
                    <time className="text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString()}
                    </time>
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
                  {post.translation_missing && (
                    <div className="mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                      Translation missing for {activeLocale}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No blog posts yet</h2>
            <p className="text-gray-600">
              Blog posts will appear here once they are published in the CMS.
            </p>
          </div>
        )}

        {/* Back to home */}
        <div className="text-center mt-12">
          <Link
            href={`/${activeLocale}`}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
