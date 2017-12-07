import React from 'react';
import '../css/filter.css';

class Filter extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      limit: this.props.max || 5,
      max: this.props.max || 5,
      min: this.props.min || 1,
      star: {
        EMPTY: '\u2606',
        SET: '\u2605'
      }
    }
  };

  // Generates actual rating score with stars
  // Returns array of empty and filled stars
  getStarsArray(limit, score){
    var array = [];
    for (var i = 0; i < limit; i++) {
      if (i < score) {
        // Put filled star into array
        array.push(this.state.star.SET);
      } else {
        // Put empty star into array
        array.push(this.state.star.EMPTY);
      }
    }
    return array;
  };

  // Generates list of stars <li> elements showing rating score
  // Adds event listener for every star <li>
  generateStarsList(type, limit, score){
    return this.getStarsArray(limit, score).map((star, index) =>
      <li key={type + (Number(index) + 1)} data-number={Number(index) + 1} onClick={this.handleStarClick}>{star.toString()}</li>
    )
  }

  // Updates score list depending on given score and limit
  updateStarsList(list, limit, score){
    var array = this.getStarsArray(limit, score);
    for (var i = 0; i < limit; i++) {
      list[i].innerText = array[i].toString()
    }
  }

  // Handles star click
  // - updates Content.filter min or max
  // - updates state.
  handleStarClick = (e) =>{
    var element = e.target;
    var score = Number(element.getAttribute('data-number'));
    var list = element.parentNode;
    if (list.id === 'min' && score <= this.props.filter.max) {
      this.props.updateFilter(score, this.props.filter.max);
      this.updateStarsList(list.children, this.state.limit, score);
    } else if (list.id === 'max' && score >= this.props.filter.min) {
      this.props.updateFilter(this.props.filter.min, score);
      this.updateStarsList(list.children, this.state.limit, score);
    }
  }

  render () {
    return (
      <div className={this.props.className}>
        <header><h3>Rating filter</h3></header>
        <div className="rating">
          <label>Minimum</label>
          <ul id="min">
            {this.generateStarsList('min', this.state.limit, this.props.filter.min)}
          </ul>
        </div>
        <div className="rating">
          <label>Maximum</label>
          <ul id="max">
            {this.generateStarsList('max', this.state.limit, this.props.filter.max)}
          </ul>
        </div>
        {this.props.children}
      </div>
    );
  };
}

export default Filter;
