import React from 'react';
import {Symbol} from './Elements.js';
import './../css/gallery.css';

// Photo element
function Photo (props) {
  return (
    <div className='gallery' id={props.id} style={props.style}>
      {props.children}
    </div>
  );
}

// Photo Gallery component
class Gallery extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      index: 0
    }
    this.nextIndex = this.nextIndex.bind(this);
    this.previousIndex = this.previousIndex.bind(this);
  }

  // Set state index value
  setIndex(index){
    this.setState({
      index: index
    });
  }

  // Set previous value of state index
  previousIndex () {
    if (this.state.index === 0)
      this.setIndex(this.props.elements.length - 1)
    else
      this.setIndex(this.state.index  - 1);
  }

  // Set next value of state index
  nextIndex () {
    if (this.state.index === this.props.elements.length - 1)
      this.setIndex(0)
    else
      this.setIndex(this.state.index + 1);
  }

  // Gets from Google place array photos[index] url and background image to thet getUrl
  // returns style element
  setBackground (index) {
    let myStyle;
    if (this.props.elements) if (this.props.elements.length > 0) {
      const src = this.props.elements[index].getUrl({maxWidth: 600, maxHeight: 600});
      myStyle = {
        backgroundImage: 'url('+ src + ')'
      }
    } else {
      myStyle = {};
    }
    return myStyle;
  }

  // Renders actual (state index) photo of elmeets array with controls
  // or if no elements in photos array renders nothing
  render () {
    if (this.props.elements)
      return (
        <Photo id={this.props.id} className={this.props.gallery} style={this.setBackground(this.state.index)}>
          <Symbol className='bigArrow' id='previous' handler={this.previousIndex} alt='Previous photo' />
          <Symbol className='bigArrow' id='next' handler={this.nextIndex} alt='Next photo' />
        </Photo>
      );
    else return (
      <div id={this.props.id} className={this.props.className}>
        
      </div>
    );
  }
}

export default Gallery
