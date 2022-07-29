import ReactDOM from 'react-dom';
import App from './App';

const root = document.createElement('div');
root.id = 'datadidi-container';
document.body.append(root);

ReactDOM.render(
  <App />,
  root,
);
