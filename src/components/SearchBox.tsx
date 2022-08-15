import { css } from '@emotion/react';


export default function SearchBox() {
  return (
    <div css={styles.searchWrapper}>
      <div css={styles.searchBox}></div>
    </div>
  )
}

export const styles = {
  searchWrapper: css`
    padding: 16px 30px 4px;
  `,
  searchBox: css`
    border: 1px solid #E5E5E5;
    border-radius: 8px;
    box-shadow: 0px 1px rgba(16, 24, 40, 0.05);
    height: 36px;
  `
}