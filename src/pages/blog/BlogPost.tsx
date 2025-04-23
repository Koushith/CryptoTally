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
      <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8 lg:py-16">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="mt-4 h-24" />
        <Skeleton className="mt-8 h-[600px]" />
      </div>
    );
  }

  if (!post) return null;

  return (
    <BlogLayout>
      <Card className="border-none shadow-none">
        <CardHeader className="space-y-6 px-0">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">{post.title}</h1>
            <p className="text-lg text-gray-600">{post.description}</p>
          </div>
          <div className="flex items-center gap-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-gray-900">{post.author.name}</div>
              <div className="text-sm text-gray-500">
                {new Date(post.date).toLocaleDateString()} · {post.readingTime}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none pt-8 px-0">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </CardContent>
      </Card>
    </BlogLayout>
  );
};
