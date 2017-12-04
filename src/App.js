import React from 'react';
import Content from './components/Content.js';

class App extends React.Component {
  render() {
    return (
      <div className="container">
        <Content className="content"/>
      </div>
    );
  }
}

export default App;
