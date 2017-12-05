import React from 'react';
import '../css/list.css';
import Item from './Item.js';

class List extends React.Component{
  render () {
    return (
      <ul id={this.props.id} className={this.props.className}>
        {this.props.list.map((place) => <Item className="item" key={place.place_id} place={place} updateCurrentPlace={this.props.updateCurrentPlace} />)}
      </ul>
    );
  };
}

export default List;
