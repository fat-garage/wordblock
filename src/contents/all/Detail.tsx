/* eslint-disable react/require-default-props */
import { css } from '@emotion/react';
import { ReactNode } from 'react';

interface DetailProps {
  children?: ReactNode;
  visible: Boolean;
  style?: any;
}

const Detail = function ({ children, visible, style }: DetailProps) {
  if (!visible) {
    return null;
  }
  return (
    <div
      css={css`
        position: fixed;
        top: 0;
        left: 0;
        background: #f5f5f9;
        border-radius: 8px;
        color: rgba(0, 0, 0, 0.87);
        border: 1px solid #dadde9;
        min-width: 120px;
        min-height: 230px;
        ${style};
      `}
    >
      {children}
    </div>
  );
};
export default Detail;
