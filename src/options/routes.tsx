import { HashRouter, Route, Switch } from 'react-router-dom';

import Example from './Example';

const routes = (
  <HashRouter>
    <Switch>
      <Route path="/example" component={Example} exact />
    </Switch>
  </HashRouter>
);

export default routes;
