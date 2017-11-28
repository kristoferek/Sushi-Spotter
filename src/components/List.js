import React from 'react';
import Item from './Item.js';
import Filter from './Filter.js';

class List extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      itemsArray: this.props.list || [],
    }
  }

  render () {
    return (
      <div className={this.props.className}>
        <Filter  className="filter"/>
        <ul>
          <Item />
          <Item />
        </ul>
      </div>
    );
  };
}

export default List;
