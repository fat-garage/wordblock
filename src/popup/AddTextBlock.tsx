import { hot } from 'react-hot-loader/root';
import { useHistory, useLocation } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import AppBar from '@mui/material/AppBar';
import { styled, alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { css } from '@emotion/react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import logo from '../assets/img/logo.png';
import logout from '../assets/img/logout.png';
import back from '../assets/img/back.png';
import { getData, setData } from '../utils/storage';
import { getUUID } from '../utils/utils';
import { Ceramic } from '../sdk/Ceramic';
import { WordData } from '../utils/types';
import AddTags from '../components/AddTags';
import EmojiStatus from '../components/EmojiStatus'

function AddTextBlock() {
  const history = useHistory();
  const location = useLocation();
  const wordData: WordData = (window as any).wordData;
  const [value, setValue] = useState('');
  const [tags, setTags] = useState([]);
  const [status, setStatus] = useState("");
  const [isEdit] = useState(Boolean(location.search));

  const canEditContent = useMemo(() => {
    return isEdit && wordData.group === 'created' || !isEdit
  }, [isEdit, wordData])

  useEffect(() => {
    if (wordData && isEdit) {
      setValue(wordData.content);
      setTags(wordData.tags);
      setStatus(wordData.status);
    }
  }, [isEdit, wordData]);

  const handleSave = async () => {
    if (!isEdit) {
      const newBlock = {
        url: 'https://wordblock.xyz/',
        content: value,
        author: '0x9c8F',
        tags,
        create_at: Date.now(),
        type: 'text block',
        group: 'created',
      } as WordData;

      chrome.runtime.sendMessage(
        {
          type: 'CREATE_BLOCK',
          content: newBlock,
        },
        (res) => {
          if (res?.code === 0) {
            newBlock.id = res?.result;
            goBack();
          }
        },
      );
    } else {
      chrome.runtime.sendMessage(
        {
          type: 'EDIT_BLOCK',
          content: {
            ...wordData,
            content: value,
            tags,
            status
          },
        },
        () => {
          goBack();
        },
      );
    }
  };

  const goBack = () => {
    history.push({
      pathname: '/',
      // state: {
      //   from: 'add',
      // },
    });
  };

  return (
    <div>
      <div css={styles.navbar}>
        <div css={styles.leftWrapper}>
          <Tooltip title="Logout">
            <IconButton onClick={() => history.push('/')}>
              <img src={back} width={19} />
            </IconButton>
          </Tooltip>
        </div>
        <div css={styles.middleWrapper}>{isEdit ? 'Edit Text Block' : 'Created Text Block'}</div>

        <div css={styles.rightWrapper}></div>
      </div>

      <div css={styles.inputWrapper}>
        <textarea
          placeholder="Add your text block ..."
          rows={12}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!canEditContent}
        />
      </div>

      <div css={styles.tagsWrapper}>
        <div className="wb-label">Tags: </div>
        <AddTags tags={tags} setTags={setTags} />
      </div>

      <div css={styles.tagsWrapper} style={{paddingTop: "4px"}}>
        <div className="wb-label">Status: </div>
        <EmojiStatus status={status} setStatus={setStatus} />
      </div>

      <div css={styles.submitWrapper}>
        <Button variant="outlined" size="medium" disabled={!value} onClick={() => handleSave()}>
          Save Text Block
        </Button>
      </div>
    </div>
  );
}

export const styles = {
  navbar: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgb(239, 239, 239);
    padding: 0 10px;
    height: 48px;
  `,
  leftWrapper: css`
    width: 60px;
  `,
  middleWrapper: css`
    flex: 1;
    text-align: center;
    font-size: 15px;
  `,
  rightWrapper: css`
    width: 60px;
  `,
  inputWrapper: css`
    padding: 0;
    border-bottom: 1px solid #ebedf0;
    textarea {
      padding: 12px;
      width: 100%;
      border: none;
      outline: none;
      font-size: 13px;
      line-height: 1.5;
      font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
    }
  `,
  submitWrapper: css`
    padding: 20px;
    text-align: center;

    .MuiButton-root {
      text-transform: none;
    }
  `,
  tagsWrapper: css`
    display: flex;
    align-items: center;
    padding: 12px;
    .wb-label {
      margin-right: 8px;
      font-weight: bold;
      font-size: 13px;
    }
  `,
};

export default hot(AddTextBlock);
