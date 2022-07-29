import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { css, Global } from '@emotion/react';
import Message from '../components/Message';
import PopoverContent from './PopoverContent';
import defaultStyles from '../utils/defaultStyles';
import { WordData, WordDataType } from '../utils/types';
import logo from '../assets/img/logo.png';
import { getQueryString, getUUID } from '../utils/utils';
import close from '../assets/img/close.png';
import dayjs from 'dayjs';
import Detail from './Detail';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import reference1 from '../assets/img/reference1.jpeg';
import reference2 from '../assets/img/reference2.jpeg';

const CustomButton = styled(Button)({
  'text-transform': 'none',
});

let textbox = null;
let currentNode = null;
let currentData: any = {};
let lastText = '';
let type: WordDataType = undefined;

export default function App() {
  const [open, setOpen] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [word, setWord] = useState('');
  const [cursorPosition, setCursorPosition] = useState<any>({});
  const [detailPosition, setDetailPosition] = useState<any>({});

  useEffect(() => {
    chrome.runtime.onMessage.addListener((data) => {
      if (data.type === 'saved') {
        Message({ content: 'Saved to Wordblock Succeessfully' });
      } else if (data.type === 'selectText') {
        Message({ content: 'Please select the text you want to save' });
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
        let data = getQueryString('wordblock', e.target.href);
        if (!data) {
          return;
        }

        currentData = JSON.parse(data);
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
    currentData = {
      id: 'null',
      content: document.title,
      author: 'unknown',
      url: location.href,
      type: 'article'
    }

    setDetailPosition({
      left: 200,
      top: 200
    })

    setShowDetail(true);
  }


  const checkTextbox = () => {
    const timer = setInterval(() => {
      textbox = document.querySelector('.ProseMirror') || document.querySelector('.css-sgfyjt');

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

      textbox.addEventListener('keydown', (e) => {
        const selection = getSelection();
        const focusNode = selection.focusNode;
        const currentNode = selection.focusNode.parentElement;
        const range = selection.getRangeAt(0);
        const textNode = range.startContainer;
        const startOffset = range.startOffset;

        if (e.code === 'Enter' && !textbox.textContent) {
          const ul = document.createElement('ul');
          const li = document.createElement('li');
          ul.appendChild(li);
          const p = document.createElement('p');
          li.appendChild(p);
          textbox.removeChild(textbox.firstChild);
          textbox.replaceChild(ul, textbox.lastChild);
        }

        if (e.code === 'Space' && currentNode.tagName === 'LI' && !focusNode.textContent.trim()) {
          const a = document.createElement('a');
          const wordblock = {
            url: location.href,
            content: '',
            author: "mirror",
            tags: "web3",
            create_at: Date.now(),
            id: getUUID(),
            type: "text",
          };
          a.setAttribute('href', `${wordblock.url}#wordblock=${JSON.stringify(wordblock)}`);

          const text1 = document.createTextNode('<');
          a.innerText = 'block';
          const text2 = document.createTextNode(`=>`);
          focusNode.appendChild(text1);
          focusNode.appendChild(a);
          focusNode.appendChild(text2);

          setTimeout(() => {
            // @ts-ignore
            focusNode.innerHTML = focusNode.innerHTML.trim();
          }, 50)
        }
      });

      textbox.addEventListener('input', () => {
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
          textContent.slice(startOffset - 2, startOffset) === '((' &&
          (!textContent[startOffset] || textContent[startOffset] === ' ' || textContent[startOffset] == '>')
        ) {
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
          (!textContent[startOffset] || textContent[startOffset] === ' ' || textContent[startOffset] == '>')
        ) {
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
    let oldParent = checkParent(arrs);

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
      currentNode.innerHTML = currentNode.innerHTML + arr[1];
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
        
        let data: any = JSON.parse(getQueryString('wordblock', oldParent.href));
        data.content = data.content + '~' + item.id;
        
        const a = currentNode.parentElement.querySelector('a')
        a.setAttribute('href', `https://wordblock/#wordblock=${JSON.stringify(data)}`);
      }
    }, 100)


    handleClose();
    Message({ content: 'Apply Succeessfully' });
  };

  return (
    <div id="wordblock">
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
        style={currentData.id === 'null' ? css`
          right: 40px;
          bottom: 103px;
          top: unset;
          left: unset;
        ` : css`
          top: ${detailPosition.top - 236 > 0
            ? detailPosition.top - 236
            : detailPosition.top + 30}px;
          left: ${detailPosition.left}px;
        `}
      >
        <div css={styles.detailWrapper}>
          <div css={styles.descItem}>
            <span className="word-label">BlockID: </span>
            <span className="word-value">{currentData.id?.slice(0, 18)}{currentData.id !== 'null' && '...'}</span>
          </div>
          <div css={styles.descItem}>
            <span className="word-label">Date:</span>
            <span className="word-value">{dayjs(currentData.create_at).format('YYYY-MM-DD HH:mm')}</span>
          </div>
          {currentData.type === 'ParentBlock' ? (
            <>
              <div css={styles.descItem}>
                <span className="word-label">Children: </span>
                <div>
                  {
                    currentData.content.split('~').map(item => (
                      <div>{item}...</div>
                    ))
                  }
                </div>
              </div>
            </>
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
                <span className="link word-value">5 conversations</span>
              </div>
              <div css={styles.descItem}>
                <span className="word-label">References: </span>
                <span className="link word-value" onClick={() => setShowDrawer(true)}>
                  3 links
                </span>
              </div>
              <div
                css={css`
                  text-align: center;
                  margin-bottom: 8px;
                `}
              >
                <CustomButton size="small" disableRipple>
                  Save To My Wordblock
                </CustomButton>
              </div>
            </>
          )}
        </div>
      </Detail>

      <div css={styles.fixedLogo} onClick={handleClickLogo}>
        <img src={logo} />
      </div>
      <Drawer anchor={'right'} open={showDrawer} onClose={() => setShowDrawer(false)}>
        <div css={styles.drawerWrapper}>
          <div css={styles.totalReference}>
            <span css={styles.text}>Total Reference</span>
            <span css={styles.count}>3</span>
          </div>

          {[
            { icon: reference1, logoText: 'Mirror', title: 'Entries – Dashboard – Mirror' },
            { icon: reference2, logoText: 'Medium', title: 'Entries – Dashboard – Mirror' },
            { icon: reference1, logoText: 'Mirror', title: 'Entries – Dashboard – Mirror' },
          ].map((item) => {
            return (
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
            );
          })}
        </div>
      </Drawer>
    </div>
  );
}

const styles = {
  container: css`
    width: 340px;
    height: 100%;
    background: rgba(145, 158, 171, 0.08);
    margin: 0;
    padding: 12px 12px;
    font-family: Poppins;
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
    }
    .link {
      color: #1976d2;
      cursor: pointer;
    }
    .word-label {
      width: 76px;
      font-size: 13px;
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
};
