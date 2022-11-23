import { useState, useEffect } from 'react';

import { css, Global } from '@emotion/react';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Message from '../../components/Message';
import PopoverContent from './PopoverContent';
import defaultStyles from '../../utils/defaultStyles';
import { WordData, WordDataType } from '../../utils/types';
import { getQueryString, getUUID } from '../../utils/utils';
import Detail from './Detail';
import reference1 from '../../assets/img/reference1.jpeg';
import reference2 from '../../assets/img/reference2.jpeg';
import loadingSVG from '../../assets/img/loading_gray.svg';
import SaveWordBlockModal from './SaveWordBlockModal'

const CustomButton = styled(Button)({
  'text-transform': 'none',
});

let textbox = null;
let currentNode = null;
// let currentData: any = {};
let lastText = '';
let type: WordDataType;
let currentHoverEl;
let blockData = {}

export default function App() {
  const [open, setOpen] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showReferences, setShowReferences] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [word, setWord] = useState('');
  const [cursorPosition, setCursorPosition] = useState<any>({});
  const [detailPosition, setDetailPosition] = useState<any>({});
  const [currentData, setCurrentData] = useState<any>({});
  const [showSaveWordBlockModal, setShowSaveWordBlockModal] = useState(false);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((data) => {
      const {type, content} = data;
      if (type === 'SAVED') {
        Message({ content: 'Saved to Wordblock Succeessfully' });
      } else if (type === 'SELECT_TEXT') {
        Message({ content: 'Please select the text you want to save' });
      } else if (type === 'DUPLICATED') {
        Message({ content: 'Save Fail. The block ID is exist.' });
      } else if (type === 'NOT_LOGIN') {
        Message({ content: 'Please login first' });
      } else if (type === 'SAVE_WORD_BLOCK_MODAL') {
        blockData = data
        setShowSaveWordBlockModal(true);
      }
    });

    checkTextbox();

    document.addEventListener('click', () => {
      setShowDetail(false);
    });

    setInterval(() => {
      addEventListener();
    }, 1000);
  }, []);

  const addEventListener = () => {
    if (!textbox) {
      return;
    }

    [...textbox.querySelectorAll('a')].forEach((el) => {
      if (el.getAttribute('isAdded')) {
        return;
      }

      el.setAttribute('isAdded', 'true');
      el.addEventListener('click', () => {
        if (!el.href.includes('https://wordblock')) {
          window.open(el.href.split('#')[0]);
        }
      });

      el.addEventListener('mouseover', (e) => {
        currentHoverEl = e.target;
        const data = getQueryString('wordblock', e.target.href);
        if (!data) {
          return;
        }

        // currentData = JSON.parse(data);
        setCurrentData(JSON.parse(data));
        const rect = e.target.getBoundingClientRect();
        setDetailPosition({
          left: rect.left,
          top: rect.top,
        });
        setShowDetail(true);
      });
    });
  };

  const handleClickLogo = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // currentData = {
    //   id: 'null',
    //   content: document.title,
    //   author: '',
    //   url: location.href,
    //   type: 'article',
    // };
    setCurrentData({
      id: 'null',
      content: document.title,
      author: 'unknown',
      url: location.href,
      type: 'article',
    });
    setDetailPosition({
      left: 200,
      top: 200,
    });

    setShowDetail(true);
  };

  const createBlock = ({
    newBlock,
    onSuccess,
    onError,
  }: {
    newBlock: {};
    onSuccess: Function;
    onError: Function;
  }) => {
    newBlock;
    onSuccess;
    onError;
    chrome.runtime.sendMessage(
      {
        type: 'CREATE_BLOCK',
        content: newBlock,
      },
      (res) => {
        if (res?.code === 0) {
          onSuccess(res?.result);
        } else {
          onError();
        }
      },
    );
  };

  const checkIsLogin = () =>
    new Promise((resolve) => {
      resolve;
      chrome.runtime.sendMessage(
        {
          type: 'CHECK_IS_LOGIN',
        },
        ({ result }) => {
          resolve(result);
        },
      );
    });

  const reRenderWheel = (func) => {
    let times = 0;
    const interval = setInterval(() => {
      try {
        func();
      } catch {}
      times += 1;
      if (times === 2) {
        clearInterval(interval);
      }
    }, 1);
  };

  const buildBlock = (wordblock) => {
    const a = document.createElement('a');
    a.setAttribute('href', `${wordblock.url}#wordblock=${JSON.stringify(wordblock)}`);
    const p = document.createElement('p');
    const text1 = document.createTextNode('<');
    a.innerText = 'block';
    const text2 = document.createTextNode(`=`);
    const text3 = document.createTextNode(`>`);
    p.appendChild(text1);
    p.appendChild(a);
    p.appendChild(text2);
    p.appendChild(text3);
    return p;
  };

  const checkTextbox = () => {
    const timer = setInterval(() => {
      textbox = document.querySelector('.ProseMirror') || document.querySelector('.css-1yr7por');

      if (!textbox) {
        return;
      }

      document.addEventListener('scroll', () => {
        const selection = getSelection();
        const range = selection.getRangeAt(0);

        if (!range || !range.getClientRects()[0]) {
          return;
        }
        setCursorPosition({
          left: range.getClientRects()[0].left,
          top: range.getClientRects()[0].top,
        });
      });

      textbox.addEventListener('keydown', async (e) => {
        const selection = getSelection();
        const focusNode = selection.focusNode;
        const currentNode = selection.focusNode.parentElement;
        const range = selection.getRangeAt(0);
        const textNode = range.startContainer;
        const startOffset = range.startOffset;

        if (e.code === 'Enter' && !textbox.textContent) {
          const res = await checkIsLogin();
          if (!res) {
            Message({ content: 'Please login first' });
            return;
          }
          const ul = document.createElement('ul');
          const li = document.createElement('li');
          ul.appendChild(li);
          const wordblock = {
            url: location.href,
            content: '',
            author: (document.querySelector('.css-j79vnj') || document.querySelector('.css-72jcwc'))
              .textContent,
            tags: 'web3',
            create_at: Date.now(),
            id: '',
            type: 'parent',
          };

          createBlock({
            newBlock: wordblock,
            onSuccess: (res) => {
              reRenderWheel(() => {
                wordblock.id = res;
                setCurrentData(wordblock);
                const el = textbox.firstChild.firstChild;
                const p = buildBlock(wordblock);
                el.replaceChild(p, el.firstChild);
                selection.selectAllChildren(textbox);
                selection.collapse(p, 3);
              });
            },
            onError: () => {
              reRenderWheel(() => {
                wordblock.id = getUUID();
                setCurrentData(wordblock);
                const el = textbox.firstChild.firstChild;
                const p = buildBlock(wordblock);
                el.replaceChild(p, el.firstChild);
                selection.selectAllChildren(textbox);
                selection.collapse(p, 3);
              });
            },
          });
          const p = buildBlock(wordblock);
          li.appendChild(p);
          textbox.removeChild(textbox.firstChild);
          textbox.replaceChild(ul, textbox.lastChild);
          const selection = window.getSelection();
          selection.selectAllChildren(textbox);
          selection.collapse(p, 3);
        }

        if (e.code === 'Enter' && currentNode.tagName === 'LI' && !focusNode.textContent.trim()) {
          const res = await checkIsLogin();
          if (!res) {
            Message({ content: 'Please login first' });
            return;
          }
          const a = document.createElement('a');
          const wordblock = {
            url: location.href,
            content: '',
            author: (document.querySelector('.css-j79vnj') || document.querySelector('.css-72jcwc'))
              .textContent,
            tags: 'web3',
            create_at: Date.now(),
            id: '',
            type: 'parent',
          };
          a.setAttribute('href', `${wordblock.url}#wordblock=${JSON.stringify(wordblock)}`);

          createBlock({
            newBlock: wordblock,
            onSuccess: (res) => {
              reRenderWheel(() => {
                wordblock.id = res;
                setCurrentData(wordblock);
                const p = buildBlock(wordblock);
                const li = document.querySelector('.ProseMirror').firstChild.lastChild;
                li.replaceChild(p, li.firstChild);
                selection.selectAllChildren(textbox);
                selection.collapse(focusNode, 4);
              });
            },
            onError: () => {
              reRenderWheel(() => {
                wordblock.id = getUUID();
                setCurrentData(wordblock);
                const p = buildBlock(wordblock);
                const li = document.querySelector('.ProseMirror').firstChild.lastChild;
                li.replaceChild(p, li.firstChild);
                selection.selectAllChildren(textbox);
                selection.collapse(focusNode, 4);
              });
            },
          });
          const text1 = document.createTextNode('<');
          a.innerText = 'block';
          const text2 = document.createTextNode(`=`);
          const text3 = document.createTextNode(`>`);
          // focusNode.appendChild(text1);
          focusNode.appendChild(text1);
          focusNode.appendChild(a);
          focusNode.appendChild(text2);
          focusNode.appendChild(text3);
          const selection = window.getSelection();
          selection.selectAllChildren(textbox);
          // selection.collapseToEnd();
          selection.collapse(focusNode, 4);
        }
      });

      textbox.addEventListener('input', async () => {
        const selection = getSelection();
        const range = selection.getRangeAt(0);

        const textNode = range.startContainer;
        const startOffset = range.startOffset;

        const textContent = textNode.textContent;
        setWord('');

        let arr = textContent.match(/\(\((.*?)\)\)/);
        if (arr && arr[1]) {
          setWord(arr[1]);
        }
        arr = textContent.match(/\[\[(.*?)\]\]/);
        if (arr && arr[1]) {
          setWord(arr[1]);
        }
        currentNode = selection.focusNode.parentElement;
        if (lastText.length > textContent.length) {
          lastText = textContent;
          return;
        }

        if (
          textContent?.slice(startOffset - 2, startOffset) === '((' &&
          (!textContent[startOffset] ||
            textContent[startOffset] === ' ' ||
            textContent[startOffset] == '>')
        ) {
          const res = await checkIsLogin();
          if (!res) {
            Message({ content: 'Please login first' });
            return;
          }
          // @ts-ignore
          textNode.insertData(startOffset, '))');
          range.setStart(textNode, startOffset);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
          type = 'text block';
          setCursorPosition({
            left: range.getClientRects()[0].left,
            top: range.getClientRects()[0].top,
          });
          handleClickOpen();
        } else if (textContent.slice(startOffset - 10, startOffset) === '/wordblock') {
          handleClickOpen();
          type = undefined;
        } else if (
          textContent.slice(startOffset - 2, startOffset) === '[[' &&
          (!textContent[startOffset] ||
            textContent[startOffset] === ' ' ||
            textContent[startOffset] == '>')
        ) {
          const res = await checkIsLogin();
          if (!res) {
            Message({ content: 'Please login first' });
            return;
          }
          // @ts-ignore
          textNode.insertData(startOffset, ']]');
          range.setStart(textNode, startOffset);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
          type = 'article';
          setCursorPosition({
            left: range.getClientRects()[0].left,
            top: range.getClientRects()[0].top,
          });
          handleClickOpen();
        }
        lastText = textContent;
      });

      clearInterval(timer);
    }, 1000);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setShowDetail(false);
  };

  const checkParent = (arr) => {
    if (!arr) {
      return false;
    }
    for (const a of arr) {
      if (a.href.includes('https://wordblock/#wordblock')) {
        return a;
      }
    }

    return false;
  };

  const handleApply = (item: WordData) => {
    let arr = [];
    if (/\(\(.*?\)\)/.test(currentNode.innerHTML)) {
      arr = currentNode.innerHTML.split(/\(\(.*?\)\)/);
    } else {
      arr = currentNode.innerHTML.split(/\[\[.*?\]\]/);
    }

    const p = document.createElement('p');
    const a = document.createElement('a');
    const arrs = currentNode.parentElement.querySelectorAll('a');
    const oldParent = checkParent(arrs);

    const wordblock = {
      ...item,
    };
    delete wordblock.content;
    delete wordblock.type;
    a.setAttribute('href', `${item.url}#wordblock=${JSON.stringify(wordblock)}`);

    let text1;
    let text2;

    if (item.type === 'article') {
      text1 = document.createTextNode('<');
      a.innerText = 'article';
      text2 = document.createTextNode(`=${item.content}>`);
    } else {
      text1 = document.createTextNode('<');
      a.innerText = 'block';
      text2 = document.createTextNode(`=${item.content}>`);
    }

    p.appendChild(text1);
    p.appendChild(a);
    p.appendChild(text2);
    currentNode.innerHTML = '';
    if (arr[0]) {
      currentNode.innerHTML = arr[0];
    }
    currentNode.appendChild(p);
    if (arr[1]) {
      currentNode.innerHTML += arr[1];
    }

    if (currentNode.parentElement.tagName != 'LI') {
      const ul = document.createElement('ul');
      const li = document.createElement('li');
      ul.appendChild(li);
      li.appendChild(p);
      textbox.replaceChild(ul, currentNode);
    }

    setTimeout(() => {
      if (oldParent) {
        const data: any = JSON.parse(getQueryString('wordblock', oldParent.href));
        data.content = `${data.content}~${item.id}`;

        const a = currentNode.parentElement.querySelector('a');
        a.setAttribute('href', `https://wordblock/#wordblock=${JSON.stringify(data)}`);
      }
    }, 100);

    handleClose();
    Message({ content: 'Apply Succeessfully' });
  };

  const handleSaveToMyWordblock = () => {
    let content = currentHoverEl.nextSibling.textContent.split('>')[0].slice(1);
    const items = [];
    if (currentData.type === 'parent') {
      content = currentHoverEl.parentElement.textContent
        .replaceAll('<block=', '')
        .replaceAll('>', '')
        .replaceAll('block=', '');

      const nodes: any[] = Array.from(currentHoverEl.parentElement.childNodes).slice(2);
      for (let i = 0; i < nodes.length; i++) {
        const item = nodes[i];
        if (!item.tagName) {
          const arr = item.textContent.split('>');

          if (arr.length === 1) {
            items.push(arr[0].replaceAll('=', '').replaceAll('<', '').trim());
          } else {
            items.push(arr[1].replaceAll('=', '').replaceAll('<', '').trim());
          }
        } else {
          let data: any = getQueryString('wordblock', item.getAttribute('href'));

          if (data) {
            data = JSON.parse(data);
          }

          const content = nodes[i + 1].textContent.split('>')[0];

          items.push({
            ...data,
            content: content.slice(1),
          });
        }
      }
    }
    chrome.runtime.sendMessage(
      {
        type: 'SAVE_TO_MY_WORDBLOCK',
        content,
        author: currentData.author,
        id: currentData.id,
        url: location.href,
        items: items.filter((item) => item),
      },
      (data) => {
        if (data.type === 'SAVED') {
          Message({ content: 'Saved to Wordblock Succeessfully' });
        } else if (data.type === 'SELECT_TEXT') {
          Message({ content: 'Please select the text you want to save' });
        } else if (data.type === 'DUPLICATED') {
          Message({ content: 'Save Fail. The block ID is exist.' });
        } else if (data.type === 'NOT_LOGIN') {
          Message({ content: 'Please login first' });
        }
      },
    );
  };

  return (
    <div id="wordblock" css={styles.wordblock}>
      <Global styles={defaultStyles.global} />

      <PopoverContent
        word={word}
        type={type}
        onApply={handleApply}
        visible={open}
        name="modal"
        onCancel={handleClose}
        style={css`
          position: fixed;
          top: ${cursorPosition.top + 24}px;
          left: ${cursorPosition.left}px;
        `}
      />

      <Detail
        visible={showDetail}
        style={
          currentData.id === 'null'
            ? css`
                right: 40px;
                bottom: 103px;
                top: unset;
                left: unset;
              `
            : css`
                top: ${detailPosition.top - 236 > 0
                  ? detailPosition.top - 236
                  : detailPosition.top + 30}px;
                left: ${detailPosition.left}px;
              `
        }
      >
        <div css={styles.detailWrapper}>
          <div css={styles.descItem}>
            <span className="word-label">BlockID: </span>
            <span className="word-value">
              {currentData.id ? (
                <>
                  {currentData.id?.slice(0, 18)}
                  {currentData.id !== 'null' && '...'}
                </>
              ) : (
                <img src={loadingSVG} />
              )}
            </span>
          </div>
          <div css={styles.descItem}>
            <span className="word-label">Date:</span>
            <span className="word-value">
              {dayjs(currentData.create_at).format('YYYY-MM-DD HH:mm')}
            </span>
          </div>
          {currentData.type === 'ParentBlock' ? (
            <div css={styles.descItem}>
              <span className="word-label">Children: </span>
              <div>
                {currentData.content.split('~').map((item) => (
                  <div>{item}...</div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div css={styles.descItem}>
                <span className="word-label">Url: </span>
                <span className="word-value">
                  <a href={currentData.url} target="_blank" rel="noreferrer">
                    {currentData.url?.slice(0, 20)}...
                  </a>
                </span>
              </div>
              <div css={styles.descItem}>
                <span className="word-label">Author: </span>
                <span className="word-value">{currentData.author}</span>
              </div>

              <div css={styles.descItem}>
                <span className="word-label">Tags: </span>
                <span className="word-value">#mirror #web3</span>
              </div>
              <div css={styles.descItem}>
                <span className="word-label">Comments: </span>
                <span className="link word-value" onClick={() => setShowComments(true)}>
                  5 conversations
                </span>
              </div>
              <div css={styles.descItem}>
                <span className="word-label">References: </span>
                <span className="link word-value" onClick={() => setShowReferences(true)}>
                  3 links
                </span>
              </div>
              <div
                css={css`
                  text-align: center;
                  margin-bottom: 8px;
                `}
              >
                <CustomButton size="small" disableRipple onClick={handleSaveToMyWordblock}>
                  Save To My Wordblock
                </CustomButton>
              </div>
            </>
          )}
        </div>
      </Detail>

      <Drawer anchor="right" open={showReferences} onClose={() => setShowReferences(false)}>
        <div css={styles.drawerWrapper}>
          <div css={styles.totalReference}>
            <span css={styles.text}>Total Reference</span>
            <span css={styles.count}>3</span>
          </div>

          {[
            { icon: reference1, logoText: 'Mirror', title: 'Entries – Dashboard – Mirror' },
            { icon: reference2, logoText: 'Medium', title: 'Entries – Dashboard – Mirror' },
            { icon: reference1, logoText: 'Mirror', title: 'Entries – Dashboard – Mirror' },
          ].map((item) => (
            <div css={styles.referenceItem}>
              <div css={styles.referenceItemLogo}>
                <img src={item.icon} />
                <span>{item.logoText}</span>
              </div>
              <div css={styles.referenceItemTitle}>{item.title}</div>
              <div css={styles.referenceItemButton}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() =>
                    window.open(
                      'https://mirror.xyz/0xEc055bA35C0c646E3D31Ee644e33e1a9221f9Fc2/6FngCYBATPQrwAR3hiMMCe2x6G-qa9CMkJhjsImsbuI',
                    )
                  }
                >
                  OPEN
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Drawer>

      <Drawer anchor="right" open={showComments} onClose={() => setShowComments(false)}>
        <div css={styles.drawerWrapper}>
          <div css={styles.totalReference}>
            <span css={styles.text}>Total Comments</span>
            <span css={styles.count}>5</span>
          </div>

          {[
            { icon: reference1, time: '2022-06-27 17:00', content: 'The text looks great for me.' },
            { icon: reference2, time: '2022-06-26 13:00', content: 'I enjoy it!' },
            { icon: reference1, time: '2022-06-26 12:00', content: 'Nice text block.' },
            { icon: reference2, time: '2022-06-23 17:00', content: 'Never to late to learn' },
            { icon: reference1, time: '2022-06-01 17:00', content: "It's valuable" },
          ].map((item) => (
            <div css={styles.commentItem}>
              <div css={styles.avatarWrapper}>
                <img src={item.icon} />
                <span>{item.content}</span>
              </div>
              <div css={styles.commentTime}>{item.time}</div>
            </div>
          ))}
        </div>
      </Drawer>

      <SaveWordBlockModal visible={showSaveWordBlockModal} onCancel={() => setShowSaveWordBlockModal(false)} blockData={blockData} />
    </div>
  );
}

const styles = {
  wordblock: css`
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
  `,
  container: css`
    width: 340px;
    height: 100%;
    background: rgba(145, 158, 171, 0.08);
    margin: 0;
    padding: 12px 12px;
    position: relative;
    overflow: hidden;

    .MuiButtonBase-root {
      color: red;
    }
  `,
  detailWrapper: css`
    position: relative;
    padding: 10px 10px 0 0;
    width: 260px;
    min-height: 230px;
    background: linear-gradient(0deg, rgb(255 255 255 / 80%), rgb(255 255 255 / 80%)),
      rgb(49 48 54 / 40%);
    backdrop-filter: blur(10px);
    overflow-y: auto;
  `,
  descItem: css`
    display: flex;
    font-size: 13px;
    margin-bottom: 6px;
    padding-left: 10px;
    .word-value {
      color: #444;
      flex: 1;
      text-overflow: ellipsis;
      word-break: break-all;
      display: -webkit-box;
      -webkit-line-clamp: 2; /* 行数*/
      -webkit-box-orient: vertical;
      overflow: hidden;
      img {
        width: 16px;
      }
    }
    .link {
      color: #1976d2;
      cursor: pointer;
    }
    .word-label {
      width: 80px;
      font-size: 12px;
    }
  `,
  close: css`
    width: 20px;
    position: absolute;
    right: 22px;
    top: 22px;
    cursor: pointer;
  `,
  fixedLogo: css`
    position: fixed;
    bottom: 50px;
    right: 20px;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    box-shadow: 0 3px 5px 0 rgb(0 0 0 / 10%);
    background: #fbfbfb;
    cursor: pointer;
    border: 2px solid #e1e1fe;
    box-sizing: border-box;
    img {
      width: 28px;
    }
  `,
  drawerWrapper: css`
    width: 300px;
  `,
  totalReference: css`
    display: flex;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #e5e5e5;
  `,
  text: css`
    font-size: 15px;
    font-weight: bold;
    margin-right: 6px;
  `,
  count: css`
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #eef2ff;
    font-weight: bold;
    color: #6366f1;
    text-align: center;
    line-height: 24px;
  `,
  referenceItem: css`
    border-bottom: 1px solid #e5e5e5;
    position: relative;
    padding: 12px 16px;
  `,
  referenceItemLogo: css`
    display: flex;
    align-items: center;
    margin-bottom: 4px;
    img {
      width: 18px;
      height: 18px;
      object-fit: cover;
      margin-right: 8px;
      border-radius: 4px;
    }
  `,
  referenceItemTitle: css`
    font-size: 13px;
    color: #999;
  `,
  referenceItemButton: css`
    position: absolute;
    top: 20px;
    right: 10px;
  `,
  commentItem: css`
    border-bottom: 1px solid #e5e5e5;
    position: relative;
    padding: 12px 16px;
  `,
  avatarWrapper: css`
    display: flex;
    align-items: center;
    img {
      width: 17px;
      height: 17px;
      object-fit: cover;
      margin-right: 8px;
      border-radius: 50%;
    }

    span {
      font-size: 14px;
    }
  `,
  commentTime: css`
    color: #999;
    font-size: 13px;
  `,
};
