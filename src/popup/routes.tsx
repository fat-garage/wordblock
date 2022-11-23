import { HashRouter, Route, Switch } from 'react-router-dom';
import defaultStyles from '../utils/defaultStyles';
import { css, Global } from '@emotion/react';

import App from './App';
import AddTextBlock from './AddTextBlock';

export const styles = {
  basicLayout: css`
    width: 354px;
    height: 550px;

    .data-wordblock {
      text-decoration: underline;
      text-decoration-style: dotted;
      cursor: pointer;
    }
  `,
};

const routes = (
  <div css={styles.basicLayout}>
    <Global styles={defaultStyles.global} />
    <HashRouter>
      <Switch>
        <Route path="/" component={App} exact />
        <Route path="/add" component={AddTextBlock} exact />
      </Switch>
    </HashRouter>
  </div>
);

export default routes;
