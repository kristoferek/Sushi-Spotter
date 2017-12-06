import React from 'react';
import Details from './Details.js';
import Filter from './Filter.js';
import List from './List.js';

class Info extends React.Component{
  render () {
    // If currentPlace defined display its details
    if (this.props.currentPlace !== undefined){
      return (
        <div className={this.props.className}>
          <Details id='details' className='details' currentPlace={this.props.currentPlace}  handlePlaces={this.props.handlePlaces} map={this.props.map}/>
        </div>
      );
    // If currentPlace not defined display places list with filter
    } else {
      return (
        <div className={this.props.className}>
          <Filter className="filter" filter={this.props.filter} updateFilter={this.props.updateFilter}/>
          <List id='list' className='list' list={this.props.list} handlePlaces={this.props.handlePlaces} />
        </div>
      );
    }
  };
}

export default Info;
