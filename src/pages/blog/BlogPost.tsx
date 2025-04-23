import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BlogPost as BlogPostType } from '@/types/blog';
import { getBlogPost } from '@/lib/blog';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';
import { BlogLayout } from '@/components/layouts/BlogLayout';
import { MDXProvider } from '@mdx-js/react';
import { components } from '@/components/mdx-components';

export const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      if (slug) {
        const blogPost = await getBlogPost(slug);
        setPost(blogPost || null);
        setIsLoading(false);
      }
    };
    loadPost();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-16">
        <Skeleton className="h-8 sm:h-12 w-full sm:w-3/4" />
        <Skeleton className="mt-3 sm:mt-4 h-16 sm:h-24" />
        <Skeleton className="mt-6 sm:mt-8 h-[400px] sm:h-[600px]" />
      </div>
    );
  }

  if (!post) return null;

  return (
    <BlogLayout>
      <Card className="border-none shadow-none">
        <CardHeader className="space-y-4 sm:space-y-6 px-4 sm:px-0">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">{post.title}</h1>
            <p className="text-base sm:text-lg text-gray-600">{post.description}</p>
          </div>
          <div className="flex items-center gap-x-3 sm:gap-x-4">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-gray-900">{post.author.name}</div>
              <div className="text-xs sm:text-sm text-gray-500">
                {formatDate(post.date)} · {post.readingTime}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="prose prose-sm sm:prose-base prose-gray max-w-none pt-6 sm:pt-8 px-4 sm:px-0">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </CardContent>
      </Card>
    </BlogLayout>
  );
};
