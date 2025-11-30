import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchBlogPosts, fetchBlogCategories, type BlogPost, type BlogCategory } from "@/lib/api/blog";
import { isSupportedLocale, type Locale } from "@/lib/locales";
import { buildSeoMetadata } from "@/lib/seo";
import { PageWithSidebar } from "@/components/layout/PageWithSidebar";
import { SidebarCard, SidebarLink, SidebarList } from "@/components/layout/SidebarComponents";
import SidebarPromoCard from "@/components/sidebar/SidebarPromoCard";
import { buildSectionUrl } from "@/lib/localized-slugs";

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
    pagePath: buildSectionUrl('blog', safeLocale)
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

  // Sidebar content
  const sidebar = (
    <>
      {/* Search (placeholder for now) */}
      <SidebarCard title="Search">
        <div className="relative">
          <input
            type="text"
            placeholder="Search posts..."
            disabled
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-500"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">Search functionality coming soon</p>
      </SidebarCard>

      {/* Categories */}
      {categories.length > 0 && (
        <SidebarCard title="Categories">
          <SidebarList>
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between">
                <SidebarLink href={`${buildSectionUrl('blog', activeLocale)}/category/${category.slug}`}>
                  {category.name}
                </SidebarLink>
                <span className="text-xs text-slate-500">({category.posts_count})</span>
              </div>
            ))}
          </SidebarList>
        </SidebarCard>
      )}

      {/* Featured destination guide */}
      <SidebarPromoCard
        label="Featured guide"
        title="Weekend in Lisbon"
        description="Our most popular 48-hour guide for Portugal's capital."
        ctaLabel="Read guide"
        href="#"
        imageSrc="/images/sidebar/lisbon-weekend.jpg"
        imageAlt="Lisbon weekend guide"
        tone="blue"
      />

      {/* Recent posts */}
      {posts.length > 0 && (
        <SidebarCard title="Recent Posts">
          <SidebarList>
            {posts.slice(0, 5).map((post) => (
              <div key={post.slug} className="space-y-1">
                <SidebarLink href={`/${activeLocale}/blog/${post.slug}`}>
                  {post.title.length > 40 ? `${post.title.substring(0, 40)}...` : post.title}
                </SidebarLink>
                <p className="text-xs text-slate-500">
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })}
                </p>
              </div>
            ))}
          </SidebarList>
        </SidebarCard>
      )}

      {/* JCW Business Promo */}
      <SidebarPromoCard
        label="From us"
        title="Need a website for your travel business?"
        description="Launch a simple, hosted website with Just Code Works and start getting bookings online."
        ctaLabel="Learn more"
        href="#"
        tone="green"
      />

      {/* Cross-promo placeholder */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
        <h3 className="font-semibold text-slate-900 mb-2">About TravelAcrossEU</h3>
        <p className="text-sm text-slate-600 mb-3">
          Your guide to authentic European travel experiences, from hidden gems to practical tips.
        </p>
        <SidebarLink href={buildSectionUrl('about', activeLocale)}>Learn more about us</SidebarLink>
      </div>
    </>
  );

  return (
    <PageWithSidebar
      title="TravelAcrossEU Blog"
      subtitle="Guides, tips and updates for traveling across Europe."
      sidebar={sidebar}
    >
      {/* Categories Section */}
      {categories.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildSectionUrl('blog', activeLocale)}
              className="px-3 py-1 rounded-full text-sm border border-emerald-200 bg-emerald-50 text-emerald-700 font-medium"
            >
              All Posts
            </Link>
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                href={`${buildSectionUrl('blog', activeLocale)}/category/${category.slug}`}
                className="px-3 py-1 rounded-full text-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Blog Posts List */}
      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start gap-4">
                {post.hero_image ? (
                  <div className="flex-shrink-0 w-24 h-18">
                    <Image
                      src={post.hero_image.includes('travel-stories/') ? `/images/blog/travel-stories/${post.hero_image.split('/').pop()}` : post.hero_image}
                      alt={post.title}
                      width={96}
                      height={72}
                      className="w-24 h-18 object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="flex-shrink-0 w-24 h-18 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg font-bold">{post.title[0]}</span>
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                      {post.category.name}
                    </span>
                    <time className="text-sm text-slate-500">
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })}
                    </time>
                  </div>
                  
                  <Link
                    href={`/${activeLocale}/blog/${post.slug}`}
                    className="block group"
                  >
                    <h2 className="text-lg font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors mb-2 line-clamp-2">
                      {post.title}
                    </h2>
                    {post.subtitle && (
                      <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                        {post.subtitle}
                      </p>
                    )}
                    <span className="text-sm text-emerald-600 group-hover:text-emerald-700 font-medium">
                      Read more →
                    </span>
                  </Link>

                  {post.translation_missing && (
                    <div className="mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                      Translation missing for {activeLocale}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">No blog posts yet</h2>
          <p className="text-slate-600 mb-6">
            Blog posts will appear here once they are published in the CMS.
          </p>
          <Link
            href={buildSectionUrl('destinations', activeLocale)}
            className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Explore destinations instead
          </Link>
        </div>
      )}
    </PageWithSidebar>
  );
}
