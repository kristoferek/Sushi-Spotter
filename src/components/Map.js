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
        zoom: 12
      },
      map: '',
      service: 'restaurant'
    };
    this.initMap = this.initMap.bind(this);
    this.storePlaces = this.storePlaces.bind(this);
  }
  componentDidMount(){
    window.initMap = this.initMap;
    this.loadJS("https://maps.googleapis.com/maps/api/js?key=" + this.state.APIKey + "&callback=initMap&libraries=places");
  };

  initMap() {
    // prevent no google object error by create-react-app parser
    const google = window.google;
    // console.log(this.refs.map, this.state.mapParameters);
    this.map = new google.maps.Map(this.refs.map, this.state.mapParameters);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.map.setCenter(pos);
        var request = {
          location: pos,
          radius: '500',
          type: ['restaurant']
        };
        var service = new google.maps.places.PlacesService(this.map);
        service.nearbySearch(request, this.storePlaces);
      });
    }
  }

  loadJS (src) {
    let ref = window.document.getElementsByTagName("script")[0];
    let script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    ref.parentNode.insertBefore(script, ref);
  }

  storePlaces(result, status){
    console.log(result, status);
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
