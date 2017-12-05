import React from 'react';
import Details from './Details.js';
import Filter from './Filter.js';
import List from './List.js';

class Info extends React.Component{
  render () {
    if (this.props.currentPlace !== undefined){
      return (
        <div className={this.props.className}>
          <Details id='details' className='details' currentPlace={this.props.currentPlace}  listView={this.listView} updateCurrentPlace={this.props.updateCurrentPlace} map={this.props.map}/>
        </div>
      );
    } else {
      return (
        <div className={this.props.className}>
          <Filter className="filter" filter={this.props.filter} updateFilter={this.props.updateFilter}/>
          <List id='list' className='list' list={this.props.list} updateCurrentPlace={this.props.updateCurrentPlace} />
        </div>
      );
    }
  };
}

export default Info;
