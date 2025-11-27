"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import type { BlogPost } from "@/lib/api/blog";
import type { Locale } from "@/lib/locales";

interface LatestBlogPostsProps {
  locale: Locale;
  className?: string;
  maxPosts?: number;
}

export default function LatestBlogPosts({ locale, className = "", maxPosts = 4 }: LatestBlogPostsProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        setLoading(true);
        
        // Try to fetch from API first
        try {
          const response = await fetch(`/api/cms/blog/?locale=${locale}&limit=${maxPosts}`, {
            next: { revalidate: 300 }
          });

          if (response.ok) {
            const data = await response.json();
            setPosts(data.slice(0, maxPosts));
            return;
          }
        } catch (apiError) {
          console.log('API not available, using fallback data');
        }

        // Fallback to demo data if API is not available
        const fallbackPosts: BlogPost[] = [
          {
            id: 1,
            slug: "ultimate-packing-guide-europe",
            title: "Ultimate Packing Guide for Europe",
            subtitle: "Essential tips for stress-free European travel",
            body: "Discover the art of packing light while ensuring you have everything you need for your European adventure.",
            hero_image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop&crop=center",
            hero_slides: [],
            is_published: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            category: {
              id: 1,
              name: "Travel Tips",
              slug: "travel-tips",
              is_published: true,
              order: 1,
              posts_count: 5
            },
            translations: [],
            locale: locale,
            sections: [],
            translation_missing: false
          },
          {
            id: 2,
            slug: "hidden-gems-portugal",
            title: "Hidden Gems of Portugal",
            subtitle: "Discover Portugal's best-kept secrets beyond Lisbon and Porto",
            body: "From charming coastal villages to mystical castles, explore Portugal's lesser-known treasures.",
            hero_image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop&crop=center",
            hero_slides: [],
            is_published: true,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            updated_at: new Date(Date.now() - 86400000).toISOString(),
            category: {
              id: 2,
              name: "Destinations",
              slug: "destinations",
              is_published: true,
              order: 2,
              posts_count: 8
            },
            translations: [],
            locale: locale,
            sections: [],
            translation_missing: false
          },
          {
            id: 3,
            slug: "budget-travel-eastern-europe",
            title: "Budget Travel in Eastern Europe",
            subtitle: "Maximize your travel budget in Eastern European capitals",
            body: "Learn how to explore Prague, Budapest, and Krakow without breaking the bank.",
            hero_image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop&crop=center",
            hero_slides: [],
            is_published: true,
            created_at: new Date(Date.now() - 172800000).toISOString(),
            updated_at: new Date(Date.now() - 172800000).toISOString(),
            category: {
              id: 3,
              name: "Budget Tips",
              slug: "budget-tips",
              is_published: true,
              order: 3,
              posts_count: 4
            },
            translations: [],
            locale: locale,
            sections: [],
            translation_missing: false
          }
        ];

        setPosts(fallbackPosts);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    }

    fetchBlogPosts();
  }, [locale, maxPosts]);

  // Extract excerpt from blog post body
  const extractExcerpt = (body: string | null, maxLength: number = 150): string => {
    if (!body) return 'Read more about this travel story and discover insights for your European adventures.';
    
    // Remove HTML tags and get plain text
    const plainText = body.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    
    if (plainText.length <= maxLength) {
      return plainText;
    }

    // Find the last complete word within maxLength
    const truncated = plainText.substring(0, maxLength - 3);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    
    return lastSpaceIndex > 0 
      ? truncated.substring(0, lastSpaceIndex) + '...'
      : truncated + '...';
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className={`py-16 bg-gray-50 ${className}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Latest Travel Stories
            </h2>
          </div>
          
          {/* Loading skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: maxPosts }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="bg-gray-200 aspect-[4/3]" />
                <div className="p-6">
                  <div className="bg-gray-200 h-4 rounded mb-3" />
                  <div className="bg-gray-200 h-6 rounded mb-2" />
                  <div className="bg-gray-200 h-4 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`py-16 bg-gray-50 ${className}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Latest Travel Stories
            </h2>
            <p className="text-gray-600 mb-6">
              Unable to load blog posts at the moment. Please try again later.
            </p>
            <Link
              href={`/${locale}/blog`}
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Visit Blog
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <section className={`py-16 bg-gray-50 ${className}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Latest Travel Stories
            </h2>
            <p className="text-gray-600 mb-6">
              New travel stories and guides will appear here once published.
            </p>
            <Link
              href={`/${locale}/blog`}
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Visit Blog
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Latest Travel Stories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fresh insights, travel tips, and destination guides from our latest adventures across Europe
          </p>
        </div>

        {/* Blog Posts Grid - Overlay Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <Link
              key={post.id}
              href={`/${locale}/blog/${post.slug}`}
              className="relative overflow-hidden rounded-3xl aspect-[4/3] group block hover:-translate-y-1 transition-transform duration-300"
            >
              {/* Full Cover Image */}
              <div className="relative w-full h-full">
                {post.hero_image ? (
                  <Image
                    src={post.hero_image.includes('travel-stories/') ? `/images/blog/travel-stories/${post.hero_image.split('/').pop()}` : post.hero_image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <svg className="w-12 h-12 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              {/* Content Container */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 lg:p-6">
                {/* Title */}
                <h3 className="text-white text-base sm:text-lg font-semibold mb-2 line-clamp-2">
                  {post.title}
                </h3>
                
                {/* Meta Row */}
                <div className="flex items-center gap-3 text-white/80 text-sm">
                  <span>{formatDate(post.created_at)}</span>
                  {post.category && (
                    <>
                      <span>•</span>
                      <span>{post.category.name}</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Blog Posts Link */}
        <div className="text-center mt-12">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 font-medium"
          >
            Read More Stories
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}