import React from 'react';
import Details from './Details.js';
import Listing from './Listing.js';

function Info (props){
  // If currentPlace defined display its details
  if (props.displayPlace){
    return (
      <Details id='details'
        className={props.className + ' details'}
        currentPlace={props.currentPlace}
        handlePlaces={props.handlePlaces}
        map={props.map} />
    );
  // If currentPlace not defined display places list with filter
  } else {
    return (
      <Listing id='list' className={props.className}
        list={props.list}
        handlePlaces={props.handlePlaces}
        filter={props.filter}
        updateFilter={props.updateFilter} />
    );
  }
}

export default Info;
