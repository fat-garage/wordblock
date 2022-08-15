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

function checkData(v) {
  var entry = { "'": '&apos;', '"': '&quot;', '<': '&lt;', '>': '&gt;' };

  v = v.replace(/(['")-><&\\\/\.])/g, function ($0) {
    return entry[$0] || $0;
  });

  return v;
}

chrome.contextMenus.create({
  parentId: 'wordblock',
  contexts: ['all'],
  title: 'Save Text Block',
  onclick: async (e, tab) => {
    const { pageUrl, selectionText } = e;
    const { data } = await getData();

    if (selectionText) {
      setData([
        ...data,
        {
          url: pageUrl,
          content: checkData(selectionText),
          author: '',
          tags: 'favorite',
          create_at: Date.now(),
          id: getUUID(),
          type: 'text block',
          group: 'favorite',
        },
      ]);
      chrome.tabs.sendMessage(tab.id!, { type: 'saved' });
      return;
    }

    chrome.tabs.sendMessage(tab.id!, { type: 'selectText' });
  },
});

chrome.contextMenus.create({
  parentId: 'wordblock',
  contexts: ['all'],
  title: 'Save Article',
  onclick: async (e, tab) => {
    const { pageUrl } = e;
    const { title } = tab;
    const { data } = await getData();

    setData([
      ...data,
      {
        url: pageUrl,
        content: title,
        author: '',
        tags: 'favorite',
        create_at: Date.now(),
        id: getUUID(),
        type: 'article',
        group: 'favorite',
      },
    ]);

    chrome.tabs.sendMessage(tab.id!, { type: 'saved' });
  },
});

chrome.runtime.onMessage.addListener(async (message, _sender, sendResponse) => {
  if (message.type === 'SAVE_TO_MY_WORDBLOCK') {
    const { data } = await getData();

    const index = data.findIndex(item => item.id === message.id);
    if (index > -1) {
      sendResponse({type: 'duplicated'})
      return;
    }

    setData([
      ...data,
      {
        url: location.href,
        content: message.content,
        author: message.author,
        tags: 'favorite',
        create_at: Date.now(),
        id: message.id,
        type: 'text block',
        group: 'favorite',
      },
    ]);
    sendResponse({type: 'saved'})
  }
})

export default {};
