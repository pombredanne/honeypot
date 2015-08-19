// DetailViewStore.js
// The flux datastore for the entire detail view
/*jshint esnext: true */

const AppDispatcher = require('../dispatcher/AppDispatcher');
const EventEmitter = require('events').EventEmitter;
const DetailViewConstants = require('../constants/DetailViewConstants');
const assign = require('object.assign');

const MEASURE_CHANGE_EVENT = 'measure_change';
const DATA_UPDATE_EVENT = 'data_update';
const DETAILS_UPDATE_EVENT = 'details_update';
const FOCUS_UPDATE_EVENT = 'focus_update';

const _store = {
  measure: 'io', // The currently selected measure for the graph
  dag: null, // The currently selected DAG
  name: 'Select a DAG or Task', // The id (name) of the thing being viewed
  owner: 'owner', // the owner of the thing being viewed
  focusValue: 0, // The value of whatever is being moused over on the graph
  focusDate: 0, // The date of the point currently moused over on the graph
  data: [], // The rows retrieved from the server with values and dates
};

// Fires of an Ajax get request to the server to get values and dates for graph
function updateData() {
  $.getJSON(
    window.location + 'data',
    {
      measure:_store.measure,
      dag: _store.dag,
      id: _store.id
    },
    function(data) {
      const array = [];
      for (const key in data) {
        array.push({value:data[key].value, date:(new Date(data[key].ds))});
      }
      _store.data = array;
      _store.updating = false;
      DetailViewStore.emit(DATA_UPDATE_EVENT);
    });
} 

// Fires of an Ajax get request to the server to get metadata on current thing
function updateDetails() {
  $.getJSON(
    window.location + 'details',
    {
      dag: _store.dag,
      id: _store.id,
    },
    function(data) {
      if (data.length > 0) {
        _store.owner = data[0].owner;
      }
      DetailViewStore.emit(DETAILS_UPDATE_EVENT);
    });
} 

const DetailViewStore = assign({}, EventEmitter.prototype, {

  // Listener for when mouse moves
  addFocusUpdateListener: function(cb){
    this.on(FOCUS_UPDATE_EVENT, cb);
  },

  removeFocusUpdateListener: function(cb){
    this.on(FOCUS_UPDATE_EVENT, cb);
  },

  // Listener for when thing metadata changes
  addDetailUpdateListener: function(cb){
    this.on(DETAILS_UPDATE_EVENT, cb);
  },

  removeDetailUpdateListener: function(cb){
    this.on(DETAILS_UPDATE_EVENT, cb);
  },

  // Listener for when data values and dates change
  addDataUpdateListener: function(cb){
    this.on(DATA_UPDATE_EVENT, cb);
  },

  removeDataUpdateListener: function(cb){
    this.removeListener(DATA_UPDATE_EVENT, cb);
  },

  // Listener for when user selects a different measure
  addMeasureChangeListener: function(cb){
    this.on(MEASURE_CHANGE_EVENT, cb);
  },

  removeMeasureChangeListener: function(cb){
    this.removeListener(MEASURE_CHANGE_EVENT, cb);
  },

  // Getter method for data that creates fetch if need be
  getData: function(){
    return _store.data;
  },

  // Getter method for details that creates fetch if need be
  getDetails: function(){
    let name = _store.id;
    if (_store.dag !== _store.id) {
      name = _store.dag + '.' + _store.id;
    }
    return {
      name: name,
      owner: _store.owner
    };
  },
  
  // Getter method to get current mouseover values
  getFocusDate: function(){
    return _store.focusDate;
  },

  getFocusValue: function(){
    return _store.focusValue;
  },

  // Getter method to get currently selected measure
  getMeasure: function(){
    return _store.measure;
  },

  // Getter method for the entire store
  getStore: function(){
    return _store;
  },

  // Sets the dag of the store
  setDag: function(dag){
    _store.dag = dag;
  },
});


// Register callback to handle all updates
AppDispatcher.register(function(action) {
  switch(action.actionType) {
    // The measure changed and we need to fetch new data
    case DetailViewConstants.UPDATE_MEASURE:
      _store.measure = action.measure.toLowerCase().replace('/','');
      DetailViewStore.emit(MEASURE_CHANGE_EVENT);
      updateData();
      break;
    // We need to fetch new data
    case DetailViewConstants.UPDATE_DATA:
      updateData();
      break;
    // We need to fetch new details on the current dag/task
    case DetailViewConstants.UPDATE_DETAIL_VIEW:
      _store.id = action.name;
      updateData();
      updateDetails();
      break;
    // We need to update our record of our current mouseover point
    case DetailViewConstants.UPDATE_FOCUS_DATA:
      _store.focusValue = action.value;
      _store.focusDate = action.date;
      DetailViewStore.emit(FOCUS_UPDATE_EVENT);
      break;
    // We need to update our record of our current mouseover point
    case DetailViewConstants.UPDATE_DAG:
      _store.dag = action.dag;
      break;
    default:
      // no op
  }
});

module.exports = DetailViewStore;
