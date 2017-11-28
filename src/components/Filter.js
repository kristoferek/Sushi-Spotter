import React from 'react';
import '../css/filter.css'

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
    // this.handleMin = this.handleMin.bind(this);
    // this.handleMax = this.handleMax.bind(this);
  };

  scoreStars(limit, score){
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

  generateStarsList(type, limit, score){
    return this.scoreStars(limit, score).map((star, index) =>
      <li key={type + (Number(index) + 1)} data-number={Number(index) + 1} onClick={this.handleStarClick}>{star.toString()}</li>
    )
  }

  updateStarsList(list, limit, score){
    var array = this.scoreStars(limit, score);
    for (var i = 0; i < limit; i++) {
      list[i].innerText = array[i].toString()
    }
  }

  handleStarClick = (e) =>{
    var element = e.target;
    var score = Number(element.getAttribute('data-number'));
    var list = element.parentNode;
    if (list.id === 'min' && score <= this.state.max) {
      this.setState({ min: score });
      this.updateStarsList(list.children, this.state.limit, score);
    } else if (list.id === 'max' && score >= this.state.min) {
      this.setState({ max: score });
      this.updateStarsList(list.children, this.state.limit, score);
    }

  }

  render () {
    return (
      <div className={this.props.className}>
        Minimum score
        <ul id="min">
          {this.generateStarsList('min', this.state.limit, this.state.min)}
        </ul>
        Maximum score
        <ul id="max">
        {this.generateStarsList('max', this.state.limit, this.state.max)}
        </ul>
      </div>
    );
  };
}

export default Filter;
