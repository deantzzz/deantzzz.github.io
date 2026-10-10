import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const [slug, title, ...extra] = process.argv.slice(2);
if (!slug || !title || extra.length || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('用法：npm run new:post -- my-first-post "我的第一篇文章"');
  console.error('文件名请使用小写英文、数字和连字符。');
  process.exit(1);
}
const root = fileURLToPath(new URL('../src/content/posts/', import.meta.url));
await mkdir(root, { recursive: true });
const destination = path.join(root, `${slug}.md`);
const content = `---\ntitle: ${JSON.stringify(title)}\ndescription: "在这里写一句文章摘要。"\npublishedAt: ${JSON.stringify(new Date().toISOString())}\ntags: ["随笔"]\ndraft: true\n---\n\n在这里开始写正文。\n`;
try {
  await writeFile(destination, content, { flag: 'wx' });
  console.log(`已创建草稿：src/content/posts/${slug}.md`);
  console.log('完成写作后，将 draft 改为 false，再提交到 main 发布。');
} catch (error) {
  if (error.code === 'EEXIST') console.error('同名文章已存在，未覆盖。');
  else console.error(error.message);
  process.exitCode = 1;
}
