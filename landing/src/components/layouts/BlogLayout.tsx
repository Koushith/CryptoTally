import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { ArrowLeft } from 'lucide-react';

type Section = {
  id: string;
  title: string;
  level: number;
};

export const BlogLayout = ({ children }: { children: React.ReactNode }) => {
  const [sections, setSections] = useState<Section[]>([]);
  const location = useLocation();

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
      // Update URL without jump
      window.history.pushState({}, '', `#${id}`);
    }
  };

  useEffect(() => {
    // Wait for content to be rendered
    setTimeout(() => {
      const content = document.querySelector('.prose');
      if (!content) return;

      const headings = content.querySelectorAll('h1, h2, h3');
      const extractedSections = Array.from(headings).map((heading, index) => {
        // Generate unique ID if none exists
        const id = heading.id || `section-${index}`;
        if (!heading.id) heading.id = id;

        return {
          id,
          title: heading.textContent || '',
          level: parseInt(heading.tagName[1]),
        };
      });

      setSections(extractedSections);
    }, 0);
  }, [location]);

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex flex-col lg:flex-row lg:gap-x-8">
          {/* Left sidebar - visible only on desktop */}
          <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:shrink-0">
            <div className="sticky top-24">
              <nav className="flex flex-col space-y-2">
                <Link
                  to="/blog"
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Blog
                </Link>
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={(e) => scrollToSection(e, section.id)}
                    className={cn(
                      'text-sm text-gray-600 hover:text-gray-900',
                      'pl-4 border-l border-gray-200 hover:border-gray-600',
                      'transition-colors duration-200',
                      section.level === 1 && 'font-medium',
                      section.level === 2 && 'pl-6',
                      section.level === 3 && 'pl-8'
                    )}
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Mobile "Back to Blog" link */}
          <div className="mb-6 block lg:hidden">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </div>

          {/* Main content */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
};
