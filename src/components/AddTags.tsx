import { useEffect, useState, useRef } from 'react';
import { css } from '@emotion/react';
import {getTagTips} from '../utils/storage'

interface Props {
  tags: string[];
  setTags: (tags: string[]) => void;
  isContent?: boolean;
}

export default function AddTags({ tags, setTags, isContent }: Props) {
  const [inputVisible, setInputVisible] = useState(false);
  const inputRef = useRef(null);
  const [value, setValue] = useState("");
  const [tips, setTips] = useState([])

  useEffect(() => {
    if (inputVisible) {
      inputRef.current.focus();
    }
    setValue("")
    setTips([])
  }, [inputVisible]);

  const handleKeyup = (e: any) => {
    if (e.code === 'Enter') {
      if (e.target.value) {
        setTags(Array.from(new Set([...tags, e.target.value])));
        setInputVisible(false);
      }
    }
  };

  const removeTag = (tag: string) => {
    const index = tags.findIndex((item) => item === tag);

    tags.splice(index, 1);

    setTags([...tags]);
  };

  const selectTip = (tag: string) => {
    setTags(Array.from(new Set([...tags, tag])));
    setInputVisible(false);
  }

  const handleBlur = () => {
    setTimeout(()=> {
      setInputVisible(false)
    }, 100)
  }

  const handleChange = async (e) => {
    const val = e.target.value;
    setValue(val)
    if (!val) {
      setTips([])
      return;
    }

    if (isContent) {
      chrome.runtime.sendMessage(
        {
          type: 'GET_TGA_TIPS',
          word: val
        },
        ({data}) => {
          setTips(data)
        },
      );
    } else {
      const tips = await getTagTips(val);
      setTips(tips)
    }

  }

  return (
    <div css={styles.addTags}>
      {tags.map((tag) => (
        <div className="wb-tag">
          {tag}{' '}
          <span className="wb-remove-tag" onClick={() => removeTag(tag)}>
            X
          </span>
        </div>
      ))}

      {inputVisible ? (
        <div className="wb-input">
          <input value={value} ref={inputRef} onBlur={handleBlur} onKeyUp={handleKeyup} onChange={handleChange} />
          {
            tips.length > 0 && <div className="wb-tags-tips">
              {
                tips.map(tip => (
                  <div className="wb-tips-option" onClick={() => selectTip(tip)}>{tip}</div>
                ))
              }
          </div>
          }
        </div>
      ) : (
        <div className="wb-tag wb-add-tag" onClick={() => setInputVisible(true)}>
          + add tag
        </div>
      )}
    </div>
  );
}

export const styles = {
  addTags: css`
    .wb-tag {
      border: 1px solid rgba(27, 31, 36, 0.15);
    }

    .wb-tag {
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      margin: 0;
      margin-bottom: 2px;
      padding: 0;
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
      font-variant: tabular-nums;
      line-height: 1.5;
      list-style: none;
      -webkit-font-feature-settings: 'tnum';
      font-feature-settings: 'tnum';
      display: inline-block;
      height: auto;
      margin-right: 8px;
      padding: 0 7px;
      font-size: 12px;
      line-height: 26px;
      white-space: nowrap;
      background: #fafafa;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      cursor: default;
      opacity: 1;
      -webkit-transition: all 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
      transition: all 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
    }

    .wb-remove-tag {
      margin-left: 4px;
      cursor: pointer;
    }

    .wb-add-tag {
      border: 1px dashed #d9d9d9;
      margin-bottom: 1px;
    }

    .wb-input {
      display: inline-block;
      position: relative;
    }

    .wb-tags-tips {
      position: absolute;
      z-index: 1000;
      top: 28px;
      left: 0;
      right: -20px;
      min-height: 30px;
      background: white;
      border-radius: 4px;
      padding: 4px 0;
      box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%);
    }

    .wb-tips-option {
      // background: rgba(24, 188, 156, 0.05);
      line-height: 30px;
      overflow: hidden;
      padding-left: 12px;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 13px;
      cursor: pointer;
      &:hover {
        background: rgba(24, 188, 156, 0.1);
      }
    }

    input {
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-variant: tabular-nums;
      list-style: none;
      font-feature-settings: 'tnum';
      position: relative;
      display: inline-block;
      width: 78px;
      height: 28px;
      padding: 4px 11px;
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
      line-height: 1.5;
      background-color: #fff;
      background-image: none;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      transition: all 0.3s;
    }

    input:focus {
      border-color: #3ac9a8;
      box-shadow: 0 0 0 2px rgb(24 188 156 / 20%);
      outline: 0;
    }
  `,
};
