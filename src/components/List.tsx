import { useState, useEffect, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import dayjs from 'dayjs';
import { css } from '@emotion/react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import EditLocationAltOutlinedIcon from '@mui/icons-material/EditLocationAltOutlined';
import Tooltip from '@mui/material/Tooltip';
import Pagination from '@mui/material/Pagination';
import { WordData, WordDataType } from '../utils/types';
import { getData, removeData } from '../utils/storage';
import { getBlockName } from '../utils/utils';
import empty from '../assets/img/empty.png';
import logo from '../assets/img/logo.png';
import close from '../assets/img/close.png';
import bookmark from '../assets/img/bookmark.png';
import remove from '../assets/img/remove.png';
import send from '../assets/img/send.png';
import copy from '../assets/img/copy.png';
import edit from '../assets/img/edit.png';
import view from '../assets/img/view.png';
import ButtonGroup from '@mui/material/ButtonGroup';
import edit2 from '../assets/img/edit2.png'

interface Props {
  styles?: any;
  mode?: string;
  onApply?: (item: WordData) => void;
  type?: WordDataType;
  handleClose?: Function;
  word?: string;
  setWord?: Function;
}

export default function List(props: Props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [data, setData] = useState<WordData[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [showDetail, setShowDetail] = useState(false);
  const [current, setCurrent] = useState<WordData>(null);
  const open = Boolean(anchorEl);
  const [group, setGroup] = useState('favorite');
  const [currentHoverId, setCurrentHoverId] = useState('');
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    // @ts-ignore
    if (location.state?.from === 'add' && group !== 'created') {
      setGroup('created');
    }
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    getWordData();
  }, [props.word]);

  const getWordData = useCallback(async () => {
    const limit = 4;
    const { data, total, all } = await getData({
      page: page - 1,
      limit,
      type: props.type,
      search: props.word,
      group,
    });
    setData(data);
    setTotal(Math.ceil(total / limit));
  }, [page, props.word, group]);

  useEffect(() => {
    getWordData();
  }, [getWordData, page]);

  const removeWordData = async (item: WordData) => {
    await removeData(item);
    getWordData();
    setPage(1);
  };

  const handleClickEdit = (item: WordData) => {
    setCurrent(item);
    setShowDetail(true);
  };

  const shareToTwitter = (item: WordData) => {
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(item.content));
  };

  const getAction = (item: WordData) => {
    if (props.mode === 'content') {
      return (
        <div
          css={css`
            text-align: right;
            flex-shrink: 0;
          `}
        >
          <Button onClick={() => props.onApply(item)}>Apply</Button>
        </div>
      );
    }

    return (
      <div
        css={css`
          flex: 1;
          text-align: right;
          visibility: ${item.id === currentHoverId ? 'visible' : 'hidden'};
        `}
      >
        <Tooltip title="Edit Block">
          <IconButton color="primary" component="span" onClick={() => editWord(item)}>
            <img src={edit} width={17} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Share to Twitter">
          <IconButton color="primary" component="span" onClick={() => shareToTwitter(item)}>
            <img src={send} width={19} />
          </IconButton>
        </Tooltip>

        <Tooltip title="View Detail">
          <IconButton color="primary" component="span" onClick={() => handleClickEdit(item)}>
            <img src={view} width={17} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete">
          <IconButton color="primary" component="span" onClick={() => removeWordData(item)}>
            <img src={remove} width={19} />
          </IconButton>
        </Tooltip>
      </div>
    );
  };

  const onPageChange = (_, value) => {
    setPage(value);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
  };

  const editWord = (item?: WordData) => {
    (window as any).wordData = item || current
    history.push('/add?edit=true')
  }

  const getDetail = () => {
    if (!showDetail) {
      return null;
    }

    return (
      <div css={styles.detailWrapper}>
        <img src={close} css={styles.close} onClick={handleCloseDetail} />
        <div css={styles.logoWrapper}>
          <img src={logo} />
          <span>WordBlock</span>
        </div>
        <div css={styles.descItem}>
          <label>BlockID: </label>
          <span>{current.id?.slice(0, 18)}</span>
        </div>
        <div css={styles.descItem}>
          <label>Date:</label>
          <span>{dayjs(current.create_at).format('YYYY-MM-DD HH:mm')}</span>
        </div>
        <div css={styles.descItem}>
          <label>Url: </label>
          <span className="item-content">
            <a href={current.url} target="_blank" rel="noreferrer">
              {current.url}
            </a>
          </span>
        </div>
        <div css={styles.descItem}>
          <label>Author: </label>
          <span>{current.author}</span>
        </div>
        <div css={styles.descItem}>
          <label>Tags: </label>
          <span>{current.tags.map(item =>  `#${item} `)}</span>
        </div>
        <div css={styles.descItem}>
          <label>Type: </label>
          <span>{current.type || 'text block'}</span>
        </div>
        <div css={styles.descItem}>
          <label>Content: </label>
          <span className="item-content">
            {current.items?.length ? (
              <span>{current.items.map((item) => renderItem(item))}</span>
            ) : <>
            
            <span dangerouslySetInnerHTML={{ __html: current.content }}></span>
                <img src={edit} width={15} onClick={() => editWord()} style={{
                  position: "relative",
                  top: 3,
                  left: 7,
                  cursor: "pointer"
                }} />
              </>
            }
          </span>
        </div>
      </div>
    );
  };

  const handleClickWordblock = (item) => {
    setCurrent(item);
    setShowDetail(true);
  };

  const renderItem = (item: any) => {
    if (typeof item === 'string') {
      return <span>{item + ' '}</span>;
    } else {
      return (
        <span className="data-wordblock" onClick={() => handleClickWordblock(item)}>
          {item.content}
        </span>
      );
    }
  };

  const getContent = () => {
    if (data.length === 0) {
      return (
        <div css={styles.emptyWrapper}>
          <img src={empty} />
        </div>
      );
    }

    return (
      <div>
        <div>
          {data.map((item) => {
            let word = props.word;
            let content = item.content;
            let items = item.items;
            if (word) {
              if (word.includes("#")) {
                word = word.replace("#", "");
                const reg = new RegExp(word, 'ig');
                
                item.tags = item.tags.map(tag => {
                  const arr = tag.match(reg);
                  if (arr) {
                    tag = tag.replace(
                      arr[0],
                      `<span class="wordblock_highlight">${arr[0]}</span>`,
                    );
                  }
                  return tag
                })

              } else {
                const reg = new RegExp(word, 'ig');
                const arr = content.match(reg);

                if (arr) {
                  content = content.replace(
                    arr[0],
                    `<span class="wordblock_highlight">${arr[0]}</span>`,
                  );
                }
              }
            }
            return (
              <div
                key={item.id}
                css={css`
                  ${styles.item}
                  ${item.id === currentHoverId &&
                  css`
                    background-color: #f6f6f6;
                  `}
                `}
                onMouseEnter={() => setCurrentHoverId(item.id)}
                onMouseLeave={() => setCurrentHoverId('')}
              >
                <div css={styles.textWrapper}>
                  {item.type === 'article' && <img src={bookmark} />}

                  {items?.length ? (
                    <div>{items.map((item) => renderItem(item))}</div>
                  ) : (
                    <span dangerouslySetInnerHTML={{ __html: content }}></span>
                  )}
                </div>
                {/* <div css={styles.dateWrapper}>
                  <span>{getBlockName(item.type)}</span>
                  <span>{dayjs(item.create_at).format('YYYY-MM-DD HH:mm')}</span>
                </div> */}
                <div css={styles.descWrapper}>
                  <span css={styles.tagsWrapper}>{item.tags.map(tag => <span dangerouslySetInnerHTML={{ __html: `#${tag} ` }}></span>)}</span>
                  {getAction(item)}
                </div>
              </div>
            );
          })}
        </div>

        <div
          css={css`
            display: flex;
            justify-content: center;
            margin-top: 12px;
          `}
        >
          <Pagination count={total} page={page} onChange={onPageChange} />
        </div>
      </div>
    );
  };

  return (
    <>
      {getDetail()}
      <div css={styles.topBar}>
        <div css={styles.selectWrapper}>
          <span
            css={css`
              color: ${group === 'favorite' && 'rgb(0, 127, 255)'};
            `}
            onClick={() => setGroup('favorite')}
          >
            Favorite
          </span>
          <span css={css`margin: 0 4px;`}>|</span>
          <span
            css={css`
              color: ${group === 'created' && 'rgb(0, 127, 255)'};
            `}
            onClick={() => setGroup('created')}
          >
            Created
          </span>
        </div>

        <Tooltip title="Add Text Block">
          <IconButton color="primary" component="span" onClick={() => history.push('/add')}>
            <img src={edit} width={16} />
          </IconButton>
        </Tooltip>
      </div>
      {getContent()}
    </>
  );
}

