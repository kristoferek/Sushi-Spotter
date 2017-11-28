import React from 'react';

class Header extends React.Component{
  render(){
    return (
      <header className={this.props.className}> {this.props.children} </header>
    );
  }
}

export default Header;
