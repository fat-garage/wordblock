import { Ethereum } from '../sdk/Ethereum';
import { WordData } from '../utils/types';
import { Ceramic } from '../sdk/Ceramic';
import { getData, setData, isLogin, getTagTips } from '../utils/storage';
import { getUUID } from '../utils/utils';

const ceramic = new Ceramic();
const ethereum = new Ethereum();
let loginLoading = false;
let popUpPort: any;

chrome?.runtime?.onConnect?.addListener((port: any) => {
  popUpPort = port;
});

const checkIsLogin = () => ceramic.isCeramicValid(ceramic.getCeramicClient());
const getDID = () => isLogin();

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
  const isLogin = await checkIsLogin();

  if (menuItemId === 'wordblock') {
    if (!isLogin) {
      chrome.tabs.sendMessage(id, { type: 'NOT_LOGIN' });
      return;
    }

    if (!selectionText) {
      chrome.tabs.sendMessage(await getTabId(), { type: 'SELECT_TEXT' });
      return;
    }

    chrome.tabs.sendMessage(id, {
      type: 'SAVE_WORD_BLOCK_MODAL',
      content: checkData(selectionText),
      blockType: 'text block',
    });
  } else if (menuItemId === 'wordblock2') {
    if (!isLogin) {
      chrome.tabs.sendMessage(id, { type: 'NOT_LOGIN' });
      return;
    }

    chrome.tabs.sendMessage(id, {
      type: 'SAVE_WORD_BLOCK_MODAL',
      content: title,
      blockType: 'article',
    });
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'SAVE_TO_MY_WORDBLOCK') {
    getData().then(({ data }) => {
      const index = data.findIndex((item) => item.id === message.id);
      if (index > -1) {
        sendResponse({ type: 'DUPLICATED' });
      } else {
        const content = {
          url: message.url || location.href,
          content: message.content,
          author: message.author,
          tags: message.tags,
          create_at: Date.now(),
          id: message.id || getUUID(),
          type: message.blockType || 'text block',
          group: 'favorite',
          items: message.items || [],
          status: message.status,
          note: message.note,
        };
        createBlock(content)
          .then((result) => {
            getData().then(({ data }) => {
              setData([
                ...data,
                {
                  ...content,
                  id: result as string,
                },
              ]);
              sendResponse({ code: 0, result });
            });
          })
          .catch((error) => {
            sendResponse({ code: -1, error });
          });
        sendResponse({ type: 'SAVED' });
      }
    });
  } else if (message.type === 'CHECK_IS_LOGIN') {
    getDID().then((USER_ID) => {
      sendResponse({ code: 0, result: { isLogin: checkIsLogin(), loginLoading, did: USER_ID } });
    });
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
        getData().then(({ data }) => {
          setData([
            ...data,
            {
              ...message.content,
              id: result,
            },
          ]);
          sendResponse({ code: 0, result });
        });
      })
      .catch((error) => {
        sendResponse({ code: -1, error });
      });
  } else if (message.type === 'EDIT_BLOCK') {
    getData().then(({ data }) => {
      let content = null;
      data = data.map((item) => {
        if (item.id === message.content.id) {
          content = message.content;
          return {
            ...message.content,
          };
        }
        return item;
      });

      setData(data);

      ceramic.updateSteam(content.id, content).then(() => {
        sendResponse({ code: 0 });
      }).catch(err => {
        console.log(err, 'updateSteamError')
        sendResponse({ code: 0 });
      })
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
  } else if (message.type === 'GET_TGA_TIPS') {
    getTagTips(message.word).then((data) => {
      sendResponse({ data });
    });
  }

  return true;
});

export default {};
