import React from 'react';
import Content from './components/Content.js';
import Header from './components/Header.js';


class App extends React.Component {
  render() {
    return (
      <div className="container">
        <Header className="header"><h1>Powiśle Sushi Spotter</h1></Header>
        <Content className="content"/>
      </div>
    );
  }
}

export default App;
