"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { type BlogPost } from "@/lib/api/blog";

function TravelStoryCard({ post, locale }: { post: BlogPost; locale: string }) {
  // Extract filename from Django URL or use default
  let imageSrc = "/images/blog/default-travel-story.jpg";
  
  if (post.hero_image) {
    if (post.hero_image.includes('travel-stories/')) {
      // Extract filename from Django media URL
      const filename = post.hero_image.split('/').pop();
      imageSrc = `/images/blog/travel-stories/${filename}`;
    }
  }
  const href = `/${locale}/blog/${post.slug}`;

  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300">
      <Link href={href}>
        <div className="relative h-44">
          <Image
            src={imageSrc}
            alt={post.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            {post.category?.name && (
              <span className="inline-flex rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-white/90">
                {post.category.name}
              </span>
            )}
            <h3 className="mt-2 text-lg font-semibold text-white line-clamp-2">
              {post.title}
            </h3>
          </div>
        </div>
        <div className="p-4">
          {post.subtitle && (
            <p className="text-xs text-slate-600 line-clamp-3">
              {post.subtitle}
            </p>
          )}
          <p className="mt-2 text-[11px] text-slate-400">
            {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
      </Link>
    </article>
  );
}

export default function TravelStoriesContent({ 
  initialPosts, 
  locale 
}: { 
  initialPosts: BlogPost[]; 
  locale: string; 
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStories = initialPosts.filter((post) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      post.title.toLowerCase().includes(searchLower) ||
      (post.subtitle && post.subtitle.toLowerCase().includes(searchLower)) ||
      (post.body && post.body.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Travel Stories
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real trips, honest lessons and calm, practical advice for travelling across Europe.
          </p>
        </div>

        {/* Search Filter */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search stories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Stories Grid */}
        {filteredStories.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStories.map((post) => (
              <TravelStoryCard key={post.slug} post={post} locale={locale} />
            ))}
          </div>
        ) : initialPosts.length > 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No stories found</h2>
            <p className="text-gray-600">
              Try adjusting your search terms to find what you're looking for.
            </p>
          </div>
        ) : (
          <p className="mt-8 text-sm text-slate-500 text-center">
            No travel stories are published yet. Check back soon.
          </p>
        )}

        {/* Back to home */}
        <div className="text-center mt-12">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}