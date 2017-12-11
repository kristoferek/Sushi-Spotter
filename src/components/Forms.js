import React from 'react';
import {Symbol} from './Elements.js';

function Star (props) {
  return <li onClick={props.handler}>{props.children}</li>;
}

class ReviewForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      reviewTextValue: '',
      currentStar: 5
    };
  }

  handleReviewText = (e) => {
    this.setState({
      reviewTextValue: e.target.value
    })
  }

  handleCurrentStar = (number) => {
    this.setState({
      currentStar: number
    })
  }

  displayStars = (counter) => {
    let stars = [], emptyStar = '\u2606', filledStar = '\u2605', star;
    for (var i = 1; i <= 5; i++) {
      if (i <= counter) star = filledStar
      else star = emptyStar;
      let number = i;
      stars.push(<Star key={'newReview' + number} handler={(e) => this.setState({ currentStar: number })}>{star}</Star>);
    }
    return stars;
  }

  render () {
    return (
      <form id={this.props.id} >
        <label htmlFor="reviewText">You review:</label>
        <textarea id="reviewText" type="text" name="reviewText"  rows="5" value={this.state.reviewTextValue} onChange={this.handleReviewText} placeholder="Here You can leave your comment..." autoFocus/>

        <ul className="stars">
          {this.displayStars(this.state.currentStar)}
        </ul>

        <Symbol id='submitReview' className='button' handler={(e) => this.props.handleNewReview(this.state.reviewTextValue, this.state.currentStar)} alt="Submit review">
          Add my Review
        </Symbol>
      </form>
    );
  }
}

class NewPlaceForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      placeNameValue: '',
      placeAddressValue: this.props.address || '',
      currentStar: 5
    };
  }

  handleStateProperity = (properityName, properityValue) => {
  this.setState({
    properityName: properityValue
  })
}

  handlePlaceName = (e) => {
    this.setState({
      placeNameValue: e.target.value
    })
  }

  handlePlaceAddress = (e) => {
    this.setState({
      placeAddressValue: e.target.value
    })
  }

  handleCurrentStar = (number) => {
    this.setState({
      currentStar: number
    })
  }

  displayStars = (counter) => {
    let stars = [], emptyStar = '\u2606', filledStar = '\u2605', star;
    for (var i = 1; i <= 5; i++) {
      if (i <= counter) star = filledStar
      else star = emptyStar;
      let number = i;
      stars.push(<Star key={'newReview' + number} handler={(e) => this.setState({ currentStar: number })}>{star}</Star>);
    }
    return stars;
  }

  render(){
    return (
      <form id={this.props.id} >
        <label htmlFor="placeName">Place name:</label>
        <input id="placeName" type="text" name="placeName"  value={this.state.placeNameValue} onChange={this.handlePlaceName} placeholder="Place name..." autoFocus/>
        <label htmlFor="placeAddress">Address:</label>
        <input id="placeAddress" type="text" name="placeAddress"  value={this.state.placeAddressValue} onChange={this.handlePlaceAddress} placeholder="Address..." />

        <ul className="stars">
          {this.displayStars(this.state.currentStar)}
        </ul>

        <Symbol id='submitNewPlace' className='button' handler={(e) => this.props.handler(this.state.placeNameValue, this.state.placeAddressValue, this.state.currentStar)} alt="Add place">
          Add place
        </Symbol>
      </form>
    );
  }
}

export {ReviewForm, NewPlaceForm};
