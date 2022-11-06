/* eslint-disable react/require-default-props */
import { css } from '@emotion/react';
import { ReactNode, useEffect, useRef } from 'react';

interface ModalProps {
  children?: ReactNode;
  visible: Boolean;
  onCancel: () => void;
  style?: any;
  name: string;
}

const Modal = function ({ children, visible, onCancel, style, name }: ModalProps) {
  const modalEle = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (visible && !modalEle.current?.contains(event.target as any)) {
        event.stopPropagation();
        onCancel();
        document.getElementById(name)?.removeEventListener('click', handleClick);
      }
    };

    if (visible) {
      // document.body.style.overflow = 'hidden';
      document.getElementById(name)?.addEventListener('click', handleClick);
    } else {
      // document.body.style.overflow = 'auto';
    }

    return () => {
      document.getElementById(name)?.removeEventListener('click', handleClick);
    };
  }, [onCancel, visible, name]);

  return (
    <div
      id={name}
      css={css`
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
        visibility: ${visible ? 'visible' : 'hidden'};
        background: rgb(1 1 1 / 60%);
        opacity: ${visible ? '1' : '0'};
        transition: opacity 0.15s;
        font-family: Poppins;
      `}
    >
      <div
        ref={modalEle}
        onClick={(e) => e.stopPropagation()}
        css={css`
          width: 420px;
          min-height: 200px;
          background: white;
          border-radius: 8px;
          opacity: ${visible ? '1' : '0'};
          transition: all 0.3s;
          transform: ${visible ? 'scale(1)' : 'scale(0.3)'};
          overflow: hidden;
          ${style};
        `}
      >
        {children}
      </div>
    </div>
  );
};
export default Modal;
