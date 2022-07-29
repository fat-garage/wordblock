import { getData, setData } from '../utils/storage';
import { getUUID } from '../utils/utils';

chrome.contextMenus.create(
  {
    id: 'wordblock',
    title: 'Wordblock',
    visible: true,
    // contexts: ['selection'],
    contexts: ['all'],
    onclick: async () => {
      console.log('wordblock');
    },
  },
  () => {
    if (chrome.runtime.lastError) {
      console.log('create context menu failed! error:', chrome.runtime.lastError);
    }
  },
);

chrome.contextMenus.create({
  parentId: "wordblock",
  contexts: ['all'],
  title: "Save Text Block",
  onclick: async (e, tab) => {
    const { pageUrl, selectionText } = e;
    const { data } = await getData();

    if (selectionText) {
      setData([
        ...data,
        {
          url: pageUrl,
          content: selectionText!,
          author: "mirror",
          tags: "favorite",
          create_at: Date.now(),
          id: getUUID(),
          type: "text block",
        }
      ]);
      chrome.tabs.sendMessage(tab.id!, { type: 'saved' });
      return;
    }

    chrome.tabs.sendMessage(tab.id!, { type: 'selectText' });
  }
})

chrome.contextMenus.create({
  parentId: "wordblock",
  contexts: ['all'],
  title: "Save Article",
  onclick: async (e, tab) => {
    const { pageUrl } = e;
    const { title } = tab;
    const { data } = await getData();

    setData([
      ...data,
      {
        url: pageUrl,
        content: title,
        author: "mirror",
        tags: "favorite",
        create_at: Date.now(),
        id: getUUID(),
        type: "article",
      }
    ]);

    chrome.tabs.sendMessage(tab.id!, { type: 'saved' });
  }
})


export default {};

