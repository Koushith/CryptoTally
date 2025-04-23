export type BlogPost = {
  title: string;
  description: string;
  date: string;
  slug: string;
  content: string;
  readingTime: string;
  coverImage?: string;
  author: {
    name: string;
    avatar: string;
    role: string;
    bio: string;
  };
};
