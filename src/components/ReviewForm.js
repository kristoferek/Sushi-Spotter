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

export default ReviewForm;
