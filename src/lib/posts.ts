import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export async function getPublishedPosts(): Promise<Post[]> {
  const now = new Date();
  const posts = await getCollection('posts', ({ data }) => !data.draft && data.publishedAt <= now);
  return posts.sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}

export function postUrl(post: Post): string {
  return `/posts/${post.id.split('/').map(encodeURIComponent).join('/')}/`;
}

export function tagUrl(tag: string): string {
  return `/tags/${encodeURIComponent(tag)}/`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Shanghai',
  }).format(date).replaceAll('-', '.');
}

export function yearOf(date: Date): string {
  return new Intl.DateTimeFormat('en', { year: 'numeric', timeZone: 'Asia/Shanghai' }).format(date);
}

export function readingMinutes(body = ''): number {
  const chinese = body.match(/[\u3400-\u9fff]/g)?.length ?? 0;
  const words = body.match(/[a-zA-Z0-9_]+/g)?.length ?? 0;
  return Math.max(1, Math.ceil(chinese / 400 + words / 200));
}
