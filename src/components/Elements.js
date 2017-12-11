import React from 'react';
import '../css/elements.css';

function Header (props) {
  return <header className={props.className}> {props.children} </header>
}

function Symbol (props) {
  return <div className={props.className} id={props.id} onClick={props.handler} title={props.alt}>{props.children}</div>;
}

function Title (props) {
  return (
    <h2>
      {props.children}
    </h2>
  );
}

function SectionList (props) {
  return (
    <section id={props.id} className={props.id}>
      <ul>
        {props.children}
      </ul>
    </section>
  );
}

function Div (props) {
    return (
      <div id={props.id} className={props.className}>
        {props.children}
      </div>
    );
}

function Modal(props) {
  if (props.display) {
    return (
      <Div className={props.className} id={props.id}>
        <Symbol id='closeModal' className='close' handler={props.handlerClose} alt="Close" />
        {props.children}
      </Div>
    );
  } else return null;
}

function List (props) {
  if (props.elements) if (props.elements.length)
    return (
      <SectionList id={props.id}>
        {props.generateList(props.elements)}
      </SectionList>
    );
  return null;
}

export {Div, Header, Modal, List, SectionList, Title, Symbol};
