import { css } from '@emotion/react';

import PoppinsBold from '../assets/fonts/Poppins-Bold.ttf';
import PoppinsMedium from '../assets/fonts/Poppins-Medium.ttf';
import Poppins from '../assets/fonts/Poppins.ttf';

const styles = {
  global: css`
    body {
      padding: 0;
      margin: 0;
      font-size: 14px;

      @font-face {
        font-family: Poppins;
        font-style: normal;
        src: url(${Poppins});
      }

      @font-face {
        font-family: Poppins-medium;
        font-style: normal;
        src: url(${PoppinsMedium});
      }

      @font-face {
        font-family: Poppins-bold;
        font-style: normal;
        src: url(${PoppinsBold});
      }
    }

    * {
      box-sizing: border-box;
    }

    .wordblock_highlight {
      color: #1976d2;
    }

    // a[href^='https://defiprime'] {
    //   color: red;
    //   visibility: hidden;
    // }
  `,
};

export default styles;