import React from 'react';
import List from './List.js';
import Map from './Map.js';

class Content extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      list: [],
      starFilter: [0, 5],
      displayStates: {
        LOADING: 0,
        LIST: 1,
        ITEM: 2,
      },
      displayState:''
    }
  }

  render () {
    return (
      <div className={this.props.className}>
        <Map className="map"/>
        <List className="list" />
      </div>
    );
  };
}

export default Content;
