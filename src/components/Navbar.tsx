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
import { useHistory } from 'react-router-dom';

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
  marginLeft: 20,
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
}));

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

  return (
    <div css={styles.navbar}>
      <div css={styles.leftWrapper}>
        <img src={logo} />
        <span>0x9c8F</span>
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
