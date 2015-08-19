// SIDEBAR
/*jshint esnext: true */

const SearchBox = require('./SearchBox.jsx');
const FilterOptionRow = require('./FilterOptionRow.jsx');
const FilterResultsTable = require('./FilterResultsTable.jsx');
const FilterStore = require('../stores/FilterStore');

const Sidebar = React.createClass({

  componentDidMount: function() {
    FilterStore.addDagSetListener(this._onDagSet); 
  },

  componentDidUnmount: function() {
    FilterStore.removeDagSetListener(this._onDagSet); 
  },

  _onDagSet: function(){
    this.refs.grainRow.setState({selected: 1});
  },

  render: function() {
    return (
      <div className='sidebar'>
        <SearchBox />
        <div className='filterOptions'>
          <FilterOptionRow name={'measure'} labels={['I/O','CPU','Mappers','Reducers']} />
          <FilterOptionRow name={'time'} labels={['Week','Month','Year']} />
          <FilterOptionRow ref='grainRow' name={'grain'} labels={['DAG','Task']} />
        </div>
        <FilterResultsTable />
      </div>
    );
  }
});

module.exports = Sidebar;
