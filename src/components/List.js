import React from 'react';
import Item from './Item.js';
import Filter from './Filter.js';

class List extends React.Component{
  constructor(props){
    super(props);
  }

  render () {
    return (
      <div className={this.props.className}>
        <Filter  className="filter"/>
        <ul className="places">
          {this.props.list.map((place) => <Item className="item" key={place.placeId} place={place}/>)}
        </ul>
      </div>
    );
  };
}

export default List;
