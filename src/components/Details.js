import React from 'react';
import {Div, Header, Modal, List, Symbol, Title} from './Elements.js';
import {ReviewForm} from './Forms.js';
import '../css/details.css';

class Details extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      displayModal: false,
    };
  }

  // Initialize Google StreetView and Places reviews
  componentDidMount(props) {
    if (this.props) {
      if (!this.props.map) console.log('Problem with this.props.map');
      else
        if (this.props.currentPlace)
          if (!this.props.currentPlace.reviews)
          this.initDetails(this.props.currentPlace, this.props.map);
    }
  }

  // Update Google StreetView and Places reviews
  componentWillReceiveProps(nextProps) {
    // If next currentPlace exists (isn't undefined)
    if (nextProps.currentPlace) {
      // If previous currentPlace wasn't specified
      // Or
      // If previous currentPlace was specified and
      // next currentPlace id is differrent then previous id
      if ((!this.props.currentPlace)
      || ((this.props.currentPlace) && (nextProps.currentPlace.place_id !== this.props.currentPlace.place_id))) {
        // If there are no initial values of currentPlace.reviews
        if (!nextProps.currentPlace.reviews) {
          // initialize them with Google Places
          if (nextProps.map) this.initDetails(nextProps.currentPlace, nextProps.map)
          else console.log('Problem with this.props.map');
        }
      }
    }
  }

  // initialize Details from Google Places
  initDetails = (place, map) => {
    //  prevent "no google object" error from create-react-app parser
    const google = window.google;

    // Initialize Google places service
    if (map) {
      // Initialize Google Places with map
      let service = new google.maps.places.PlacesService(map);
      // Request place details
      service.getDetails({placeId: place.place_id}, (placeDetails, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          // Get only review rating and text properities from Google Places element
          let currentReviews = placeDetails.reviews.map((review) => { return{text: review.text, rating: review.rating}} );
          // Get photos url of place
          let currentPhotos = placeDetails.photos;
          // set or update place with additional reviews and photos if they are not empty
          [place.reviews, place.photos] = [currentReviews, currentPhotos];
          this.props.handlePlaces(place);
          // this.updateDetails(place);
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
        return (
          <li className="review" key={'PlaceReviews' + i++}>
            <p className="review">
              <span className="rating">{`${review.rating}\u2605`}
              </span>{review.text}
            </p>
          </li>
        );
        return undefined;
      });
    }
    return liArr;
  }

  // Generate list of <li> elemets with place photos
  // from array of google.maps.PlacePhoto
  listPhotos = (photos) =>{
    if (photos) {
      return photos.map((photo, i) => {
        const src = photo.getUrl({maxWidth: 600, maxHeight: 600});
        const image = <img src={src} width='100%' height='auto' alt='' />
        return <li key={'key'+i}>{image}</li>;
      });
    }
  };

  openModal = () => {
    this.setState({
      displayModal: true
    })
  };

  closeModal = () => {
    this.setState({
      displayModal: false
    })
  };

  handleNewReview = (reviewTextValue, reviewRatingValue) => {
    this.closeModal();
    let newReview = {
      text: reviewTextValue,
      rating: reviewRatingValue
    }
    let updatedPlace = this.props.currentPlace;
    updatedPlace.reviews.push(newReview);

    this.props.handlePlaces(updatedPlace);
  }

  render () {
    const NOCONTENT = 'No sushi restaurant found!'
    // If currenPlace defined display details
    if (this.props.currentPlace){

      return (
        <Div id={this.props.id} className={this.props.className}>

          <Header>
            <Div className='placeInfo'>
              <Title>
                {this.props.currentPlace.name}
              </Title>
              <address>{this.props.currentPlace.address}</address>
              <Div className="rating">
                {`Rating: ${this.props.currentPlace.rating}\u2605`}
              </Div>
            </Div>

            <Div className='controls'>
              <Symbol className='add' handler={this.openModal} alt="Add review"></Symbol>
              <Symbol className='back' handler={(e) => this.props.handlePlaces()} alt="Go back"></Symbol>
            </Div>
          </Header>

          <List elements={this.props.currentPlace.photos} id='photos' generateList={this.listPhotos} />

          <List elements={this.props.currentPlace.reviews} id='reviews' generateList={this.listReviews} />

          <Modal className={this.state.displayModal ? 'modal' : 'modal hidden'} handlerClose={this.closeModal} display={this.state.displayModal}>
            <ReviewForm id='newReview' handleNewReview={this.handleNewReview} />
          </Modal>
        </Div>
      );
    } else {
      // If no currenPlace defined display no content warning
      return (
        <Div id={this.props.id} className={this.props.className}>
          {NOCONTENT}
        </Div>
      );
    }
  };
}

export default Details;
