import ReactDOM from 'react-dom';

import routes from './routes';

const root = document.createElement('div');
root.id = 'root';
document.body.append(root);

ReactDOM.render(<>{routes}</>, document.querySelector('#root'));
