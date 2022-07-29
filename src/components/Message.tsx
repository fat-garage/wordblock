import { css, keyframes, SerializedStyles } from '@emotion/react';

import ReactDOM from 'react-dom';

const animate = keyframes`
  from {
    opacity: 0.5;
    transform: translateX(100px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

interface MessageProps {
  content: any;
  style?: SerializedStyles;
}

export const MessageComp = function (props: MessageProps) {
  return (
    <div
      css={css`
        position: fixed;
        top: 40px;
        right: 50px;
        z-index: 10001;
        background: #111;
        border-radius: 8px;
        animation: ${animate} 0.3s linear;
        ${props.style}
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 120px;
          padding: 16px 24px;
          font-size: 15px;
          color: white;
          border-radius: 8px;
          background: linear-gradient(109.41deg, #6734f733 13.03%, rgba(163, 162, 180, 0.2) 90.68%),
        rgba(123, 238, 104, 0.3);
          box-shadow: inset -6px -6px 12px rgba(255, 255, 255, 0.08),
          inset 6px 6px 12px rgba(0, 0, 0, 0.18);
          a {
            color: white;
          }
        `}
      >
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: props.content,
          }}
          css={css`
            font-family: Poppins;
          `}
        />
      </div>
    </div>
  );
};

const message = (props: MessageProps & { duration?: number }) => {
  const holder = document.createElement('div');
  holder.setAttribute('id', 'dataverseMessageBox');
  document.body.append(holder);

  const destroy = () => {
    holder.remove();
  };

  if (props.duration !== 0) {
    setTimeout(() => {
      destroy();
    }, props.duration ?? 3000);
  }

  holder.addEventListener('click', () => {
    holder.remove();
  });

  ReactDOM.render(<MessageComp {...props} />, holder);
};

export default message;
