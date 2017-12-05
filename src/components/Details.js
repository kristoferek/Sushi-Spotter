import React from 'react';
import '../css/details.css';

class Title extends React.Component {
  render () {
    return (
      <h2>
        <div className='close' onClick={(e)=>this.props.updateCurrentPlace()}> </div>
        {this.props.children}
      </h2>
    );
  }
}

class SectionList extends React.Component {
  render () {
    return (
      <section ref={this.props.id} id={this.props.id} className={this.props.id}>
        <ul>
          {this.props.children}
        </ul>
      </section>
    );
  }
}

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
    // this.initPanorama(this.props.currentPlace.location);
    if (this.props.map) this.getDetails(this.props.currentPlace, this.props.map)
    else console.log('Problem with this.props.map');;
  }

  // Update Google StreetView and Places reviews
  componentWillReceiveProps(nextProps) {
    if (nextProps.currentPlace) {
      if (!this.props.currentplace || (nextProps.currentplace.place_id !== this.props.currentplace.place_id)){
        this.getDetails(nextProps.currentPlace, nextProps.map);
        // this.initPanorama(nextProps.currentPlace.location);
      }
    }
  }

  // Get place reviews from Google Places
  getDetails = (place, map) => {
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
          // Get photos url of place
          let currentPhotos = placeDetails.photos;
          // update reviews in this.state
          this.setState({
            reviews: currentReviews,
            photos: currentPhotos
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
  }

  render () {
    if (this.props.currentPlace){
      return (
        <div id={this.props.id} className={this.props.className}>
          <header>
            <Title updateCurrentPlace={this.props.updateCurrentPlace}>
              {this.props.currentPlace.name}
            </Title>
            <div className='placeInfo'>
              <address>{this.props.currentPlace.address}</address>
              <div className="rating">
                {`Rating: ${this.props.currentPlace.rating}\u2605`}
              </div>
            </div>
          </header>
          <SectionList id='placePhotos'>
            {this.listPhotos(this.state.photos)}
          </SectionList>
          <SectionList id='reviews'>
            {this.listReviews(this.state.reviews)}
          </SectionList>
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
