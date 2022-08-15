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
import { useHistory } from 'react-router-dom';
import {useState} from 'react';
import {getData, setData} from '../utils/storage';
import {getUUID} from '../utils/utils';

export default function Navbar() {
  const history = useHistory();
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const {data} = await getData();

    setData([
      ...data,
      {
          url: 'https://wordblock.xyz/',
          content: value,
          author: "0x9c8F",
          tags: "web3",
          create_at: Date.now(),
          id: getUUID(),
          type: "text block",
          group: 'created',
      }
    ])

    setTimeout(() => {
      setLoading(false)
      goBack();
    }, 500);
  }

  const goBack = () => {
    history.push({
      pathname: '/',
      state: {
        from: "add"
      }
    });
  }

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
        <div css={styles.middleWrapper}>Created Text Block</div>

        <div css={styles.rightWrapper}></div>
      </div>

      <div css={styles.inputWrapper}>
        <textarea placeholder="Add your text block ..." rows={12} value={value} onChange={e => setValue(e.target.value)} />
      </div>

      <div css={styles.submitWrapper}>
        <Button variant="outlined" size="medium" disabled={!value} onClick={handleSave}>
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
    padding: 8px 8px 8px 12px;
    border-bottom: 1px solid #ebedf0;
    textarea {
      width: 100%;
      border: none;
      outline: none;
      font-family: Poppins;
    }
  `,
  submitWrapper: css`
    padding: 20px;
    text-align: center;

    .MuiButton-root {
      text-transform: none;
    }
  `
};
