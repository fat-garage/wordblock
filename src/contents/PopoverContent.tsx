/* eslint-disable react/require-default-props */
import { css } from '@emotion/react';
import { ReactNode, useEffect, useRef, useCallback, useState } from 'react';
import { WordData, WordDataType } from '../utils/types';
import { getData, removeData } from '../utils/storage';
import Pagination from '@mui/material/Pagination';

interface ModalProps {
  children?: ReactNode;
  visible: Boolean;
  onCancel: () => void;
  style?: any;
  name: string;
  word: string;
  type?: WordDataType;
  onApply?: (item: WordData) => void;
}

const PopoverContent = function ({
  visible,
  onCancel,
  style,
  name,
  word,
  type,
  onApply,
}: ModalProps) {
  const modalEle = useRef<HTMLDivElement | null>(null);

  const [data, setData] = useState<WordData[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getWordData();
  }, [word, type, visible, page]);

  const getWordData = useCallback(async () => {
    const limit = 4;
    if (!word) {
      setData([]);
      return;
    }
    const { data, total } = await getData({ page: page - 1, limit, type, search: word });
    setData(data);
    setTotal(Math.ceil(total / limit));
  }, [word, type, visible, page]);

  const onPageChange = (_, value) => {
    setPage(value);
  };

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (visible && !modalEle.current?.contains(event.target as any)) {
        event.stopPropagation();
        onCancel();
        document.getElementById(name)?.removeEventListener('click', handleClick);
      }
    };

    if (visible) {
      // document.body.style.overflow = 'hidden';
      document.getElementById(name)?.addEventListener('click', handleClick);
    } else {
      // document.body.style.overflow = 'auto';
    }

    return () => {
      document.getElementById(name)?.removeEventListener('click', handleClick);
    };
  }, [onCancel, visible, name]);

  return (
    <div
      id={name}
      css={css`
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
        visibility: ${visible ? 'visible' : 'hidden'};
        opacity: ${visible ? '1' : '0'};
        transition: opacity 0.15s;
        font-family: Poppins;
      `}
    >
      <div
        ref={modalEle}
        onClick={(e) => e.stopPropagation()}
        css={css`
          min-width: 320px;
          min-height: 50px;
          max-width: 320px;
          max-height: 400px;
          background: white;
          border-radius: 12px;
          opacity: ${visible ? '1' : '0'};
          transition: all 0.3s;
          transform: ${visible ? 'scale(1)' : 'scale(0.3)'};
          overflow: hidden;
          border: 1px solid #dadde9;
          ${style};
        `}
      >
        <div
          css={css`
            transition: all 0.3s;
          `}
        >
          {data.map((item) => {
            let content = item.content;
            if (word) {
              const reg = new RegExp(word, 'ig');
              const arr = content.match(reg);

              if (arr) {
                content = content.replace(
                  arr[0],
                  `<span class="wordblock_highlight">${arr[0]}</span>`,
                );
              }
            }

            return (
              <div
                onClick={() => onApply(item)}
                css={css`
                  overflow: hidden;
                  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
                  padding: 12px;
                  cursor: pointer;
                  &:hover {
                    background: #eee;
                  }
                `}
              >
                <div
                  css={css`
                    color: #666;
                    font-size: 14px;
                    display: -webkit-box;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                  `}
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            );
          })}
          {data.length ? (
            <div
              css={css`
                display: flex;
                justify-content: center;
                padding: 8px 0;
              `}
            >
              <Pagination count={total} page={page} onChange={onPageChange} size="small" />
            </div>
          ) : null}
          {!word && (
            <div
              css={css`
                color: #666;
                padding: 12px;
                margin-top: 1px;
              `}
            >
              Search for block
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopoverContent;
