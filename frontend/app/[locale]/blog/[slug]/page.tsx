import { notFound } from "next/navigation";
import Link from "next/link";
import SectionRenderer from "@/components/cms/SectionRenderer";
import { fetchBlogPost, type BlogPost } from "@/lib/api/blog";
import { isSupportedLocale, type Locale } from "@/lib/locales";
import { buildBlogPostMetadata } from "@/lib/seo";

type BlogPostDetailPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: {
  params: BlogPostDetailPageProps["params"];
}) {
  const { locale, slug } = await params;
  const safeLocale = isSupportedLocale(locale) ? locale : "en";

  // Try to fetch blog post for metadata
  let post: BlogPost | null = null;
  
  try {
    post = await fetchBlogPost(slug, safeLocale);
  } catch (error) {
    console.warn("Failed to fetch blog post for SEO metadata:", error);
  }

  return buildBlogPostMetadata(safeLocale, slug, post || undefined);
}

export default async function BlogPostDetailPage({
  params,
}: BlogPostDetailPageProps) {
  const { locale, slug } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const activeLocale = locale as Locale;

  // Fetch blog post
  let post: BlogPost | null = null;

  try {
    post = await fetchBlogPost(slug, activeLocale);
  } catch (error) {
    console.error(`Failed to fetch blog post ${slug}:`, error);
    notFound();
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
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
              <Link href={`/${activeLocale}/blog/category/${post.category.slug}`} className="hover:text-blue-600">
                {post.category.name}
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{post.title}</span>
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="mb-12">
          {post.hero_image && (
            <div className="mb-6 relative h-64 md:h-96">
              <Image
                src={post.hero_image.includes('travel-stories/') ? `/images/blog/travel-stories/${post.hero_image.split('/').pop()}` : post.hero_image}
                alt={post.title}
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </div>
          )}
          <div className="max-w-4xl mx-auto text-center">
            {/* Category and Date */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Link
                href={`/${activeLocale}/blog/category/${post.category.slug}`}
                className="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full hover:bg-blue-200 transition-colors"
              >
                {post.category.name}
              </Link>
              <time className="text-gray-500 text-sm">
                {new Date(post.created_at).toLocaleDateString(activeLocale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>
            
            {post.subtitle && (
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {post.subtitle}
              </p>
            )}

            {post.translation_missing && (
              <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm mb-6">
                <span className="mr-2">⚠️</span>
                Translation missing for {activeLocale} - showing available content
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Main Body Text */}
          {post.body && (
            <div className="prose prose-lg max-w-none mb-12">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {post.body}
              </div>
            </div>
          )}

          {/* Dynamic Sections */}
          {post.sections && post.sections.length > 0 && (
            <div className="space-y-12 mb-12">
              <div className="space-y-8">
                {post.sections.map((section) => (
                  <SectionRenderer key={section.id} section={section} />
                ))}
              </div>
            </div>
          )}

          {/* No content message */}
          {!post.body && (!post.sections || post.sections.length === 0) && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Content coming soon</h2>
              <p className="text-gray-600">
                Content for this blog post will appear here once it's published in the CMS.
              </p>
            </div>
          )}
        </div>

        {/* Back Navigation and Related Content */}
        <div className="max-w-4xl mx-auto mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href={`/${activeLocale}/blog/category/${post.category.slug}`}
              className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-center"
            >
              ← More {post.category.name}
            </Link>
            <Link
              href={`/${activeLocale}/blog`}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              All Blog Posts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}