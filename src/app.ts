import { getDoubanBookInfo } from './lib/douban';

const HOST = {
  BOOK: 'book.douban.com',
} as const;

const app = async () => {
  switch (window.location.host) {
    case HOST.BOOK:
      const id = location.href.match(/douban\.com\/subject\/(\d+)/)?.[1];
      const data = await getDoubanBookInfo(id);
      return;
    default:
      return;
  }
};
export default app;
