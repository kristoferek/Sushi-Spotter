import React from 'react';
import '../css/details.css';

class Details extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      reviews: [],
    };
    this.panorama = undefined;
  }

  // Initialize Google StreetView and Places reviews
  componentDidMount(props) {
    this.initPanorama(this.props.currentPlace.location);
    if (this.props.map) this.getReviews(this.props.currentPlace, this.props.map)
    else console.log('Problem with this.props.map');;
  }

  // Update Google StreetView and Places reviews
  componentWillReceiveProps(nextProps) {
    if (nextProps.currentPlace) {
      if (!this.props.currentplace || (nextProps.currentplace.place_id !== this.props.currentplace.place_id)){
        this.getReviews(nextProps.currentPlace, nextProps.map);
        this.initPanorama(nextProps.currentPlace.location);
      }
    }
  }

  // Google Street View module
  initPanorama (location) {
    // prevent "no google object" error from create-react-app parser
    const google = window.google;

    //Load modul into refs.streetview React element
    this.panorama = new google.maps.StreetViewPanorama(
      this.refs.streetView,
      {
        position: location,
        pov: {heading: 165, pitch: 0},
        zoom: 1
      }
    );
  }

  // Get place reviews from Google Places
  getReviews = (place, map) => {
    //  prevent "no google object" error from create-react-app parser
    const google = window.google;

    // Initialize Google places service
    if (map) {
      let service = new google.maps.places.PlacesService(map);
      // Request place details
      service.getDetails({placeId: place.place_id}, (placeDetails, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK){
          // Get only review rating and text properities from Google Places element
          let currentReviews = placeDetails.reviews.map((review) => { return{text: review.text, rating: review.rating}} );
          // update reviews in this.state
          this.setState({
            reviews: currentReviews
          });
        }
      });
    } else console.log('Problem with map object');
  }

  // Generate list of <li> elemets with review details
  listReviews = (reviews) => {
    let liArr = [];
    let i = 0;
    if (reviews){
      liArr = reviews.map((review) => {
        if (review.text)
        return <li className="review" key={'PlaceReviews' + i++}><p className="review"><span className="rating">{`${review.rating}\u2605`}</span>{review.text}</p></li>;
      });
    }
    return liArr;
  }

  render () {
    // Define elements of Detail component
    let title = <h2>
      <div className='close' onClick={(e)=>this.props.toggleInfoView()}> </div>
      {this.props.currentPlace.name}
    </h2>;
    let address = <address>{this.props.currentPlace.address}</address>;
    let rating = <div className="rating">{`Rating: ${this.props.currentPlace.rating}\u2605`}</div>;
    let placeInfo = <div className='placeInfo'>
      {address}
      {rating}
    </div>;
    let streetView = <section ref='streetView' id='streetView' className='streetView'></section>;
    let reviews = <section ref='reviews' id='reviews'><ul>{this.listReviews(this.state.reviews)
    }</ul></section>;

    if (this.props.currentPlace){
      return (
        <div id={this.props.id} className={this.props.className}>
          <header>
            {title}
            {placeInfo}
          </header>
          {streetView}
          {reviews}
        </div>
      );
    } else {
      return (
        <div id={this.props.id} className={this.props.className}>
          No sushi restaurant here!
        </div>
      );
    }
  };
}

export default Details;
