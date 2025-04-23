import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '@/types/blog';
import { getBlogPosts } from '@/lib/blog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export const BlogList = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      const blogPosts = await getBlogPosts();
      setPosts(blogPosts);
    };
    loadPosts();
  }, []);

  return (
    <div className="pt-16 pb-24 sm:pt-24 sm:pb-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Blog</h1>
          <p className="mt-2 text-lg leading-8 text-gray-600">Thoughts on crypto, finance, and building products.</p>
        </div>

        <div className="mt-16 space-y-12 border-t border-gray-200 pt-10">
          {posts.map((post) => (
            <article key={post.slug} className="flex flex-col items-start">
              <div className="flex items-center gap-x-4 text-xs">
                <time dateTime={post.date} className="text-gray-500">
                  {new Date(post.date).toLocaleDateString()}
                </time>
                <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600">
                  {post.readingTime}
                </span>
              </div>
              <div className="group relative">
                <h2 className="mt-3 text-2xl font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                  <Link to={`/blog/${post.slug}`}>
                    <span className="absolute inset-0" />
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-5 text-sm leading-6 text-gray-600 line-clamp-3">{post.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
