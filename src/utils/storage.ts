import { WordData, WordDataType } from './types';

const WORD_BLOCK_DATA = "WORD_BLOCK_DATA";
const USER_ID = "USER_ID";

interface ResponseData {
  data: WordData[];
  total: number;
  all: WordData[];
}

interface GetDataParams {
  page: number,
  limit: number,
  type: WordDataType,
  search?: string;
  group?: string;
}

export function login() {
  return chrome.storage.local.set({
    USER_ID: "TEST_ACCOUNT"
  })
}

export function logout() {
  return chrome.storage.local.remove(USER_ID);
}

export function isLogin() {
  return new Promise(resolve => {
    chrome.storage.local.get([USER_ID], result => {
      resolve(Boolean(result[USER_ID]))
    });
  })
}

export function getData({ page, limit, type, search, group }: GetDataParams = { page: 0, limit: 10000, type: undefined, search: "", group: '' }): Promise<ResponseData> {
  return new Promise(resolve => {
    chrome.storage.local.get([WORD_BLOCK_DATA], (result)=> {
      let data: ResponseData['data'] = result[WORD_BLOCK_DATA] || [];

      data = data.sort((item1, item2) => item2.create_at - item1.create_at);
      if (type) {
        data = data.filter(item => item.type === type);
      }

      if (search) {
        data = data.filter(item => item.content.toLowerCase().includes(search.toLowerCase()));
      }

      data = data.filter(item => {
        if (!group) {
          return true;
        }

        if (group === 'favorite' && !item.group) {
          return true;
        }
        return item.group === group;
      })

      data = data.map(item => ({
        ...item,
        author: item.author || 'unknown'
      }))
      resolve({
        data: data.slice(page * limit, page * limit + limit),
        total: data.length,
        all: data
      });
    })
  })
}

export function setData(data: WordData[]) {
  chrome.storage.local.set({
    [WORD_BLOCK_DATA]: data
  })
}

export async function removeData(data: WordData) {
  const {data: res} = await getData();

  const index = res.findIndex(item => item.id === data.id);

  res.splice(index, 1);
  chrome.storage.local.set({
    [WORD_BLOCK_DATA]: res
  })
}