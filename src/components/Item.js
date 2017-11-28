import React from 'react';

class Item extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      ID: this.props.placeID,
      name: this.props.name,
      address: this.props.address,
      stars: this.props.stars,
      reviews: this.props.reviews
    }
  }

  render () {
    return (
      <div className={this.props.className}>Item</div>
    );
  };
}

export default Item;
