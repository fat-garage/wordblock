import ReactDOM from 'react-dom';

import App from './App';

const root = document.createElement('div');
root.id = 'root';
document.body.append(root);

ReactDOM.render(<App />, document.querySelector('#root'));
