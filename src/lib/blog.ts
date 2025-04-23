import matter from 'front-matter';
import MarkdownIt from 'markdown-it';
import { getReadingTime } from './utils';

const md = new MarkdownIt();

export const getBlogPosts = async () => {
  const posts = import.meta.glob('/src/content/blog/*.mdx', { as: 'raw' });
  const images = import.meta.glob('/src/assets/**/*.{png,jpg,jpeg,gif}', { as: 'raw', eager: true });

  const blogPosts = await Promise.all(
    Object.entries(posts).map(async ([path, resolver]) => {
      const slug = path.split('/').pop()?.replace('.mdx', '');
      const source = await resolver();
      const { attributes, body } = matter(source);
      const attrs = attributes as any;

      // Handle @assets alias in coverImage
      if (attrs.coverImage?.startsWith('@assets/')) {
        const imageName = attrs.coverImage.replace('@assets/', '');
        const imagePath = `/src/assets/${imageName}`;
        attrs.coverImage = imagePath;
      }

      return {
        ...attrs,
        slug,
        content: md.render(body),
        readingTime: getReadingTime(body),
      };
    })
  );

  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getBlogPost = async (slug: string) => {
  const posts = await getBlogPosts();
  return posts.find((post) => post.slug === slug);
};
