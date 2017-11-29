import React from 'react';

class Item extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      reviews: this.props.reviews
    }
  }

  render () {
    return (
      <li className={this.props.className}>
        <h2>{this.props.place.name}</h2>
        <address>{this.props.place.address}</address>
        <div className="rating">{`Rating: ${this.props.place.rating}`}</div>
      </li>
    );
  };
}

export default Item;
