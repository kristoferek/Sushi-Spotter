import React from 'react';
import {Div, Header, Modal, SectionList, Symbol, Title} from './Elements.js';
import '../css/details.css';


class Details extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      reviews: [],
      photos: [],
      addReview: false,
      reviewTextValue: '',
      reviewRatingValue: 5
    };
    this.modal = undefined;
  }

  // Initialize Google StreetView and Places reviews
  componentDidMount(props) {
    if (this.props) {
      if (!this.props.map) console.log('Problem with this.props.map');
      else
        if (this.props.currentPlace)
          if (!this.props.currentPlace.reviews)
          console.log('didMount and initDetails');
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
        // If next currentPlace.reviews has initial values
        if (nextProps.currentPlace.reviews) {
          // Use next currentPlace them to update state
          this.updateDetails(nextProps.currentPlace);
        // If there are no initial values of currentPlace.reviews
        } else {
          // initialize them with Google Places
          console.log('willReceiveProps and initDetails');
          if (nextProps.map) this.initDetails(nextProps.currentPlace, nextProps.map)
          else console.log('Problem with this.props.map');
        }
      // If previous currentPlace was specified and
      // and next currentPlace id equals previous currentPlace id
      } else {
        // If new reviews arrau is longer than provious
        if (nextProps.currentPlace.reviews.length > this.props.currentPlace.reviews.length) {
          // Use next currentPlace them to update state
          this.updateDetails(nextProps.currentPlace);
        }
      }
    }
  }

  // Update place reviews and photos from parent
  updateDetails = (place) => {
    this.setState({
      reviews: place.reviews,
      photos: place.photos
    });
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
      addReview: true
    })
  };

  closeModal = () => {
    this.setState({
      addReview: false
    })
  };

  handleReviewText = (e) => {
    this.setState({
      reviewTextValue: e.target.value
    })
  }

  handleReviewRating = (e) => {
    this.setState({
      reviewRatingValue: e.target.value
    })
  }

  handleNewReview = () => {
    this.closeModal();
    let newReview = {
      text: this.state.reviewTextValue,
      rating: this.state.reviewRatingValue
    }

    let updatedPlace = this.props.currentPlace;
    updatedPlace.reviews.push(newReview);

    this.props.handlePlaces(updatedPlace);
    // this.updateDetails(updatePlace);
  }

  render () {
    let photos, reviews;
    if (this.props.currentPlace) {

    }

    let noContent = 'No sushi restaurant here!'

    if (this.props.currentPlace){
      if (this.props.currentPlace.photos) if (this.props.currentPlace.photos.length) photos = (
      <SectionList id='placePhotos'>
        {this.listPhotos(this.props.currentPlace.photos)}
      </SectionList>
      );
      if (this.props.currentPlace.reviews) if (this.props.currentPlace.reviews.length) reviews = (
        <SectionList id='reviews'>
          {this.listReviews(this.props.currentPlace.reviews)}
        </SectionList>
      );

      return (
        <Div id={this.props.id} className={this.props.className}>

          <Header>
            <Div className='placeInfo'>
              <Title handlePlaces={this.props.handlePlaces}>
                {this.props.currentPlace.name}
              </Title>
              <address>{this.props.currentPlace.address}</address>
              <Div className="rating">
                {`Rating: ${this.props.currentPlace.rating}\u2605`}
              </Div>
            </Div>

            <Div className='controls'>
              <Symbol className='add' handler={this.openModal} alt="Add review"></Symbol>
              <Symbol className='back' handler={this.props.handlePlaces} alt="Go back"></Symbol>
            </Div>

          </Header>

          {photos}
          {reviews}

          <Modal className={this.state.addReview ? 'modal' : 'modal hidden'} handler={this.closeModal}>
            <form id='newReview' >
              <label htmlFor="reviewText">You review:</label>
              <textarea id="reviewText" type="text" name="reviewText"  rows="5" value={this.state.reviewTextValue} onChange={this.handleReviewText} placeholder="Here You can leave your comment..." />
              <input type="range" min="1" max="5" step="1" name="" defaultValue="5" value={this.state.handleReviewRating} onChange={this.handleReviewRating} />
              <Symbol id='submitReview' className='button' handler={this.handleNewReview} alt="Submit review">
                Add my Review
              </Symbol>
            </form>
          </Modal>
        </Div>
      );
    } else {
      return (
        <Div id={this.props.id} className={this.props.className}>
        {noContent}
        </Div>
      );
    }
  };
}

export default Details;
