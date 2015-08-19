// FilterStore.js
// The flux datastore for the left sidebar
/*jshint esnext: true */

const AppDispatcher = require('../dispatcher/AppDispatcher');
const EventEmitter = require('events').EventEmitter;
const FilterConstants = require('../constants/FilterConstants');
const assign = require('object.assign');
const DetailViewStore = require('./DetailViewStore');

const FILTER_CHANGE_EVENT = 'filter_change';
const DAG_SET_EVENT = 'dag_chosen';

const _store = {
  results: null, // The current dags/tasks listed on the sidebar w/ values
  measure: 'io', // The current filter measure
  time: 'week', // The current filter time range
  dag: null, // The currently selected task or dag
  change: 'percent', // Whether the filter shows absolute or relative change
  searchFilter: '', // The contents of the search bar that filters results
};

// Fires of an Ajax get request to the server to get dags/tasks for sidebar
function updateResults() {
  $.getJSON(
    window.location + 'filter',
    {
      measure: _store.measure,
      time: _store.time,
      dag: _store.dag,
    },
    function(data) {
      // convert dict to array
      const array = [];
      for (const key in data) {
        array.push(data[key]);
      }
      _store.results = array;
      _store.updating = false;
      FilterStore.emit(FILTER_CHANGE_EVENT);
    });
} 


const FilterStore = assign({}, EventEmitter.prototype, {
  // Listener for when radio button changes and results need to update
  addFilterResultsChangeListener: function(cb){
    this.on(FILTER_CHANGE_EVENT, cb);
  },
  removeFilterResultsChangeListener: function(cb){
    this.removeListener(FILTER_CHANGE_EVENT, cb);
  },
  // Listener for when dag is set and button needs to update
  addDagSetListener: function(cb){
    this.on(DAG_SET_EVENT, cb);
  },
  removeDagSetListener: function(cb){
    this.removeListener(DAG_SET_EVENT, cb);
  },
  // Getter for results that fetches results if store is empty
  getResults: function(){
    if (!_store.results) {
      updateResults();
      return null;
    }
    return _store.results.filter(function(element) {
      return (element.name.indexOf(_store.searchFilter) !== -1);
    });
  },
  // Transient getter that calculates headers every time
  getResultHeaders: function(){
    if (_store.dag !== null) {
      return ['task name', _store.measure];
    }
    return ['dag name', _store.measure];

  },
  // Transient getter that calculates filter description string
  getDescriptionString: function(){
    let measureString;
    switch (_store.measure) {
      case 'io':
        measureString = 'read and write operatorions';
        break;
      case 'cpu':
        measureString = 'total cpu time in seconds';
        break;
      case 'mappers':
        measureString = 'number of mappers';
        break;
      case 'reducers':
        measureString = 'number of reducers';
        break;
    }
    return 'Average ' +
      measureString +
      ' over the last ' +
      _store.time.toLowerCase() + '.';
  },

  // Return a bool as to whether filter results are dags or tasks
  isShowingDags: function(){
    if (_store.dag === null) {return true;}
    return false;
  }

});


// Register callback to handle all updates
AppDispatcher.register(function(action) {
  switch(action.actionType) {
    // Radio buttons changed, fetch new dag/task data
    case FilterConstants.UPDATE_FILTER:
      if (action.key in _store) {
        _store[action.key] = action.value.toLowerCase().replace('/','');
        if (action.key == 'dag') {
          FilterStore.emit(DAG_SET_EVENT);
        }
        updateResults();
      }
      else if (action.key == 'grain') {
        if (action.value.toLowerCase() == 'dag') {
          _store.dag = null;
          DetailViewStore.setDag(null);
          updateResults();
        }
      }
      break;
    // The search changed, refresh the acceptable dag/tasks
    case FilterConstants.UPDATE_SEARCH:
      _store.searchFilter = action.searchFilter;
      FilterStore.emit(FILTER_CHANGE_EVENT);
      break;
    default:
      // no op
  }
});

module.exports = FilterStore;
