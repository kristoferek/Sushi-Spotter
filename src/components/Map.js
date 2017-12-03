import React from 'react';
import '../css/map.css';
import sushi from '../img/sushi_icon.png';

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
      }
    };
    this.showMarkers = this.showMarkers.bind(this);
    this.generateMarkers = this.generateMarkers.bind(this);
    this.showInfoWindow = this.showInfoWindow.bind(this);
    this.initMap = this.initMap.bind(this);
    this.showItem = this.showItem.bind(this);
    // this.handlePlaces = this.handlePlaces.bind(this);
    // this.handlePlaceDetails = this.handlePlaceDetails.bind(this);
    // this.geolocationMap = this.geolocationMap.bind(this);
    // Set callback initMap function accessible in global <Map> scope
    window.initMap = this.initMap;
    this.map = undefined;
    this.markers = [];
  }

  componentDidMount(){
    // Load and inject Google JavaScript API with Google Places library
    // into index.html and when done run the callback function initMap()
    this.loadJS("https://maps.googleapis.com/maps/api/js?key=" + this.state.APIKey + "&callback=initMap&libraries=places");
  };

  componentWillReceiveProps(nextProps) {
    let refreshMarkers = true;
    if (nextProps.list.length === this.props.list.length) {
      refreshMarkers = nextProps.list.some((place, i) => place.place_id !== this.props.list[i].place_id);
    }
    console.log(refreshMarkers);

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

  showInfoWindow (place, marker) {
    // Set content for info window
    const contentInfo = document.createElement('div');
    // Add listener to display place Info onClick
    contentInfo.addEventListener('click', (e)=>{
      this.props.toggleInfoView(place);
    });
    contentInfo.innerHTML = `<div class="infoName">${place.name}</div>
    <div class="stars">Rating: ${place.rating}</div>`;
    // Update content of infoWindow
    this.infoWindow.setContent(contentInfo);
    // Display infoWindow
    this.infoWindow.open(this.map, marker);
  }

  // Create and add marker to map
  generateMarkers (places, map, infoWindow) {
    // prevent "no google object" error from create-react-app parser
    const google = window.google;

    // Initialize marker array
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
      // Create marker from props.list
      const newMarker = new google.maps.Marker(markerParameters);

      // Remember place to wchich marker refers
      newMarker.place = place;

      // Single click displays current infoWindows
      newMarker.addListener('click', ()=>{
        this.showInfoWindow(place, newMarker);
      });
      // Double click displaye place details
      newMarker.addListener('dblclick', ()=>{
        this.showItem(place);
      });

      this.markers.push(newMarker);
      return true;
    });
  }

  // Create and add marker to map
  showMarkers (places) {

    // Set marker visibility Off
    this.markers.map((marker) => {
      if (this.props.list.some((place) =>
        marker.place.place_id === place.place_id
      )) {
        marker.setMap(this.map)
      } else {
        marker.setMap(null);
      };
      return null;
    })
    // If is marker.place is in this.props.list make it visible
  }

  showItem (place) {
    console.log('doubleclick - show item', place);
  }

  initMap () {
    // prevent "no google object" error from create-react-app parser
    const google = window.google;

    // Initialize google map in HTML element with ref='map'
    this.map = new google.maps.Map(this.refs.map, this.state.mapParameters);

    // Create infoWindow with initial value of first place on the list
    this.infoWindow = new google.maps.InfoWindow();

    // Create markers
    this.generateMarkers(this.props.list, this.map, this.infoWindow);

    // Center map and show user
    this.geolocationMap(this.map);
  }

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
          map: map
        };

        map.setCenter(pos);
        var myMarker = new google.maps.Marker(markerParameters);
        console.log(myMarker);
      });
    }
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

  // Get places details
  // handlePlaces (result, status) {
  //   prevent "no google object" error from create-react-app parser
  //   const google = window.google;
  //   console.log(result);
  //
  //   if (status === google.maps.places.PlacesServiceStatus.OK){
  //     for (var i = 0; i < result.length; i++) {
  //       var parameters = {placeId: result[i].place_id};
  //       var service = new google.maps.places.PlacesService(this.map);
  //       service.getDetails(parameters, this.handlePlaceDetails);
  //     }
  //   }
  // }

  // Add place to list
  // handlePlaceDetails(result, status){
  //   var lastListElement = this.props.handleNewPlace(result);
  //   this.createMarker(lastListElement.location, this.map);
  // }

  render () {
    return (
      <div id="map" ref="map" className={this.props.className}>
        Loading Google Map...
      </div>
    );
  };
}

export default Map;
