import React from 'react';
import List from './List.js';
import Map from './Map.js';

class Content extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      list: [],
      displayStates: {
        LOADING: 0,
        LIST: 1,
        ITEM: 2
      },
      displayState: ''
    };
    this.addItemToList = this.addItemToList.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
  }

  componentDidMount(){
    this.setState({displayState: this.state.displayStates.LOADING});
  }

  // Define new place for list
  defineListElement (googlePlacesDetails) {
    // Add unique values
    let arrayElement = {
      placeId: googlePlacesDetails.place_id,
      name: googlePlacesDetails.name,
      address: googlePlacesDetails.formatted_address,
      location: {
        lat: googlePlacesDetails.geometry.location.lat(),
        lng:  googlePlacesDetails.geometry.location.lng()
      },
      rating: googlePlacesDetails.rating,
      reviews: []
    }
    // Add array of reviews
    for (var i = 0; i < googlePlacesDetails.reviews.length; i++) {
      arrayElement.reviews.push({
        rating: googlePlacesDetails.reviews[i].rating,
        text:  googlePlacesDetails.reviews[i].text
      });
    }
    return arrayElement;
  }

  addItemToList(googlePlacesDetails){
    // Check if element already exists in a list
    let isInList = false;
    for (var i = 0; i < this.state.list.length; i++) {
      if (this.state.list[i].placeId === googlePlacesDetails.place_id) isInList = true;
    }

    // If element doesn't exist in state.list
    if (!isInList) {
      // create new array element
      let newPlace = this.defineListElement(googlePlacesDetails);
      // Update state.list
      this.setState((prevState)=>{
        // make copy of previous state.list
        let listCopy = prevState.list.slice();
        // push new element to list copy
        listCopy.push(newPlace);
        // assign copy to current state.list
        return {list: listCopy, displayState: prevState.displayStates.LIST}
      });
      return this.state.list[this.state.list.length - 1];
    } else {
      return undefined;
    }
  }

  handleFilter(){
    console.log('handle filter');
  }

  render () {
    return (
      <div className={this.props.className}>
        <Map className="map" handleNewPlace={this.addItemToList}/>
        <List className="list" list={this.state.list} handleFilter={this.handleFilter}/>
      </div>
    );
  };
}

export default Content;
