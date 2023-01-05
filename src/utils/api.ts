import { WordData, WordDataType } from './types';

const WORD_BLOCK_DATA = 'WORD_BLOCK_DATA';
const USER_ID = 'USER_ID';
const IPFS_ID = 'IPFS_ID'

async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

async function fetchData(url: string) {
  const response = await fetch(url);
  return response.json();
}


export function getAllDataFromIPFS() {
  return fetch("https://api.wordblock.xyz/api/v1/ipfs/all");
}

export function uploadDataToIPFS(data) {
  return postData("https://api.wordblock.xyz/api/v1/ipfs/upload", data)
}

export async function fetchDataFromIPFS(did: string) {
  const res = await fetchData("https://api.wordblock.xyz/api/v1/ipfs/list/" + did);
  const data = res.data || []

  let item = data[0] || {};

  console.log(item, res, "~~~IPFS_ID~~~")

  chrome.storage.local.set({
    [IPFS_ID]: item,
  });

  if (item.id) {
    const ipfsRes = await fetchData(
      `https://cloudflare-ipfs.com/ipfs/${item.cid}/${item.file_name}`
    )

    chrome.storage.local.set({
      [WORD_BLOCK_DATA]: ipfsRes,
    });

    return ipfsRes
  }

  chrome.storage.local.set({
    [WORD_BLOCK_DATA]: [],
  });

  return []
}

interface ResponseData {
  data: WordData[];
  total: number;
  all: WordData[];
}

interface GetDataParams {
  page: number;
  limit: number;
  type: WordDataType;
  search?: string;
  group?: string;
}

export function login(walletAddress: string) {
  return chrome.storage.local.set({
    USER_ID: walletAddress,
  });
}

export function logout() {
  return chrome.storage.local.remove(USER_ID);
}

export function getDID() {
  return new Promise((resolve) => {
    chrome.storage.local.get([USER_ID], (result) => {
      resolve(result[USER_ID]);
    });
  });
}

export function getData(
  { page, limit, type, search: word, group }: GetDataParams = {
    page: 0,
    limit: 10000,
    type: undefined,
    search: '',
    group: '',
  },
): Promise<ResponseData> {
  return new Promise((resolve) => {
    chrome.storage.local.get([WORD_BLOCK_DATA], (result) => {
      let data: ResponseData['data'] = result[WORD_BLOCK_DATA] || [];

      data = data.sort((item1, item2) => item2.create_at - item1.create_at);
      if (type) {
        data = data.filter((item) => item.type === type);
      }

      let flag = false;
      if (word) {
        if (word.includes('#')) {
          const words = word.split(' ').filter((item) => Boolean(item)).map(item => item.replace("#", ""));
    
          data = data.filter((item) => {
            flag = false;
            item.tags = item.tags.map((tag) => {
              for (const word of words) {
                const reg = new RegExp(word, 'ig');
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
              item.content = item.content.replace(reg, `<span class="highlight">${arr[0]}</span>`);
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

      data = data.map((item) => ({
        ...item,
        author: item.author || 'unknown',
      }));

      console.log(data, '~~~~data~~~')

      resolve({
        data: data.slice(page * limit, page * limit + limit),
        total: data.length,
        all: data,
      });
    });
  });
}

export function setData(data: WordData[]) {
  chrome.storage.local.set({
    [WORD_BLOCK_DATA]: data,
  });

  chrome.storage.local.get((result) => {
    uploadDataToIPFS({
      did: result[USER_ID],
      id: result[IPFS_ID].id,
      content: JSON.stringify(data)
    }).then(res => {
      console.log("~~~~~~~~res")
      chrome.storage.local.set({
        [IPFS_ID]: res.data,
      });
    })
  })
}

export async function removeData(data: WordData) {
  const { data: res } = await getData();

  const index = res.findIndex((item) => item.id === data.id);

  res.splice(index, 1);
  setData(res);
}

export async function getTagTips(word: string): Promise<string []> {
  return new Promise((resolve) => {
    chrome.storage.local.get([WORD_BLOCK_DATA], (result) => {
      let data: ResponseData['data'] = result[WORD_BLOCK_DATA] || [];
  
      let tags = [];
  
      for (const item of data) {
        for (const tag of item.tags) {
          if (tag.startsWith(word)) {
            tags.push(tag)
          }
        }
      }

      resolve(Array.from(new Set([...tags])));
    })
  })
}