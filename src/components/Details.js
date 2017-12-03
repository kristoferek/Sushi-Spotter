import React from 'react';
import '../css/details.css';

class Details extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      reviews: this.props.reviews
    }
  }

  render () {
    if (this.props.currentPlace){
      return (
        <div id={this.props.id} className={this.props.className}>
          <section id='streetViewImages' className='placeImages'></section>
          <h2>
            <div className='close' onClick={(e)=>this.props.toggleInfoView()}> </div>
            {this.props.currentPlace.name}
          </h2>
          <address>{this.props.currentPlace.address}</address>
          <div className="rating">{`Rating: ${this.props.currentPlace.rating}`}</div>
          <section id='reviews' className='placeReviews'></section>
        </div>
      );
    } else {
      return (
        <div id={this.props.id} className={this.props.className}>
        No sushi clicked!
        </div>
      );
    }
  };
}

export default Details;
