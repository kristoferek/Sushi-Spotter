import React from 'react';
import '../css/map.css';

class Map extends React.Component{
  constructor(){
    super();
    this.state = {
      APIKey: 'AIzaSyCmX-3F5SG5M8xs3OLWjyIjEZrDHt-9bo0',
      mapParameters: {
        center: {
          lat: 52.2351118,
          lng: 21.0352136
        },
        zoom: 14
      },
    };
    this.showMarkers = this.showMarkers.bind(this);
    this.showItem = this.showItem.bind(this);
    this.initMap = this.initMap.bind(this);
    this.handlePlaces = this.handlePlaces.bind(this);
    this.handlePlaceDetails = this.handlePlaceDetails.bind(this);
    this.geolocationMap = this.geolocationMap.bind(this);
  }

  componentDidMount(){
    // Set callback initMap function accessible in global scope
    window.initMap = this.initMap;

    // Load and inject Google JavaScript API with Google Places library
    // into index.html and when done run the callback function initMap()
    this.loadJS("https://maps.googleapis.com/maps/api/js?key=" + this.state.APIKey + "&callback=initMap&libraries=places");
  };

  componentWillReceiveProps(nextProps) {
    // Create and display markers if Content.state.list updates
    this.showMarkers(nextProps.list, this.map);
  }

  // Inject src script into index.html
  loadJS (src) {
    let ref = window.document.getElementsByTagName("script")[0];
    let script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    ref.parentNode.insertBefore(script, ref);
  }

  // Create and add marker to map
  showMarkers (places, map) {
    // prevent "no google object" error from create-react-app parser
    const google = window.google;

    // Create infoWindow with initial value of first place on the list
    let infoWindow = new google.maps.InfoWindow();
    // Create markers
    places.map((place) => {
      // Set parameters for Google Marker
      const markerParameters = {
        position: place.location,
        title: place.name,
        map: map
      };
      // Create marker from props.list
      const newMarker = new google.maps.Marker(markerParameters);

      // Single displays current infoWindows
      newMarker.addListener('click', function(marker){
        // Set content for info window
        const contentString = `<div><div className="infoName">${place.name}</div>
        <div className="stars">Rating: ${place.rating}</div></div>`;
        // Update content
        infoWindow.setContent(contentString);
        // Display infoWindow
        infoWindow.open(map, this);
      });
      // Double click displaye place details
      newMarker.addListener('dblclick', function(){
        this.showItem(place);
      });
      return null;
    });
  }

  showItem (place) {
    console.log('doubleclick - show item', place);
  }

  initMap () {
    // prevent "no google object" error from create-react-app parser
    const google = window.google;

    // Initialize google map in HTML element with ref='map'
    this.map = new google.maps.Map(this.refs.map, this.state.mapParameters);

    // Create and display markers
    this.showMarkers(this.props.list, this.map);
  }

  geolocationMap (map) {
    // Use visitor geolocation if browser suppoerts it
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        // Update state.center and position map center to aquired coordinates
        this.setState({
          mapParameters: {
            center: pos
          }
        });
        map.setCenter(pos);
      });
    }
  }

  initSearch(map) {
    // prevent "no google object" error from create-react-app parser
    const google = window.google;

    // Search Google Places by given parameters and call to callback function storePLaces()

    const searchRequest = {
      location: this.state.mapParameters.center,
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
      return list;
    });
    console.log(myList);
  }

  // Get places details
  handlePlaces (result, status) {
    // prevent "no google object" error from create-react-app parser
    // const google = window.google;
    console.log(result);

    // if (status === google.maps.places.PlacesServiceStatus.OK){
    //   for (var i = 0; i < result.length; i++) {
    //     var parameters = {placeId: result[i].place_id};
    //     var service = new google.maps.places.PlacesService(this.map);
    //     service.getDetails(parameters, this.handlePlaceDetails);
    //   }
    // }
  }

  // Add place to list
  handlePlaceDetails(result, status){
    var lastListElement = this.props.handleNewPlace(result);
    this.createMarker(lastListElement.location, this.map);
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
