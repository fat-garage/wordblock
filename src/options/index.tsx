import ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader/root';

import routes from './routes';

const root = document.createElement('div');
root.id = 'root';
document.body.append(root);

const App = hot(() => <div className="basic-layout">{routes}</div>);
ReactDOM.render(<App />, document.querySelector('#root'));
