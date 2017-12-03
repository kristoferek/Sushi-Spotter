import React from 'react';
import '../css/item.css';

class Item extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      reviews: this.props.reviews
    }
  }

  render () {
    return (
      <li className={this.props.className} onClick={(e)=>this.props.toggleInfoView(this.props.place)}>
        <h3>{this.props.place.name}</h3>
        <address>{this.props.place.address}</address>
        <div className="rating">{`Rating: ${this.props.place.rating}`}</div>
      </li>
    );
  };
}

export default Item;