export const styles = {
  topBar: css`
    padding: 8px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e5e5e5;
  `,
  selectWrapper: css`
    color: #666;
    span {
      font-size: 13px;
      margin-right: 4px;
      cursor: pointer;
    }
  `,
  item: css`
    background: white;
    border-bottom: 1px solid #e5e5e5;
    cursor: pointer;
    padding: 11px 4px 2px 12px;
    text-align: left;
  `,
  textWrapper: css`
    color: black;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    img {
      width: 20px;
      position: relative;
      top: 5px;
      left: -2px;
    }
  `,
  descWrapper: css`
    color: #969799;
    font-size: 13px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  tagsWrapper: css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  `,
  dateWrapper: css`
    color: #969799;
    font-size: 13px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  emptyWrapper: css`
    width: 100%;
    height: 100%;
    padding-top: 100px;
    text-align: center;
    img {
      width: 200px;
    }
  `,
  detailWrapper: css`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1200;
    padding: 0px 16px;
    background: linear-gradient(0deg, rgb(255 255 255 / 80%), rgb(255 255 255 / 80%)),
      rgb(49 48 54 / 40%);
    backdrop-filter: blur(10px);
    overflow-y: auto;
  `,
  logoWrapper: css`
    display: flex;
    align-items: center;
    padding: 20px 0;
    img {
      width: 34px;
      border-radius: 50%;
    }
    span {
      font-size: 15px;
      margin-left: 8px;
    }
  `,
  descItem: css`
    display: flex;
    margin-bottom: 8px;
    .item-content {
      color: #444;
      flex: 1;
      text-overflow: ellipsis;
      word-break: break-all;
      display: -webkit-box;
      -webkit-line-clamp: 12; /* 行数*/
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.6;
    }
    label {
      width: 72px;
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
};
