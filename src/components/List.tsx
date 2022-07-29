import { useState, useEffect, useCallback } from 'react';

import dayjs from 'dayjs';
import { css } from '@emotion/react';
import SendIcon from '@mui/icons-material/Send';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import EditLocationAltOutlinedIcon from '@mui/icons-material/EditLocationAltOutlined';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import Tooltip from '@mui/material/Tooltip';
import Pagination from '@mui/material/Pagination';
import { WordData, WordDataType } from '../utils/types';
import { getData, removeData } from '../utils/storage';
import empty from '../assets/img/empty.png';
import logo from '../assets/img/logo.png';
import close from '../assets/img/close.png';
import bookmark from '../assets/img/bookmark.png';
import remove from '../assets/img/remove.png';
import send from '../assets/img/send.png';
import copy from '../assets/img/copy.png';
import edit from '../assets/img/edit.png';


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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    getWordData();
  }, [props.word])

  const getWordData = useCallback(async () => {
    const limit = 3;
    const { data, total, all } = await getData({ page: page - 1, limit, type: props.type, search: props.word });
    setData(data);
    setTotal(Math.ceil(total / limit));
  }, [page, props.word]);

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

  const getAction = (item: WordData) => {
    if (props.mode === 'content') {
      return (
        <div
          css={css`
            flex: 1;
            text-align: right;
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
        `}
      >
        <Tooltip title="Edit">
          <IconButton color="primary" component="span">
            <img src={send} width={20} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Edit">
          <IconButton color="primary" component="span" onClick={() => handleClickEdit(item)}>
            <img src={edit} width={17} />
          </IconButton>
        </Tooltip>


        <Tooltip title="Delete">
          <IconButton color="primary" component="span" onClick={() => removeWordData(item)}>
            <img src={remove} width={20} />
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
            <span>{current.id?.slice(0, 18)}...</span>
          </div>
        <div css={styles.descItem}>
          <label>Date:</label>
          <span>{dayjs(current.create_at).format('YYYY-MM-DD HH:mm')}</span>
        </div>
        <div css={styles.descItem}>
          <label>Url: </label>
          <span>
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
          <span>{current.tags}</span>
        </div>
        <div css={styles.descItem}>
          <label>Type: </label>
          <span>{current.type || 'text block'}</span>
        </div>
        <div css={styles.descItem}>
          <label>Content: </label>
          <span>{current.content}</span>
        </div>
      </div>
    );
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
      <>
        <div css={props.styles}>
          {data.map((item) => {
            const word = props.word;
            let content = item.content;
            if (word) {
              const reg = new RegExp(word, 'g')
              content = content.replace(reg, `<span class="wordblock_highlight">${word}</span>`)
            }
            return (
              <div key={item.id} css={styles.item}>
              <div css={styles.textWrapper}>
                {item.type === 'article' && <img src={bookmark} />}
                <span dangerouslySetInnerHTML={{ __html: content }}></span>
              </div>
              <div css={styles.descWrapper}>
                <span>{item.type || 'text block'}</span>
                <span>{dayjs(item.create_at).format('YYYY-MM-DD HH:mm')}</span>
              </div>

              <div
                css={css`
                  display: flex;
                  align-items: center;
                `}
              >
                {/* <IconButton color="primary" component="span" onClick={handleClick} size="small">
                  <SendIcon />
                </IconButton> */}
                <span css={css`font-size: 13px`}>[{item.tags}]</span>

                {getAction(item)}

                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                  <MenuItem onClick={handleClose}>Send to Twitter</MenuItem>
                  <MenuItem onClick={handleClose}>Send to Mirror</MenuItem>
                </Menu>
              </div>
            </div>
            )
          })}
        </div>

        <div
          css={css`
            display: flex;
            justify-content: center;
            margin-top: 16px;
          `}
        >
          <Pagination count={total} color="primary" page={page} onChange={onPageChange} />
        </div>
      </>
    );
  };

  return (
    <>
      {getDetail()}
      {getContent()}
    </>
  );
}

export const styles = {
  item: css`
    background: white;
    box-shadow: rgb(145 158 171 / 16%) 0px 1px 2px 0px;
    border-radius: 8px;
    cursor: pointer;
    padding: 10px 12px 2px;
    margin-top: 12px;
    text-align: left;
    &:hover {
      box-shadow: rgb(145 158 171 / 16%) 0px 16px 32px -4px;
    }
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
    margin-top: 4px;
    display: flex;
    justify-content: space-between;
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
    position: absolute;
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
      width: 36px;
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
    span {
      color: #444;
      flex: 1;
      text-overflow: ellipsis;
      word-break: break-all;
      display: -webkit-box;
      -webkit-line-clamp: 12; /* 行数*/
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    label {
      width: 76px;
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
