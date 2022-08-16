import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Toolbar from '@mui/material/Toolbar';
import SearchIcon from '@mui/icons-material/Search';
import AppBar from '@mui/material/AppBar';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { css } from '@emotion/react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import logo from '../assets/img/logo.png';
import logout from '../assets/img/logout.png';
import edit from '../assets/img/edit.png';
import { isLogin } from '../utils/storage';
import { Ethereum } from '../sdk/Ethereum';

interface NavbarProps {
  word: string;
  setWord: Function;
  toLogout: Function;
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  marginRight: 4,
  width: '100%',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  svg: { transform: 'scale(0.8)' },
}));

// const SearchIcon = styled('div')(() => ({
//   transform: 'scale(0.8)',
// }));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

// export default function Navbar({ word, setWord, toLogout }: NavbarProps) {
//   return (
//     <AppBar>
//       <Toolbar>
//         <img src={logo} width={22} css={css`border-radius: 50%;`} />
//         <span css={css`margin-left: 4px; font-size: 16px;`}>0x9c8F</span>

//         <Search>
//           <SearchIconWrapper>
//             <SearchIcon />
//           </SearchIconWrapper>
//           <StyledInputBase placeholder="Search…" value={word} onChange={e => setWord && setWord(e.target.value)} />
//         </Search>

//         <Tooltip title="Logout">
//           <IconButton color="inherit" onClick={() => toLogout()}>
//             <img src={logout} width={20} />
//           </IconButton>
//         </Tooltip>
//       </Toolbar>
//     </AppBar>
//   )
// }

export default function Navbar({ word, setWord, toLogout }: NavbarProps) {
  const history = useHistory();
  const [walletAddress, setWalletAddress] = useState('');
  const [did, setDid] = useState('');
  const [hoverWalletAddress, setHoverWalletAddress] = useState(false);
  useEffect(() => {
    const ethereum = new Ethereum();
    ethereum.getWalletAddress().then((data) => {
      setWalletAddress(data);
    });

    chrome.runtime.sendMessage(
      {
        type: 'GET_PROFILE',
      },
      ({ result }) => {
        if (result) {
          const { did, address } = result;
          setWalletAddress(address);
          setDid(did);
        }
      },
    );
  });
  return (
    <div css={styles.navbar}>
      <div css={styles.leftWrapper}>
        <img src={logo} />
        <span
          onMouseEnter={() => setHoverWalletAddress(true)}
          onMouseLeave={() => setHoverWalletAddress(false)}
        >
          {walletAddress.slice(0, 6)}
        </span>
      </div>
      <div
        css={css`
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 50px;
          background: #00000099;
          color: #fff;
          z-index: 1;
          cursor: default;
          visibility: ${!hoverWalletAddress && 'hidden'};
        `}
        onMouseEnter={() => setHoverWalletAddress(true)}
        onMouseLeave={() => setHoverWalletAddress(false)}
      >
        {did.slice(0, 26)}...{did.slice(-7, did.length)}
      </div>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          value={word}
          onChange={(e) => setWord && setWord(e.target.value)}
        />
      </Search>
      <div css={styles.rightWrapper}>
        {/* <Tooltip title="Add Text Block">
          <IconButton onClick={() => history.push('/add')}>
            <img src={edit} width={18} />
          </IconButton>
        </Tooltip> */}
        <Tooltip title="Logout">
          <IconButton onClick={() => toLogout()}>
            <img src={logout} width={20} />
          </IconButton>
        </Tooltip>
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
    height: 50px;
  `,
  leftWrapper: css`
    display: flex;
    align-items: center;

    span {
      font-size: 15px;
      margin-left: 8px;
    }

    img {
      width: 22px;
      margin-left: 2px;
    }
  `,
  rightWrapper: css``,
};
