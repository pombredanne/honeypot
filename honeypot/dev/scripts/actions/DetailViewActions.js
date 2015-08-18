/*jshint esnext: true */

const AppDispatcher = require('../dispatcher/AppDispatcher');
const DetailViewConstants = require('../constants/DetailViewConstants');

const DetailViewActions = {

  updateMeasure: function(measure) {
    AppDispatcher.dispatch({
      actionType: DetailViewConstants.UPDATE_MEASURE,
      measure: measure,
    });
  },

  updateData: function() {
    AppDispatcher.dispatch({
      actionType: DetailViewConstants.UPDATE_DATA
    });
  },

  updateDetailView: function(dag,name) {
    AppDispatcher.dispatch({
      actionType: DetailViewConstants.UPDATE_DETAIL_VIEW,
      dag: dag,
      name: name
    });
  },
  
  updateFocusData: function(date,value) {
    AppDispatcher.dispatch({
      actionType: DetailViewConstants.UPDATE_FOCUS_DATA,
      value: value,
      date: date 
    });
  },

  updateDag: function(dag) {
    AppDispatcher.dispatch({
      actionType: DetailViewConstants.UPDATE_DAG,
      dag: dag
    });
  }

};

module.exports = DetailViewActions;
