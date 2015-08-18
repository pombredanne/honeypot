/*jshint esnext: true */

const AppDispatcher = require('../dispatcher/AppDispatcher');
const FilterConstants = require('../constants/FilterConstants');

const FilterActions = {

  updateFilter: function(key,value) {
    AppDispatcher.dispatch({
      actionType: FilterConstants.UPDATE_FILTER,
      key: key,
      value: value
    });
  },

  updateSearch: function(searchFilter) {
    AppDispatcher.dispatch({
      actionType: FilterConstants.UPDATE_SEARCH,
      searchFilter: searchFilter
    });
  },

};

module.exports = FilterActions;
