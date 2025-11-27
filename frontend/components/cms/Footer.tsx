'use client';

import React from 'react';
import Link from 'next/link';
import type { FooterBlock } from '@/lib/api/navigation';

interface FooterProps {
  blocks: FooterBlock[];
  locale: string;
}

export default function Footer({ blocks, locale }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Footer Blocks Grid */}
        {blocks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {blocks.map((block, index) => (
              <div key={`${block.title}-${index}`} className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  {block.title}
                </h3>
                
                {block.body && (
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {block.body}
                  </p>
                )}
                
                {block.links.length > 0 && (
                  <ul className="space-y-2">
                    {block.links.map((link, linkIndex) => (
                      <li key={`${link.label}-${linkIndex}`}>
                        {link.url.startsWith('http') ? (
                          <a
                            href={link.url}
                            className="text-gray-300 hover:text-white transition-colors text-sm"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            href={link.url}
                            className="text-gray-300 hover:text-white transition-colors text-sm"
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Default Footer Content when no blocks are configured */}
        {blocks.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">TravelAcrossEU</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Discover amazing destinations across Europe with our comprehensive travel guides.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href={`/${locale}/about`} className="text-gray-300 hover:text-white transition-colors text-sm">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/contact`} className="text-gray-300 hover:text-white transition-colors text-sm">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/blog`} className="text-gray-300 hover:text-white transition-colors text-sm">
                    Travel Blog
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Destinations</h3>
              <ul className="space-y-2">
                <li>
                  <Link href={`/${locale}/destinations`} className="text-gray-300 hover:text-white transition-colors text-sm">
                    All Destinations
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/destinations/france`} className="text-gray-300 hover:text-white transition-colors text-sm">
                    France
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/destinations/italy`} className="text-gray-300 hover:text-white transition-colors text-sm">
                    Italy
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Newsletter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Social Media
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} TravelAcrossEU. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href={`/${locale}/privacy`} className="text-gray-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href={`/${locale}/terms`} className="text-gray-400 hover:text-white transition-colors text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}