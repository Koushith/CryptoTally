export type BlogPost = {
  title: string;
  description: string;
  date: string;
  slug: string;
  content: string;
  readingTime: string;
  author: {
    name: string;
    avatar: string;
  };
};
