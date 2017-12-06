import React from 'react';
import '../css/item.css';

class Item extends React.Component{
  render () {
    return (
      <li className={this.props.className} onClick={(e)=>this.props.handlePlaces(this.props.place)}>
        <h3>{this.props.place.name}</h3>
        <address>{this.props.place.address}</address>
        <div className="rating">{`Rating: ${this.props.place.rating}\u2605`}</div>
      </li>
    );
  };
}

export default Item;
