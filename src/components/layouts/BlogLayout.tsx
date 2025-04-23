import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

type Section = {
  id: string;
  title: string;
  level: number;
};

export const BlogLayout = ({ children }: { children: React.ReactNode }) => {
  const [sections, setSections] = useState<Section[]>([]);
  const location = useLocation();

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
    <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-3">
          <div className="sticky top-32 space-y-3">
            <p className="font-medium text-sm text-gray-500">ON THIS PAGE</p>
            <nav className="space-y-1">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={cn(
                    'block text-sm py-1 hover:text-gray-900',
                    section.level === 1 ? 'text-gray-900' : 'text-gray-600 pl-4'
                  )}
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </div>
        </div>
        <div className="col-span-9 pt-24">{children}</div>
      </div>
    </div>
  );
};
