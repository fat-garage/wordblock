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
      "La probabilità che una certa persona sia stupida è indipendente da qualsiasi altra caratteristica della stessa persona.",
    author: "Carlo M.Cipolla",
    tags: ["ma non troppo","umana", "italiano", "mezzo", "economico"],
    url: "📍Libreria Antiquaria Stella, Via S. Francesco, 192, 35121 Padova PD",
    create_at: Date.now(),
    id: "a224b580",
    type: "text block",
    group: "created",
    status: "🇮🇹",
    note: "p48",
  },
  {
    content:
      "Therefore the world as representation,in which aspect alone we are considering it, has two essential, necessary, and inseparable halves.The one half is the object, whose forms are space and time, and through these plurality. But the other half, the subject, does not lie in the space and time, for it it whole and undivided in every representation.",
    author: "Schopenhauer",
    tags: ["the world as mind and representation", "Schopenhauer", "philosophy"],
    url: "📍Zeil Antiquariat,Zeil 24 60313 Frankfurt am Main",
    create_at: Date.now(),
    id: "a224b580",
    type: "text block",
    group: "created",
    status: "🇩🇪",
    note: "p102",
  },
  {
    content:
      "书阁余寒在，新年双燕飞。梅花独带雪，未得试春衣。",
    author: "张迟",
    tags: ["唐诗", "Cool"],
    url: "📍Libreria Antiquaria Stella, Via S. Francesco, 192, 35121 Padova PD",
    create_at: Date.now(),
    id: "a224b580",
    type: "text block",
    group: "created",
    status: "🙆",
    note: "p18",
  },
  {
    content:
      "E a orla branca foi de ilha em continente, Clareou, correndo, até ao fim do mundo, E viu-se a terra inteira, de repente, Surgir, redonda, do azul profundo.",
    author: "Fernando PessoA",
    tags: ["Poem", "O infante"],
    url: "📍Ler Devagar, R. Rodrigues de Faria 103 - G 0.3, 1300-501 Lisboa, Portugal",
    create_at: Date.now(),
    id: "a224b580",
    type: "text block",
    group: "created",
    status: "🇵🇹",
    note: "p11 O infante",
  },
  {
    content:
      "إن العالم الذي في رأسي أكبر من العالم الذي رأسي فيه The world inside my head, is larger the world my head is on",
    author: "Unknown",
    tags: ["Arabic", "cool"],
    url: "https://github.com/",
    create_at: Date.now(),
    id: "a224b580",
    type: "text block",
    group: "favorite",
    status: "🇸🇩",
    note: "反方向打字",
  },
  {
    content:
      "Was the original lingua Adamica a complex, mature linguistic system rich in its vocabulary, replete with abstractions, adorned with a syntax that permitted elaboration, definition, dis- crimination, and modifications of aspect? Or was it merely a handful of simple root forms?",
    author: "Eric H. Lenneberg",
    tags: ["foundations of language development","language", "Noman Chomsky"],
    url: "1libbot",
    create_at: Date.now(),
    id: "a224b580",
    type: "text block",
    group: "favorite",
    status: "🙈",
    note: "Noman Chomsky and Stephen Krasen mentioned it",
  },
  {
    content:
      "Gorete di ottima salute e di independenza economica.",
    author: "Unknown",
    tags: ["italiano"],
    url: "https://github.com/",
    create_at: Date.now(),
    id: "a224b580",
    type: "text block",
    group: "created",
    status: "🥠",
    note: "a risterante",
  },
  {
    content:
      "As we will see in this chapter, when treating each word or subword as an individual token, the representation of each token can be pretrained using word2vec, GloVe, or subword embedding models on large corpora.",
    author: "Unknown",
    tags: ["deep learning", "NLP"],
    url: "https://d2l.ai/chapter_natural-language-processing-pretraining/index.html#",
    create_at: Date.now(),
    id: "a224b580",
    type: "text block",
    group: "favorite",
    status: "📙",
    note: "prof's recommendation",
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
    content: "Tout commence par une interruption",
    author: "Paul valéry",
    tags: ["Git", "Code", "Personal", "Works"],
    url: "https://github.com/",
    create_at: Date.now(),
    id: "a224b580",
    type: "text block",
    group: "favorite",
    status: "🥰",
    note: "p8",
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
