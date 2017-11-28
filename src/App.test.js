import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import List from './components/List.jsx';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
