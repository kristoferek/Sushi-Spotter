import React from 'react';
import {Header} from './Elements.js';
import Map from './Map.js';
import Info from './Info.js';
import '../css/content.css';

class Content extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      list: [],
      //   map: google.maps.Map(),
      // map: undefined,
      currentPlace: undefined,
      // currentPlace:{
      //   location: {
      //     lat: 52.23303800000001,
      //     lng: 21.01950599999998
      //   },
      //   name: "Besuto Sushi Bar",
      //   place_id: "ChIJlyrHiPbMHkcRG2jOH2ImCA4",
      //   rating: 4.3,
      //   address: "Nowy Świat 27, Warszawa"
      // },
      displayPlace: false,
      filter: {
        min: 0,
        max: 5
      }
    };
    this.filterList = this.filterList.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.handlePlaces = this.handlePlaces.bind(this);
    this.updateMap = this.updateMap.bind(this);
    // this.handleNewPlace = this.handleNewPlace.bind(this);
  }

  componentWillMount() {
    // JSON file url on myJason.com
    const jsonServ = 'https://api.myjson.com/bins/p8igj';
    let myList = [];

    // Get and parse JSON file
    fetch(jsonServ).then((response) => {
      // If fetching ok parse JSON file
      if (response.ok) { return response.json(); }
      // else alert error
      throw new Error('Network response was not ok.');
    })
    // If parsing ok
    .then((myJson) => {
      // sort by rating
      myList = myJson.sort(function(a, b){return b.rating - a.rating});
      // and update state.list
      if (myList.length > 0) {
        this.setState({
          list:  myList
        });
        // console.log(this.state.list);
      }
    })
    // else alert error
    .catch(function(error){
      console.log( 'There was problem with fetching operation' + error.message);
    });
  }

  // Sets reference in state to the newly created Google Map
  updateMap (map) {
    this.setState({
      map: map
    });
  }

  // Handles places - add new, update, display place or list
  handlePlaces (place) {
    // If place parameter was given
    if (place) {
      let array = this.state.list.slice();
      let index = undefined;
      // Check if place is in list of places, if so store its index
      let existsInList = array.some((element, i) => {
        if (place.place_id === element.place_id) {
          index = i;
          return true;
        }
        return false;
      });

      // If place is in list of places UPDATE list element
      if (existsInList) array[index] = place
      // If place isn't in list ADD element to the list
      else array.push(place);

      // Update list, current place and set display state to true
      this.setState({
        list: array,
        currentPlace: place,
        displayPlace: true
      });
    // If there was no function parameter given
    } else {
      // Empty current place and set display state to false
      this.setState({
        currentPlace: undefined,
        displayPlace: false
      });
    }
    return this.state.currentPlace;
  }

  // Returns filtered list by rating
  filterList (min, max) {
    let array = [];
    this.state.list.map(function(place) {
      if (Number(place.rating) >= min && Number(place.rating) <= max) array.push(place);
      return null;
    });
    return array;
  }

  // Handles filter parameters
  updateFilter (min, max) {
    this.setState({
      filter: {
        min: min,
        max: max
      }
    });
  }

  // // Define new place for list
  // defineListElement (googlePlacesDetails) {
  //   // Add unique values
  //   let arrayElement = {
  //     location: {
  //       lat: googlePlacesDetails.geometry.location.lat(),
  //       lng:  googlePlacesDetails.geometry.location.lng()
  //     },
  //     name: googlePlacesDetails.name,
  //     placeId: googlePlacesDetails.place_id,
  //     address: googlePlacesDetails.formatted_address,
  //     rating: googlePlacesDetails.rating,
  //     reviews: []
  //   }
  //   // Add array of reviews
  //   for (var i = 0; i < googlePlacesDetails.reviews.length; i++) {
  //     arrayElement.reviews.push({
  //       rating: googlePlacesDetails.reviews[i].rating,
  //       text:  googlePlacesDetails.reviews[i].text
  //     });
  //   }
  //   return arrayElement;
  // }

  // handleNewPlace(googlePlacesDetails){
  //   // Check if element already exists in a list
  //   let isInList = false;
  //   this.state.list.map((el) => {
  //     if (el.placeId === googlePlacesDetails.place_id) isInList = true;
  //     return null;
  //   });
  //
  //   // If element doesn't exist in state.list
  //   if (!isInList) {
  //     // Create new array element
  //     let newPlace = this.defineListElement(googlePlacesDetails);
  //
  //     // Update state.list
  //     this.setState((prevState) => {
  //       // Make copy of previous state.list
  //       let listCopy = prevState.list.slice();
  //       // Push new element to list copy
  //       listCopy.push(newPlace);
  //       // Assign copy to the current state.list
  //       return {list: listCopy}
  //     });
  //
  //     // Return newly created element - the last in the state.list
  //     return this.state.list[this.state.list.length - 1];
  //   } else {
  //     return undefined;
  //   }
  // }

  render () {
    const filteredList = this.filterList(this.state.filter.min, this.state.filter.max);
    return (
      <div className={this.props.className}>

        <div className="main">
          <Header className="header">
            <h1>Sushi <br />Spotter</h1>
          </Header>
          {//-- Map section responsible for Google Map API and Google Places API
          }
          <Map className="map"
          list={filteredList}
          updateMap={this.updateMap}
          handlePlaces={this.handlePlaces}
          />
        </div>

        {//-- Restaurant list section responsible for displaying list or single restaurant details
        }
        <Info className="info"
          list={filteredList}
          currentPlace={this.state.currentPlace}
          handlePlaces={this.handlePlaces}
          filter={this.state.filter}
          updateFilter={this.updateFilter}
          map={this.state.map}
        />
      </div>
    );
  };
}

export default Content;
