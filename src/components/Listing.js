import React from 'react';
import '../css/list.css';
import Filter from './Filter.js';
import {Div, SectionList} from './Elements.js';

function Item (props) {
  return (
    <li className={props.className} onClick={(e)=>props.handlePlaces(props.place)}>
      <h3>{props.place.name}</h3>
      <address>{props.place.address}</address>
      <div className="rating">{`Rating: ${props.place.rating}\u2605`}</div>
    </li>
  );
}

function Listing (props) {
  return (
    <Div id="listing" className={props.className}>
      <Filter className="filter" filter={props.filter} updateFilter={props.updateFilter}/>
      <SectionList id={props.id}>
        {props.list.map((place) => <Item className="item" key={place.place_id} place={place} handlePlaces={props.handlePlaces} />)}
      </SectionList>
    </Div>
  );
}

export default Listing;
