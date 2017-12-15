import React from 'react';
import '../css/map.css';
import sushi from '../img/sushi.svg';
import new_sushi from '../img/new_sushi.svg';
import here from '../img/here.svg';
import importedMapStyle from './mapstyle.json'
import {Header, Modal, Symbol} from './Elements.js';
import {NewPlaceForm} from './Forms.js';

class Map extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      APIKey: 'AIzaSyCmX-3F5SG5M8xs3OLWjyIjEZrDHt-9bo0',
      displayModal: false,
      newPlacePosition: undefined
    };
    this.newMarker = this.newMarker.bind(this);
    this.generateMarkers = this.generateMarkers.bind(this);
    this.showInfoWindow = this.showInfoWindow.bind(this);
    this.closeInfoWindow = this.closeInfoWindow.bind(this);
    this.initMap = this.initMap.bind(this);

    window.initMap = this.initMap;
    // empty map reference
    this.map = undefined;
    // Visitor's position marker
    this.myMarker = undefined;
    // new place marker
    this.newPlaceMarker = undefined;
    // markers array
    this.markers = [];
    // Info window for markers
    this.infoWindow = undefined;
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

  // Inject src script into index.html
  loadJS (src) {
    let ref = window.document.getElementsByTagName("script")[0];
    let script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    ref.parentNode.insertBefore(script, ref);
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

  // Hides marker
  hideMarker = (marker) => {
    marker.setVisible(false);
  }

  // Show marker on map
  showMarker = (marker) => {
    marker.setVisible(true);
  }

  // Set new place position
  setNewPlacePosition = (val) => {
    this.setState({
      newPlacePosition: val
    })
  }

  removeGoogleListener = (eventListener) => {
    // prevent "no google object" error from create-react-app parser
    const google = window.google;
    google.maps.event.removeListener(eventListener);
  }

  // Define clickable content fo Info Window
  placeInfoWindowContent (place, handler) {
    // Set content for info window
    const contentInfo = document.createElement('div');
    contentInfo.innerHTML = `<div class="infoName">${place.name}</div>
    <div class="stars">Rating: ${place.rating}</div>`;

    // Add listener to display place Info onClick
    contentInfo.addEventListener('click', handler);

    return contentInfo;
  }

  newPlaceinfoWindowContent (position) {
    // Define content of info window
    const content = document.createElement('div');
    // set content link and listener on click
    content.innerHTML = '<a href="#">Add new place</a> <br />lat: ' + Math.floor(position.lat * 10000)/10000 + '<br />lng: ' + Math.floor(position.lng * 10000)/10000;
    content.addEventListener('click', (e) => {
      e.preventDefault();
      // On click hide infoWindow and marker
      this.closeInfoWindow();
      this.hideMarker(this.newPlaceMarker);
      // Handle input for new place
      this.handleNewPlace(position);
    });

    return content;
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
  closeInfoWindow () {
    if (this.infoWindow) this.infoWindow.close();
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

  // Initializes visitors position marker
  setMyMarker = (position) => {
    // set marker parameters
    const markerParameters = {
      position: position,
      title: 'You are here',
      background: 'red',
      map: this.map,
      icon: {
        url: here,
        scaledSize: {
          width: 32,
          height: 32
        }
      }
    };
    // create and show marker for visitor's position
    this.myMarker = this.newMarker (this.map, markerParameters);
  }

  // Initializes new place marker
  setNewPlaceMarker = (position) => {
    // set marker parameters
    const markerParameters = {
      position: position,
      title: 'Add new place',
      icon: {
        url: new_sushi,
        scaledSize: {
          width: 50,
          height: 50
        }
      },
      map: this.map
    };
    // create and show marker for new place attempt
    this.newPlaceMarker = this.newMarker (this.map, markerParameters);
  }

  updateNewPlaceMarker = (position) => {
    this.newPlaceMarker.setPosition(position);
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

    // Show newPlaceMarker inn new position
    this.updateNewPlaceMarker(position);
    this.showMarker(this.newPlaceMarker);

    // Create and show info window
    this.showInfoWindow (this.newPlaceinfoWindowContent(position), position);
    // Add listener to remove new place marker while info window closes
    const closeClick = this.infoWindow.addListener('closeclick', (e) => {
      this.hideMarker(this.newPlaceMarker);
      this.removeGoogleListener(closeClick);
    });
  }

  // Position map on visitor location
  geolocationMap (map) {
    // Use visitor geolocation if browser suppoerts it
    if (navigator.geolocation) {
      const result = navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        map.setCenter(pos);

        this.setMyMarker (pos);
        this.setNewPlaceMarker (pos);
        this.hideMarker(this.newPlaceMarker);
        console.log(pos);

        this.initSearch(map, pos);
        return pos;
      });
      return result;
    }
    return undefined;
  }


  initMap () {
    // prevent "no google object" error from create-react-app parser
    const google = window.google;

    const mapParameters = {
      zoomControl: false,
      streetViewControl: false,
      scaleControl: true,
      mapTypeControl: false,
      center: {
        lat: 52.2351118,
        lng: 21.0352136
      },
      zoom: 14,
      mapTypeControlOptions: {
        mapTypeIds: ['roadmap', 'darkMap']
        }
    }

    // Initialize google map in HTML element with ref='map'
    this.map = new google.maps.Map(this.refs.map, mapParameters);

    // Style Map
    const newMapStyle = new google.maps.StyledMapType(importedMapStyle);
    this.map.mapTypes.set('darkMap', newMapStyle);
    this.map.setMapTypeId('darkMap');

    //Update parent component Content state.map reference
    this.props.updateMap(this.map);

    // Create infoWindow with initial value of first place on the list
    this.infoWindow = new google.maps.InfoWindow();

    // Create markers
    const currentPosition = this.generateMarkers(this.props.list, this.map, this.infoWindow);

    // Center map and show user
    this.geolocationMap(this.map, currentPosition);
  }

  // Get search results for sushi in nearby location
  initSearch(map, position) {
    // prevent "no google object" error from create-react-app parser
    const google = window.google;

    // Search Google Places by given parameters and call to callback function storePLaces()

    const searchRequest = {
      location: position,
      service: 'restaurant',
      radius: '1000',
      name: 'sushi'
    }

    let service = new google.maps.places.PlacesService(map);
    let myList = service.nearbySearch(searchRequest, function(response){
      const list = response.map((el)=>{
        const place = {
          location: {
            lat: el.geometry.location.lat(),
            lng: el.geometry.location.lng()
          },
          name: el.name,
          place_id: el.place_id,
          rating: el.rating,
          address: el.vicinity
        }
        return place;
      });
      // var json = JSON.stringify(list);
      console.log(list);
      return list;
    });
    console.log('myList', myList);
  }

  // // Add place to list
  // handlePlaceDetails(result, status){
  //   var lastListElement = this.props.handleNewPlace(result);
  //   this.createMarker(lastListElement.location, this.map);
  // }

  render () {
    let modalNewPlace = null;
    let addNewPlaceSymbol = null;
    let newPlaceClickListener = null;
    if (!this.props.displayPlace)
      addNewPlaceSymbol = <Symbol className="plus" id="plus" handler={() =>
        // Add listner for adding new restaurant on click on the map
        newPlaceClickListener = this.map.addListener('click', (e) => {
          // Remove listner for adding new restaurant on click on the map
          this.removeGoogleListener(newPlaceClickListener);
          this.showNewPlaceInfo(e);
        })
      }
      alt="Add new such restaurant" />
    else
      addNewPlaceSymbol = null;
    if (this.state.displayModal) modalNewPlace = (
      <Modal className='modal' handlerClose={this.hideModal} display={this.state.displayModal}>
        <NewPlaceForm id='newPlace' handler={this.addNewPlace} />
      </Modal>)
    else
      modalNewPlace = null;

    return (
      <div className={this.props.className}>
        <Header className="header">
          <h1>Sushi <br />Spotter</h1>
          {addNewPlaceSymbol}
        </Header>
        <div id="map" ref="map">
          Loading Google Map...
        </div>
        {modalNewPlace}
      </div>
    );
  };
}

export default Map;
