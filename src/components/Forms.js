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
      alert: false,
      currentStar: 5
    };
  }

  alertOn = () => {
    this.setState({
      alert: true
    })
  }

  alertOff = () => {
    this.setState({
      alert: false
    })
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

  handleAlert () {
    if (this.state.alert) return (
      <div id= "reviewTextAlert" className="alert">
        * Write few words. This field can&#39;t be empty!
      </div>
    );
    else return null;
  }

  handleSubmit = (alert) => {
    if (this.state.reviewTextValue.length) {
      this.alertOff();
      this.props.handleNewReview(this.state.reviewTextValue, this.state.currentStar);
    } else this.alertOn();
  }

  render () {
    return (
      <form id={this.props.id} ref='reviewForm'>
        <label htmlFor="reviewText">You review:</label>
        <textarea id="reviewText" type="text" name="reviewText"  rows="5" value={this.state.reviewTextValue} onChange={this.handleReviewText} placeholder="Here You can leave your comment..." autoFocus/>
        {this.handleAlert()}

        <ul className="stars">
          {this.displayStars(this.state.currentStar)}
        </ul>

        <Symbol id='submitReview' className='button' handler={this.handleSubmit} alt="Submit review">
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
      alertPlaceName: false,
      placeAddressValue: this.props.address || '',
      alertPlaceAddress: false,
    };
  }

  setAlertPlaceName = (bool) => {
    this.setState({
      alertPlaceName: bool
    })
  }

  setAlertPlaceAddress = (bool) => {
    this.setState({
      alertPlaceAddress: bool
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

  handleAlert (property) {
    if (property) return (
      <div id= "reviewTextAlert" className="alert">
        * Write few words. This field can&#39;t be empty!
      </div>
    );
    else return null;
  }

  handleSubmit = () => {
    let readyToSubmit = 1;

    // Validate Place Name Input
    if (this.state.placeNameValue.length){
      this.setAlertPlaceName(false);
      readyToSubmit *= 1;
    }
    else {
      this.setAlertPlaceName(true);
      readyToSubmit *= 0;
    }

    // Validate Place Address Input
    if (this.state.placeAddressValue.length) {
      this.setAlertPlaceAddress(false);
      readyToSubmit *= 1;
    } else {
      this.setAlertPlaceAddress(true);
      readyToSubmit *= 0;
    }

    // Proceed if validated
    if (readyToSubmit)
      this.props.handler(this.state.placeNameValue, this.state.placeAddressValue, 0);
  }

  render(){
    return (
      <form id={this.props.id} >
        <label htmlFor="placeName">Place name:</label>
        <input id="placeName" type="text" name="placeName"  value={this.state.placeNameValue} onChange={this.handlePlaceName} placeholder="Place name..." autoFocus/>
        {this.handleAlert(this.state.alertPlaceName)}
        <label htmlFor="placeAddress">Address:</label>
        <input id="placeAddress" type="text" name="placeAddress"  value={this.state.placeAddressValue} onChange={this.handlePlaceAddress} placeholder="Address..." />
        {this.handleAlert(this.state.alertPlaceAddress)}
        <br/>
        <Symbol id='submitNewPlace' className='button' handler={this.handleSubmit} alt="Add place">
          Add place
        </Symbol>
      </form>
    );
  }
}

export {ReviewForm, NewPlaceForm};
