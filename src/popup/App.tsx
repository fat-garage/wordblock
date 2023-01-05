import { useEffect, useState } from 'react';
import { hot } from 'react-hot-loader/root';
import { css, Global } from '@emotion/react';

import Navbar from '../components/Navbar';
import List from '../components/List';
import logo from '../assets/img/logo.png';
import loadingSVG from '../assets/img/loading.svg';
import walletSVG from '../assets/img/wallet.svg';
import { login, logout } from '../utils/api';
import metamaskSvg from '../assets/img/metamask-fox.svg'

function App() {
  const [word, setWord] = useState<string>('');
  const [_isLogin, setLogin] = useState(false);
  const [loginLoading, setLoginLoading] = useState(true);
  const [did, setDid] = useState("")

  useEffect(() => {
    checkLogin();
  }, []);

  const port = chrome.runtime.connect({
    name: 'popup-name',
  });
  
  port.onMessage.addListener((msg: any) => {
    setLogin(msg.isLogin);
    setLoginLoading(msg.loginLoading);
  });

  const checkLogin = async () => {
    chrome.runtime.sendMessage(
      {
        type: 'CHECK_IS_LOGIN',
      },
      ({ result: { isLogin, loginLoading , did} }) => {
        setLogin(isLogin);
        setDid(did)
        setLoginLoading(loginLoading);
      },
    );
  };

  const toLogin = async () => {
    setLoginLoading(true);
    chrome.runtime.sendMessage(
      {
        type: 'LOGIN',
      },
      (res) => {
        if (res?.code === 0) {
          res?.result?.walletAddress && login(res?.result.walletAddress);
          setLogin(true);
          setLoginLoading(false);
        } else {
          login('');
          setLogin(false);
          setLoginLoading(false);
        }
      },
    );
  };
  const handleMetamaskInstall = () => {
    chrome.tabs.create({
      url: "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
    })
  }

  const toLogout = () => {
    chrome.runtime.sendMessage(
      {
        type: 'LOGOUT',
      },
      () => {
        logout();
        setLogin(false);
      },
    );
  };

  return (
    <div id="wordblock" css={styles.wordblock}>
      {_isLogin ? (
        <div css={styles.container}>
          <Navbar word={word} setWord={setWord} toLogout={toLogout} did={did} />
          <List word={word} setWord={setWord} />
        </div>
      ) : (
        <div css={styles.loginWrapper}>
          <div css={styles.header}>WORDBLOCK</div>
          <div css={styles.middle}>
            <div className="logo">
              <div>((</div>
              <img src={logo} />
              <div>))</div>
            </div>
            <div className="title">WORD BLOCK</div>
            <div className="desc">Your Reference Notebook</div>
            <div className="login">
              {loginLoading ? (
                <div className="loading" />
              ) : (
                <div onClick={() => toLogin()}>
                  <img src={walletSVG} />
                  Connect
                </div>
              )}
            </div>
          </div>

          <div css={styles.bottom}>
            Please install <div onClick={handleMetamaskInstall}><img src={metamaskSvg} width={20} /><strong>Metamask</strong></div> to connect
          </div>
          {/* <div css={styles.loginBtn} onClick={() => toLogin()}>
            <img src={logo} />
            Log in to Wordblock
            {loginLoading && (
              <img
                src={loadingSVG}
                css={css`
                  width: 18px !important;
                  margin-left: 2px;
                `}
              />
            )}
          </div> */}
        </div>
      )}
    </div>
  );
}

const styles = {
  wordblock: css`
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
  `,
  container: css`
    position: relative;
    overflow: hidden;
  `,
  loginWrapper: css`
    /* display: flex;
    align-items: center;
    padding: 200px 40px;
    justify-content: center; */
  `,
  header: css`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 40px;
    height: 50px;
    background: #fafafa;
    font-size: 16px;
    letter-spacing: 0.02rem;
    font-weight: 800;
    -webkit-text-stroke: 0.01px #000;
  `,
  middle: css`
    text-align: center;
    margin-top: 50px;
    padding: 20px 40px;
    font-size: 40px;
    > .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      > img {
        width: 60px;
      }
    }

    > .title {
      margin-top: 40px;
      font-size: 30px;
      font-weight: bold;
      -webkit-text-stroke: 1px #000;
    }
    > .desc {
      font-size: 20px;
      color: #999;
    }
    > .login {
      margin-top: 20px;
      height: 40px;
      > div {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 150px;
        height: 50px;
        background: #fafafa;
        color: #9191bc;
        font-weight: 800;
        font-size: 18px;
        border-radius: 6px;
        margin: auto;
        cursor: pointer;
        > img {
          width: 20px;
          margin-right: 10px;
        }
      }
      > .loading {
        position: relative;
        top: 20px;
        left: -9999px;
        width: 7px;
        height: 7px;
        border-radius: 5px;
        background-color: #9191bc;
        color: #9191bc;
        box-shadow: 9984px 0 0 0 #9191bc, 9999px 0 0 0 #9191bc, 10014px 0 0 0 #9191bc;
        animation: dotTyping 1.5s infinite linear;
        @keyframes dotTyping {
          0% {
            box-shadow: 9984px 0 0 0 #9191bc, 9999px 0 0 0 #9191bc, 10014px 0 0 0 #9191bc;
          }
          5% {
            box-shadow: 9984px -10px 0 0 #9191bc, 9999px 0 0 0 #9191bc, 10014px 0 0 0 #9191bc;
          }
          10% {
            box-shadow: 9984px 0 0 0 #9191bc, 9999px -10px 0 0 #9191bc, 10014px 0 0 0 #9191bc;
          }
          15% {
            box-shadow: 9984px 0 0 0 #9191bc, 9999px 0 0 0 #9191bc, 10014px -10px 0 0 #9191bc;
          }
          20% {
            box-shadow: 9984px 0 0 0 #9191bc, 9999px 0 0 0 #9191bc, 10014px 0 0 0 #9191bc;
          }
        }
      }
    }
  `,
  bottom: css`
    text-align: center;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 60px;
    color: #999;
    img {
      width: 16px;
      cursor: pointer;
      margin: 0 4px;
    }
    > div {
      display: flex;
      color: black;
      font-weight: 800;
      align-items: center;
      margin-right: 4px;
      cursor: pointer;
    }
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
  `,
};

export default hot(App);
