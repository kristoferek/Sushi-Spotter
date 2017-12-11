import React from 'react';
import '../css/map.css';
import sushi from '../img/sushi_icon.png';
import sushi_gray from '../img/sushi_icon_gray.png';
import {Modal} from './Elements.js';
import {NewPlaceForm} from './Forms.js';

class Map extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      APIKey: 'AIzaSyCmX-3F5SG5M8xs3OLWjyIjEZrDHt-9bo0',
      mapParameters: {
        center: {
          lat: 52.2351118,
          lng: 21.0352136
        },
        zoom: 14
      },
      displayModal: false,
      newPlacePosition: undefined
    };
    this.generateMarkers = this.generateMarkers.bind(this);
    this.showInfoWindow = this.showInfoWindow.bind(this);
    this.closeInfoWindow = this.closeInfoWindow.bind(this);
    this.initMap = this.initMap.bind(this);
    this.newMarker = this.newMarker.bind(this);

    window.initMap = this.initMap;
    this.map = undefined;
    this.markers = [];
    this.newPlaceMarker = undefined;
  }

  componentDidMount(){
    // Load and inject Google JavaScript API with Google Places library
    // into index.html and when done run the callback function initMap()
    this.loadJS("https://maps.googleapis.com/maps/api/js?key=" + this.state.APIKey + "&callback=initMap&libraries=places");
  };

  componentWillReceiveProps(nextProps) {
    let refreshMarkers = true;
    // Check if new props.list differs from current props.list and decide to refresh markers
    if (nextProps.list.length === this.props.list.length) {
      refreshMarkers = nextProps.list.some((place, i) => place.place_id !== this.props.list[i].place_id);
    }

    // Create and display markers if Content.state.list updates
    if (refreshMarkers)
    this.generateMarkers(nextProps.list, this.map, this.infoWindow);
  }

  // Hide Modal with form Add New Place
  hideModal = () => {
    this.setState({
      displayModal: false
    })
  }

  // Display Modal with form Add New Place
  showModal = () => {
    this.setState({
      displayModal: true
    })
  }

  // Set new place position
  setNewPlacePosition = (val) => {
    this.setState({
      newPlacePosition: val
    })
  }

  // Inject src script into index.html
  loadJS (src) {
    let ref = window.document.getElementsByTagName("script")[0];
    let script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    ref.parentNode.insertBefore(script, ref);
  }

  placeInfoWindowContent (place, handler) {
    // Set content for info window
    const contentInfo = document.createElement('div');
    contentInfo.innerHTML = `<div class="infoName">${place.name}</div>
    <div class="stars">Rating: ${place.rating}</div>`;

    // Add listener to display place Info onClick
    contentInfo.addEventListener('click', handler);

    return contentInfo;
  }
  // Shows info window with event click listener displaying place info
  showInfoWindow (content, position) {
    // Update content of infoWindow
    this.infoWindow.setContent(content);
    // Display infoWindow
    this.infoWindow.setPosition(position);
    this.infoWindow.setOptions({pixelOffset: {width:0, height:-30}});
    this.infoWindow.open(this.map);
  }

  // Close info window
  closeInfoWindow (content, position) {
    this.infoWindow.close();
  }

  newMarker (map, parameters, ...eventHandlingObjects) {
    // prevent "no google object" error from create-react-app parser
    const google = window.google;

    // Create marker from props.list
    const newMarker = new google.maps.Marker(parameters);

    // Add handlers if specified
    if (eventHandlingObjects) eventHandlingObjects.map((object) =>
      newMarker.addListener(object.event, object.handler));

    return newMarker
  }

  // Create and add markers to map
  generateMarkers (places, map, infoWindow) {

    if (!map) return console.log('Google maps hasn\'t intialize yet, be patient... Thank You!');

    // Initialize and purge marker array
    this.markers.map((marker) => marker.setMap(null));
    this.markers = [];
    // Create markers
    places.map((place) => {
      // Set parameters for Google Marker
      const markerParameters = {
        position: place.location,
        title: place.name,
        icon: {
          url: sushi,
          scaledSize: {
            width: 50,
            height: 50
          }
        },
        map: map
      };
      // Set handler for place (display apropriate restaurant)
      const placeHandler = (e) => this.props.handlePlaces(place);
      // Set event handlers for marker
      const eventHandlingObjects = [
        // Single click displays current infoWindow
        {
          event: 'click',
          handler: (e) => this.showInfoWindow(this.placeInfoWindowContent(place, placeHandler), markerParameters.position)
        },
        // Double click displays place details
        {
          event: 'dblclick',
          handler: placeHandler
        }
      ]

      // Create marker from props.list
      const newMarker = this.newMarker(map, markerParameters, ...eventHandlingObjects);

      // Remember place to which marker refers
      newMarker.place = place;

      this.markers.push(newMarker);
      return true;
    });
  }
  // Position map on visitor location
  geolocationMap (map) {
    // prevent "no google object" error from create-react-app parser
    const google = window.google;

    // Use visitor geolocation if browser suppoerts it
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        const markerParameters = {
          position: pos,
          label: '\u2605',
          background: 'red',
        };

        map.setCenter(pos);
        let myMarker = new google.maps.Marker(markerParameters);
        myMarker.setMap(map);
      });
    }
  }

  // Handle new place input
  handleNewPlace = (position) => {
    this.setNewPlacePosition(position);
    this.showModal();
  }

  // Put new place data into places list
  addNewPlace = (name, address, rating) => {
    this.hideModal();
    const place = {
      location: this.state.newPlacePosition,
      name: name,
      place_id: name + (Math.random() * 1000000),
      address: address,
      rating: rating,
      reviews: []
    }
    this.props.handlePlaces(place);
  }

  // Show window and marker on new place click
  showNewPlaceInfo (e) {
    // set position for click event
    const position = {lat: e.latLng.lat(), lng: e.latLng.lng()};
    // set marker parameters
    const markerParameters = {
      position: position,
      title: 'Add new place',
      icon: {
        url: sushi_gray,
        scaledSize: {
          width: 50,
          height: 50
        }
      },
      map: this.map
    };
    // create and show marker for new place attempt
    this.newPlaceMarker = this.newMarker (this.map, markerParameters);

    // Define content of info window
    const content = document.createElement('div');
    // set content link and listener on click
    content.innerHTML = '<a href="#">Add new place</a> <br />lat: ' + Math.floor(position.lat * 10000)/10000 + '<br />lng: ' + Math.floor(position.lng * 10000)/10000;
    content.addEventListener('click', (e) => {
      // On click hide infoWindow and marker
      e.preventDefault();
      this.closeInfoWindow();
      this.newPlaceMarker.setMap(null);
      // Handle input for new place
      this.handleNewPlace(position);
    });
    this.showInfoWindow (content, position);
  }

  initMap () {
    // prevent "no google object" error from create-react-app parser
    const google = window.google;

    // Initialize google map in HTML element with ref='map'
    this.map = new google.maps.Map(this.refs.map, this.state.mapParameters);

    //Update parent component Content state.map reference
    this.props.updateMap(this.map);

    // Create infoWindow with initial value of first place on the list
    this.infoWindow = new google.maps.InfoWindow();

    // Create markers
    this.generateMarkers(this.props.list, this.map, this.infoWindow);

    // Center map and show user
    this.geolocationMap(this.map);

    // Add listner for adding new restaurand on click on the mapParameters
    this.map.addListener('rightclick', (e) => this.showNewPlaceInfo(e));


  }

  // initSearch(map) {
  //   // prevent "no google object" error from create-react-app parser
  //   const google = window.google;
  //
  //   // Search Google Places by given parameters and call to callback function storePLaces()
  //
  //   const searchRequest = {
  //     location: this.state.mapParameters.center,
  //     service: 'restaurant',
  //     radius: '1000',
  //     name: 'sushi'
  //   }
  //
  //   let service = new google.maps.places.PlacesService(map);
  //   let myList = service.nearbySearch(searchRequest, function(response){
  //     const list = response.map((el)=>{
  //       const place = {
  //         location: {
  //           lat: el.geometry.location.lat(),
  //           lng: el.geometry.location.lng()
  //         },
  //         name: el.name,
  //         place_id: el.place_id,
  //         rating: el.rating,
  //         address: el.vicinity
  //       }
  //       return place;
  //     });
  //     // var json = JSON.stringify(list);
  //     return list;
  //   });
  //   console.log(myList);
  // }



  // Add place to list
  // handlePlaceDetails(result, status){
  //   var lastListElement = this.props.handleNewPlace(result);
  //   this.createMarker(lastListElement.location, this.map);
  // }

  render () {
    return (
      <div className={this.props.className}>
        <div id="map" ref="map">
          Loading Google Map...
        </div>
        <Modal className={this.state.displayModal ? 'modal' : 'modal hidden'} handlerClose={this.hideModal} display={this.state.displayModal}>
          <NewPlaceForm id='newPlace' handler={this.addNewPlace} />
        </Modal>
      </div>
    );
  };
}

export default Map;
