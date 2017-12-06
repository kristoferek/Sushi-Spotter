import React from 'react';

class Header extends React.Component{
  render(){
    return (
      <header className={this.props.className}> {this.props.children} </header>
    );
  }
}

class Symbol extends React.Component{
  render(){
    return <div className={this.props.className} id={this.props.id} onClick={(e)=>this.props.handler()} title={this.props.alt}>{this.props.children}</div>;
  }
}

class Title extends React.Component {
  render () {
    return (
      <h2>
        {this.props.children}
      </h2>
    );
  }
}

class SectionList extends React.Component {
  render () {
    return (
      <section ref={this.props.id} id={this.props.id} className={this.props.id}>
        <ul>
          {this.props.children}
        </ul>
      </section>
    );
  }
}

class Div extends React.Component {
  render () {
    return (
      <div id={this.props.id} className={this.props.className}>
        {this.props.children}
      </div>
    );
  }
}

class Modal extends React.Component{
  render () {
    return (
      <Div className={this.props.className} id={this.props.id}>
        <Symbol id='closeModal' className='close' handler={this.props.handler} alt="Close" />
        {this.props.children}
      </Div>
    );
  }
}


export {Div, Modal, Header, SectionList, Title, Symbol};
