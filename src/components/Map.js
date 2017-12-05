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
    this.generateMarkers = this.generateMarkers.bind(this);
    this.showInfoWindow = this.showInfoWindow.bind(this);
    this.initMap = this.initMap.bind(this);
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

  // Shows info window with event click listener displaying place info
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

      // Create marker from props.list
      const newMarker = new google.maps.Marker(markerParameters);

      // Remember place to which marker refers
      newMarker.place = place;

      // Single click displays current infoWindow
      newMarker.addListener('click', ()=>{
        this.showInfoWindow(place, newMarker);
      });
      // Double click displays place details
      newMarker.addListener('dblclick', (e)=>{
        this.props.toggleInfoView(place);
      });

      this.markers.push(newMarker);
      return true;
    });
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
        };

        map.setCenter(pos);
        let myMarker = new google.maps.Marker(markerParameters);
        myMarker.setMap(map);
      });
    }
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
      <div id="map" ref="map" className={this.props.className}>
        Loading Google Map...
      </div>
    );
  };
}

export default Map;
