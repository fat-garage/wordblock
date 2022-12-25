export type WordDataType = 'article' | 'text block' | undefined;

export interface WordData {
  content: string;
  author: string;
  tags: string[];
  url: string;
  create_at: number;
  id: string;
  type: WordDataType;
  group: string;
  items?: WordData[];
  status?: string;
  note?: string;
}

const WORD_DATA: WordData[] = [
  {
    content:
      "Welcome to your personal dashboard, where you can find an introduction to how GitHub works, tools to help you build software, and help merging your first lines of code.",
    author: "Unknown",
    tags: ["Git", "Code", "Personal", "Works"],
    url: "https://github.com/",
    create_at: Date.now(),
    id: "a224b580",
    type: "text block",
    group: "favorite",
    status: "🤣",
    note: "p102",
  },
  {
    content:
      "Share information about yourself by creating a profile README, which appears at the top of your profile page. Share information about yourself by creating a profile README, which appears at the top of your profile page",
    author: "Unknown",
    tags: ["Sharing", "Create", "README"],
    url: "https://github.com/",
    create_at: Date.now(),
    id: "a224b580",
    type: "text block",
    group: "favorite",
    status: "🤣",
    note: "p102",
  },
  {
    content:
      "We’re updating the cards and ranking all the time, so check back regularly. At first, you might need to follow some people or star some repositories to get started 🌱.",
    author: "Unknown",
    tags: ["Ranking", "Cool"],
    url: "https://github.com/",
    create_at: Date.now(),
    id: "a224b580",
    type: "text block",
    group: "favorite",
    status: "🙆",
    note: "p102",
  },
  {
    content:
      "JavaScript (node + client side) developer with over 20 years experience. Contact me for any work or questions about JS I might be able to help you with.",
    author: "Unknown",
    tags: ["Node", "Client", "JS", "TS"],
    url: "https://github.com/",
    create_at: Date.now(),
    id: "a224b580",
    type: "text block",
    group: "favorite",
    status: "",
    note: "p102",
  },
  {
    content:
      "NFT Marketplace framework to build standalone NFT marketplace or inApp/inGame NFT marketplace",
    author: "Unknown",
    tags: ["NFT", "Framework", "Marketplace"],
    url: "https://github.com/",
    create_at: Date.now(),
    id: "a224b580",
    type: "text block",
    group: "favorite",
    status: "",
    note: "p102",
  },
  {
    content:
      "When two or more CSS rules are exactly the same (even if they are not adjacent), all but the last one can safely be removed:",
    author: "Unknown",
    tags: ["CSS", "Code"],
    url: "https://github.com/",
    create_at: Date.now(),
    id: "a224b580",
    type: "text block",
    group: "favorite",
    status: "🙈",
    note: "p102",
  },
  {
    content:
      "A bit more info on why these business need their account to be separate and use this admin-only model. Main account and their franchise can be direct or partner model, but each are more or less like competitors to each other. They require full autonomy.  E.g. LPL financial and NMCompany is growing through merge and acquisition,  acquired company may or may not already have RC accounts, but they don't want to have their system disrupted(merge to corporate account) and want to stay  separate. E.g. Cornerstone, Prime Health care Company have their own unique needs to separate their accounts",
    author: "Unknown",
    tags: ["Simple", "Data", "Module"],
    url: "https://github.com/",
    create_at: Date.now(),
    id: "a224b580",
    type: "text block",
    group: "favorite",
    status: "👋",
    note: "p102",
  },
  {
    content:
      "Mobile-friendly picture file input Vue.js component with image preview, drag and drop, EXIF orientation, and more",
    author: "Unknown",
    tags: ["Mobile", "Picture", "Input", "Works"],
    url: "https://github.com/",
    create_at: Date.now(),
    id: "a224b580",
    type: "text block",
    group: "favorite",
    status: "🌝",
    note: "p102",
  },
  {
    content:
      "🌟 A Lightweight and customizable package of Emoji Picker in Vue using emojis natives (unicode)",
    author: "Unknown",
    tags: ["Git", "Code", "Personal", "Works"],
    url: "https://github.com/",
    create_at: Date.now(),
    id: "a224b580",
    type: "text block",
    group: "favorite",
    status: "🐶",
    note: "p102",
  },
  {
    content: "One component to pick them all (performance improvements) 👊🏼",
    author: "Unknown",
    tags: ["Git", "Code", "Personal", "Works"],
    url: "https://github.com/",
    create_at: Date.now(),
    id: "a224b580",
    type: "text block",
    group: "favorite",
    status: "🥰",
    note: "p102",
  },
  {
    content: "We’re updating the cards and ranking all the time, so check back regularly. At first, you might need to follow some people or star some repositories to get started 🌱.",
    author: "Unknown",
    tags: ["Git", "Code", "Personal", "Works"],
    url: "https://github.com/",
    create_at: Date.now(),
    id: "a224b580",
    type: "text block",
    group: "created",
    status: "🥰",
    note: "p102",
  },
];

interface params {
  page: number;
  pageSize: number;
  word: string;
  group: string;
}

interface Response {
  code: number;
  data: WordData[];
  total: number;
}

export function getDataRequest({ page, pageSize, word, group }: params): Promise<Response> {
  let data = JSON.parse(JSON.stringify(WORD_DATA));

  let flag = false;
  if (word) {
    if (word.includes('#')) {
      const words = word.split(' ').filter((item) => Boolean(item)).map(item => item.replace("#", ""));

      data = data.filter((item) => {
        flag = false;
        item.tags = item.tags.map((tag) => {
          for (const word of words) {
            const reg = new RegExp(word, 'g');
            const arr = tag.match(reg);

            if (arr && !tag.includes("highlight")) {
              flag = true;
              tag = tag.replace(reg, `<span class="highlight">${arr[0]}</span>`);
            }
          }

          return tag;
        });

        return flag;
      });
    } else {
      const reg = new RegExp(word, 'g');
      data = data.filter((item) => {
        flag = false;
        const arr = item.content.match(reg);

        if (arr) {
          flag = true;
          item.content = item.content.replaceAll(reg, `<span class="highlight">${arr[0]}</span>`);
        }

        return flag;
      });
    }
  }

  data = data.filter((item) => {
    if (!group) {
      return true;
    }

    if (group === 'favorite' && !item.group) {
      return true;
    }
    return item.group === group;
  });

  console.log('data', data)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        total: 30,
        code: 1,
        data: page >= 4 ? [] : data,
      });
    }, 1000);
  });
}
