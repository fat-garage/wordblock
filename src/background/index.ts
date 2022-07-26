import { Ethereum } from '../sdk/Ethereum';
import { WordData } from '../utils/types';
import { Ceramic } from '../sdk/Ceramic';
import { getData, setData } from '../utils/storage';
import { getUUID } from '../utils/utils';

const ceramic = new Ceramic();
const ethereum = new Ethereum();
let loginLoading = false;
let popUpPort: any;

chrome?.runtime?.onConnect?.addListener((port: any) => {
  popUpPort = port;
});

const checkIsLogin = () => ceramic.isCeramicValid(ceramic.getCeramicClient());

const createBlock = (content) =>
  new Promise((resolve, reject) => {
    ceramic
      .createStream(content)
      .then((streamId) => {
        resolve(streamId);
      })
      .catch((error) => {
        reject(error);
      });
  });

// chrome.contextMenus.create(
//   {
//     id: 'wordblock',
//     title: 'Wordblock',
//     visible: true,
//     // contexts: ['selection'],
//     contexts: ['all'],
//     onclick: async () => {
//       console.log('wordblock');
//     },
//   },
//   () => {
//     if (chrome.runtime.lastError) {
//       console.log('create context menu failed! error:', chrome.runtime.lastError);
//     }
//   },
// );

function checkData(v) {
  const entry = { "'": '&apos;', '"': '&quot;', '<': '&lt;', '>': '&gt;' };

  v = v.replace(/(['")-><&\\\/\.])/g, ($0) => entry[$0] || $0);

  return v;
}

function getTabId() {
  return new Promise<number>((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      resolve(tabs[0].id);
    });
  });
}

chrome.contextMenus.create({
  id: 'wordblock',
  contexts: ['all'],
  title: 'Save Text Block',
});

chrome.contextMenus.create({
  id: 'wordblock2',
  contexts: ['all'],
  title: 'Save Article',
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  console.log(info, tab);
  const { pageUrl, selectionText, menuItemId } = info;
  const { id, title } = tab;
  if (menuItemId === 'wordblock') {
    if (selectionText) {
      if (!checkIsLogin()) {
        console.log('notLogin');
        chrome.tabs.sendMessage(id, { type: 'notLogin' });
        return;
      }
      const { data } = await getData();
      const newBlock = {
        url: pageUrl,
        content: checkData(selectionText),
        author: '',
        tags: 'favorite',
        create_at: Date.now(),
        id: '',
        type: 'text block',
        group: 'favorite',
      } as WordData;
      console.log(111);
      createBlock(newBlock)
        .then((res) => {
          console.log(res);
          newBlock.id = res as string;
          setData([...data, newBlock]);
          console.log(id);
          chrome.tabs.sendMessage(id, { type: 'saved' });
          console.log(222);
        })
        .catch(() => {
          newBlock.id = getUUID();
          setData([...data, newBlock]);
          chrome.tabs.sendMessage(id, { type: 'saved' });
        });
      return;
    }
    console.log('aaa',await getTabId(),id);
    chrome.tabs.sendMessage(await getTabId(), { type: 'selectText' });
    console.log('bb');
  } else if (menuItemId === 'wordblock2') {
    if (!checkIsLogin()) {
      chrome.tabs.sendMessage(tab.id!, { type: 'notLogin' });
      return;
    }
    const { data } = await getData();
    const newBlock = {
      url: pageUrl,
      content: title,
      author: '',
      tags: 'favorite',
      create_at: Date.now(),
      id: '',
      type: 'article',
      group: 'favorite',
    } as WordData;
    createBlock(newBlock)
      .then((res) => {
        newBlock.id = res as string;
        setData([...data, newBlock]);
        chrome.tabs.sendMessage(id, { type: 'saved' });
      })
      .catch(() => {
        newBlock.id = getUUID();
        setData([...data, newBlock]);
        chrome.tabs.sendMessage(id, { type: 'saved' });
      });
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'SAVE_TO_MY_WORDBLOCK') {
    getData().then(({ data }) => {
      const index = data.findIndex((item) => item.id === message.id);
      if (index > -1) {
        sendResponse({ type: 'duplicated' });
      } else {
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
            items: message.items || [],
          },
        ]);
        sendResponse({ type: 'saved' });
      }
    });
  } else if (message.type === 'CHECK_IS_LOGIN') {
    sendResponse({ code: 0, result: { isLogin: checkIsLogin(), loginLoading } });
  } else if (message.type === 'LOGIN') {
    loginLoading = true;
    ceramic
      .initCeramic()
      .then((result) => {
        sendResponse({
          code: 0,
          result: { sessionString: result.sessionString, walletAddress: result.walletAddress },
        });

        popUpPort?.postMessage({
          isLogin: true,
          loginLoading: false,
        });
      })
      .catch((error) => {
        sendResponse({ code: -1, error });
        popUpPort?.postMessage({
          isLogin: false,
          loginLoading: false,
        });
      })
      .finally(() => {
        loginLoading = false;
      });
  } else if (message.type === 'LOGOUT') {
    ceramic.clearCeramic();
    sendResponse({ code: 0 });
  } else if (message.type === 'CREATE_BLOCK') {
    createBlock(message.content)
      .then((result) => {
        sendResponse({ code: 0, result });
      })
      .catch((error) => {
        sendResponse({ code: -1, error });
      });
  } else if (message.type === 'GET_PROFILE') {
    ethereum.getWalletAddress().then((address) => {
      sendResponse({
        code: 0,
        result: {
          did: ceramic.getCeramicClient()?.did?.parent,
          address,
        },
      });
    });
  }

  return true;
});

export default {};
