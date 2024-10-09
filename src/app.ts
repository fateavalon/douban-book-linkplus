import { getDoubanBookInfo, getDoubanAuthorInfo, insertDiv } from './lib/douban';

const HOST = {
  BOOK: 'book.douban.com',
} as const;

const app = async () => {
  switch (window.location.host) {
    case HOST.BOOK:
      const id = location.href.match(/douban\.com\/subject\/(\d+)/)?.[1];
      const [title, authorNames] = await Promise.all([getDoubanBookInfo(id), getDoubanAuthorInfo()]);
      insertDiv([
        {
          text: '按照书名搜索',
          hrefText: title.join(' '),
          url: `https://csul.iii.com/search/?searchtype=X&SORT=D&searcharg=${title.join('+')}`,
        },
        ...authorNames.map((authorName: Array<string>) => ({
          text: '按照作者名搜索',
          hrefText: authorName.join(' '),
          url: `https://csul.iii.com/search/?searchtype=a&searcharg=${authorName.join(
            '+'
          )}&sortdropdown=-&SORT=DZ&extended=0&SUBMIT=Search`,
        })),
      ]);
      return;
    default:
      return;
  }
};
export default app;
