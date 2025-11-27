import Image from "next/image";
import type { CmsSection } from "@/lib/api/pages";

// Updated to use local images instead of Django media URLs
type SectionRendererProps = {
  sections: CmsSection[];
};

export default function SectionRenderer({ sections }: SectionRendererProps) {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-16 px-4 sm:px-6 lg:px-8">
      {sections.map((section, index) => {
        switch (section.section_type) {
          case "text":
            return <TextSection key={section.id} section={section} />;
          case "image":
            return <ImageSection key={section.id} section={section} />;
          case "text_image":
            return <TextImageSection key={section.id} section={section} index={index} />;
          case "cta":
            return <CtaSection key={section.id} section={section} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

function TextSection({ section }: { section: CmsSection }) {
  return (
    <section className="prose prose-slate max-w-none dark:prose-invert py-8">
      {section.title && (
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
          {section.title}
        </h2>
      )}
      {section.body && (
        <div className="text-slate-800 dark:text-slate-200">
          {section.body.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-6 text-lg font-medium leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}

function ImageSection({ section }: { section: CmsSection }) {
  if (!section.image) {
    return null;
  }

  // Extract filename from Django URL and use local Next.js path
  const getLocalImagePath = (djangoUrl: string): string => {
    if (djangoUrl.startsWith('/images/')) {
      return djangoUrl;
    }
    const filename = djangoUrl.split('/').pop();
    return filename ? `/images/sections/${filename}` : '/images/sections/default.jpg';
  };

  const imageSrc = getLocalImagePath(section.image);

  return (
    <section className="space-y-6 py-8">
      {section.title && (
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          {section.title}
        </h2>
      )}
      {section.image && typeof section.image === 'string' && section.image.trim() !== "" && (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
          <Image
            src={imageSrc}
            alt={section.title || "Section image"}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}
      {section.body && (
        <p className="text-lg font-medium text-slate-800 dark:text-slate-200 leading-relaxed">{section.body}</p>
      )}
    </section>
  );
}

function TextImageSection({ section, index }: { section: CmsSection; index: number }) {
  // Extract filename from Django URL and use local Next.js path
  const getLocalImagePath = (djangoUrl: string): string => {
    if (djangoUrl.startsWith('/images/')) {
      return djangoUrl;
    }
    const filename = djangoUrl.split('/').pop();
    return filename ? `/images/sections/${filename}` : '/images/sections/default.jpg';
  };

  const imageSrc = section.image ? getLocalImagePath(section.image) : null;
  
  // Determine if image should be on the left (even index) or right (odd index)
  const imageOnLeft = index % 2 === 1;

  const textContent = (
    <div className="space-y-8">
      {section.title && (
        <h2 className="text-5xl lg:text-6xl font-bold text-slate-800 dark:text-white leading-tight">
          <span className="bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
            {section.title}
          </span>
        </h2>
      )}
      {section.body && (
        <div className="text-slate-700 dark:text-slate-200 max-w-2xl">
          {section.body.split('\n\n').map((paragraph, paragraphIndex) => (
            <p key={paragraphIndex} className="mb-6 text-xl font-medium leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </div>
  );

  const imageContent = section.image && imageSrc && (
    <div className="relative group">
      <div className="relative aspect-video w-full overflow-hidden rounded-3xl shadow-2xl transform transition-transform duration-500 group-hover:scale-105">
        <Image
          src={imageSrc}
          alt={section.title || "Section image"}
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10"></div>
      </div>
    </div>
  );

  // Define background styles with geometric shapes and soft colors
  const getSectionStyles = (index: number) => {
    const styles = [
      {
        bg: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950',
        shape: 'before:absolute before:top-0 before:right-0 before:w-32 before:h-32 before:bg-blue-200 before:rounded-full before:opacity-30 before:-translate-y-16 before:translate-x-16'
      },
      {
        bg: 'bg-gradient-to-bl from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950',
        shape: 'before:absolute before:bottom-0 before:left-0 before:w-40 before:h-40 before:bg-emerald-200 before:rounded-full before:opacity-25 before:translate-y-20 before:-translate-x-20'
      },
      {
        bg: 'bg-gradient-to-tr from-rose-50 via-pink-50 to-orange-50 dark:from-rose-950 dark:via-pink-950 dark:to-orange-950',
        shape: 'before:absolute before:top-1/2 before:right-0 before:w-36 before:h-24 before:bg-rose-200 before:rounded-l-full before:opacity-30 before:-translate-y-12 before:translate-x-18'
      }
    ];
    return styles[index % 3];
  };

  const currentStyle = getSectionStyles(index);

  return (
    <section className={`relative overflow-hidden ${currentStyle.bg} ${currentStyle.shape}`}>
      <div className="container mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid gap-12 lg:gap-16 lg:grid-cols-2 lg:items-center">
          {imageOnLeft ? (
            <>
              <div className="relative z-10">
                {imageContent}
              </div>
              <div className="relative z-10">
                {textContent}
              </div>
            </>
          ) : (
            <>
              <div className="relative z-10">
                {textContent}
              </div>
              <div className="relative z-10">
                {imageContent}
              </div>
            </>
          )}
        </div>
      </div>
      {/* Additional decorative shapes */}
      <div className="absolute inset-0 pointer-events-none">
        {index === 0 && (
          <>
            <div className="absolute bottom-10 left-10 w-20 h-20 bg-indigo-100 dark:bg-indigo-800 rounded-full opacity-20"></div>
            <div className="absolute top-20 left-1/4 w-16 h-16 bg-purple-100 dark:bg-purple-800 transform rotate-45 opacity-15"></div>
          </>
        )}
        {index === 1 && (
          <>
            <div className="absolute top-16 right-20 w-24 h-24 bg-teal-100 dark:bg-teal-800 rounded-full opacity-20"></div>
            <div className="absolute bottom-16 right-1/3 w-12 h-20 bg-cyan-100 dark:bg-cyan-800 rounded-full opacity-25"></div>
          </>
        )}
        {index === 2 && (
          <>
            <div className="absolute top-10 left-16 w-28 h-14 bg-pink-100 dark:bg-pink-800 rounded-full opacity-20"></div>
            <div className="absolute bottom-20 right-16 w-18 h-18 bg-orange-100 dark:bg-orange-800 transform rotate-12 opacity-15"></div>
          </>
        )}
      </div>
    </section>
  );
}

function CtaSection({ section }: { section: CmsSection }) {
  return (
    <section className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 p-10 text-center text-white my-8">
      {section.title && (
        <h2 className="mb-6 text-3xl font-bold">{section.title}</h2>
      )}
      {section.body && (
        <p className="mb-8 text-xl font-medium text-cyan-50 leading-relaxed">{section.body}</p>
      )}
      {section.cta_label && section.cta_url && (
        <a
          href={section.cta_url}
          className="inline-block rounded-full bg-white px-10 py-4 font-bold text-cyan-600 text-lg transition hover:bg-gray-100 hover:shadow-lg transform hover:-translate-y-1"
        >
          {section.cta_label}
        </a>
      )}
    </section>
  );
}