import React from 'react';

class Map extends React.Component{
  constructor(){
    super();
    this.state = {
      APIKey: 'AIzaSyCmX-3F5SG5M8xs3OLWjyIjEZrDHt-9bo0',
      mapParameters: {
        center: {
          lat: -34.397,
          lng: 150.644
        },
        zoom: 15
      },
      service: 'restaurant'
    };
    this.initMap = this.initMap.bind(this);
    this.handlePlaces = this.handlePlaces.bind(this);
    this.createMarker = this.createMarker.bind(this);
    this.handlePlaceDetails = this.handlePlaceDetails.bind(this);
  }

  componentDidMount(){
    // Set callback initMap function accessible in global scope
    window.initMap = this.initMap;

    // Load and inject Google JavaScript API with Google Places library into index.html
    // When done call callback function initMap()
    this.loadJS("https://maps.googleapis.com/maps/api/js?key=" + this.state.APIKey + "&callback=initMap&libraries=places");
  };

  // Inject src script into index.html
  loadJS (src) {
    let ref = window.document.getElementsByTagName("script")[0];
    let script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    ref.parentNode.insertBefore(script, ref);
  }

  initMap() {
    // prevent "no google object" error from create-react-app parser
    const google = window.google;

    // Initialize google map in HTML element with ref='map'
    this.map = new google.maps.Map(this.refs.map, this.state.mapParameters);
    // Use visitor geolocation if browser suppoerts it
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        // Position map center to aquired coordinates
        this.map.setCenter(pos);

        // Set parameters for Google plces request
        var request = {
          location: pos,
          radius: '800',
          type: [this.state.service],
          name: 'sushi'
        };

        // Initialize Google Places in previously crated Map - this.map
        var service = new google.maps.places.PlacesService(this.map);

        // Search Google Places by given parameters and call to callback function storePLaces()
        service.nearbySearch(request, this.handlePlaces);
      });
    }
  }

  // Get places details
  handlePlaces (result, status) {
    // prevent "no google object" error from create-react-app parser
    const google = window.google;

    if (status === google.maps.places.PlacesServiceStatus.OK){
      for (var i = 0; i < result.length; i++) {
        var parameters = {placeId: result[i].place_id};
        var service = new google.maps.places.PlacesService(this.map);
        service.getDetails(parameters, this.handlePlaceDetails);
      }
    }
  }

  // Add place to list
  handlePlaceDetails(result, status){
    var lastListElement = this.props.handleNewPlace(result);
    this.createMarker(lastListElement.location, this.map);
  }

  // Create and add marker to map
  createMarker (location, map) {
    // prevent "no google object" error from create-react-app parser
    const google = window.google;

    // Set parameters for Google Marker
    var parameters = {
       position: location,
       map: map
     };

    // Create marker
    var newMarker = new google.maps.Marker(parameters);
  }

  render () {
    return (
      <div id="map" ref="map" className={this.props.className}>
        Loading Google Map...
      </div>
    );
  };
}

export default Map;
