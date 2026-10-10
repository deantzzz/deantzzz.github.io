import rss from '@astrojs/rss';
import { SITE } from '../config';
import { getPublishedPosts, postUrl } from '../lib/posts';

export async function GET() {
  const posts = await getPublishedPosts();
  return rss({
    title: `${SITE.name} 的博客`,
    description: SITE.description,
    site: SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedAt,
      link: postUrl(post),
      categories: post.data.tags,
    })),
    customData: '<language>zh-cn</language>',
  });
}
