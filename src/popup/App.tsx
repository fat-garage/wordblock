import {useEffect, useState} from 'react';
import { hot } from 'react-hot-loader/root';
import { css, Global } from '@emotion/react';

import Navbar from '../components/Navbar';
import List from '../components/List';
import defaultStyles from '../utils/defaultStyles';
import logo from '../assets/img/logo.png';
import {isLogin, login, logout} from '../utils/storage';

function App() {
  const [word, setWord] = useState<string>('');
  const [_isLogin, setLogin] = useState(true);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const result = await isLogin();
    setLogin(!!result);
  }

  const toLogin = () => {
    login();
    setLogin(true);
  }

  const toLogout = () => {
    logout();
    setLogin(false);
  }

  return (
    <div id="wordblock">
      {
        _isLogin ? (
          <>
            <Global styles={defaultStyles.global} />   
            <div css={styles.container}>
              <Navbar word={word} setWord={setWord} toLogout={toLogout} />

              <List word={word} setWord={setWord} />
            </div>
          </>
        ) : (
          <div css={styles.loginWrapper}>
            <div css={styles.loginBtn} onClick={() => toLogin()}>
              <img src={logo} />
              Log in to Wordblock
            </div>
          </div>
        )
      }
    </div>
  );
}

const styles = {
  container: css`
    width: 340px;
    height: 520px;
    background: rgba(145, 158, 171, 0.08);
    margin: 0;
    padding: 60px 12px 0;
    font-family: Poppins;
    position: relative;
    overflow: hidden;
  `,
  loginWrapper: css`
    width: 240px;
    height: 60px;
    display: flex;
    align-items: center;
    padding: 20px;
    justify-content: center;
  `,
  loginBtn: css`
    flex: 1;
    font-size: 14px;
    line-height: 20px;
    padding: 12px 15px;
    font-weight: 500;
    border-radius: 4px;
    background-color: #4ba3e2;
    text-align: center;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 20px;
      margin-right: 4px;
    }
  `
}

export default hot(App);
