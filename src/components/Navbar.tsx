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
  marginLeft: 30,
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

export default function Navbar({ word, setWord, toLogout }: NavbarProps) {
  return (
    <AppBar>
      <Toolbar>
        <img src={logo} width={22} css={css`border-radius: 50%;`} />
        <span css={css`margin-left: 4px; font-size: 16px;`}>0x9c8F...</span>
      
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase placeholder="Search…" value={word} onChange={e => setWord && setWord(e.target.value)} />
        </Search>
        
        <Tooltip title="Logout">
          <IconButton color="inherit" onClick={() => toLogout()}>
            <img src={logout} width={20} />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  )
}