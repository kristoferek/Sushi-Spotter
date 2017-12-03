import React from 'react';
import Details from './Details.js';
import Filter from './Filter.js';
import List from './List.js';

class Info extends React.Component{

  listView(){
    document.getElementById('list').classList.remove('hidden');
    document.getElementById('details').classList.add('hidden');
  };

  detailsView(){
    document.getElementById('details').classList.remove('hidden');
    document.getElementById('list').classList.add('hidden');
  };

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.currentPlace !== undefined) {
  //     this.detailsView();
  //   } else {
  //     this.listView();
  //   }
  // }

  render () {
    if (this.props.currentPlace !== undefined){
      return (
        <div className={this.props.className}>
          <Details id='details' className='details' currentPlace={this.props.currentPlace}  listView={this.listView} toggleInfoView={this.props.toggleInfoView} />
        </div>
      );
    } else {
      return (
        <div className={this.props.className}>
          <Filter className="filter" filter={this.props.filter} updateFilter={this.props.updateFilter}/>
          <List id='list' className='list' list={this.props.list} toggleInfoView={this.props.toggleInfoView} />
        </div>
      );
    }
  };
}

export default Info;
