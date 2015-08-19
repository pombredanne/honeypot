(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/gregory_foster/data-eng/honeypot/dev/scripts/actions/DetailViewActions.js":[function(require,module,exports){
/*jshint esnext: true */

'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var DetailViewConstants = require('../constants/DetailViewConstants');

var DetailViewActions = {

  updateMeasure: function updateMeasure(measure) {
    AppDispatcher.dispatch({
      actionType: DetailViewConstants.UPDATE_MEASURE,
      measure: measure
    });
  },

  updateData: function updateData() {
    AppDispatcher.dispatch({
      actionType: DetailViewConstants.UPDATE_DATA
    });
  },

  updateDetailView: function updateDetailView(dag, name) {
    AppDispatcher.dispatch({
      actionType: DetailViewConstants.UPDATE_DETAIL_VIEW,
      dag: dag,
      name: name
    });
  },

  updateFocusData: function updateFocusData(date, value) {
    AppDispatcher.dispatch({
      actionType: DetailViewConstants.UPDATE_FOCUS_DATA,
      value: value,
      date: date
    });
  },

  updateDag: function updateDag(dag) {
    AppDispatcher.dispatch({
      actionType: DetailViewConstants.UPDATE_DAG,
      dag: dag
    });
  }

};

module.exports = DetailViewActions;


},{"../constants/DetailViewConstants":"/Users/gregory_foster/data-eng/honeypot/dev/scripts/constants/DetailViewConstants.js","../dispatcher/AppDispatcher":"/Users/gregory_foster/data-eng/honeypot/dev/scripts/dispatcher/AppDispatcher.js"}],"/Users/gregory_foster/data-eng/honeypot/dev/scripts/actions/FilterActions.js":[function(require,module,exports){
/*jshint esnext: true */

'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var FilterConstants = require('../constants/FilterConstants');

var FilterActions = {

  updateFilter: function updateFilter(key, value) {
    AppDispatcher.dispatch({
      actionType: FilterConstants.UPDATE_FILTER,
      key: key,
      value: value
    });
  },

  updateSearch: function updateSearch(searchFilter) {
    AppDispatcher.dispatch({
      actionType: FilterConstants.UPDATE_SEARCH,
      searchFilter: searchFilter
    });
  }

};

module.exports = FilterActions;


},{"../constants/FilterConstants":"/Users/gregory_foster/data-eng/honeypot/dev/scripts/constants/FilterConstants.js","../dispatcher/AppDispatcher":"/Users/gregory_foster/data-eng/honeypot/dev/scripts/dispatcher/AppDispatcher.js"}],"/Users/gregory_foster/data-eng/honeypot/dev/scripts/app.jsx":[function(require,module,exports){
/*jshint esnext: true */

'use strict';

var Sidebar = require('./ui/Sidebar.jsx');
var DetailView = require('./ui/DetailView.jsx');
var DetailText = require('./ui/DetailText.jsx');

React.render(React.createElement(
  'div',
  null,
  React.createElement(Sidebar, null),
  React.createElement(
    'div',
    { className: 'detailColumn' },
    React.createElement(DetailText, null),
    React.createElement(DetailView, null)
  )
), document.getElementById('wrap'));


},{"./ui/DetailText.jsx":"/Users/gregory_foster/data-eng/honeypot/dev/scripts/ui/DetailText.jsx","./ui/DetailView.jsx":"/Users/gregory_foster/data-eng/honeypot/dev/scripts/ui/DetailView.jsx","./ui/Sidebar.jsx":"/Users/gregory_foster/data-eng/honeypot/dev/scripts/ui/Sidebar.jsx"}],"/Users/gregory_foster/data-eng/honeypot/dev/scripts/constants/DetailViewConstants.js":[function(require,module,exports){
/*jshint esnext: true */

'use strict';

var keyMirror = require('keymirror');

module.exports = keyMirror({
  UPDATE_MEASURE: null,
  UPDATE_DATA: null,
  UPDATE_DETAIL_VIEW: null,
  UPDATE_FOCUS_DATA: null,
  UPDATE_DAG: null
});


},{"keymirror":"/Users/gregory_foster/data-eng/honeypot/node_modules/keymirror/index.js"}],"/Users/gregory_foster/data-eng/honeypot/dev/scripts/constants/FilterConstants.js":[function(require,module,exports){
/*jshint esnext: true */

'use strict';

var keyMirror = require('keymirror');

module.exports = keyMirror({
  UPDATE_FILTER: null,
  UPDATE_SEARCH: null
});


},{"keymirror":"/Users/gregory_foster/data-eng/honeypot/node_modules/keymirror/index.js"}],"/Users/gregory_foster/data-eng/honeypot/dev/scripts/dispatcher/AppDispatcher.js":[function(require,module,exports){
/*jshint esnext: true */

'use strict';

var Dispatcher = require('flux').Dispatcher;

module.exports = new Dispatcher();


},{"flux":"/Users/gregory_foster/data-eng/honeypot/node_modules/flux/index.js"}],"/Users/gregory_foster/data-eng/honeypot/dev/scripts/stores/DetailViewStore.js":[function(require,module,exports){
// DetailViewStore.js
// The flux datastore for the entire detail view
/*jshint esnext: true */

'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var DetailViewConstants = require('../constants/DetailViewConstants');
var assign = require('object-assign');

var MEASURE_CHANGE_EVENT = 'measure_change';
var DATA_UPDATE_EVENT = 'data_update';
var DETAILS_UPDATE_EVENT = 'details_update';
var FOCUS_UPDATE_EVENT = 'focus_update';

var _store = {
  measure: 'io', // The currently selected measure for the graph
  dag: null, // The currently selected DAG
  name: 'Select a DAG or Task', // The id (name) of the thing being viewed
  owner: 'owner', // the owner of the thing being viewed
  focusValue: 0, // The value of whatever is being moused over on the graph
  focusDate: 0, // The date of the point currently moused over on the graph
  data: [] };

// Fires of an Ajax get request to the server to get values and dates for graph
// The rows retrieved from the server with values and dates
function updateData() {
  $.getJSON(window.location + 'data', {
    measure: _store.measure,
    dag: _store.dag,
    id: _store.id
  }, function (data) {
    var array = [];
    for (var key in data) {
      array.push({ value: data[key].value, date: new Date(data[key].ds) });
    }
    _store.data = array;
    _store.updating = false;
    DetailViewStore.emit(DATA_UPDATE_EVENT);
  });
}

// Fires of an Ajax get request to the server to get metadata on current thing
function updateDetails() {
  $.getJSON(window.location + 'details', {
    dag: _store.dag,
    id: _store.id
  }, function (data) {
    if (data.length > 0) {
      _store.owner = data[0].owner;
    }
    DetailViewStore.emit(DETAILS_UPDATE_EVENT);
  });
}

var DetailViewStore = assign({}, EventEmitter.prototype, {

  // Listener for when mouse moves
  addFocusUpdateListener: function addFocusUpdateListener(cb) {
    this.on(FOCUS_UPDATE_EVENT, cb);
  },

  removeFocusUpdateListener: function removeFocusUpdateListener(cb) {
    this.on(FOCUS_UPDATE_EVENT, cb);
  },

  // Listener for when thing metadata changes
  addDetailUpdateListener: function addDetailUpdateListener(cb) {
    this.on(DETAILS_UPDATE_EVENT, cb);
  },

  removeDetailUpdateListener: function removeDetailUpdateListener(cb) {
    this.on(DETAILS_UPDATE_EVENT, cb);
  },

  // Listener for when data values and dates change
  addDataUpdateListener: function addDataUpdateListener(cb) {
    this.on(DATA_UPDATE_EVENT, cb);
  },

  removeDataUpdateListener: function removeDataUpdateListener(cb) {
    this.removeListener(DATA_UPDATE_EVENT, cb);
  },

  // Listener for when user selects a different measure
  addMeasureChangeListener: function addMeasureChangeListener(cb) {
    this.on(MEASURE_CHANGE_EVENT, cb);
  },

  removeMeasureChangeListener: function removeMeasureChangeListener(cb) {
    this.removeListener(MEASURE_CHANGE_EVENT, cb);
  },

  // Getter method for data that creates fetch if need be
  getData: function getData() {
    return _store.data;
  },

  // Getter method for details that creates fetch if need be
  getDetails: function getDetails() {
    var name = _store.id;
    if (_store.dag !== _store.id) {
      name = _store.dag + '.' + _store.id;
    }
    return {
      name: name,
      owner: _store.owner
    };
  },

  // Getter method to get current mouseover values
  getFocusDate: function getFocusDate() {
    return _store.focusDate;
  },

  getFocusValue: function getFocusValue() {
    return _store.focusValue;
  },

  // Getter method to get currently selected measure
  getMeasure: function getMeasure() {
    return _store.measure;
  },

  // Getter method for the entire store
  getStore: function getStore() {
    return _store;
  },

  // Sets the dag of the store
  setDag: function setDag(dag) {
    _store.dag = dag;
  }
});

// Register callback to handle all updates
AppDispatcher.register(function (action) {
  switch (action.actionType) {
    // The measure changed and we need to fetch new data
    case DetailViewConstants.UPDATE_MEASURE:
      _store.measure = action.measure.toLowerCase().replace('/', '');
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


},{"../constants/DetailViewConstants":"/Users/gregory_foster/data-eng/honeypot/dev/scripts/constants/DetailViewConstants.js","../dispatcher/AppDispatcher":"/Users/gregory_foster/data-eng/honeypot/dev/scripts/dispatcher/AppDispatcher.js","events":"/Users/gregory_foster/data-eng/honeypot/node_modules/events/events.js","object-assign":"/Users/gregory_foster/data-eng/honeypot/node_modules/object-assign/index.js"}],"/Users/gregory_foster/data-eng/honeypot/dev/scripts/stores/FilterStore.js":[function(require,module,exports){
// FilterStore.js
// The flux datastore for the left sidebar
/*jshint esnext: true */

'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var FilterConstants = require('../constants/FilterConstants');
var assign = require('object-assign');
var DetailViewStore = require('./DetailViewStore');

var FILTER_CHANGE_EVENT = 'filter_change';
var DAG_SET_EVENT = 'dag_chosen';

var _store = {
  results: null, // The current dags/tasks listed on the sidebar w/ values
  measure: 'io', // The current filter measure
  time: 'week', // The current filter time range
  dag: null, // The currently selected task or dag
  change: 'percent', // Whether the filter shows absolute or relative change
  searchFilter: '' };

// Fires of an Ajax get request to the server to get dags/tasks for sidebar
// The contents of the search bar that filters results
function updateResults() {
  $.getJSON(window.location + 'filter', {
    measure: _store.measure,
    time: _store.time,
    dag: _store.dag
  }, function (data) {
    // convert dict to array
    var array = [];
    for (var key in data) {
      array.push(data[key]);
    }
    _store.results = array;
    _store.updating = false;
    FilterStore.emit(FILTER_CHANGE_EVENT);
  });
}

var FilterStore = assign({}, EventEmitter.prototype, {
  // Listener for when radio button changes and results need to update
  addFilterResultsChangeListener: function addFilterResultsChangeListener(cb) {
    this.on(FILTER_CHANGE_EVENT, cb);
  },
  removeFilterResultsChangeListener: function removeFilterResultsChangeListener(cb) {
    this.removeListener(FILTER_CHANGE_EVENT, cb);
  },
  // Listener for when dag is set and button needs to update
  addDagSetListener: function addDagSetListener(cb) {
    this.on(DAG_SET_EVENT, cb);
  },
  removeDagSetListener: function removeDagSetListener(cb) {
    this.removeListener(DAG_SET_EVENT, cb);
  },
  // Getter for results that fetches results if store is empty
  getResults: function getResults() {
    if (!_store.results) {
      updateResults();
      return null;
    }
    return _store.results.filter(function (element) {
      return element.name.indexOf(_store.searchFilter) !== -1;
    });
  },
  // Transient getter that calculates headers every time
  getResultHeaders: function getResultHeaders() {
    if (_store.dag !== null) {
      return ['task name', _store.measure];
    }
    return ['dag name', _store.measure];
  },
  // Transient getter that calculates filter description string
  getDescriptionString: function getDescriptionString() {
    var measureString = undefined;
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
    return 'Average ' + measureString + ' over the last ' + _store.time.toLowerCase() + '.';
  },

  // Return a bool as to whether filter results are dags or tasks
  isShowingDags: function isShowingDags() {
    if (_store.dag === null) {
      return true;
    }
    return false;
  }

});

// Register callback to handle all updates
AppDispatcher.register(function (action) {
  switch (action.actionType) {
    // Radio buttons changed, fetch new dag/task data
    case FilterConstants.UPDATE_FILTER:
      if (action.key in _store) {
        _store[action.key] = action.value.toLowerCase().replace('/', '');
        if (action.key == 'dag') {
          FilterStore.emit(DAG_SET_EVENT);
        }
        updateResults();
      } else if (action.key == 'grain') {
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


},{"../constants/FilterConstants":"/Users/gregory_foster/data-eng/honeypot/dev/scripts/constants/FilterConstants.js","../dispatcher/AppDispatcher":"/Users/gregory_foster/data-eng/honeypot/dev/scripts/dispatcher/AppDispatcher.js","./DetailViewStore":"/Users/gregory_foster/data-eng/honeypot/dev/scripts/stores/DetailViewStore.js","events":"/Users/gregory_foster/data-eng/honeypot/node_modules/events/events.js","object-assign":"/Users/gregory_foster/data-eng/honeypot/node_modules/object-assign/index.js"}],"/Users/gregory_foster/data-eng/honeypot/dev/scripts/ui/Chart.jsx":[function(require,module,exports){
// Chart.js
// The bridge between React and D3
/*jshint esnext: true */

'use strict';

var DetailViewStore = require('../stores/DetailViewStore');
var d3Chart = require('./d3Chart.js');

var Chart = React.createClass({
  displayName: 'Chart',

  getInitialState: function getInitialState() {
    return { data: DetailViewStore.getData() };
  },

  componentDidMount: function componentDidMount() {
    var el = React.findDOMNode(this);
    DetailViewStore.addDataUpdateListener(this._onChange);
    d3Chart.create(el);
  },

  componentDidUpdate: function componentDidUpdate() {
    d3Chart.update(this.state.data);
  },

  _onChange: function _onChange() {
    this.setState({
      data: DetailViewStore.getData()
    });
  },

  componentWillUnmount: function componentWillUnmount() {
    DetailViewStore.removeDataUpdateListener(this._onChange);
  },

  render: function render() {
    return React.createElement('div', { className: 'chart' });
  }
});

module.exports = Chart;


},{"../stores/DetailViewStore":"/Users/gregory_foster/data-eng/honeypot/dev/scripts/stores/DetailViewStore.js","./d3Chart.js":"/Users/gregory_foster/data-eng/honeypot/dev/scripts/ui/d3Chart.js"}],"/Users/gregory_foster/data-eng/honeypot/dev/scripts/ui/DetailText.jsx":[function(require,module,exports){
/*jshint esnext: true */

'use strict';

var DetailViewStore = require('../stores/DetailViewStore');
var DetailViewActions = require('../actions/DetailViewActions');

var DetailText = React.createClass({
  displayName: 'DetailText',

  getInitialState: function getInitialState() {
    return DetailViewStore.getStore();
  },

  componentDidMount: function componentDidMount() {
    DetailViewStore.addDataUpdateListener(this._onMetadataChange);
    DetailViewStore.addFocusUpdateListener(this._onFocusChange);
    DetailViewStore.addMeasureChangeListener(this._onMeasureChange);
  },

  componentDidUnmount: function componentDidUnmount() {
    DetailViewStore.removeDataUpdateListener(this._onMetadataChange);
    DetailViewStore.removeFocusUpdateListener(this._onFocusChange);
    DetailViewStore.removeMeasureChangeListener(this._onMeasureChange);
  },

  _onFocusChange: function _onFocusChange() {
    this.setState({
      focusValue: DetailViewStore.getFocusValue(),
      focusDate: DetailViewStore.getFocusDate()
    });
  },

  _onMeasureChange: function _onMeasureChange() {
    this.setState({
      measure: DetailViewStore.getMeasure()
    });
  },

  _onMetadataChange: function _onMetadataChange() {
    var details = DetailViewStore.getDetails();
    this.setState({
      name: details.name,
      owner: details.owner
    });
  },

  render: function render() {
    var focusDate = DetailViewStore.getFocusDate();
    var formattedFocusDate = "";
    if (focusDate) {
      formattedFocusDate = focusDate.getMonth() + 1 + '/' + focusDate.getDate() + '/' + focusDate.getFullYear();
    }
    var numberFormatter = d3.format('.3s');
    return React.createElement(
      'div',
      { className: 'detailText' },
      React.createElement(
        'div',
        { className: 'titleRow' },
        React.createElement(
          'h1',
          { className: 'curId' },
          this.state.name
        ),
        React.createElement(
          'h1',
          { className: 'measure' },
          this.state.measure
        ),
        React.createElement(
          'h1',
          { className: 'focusVal' },
          numberFormatter(this.state.focusValue)
        )
      ),
      React.createElement('div', { className: 'divider' }),
      React.createElement(
        'div',
        { className: 'infoRow' },
        React.createElement(
          'p',
          { className: 'owner' },
          this.state.owner
        ),
        React.createElement(
          'p',
          { className: 'focusDate' },
          formattedFocusDate
        )
      )
    );
  }
});

module.exports = DetailText;


},{"../actions/DetailViewActions":"/Users/gregory_foster/data-eng/honeypot/dev/scripts/actions/DetailViewActions.js","../stores/DetailViewStore":"/Users/gregory_foster/data-eng/honeypot/dev/scripts/stores/DetailViewStore.js"}],"/Users/gregory_foster/data-eng/honeypot/dev/scripts/ui/DetailView.jsx":[function(require,module,exports){
/*jshint esnext: true */

'use strict';

var Chart = require('./Chart.jsx');
var MeasureRow = require('./MeasureRow.jsx');

var DetailView = React.createClass({
  displayName: 'DetailView',

  render: function render() {
    return React.createElement(
      'div',
      { className: 'detailView' },
      React.createElement(MeasureRow, { name: 'measure', labels: ['I/O', 'CPU', 'Mappers', 'Reducers'] }),
      React.createElement(Chart, null)
    );
  }
});

module.exports = DetailView;


},{"./Chart.jsx":"/Users/gregory_foster/data-eng/honeypot/dev/scripts/ui/Chart.jsx","./MeasureRow.jsx":"/Users/gregory_foster/data-eng/honeypot/dev/scripts/ui/MeasureRow.jsx"}],"/Users/gregory_foster/data-eng/honeypot/dev/scripts/ui/FilterButton.jsx":[function(require,module,exports){
/*jshint esnext: true */

"use strict";

var FilterButton = React.createClass({
  displayName: "FilterButton",

  propTypes: {
    label: React.PropTypes.string.isRequired,
    handler: React.PropTypes.func.isRequired
  },

  render: function render() {
    return React.createElement(
      "button",
      { onClick: this.props.handler, className: this.props.className },
      this.props.label
    );
  }
});

module.exports = FilterButton;


},{}],"/Users/gregory_foster/data-eng/honeypot/dev/scripts/ui/FilterOptionRow.jsx":[function(require,module,exports){
// FILTEROPTIONROW
/*jshint esnext: true */

'use strict';

var FilterActions = require('../actions/FilterActions');
var FilterButton = require('./FilterButton.jsx');

var FilterOptionRow = React.createClass({
  displayName: 'FilterOptionRow',

  propTypes: {
    name: React.PropTypes.string.isRequired,
    labels: React.PropTypes.array.isRequired
  },

  getInitialState: function getInitialState() {
    return { selected: 0 };
  },

  handleClick: function handleClick(index) {
    if (index != this.state.selected) {
      this.setState({ selected: index });
      FilterActions.updateFilter(this.props.name, this.props.labels[index]);
    }
  },

  render: function render() {
    var span = undefined;

    switch (this.props.labels.length) {
      case 2:
        span = 'half';
        break;
      case 3:
        span = 'third';
        break;
      case 4:
        span = 'quarter';
        break;
    }
    return React.createElement(
      'div',
      { className: 'filterOptionRow' },
      this.props.labels.map(function (curLabel, i) {
        var selected = i == this.state.selected ? 'selected' : 'deselected';

        var props = {
          label: curLabel,
          handler: this.handleClick.bind(this, i),
          className: 'filterButton' + ' ' + span + ' ' + selected
        };
        return React.createElement(FilterButton, props);
      }, this)
    );
  }
});

module.exports = FilterOptionRow;


},{"../actions/FilterActions":"/Users/gregory_foster/data-eng/honeypot/dev/scripts/actions/FilterActions.js","./FilterButton.jsx":"/Users/gregory_foster/data-eng/honeypot/dev/scripts/ui/FilterButton.jsx"}],"/Users/gregory_foster/data-eng/honeypot/dev/scripts/ui/FilterResultRow.jsx":[function(require,module,exports){
// FILTERRESULTROW
/*jshint esnext: true */

'use strict';

var FilterResultRow = React.createClass({
  displayName: 'FilterResultRow',

  render: function render() {
    var className = 'filterResultRow';
    if (this.props.selected) {
      className = className + ' selected';
    }
    var formatter = d3.format('.3s');
    return React.createElement(
      'tr',
      { className: className, onClick: this.props.handler },
      React.createElement(
        'td',
        { className: 'filterResultRowName' },
        this.props.name
      ),
      React.createElement(
        'td',
        { className: 'filterResultRowValue' },
        formatter(this.props.value)
      )
    );
  }
});

module.exports = FilterResultRow;


},{}],"/Users/gregory_foster/data-eng/honeypot/dev/scripts/ui/FilterResultsTable.jsx":[function(require,module,exports){
// FILTERRESULTSTABLE
/*jshint esnext: true */

'use strict';

var FilterStore = require('../stores/FilterStore');
var FilterActions = require('../actions/FilterActions');
var DetailViewActions = require('../actions/DetailViewActions.js');
var FilterResultRow = require('./FilterResultRow.jsx');

var FilterResultsTable = React.createClass({
  displayName: 'FilterResultsTable',

  getInitialState: function getInitialState() {
    return {
      results: FilterStore.getResults(),
      headers: FilterStore.getResultHeaders(),
      description: FilterStore.getDescriptionString()
    };
  },

  handleClick: function handleClick(index) {
    DetailViewActions.updateDetailView(this.state.headers[0].replace(' name', ''), this.state.results[index].name);

    if (FilterStore.isShowingDags()) {
      FilterActions.updateFilter("dag", this.state.results[index].name);
      DetailViewActions.updateDag(this.state.results[index].name);
    }

    this.setState({
      selected: index
    });
  },

  componentDidMount: function componentDidMount() {
    FilterStore.addFilterResultsChangeListener(this._onChange);
  },

  componentDidUnmount: function componentDidUnmount() {
    FilterStore.removeFilterResultsChangeListener(this._onChange);
  },

  _onChange: function _onChange() {
    this.setState({
      results: FilterStore.getResults(),
      headers: FilterStore.getResultHeaders(),
      description: FilterStore.getDescriptionString()
    });
  },

  render: function render() {
    if (this.state.results) {
      return React.createElement(
        'table',
        { className: 'filterResults' },
        React.createElement(
          'p',
          { className: 'filterDescription' },
          this.state.description
        ),
        React.createElement(
          'tr',
          null,
          this.state.headers.map(function (header, i) {
            var name = 'filterResultRowValue';
            if (i == 0) name = 'filterResultRowName';
            return React.createElement(
              'th',
              { className: name },
              header
            );
          }, this)
        ),
        this.state.results.map(function (result, i) {
          // Create all the result rows
          var resultsRowProps = {
            name: result.name,
            key: i,
            value: Number(result.value.toFixed(1)),
            handler: this.handleClick.bind(this, i),
            selected: i == this.state.selected ? true : false
          };
          // Shorten name to prevent overflow
          if (resultsRowProps.name.length > 25) {
            resultsRowProps.name = resultsRowProps.name.slice(0, 25) + '...';
          }

          return React.createElement(FilterResultRow, resultsRowProps);
        }, this)
      );
    } else {
      return React.createElement('table', { className: 'filterResults' });
    }
  }
});

module.exports = FilterResultsTable;


},{"../actions/DetailViewActions.js":"/Users/gregory_foster/data-eng/honeypot/dev/scripts/actions/DetailViewActions.js","../actions/FilterActions":"/Users/gregory_foster/data-eng/honeypot/dev/scripts/actions/FilterActions.js","../stores/FilterStore":"/Users/gregory_foster/data-eng/honeypot/dev/scripts/stores/FilterStore.js","./FilterResultRow.jsx":"/Users/gregory_foster/data-eng/honeypot/dev/scripts/ui/FilterResultRow.jsx"}],"/Users/gregory_foster/data-eng/honeypot/dev/scripts/ui/MeasureRow.jsx":[function(require,module,exports){
/*jshint esnext: true */

'use strict';

var DetailViewStore = require('../stores/DetailViewStore');
var DetailViewActions = require('../actions/DetailViewActions');
var FilterButton = require('./FilterButton.jsx');

var MeasureRow = React.createClass({
  displayName: 'MeasureRow',

  propTypes: {
    labels: React.PropTypes.array.isRequired
  },

  getInitialState: function getInitialState() {
    return { selected: 0 };
  },

  handleClick: function handleClick(index) {
    if (index != this.state.selected) {
      this.setState({ selected: index });
      DetailViewActions.updateMeasure(this.props.labels[index]);
    }
  },

  render: function render() {
    return(
      // Create a radio button for each label passed in to the props
      React.createElement(
        'div',
        { className: 'measureRow' },
        this.props.labels.map(function (curLabel, i) {
          var selected = i == this.state.selected ? 'selected' : 'deselected';

          var filterButtonProps = {
            label: curLabel,
            handler: this.handleClick.bind(this, i),
            className: 'filterButton' + ' ' + selected
          };

          return React.createElement(FilterButton, filterButtonProps);
        }, this)
      )
    );
  }
});

module.exports = MeasureRow;


},{"../actions/DetailViewActions":"/Users/gregory_foster/data-eng/honeypot/dev/scripts/actions/DetailViewActions.js","../stores/DetailViewStore":"/Users/gregory_foster/data-eng/honeypot/dev/scripts/stores/DetailViewStore.js","./FilterButton.jsx":"/Users/gregory_foster/data-eng/honeypot/dev/scripts/ui/FilterButton.jsx"}],"/Users/gregory_foster/data-eng/honeypot/dev/scripts/ui/SearchBox.jsx":[function(require,module,exports){
// SEARCHBOX
/*jshint esnext: true */

'use strict';

var FilterActions = require('../actions/FilterActions');

var SearchBox = React.createClass({
  displayName: 'SearchBox',

  handleChange: function handleChange(e) {
    FilterActions.updateSearch(e.target.value);
  },

  render: function render() {
    return React.createElement(
      'form',
      { className: 'searchBox',
        onChange: this.handleChange,
        onSubmit: function (e) {
          return false;
        } },
      React.createElement('input', { type: 'text', placeholder: 'filter', ref: 'searchText' })
    );
  }
});

module.exports = SearchBox;


},{"../actions/FilterActions":"/Users/gregory_foster/data-eng/honeypot/dev/scripts/actions/FilterActions.js"}],"/Users/gregory_foster/data-eng/honeypot/dev/scripts/ui/Sidebar.jsx":[function(require,module,exports){
// SIDEBAR
/*jshint esnext: true */

'use strict';

var SearchBox = require('./SearchBox.jsx');
var FilterOptionRow = require('./FilterOptionRow.jsx');
var FilterResultsTable = require('./FilterResultsTable.jsx');
var FilterStore = require('../stores/FilterStore');

var Sidebar = React.createClass({
  displayName: 'Sidebar',

  componentDidMount: function componentDidMount() {
    FilterStore.addDagSetListener(this._onDagSet);
  },

  componentDidUnmount: function componentDidUnmount() {
    FilterStore.removeDagSetListener(this._onDagSet);
  },

  _onDagSet: function _onDagSet() {
    this.refs.grainRow.setState({ selected: 1 });
  },

  render: function render() {
    return React.createElement(
      'div',
      { className: 'sidebar' },
      React.createElement(SearchBox, null),
      React.createElement(
        'div',
        { className: 'filterOptions' },
        React.createElement(FilterOptionRow, { name: 'measure', labels: ['I/O', 'CPU', 'Mappers', 'Reducers'] }),
        React.createElement(FilterOptionRow, { name: 'time', labels: ['Week', 'Month', 'Year'] }),
        React.createElement(FilterOptionRow, { ref: 'grainRow', name: 'grain', labels: ['DAG', 'Task'] })
      ),
      React.createElement(FilterResultsTable, null)
    );
  }
});

module.exports = Sidebar;


},{"../stores/FilterStore":"/Users/gregory_foster/data-eng/honeypot/dev/scripts/stores/FilterStore.js","./FilterOptionRow.jsx":"/Users/gregory_foster/data-eng/honeypot/dev/scripts/ui/FilterOptionRow.jsx","./FilterResultsTable.jsx":"/Users/gregory_foster/data-eng/honeypot/dev/scripts/ui/FilterResultsTable.jsx","./SearchBox.jsx":"/Users/gregory_foster/data-eng/honeypot/dev/scripts/ui/SearchBox.jsx"}],"/Users/gregory_foster/data-eng/honeypot/dev/scripts/ui/d3Chart.js":[function(require,module,exports){
// d3Chart.js
/*jshint esnext: true */

'use strict';

var d3Chart = {};
var DetailViewActions = require('../actions/DetailViewActions');

d3Chart.create = function (el) {

  var chart = d3.select(el).append('svg').attr('class', 'mainChart').on('mousemove', d3Chart.mousemove);

  chart.append('clipPath').attr('id', 'plotAreaClip').append('rect').attr('id', 'plotAreaClipRect');

  var plotArea = chart.append('g');

  plotArea.append('svg:path').attr('class', 'line');

  plotArea.append('svg:line').attr('class', 'focusLine');

  chart.append('g').attr('class', 'xAxis');

  chart.append('g').attr('class', 'yAxis');

  var navChart = d3.select(el).append('svg').classed('navigator', true);

  navChart.append('g').attr('class', 'xAxis');

  navChart.append('path').attr('class', 'fill');

  navChart.append('path').attr('class', 'line').attr('stroke', 'blue').attr('stroke-width', 2).attr('fill', 'none');

  navChart.append('g').attr('class', 'viewport');
};

d3Chart.lineFunction = function (scales) {
  return d3.svg.line().x(function (d) {
    return scales.x(d.date);
  }).y(function (d) {
    return scales.y(d.value);
  }).interpolate('linear');
};

// SIZING INFORMATION

d3Chart.margins = function () {
  return { bottom: 50, left: 75 };
};

d3Chart.mainSize = function () {
  var chart = d3.select('svg')[0][0];
  var width = chart.offsetWidth;
  var height = chart.offsetHeight;
  return { width: width, height: height };
};

d3Chart.navSize = function () {
  var chart = d3.select('svg')[0][0];
  var width = chart.offsetWidth;
  var height = chart.offsetHeight * (1 / 6);
  return { width: width, height: height };
};

d3Chart.update = function (data) {

  // MAIN CHART
  d3Chart.data = data;
  var mainSize = this.mainSize();
  var margins = this.margins();
  d3Chart.mainScales = this._scales({
    x: margins.left,
    y: 0,
    width: mainSize.width,
    height: mainSize.height - margins.bottom
  });

  var lineFunc = this.lineFunction(d3Chart.mainScales);

  var xAxis = d3.svg.axis().scale(d3Chart.mainScales.x).orient('bottom').ticks(6);

  var yAxis = d3.svg.axis().scale(d3Chart.mainScales.y).orient('left').tickFormat(d3.format(".3s")).ticks(5);

  var mainChart = d3.select('.mainChart');
  mainChart.select('.xAxis').attr('transform', 'translate(0, ' + (mainSize.height - margins.bottom) + ')').transition().call(xAxis);
  mainChart.select('.yAxis').attr('transform', 'translate(' + margins.left + ', 0)').transition().call(yAxis);
  mainChart.select('.line').transition().attr('d', lineFunc(d3Chart.data));

  // NAV CHART
  var navSize = this.navSize();
  d3Chart.navScales = this._scales({
    x: margins.left,
    y: 0,
    width: navSize.width,
    height: navSize.height
  });

  var navChart = d3.select('.navigator').attr('width', navSize.width + margins.left).attr('height', navSize.height + margins.bottom).attr('transform', 'translate(' + margins.left + ',' + margins.bottom + ')');

  var navXAxis = d3.svg.axis().scale(d3Chart.navScales.x).orient('bottom').ticks(5);

  navChart.select('.xAxis').attr('transform', 'translate(0,' + navSize.height + ')').call(navXAxis);

  // Nav Graph Function for area
  var navFill = d3.svg.area().x(function (d) {
    return d3Chart.navScales.x(d.date);
  }).y0(navSize.height).y1(function (d) {
    return d3Chart.navScales.y(d.value);
  });

  // Nav Graph Function for line
  var navLine = d3.svg.line().x(function (d) {
    return d3Chart.navScales.x(d.date);
  }).y(function (d) {
    return d3Chart.navScales.y(d.value);
  });

  navChart.select('.fill').transition().attr('d', navFill(d3Chart.data));

  navChart.select('.line').transition().attr('d', navLine(d3Chart.data));

  var viewport = d3.svg.brush().x(d3Chart.navScales.x).on('brush', function () {
    d3Chart.mainScales.x.domain(viewport.empty() ? d3Chart.navScales.x.domain() : viewport.extent());
    d3Chart.redrawChart(d3Chart.mainScales, xAxis, d3Chart.data);
  });

  navChart.select('.viewport').call(viewport).selectAll('rect').attr('height', navSize.height);
};

d3Chart.redrawChart = function (scales, xAxis, data) {
  var lineFunc = this.lineFunction(scales);
  xAxis.scale(scales.x);
  d3.select('.mainChart').select('.xAxis').call(xAxis);
  d3.select('.mainChart').select('.line').attr('d', lineFunc(d3Chart.data));
};

d3Chart._scales = function (rect) {

  var dates = d3Chart.data.map(function (cur) {
    return cur.date;
  });
  var values = d3Chart.data.map(function (cur) {
    return cur.value;
  });

  var maxDate = new Date(Math.max.apply(null, dates));
  var minDate = new Date(Math.min.apply(null, dates));
  var maxValue = Math.max.apply(null, values);
  var minValue = Math.min.apply(null, values);

  var xScale = d3.time.scale().domain([minDate, maxDate]).range([rect.x, rect.width]);

  var yScale = d3.scale.linear().domain([minValue * 0.8, maxValue * 1.1]).range([rect.height, rect.y]);

  return { x: xScale, y: yScale };
};

d3Chart.bisectDate = d3.bisector(function (d) {
  return d.date;
}).left;

// Draw a vertical line and update the focus date / value
d3Chart.mousemove = function () {
  // Snap to one mouse point because will never mouse over a date exactly
  if (d3Chart.data) {
    var mouseoverDate = d3Chart.mainScales.x.invert(d3.mouse(this)[0]),
        index = d3Chart.bisectDate(d3Chart.data, mouseoverDate, 1),
        pointBeforeDate = d3Chart.data[index - 1],
        pointOnDate = d3Chart.data[index],
        point = mouseoverDate - pointBeforeDate.date > pointOnDate.date - mouseoverDate ? pointOnDate : pointBeforeDate;
    DetailViewActions.updateFocusData(point.date, point.value);
    // Draw the line
    var margins = d3Chart.margins();
    var x = d3.mouse(this)[0] < margins.left ? margins.left : d3.mouse(this)[0];
    var focusLine = d3.select('.focusLine').attr('x1', x).attr('x2', x).attr('y1', 0).attr('y1', d3Chart.mainSize().height - margins.bottom);
  }
};

module.exports = d3Chart;


},{"../actions/DetailViewActions":"/Users/gregory_foster/data-eng/honeypot/dev/scripts/actions/DetailViewActions.js"}],"/Users/gregory_foster/data-eng/honeypot/node_modules/events/events.js":[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],"/Users/gregory_foster/data-eng/honeypot/node_modules/flux/index.js":[function(require,module,exports){
/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

module.exports.Dispatcher = require('./lib/Dispatcher')

},{"./lib/Dispatcher":"/Users/gregory_foster/data-eng/honeypot/node_modules/flux/lib/Dispatcher.js"}],"/Users/gregory_foster/data-eng/honeypot/node_modules/flux/lib/Dispatcher.js":[function(require,module,exports){
/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Dispatcher
 * @typechecks
 */

"use strict";

var invariant = require('./invariant');

var _lastID = 1;
var _prefix = 'ID_';

/**
 * Dispatcher is used to broadcast payloads to registered callbacks. This is
 * different from generic pub-sub systems in two ways:
 *
 *   1) Callbacks are not subscribed to particular events. Every payload is
 *      dispatched to every registered callback.
 *   2) Callbacks can be deferred in whole or part until other callbacks have
 *      been executed.
 *
 * For example, consider this hypothetical flight destination form, which
 * selects a default city when a country is selected:
 *
 *   var flightDispatcher = new Dispatcher();
 *
 *   // Keeps track of which country is selected
 *   var CountryStore = {country: null};
 *
 *   // Keeps track of which city is selected
 *   var CityStore = {city: null};
 *
 *   // Keeps track of the base flight price of the selected city
 *   var FlightPriceStore = {price: null}
 *
 * When a user changes the selected city, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'city-update',
 *     selectedCity: 'paris'
 *   });
 *
 * This payload is digested by `CityStore`:
 *
 *   flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'city-update') {
 *       CityStore.city = payload.selectedCity;
 *     }
 *   });
 *
 * When the user selects a country, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'country-update',
 *     selectedCountry: 'australia'
 *   });
 *
 * This payload is digested by both stores:
 *
 *    CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       CountryStore.country = payload.selectedCountry;
 *     }
 *   });
 *
 * When the callback to update `CountryStore` is registered, we save a reference
 * to the returned token. Using this token with `waitFor()`, we can guarantee
 * that `CountryStore` is updated before the callback that updates `CityStore`
 * needs to query its data.
 *
 *   CityStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       // `CountryStore.country` may not be updated.
 *       flightDispatcher.waitFor([CountryStore.dispatchToken]);
 *       // `CountryStore.country` is now guaranteed to be updated.
 *
 *       // Select the default city for the new country
 *       CityStore.city = getDefaultCityForCountry(CountryStore.country);
 *     }
 *   });
 *
 * The usage of `waitFor()` can be chained, for example:
 *
 *   FlightPriceStore.dispatchToken =
 *     flightDispatcher.register(function(payload) {
 *       switch (payload.actionType) {
 *         case 'country-update':
 *           flightDispatcher.waitFor([CityStore.dispatchToken]);
 *           FlightPriceStore.price =
 *             getFlightPriceStore(CountryStore.country, CityStore.city);
 *           break;
 *
 *         case 'city-update':
 *           FlightPriceStore.price =
 *             FlightPriceStore(CountryStore.country, CityStore.city);
 *           break;
 *     }
 *   });
 *
 * The `country-update` payload will be guaranteed to invoke the stores'
 * registered callbacks in order: `CountryStore`, `CityStore`, then
 * `FlightPriceStore`.
 */

  function Dispatcher() {
    this.$Dispatcher_callbacks = {};
    this.$Dispatcher_isPending = {};
    this.$Dispatcher_isHandled = {};
    this.$Dispatcher_isDispatching = false;
    this.$Dispatcher_pendingPayload = null;
  }

  /**
   * Registers a callback to be invoked with every dispatched payload. Returns
   * a token that can be used with `waitFor()`.
   *
   * @param {function} callback
   * @return {string}
   */
  Dispatcher.prototype.register=function(callback) {
    var id = _prefix + _lastID++;
    this.$Dispatcher_callbacks[id] = callback;
    return id;
  };

  /**
   * Removes a callback based on its token.
   *
   * @param {string} id
   */
  Dispatcher.prototype.unregister=function(id) {
    invariant(
      this.$Dispatcher_callbacks[id],
      'Dispatcher.unregister(...): `%s` does not map to a registered callback.',
      id
    );
    delete this.$Dispatcher_callbacks[id];
  };

  /**
   * Waits for the callbacks specified to be invoked before continuing execution
   * of the current callback. This method should only be used by a callback in
   * response to a dispatched payload.
   *
   * @param {array<string>} ids
   */
  Dispatcher.prototype.waitFor=function(ids) {
    invariant(
      this.$Dispatcher_isDispatching,
      'Dispatcher.waitFor(...): Must be invoked while dispatching.'
    );
    for (var ii = 0; ii < ids.length; ii++) {
      var id = ids[ii];
      if (this.$Dispatcher_isPending[id]) {
        invariant(
          this.$Dispatcher_isHandled[id],
          'Dispatcher.waitFor(...): Circular dependency detected while ' +
          'waiting for `%s`.',
          id
        );
        continue;
      }
      invariant(
        this.$Dispatcher_callbacks[id],
        'Dispatcher.waitFor(...): `%s` does not map to a registered callback.',
        id
      );
      this.$Dispatcher_invokeCallback(id);
    }
  };

  /**
   * Dispatches a payload to all registered callbacks.
   *
   * @param {object} payload
   */
  Dispatcher.prototype.dispatch=function(payload) {
    invariant(
      !this.$Dispatcher_isDispatching,
      'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.'
    );
    this.$Dispatcher_startDispatching(payload);
    try {
      for (var id in this.$Dispatcher_callbacks) {
        if (this.$Dispatcher_isPending[id]) {
          continue;
        }
        this.$Dispatcher_invokeCallback(id);
      }
    } finally {
      this.$Dispatcher_stopDispatching();
    }
  };

  /**
   * Is this Dispatcher currently dispatching.
   *
   * @return {boolean}
   */
  Dispatcher.prototype.isDispatching=function() {
    return this.$Dispatcher_isDispatching;
  };

  /**
   * Call the callback stored with the given id. Also do some internal
   * bookkeeping.
   *
   * @param {string} id
   * @internal
   */
  Dispatcher.prototype.$Dispatcher_invokeCallback=function(id) {
    this.$Dispatcher_isPending[id] = true;
    this.$Dispatcher_callbacks[id](this.$Dispatcher_pendingPayload);
    this.$Dispatcher_isHandled[id] = true;
  };

  /**
   * Set up bookkeeping needed when dispatching.
   *
   * @param {object} payload
   * @internal
   */
  Dispatcher.prototype.$Dispatcher_startDispatching=function(payload) {
    for (var id in this.$Dispatcher_callbacks) {
      this.$Dispatcher_isPending[id] = false;
      this.$Dispatcher_isHandled[id] = false;
    }
    this.$Dispatcher_pendingPayload = payload;
    this.$Dispatcher_isDispatching = true;
  };

  /**
   * Clear bookkeeping used for dispatching.
   *
   * @internal
   */
  Dispatcher.prototype.$Dispatcher_stopDispatching=function() {
    this.$Dispatcher_pendingPayload = null;
    this.$Dispatcher_isDispatching = false;
  };


module.exports = Dispatcher;

},{"./invariant":"/Users/gregory_foster/data-eng/honeypot/node_modules/flux/lib/invariant.js"}],"/Users/gregory_foster/data-eng/honeypot/node_modules/flux/lib/invariant.js":[function(require,module,exports){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule invariant
 */

"use strict";

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (false) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        'Invariant Violation: ' +
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;

},{}],"/Users/gregory_foster/data-eng/honeypot/node_modules/keymirror/index.js":[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

"use strict";

/**
 * Constructs an enumeration with keys equal to their value.
 *
 * For example:
 *
 *   var COLORS = keyMirror({blue: null, red: null});
 *   var myColor = COLORS.blue;
 *   var isColorValid = !!COLORS[myColor];
 *
 * The last line could not be performed if the values of the generated enum were
 * not equal to their keys.
 *
 *   Input:  {key1: val1, key2: val2}
 *   Output: {key1: key1, key2: key2}
 *
 * @param {object} obj
 * @return {object}
 */
var keyMirror = function(obj) {
  var ret = {};
  var key;
  if (!(obj instanceof Object && !Array.isArray(obj))) {
    throw new Error('keyMirror(...): Argument must be an object.');
  }
  for (key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    ret[key] = key;
  }
  return ret;
};

module.exports = keyMirror;

},{}],"/Users/gregory_foster/data-eng/honeypot/node_modules/object-assign/index.js":[function(require,module,exports){
'use strict';
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function ToObject(val) {
	if (val == null) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function ownEnumerableKeys(obj) {
	var keys = Object.getOwnPropertyNames(obj);

	if (Object.getOwnPropertySymbols) {
		keys = keys.concat(Object.getOwnPropertySymbols(obj));
	}

	return keys.filter(function (key) {
		return propIsEnumerable.call(obj, key);
	});
}

module.exports = Object.assign || function (target, source) {
	var from;
	var keys;
	var to = ToObject(target);

	for (var s = 1; s < arguments.length; s++) {
		from = arguments[s];
		keys = ownEnumerableKeys(Object(from));

		for (var i = 0; i < keys.length; i++) {
			to[keys[i]] = from[keys[i]];
		}
	}

	return to;
};

},{}]},{},["/Users/gregory_foster/data-eng/honeypot/dev/scripts/app.jsx"])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZ3JlZ29yeV9mb3N0ZXIvZGF0YS1lbmcvaG9uZXlwb3QvZGV2L3NjcmlwdHMvYWN0aW9ucy9EZXRhaWxWaWV3QWN0aW9ucy5qcyIsIi9Vc2Vycy9ncmVnb3J5X2Zvc3Rlci9kYXRhLWVuZy9ob25leXBvdC9kZXYvc2NyaXB0cy9hY3Rpb25zL0ZpbHRlckFjdGlvbnMuanMiLCIvVXNlcnMvZ3JlZ29yeV9mb3N0ZXIvZGF0YS1lbmcvaG9uZXlwb3QvZGV2L3NjcmlwdHMvYXBwLmpzeCIsIi9Vc2Vycy9ncmVnb3J5X2Zvc3Rlci9kYXRhLWVuZy9ob25leXBvdC9kZXYvc2NyaXB0cy9jb25zdGFudHMvRGV0YWlsVmlld0NvbnN0YW50cy5qcyIsIi9Vc2Vycy9ncmVnb3J5X2Zvc3Rlci9kYXRhLWVuZy9ob25leXBvdC9kZXYvc2NyaXB0cy9jb25zdGFudHMvRmlsdGVyQ29uc3RhbnRzLmpzIiwiL1VzZXJzL2dyZWdvcnlfZm9zdGVyL2RhdGEtZW5nL2hvbmV5cG90L2Rldi9zY3JpcHRzL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlci5qcyIsIi9Vc2Vycy9ncmVnb3J5X2Zvc3Rlci9kYXRhLWVuZy9ob25leXBvdC9kZXYvc2NyaXB0cy9zdG9yZXMvRGV0YWlsVmlld1N0b3JlLmpzIiwiL1VzZXJzL2dyZWdvcnlfZm9zdGVyL2RhdGEtZW5nL2hvbmV5cG90L2Rldi9zY3JpcHRzL3N0b3Jlcy9GaWx0ZXJTdG9yZS5qcyIsIi9Vc2Vycy9ncmVnb3J5X2Zvc3Rlci9kYXRhLWVuZy9ob25leXBvdC9kZXYvc2NyaXB0cy91aS9DaGFydC5qc3giLCIvVXNlcnMvZ3JlZ29yeV9mb3N0ZXIvZGF0YS1lbmcvaG9uZXlwb3QvZGV2L3NjcmlwdHMvdWkvRGV0YWlsVGV4dC5qc3giLCIvVXNlcnMvZ3JlZ29yeV9mb3N0ZXIvZGF0YS1lbmcvaG9uZXlwb3QvZGV2L3NjcmlwdHMvdWkvRGV0YWlsVmlldy5qc3giLCIvVXNlcnMvZ3JlZ29yeV9mb3N0ZXIvZGF0YS1lbmcvaG9uZXlwb3QvZGV2L3NjcmlwdHMvdWkvRmlsdGVyQnV0dG9uLmpzeCIsIi9Vc2Vycy9ncmVnb3J5X2Zvc3Rlci9kYXRhLWVuZy9ob25leXBvdC9kZXYvc2NyaXB0cy91aS9GaWx0ZXJPcHRpb25Sb3cuanN4IiwiL1VzZXJzL2dyZWdvcnlfZm9zdGVyL2RhdGEtZW5nL2hvbmV5cG90L2Rldi9zY3JpcHRzL3VpL0ZpbHRlclJlc3VsdFJvdy5qc3giLCIvVXNlcnMvZ3JlZ29yeV9mb3N0ZXIvZGF0YS1lbmcvaG9uZXlwb3QvZGV2L3NjcmlwdHMvdWkvRmlsdGVyUmVzdWx0c1RhYmxlLmpzeCIsIi9Vc2Vycy9ncmVnb3J5X2Zvc3Rlci9kYXRhLWVuZy9ob25leXBvdC9kZXYvc2NyaXB0cy91aS9NZWFzdXJlUm93LmpzeCIsIi9Vc2Vycy9ncmVnb3J5X2Zvc3Rlci9kYXRhLWVuZy9ob25leXBvdC9kZXYvc2NyaXB0cy91aS9TZWFyY2hCb3guanN4IiwiL1VzZXJzL2dyZWdvcnlfZm9zdGVyL2RhdGEtZW5nL2hvbmV5cG90L2Rldi9zY3JpcHRzL3VpL1NpZGViYXIuanN4IiwiL1VzZXJzL2dyZWdvcnlfZm9zdGVyL2RhdGEtZW5nL2hvbmV5cG90L2Rldi9zY3JpcHRzL3VpL2QzQ2hhcnQuanMiLCJub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9mbHV4L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZsdXgvbGliL0Rpc3BhdGNoZXIuanMiLCJub2RlX21vZHVsZXMvZmx1eC9saWIvaW52YXJpYW50LmpzIiwibm9kZV9tb2R1bGVzL2tleW1pcnJvci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsd0JBQXdCOztBQUV4QixZQUFZLENBQUM7O0FBRWIsSUFBSSxhQUFh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QUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsWUFBWSxHQUFHLE9BQU8sQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUM7O0FBRWpOLEVBQUUsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVwRixFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxjQUFjLEdBQUcsT0FBTyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDcEc7O0VBRUUsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztJQUMxQyxPQUFPLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUNwQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztJQUNyQyxPQUFPLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4QyxHQUFHLENBQUMsQ0FBQztBQUNMOztFQUVFLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7SUFDMUMsT0FBTyxPQUFP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LE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDekI7OztBQ2xMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKmpzaGludCBlc25leHQ6IHRydWUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgQXBwRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcicpO1xudmFyIERldGFpbFZpZXdDb25zdGFudHMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvRGV0YWlsVmlld0NvbnN0YW50cycpO1xuXG52YXIgRGV0YWlsVmlld0FjdGlvbnMgPSB7XG5cbiAgdXBkYXRlTWVhc3VyZTogZnVuY3Rpb24gdXBkYXRlTWVhc3VyZShtZWFzdXJlKSB7XG4gICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgICBhY3Rpb25UeXBlOiBEZXRhaWxWaWV3Q29uc3RhbnRzLlVQREFURV9NRUFTVVJFLFxuICAgICAgbWVhc3VyZTogbWVhc3VyZVxuICAgIH0pO1xuICB9LFxuXG4gIHVwZGF0ZURhdGE6IGZ1bmN0aW9uIHVwZGF0ZURhdGEoKSB7XG4gICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgICBhY3Rpb25UeXBlOiBEZXRhaWxWaWV3Q29uc3RhbnRzLlVQREFURV9EQVRBXG4gICAgfSk7XG4gIH0sXG5cbiAgdXBkYXRlRGV0YWlsVmlldzogZnVuY3Rpb24gdXBkYXRlRGV0YWlsVmlldyhkYWcsIG5hbWUpIHtcbiAgICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICAgIGFjdGlvblR5cGU6IERldGFpbFZpZXdDb25zdGFudHMuVVBEQVRFX0RFVEFJTF9WSUVXLFxuICAgICAgZGFnOiBkYWcsXG4gICAgICBuYW1lOiBuYW1lXG4gICAgfSk7XG4gIH0sXG5cbiAgdXBkYXRlRm9jdXNEYXRhOiBmdW5jdGlvbiB1cGRhdGVGb2N1c0RhdGEoZGF0ZSwgdmFsdWUpIHtcbiAgICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICAgIGFjdGlvblR5cGU6IERldGFpbFZpZXdDb25zdGFudHMuVVBEQVRFX0ZPQ1VTX0RBVEEsXG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBkYXRlOiBkYXRlXG4gICAgfSk7XG4gIH0sXG5cbiAgdXBkYXRlRGFnOiBmdW5jdGlvbiB1cGRhdGVEYWcoZGFnKSB7XG4gICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgICBhY3Rpb25UeXBlOiBEZXRhaWxWaWV3Q29uc3RhbnRzLlVQREFURV9EQUcsXG4gICAgICBkYWc6IGRhZ1xuICAgIH0pO1xuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRGV0YWlsVmlld0FjdGlvbnM7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTluY21WbmIzSjVYMlp2YzNSbGNpOWtZWFJoTFdWdVp5OW9iMjVsZVhCdmRDOWtaWFl2YzJOeWFYQjBjeTloWTNScGIyNXpMMFJsZEdGcGJGWnBaWGRCWTNScGIyNXpMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN1FVRkZRU3hKUVVGTkxHRkJRV0VzUjBGQlJ5eFBRVUZQTEVOQlFVTXNOa0pCUVRaQ0xFTkJRVU1zUTBGQlF6dEJRVU0zUkN4SlFVRk5MRzFDUVVGdFFpeEhRVUZITEU5QlFVOHNRMEZCUXl4clEwRkJhME1zUTBGQlF5eERRVUZET3p0QlFVVjRSU3hKUVVGTkxHbENRVUZwUWl4SFFVRkhPenRCUVVWNFFpeGxRVUZoTEVWQlFVVXNkVUpCUVZNc1QwRkJUeXhGUVVGRk8wRkJReTlDTEdsQ1FVRmhMRU5CUVVNc1VVRkJVU3hEUVVGRE8wRkJRM0pDTEdkQ1FVRlZMRVZCUVVVc2JVSkJRVzFDTEVOQlFVTXNZMEZCWXp0QlFVTTVReXhoUVVGUExFVkJRVVVzVDBGQlR6dExRVU5xUWl4RFFVRkRMRU5CUVVNN1IwRkRTanM3UVVGRlJDeFpRVUZWTEVWQlFVVXNjMEpCUVZjN1FVRkRja0lzYVVKQlFXRXNRMEZCUXl4UlFVRlJMRU5CUVVNN1FVRkRja0lzWjBKQlFWVXNSVUZCUlN4dFFrRkJiVUlzUTBGQlF5eFhRVUZYTzB0QlF6VkRMRU5CUVVNc1EwRkJRenRIUVVOS096dEJRVVZFTEd0Q1FVRm5RaXhGUVVGRkxEQkNRVUZUTEVkQlFVY3NSVUZCUXl4SlFVRkpMRVZCUVVVN1FVRkRia01zYVVKQlFXRXNRMEZCUXl4UlFVRlJMRU5CUVVNN1FVRkRja0lzWjBKQlFWVXNSVUZCUlN4dFFrRkJiVUlzUTBGQlF5eHJRa0ZCYTBJN1FVRkRiRVFzVTBGQlJ5eEZRVUZGTEVkQlFVYzdRVUZEVWl4VlFVRkpMRVZCUVVVc1NVRkJTVHRMUVVOWUxFTkJRVU1zUTBGQlF6dEhRVU5LT3p0QlFVVkVMR2xDUVVGbExFVkJRVVVzZVVKQlFWTXNTVUZCU1N4RlFVRkRMRXRCUVVzc1JVRkJSVHRCUVVOd1F5eHBRa0ZCWVN4RFFVRkRMRkZCUVZFc1EwRkJRenRCUVVOeVFpeG5Ra0ZCVlN4RlFVRkZMRzFDUVVGdFFpeERRVUZETEdsQ1FVRnBRanRCUVVOcVJDeFhRVUZMTEVWQlFVVXNTMEZCU3p0QlFVTmFMRlZCUVVrc1JVRkJSU3hKUVVGSk8wdEJRMWdzUTBGQlF5eERRVUZETzBkQlEwbzdPMEZCUlVRc1YwRkJVeXhGUVVGRkxHMUNRVUZUTEVkQlFVY3NSVUZCUlR0QlFVTjJRaXhwUWtGQllTeERRVUZETEZGQlFWRXNRMEZCUXp0QlFVTnlRaXhuUWtGQlZTeEZRVUZGTEcxQ1FVRnRRaXhEUVVGRExGVkJRVlU3UVVGRE1VTXNVMEZCUnl4RlFVRkZMRWRCUVVjN1MwRkRWQ3hEUVVGRExFTkJRVU03UjBGRFNqczdRMEZGUml4RFFVRkRPenRCUVVWR0xFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NhVUpCUVdsQ0xFTkJRVU1pTENKbWFXeGxJam9pTDFWelpYSnpMMmR5WldkdmNubGZabTl6ZEdWeUwyUmhkR0V0Wlc1bkwyaHZibVY1Y0c5MEwyUmxkaTl6WTNKcGNIUnpMMkZqZEdsdmJuTXZSR1YwWVdsc1ZtbGxkMEZqZEdsdmJuTXVhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdkttcHphR2x1ZENCbGMyNWxlSFE2SUhSeWRXVWdLaTljYmx4dVkyOXVjM1FnUVhCd1JHbHpjR0YwWTJobGNpQTlJSEpsY1hWcGNtVW9KeTR1TDJScGMzQmhkR05vWlhJdlFYQndSR2x6Y0dGMFkyaGxjaWNwTzF4dVkyOXVjM1FnUkdWMFlXbHNWbWxsZDBOdmJuTjBZVzUwY3lBOUlISmxjWFZwY21Vb0p5NHVMMk52Ym5OMFlXNTBjeTlFWlhSaGFXeFdhV1YzUTI5dWMzUmhiblJ6SnlrN1hHNWNibU52Ym5OMElFUmxkR0ZwYkZacFpYZEJZM1JwYjI1eklEMGdlMXh1WEc0Z0lIVndaR0YwWlUxbFlYTjFjbVU2SUdaMWJtTjBhVzl1S0cxbFlYTjFjbVVwSUh0Y2JpQWdJQ0JCY0hCRWFYTndZWFJqYUdWeUxtUnBjM0JoZEdOb0tIdGNiaUFnSUNBZ0lHRmpkR2x2YmxSNWNHVTZJRVJsZEdGcGJGWnBaWGREYjI1emRHRnVkSE11VlZCRVFWUkZYMDFGUVZOVlVrVXNYRzRnSUNBZ0lDQnRaV0Z6ZFhKbE9pQnRaV0Z6ZFhKbExGeHVJQ0FnSUgwcE8xeHVJQ0I5TEZ4dVhHNGdJSFZ3WkdGMFpVUmhkR0U2SUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0FnSUVGd2NFUnBjM0JoZEdOb1pYSXVaR2x6Y0dGMFkyZ29lMXh1SUNBZ0lDQWdZV04wYVc5dVZIbHdaVG9nUkdWMFlXbHNWbWxsZDBOdmJuTjBZVzUwY3k1VlVFUkJWRVZmUkVGVVFWeHVJQ0FnSUgwcE8xeHVJQ0I5TEZ4dVhHNGdJSFZ3WkdGMFpVUmxkR0ZwYkZacFpYYzZJR1oxYm1OMGFXOXVLR1JoWnl4dVlXMWxLU0I3WEc0Z0lDQWdRWEJ3UkdsemNHRjBZMmhsY2k1a2FYTndZWFJqYUNoN1hHNGdJQ0FnSUNCaFkzUnBiMjVVZVhCbE9pQkVaWFJoYVd4V2FXVjNRMjl1YzNSaGJuUnpMbFZRUkVGVVJWOUVSVlJCU1V4ZlZrbEZWeXhjYmlBZ0lDQWdJR1JoWnpvZ1pHRm5MRnh1SUNBZ0lDQWdibUZ0WlRvZ2JtRnRaVnh1SUNBZ0lIMHBPMXh1SUNCOUxGeHVJQ0JjYmlBZ2RYQmtZWFJsUm05amRYTkVZWFJoT2lCbWRXNWpkR2x2Ymloa1lYUmxMSFpoYkhWbEtTQjdYRzRnSUNBZ1FYQndSR2x6Y0dGMFkyaGxjaTVrYVhOd1lYUmphQ2g3WEc0Z0lDQWdJQ0JoWTNScGIyNVVlWEJsT2lCRVpYUmhhV3hXYVdWM1EyOXVjM1JoYm5SekxsVlFSRUZVUlY5R1QwTlZVMTlFUVZSQkxGeHVJQ0FnSUNBZ2RtRnNkV1U2SUhaaGJIVmxMRnh1SUNBZ0lDQWdaR0YwWlRvZ1pHRjBaU0JjYmlBZ0lDQjlLVHRjYmlBZ2ZTeGNibHh1SUNCMWNHUmhkR1ZFWVdjNklHWjFibU4wYVc5dUtHUmhaeWtnZTF4dUlDQWdJRUZ3Y0VScGMzQmhkR05vWlhJdVpHbHpjR0YwWTJnb2UxeHVJQ0FnSUNBZ1lXTjBhVzl1Vkhsd1pUb2dSR1YwWVdsc1ZtbGxkME52Ym5OMFlXNTBjeTVWVUVSQlZFVmZSRUZITEZ4dUlDQWdJQ0FnWkdGbk9pQmtZV2RjYmlBZ0lDQjlLVHRjYmlBZ2ZWeHVYRzU5TzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlFUmxkR0ZwYkZacFpYZEJZM1JwYjI1ek8xeHVJbDE5IiwiLypqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIEFwcERpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInKTtcbnZhciBGaWx0ZXJDb25zdGFudHMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvRmlsdGVyQ29uc3RhbnRzJyk7XG5cbnZhciBGaWx0ZXJBY3Rpb25zID0ge1xuXG4gIHVwZGF0ZUZpbHRlcjogZnVuY3Rpb24gdXBkYXRlRmlsdGVyKGtleSwgdmFsdWUpIHtcbiAgICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICAgIGFjdGlvblR5cGU6IEZpbHRlckNvbnN0YW50cy5VUERBVEVfRklMVEVSLFxuICAgICAga2V5OiBrZXksXG4gICAgICB2YWx1ZTogdmFsdWVcbiAgICB9KTtcbiAgfSxcblxuICB1cGRhdGVTZWFyY2g6IGZ1bmN0aW9uIHVwZGF0ZVNlYXJjaChzZWFyY2hGaWx0ZXIpIHtcbiAgICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICAgIGFjdGlvblR5cGU6IEZpbHRlckNvbnN0YW50cy5VUERBVEVfU0VBUkNILFxuICAgICAgc2VhcmNoRmlsdGVyOiBzZWFyY2hGaWx0ZXJcbiAgICB9KTtcbiAgfVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZpbHRlckFjdGlvbnM7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTluY21WbmIzSjVYMlp2YzNSbGNpOWtZWFJoTFdWdVp5OW9iMjVsZVhCdmRDOWtaWFl2YzJOeWFYQjBjeTloWTNScGIyNXpMMFpwYkhSbGNrRmpkR2x2Ym5NdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqczdPenRCUVVWQkxFbEJRVTBzWVVGQllTeEhRVUZITEU5QlFVOHNRMEZCUXl3MlFrRkJOa0lzUTBGQlF5eERRVUZETzBGQlF6ZEVMRWxCUVUwc1pVRkJaU3hIUVVGSExFOUJRVThzUTBGQlF5dzRRa0ZCT0VJc1EwRkJReXhEUVVGRE96dEJRVVZvUlN4SlFVRk5MR0ZCUVdFc1IwRkJSenM3UVVGRmNFSXNZMEZCV1N4RlFVRkZMSE5DUVVGVExFZEJRVWNzUlVGQlF5eExRVUZMTEVWQlFVVTdRVUZEYUVNc2FVSkJRV0VzUTBGQlF5eFJRVUZSTEVOQlFVTTdRVUZEY2tJc1owSkJRVlVzUlVGQlJTeGxRVUZsTEVOQlFVTXNZVUZCWVR0QlFVTjZReXhUUVVGSExFVkJRVVVzUjBGQlJ6dEJRVU5TTEZkQlFVc3NSVUZCUlN4TFFVRkxPMHRCUTJJc1EwRkJReXhEUVVGRE8wZEJRMG83TzBGQlJVUXNZMEZCV1N4RlFVRkZMSE5DUVVGVExGbEJRVmtzUlVGQlJUdEJRVU51UXl4cFFrRkJZU3hEUVVGRExGRkJRVkVzUTBGQlF6dEJRVU55UWl4blFrRkJWU3hGUVVGRkxHVkJRV1VzUTBGQlF5eGhRVUZoTzBGQlEzcERMR3RDUVVGWkxFVkJRVVVzV1VGQldUdExRVU16UWl4RFFVRkRMRU5CUVVNN1IwRkRTanM3UTBGRlJpeERRVUZET3p0QlFVVkdMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzWVVGQllTeERRVUZESWl3aVptbHNaU0k2SWk5VmMyVnljeTluY21WbmIzSjVYMlp2YzNSbGNpOWtZWFJoTFdWdVp5OW9iMjVsZVhCdmRDOWtaWFl2YzJOeWFYQjBjeTloWTNScGIyNXpMMFpwYkhSbGNrRmpkR2x2Ym5NdWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2S21wemFHbHVkQ0JsYzI1bGVIUTZJSFJ5ZFdVZ0tpOWNibHh1WTI5dWMzUWdRWEJ3UkdsemNHRjBZMmhsY2lBOUlISmxjWFZwY21Vb0p5NHVMMlJwYzNCaGRHTm9aWEl2UVhCd1JHbHpjR0YwWTJobGNpY3BPMXh1WTI5dWMzUWdSbWxzZEdWeVEyOXVjM1JoYm5SeklEMGdjbVZ4ZFdseVpTZ25MaTR2WTI5dWMzUmhiblJ6TDBacGJIUmxja052Ym5OMFlXNTBjeWNwTzF4dVhHNWpiMjV6ZENCR2FXeDBaWEpCWTNScGIyNXpJRDBnZTF4dVhHNGdJSFZ3WkdGMFpVWnBiSFJsY2pvZ1puVnVZM1JwYjI0b2EyVjVMSFpoYkhWbEtTQjdYRzRnSUNBZ1FYQndSR2x6Y0dGMFkyaGxjaTVrYVhOd1lYUmphQ2g3WEc0Z0lDQWdJQ0JoWTNScGIyNVVlWEJsT2lCR2FXeDBaWEpEYjI1emRHRnVkSE11VlZCRVFWUkZYMFpKVEZSRlVpeGNiaUFnSUNBZ0lHdGxlVG9nYTJWNUxGeHVJQ0FnSUNBZ2RtRnNkV1U2SUhaaGJIVmxYRzRnSUNBZ2ZTazdYRzRnSUgwc1hHNWNiaUFnZFhCa1lYUmxVMlZoY21Ob09pQm1kVzVqZEdsdmJpaHpaV0Z5WTJoR2FXeDBaWElwSUh0Y2JpQWdJQ0JCY0hCRWFYTndZWFJqYUdWeUxtUnBjM0JoZEdOb0tIdGNiaUFnSUNBZ0lHRmpkR2x2YmxSNWNHVTZJRVpwYkhSbGNrTnZibk4wWVc1MGN5NVZVRVJCVkVWZlUwVkJVa05JTEZ4dUlDQWdJQ0FnYzJWaGNtTm9SbWxzZEdWeU9pQnpaV0Z5WTJoR2FXeDBaWEpjYmlBZ0lDQjlLVHRjYmlBZ2ZTeGNibHh1ZlR0Y2JseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQkdhV3gwWlhKQlkzUnBiMjV6TzF4dUlsMTkiLCIvKmpzaGludCBlc25leHQ6IHRydWUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgU2lkZWJhciA9IHJlcXVpcmUoJy4vdWkvU2lkZWJhci5qc3gnKTtcbnZhciBEZXRhaWxWaWV3ID0gcmVxdWlyZSgnLi91aS9EZXRhaWxWaWV3LmpzeCcpO1xudmFyIERldGFpbFRleHQgPSByZXF1aXJlKCcuL3VpL0RldGFpbFRleHQuanN4Jyk7XG5cblJlYWN0LnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAnZGl2JyxcbiAgbnVsbCxcbiAgUmVhY3QuY3JlYXRlRWxlbWVudChTaWRlYmFyLCBudWxsKSxcbiAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAnZGl2JyxcbiAgICB7IGNsYXNzTmFtZTogJ2RldGFpbENvbHVtbicgfSxcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KERldGFpbFRleHQsIG51bGwpLFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRGV0YWlsVmlldywgbnVsbClcbiAgKVxuKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dyYXAnKSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTluY21WbmIzSjVYMlp2YzNSbGNpOWtZWFJoTFdWdVp5OW9iMjVsZVhCdmRDOWtaWFl2YzJOeWFYQjBjeTloY0hBdWFuTjRJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdPenM3UVVGRlFTeEpRVUZOTEU5QlFVOHNSMEZCUnl4UFFVRlBMRU5CUVVNc2EwSkJRV3RDTEVOQlFVTXNRMEZCUXp0QlFVTTFReXhKUVVGTkxGVkJRVlVzUjBGQlJ5eFBRVUZQTEVOQlFVTXNjVUpCUVhGQ0xFTkJRVU1zUTBGQlF6dEJRVU5zUkN4SlFVRk5MRlZCUVZVc1IwRkJSeXhQUVVGUExFTkJRVU1zY1VKQlFYRkNMRU5CUVVNc1EwRkJRenM3UVVGRmJFUXNTMEZCU3l4RFFVRkRMRTFCUVUwc1EwRkRWanM3TzBWQlEwVXNiMEpCUVVNc1QwRkJUeXhQUVVGSE8wVkJRMWc3TzAxQlFVc3NVMEZCVXl4RlFVRkRMR05CUVdNN1NVRkRNMElzYjBKQlFVTXNWVUZCVlN4UFFVRkhPMGxCUTJRc2IwSkJRVU1zVlVGQlZTeFBRVUZITzBkQlExWTdRMEZEUml4RlFVTk9MRkZCUVZFc1EwRkJReXhqUVVGakxFTkJRVU1zVFVGQlRTeERRVUZETEVOQlEyaERMRU5CUVVNaUxDSm1hV3hsSWpvaUwxVnpaWEp6TDJkeVpXZHZjbmxmWm05emRHVnlMMlJoZEdFdFpXNW5MMmh2Ym1WNWNHOTBMMlJsZGk5elkzSnBjSFJ6TDJGd2NDNXFjM2dpTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdkttcHphR2x1ZENCbGMyNWxlSFE2SUhSeWRXVWdLaTljYmx4dVkyOXVjM1FnVTJsa1pXSmhjaUE5SUhKbGNYVnBjbVVvSnk0dmRXa3ZVMmxrWldKaGNpNXFjM2duS1R0Y2JtTnZibk4wSUVSbGRHRnBiRlpwWlhjZ1BTQnlaWEYxYVhKbEtDY3VMM1ZwTDBSbGRHRnBiRlpwWlhjdWFuTjRKeWs3WEc1amIyNXpkQ0JFWlhSaGFXeFVaWGgwSUQwZ2NtVnhkV2x5WlNnbkxpOTFhUzlFWlhSaGFXeFVaWGgwTG1wemVDY3BPMXh1WEc1U1pXRmpkQzV5Wlc1a1pYSW9YRzRnSUR4a2FYWStYRzRnSUNBZ1BGTnBaR1ZpWVhJZ0x6NWNiaUFnSUNBOFpHbDJJR05zWVhOelRtRnRaVDBuWkdWMFlXbHNRMjlzZFcxdUp6NWNiaUFnSUNBZ0lEeEVaWFJoYVd4VVpYaDBJQzgrWEc0Z0lDQWdJQ0E4UkdWMFlXbHNWbWxsZHlBdlBseHVJQ0FnSUR3dlpHbDJQbHh1SUNBOEwyUnBkajRzWEc0Z0lHUnZZM1Z0Wlc1MExtZGxkRVZzWlcxbGJuUkNlVWxrS0NkM2NtRndKeWxjYmlrN1hHNGlYWDA9IiwiLypqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGtleU1pcnJvciA9IHJlcXVpcmUoJ2tleW1pcnJvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtleU1pcnJvcih7XG4gIFVQREFURV9NRUFTVVJFOiBudWxsLFxuICBVUERBVEVfREFUQTogbnVsbCxcbiAgVVBEQVRFX0RFVEFJTF9WSUVXOiBudWxsLFxuICBVUERBVEVfRk9DVVNfREFUQTogbnVsbCxcbiAgVVBEQVRFX0RBRzogbnVsbFxufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTluY21WbmIzSjVYMlp2YzNSbGNpOWtZWFJoTFdWdVp5OW9iMjVsZVhCdmRDOWtaWFl2YzJOeWFYQjBjeTlqYjI1emRHRnVkSE12UkdWMFlXbHNWbWxsZDBOdmJuTjBZVzUwY3k1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPMEZCUlVFc1NVRkJUU3hUUVVGVExFZEJRVWNzVDBGQlR5eERRVUZETEZkQlFWY3NRMEZCUXl4RFFVRkRPenRCUVVWMlF5eE5RVUZOTEVOQlFVTXNUMEZCVHl4SFFVRkhMRk5CUVZNc1EwRkJRenRCUVVONlFpeG5Ra0ZCWXl4RlFVRkZMRWxCUVVrN1FVRkRjRUlzWVVGQlZ5eEZRVUZGTEVsQlFVazdRVUZEYWtJc2IwSkJRV3RDTEVWQlFVVXNTVUZCU1R0QlFVTjRRaXh0UWtGQmFVSXNSVUZCUlN4SlFVRkpPMEZCUTNaQ0xGbEJRVlVzUlVGQlJTeEpRVUZKTzBOQlEycENMRU5CUVVNc1EwRkJReUlzSW1acGJHVWlPaUl2VlhObGNuTXZaM0psWjI5eWVWOW1iM04wWlhJdlpHRjBZUzFsYm1jdmFHOXVaWGx3YjNRdlpHVjJMM05qY21sd2RITXZZMjl1YzNSaGJuUnpMMFJsZEdGcGJGWnBaWGREYjI1emRHRnVkSE11YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZLbXB6YUdsdWRDQmxjMjVsZUhRNklIUnlkV1VnS2k5Y2JseHVZMjl1YzNRZ2EyVjVUV2x5Y205eUlEMGdjbVZ4ZFdseVpTZ25hMlY1YldseWNtOXlKeWs3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ2EyVjVUV2x5Y205eUtIdGNiaUFnVlZCRVFWUkZYMDFGUVZOVlVrVTZJRzUxYkd3c1hHNGdJRlZRUkVGVVJWOUVRVlJCT2lCdWRXeHNMRnh1SUNCVlVFUkJWRVZmUkVWVVFVbE1YMVpKUlZjNklHNTFiR3dzWEc0Z0lGVlFSRUZVUlY5R1QwTlZVMTlFUVZSQk9pQnVkV3hzTEZ4dUlDQlZVRVJCVkVWZlJFRkhPaUJ1ZFd4c0xGeHVmU2s3WEc0aVhYMD0iLCIvKmpzaGludCBlc25leHQ6IHRydWUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIga2V5TWlycm9yID0gcmVxdWlyZSgna2V5bWlycm9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5TWlycm9yKHtcbiAgVVBEQVRFX0ZJTFRFUjogbnVsbCxcbiAgVVBEQVRFX1NFQVJDSDogbnVsbFxufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTluY21WbmIzSjVYMlp2YzNSbGNpOWtZWFJoTFdWdVp5OW9iMjVsZVhCdmRDOWtaWFl2YzJOeWFYQjBjeTlqYjI1emRHRnVkSE12Um1sc2RHVnlRMjl1YzNSaGJuUnpMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN1FVRkZRU3hKUVVGTkxGTkJRVk1zUjBGQlJ5eFBRVUZQTEVOQlFVTXNWMEZCVnl4RFFVRkRMRU5CUVVNN08wRkJSWFpETEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1UwRkJVeXhEUVVGRE8wRkJRM3BDTEdWQlFXRXNSVUZCUlN4SlFVRkpPMEZCUTI1Q0xHVkJRV0VzUlVGQlJTeEpRVUZKTzBOQlEzQkNMRU5CUVVNc1EwRkJReUlzSW1acGJHVWlPaUl2VlhObGNuTXZaM0psWjI5eWVWOW1iM04wWlhJdlpHRjBZUzFsYm1jdmFHOXVaWGx3YjNRdlpHVjJMM05qY21sd2RITXZZMjl1YzNSaGJuUnpMMFpwYkhSbGNrTnZibk4wWVc1MGN5NXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWk4cWFuTm9hVzUwSUdWemJtVjRkRG9nZEhKMVpTQXFMMXh1WEc1amIyNXpkQ0JyWlhsTmFYSnliM0lnUFNCeVpYRjFhWEpsS0NkclpYbHRhWEp5YjNJbktUdGNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JyWlhsTmFYSnliM0lvZTF4dUlDQlZVRVJCVkVWZlJrbE1WRVZTT2lCdWRXeHNMRnh1SUNCVlVFUkJWRVZmVTBWQlVrTklPaUJ1ZFd4c0xGeHVmU2s3WEc0aVhYMD0iLCIvKmpzaGludCBlc25leHQ6IHRydWUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgRGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2ZsdXgnKS5EaXNwYXRjaGVyO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBEaXNwYXRjaGVyKCk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTluY21WbmIzSjVYMlp2YzNSbGNpOWtZWFJoTFdWdVp5OW9iMjVsZVhCdmRDOWtaWFl2YzJOeWFYQjBjeTlrYVhOd1lYUmphR1Z5TDBGd2NFUnBjM0JoZEdOb1pYSXVhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanM3T3p0QlFVVkJMRWxCUVUwc1ZVRkJWU3hIUVVGSExFOUJRVThzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXl4VlFVRlZMRU5CUVVNN08wRkJSVGxETEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1NVRkJTU3hWUVVGVkxFVkJRVVVzUTBGQlF5SXNJbVpwYkdVaU9pSXZWWE5sY25NdlozSmxaMjl5ZVY5bWIzTjBaWEl2WkdGMFlTMWxibWN2YUc5dVpYbHdiM1F2WkdWMkwzTmpjbWx3ZEhNdlpHbHpjR0YwWTJobGNpOUJjSEJFYVhOd1lYUmphR1Z5TG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lMeXBxYzJocGJuUWdaWE51WlhoME9pQjBjblZsSUNvdlhHNWNibU52Ym5OMElFUnBjM0JoZEdOb1pYSWdQU0J5WlhGMWFYSmxLQ2RtYkhWNEp5a3VSR2x6Y0dGMFkyaGxjanRjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCdVpYY2dSR2x6Y0dGMFkyaGxjaWdwTzF4dUlsMTkiLCIvLyBEZXRhaWxWaWV3U3RvcmUuanNcbi8vIFRoZSBmbHV4IGRhdGFzdG9yZSBmb3IgdGhlIGVudGlyZSBkZXRhaWwgdmlld1xuLypqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIEFwcERpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInKTtcbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG52YXIgRGV0YWlsVmlld0NvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9EZXRhaWxWaWV3Q29uc3RhbnRzJyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xuXG52YXIgTUVBU1VSRV9DSEFOR0VfRVZFTlQgPSAnbWVhc3VyZV9jaGFuZ2UnO1xudmFyIERBVEFfVVBEQVRFX0VWRU5UID0gJ2RhdGFfdXBkYXRlJztcbnZhciBERVRBSUxTX1VQREFURV9FVkVOVCA9ICdkZXRhaWxzX3VwZGF0ZSc7XG52YXIgRk9DVVNfVVBEQVRFX0VWRU5UID0gJ2ZvY3VzX3VwZGF0ZSc7XG5cbnZhciBfc3RvcmUgPSB7XG4gIG1lYXN1cmU6ICdpbycsIC8vIFRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgbWVhc3VyZSBmb3IgdGhlIGdyYXBoXG4gIGRhZzogbnVsbCwgLy8gVGhlIGN1cnJlbnRseSBzZWxlY3RlZCBEQUdcbiAgbmFtZTogJ1NlbGVjdCBhIERBRyBvciBUYXNrJywgLy8gVGhlIGlkIChuYW1lKSBvZiB0aGUgdGhpbmcgYmVpbmcgdmlld2VkXG4gIG93bmVyOiAnb3duZXInLCAvLyB0aGUgb3duZXIgb2YgdGhlIHRoaW5nIGJlaW5nIHZpZXdlZFxuICBmb2N1c1ZhbHVlOiAwLCAvLyBUaGUgdmFsdWUgb2Ygd2hhdGV2ZXIgaXMgYmVpbmcgbW91c2VkIG92ZXIgb24gdGhlIGdyYXBoXG4gIGZvY3VzRGF0ZTogMCwgLy8gVGhlIGRhdGUgb2YgdGhlIHBvaW50IGN1cnJlbnRseSBtb3VzZWQgb3ZlciBvbiB0aGUgZ3JhcGhcbiAgZGF0YTogW10gfTtcblxuLy8gRmlyZXMgb2YgYW4gQWpheCBnZXQgcmVxdWVzdCB0byB0aGUgc2VydmVyIHRvIGdldCB2YWx1ZXMgYW5kIGRhdGVzIGZvciBncmFwaFxuLy8gVGhlIHJvd3MgcmV0cmlldmVkIGZyb20gdGhlIHNlcnZlciB3aXRoIHZhbHVlcyBhbmQgZGF0ZXNcbmZ1bmN0aW9uIHVwZGF0ZURhdGEoKSB7XG4gICQuZ2V0SlNPTih3aW5kb3cubG9jYXRpb24gKyAnZGF0YScsIHtcbiAgICBtZWFzdXJlOiBfc3RvcmUubWVhc3VyZSxcbiAgICBkYWc6IF9zdG9yZS5kYWcsXG4gICAgaWQ6IF9zdG9yZS5pZFxuICB9LCBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBhcnJheSA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBkYXRhKSB7XG4gICAgICBhcnJheS5wdXNoKHsgdmFsdWU6IGRhdGFba2V5XS52YWx1ZSwgZGF0ZTogbmV3IERhdGUoZGF0YVtrZXldLmRzKSB9KTtcbiAgICB9XG4gICAgX3N0b3JlLmRhdGEgPSBhcnJheTtcbiAgICBfc3RvcmUudXBkYXRpbmcgPSBmYWxzZTtcbiAgICBEZXRhaWxWaWV3U3RvcmUuZW1pdChEQVRBX1VQREFURV9FVkVOVCk7XG4gIH0pO1xufVxuXG4vLyBGaXJlcyBvZiBhbiBBamF4IGdldCByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgdG8gZ2V0IG1ldGFkYXRhIG9uIGN1cnJlbnQgdGhpbmdcbmZ1bmN0aW9uIHVwZGF0ZURldGFpbHMoKSB7XG4gICQuZ2V0SlNPTih3aW5kb3cubG9jYXRpb24gKyAnZGV0YWlscycsIHtcbiAgICBkYWc6IF9zdG9yZS5kYWcsXG4gICAgaWQ6IF9zdG9yZS5pZFxuICB9LCBmdW5jdGlvbiAoZGF0YSkge1xuICAgIGlmIChkYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgIF9zdG9yZS5vd25lciA9IGRhdGFbMF0ub3duZXI7XG4gICAgfVxuICAgIERldGFpbFZpZXdTdG9yZS5lbWl0KERFVEFJTFNfVVBEQVRFX0VWRU5UKTtcbiAgfSk7XG59XG5cbnZhciBEZXRhaWxWaWV3U3RvcmUgPSBhc3NpZ24oe30sIEV2ZW50RW1pdHRlci5wcm90b3R5cGUsIHtcblxuICAvLyBMaXN0ZW5lciBmb3Igd2hlbiBtb3VzZSBtb3Zlc1xuICBhZGRGb2N1c1VwZGF0ZUxpc3RlbmVyOiBmdW5jdGlvbiBhZGRGb2N1c1VwZGF0ZUxpc3RlbmVyKGNiKSB7XG4gICAgdGhpcy5vbihGT0NVU19VUERBVEVfRVZFTlQsIGNiKTtcbiAgfSxcblxuICByZW1vdmVGb2N1c1VwZGF0ZUxpc3RlbmVyOiBmdW5jdGlvbiByZW1vdmVGb2N1c1VwZGF0ZUxpc3RlbmVyKGNiKSB7XG4gICAgdGhpcy5vbihGT0NVU19VUERBVEVfRVZFTlQsIGNiKTtcbiAgfSxcblxuICAvLyBMaXN0ZW5lciBmb3Igd2hlbiB0aGluZyBtZXRhZGF0YSBjaGFuZ2VzXG4gIGFkZERldGFpbFVwZGF0ZUxpc3RlbmVyOiBmdW5jdGlvbiBhZGREZXRhaWxVcGRhdGVMaXN0ZW5lcihjYikge1xuICAgIHRoaXMub24oREVUQUlMU19VUERBVEVfRVZFTlQsIGNiKTtcbiAgfSxcblxuICByZW1vdmVEZXRhaWxVcGRhdGVMaXN0ZW5lcjogZnVuY3Rpb24gcmVtb3ZlRGV0YWlsVXBkYXRlTGlzdGVuZXIoY2IpIHtcbiAgICB0aGlzLm9uKERFVEFJTFNfVVBEQVRFX0VWRU5ULCBjYik7XG4gIH0sXG5cbiAgLy8gTGlzdGVuZXIgZm9yIHdoZW4gZGF0YSB2YWx1ZXMgYW5kIGRhdGVzIGNoYW5nZVxuICBhZGREYXRhVXBkYXRlTGlzdGVuZXI6IGZ1bmN0aW9uIGFkZERhdGFVcGRhdGVMaXN0ZW5lcihjYikge1xuICAgIHRoaXMub24oREFUQV9VUERBVEVfRVZFTlQsIGNiKTtcbiAgfSxcblxuICByZW1vdmVEYXRhVXBkYXRlTGlzdGVuZXI6IGZ1bmN0aW9uIHJlbW92ZURhdGFVcGRhdGVMaXN0ZW5lcihjYikge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoREFUQV9VUERBVEVfRVZFTlQsIGNiKTtcbiAgfSxcblxuICAvLyBMaXN0ZW5lciBmb3Igd2hlbiB1c2VyIHNlbGVjdHMgYSBkaWZmZXJlbnQgbWVhc3VyZVxuICBhZGRNZWFzdXJlQ2hhbmdlTGlzdGVuZXI6IGZ1bmN0aW9uIGFkZE1lYXN1cmVDaGFuZ2VMaXN0ZW5lcihjYikge1xuICAgIHRoaXMub24oTUVBU1VSRV9DSEFOR0VfRVZFTlQsIGNiKTtcbiAgfSxcblxuICByZW1vdmVNZWFzdXJlQ2hhbmdlTGlzdGVuZXI6IGZ1bmN0aW9uIHJlbW92ZU1lYXN1cmVDaGFuZ2VMaXN0ZW5lcihjYikge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoTUVBU1VSRV9DSEFOR0VfRVZFTlQsIGNiKTtcbiAgfSxcblxuICAvLyBHZXR0ZXIgbWV0aG9kIGZvciBkYXRhIHRoYXQgY3JlYXRlcyBmZXRjaCBpZiBuZWVkIGJlXG4gIGdldERhdGE6IGZ1bmN0aW9uIGdldERhdGEoKSB7XG4gICAgcmV0dXJuIF9zdG9yZS5kYXRhO1xuICB9LFxuXG4gIC8vIEdldHRlciBtZXRob2QgZm9yIGRldGFpbHMgdGhhdCBjcmVhdGVzIGZldGNoIGlmIG5lZWQgYmVcbiAgZ2V0RGV0YWlsczogZnVuY3Rpb24gZ2V0RGV0YWlscygpIHtcbiAgICB2YXIgbmFtZSA9IF9zdG9yZS5pZDtcbiAgICBpZiAoX3N0b3JlLmRhZyAhPT0gX3N0b3JlLmlkKSB7XG4gICAgICBuYW1lID0gX3N0b3JlLmRhZyArICcuJyArIF9zdG9yZS5pZDtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICBvd25lcjogX3N0b3JlLm93bmVyXG4gICAgfTtcbiAgfSxcblxuICAvLyBHZXR0ZXIgbWV0aG9kIHRvIGdldCBjdXJyZW50IG1vdXNlb3ZlciB2YWx1ZXNcbiAgZ2V0Rm9jdXNEYXRlOiBmdW5jdGlvbiBnZXRGb2N1c0RhdGUoKSB7XG4gICAgcmV0dXJuIF9zdG9yZS5mb2N1c0RhdGU7XG4gIH0sXG5cbiAgZ2V0Rm9jdXNWYWx1ZTogZnVuY3Rpb24gZ2V0Rm9jdXNWYWx1ZSgpIHtcbiAgICByZXR1cm4gX3N0b3JlLmZvY3VzVmFsdWU7XG4gIH0sXG5cbiAgLy8gR2V0dGVyIG1ldGhvZCB0byBnZXQgY3VycmVudGx5IHNlbGVjdGVkIG1lYXN1cmVcbiAgZ2V0TWVhc3VyZTogZnVuY3Rpb24gZ2V0TWVhc3VyZSgpIHtcbiAgICByZXR1cm4gX3N0b3JlLm1lYXN1cmU7XG4gIH0sXG5cbiAgLy8gR2V0dGVyIG1ldGhvZCBmb3IgdGhlIGVudGlyZSBzdG9yZVxuICBnZXRTdG9yZTogZnVuY3Rpb24gZ2V0U3RvcmUoKSB7XG4gICAgcmV0dXJuIF9zdG9yZTtcbiAgfSxcblxuICAvLyBTZXRzIHRoZSBkYWcgb2YgdGhlIHN0b3JlXG4gIHNldERhZzogZnVuY3Rpb24gc2V0RGFnKGRhZykge1xuICAgIF9zdG9yZS5kYWcgPSBkYWc7XG4gIH1cbn0pO1xuXG4vLyBSZWdpc3RlciBjYWxsYmFjayB0byBoYW5kbGUgYWxsIHVwZGF0ZXNcbkFwcERpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24gKGFjdGlvbikge1xuICBzd2l0Y2ggKGFjdGlvbi5hY3Rpb25UeXBlKSB7XG4gICAgLy8gVGhlIG1lYXN1cmUgY2hhbmdlZCBhbmQgd2UgbmVlZCB0byBmZXRjaCBuZXcgZGF0YVxuICAgIGNhc2UgRGV0YWlsVmlld0NvbnN0YW50cy5VUERBVEVfTUVBU1VSRTpcbiAgICAgIF9zdG9yZS5tZWFzdXJlID0gYWN0aW9uLm1lYXN1cmUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCcvJywgJycpO1xuICAgICAgRGV0YWlsVmlld1N0b3JlLmVtaXQoTUVBU1VSRV9DSEFOR0VfRVZFTlQpO1xuICAgICAgdXBkYXRlRGF0YSgpO1xuICAgICAgYnJlYWs7XG4gICAgLy8gV2UgbmVlZCB0byBmZXRjaCBuZXcgZGF0YVxuICAgIGNhc2UgRGV0YWlsVmlld0NvbnN0YW50cy5VUERBVEVfREFUQTpcbiAgICAgIHVwZGF0ZURhdGEoKTtcbiAgICAgIGJyZWFrO1xuICAgIC8vIFdlIG5lZWQgdG8gZmV0Y2ggbmV3IGRldGFpbHMgb24gdGhlIGN1cnJlbnQgZGFnL3Rhc2tcbiAgICBjYXNlIERldGFpbFZpZXdDb25zdGFudHMuVVBEQVRFX0RFVEFJTF9WSUVXOlxuICAgICAgX3N0b3JlLmlkID0gYWN0aW9uLm5hbWU7XG4gICAgICB1cGRhdGVEYXRhKCk7XG4gICAgICB1cGRhdGVEZXRhaWxzKCk7XG4gICAgICBicmVhaztcbiAgICAvLyBXZSBuZWVkIHRvIHVwZGF0ZSBvdXIgcmVjb3JkIG9mIG91ciBjdXJyZW50IG1vdXNlb3ZlciBwb2ludFxuICAgIGNhc2UgRGV0YWlsVmlld0NvbnN0YW50cy5VUERBVEVfRk9DVVNfREFUQTpcbiAgICAgIF9zdG9yZS5mb2N1c1ZhbHVlID0gYWN0aW9uLnZhbHVlO1xuICAgICAgX3N0b3JlLmZvY3VzRGF0ZSA9IGFjdGlvbi5kYXRlO1xuICAgICAgRGV0YWlsVmlld1N0b3JlLmVtaXQoRk9DVVNfVVBEQVRFX0VWRU5UKTtcbiAgICAgIGJyZWFrO1xuICAgIC8vIFdlIG5lZWQgdG8gdXBkYXRlIG91ciByZWNvcmQgb2Ygb3VyIGN1cnJlbnQgbW91c2VvdmVyIHBvaW50XG4gICAgY2FzZSBEZXRhaWxWaWV3Q29uc3RhbnRzLlVQREFURV9EQUc6XG4gICAgICBfc3RvcmUuZGFnID0gYWN0aW9uLmRhZztcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgLy8gbm8gb3BcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGV0YWlsVmlld1N0b3JlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5bmNtVm5iM0o1WDJadmMzUmxjaTlrWVhSaExXVnVaeTlvYjI1bGVYQnZkQzlrWlhZdmMyTnlhWEIwY3k5emRHOXlaWE12UkdWMFlXbHNWbWxsZDFOMGIzSmxMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN096dEJRVWxCTEVsQlFVMHNZVUZCWVN4SFFVRkhMRTlCUVU4c1EwRkJReXcyUWtGQk5rSXNRMEZCUXl4RFFVRkRPMEZCUXpkRUxFbEJRVTBzV1VGQldTeEhRVUZITEU5QlFVOHNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJReXhaUVVGWkxFTkJRVU03UVVGRGNFUXNTVUZCVFN4dFFrRkJiVUlzUjBGQlJ5eFBRVUZQTEVOQlFVTXNhME5CUVd0RExFTkJRVU1zUTBGQlF6dEJRVU40UlN4SlFVRk5MRTFCUVUwc1IwRkJSeXhQUVVGUExFTkJRVU1zWlVGQlpTeERRVUZETEVOQlFVTTdPMEZCUlhoRExFbEJRVTBzYjBKQlFXOUNMRWRCUVVjc1owSkJRV2RDTEVOQlFVTTdRVUZET1VNc1NVRkJUU3hwUWtGQmFVSXNSMEZCUnl4aFFVRmhMRU5CUVVNN1FVRkRlRU1zU1VGQlRTeHZRa0ZCYjBJc1IwRkJSeXhuUWtGQlowSXNRMEZCUXp0QlFVTTVReXhKUVVGTkxHdENRVUZyUWl4SFFVRkhMR05CUVdNc1EwRkJRenM3UVVGRk1VTXNTVUZCVFN4TlFVRk5MRWRCUVVjN1FVRkRZaXhUUVVGUExFVkJRVVVzU1VGQlNUdEJRVU5pTEV0QlFVY3NSVUZCUlN4SlFVRkpPMEZCUTFRc1RVRkJTU3hGUVVGRkxITkNRVUZ6UWp0QlFVTTFRaXhQUVVGTExFVkJRVVVzVDBGQlR6dEJRVU5rTEZsQlFWVXNSVUZCUlN4RFFVRkRPMEZCUTJJc1YwRkJVeXhGUVVGRkxFTkJRVU03UVVGRFdpeE5RVUZKTEVWQlFVVXNSVUZCUlN4RlFVTlVMRU5CUVVNN096czdRVUZIUml4VFFVRlRMRlZCUVZVc1IwRkJSenRCUVVOd1FpeEhRVUZETEVOQlFVTXNUMEZCVHl4RFFVTlFMRTFCUVUwc1EwRkJReXhSUVVGUkxFZEJRVWNzVFVGQlRTeEZRVU40UWp0QlFVTkZMRmRCUVU4c1JVRkJReXhOUVVGTkxFTkJRVU1zVDBGQlR6dEJRVU4wUWl4UFFVRkhMRVZCUVVVc1RVRkJUU3hEUVVGRExFZEJRVWM3UVVGRFppeE5RVUZGTEVWQlFVVXNUVUZCVFN4RFFVRkRMRVZCUVVVN1IwRkRaQ3hGUVVORUxGVkJRVk1zU1VGQlNTeEZRVUZGTzBGQlEySXNVVUZCVFN4TFFVRkxMRWRCUVVjc1JVRkJSU3hEUVVGRE8wRkJRMnBDTEZOQlFVc3NTVUZCVFN4SFFVRkhMRWxCUVVrc1NVRkJTU3hGUVVGRk8wRkJRM1JDTEZkQlFVc3NRMEZCUXl4SlFVRkpMRU5CUVVNc1JVRkJReXhMUVVGTExFVkJRVU1zU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRMRXRCUVVzc1JVRkJSU3hKUVVGSkxFVkJRVVVzU1VGQlNTeEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRExFVkJRVVVzUTBGQlF5eEJRVUZETEVWQlFVTXNRMEZCUXl4RFFVRkRPMHRCUTNCRk8wRkJRMFFzVlVGQlRTeERRVUZETEVsQlFVa3NSMEZCUnl4TFFVRkxMRU5CUVVNN1FVRkRjRUlzVlVGQlRTeERRVUZETEZGQlFWRXNSMEZCUnl4TFFVRkxMRU5CUVVNN1FVRkRlRUlzYlVKQlFXVXNRMEZCUXl4SlFVRkpMRU5CUVVNc2FVSkJRV2xDTEVOQlFVTXNRMEZCUXp0SFFVTjZReXhEUVVGRExFTkJRVU03UTBGRFRqczdPMEZCUjBRc1UwRkJVeXhoUVVGaExFZEJRVWM3UVVGRGRrSXNSMEZCUXl4RFFVRkRMRTlCUVU4c1EwRkRVQ3hOUVVGTkxFTkJRVU1zVVVGQlVTeEhRVUZITEZOQlFWTXNSVUZETTBJN1FVRkRSU3hQUVVGSExFVkJRVVVzVFVGQlRTeERRVUZETEVkQlFVYzdRVUZEWml4TlFVRkZMRVZCUVVVc1RVRkJUU3hEUVVGRExFVkJRVVU3UjBGRFpDeEZRVU5FTEZWQlFWTXNTVUZCU1N4RlFVRkZPMEZCUTJJc1VVRkJTU3hKUVVGSkxFTkJRVU1zVFVGQlRTeEhRVUZITEVOQlFVTXNSVUZCUlR0QlFVTnVRaXhaUVVGTkxFTkJRVU1zUzBGQlN5eEhRVUZITEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhMUVVGTExFTkJRVU03UzBGRE9VSTdRVUZEUkN4dFFrRkJaU3hEUVVGRExFbEJRVWtzUTBGQlF5eHZRa0ZCYjBJc1EwRkJReXhEUVVGRE8wZEJRelZETEVOQlFVTXNRMEZCUXp0RFFVTk9PenRCUVVWRUxFbEJRVTBzWlVGQlpTeEhRVUZITEUxQlFVMHNRMEZCUXl4RlFVRkZMRVZCUVVVc1dVRkJXU3hEUVVGRExGTkJRVk1zUlVGQlJUczdPMEZCUjNwRUxIZENRVUZ6UWl4RlFVRkZMR2REUVVGVExFVkJRVVVzUlVGQlF6dEJRVU5zUXl4UlFVRkpMRU5CUVVNc1JVRkJSU3hEUVVGRExHdENRVUZyUWl4RlFVRkZMRVZCUVVVc1EwRkJReXhEUVVGRE8wZEJRMnBET3p0QlFVVkVMREpDUVVGNVFpeEZRVUZGTEcxRFFVRlRMRVZCUVVVc1JVRkJRenRCUVVOeVF5eFJRVUZKTEVOQlFVTXNSVUZCUlN4RFFVRkRMR3RDUVVGclFpeEZRVUZGTEVWQlFVVXNRMEZCUXl4RFFVRkRPMGRCUTJwRE96czdRVUZIUkN4NVFrRkJkVUlzUlVGQlJTeHBRMEZCVXl4RlFVRkZMRVZCUVVNN1FVRkRia01zVVVGQlNTeERRVUZETEVWQlFVVXNRMEZCUXl4dlFrRkJiMElzUlVGQlJTeEZRVUZGTEVOQlFVTXNRMEZCUXp0SFFVTnVRenM3UVVGRlJDdzBRa0ZCTUVJc1JVRkJSU3h2UTBGQlV5eEZRVUZGTEVWQlFVTTdRVUZEZEVNc1VVRkJTU3hEUVVGRExFVkJRVVVzUTBGQlF5eHZRa0ZCYjBJc1JVRkJSU3hGUVVGRkxFTkJRVU1zUTBGQlF6dEhRVU51UXpzN08wRkJSMFFzZFVKQlFYRkNMRVZCUVVVc0swSkJRVk1zUlVGQlJTeEZRVUZETzBGQlEycERMRkZCUVVrc1EwRkJReXhGUVVGRkxFTkJRVU1zYVVKQlFXbENMRVZCUVVVc1JVRkJSU3hEUVVGRExFTkJRVU03UjBGRGFFTTdPMEZCUlVRc01FSkJRWGRDTEVWQlFVVXNhME5CUVZNc1JVRkJSU3hGUVVGRE8wRkJRM0JETEZGQlFVa3NRMEZCUXl4alFVRmpMRU5CUVVNc2FVSkJRV2xDTEVWQlFVVXNSVUZCUlN4RFFVRkRMRU5CUVVNN1IwRkROVU03T3p0QlFVZEVMREJDUVVGM1FpeEZRVUZGTEd0RFFVRlRMRVZCUVVVc1JVRkJRenRCUVVOd1F5eFJRVUZKTEVOQlFVTXNSVUZCUlN4RFFVRkRMRzlDUVVGdlFpeEZRVUZGTEVWQlFVVXNRMEZCUXl4RFFVRkRPMGRCUTI1RE96dEJRVVZFTERaQ1FVRXlRaXhGUVVGRkxIRkRRVUZUTEVWQlFVVXNSVUZCUXp0QlFVTjJReXhSUVVGSkxFTkJRVU1zWTBGQll5eERRVUZETEc5Q1FVRnZRaXhGUVVGRkxFVkJRVVVzUTBGQlF5eERRVUZETzBkQlF5OURPenM3UVVGSFJDeFRRVUZQTEVWQlFVVXNiVUpCUVZVN1FVRkRha0lzVjBGQlR5eE5RVUZOTEVOQlFVTXNTVUZCU1N4RFFVRkRPMGRCUTNCQ096czdRVUZIUkN4WlFVRlZMRVZCUVVVc2MwSkJRVlU3UVVGRGNFSXNVVUZCU1N4SlFVRkpMRWRCUVVjc1RVRkJUU3hEUVVGRExFVkJRVVVzUTBGQlF6dEJRVU55UWl4UlFVRkpMRTFCUVUwc1EwRkJReXhIUVVGSExFdEJRVXNzVFVGQlRTeERRVUZETEVWQlFVVXNSVUZCUlR0QlFVTTFRaXhWUVVGSkxFZEJRVWNzVFVGQlRTeERRVUZETEVkQlFVY3NSMEZCUnl4SFFVRkhMRWRCUVVjc1RVRkJUU3hEUVVGRExFVkJRVVVzUTBGQlF6dExRVU55UXp0QlFVTkVMRmRCUVU4N1FVRkRUQ3hWUVVGSkxFVkJRVVVzU1VGQlNUdEJRVU5XTEZkQlFVc3NSVUZCUlN4TlFVRk5MRU5CUVVNc1MwRkJTenRMUVVOd1FpeERRVUZETzBkQlEwZzdPenRCUVVkRUxHTkJRVmtzUlVGQlJTeDNRa0ZCVlR0QlFVTjBRaXhYUVVGUExFMUJRVTBzUTBGQlF5eFRRVUZUTEVOQlFVTTdSMEZEZWtJN08wRkJSVVFzWlVGQllTeEZRVUZGTEhsQ1FVRlZPMEZCUTNaQ0xGZEJRVThzVFVGQlRTeERRVUZETEZWQlFWVXNRMEZCUXp0SFFVTXhRanM3TzBGQlIwUXNXVUZCVlN4RlFVRkZMSE5DUVVGVk8wRkJRM0JDTEZkQlFVOHNUVUZCVFN4RFFVRkRMRTlCUVU4c1EwRkJRenRIUVVOMlFqczdPMEZCUjBRc1ZVRkJVU3hGUVVGRkxHOUNRVUZWTzBGQlEyeENMRmRCUVU4c1RVRkJUU3hEUVVGRE8wZEJRMlk3T3p0QlFVZEVMRkZCUVUwc1JVRkJSU3huUWtGQlV5eEhRVUZITEVWQlFVTTdRVUZEYmtJc1ZVRkJUU3hEUVVGRExFZEJRVWNzUjBGQlJ5eEhRVUZITEVOQlFVTTdSMEZEYkVJN1EwRkRSaXhEUVVGRExFTkJRVU03T3p0QlFVbElMR0ZCUVdFc1EwRkJReXhSUVVGUkxFTkJRVU1zVlVGQlV5eE5RVUZOTEVWQlFVVTdRVUZEZEVNc1ZVRkJUeXhOUVVGTkxFTkJRVU1zVlVGQlZUczdRVUZGZEVJc1UwRkJTeXh0UWtGQmJVSXNRMEZCUXl4alFVRmpPMEZCUTNKRExGbEJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NUVUZCVFN4RFFVRkRMRTlCUVU4c1EwRkJReXhYUVVGWExFVkJRVVVzUTBGQlF5eFBRVUZQTEVOQlFVTXNSMEZCUnl4RlFVRkRMRVZCUVVVc1EwRkJReXhEUVVGRE8wRkJRemxFTEhGQ1FVRmxMRU5CUVVNc1NVRkJTU3hEUVVGRExHOUNRVUZ2UWl4RFFVRkRMRU5CUVVNN1FVRkRNME1zWjBKQlFWVXNSVUZCUlN4RFFVRkRPMEZCUTJJc1dVRkJUVHRCUVVGQk8wRkJSVklzVTBGQlN5eHRRa0ZCYlVJc1EwRkJReXhYUVVGWE8wRkJRMnhETEdkQ1FVRlZMRVZCUVVVc1EwRkJRenRCUVVOaUxGbEJRVTA3UVVGQlFUdEJRVVZTTEZOQlFVc3NiVUpCUVcxQ0xFTkJRVU1zYTBKQlFXdENPMEZCUTNwRExGbEJRVTBzUTBGQlF5eEZRVUZGTEVkQlFVY3NUVUZCVFN4RFFVRkRMRWxCUVVrc1EwRkJRenRCUVVONFFpeG5Ra0ZCVlN4RlFVRkZMRU5CUVVNN1FVRkRZaXh0UWtGQllTeEZRVUZGTEVOQlFVTTdRVUZEYUVJc1dVRkJUVHRCUVVGQk8wRkJSVklzVTBGQlN5eHRRa0ZCYlVJc1EwRkJReXhwUWtGQmFVSTdRVUZEZUVNc1dVRkJUU3hEUVVGRExGVkJRVlVzUjBGQlJ5eE5RVUZOTEVOQlFVTXNTMEZCU3l4RFFVRkRPMEZCUTJwRExGbEJRVTBzUTBGQlF5eFRRVUZUTEVkQlFVY3NUVUZCVFN4RFFVRkRMRWxCUVVrc1EwRkJRenRCUVVNdlFpeHhRa0ZCWlN4RFFVRkRMRWxCUVVrc1EwRkJReXhyUWtGQmEwSXNRMEZCUXl4RFFVRkRPMEZCUTNwRExGbEJRVTA3UVVGQlFUdEJRVVZTTEZOQlFVc3NiVUpCUVcxQ0xFTkJRVU1zVlVGQlZUdEJRVU5xUXl4WlFVRk5MRU5CUVVNc1IwRkJSeXhIUVVGSExFMUJRVTBzUTBGQlF5eEhRVUZITEVOQlFVTTdRVUZEZUVJc1dVRkJUVHRCUVVGQkxFRkJRMUlzV1VGQlVUczdSMEZGVkR0RFFVTkdMRU5CUVVNc1EwRkJRenM3UVVGRlNDeE5RVUZOTEVOQlFVTXNUMEZCVHl4SFFVRkhMR1ZCUVdVc1EwRkJReUlzSW1acGJHVWlPaUl2VlhObGNuTXZaM0psWjI5eWVWOW1iM04wWlhJdlpHRjBZUzFsYm1jdmFHOXVaWGx3YjNRdlpHVjJMM05qY21sd2RITXZjM1J2Y21WekwwUmxkR0ZwYkZacFpYZFRkRzl5WlM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaTh2SUVSbGRHRnBiRlpwWlhkVGRHOXlaUzVxYzF4dUx5OGdWR2hsSUdac2RYZ2daR0YwWVhOMGIzSmxJR1p2Y2lCMGFHVWdaVzUwYVhKbElHUmxkR0ZwYkNCMmFXVjNYRzR2S21wemFHbHVkQ0JsYzI1bGVIUTZJSFJ5ZFdVZ0tpOWNibHh1WTI5dWMzUWdRWEJ3UkdsemNHRjBZMmhsY2lBOUlISmxjWFZwY21Vb0p5NHVMMlJwYzNCaGRHTm9aWEl2UVhCd1JHbHpjR0YwWTJobGNpY3BPMXh1WTI5dWMzUWdSWFpsYm5SRmJXbDBkR1Z5SUQwZ2NtVnhkV2x5WlNnblpYWmxiblJ6SnlrdVJYWmxiblJGYldsMGRHVnlPMXh1WTI5dWMzUWdSR1YwWVdsc1ZtbGxkME52Ym5OMFlXNTBjeUE5SUhKbGNYVnBjbVVvSnk0dUwyTnZibk4wWVc1MGN5OUVaWFJoYVd4V2FXVjNRMjl1YzNSaGJuUnpKeWs3WEc1amIyNXpkQ0JoYzNOcFoyNGdQU0J5WlhGMWFYSmxLQ2R2WW1wbFkzUXRZWE56YVdkdUp5azdYRzVjYm1OdmJuTjBJRTFGUVZOVlVrVmZRMGhCVGtkRlgwVldSVTVVSUQwZ0oyMWxZWE4xY21WZlkyaGhibWRsSnp0Y2JtTnZibk4wSUVSQlZFRmZWVkJFUVZSRlgwVldSVTVVSUQwZ0oyUmhkR0ZmZFhCa1lYUmxKenRjYm1OdmJuTjBJRVJGVkVGSlRGTmZWVkJFUVZSRlgwVldSVTVVSUQwZ0oyUmxkR0ZwYkhOZmRYQmtZWFJsSnp0Y2JtTnZibk4wSUVaUFExVlRYMVZRUkVGVVJWOUZWa1ZPVkNBOUlDZG1iMk4xYzE5MWNHUmhkR1VuTzF4dVhHNWpiMjV6ZENCZmMzUnZjbVVnUFNCN1hHNGdJRzFsWVhOMWNtVTZJQ2RwYnljc0lDOHZJRlJvWlNCamRYSnlaVzUwYkhrZ2MyVnNaV04wWldRZ2JXVmhjM1Z5WlNCbWIzSWdkR2hsSUdkeVlYQm9YRzRnSUdSaFp6b2diblZzYkN3Z0x5OGdWR2hsSUdOMWNuSmxiblJzZVNCelpXeGxZM1JsWkNCRVFVZGNiaUFnYm1GdFpUb2dKMU5sYkdWamRDQmhJRVJCUnlCdmNpQlVZWE5ySnl3Z0x5OGdWR2hsSUdsa0lDaHVZVzFsS1NCdlppQjBhR1VnZEdocGJtY2dZbVZwYm1jZ2RtbGxkMlZrWEc0Z0lHOTNibVZ5T2lBbmIzZHVaWEluTENBdkx5QjBhR1VnYjNkdVpYSWdiMllnZEdobElIUm9hVzVuSUdKbGFXNW5JSFpwWlhkbFpGeHVJQ0JtYjJOMWMxWmhiSFZsT2lBd0xDQXZMeUJVYUdVZ2RtRnNkV1VnYjJZZ2QyaGhkR1YyWlhJZ2FYTWdZbVZwYm1jZ2JXOTFjMlZrSUc5MlpYSWdiMjRnZEdobElHZHlZWEJvWEc0Z0lHWnZZM1Z6UkdGMFpUb2dNQ3dnTHk4Z1ZHaGxJR1JoZEdVZ2IyWWdkR2hsSUhCdmFXNTBJR04xY25KbGJuUnNlU0J0YjNWelpXUWdiM1psY2lCdmJpQjBhR1VnWjNKaGNHaGNiaUFnWkdGMFlUb2dXMTBzSUM4dklGUm9aU0J5YjNkeklISmxkSEpwWlhabFpDQm1jbTl0SUhSb1pTQnpaWEoyWlhJZ2QybDBhQ0IyWVd4MVpYTWdZVzVrSUdSaGRHVnpYRzU5TzF4dVhHNHZMeUJHYVhKbGN5QnZaaUJoYmlCQmFtRjRJR2RsZENCeVpYRjFaWE4wSUhSdklIUm9aU0J6WlhKMlpYSWdkRzhnWjJWMElIWmhiSFZsY3lCaGJtUWdaR0YwWlhNZ1ptOXlJR2R5WVhCb1hHNW1kVzVqZEdsdmJpQjFjR1JoZEdWRVlYUmhLQ2tnZTF4dUlDQWtMbWRsZEVwVFQwNG9YRzRnSUNBZ2QybHVaRzkzTG14dlkyRjBhVzl1SUNzZ0oyUmhkR0VuTEZ4dUlDQWdJSHRjYmlBZ0lDQWdJRzFsWVhOMWNtVTZYM04wYjNKbExtMWxZWE4xY21Vc1hHNGdJQ0FnSUNCa1lXYzZJRjl6ZEc5eVpTNWtZV2NzWEc0Z0lDQWdJQ0JwWkRvZ1gzTjBiM0psTG1sa1hHNGdJQ0FnZlN4Y2JpQWdJQ0JtZFc1amRHbHZiaWhrWVhSaEtTQjdYRzRnSUNBZ0lDQmpiMjV6ZENCaGNuSmhlU0E5SUZ0ZE8xeHVJQ0FnSUNBZ1ptOXlJQ2hqYjI1emRDQnJaWGtnYVc0Z1pHRjBZU2tnZTF4dUlDQWdJQ0FnSUNCaGNuSmhlUzV3ZFhOb0tIdDJZV3gxWlRwa1lYUmhXMnRsZVYwdWRtRnNkV1VzSUdSaGRHVTZLRzVsZHlCRVlYUmxLR1JoZEdGYmEyVjVYUzVrY3lrcGZTazdYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQmZjM1J2Y21VdVpHRjBZU0E5SUdGeWNtRjVPMXh1SUNBZ0lDQWdYM04wYjNKbExuVndaR0YwYVc1bklEMGdabUZzYzJVN1hHNGdJQ0FnSUNCRVpYUmhhV3hXYVdWM1UzUnZjbVV1WlcxcGRDaEVRVlJCWDFWUVJFRlVSVjlGVmtWT1ZDazdYRzRnSUNBZ2ZTazdYRzU5SUZ4dVhHNHZMeUJHYVhKbGN5QnZaaUJoYmlCQmFtRjRJR2RsZENCeVpYRjFaWE4wSUhSdklIUm9aU0J6WlhKMlpYSWdkRzhnWjJWMElHMWxkR0ZrWVhSaElHOXVJR04xY25KbGJuUWdkR2hwYm1kY2JtWjFibU4wYVc5dUlIVndaR0YwWlVSbGRHRnBiSE1vS1NCN1hHNGdJQ1F1WjJWMFNsTlBUaWhjYmlBZ0lDQjNhVzVrYjNjdWJHOWpZWFJwYjI0Z0t5QW5aR1YwWVdsc2N5Y3NYRzRnSUNBZ2UxeHVJQ0FnSUNBZ1pHRm5PaUJmYzNSdmNtVXVaR0ZuTEZ4dUlDQWdJQ0FnYVdRNklGOXpkRzl5WlM1cFpDeGNiaUFnSUNCOUxGeHVJQ0FnSUdaMWJtTjBhVzl1S0dSaGRHRXBJSHRjYmlBZ0lDQWdJR2xtSUNoa1lYUmhMbXhsYm1kMGFDQStJREFwSUh0Y2JpQWdJQ0FnSUNBZ1gzTjBiM0psTG05M2JtVnlJRDBnWkdGMFlWc3dYUzV2ZDI1bGNqdGNiaUFnSUNBZ0lIMWNiaUFnSUNBZ0lFUmxkR0ZwYkZacFpYZFRkRzl5WlM1bGJXbDBLRVJGVkVGSlRGTmZWVkJFUVZSRlgwVldSVTVVS1R0Y2JpQWdJQ0I5S1R0Y2JuMGdYRzVjYm1OdmJuTjBJRVJsZEdGcGJGWnBaWGRUZEc5eVpTQTlJR0Z6YzJsbmJpaDdmU3dnUlhabGJuUkZiV2wwZEdWeUxuQnliM1J2ZEhsd1pTd2dlMXh1WEc0Z0lDOHZJRXhwYzNSbGJtVnlJR1p2Y2lCM2FHVnVJRzF2ZFhObElHMXZkbVZ6WEc0Z0lHRmtaRVp2WTNWelZYQmtZWFJsVEdsemRHVnVaWEk2SUdaMWJtTjBhVzl1S0dOaUtYdGNiaUFnSUNCMGFHbHpMbTl1S0VaUFExVlRYMVZRUkVGVVJWOUZWa1ZPVkN3Z1kySXBPMXh1SUNCOUxGeHVYRzRnSUhKbGJXOTJaVVp2WTNWelZYQmtZWFJsVEdsemRHVnVaWEk2SUdaMWJtTjBhVzl1S0dOaUtYdGNiaUFnSUNCMGFHbHpMbTl1S0VaUFExVlRYMVZRUkVGVVJWOUZWa1ZPVkN3Z1kySXBPMXh1SUNCOUxGeHVYRzRnSUM4dklFeHBjM1JsYm1WeUlHWnZjaUIzYUdWdUlIUm9hVzVuSUcxbGRHRmtZWFJoSUdOb1lXNW5aWE5jYmlBZ1lXUmtSR1YwWVdsc1ZYQmtZWFJsVEdsemRHVnVaWEk2SUdaMWJtTjBhVzl1S0dOaUtYdGNiaUFnSUNCMGFHbHpMbTl1S0VSRlZFRkpURk5mVlZCRVFWUkZYMFZXUlU1VUxDQmpZaWs3WEc0Z0lIMHNYRzVjYmlBZ2NtVnRiM1psUkdWMFlXbHNWWEJrWVhSbFRHbHpkR1Z1WlhJNklHWjFibU4wYVc5dUtHTmlLWHRjYmlBZ0lDQjBhR2x6TG05dUtFUkZWRUZKVEZOZlZWQkVRVlJGWDBWV1JVNVVMQ0JqWWlrN1hHNGdJSDBzWEc1Y2JpQWdMeThnVEdsemRHVnVaWElnWm05eUlIZG9aVzRnWkdGMFlTQjJZV3gxWlhNZ1lXNWtJR1JoZEdWeklHTm9ZVzVuWlZ4dUlDQmhaR1JFWVhSaFZYQmtZWFJsVEdsemRHVnVaWEk2SUdaMWJtTjBhVzl1S0dOaUtYdGNiaUFnSUNCMGFHbHpMbTl1S0VSQlZFRmZWVkJFUVZSRlgwVldSVTVVTENCallpazdYRzRnSUgwc1hHNWNiaUFnY21WdGIzWmxSR0YwWVZWd1pHRjBaVXhwYzNSbGJtVnlPaUJtZFc1amRHbHZiaWhqWWlsN1hHNGdJQ0FnZEdocGN5NXlaVzF2ZG1WTWFYTjBaVzVsY2loRVFWUkJYMVZRUkVGVVJWOUZWa1ZPVkN3Z1kySXBPMXh1SUNCOUxGeHVYRzRnSUM4dklFeHBjM1JsYm1WeUlHWnZjaUIzYUdWdUlIVnpaWElnYzJWc1pXTjBjeUJoSUdScFptWmxjbVZ1ZENCdFpXRnpkWEpsWEc0Z0lHRmtaRTFsWVhOMWNtVkRhR0Z1WjJWTWFYTjBaVzVsY2pvZ1puVnVZM1JwYjI0b1kySXBlMXh1SUNBZ0lIUm9hWE11YjI0b1RVVkJVMVZTUlY5RFNFRk9SMFZmUlZaRlRsUXNJR05pS1R0Y2JpQWdmU3hjYmx4dUlDQnlaVzF2ZG1WTlpXRnpkWEpsUTJoaGJtZGxUR2x6ZEdWdVpYSTZJR1oxYm1OMGFXOXVLR05pS1h0Y2JpQWdJQ0IwYUdsekxuSmxiVzkyWlV4cGMzUmxibVZ5S0UxRlFWTlZVa1ZmUTBoQlRrZEZYMFZXUlU1VUxDQmpZaWs3WEc0Z0lIMHNYRzVjYmlBZ0x5OGdSMlYwZEdWeUlHMWxkR2h2WkNCbWIzSWdaR0YwWVNCMGFHRjBJR055WldGMFpYTWdabVYwWTJnZ2FXWWdibVZsWkNCaVpWeHVJQ0JuWlhSRVlYUmhPaUJtZFc1amRHbHZiaWdwZTF4dUlDQWdJSEpsZEhWeWJpQmZjM1J2Y21VdVpHRjBZVHRjYmlBZ2ZTeGNibHh1SUNBdkx5QkhaWFIwWlhJZ2JXVjBhRzlrSUdadmNpQmtaWFJoYVd4eklIUm9ZWFFnWTNKbFlYUmxjeUJtWlhSamFDQnBaaUJ1WldWa0lHSmxYRzRnSUdkbGRFUmxkR0ZwYkhNNklHWjFibU4wYVc5dUtDbDdYRzRnSUNBZ2JHVjBJRzVoYldVZ1BTQmZjM1J2Y21VdWFXUTdYRzRnSUNBZ2FXWWdLRjl6ZEc5eVpTNWtZV2NnSVQwOUlGOXpkRzl5WlM1cFpDa2dlMXh1SUNBZ0lDQWdibUZ0WlNBOUlGOXpkRzl5WlM1a1lXY2dLeUFuTGljZ0t5QmZjM1J2Y21VdWFXUTdYRzRnSUNBZ2ZWeHVJQ0FnSUhKbGRIVnliaUI3WEc0Z0lDQWdJQ0J1WVcxbE9pQnVZVzFsTEZ4dUlDQWdJQ0FnYjNkdVpYSTZJRjl6ZEc5eVpTNXZkMjVsY2x4dUlDQWdJSDA3WEc0Z0lIMHNYRzRnSUZ4dUlDQXZMeUJIWlhSMFpYSWdiV1YwYUc5a0lIUnZJR2RsZENCamRYSnlaVzUwSUcxdmRYTmxiM1psY2lCMllXeDFaWE5jYmlBZ1oyVjBSbTlqZFhORVlYUmxPaUJtZFc1amRHbHZiaWdwZTF4dUlDQWdJSEpsZEhWeWJpQmZjM1J2Y21VdVptOWpkWE5FWVhSbE8xeHVJQ0I5TEZ4dVhHNGdJR2RsZEVadlkzVnpWbUZzZFdVNklHWjFibU4wYVc5dUtDbDdYRzRnSUNBZ2NtVjBkWEp1SUY5emRHOXlaUzVtYjJOMWMxWmhiSFZsTzF4dUlDQjlMRnh1WEc0Z0lDOHZJRWRsZEhSbGNpQnRaWFJvYjJRZ2RHOGdaMlYwSUdOMWNuSmxiblJzZVNCelpXeGxZM1JsWkNCdFpXRnpkWEpsWEc0Z0lHZGxkRTFsWVhOMWNtVTZJR1oxYm1OMGFXOXVLQ2w3WEc0Z0lDQWdjbVYwZFhKdUlGOXpkRzl5WlM1dFpXRnpkWEpsTzF4dUlDQjlMRnh1WEc0Z0lDOHZJRWRsZEhSbGNpQnRaWFJvYjJRZ1ptOXlJSFJvWlNCbGJuUnBjbVVnYzNSdmNtVmNiaUFnWjJWMFUzUnZjbVU2SUdaMWJtTjBhVzl1S0NsN1hHNGdJQ0FnY21WMGRYSnVJRjl6ZEc5eVpUdGNiaUFnZlN4Y2JseHVJQ0F2THlCVFpYUnpJSFJvWlNCa1lXY2diMllnZEdobElITjBiM0psWEc0Z0lITmxkRVJoWnpvZ1puVnVZM1JwYjI0b1pHRm5LWHRjYmlBZ0lDQmZjM1J2Y21VdVpHRm5JRDBnWkdGbk8xeHVJQ0I5TEZ4dWZTazdYRzVjYmx4dUx5OGdVbVZuYVhOMFpYSWdZMkZzYkdKaFkyc2dkRzhnYUdGdVpHeGxJR0ZzYkNCMWNHUmhkR1Z6WEc1QmNIQkVhWE53WVhSamFHVnlMbkpsWjJsemRHVnlLR1oxYm1OMGFXOXVLR0ZqZEdsdmJpa2dlMXh1SUNCemQybDBZMmdvWVdOMGFXOXVMbUZqZEdsdmJsUjVjR1VwSUh0Y2JpQWdJQ0F2THlCVWFHVWdiV1ZoYzNWeVpTQmphR0Z1WjJWa0lHRnVaQ0IzWlNCdVpXVmtJSFJ2SUdabGRHTm9JRzVsZHlCa1lYUmhYRzRnSUNBZ1kyRnpaU0JFWlhSaGFXeFdhV1YzUTI5dWMzUmhiblJ6TGxWUVJFRlVSVjlOUlVGVFZWSkZPbHh1SUNBZ0lDQWdYM04wYjNKbExtMWxZWE4xY21VZ1BTQmhZM1JwYjI0dWJXVmhjM1Z5WlM1MGIweHZkMlZ5UTJGelpTZ3BMbkpsY0d4aFkyVW9KeThuTENjbktUdGNiaUFnSUNBZ0lFUmxkR0ZwYkZacFpYZFRkRzl5WlM1bGJXbDBLRTFGUVZOVlVrVmZRMGhCVGtkRlgwVldSVTVVS1R0Y2JpQWdJQ0FnSUhWd1pHRjBaVVJoZEdFb0tUdGNiaUFnSUNBZ0lHSnlaV0ZyTzF4dUlDQWdJQzh2SUZkbElHNWxaV1FnZEc4Z1ptVjBZMmdnYm1WM0lHUmhkR0ZjYmlBZ0lDQmpZWE5sSUVSbGRHRnBiRlpwWlhkRGIyNXpkR0Z1ZEhNdVZWQkVRVlJGWDBSQlZFRTZYRzRnSUNBZ0lDQjFjR1JoZEdWRVlYUmhLQ2s3WEc0Z0lDQWdJQ0JpY21WaGF6dGNiaUFnSUNBdkx5QlhaU0J1WldWa0lIUnZJR1psZEdOb0lHNWxkeUJrWlhSaGFXeHpJRzl1SUhSb1pTQmpkWEp5Wlc1MElHUmhaeTkwWVhOclhHNGdJQ0FnWTJGelpTQkVaWFJoYVd4V2FXVjNRMjl1YzNSaGJuUnpMbFZRUkVGVVJWOUVSVlJCU1V4ZlZrbEZWenBjYmlBZ0lDQWdJRjl6ZEc5eVpTNXBaQ0E5SUdGamRHbHZiaTV1WVcxbE8xeHVJQ0FnSUNBZ2RYQmtZWFJsUkdGMFlTZ3BPMXh1SUNBZ0lDQWdkWEJrWVhSbFJHVjBZV2xzY3lncE8xeHVJQ0FnSUNBZ1luSmxZV3M3WEc0Z0lDQWdMeThnVjJVZ2JtVmxaQ0IwYnlCMWNHUmhkR1VnYjNWeUlISmxZMjl5WkNCdlppQnZkWElnWTNWeWNtVnVkQ0J0YjNWelpXOTJaWElnY0c5cGJuUmNiaUFnSUNCallYTmxJRVJsZEdGcGJGWnBaWGREYjI1emRHRnVkSE11VlZCRVFWUkZYMFpQUTFWVFgwUkJWRUU2WEc0Z0lDQWdJQ0JmYzNSdmNtVXVabTlqZFhOV1lXeDFaU0E5SUdGamRHbHZiaTUyWVd4MVpUdGNiaUFnSUNBZ0lGOXpkRzl5WlM1bWIyTjFjMFJoZEdVZ1BTQmhZM1JwYjI0dVpHRjBaVHRjYmlBZ0lDQWdJRVJsZEdGcGJGWnBaWGRUZEc5eVpTNWxiV2wwS0VaUFExVlRYMVZRUkVGVVJWOUZWa1ZPVkNrN1hHNGdJQ0FnSUNCaWNtVmhhenRjYmlBZ0lDQXZMeUJYWlNCdVpXVmtJSFJ2SUhWd1pHRjBaU0J2ZFhJZ2NtVmpiM0prSUc5bUlHOTFjaUJqZFhKeVpXNTBJRzF2ZFhObGIzWmxjaUJ3YjJsdWRGeHVJQ0FnSUdOaGMyVWdSR1YwWVdsc1ZtbGxkME52Ym5OMFlXNTBjeTVWVUVSQlZFVmZSRUZIT2x4dUlDQWdJQ0FnWDNOMGIzSmxMbVJoWnlBOUlHRmpkR2x2Ymk1a1lXYzdYRzRnSUNBZ0lDQmljbVZoYXp0Y2JpQWdJQ0JrWldaaGRXeDBPbHh1SUNBZ0lDQWdMeThnYm04Z2IzQmNiaUFnZlZ4dWZTazdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnUkdWMFlXbHNWbWxsZDFOMGIzSmxPMXh1SWwxOSIsIi8vIEZpbHRlclN0b3JlLmpzXG4vLyBUaGUgZmx1eCBkYXRhc3RvcmUgZm9yIHRoZSBsZWZ0IHNpZGViYXJcbi8qanNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBBcHBEaXNwYXRjaGVyID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJyk7XG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xudmFyIEZpbHRlckNvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9GaWx0ZXJDb25zdGFudHMnKTtcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG52YXIgRGV0YWlsVmlld1N0b3JlID0gcmVxdWlyZSgnLi9EZXRhaWxWaWV3U3RvcmUnKTtcblxudmFyIEZJTFRFUl9DSEFOR0VfRVZFTlQgPSAnZmlsdGVyX2NoYW5nZSc7XG52YXIgREFHX1NFVF9FVkVOVCA9ICdkYWdfY2hvc2VuJztcblxudmFyIF9zdG9yZSA9IHtcbiAgcmVzdWx0czogbnVsbCwgLy8gVGhlIGN1cnJlbnQgZGFncy90YXNrcyBsaXN0ZWQgb24gdGhlIHNpZGViYXIgdy8gdmFsdWVzXG4gIG1lYXN1cmU6ICdpbycsIC8vIFRoZSBjdXJyZW50IGZpbHRlciBtZWFzdXJlXG4gIHRpbWU6ICd3ZWVrJywgLy8gVGhlIGN1cnJlbnQgZmlsdGVyIHRpbWUgcmFuZ2VcbiAgZGFnOiBudWxsLCAvLyBUaGUgY3VycmVudGx5IHNlbGVjdGVkIHRhc2sgb3IgZGFnXG4gIGNoYW5nZTogJ3BlcmNlbnQnLCAvLyBXaGV0aGVyIHRoZSBmaWx0ZXIgc2hvd3MgYWJzb2x1dGUgb3IgcmVsYXRpdmUgY2hhbmdlXG4gIHNlYXJjaEZpbHRlcjogJycgfTtcblxuLy8gRmlyZXMgb2YgYW4gQWpheCBnZXQgcmVxdWVzdCB0byB0aGUgc2VydmVyIHRvIGdldCBkYWdzL3Rhc2tzIGZvciBzaWRlYmFyXG4vLyBUaGUgY29udGVudHMgb2YgdGhlIHNlYXJjaCBiYXIgdGhhdCBmaWx0ZXJzIHJlc3VsdHNcbmZ1bmN0aW9uIHVwZGF0ZVJlc3VsdHMoKSB7XG4gICQuZ2V0SlNPTih3aW5kb3cubG9jYXRpb24gKyAnZmlsdGVyJywge1xuICAgIG1lYXN1cmU6IF9zdG9yZS5tZWFzdXJlLFxuICAgIHRpbWU6IF9zdG9yZS50aW1lLFxuICAgIGRhZzogX3N0b3JlLmRhZ1xuICB9LCBmdW5jdGlvbiAoZGF0YSkge1xuICAgIC8vIGNvbnZlcnQgZGljdCB0byBhcnJheVxuICAgIHZhciBhcnJheSA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBkYXRhKSB7XG4gICAgICBhcnJheS5wdXNoKGRhdGFba2V5XSk7XG4gICAgfVxuICAgIF9zdG9yZS5yZXN1bHRzID0gYXJyYXk7XG4gICAgX3N0b3JlLnVwZGF0aW5nID0gZmFsc2U7XG4gICAgRmlsdGVyU3RvcmUuZW1pdChGSUxURVJfQ0hBTkdFX0VWRU5UKTtcbiAgfSk7XG59XG5cbnZhciBGaWx0ZXJTdG9yZSA9IGFzc2lnbih7fSwgRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwge1xuICAvLyBMaXN0ZW5lciBmb3Igd2hlbiByYWRpbyBidXR0b24gY2hhbmdlcyBhbmQgcmVzdWx0cyBuZWVkIHRvIHVwZGF0ZVxuICBhZGRGaWx0ZXJSZXN1bHRzQ2hhbmdlTGlzdGVuZXI6IGZ1bmN0aW9uIGFkZEZpbHRlclJlc3VsdHNDaGFuZ2VMaXN0ZW5lcihjYikge1xuICAgIHRoaXMub24oRklMVEVSX0NIQU5HRV9FVkVOVCwgY2IpO1xuICB9LFxuICByZW1vdmVGaWx0ZXJSZXN1bHRzQ2hhbmdlTGlzdGVuZXI6IGZ1bmN0aW9uIHJlbW92ZUZpbHRlclJlc3VsdHNDaGFuZ2VMaXN0ZW5lcihjYikge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoRklMVEVSX0NIQU5HRV9FVkVOVCwgY2IpO1xuICB9LFxuICAvLyBMaXN0ZW5lciBmb3Igd2hlbiBkYWcgaXMgc2V0IGFuZCBidXR0b24gbmVlZHMgdG8gdXBkYXRlXG4gIGFkZERhZ1NldExpc3RlbmVyOiBmdW5jdGlvbiBhZGREYWdTZXRMaXN0ZW5lcihjYikge1xuICAgIHRoaXMub24oREFHX1NFVF9FVkVOVCwgY2IpO1xuICB9LFxuICByZW1vdmVEYWdTZXRMaXN0ZW5lcjogZnVuY3Rpb24gcmVtb3ZlRGFnU2V0TGlzdGVuZXIoY2IpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKERBR19TRVRfRVZFTlQsIGNiKTtcbiAgfSxcbiAgLy8gR2V0dGVyIGZvciByZXN1bHRzIHRoYXQgZmV0Y2hlcyByZXN1bHRzIGlmIHN0b3JlIGlzIGVtcHR5XG4gIGdldFJlc3VsdHM6IGZ1bmN0aW9uIGdldFJlc3VsdHMoKSB7XG4gICAgaWYgKCFfc3RvcmUucmVzdWx0cykge1xuICAgICAgdXBkYXRlUmVzdWx0cygpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBfc3RvcmUucmVzdWx0cy5maWx0ZXIoZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgIHJldHVybiBlbGVtZW50Lm5hbWUuaW5kZXhPZihfc3RvcmUuc2VhcmNoRmlsdGVyKSAhPT0gLTE7XG4gICAgfSk7XG4gIH0sXG4gIC8vIFRyYW5zaWVudCBnZXR0ZXIgdGhhdCBjYWxjdWxhdGVzIGhlYWRlcnMgZXZlcnkgdGltZVxuICBnZXRSZXN1bHRIZWFkZXJzOiBmdW5jdGlvbiBnZXRSZXN1bHRIZWFkZXJzKCkge1xuICAgIGlmIChfc3RvcmUuZGFnICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gWyd0YXNrIG5hbWUnLCBfc3RvcmUubWVhc3VyZV07XG4gICAgfVxuICAgIHJldHVybiBbJ2RhZyBuYW1lJywgX3N0b3JlLm1lYXN1cmVdO1xuICB9LFxuICAvLyBUcmFuc2llbnQgZ2V0dGVyIHRoYXQgY2FsY3VsYXRlcyBmaWx0ZXIgZGVzY3JpcHRpb24gc3RyaW5nXG4gIGdldERlc2NyaXB0aW9uU3RyaW5nOiBmdW5jdGlvbiBnZXREZXNjcmlwdGlvblN0cmluZygpIHtcbiAgICB2YXIgbWVhc3VyZVN0cmluZyA9IHVuZGVmaW5lZDtcbiAgICBzd2l0Y2ggKF9zdG9yZS5tZWFzdXJlKSB7XG4gICAgICBjYXNlICdpbyc6XG4gICAgICAgIG1lYXN1cmVTdHJpbmcgPSAncmVhZCBhbmQgd3JpdGUgb3BlcmF0b3Jpb25zJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjcHUnOlxuICAgICAgICBtZWFzdXJlU3RyaW5nID0gJ3RvdGFsIGNwdSB0aW1lIGluIHNlY29uZHMnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21hcHBlcnMnOlxuICAgICAgICBtZWFzdXJlU3RyaW5nID0gJ251bWJlciBvZiBtYXBwZXJzJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyZWR1Y2Vycyc6XG4gICAgICAgIG1lYXN1cmVTdHJpbmcgPSAnbnVtYmVyIG9mIHJlZHVjZXJzJztcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiAnQXZlcmFnZSAnICsgbWVhc3VyZVN0cmluZyArICcgb3ZlciB0aGUgbGFzdCAnICsgX3N0b3JlLnRpbWUudG9Mb3dlckNhc2UoKSArICcuJztcbiAgfSxcblxuICAvLyBSZXR1cm4gYSBib29sIGFzIHRvIHdoZXRoZXIgZmlsdGVyIHJlc3VsdHMgYXJlIGRhZ3Mgb3IgdGFza3NcbiAgaXNTaG93aW5nRGFnczogZnVuY3Rpb24gaXNTaG93aW5nRGFncygpIHtcbiAgICBpZiAoX3N0b3JlLmRhZyA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG59KTtcblxuLy8gUmVnaXN0ZXIgY2FsbGJhY2sgdG8gaGFuZGxlIGFsbCB1cGRhdGVzXG5BcHBEaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgc3dpdGNoIChhY3Rpb24uYWN0aW9uVHlwZSkge1xuICAgIC8vIFJhZGlvIGJ1dHRvbnMgY2hhbmdlZCwgZmV0Y2ggbmV3IGRhZy90YXNrIGRhdGFcbiAgICBjYXNlIEZpbHRlckNvbnN0YW50cy5VUERBVEVfRklMVEVSOlxuICAgICAgaWYgKGFjdGlvbi5rZXkgaW4gX3N0b3JlKSB7XG4gICAgICAgIF9zdG9yZVthY3Rpb24ua2V5XSA9IGFjdGlvbi52YWx1ZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJy8nLCAnJyk7XG4gICAgICAgIGlmIChhY3Rpb24ua2V5ID09ICdkYWcnKSB7XG4gICAgICAgICAgRmlsdGVyU3RvcmUuZW1pdChEQUdfU0VUX0VWRU5UKTtcbiAgICAgICAgfVxuICAgICAgICB1cGRhdGVSZXN1bHRzKCk7XG4gICAgICB9IGVsc2UgaWYgKGFjdGlvbi5rZXkgPT0gJ2dyYWluJykge1xuICAgICAgICBpZiAoYWN0aW9uLnZhbHVlLnRvTG93ZXJDYXNlKCkgPT0gJ2RhZycpIHtcbiAgICAgICAgICBfc3RvcmUuZGFnID0gbnVsbDtcbiAgICAgICAgICBEZXRhaWxWaWV3U3RvcmUuc2V0RGFnKG51bGwpO1xuICAgICAgICAgIHVwZGF0ZVJlc3VsdHMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgLy8gVGhlIHNlYXJjaCBjaGFuZ2VkLCByZWZyZXNoIHRoZSBhY2NlcHRhYmxlIGRhZy90YXNrc1xuICAgIGNhc2UgRmlsdGVyQ29uc3RhbnRzLlVQREFURV9TRUFSQ0g6XG4gICAgICBfc3RvcmUuc2VhcmNoRmlsdGVyID0gYWN0aW9uLnNlYXJjaEZpbHRlcjtcbiAgICAgIEZpbHRlclN0b3JlLmVtaXQoRklMVEVSX0NIQU5HRV9FVkVOVCk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgIC8vIG5vIG9wXG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZpbHRlclN0b3JlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5bmNtVm5iM0o1WDJadmMzUmxjaTlrWVhSaExXVnVaeTlvYjI1bGVYQnZkQzlrWlhZdmMyTnlhWEIwY3k5emRHOXlaWE12Um1sc2RHVnlVM1J2Y21VdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqczdPenM3TzBGQlNVRXNTVUZCVFN4aFFVRmhMRWRCUVVjc1QwRkJUeXhEUVVGRExEWkNRVUUyUWl4RFFVRkRMRU5CUVVNN1FVRkROMFFzU1VGQlRTeFpRVUZaTEVkQlFVY3NUMEZCVHl4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRExGbEJRVmtzUTBGQlF6dEJRVU53UkN4SlFVRk5MR1ZCUVdVc1IwRkJSeXhQUVVGUExFTkJRVU1zT0VKQlFUaENMRU5CUVVNc1EwRkJRenRCUVVOb1JTeEpRVUZOTEUxQlFVMHNSMEZCUnl4UFFVRlBMRU5CUVVNc1pVRkJaU3hEUVVGRExFTkJRVU03UVVGRGVFTXNTVUZCVFN4bFFVRmxMRWRCUVVjc1QwRkJUeXhEUVVGRExHMUNRVUZ0UWl4RFFVRkRMRU5CUVVNN08wRkJSWEpFTEVsQlFVMHNiVUpCUVcxQ0xFZEJRVWNzWlVGQlpTeERRVUZETzBGQlF6VkRMRWxCUVUwc1lVRkJZU3hIUVVGSExGbEJRVmtzUTBGQlF6czdRVUZGYmtNc1NVRkJUU3hOUVVGTkxFZEJRVWM3UVVGRFlpeFRRVUZQTEVWQlFVVXNTVUZCU1R0QlFVTmlMRk5CUVU4c1JVRkJSU3hKUVVGSk8wRkJRMklzVFVGQlNTeEZRVUZGTEUxQlFVMDdRVUZEV2l4TFFVRkhMRVZCUVVVc1NVRkJTVHRCUVVOVUxGRkJRVTBzUlVGQlJTeFRRVUZUTzBGQlEycENMR05CUVZrc1JVRkJSU3hGUVVGRkxFVkJRMnBDTEVOQlFVTTdPenM3UVVGSFJpeFRRVUZUTEdGQlFXRXNSMEZCUnp0QlFVTjJRaXhIUVVGRExFTkJRVU1zVDBGQlR5eERRVU5RTEUxQlFVMHNRMEZCUXl4UlFVRlJMRWRCUVVjc1VVRkJVU3hGUVVNeFFqdEJRVU5GTEZkQlFVOHNSVUZCUlN4TlFVRk5MRU5CUVVNc1QwRkJUenRCUVVOMlFpeFJRVUZKTEVWQlFVVXNUVUZCVFN4RFFVRkRMRWxCUVVrN1FVRkRha0lzVDBGQlJ5eEZRVUZGTEUxQlFVMHNRMEZCUXl4SFFVRkhPMGRCUTJoQ0xFVkJRMFFzVlVGQlV5eEpRVUZKTEVWQlFVVTdPMEZCUldJc1VVRkJUU3hMUVVGTExFZEJRVWNzUlVGQlJTeERRVUZETzBGQlEycENMRk5CUVVzc1NVRkJUU3hIUVVGSExFbEJRVWtzU1VGQlNTeEZRVUZGTzBGQlEzUkNMRmRCUVVzc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNN1MwRkRka0k3UVVGRFJDeFZRVUZOTEVOQlFVTXNUMEZCVHl4SFFVRkhMRXRCUVVzc1EwRkJRenRCUVVOMlFpeFZRVUZOTEVOQlFVTXNVVUZCVVN4SFFVRkhMRXRCUVVzc1EwRkJRenRCUVVONFFpeGxRVUZYTEVOQlFVTXNTVUZCU1N4RFFVRkRMRzFDUVVGdFFpeERRVUZETEVOQlFVTTdSMEZEZGtNc1EwRkJReXhEUVVGRE8wTkJRMDQ3TzBGQlIwUXNTVUZCVFN4WFFVRlhMRWRCUVVjc1RVRkJUU3hEUVVGRExFVkJRVVVzUlVGQlJTeFpRVUZaTEVOQlFVTXNVMEZCVXl4RlFVRkZPenRCUVVWeVJDeG5RMEZCT0VJc1JVRkJSU3gzUTBGQlV5eEZRVUZGTEVWQlFVTTdRVUZETVVNc1VVRkJTU3hEUVVGRExFVkJRVVVzUTBGQlF5eHRRa0ZCYlVJc1JVRkJSU3hGUVVGRkxFTkJRVU1zUTBGQlF6dEhRVU5zUXp0QlFVTkVMRzFEUVVGcFF5eEZRVUZGTERKRFFVRlRMRVZCUVVVc1JVRkJRenRCUVVNM1F5eFJRVUZKTEVOQlFVTXNZMEZCWXl4RFFVRkRMRzFDUVVGdFFpeEZRVUZGTEVWQlFVVXNRMEZCUXl4RFFVRkRPMGRCUXpsRE96dEJRVVZFTEcxQ1FVRnBRaXhGUVVGRkxESkNRVUZUTEVWQlFVVXNSVUZCUXp0QlFVTTNRaXhSUVVGSkxFTkJRVU1zUlVGQlJTeERRVUZETEdGQlFXRXNSVUZCUlN4RlFVRkZMRU5CUVVNc1EwRkJRenRIUVVNMVFqdEJRVU5FTEhOQ1FVRnZRaXhGUVVGRkxEaENRVUZUTEVWQlFVVXNSVUZCUXp0QlFVTm9ReXhSUVVGSkxFTkJRVU1zWTBGQll5eERRVUZETEdGQlFXRXNSVUZCUlN4RlFVRkZMRU5CUVVNc1EwRkJRenRIUVVONFF6czdRVUZGUkN4WlFVRlZMRVZCUVVVc2MwSkJRVlU3UVVGRGNFSXNVVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJReXhQUVVGUExFVkJRVVU3UVVGRGJrSXNiVUpCUVdFc1JVRkJSU3hEUVVGRE8wRkJRMmhDTEdGQlFVOHNTVUZCU1N4RFFVRkRPMHRCUTJJN1FVRkRSQ3hYUVVGUExFMUJRVTBzUTBGQlF5eFBRVUZQTEVOQlFVTXNUVUZCVFN4RFFVRkRMRlZCUVZNc1QwRkJUeXhGUVVGRk8wRkJRemRETEdGQlFWRXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU1zVFVGQlRTeERRVUZETEZsQlFWa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRk8wdEJRek5FTEVOQlFVTXNRMEZCUXp0SFFVTktPenRCUVVWRUxHdENRVUZuUWl4RlFVRkZMRFJDUVVGVk8wRkJRekZDTEZGQlFVa3NUVUZCVFN4RFFVRkRMRWRCUVVjc1MwRkJTeXhKUVVGSkxFVkJRVVU3UVVGRGRrSXNZVUZCVHl4RFFVRkRMRmRCUVZjc1JVRkJSU3hOUVVGTkxFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdTMEZEZEVNN1FVRkRSQ3hYUVVGUExFTkJRVU1zVlVGQlZTeEZRVUZGTEUxQlFVMHNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRIUVVWeVF6czdRVUZGUkN4elFrRkJiMElzUlVGQlJTeG5RMEZCVlR0QlFVTTVRaXhSUVVGSkxHRkJRV0VzV1VGQlFTeERRVUZETzBGQlEyeENMRmxCUVZFc1RVRkJUU3hEUVVGRExFOUJRVTg3UVVGRGNFSXNWMEZCU3l4SlFVRkpPMEZCUTFBc2NVSkJRV0VzUjBGQlJ5dzJRa0ZCTmtJc1EwRkJRenRCUVVNNVF5eGpRVUZOTzBGQlFVRXNRVUZEVWl4WFFVRkxMRXRCUVVzN1FVRkRVaXh4UWtGQllTeEhRVUZITERKQ1FVRXlRaXhEUVVGRE8wRkJRelZETEdOQlFVMDdRVUZCUVN4QlFVTlNMRmRCUVVzc1UwRkJVenRCUVVOYUxIRkNRVUZoTEVkQlFVY3NiVUpCUVcxQ0xFTkJRVU03UVVGRGNFTXNZMEZCVFR0QlFVRkJMRUZCUTFJc1YwRkJTeXhWUVVGVk8wRkJRMklzY1VKQlFXRXNSMEZCUnl4dlFrRkJiMElzUTBGQlF6dEJRVU55UXl4alFVRk5PMEZCUVVFc1MwRkRWRHRCUVVORUxGZEJRVThzVlVGQlZTeEhRVU5tTEdGQlFXRXNSMEZEWWl4cFFrRkJhVUlzUjBGRGFrSXNUVUZCVFN4RFFVRkRMRWxCUVVrc1EwRkJReXhYUVVGWExFVkJRVVVzUjBGQlJ5eEhRVUZITEVOQlFVTTdSMEZEYmtNN096dEJRVWRFTEdWQlFXRXNSVUZCUlN4NVFrRkJWVHRCUVVOMlFpeFJRVUZKTEUxQlFVMHNRMEZCUXl4SFFVRkhMRXRCUVVzc1NVRkJTU3hGUVVGRk8wRkJRVU1zWVVGQlR5eEpRVUZKTEVOQlFVTTdTMEZCUXp0QlFVTjJReXhYUVVGUExFdEJRVXNzUTBGQlF6dEhRVU5rT3p0RFFVVkdMRU5CUVVNc1EwRkJRenM3TzBGQlNVZ3NZVUZCWVN4RFFVRkRMRkZCUVZFc1EwRkJReXhWUVVGVExFMUJRVTBzUlVGQlJUdEJRVU4wUXl4VlFVRlBMRTFCUVUwc1EwRkJReXhWUVVGVk96dEJRVVYwUWl4VFFVRkxMR1ZCUVdVc1EwRkJReXhoUVVGaE8wRkJRMmhETEZWQlFVa3NUVUZCVFN4RFFVRkRMRWRCUVVjc1NVRkJTU3hOUVVGTkxFVkJRVVU3UVVGRGVFSXNZMEZCVFN4RFFVRkRMRTFCUVUwc1EwRkJReXhIUVVGSExFTkJRVU1zUjBGQlJ5eE5RVUZOTEVOQlFVTXNTMEZCU3l4RFFVRkRMRmRCUVZjc1JVRkJSU3hEUVVGRExFOUJRVThzUTBGQlF5eEhRVUZITEVWQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNN1FVRkRhRVVzV1VGQlNTeE5RVUZOTEVOQlFVTXNSMEZCUnl4SlFVRkpMRXRCUVVzc1JVRkJSVHRCUVVOMlFpeHhRa0ZCVnl4RFFVRkRMRWxCUVVrc1EwRkJReXhoUVVGaExFTkJRVU1zUTBGQlF6dFRRVU5xUXp0QlFVTkVMSEZDUVVGaExFVkJRVVVzUTBGQlF6dFBRVU5xUWl4TlFVTkpMRWxCUVVrc1RVRkJUU3hEUVVGRExFZEJRVWNzU1VGQlNTeFBRVUZQTEVWQlFVVTdRVUZET1VJc1dVRkJTU3hOUVVGTkxFTkJRVU1zUzBGQlN5eERRVUZETEZkQlFWY3NSVUZCUlN4SlFVRkpMRXRCUVVzc1JVRkJSVHRCUVVOMlF5eG5Ra0ZCVFN4RFFVRkRMRWRCUVVjc1IwRkJSeXhKUVVGSkxFTkJRVU03UVVGRGJFSXNlVUpCUVdVc1EwRkJReXhOUVVGTkxFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdRVUZETjBJc2RVSkJRV0VzUlVGQlJTeERRVUZETzFOQlEycENPMDlCUTBZN1FVRkRSQ3haUVVGTk8wRkJRVUU3UVVGRlVpeFRRVUZMTEdWQlFXVXNRMEZCUXl4aFFVRmhPMEZCUTJoRExGbEJRVTBzUTBGQlF5eFpRVUZaTEVkQlFVY3NUVUZCVFN4RFFVRkRMRmxCUVZrc1EwRkJRenRCUVVNeFF5eHBRa0ZCVnl4RFFVRkRMRWxCUVVrc1EwRkJReXh0UWtGQmJVSXNRMEZCUXl4RFFVRkRPMEZCUTNSRExGbEJRVTA3UVVGQlFTeEJRVU5TTEZsQlFWRTdPMGRCUlZRN1EwRkRSaXhEUVVGRExFTkJRVU03TzBGQlJVZ3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhYUVVGWExFTkJRVU1pTENKbWFXeGxJam9pTDFWelpYSnpMMmR5WldkdmNubGZabTl6ZEdWeUwyUmhkR0V0Wlc1bkwyaHZibVY1Y0c5MEwyUmxkaTl6WTNKcGNIUnpMM04wYjNKbGN5OUdhV3gwWlhKVGRHOXlaUzVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHZJRVpwYkhSbGNsTjBiM0psTG1welhHNHZMeUJVYUdVZ1pteDFlQ0JrWVhSaGMzUnZjbVVnWm05eUlIUm9aU0JzWldaMElITnBaR1ZpWVhKY2JpOHFhbk5vYVc1MElHVnpibVY0ZERvZ2RISjFaU0FxTDF4dVhHNWpiMjV6ZENCQmNIQkVhWE53WVhSamFHVnlJRDBnY21WeGRXbHlaU2duTGk0dlpHbHpjR0YwWTJobGNpOUJjSEJFYVhOd1lYUmphR1Z5SnlrN1hHNWpiMjV6ZENCRmRtVnVkRVZ0YVhSMFpYSWdQU0J5WlhGMWFYSmxLQ2RsZG1WdWRITW5LUzVGZG1WdWRFVnRhWFIwWlhJN1hHNWpiMjV6ZENCR2FXeDBaWEpEYjI1emRHRnVkSE1nUFNCeVpYRjFhWEpsS0NjdUxpOWpiMjV6ZEdGdWRITXZSbWxzZEdWeVEyOXVjM1JoYm5Sekp5azdYRzVqYjI1emRDQmhjM05wWjI0Z1BTQnlaWEYxYVhKbEtDZHZZbXBsWTNRdFlYTnphV2R1SnlrN1hHNWpiMjV6ZENCRVpYUmhhV3hXYVdWM1UzUnZjbVVnUFNCeVpYRjFhWEpsS0NjdUwwUmxkR0ZwYkZacFpYZFRkRzl5WlNjcE8xeHVYRzVqYjI1emRDQkdTVXhVUlZKZlEwaEJUa2RGWDBWV1JVNVVJRDBnSjJacGJIUmxjbDlqYUdGdVoyVW5PMXh1WTI5dWMzUWdSRUZIWDFORlZGOUZWa1ZPVkNBOUlDZGtZV2RmWTJodmMyVnVKenRjYmx4dVkyOXVjM1FnWDNOMGIzSmxJRDBnZTF4dUlDQnlaWE4xYkhSek9pQnVkV3hzTENBdkx5QlVhR1VnWTNWeWNtVnVkQ0JrWVdkekwzUmhjMnR6SUd4cGMzUmxaQ0J2YmlCMGFHVWdjMmxrWldKaGNpQjNMeUIyWVd4MVpYTmNiaUFnYldWaGMzVnlaVG9nSjJsdkp5d2dMeThnVkdobElHTjFjbkpsYm5RZ1ptbHNkR1Z5SUcxbFlYTjFjbVZjYmlBZ2RHbHRaVG9nSjNkbFpXc25MQ0F2THlCVWFHVWdZM1Z5Y21WdWRDQm1hV3gwWlhJZ2RHbHRaU0J5WVc1blpWeHVJQ0JrWVdjNklHNTFiR3dzSUM4dklGUm9aU0JqZFhKeVpXNTBiSGtnYzJWc1pXTjBaV1FnZEdGemF5QnZjaUJrWVdkY2JpQWdZMmhoYm1kbE9pQW5jR1Z5WTJWdWRDY3NJQzh2SUZkb1pYUm9aWElnZEdobElHWnBiSFJsY2lCemFHOTNjeUJoWW5OdmJIVjBaU0J2Y2lCeVpXeGhkR2wyWlNCamFHRnVaMlZjYmlBZ2MyVmhjbU5vUm1sc2RHVnlPaUFuSnl3Z0x5OGdWR2hsSUdOdmJuUmxiblJ6SUc5bUlIUm9aU0J6WldGeVkyZ2dZbUZ5SUhSb1lYUWdabWxzZEdWeWN5QnlaWE4xYkhSelhHNTlPMXh1WEc0dkx5QkdhWEpsY3lCdlppQmhiaUJCYW1GNElHZGxkQ0J5WlhGMVpYTjBJSFJ2SUhSb1pTQnpaWEoyWlhJZ2RHOGdaMlYwSUdSaFozTXZkR0Z6YTNNZ1ptOXlJSE5wWkdWaVlYSmNibVoxYm1OMGFXOXVJSFZ3WkdGMFpWSmxjM1ZzZEhNb0tTQjdYRzRnSUNRdVoyVjBTbE5QVGloY2JpQWdJQ0IzYVc1a2IzY3ViRzlqWVhScGIyNGdLeUFuWm1sc2RHVnlKeXhjYmlBZ0lDQjdYRzRnSUNBZ0lDQnRaV0Z6ZFhKbE9pQmZjM1J2Y21VdWJXVmhjM1Z5WlN4Y2JpQWdJQ0FnSUhScGJXVTZJRjl6ZEc5eVpTNTBhVzFsTEZ4dUlDQWdJQ0FnWkdGbk9pQmZjM1J2Y21VdVpHRm5MRnh1SUNBZ0lIMHNYRzRnSUNBZ1puVnVZM1JwYjI0b1pHRjBZU2tnZTF4dUlDQWdJQ0FnTHk4Z1kyOXVkbVZ5ZENCa2FXTjBJSFJ2SUdGeWNtRjVYRzRnSUNBZ0lDQmpiMjV6ZENCaGNuSmhlU0E5SUZ0ZE8xeHVJQ0FnSUNBZ1ptOXlJQ2hqYjI1emRDQnJaWGtnYVc0Z1pHRjBZU2tnZTF4dUlDQWdJQ0FnSUNCaGNuSmhlUzV3ZFhOb0tHUmhkR0ZiYTJWNVhTazdYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQmZjM1J2Y21VdWNtVnpkV3gwY3lBOUlHRnljbUY1TzF4dUlDQWdJQ0FnWDNOMGIzSmxMblZ3WkdGMGFXNW5JRDBnWm1Gc2MyVTdYRzRnSUNBZ0lDQkdhV3gwWlhKVGRHOXlaUzVsYldsMEtFWkpURlJGVWw5RFNFRk9SMFZmUlZaRlRsUXBPMXh1SUNBZ0lIMHBPMXh1ZlNCY2JseHVYRzVqYjI1emRDQkdhV3gwWlhKVGRHOXlaU0E5SUdGemMybG5iaWg3ZlN3Z1JYWmxiblJGYldsMGRHVnlMbkJ5YjNSdmRIbHdaU3dnZTF4dUlDQXZMeUJNYVhOMFpXNWxjaUJtYjNJZ2QyaGxiaUJ5WVdScGJ5QmlkWFIwYjI0Z1kyaGhibWRsY3lCaGJtUWdjbVZ6ZFd4MGN5QnVaV1ZrSUhSdklIVndaR0YwWlZ4dUlDQmhaR1JHYVd4MFpYSlNaWE4xYkhSelEyaGhibWRsVEdsemRHVnVaWEk2SUdaMWJtTjBhVzl1S0dOaUtYdGNiaUFnSUNCMGFHbHpMbTl1S0VaSlRGUkZVbDlEU0VGT1IwVmZSVlpGVGxRc0lHTmlLVHRjYmlBZ2ZTeGNiaUFnY21WdGIzWmxSbWxzZEdWeVVtVnpkV3gwYzBOb1lXNW5aVXhwYzNSbGJtVnlPaUJtZFc1amRHbHZiaWhqWWlsN1hHNGdJQ0FnZEdocGN5NXlaVzF2ZG1WTWFYTjBaVzVsY2loR1NVeFVSVkpmUTBoQlRrZEZYMFZXUlU1VUxDQmpZaWs3WEc0Z0lIMHNYRzRnSUM4dklFeHBjM1JsYm1WeUlHWnZjaUIzYUdWdUlHUmhaeUJwY3lCelpYUWdZVzVrSUdKMWRIUnZiaUJ1WldWa2N5QjBieUIxY0dSaGRHVmNiaUFnWVdSa1JHRm5VMlYwVEdsemRHVnVaWEk2SUdaMWJtTjBhVzl1S0dOaUtYdGNiaUFnSUNCMGFHbHpMbTl1S0VSQlIxOVRSVlJmUlZaRlRsUXNJR05pS1R0Y2JpQWdmU3hjYmlBZ2NtVnRiM1psUkdGblUyVjBUR2x6ZEdWdVpYSTZJR1oxYm1OMGFXOXVLR05pS1h0Y2JpQWdJQ0IwYUdsekxuSmxiVzkyWlV4cGMzUmxibVZ5S0VSQlIxOVRSVlJmUlZaRlRsUXNJR05pS1R0Y2JpQWdmU3hjYmlBZ0x5OGdSMlYwZEdWeUlHWnZjaUJ5WlhOMWJIUnpJSFJvWVhRZ1ptVjBZMmhsY3lCeVpYTjFiSFJ6SUdsbUlITjBiM0psSUdseklHVnRjSFI1WEc0Z0lHZGxkRkpsYzNWc2RITTZJR1oxYm1OMGFXOXVLQ2w3WEc0Z0lDQWdhV1lnS0NGZmMzUnZjbVV1Y21WemRXeDBjeWtnZTF4dUlDQWdJQ0FnZFhCa1lYUmxVbVZ6ZFd4MGN5Z3BPMXh1SUNBZ0lDQWdjbVYwZFhKdUlHNTFiR3c3WEc0Z0lDQWdmVnh1SUNBZ0lISmxkSFZ5YmlCZmMzUnZjbVV1Y21WemRXeDBjeTVtYVd4MFpYSW9ablZ1WTNScGIyNG9aV3hsYldWdWRDa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlDaGxiR1Z0Wlc1MExtNWhiV1V1YVc1a1pYaFBaaWhmYzNSdmNtVXVjMlZoY21Ob1JtbHNkR1Z5S1NBaFBUMGdMVEVwTzF4dUlDQWdJSDBwTzF4dUlDQjlMRnh1SUNBdkx5QlVjbUZ1YzJsbGJuUWdaMlYwZEdWeUlIUm9ZWFFnWTJGc1kzVnNZWFJsY3lCb1pXRmtaWEp6SUdWMlpYSjVJSFJwYldWY2JpQWdaMlYwVW1WemRXeDBTR1ZoWkdWeWN6b2dablZ1WTNScGIyNG9LWHRjYmlBZ0lDQnBaaUFvWDNOMGIzSmxMbVJoWnlBaFBUMGdiblZzYkNrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUZzbmRHRnpheUJ1WVcxbEp5d2dYM04wYjNKbExtMWxZWE4xY21WZE8xeHVJQ0FnSUgxY2JpQWdJQ0J5WlhSMWNtNGdXeWRrWVdjZ2JtRnRaU2NzSUY5emRHOXlaUzV0WldGemRYSmxYVHRjYmx4dUlDQjlMRnh1SUNBdkx5QlVjbUZ1YzJsbGJuUWdaMlYwZEdWeUlIUm9ZWFFnWTJGc1kzVnNZWFJsY3lCbWFXeDBaWElnWkdWelkzSnBjSFJwYjI0Z2MzUnlhVzVuWEc0Z0lHZGxkRVJsYzJOeWFYQjBhVzl1VTNSeWFXNW5PaUJtZFc1amRHbHZiaWdwZTF4dUlDQWdJR3hsZENCdFpXRnpkWEpsVTNSeWFXNW5PMXh1SUNBZ0lITjNhWFJqYUNBb1gzTjBiM0psTG0xbFlYTjFjbVVwSUh0Y2JpQWdJQ0FnSUdOaGMyVWdKMmx2SnpwY2JpQWdJQ0FnSUNBZ2JXVmhjM1Z5WlZOMGNtbHVaeUE5SUNkeVpXRmtJR0Z1WkNCM2NtbDBaU0J2Y0dWeVlYUnZjbWx2Ym5Nbk8xeHVJQ0FnSUNBZ0lDQmljbVZoYXp0Y2JpQWdJQ0FnSUdOaGMyVWdKMk53ZFNjNlhHNGdJQ0FnSUNBZ0lHMWxZWE4xY21WVGRISnBibWNnUFNBbmRHOTBZV3dnWTNCMUlIUnBiV1VnYVc0Z2MyVmpiMjVrY3ljN1hHNGdJQ0FnSUNBZ0lHSnlaV0ZyTzF4dUlDQWdJQ0FnWTJGelpTQW5iV0Z3Y0dWeWN5YzZYRzRnSUNBZ0lDQWdJRzFsWVhOMWNtVlRkSEpwYm1jZ1BTQW5iblZ0WW1WeUlHOW1JRzFoY0hCbGNuTW5PMXh1SUNBZ0lDQWdJQ0JpY21WaGF6dGNiaUFnSUNBZ0lHTmhjMlVnSjNKbFpIVmpaWEp6SnpwY2JpQWdJQ0FnSUNBZ2JXVmhjM1Z5WlZOMGNtbHVaeUE5SUNkdWRXMWlaWElnYjJZZ2NtVmtkV05sY25Nbk8xeHVJQ0FnSUNBZ0lDQmljbVZoYXp0Y2JpQWdJQ0I5WEc0Z0lDQWdjbVYwZFhKdUlDZEJkbVZ5WVdkbElDY2dLMXh1SUNBZ0lDQWdiV1ZoYzNWeVpWTjBjbWx1WnlBclhHNGdJQ0FnSUNBbklHOTJaWElnZEdobElHeGhjM1FnSnlBclhHNGdJQ0FnSUNCZmMzUnZjbVV1ZEdsdFpTNTBiMHh2ZDJWeVEyRnpaU2dwSUNzZ0p5NG5PMXh1SUNCOUxGeHVYRzRnSUM4dklGSmxkSFZ5YmlCaElHSnZiMndnWVhNZ2RHOGdkMmhsZEdobGNpQm1hV3gwWlhJZ2NtVnpkV3gwY3lCaGNtVWdaR0ZuY3lCdmNpQjBZWE5yYzF4dUlDQnBjMU5vYjNkcGJtZEVZV2R6T2lCbWRXNWpkR2x2YmlncGUxeHVJQ0FnSUdsbUlDaGZjM1J2Y21VdVpHRm5JRDA5UFNCdWRXeHNLU0I3Y21WMGRYSnVJSFJ5ZFdVN2ZWeHVJQ0FnSUhKbGRIVnliaUJtWVd4elpUdGNiaUFnZlZ4dVhHNTlLVHRjYmx4dVhHNHZMeUJTWldkcGMzUmxjaUJqWVd4c1ltRmpheUIwYnlCb1lXNWtiR1VnWVd4c0lIVndaR0YwWlhOY2JrRndjRVJwYzNCaGRHTm9aWEl1Y21WbmFYTjBaWElvWm5WdVkzUnBiMjRvWVdOMGFXOXVLU0I3WEc0Z0lITjNhWFJqYUNoaFkzUnBiMjR1WVdOMGFXOXVWSGx3WlNrZ2UxeHVJQ0FnSUM4dklGSmhaR2x2SUdKMWRIUnZibk1nWTJoaGJtZGxaQ3dnWm1WMFkyZ2dibVYzSUdSaFp5OTBZWE5ySUdSaGRHRmNiaUFnSUNCallYTmxJRVpwYkhSbGNrTnZibk4wWVc1MGN5NVZVRVJCVkVWZlJrbE1WRVZTT2x4dUlDQWdJQ0FnYVdZZ0tHRmpkR2x2Ymk1clpYa2dhVzRnWDNOMGIzSmxLU0I3WEc0Z0lDQWdJQ0FnSUY5emRHOXlaVnRoWTNScGIyNHVhMlY1WFNBOUlHRmpkR2x2Ymk1MllXeDFaUzUwYjB4dmQyVnlRMkZ6WlNncExuSmxjR3hoWTJVb0p5OG5MQ2NuS1R0Y2JpQWdJQ0FnSUNBZ2FXWWdLR0ZqZEdsdmJpNXJaWGtnUFQwZ0oyUmhaeWNwSUh0Y2JpQWdJQ0FnSUNBZ0lDQkdhV3gwWlhKVGRHOXlaUzVsYldsMEtFUkJSMTlUUlZSZlJWWkZUbFFwTzF4dUlDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lIVndaR0YwWlZKbGMzVnNkSE1vS1R0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0FnSUdWc2MyVWdhV1lnS0dGamRHbHZiaTVyWlhrZ1BUMGdKMmR5WVdsdUp5a2dlMXh1SUNBZ0lDQWdJQ0JwWmlBb1lXTjBhVzl1TG5aaGJIVmxMblJ2VEc5M1pYSkRZWE5sS0NrZ1BUMGdKMlJoWnljcElIdGNiaUFnSUNBZ0lDQWdJQ0JmYzNSdmNtVXVaR0ZuSUQwZ2JuVnNiRHRjYmlBZ0lDQWdJQ0FnSUNCRVpYUmhhV3hXYVdWM1UzUnZjbVV1YzJWMFJHRm5LRzUxYkd3cE8xeHVJQ0FnSUNBZ0lDQWdJSFZ3WkdGMFpWSmxjM1ZzZEhNb0tUdGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdmVnh1SUNBZ0lDQWdZbkpsWVdzN1hHNGdJQ0FnTHk4Z1ZHaGxJSE5sWVhKamFDQmphR0Z1WjJWa0xDQnlaV1p5WlhOb0lIUm9aU0JoWTJObGNIUmhZbXhsSUdSaFp5OTBZWE5yYzF4dUlDQWdJR05oYzJVZ1JtbHNkR1Z5UTI5dWMzUmhiblJ6TGxWUVJFRlVSVjlUUlVGU1EwZzZYRzRnSUNBZ0lDQmZjM1J2Y21VdWMyVmhjbU5vUm1sc2RHVnlJRDBnWVdOMGFXOXVMbk5sWVhKamFFWnBiSFJsY2p0Y2JpQWdJQ0FnSUVacGJIUmxjbE4wYjNKbExtVnRhWFFvUmtsTVZFVlNYME5JUVU1SFJWOUZWa1ZPVkNrN1hHNGdJQ0FnSUNCaWNtVmhhenRjYmlBZ0lDQmtaV1poZFd4ME9seHVJQ0FnSUNBZ0x5OGdibThnYjNCY2JpQWdmVnh1ZlNrN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdSbWxzZEdWeVUzUnZjbVU3WEc0aVhYMD0iLCIvLyBDaGFydC5qc1xuLy8gVGhlIGJyaWRnZSBiZXR3ZWVuIFJlYWN0IGFuZCBEM1xuLypqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIERldGFpbFZpZXdTdG9yZSA9IHJlcXVpcmUoJy4uL3N0b3Jlcy9EZXRhaWxWaWV3U3RvcmUnKTtcbnZhciBkM0NoYXJ0ID0gcmVxdWlyZSgnLi9kM0NoYXJ0LmpzJyk7XG5cbnZhciBDaGFydCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdDaGFydCcsXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIHsgZGF0YTogRGV0YWlsVmlld1N0b3JlLmdldERhdGEoKSB9O1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB2YXIgZWwgPSBSZWFjdC5maW5kRE9NTm9kZSh0aGlzKTtcbiAgICBEZXRhaWxWaWV3U3RvcmUuYWRkRGF0YVVwZGF0ZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgICBkM0NoYXJ0LmNyZWF0ZShlbCk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkVXBkYXRlOiBmdW5jdGlvbiBjb21wb25lbnREaWRVcGRhdGUoKSB7XG4gICAgZDNDaGFydC51cGRhdGUodGhpcy5zdGF0ZS5kYXRhKTtcbiAgfSxcblxuICBfb25DaGFuZ2U6IGZ1bmN0aW9uIF9vbkNoYW5nZSgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGRhdGE6IERldGFpbFZpZXdTdG9yZS5nZXREYXRhKClcbiAgICB9KTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24gY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgRGV0YWlsVmlld1N0b3JlLnJlbW92ZURhdGFVcGRhdGVMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgY2xhc3NOYW1lOiAnY2hhcnQnIH0pO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDaGFydDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OW5jbVZuYjNKNVgyWnZjM1JsY2k5a1lYUmhMV1Z1Wnk5b2IyNWxlWEJ2ZEM5a1pYWXZjMk55YVhCMGN5OTFhUzlEYUdGeWRDNXFjM2dpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanM3T3pzN08wRkJTVUVzU1VGQlRTeGxRVUZsTEVkQlFVY3NUMEZCVHl4RFFVRkRMREpDUVVFeVFpeERRVUZETEVOQlFVTTdRVUZETjBRc1NVRkJUU3hQUVVGUExFZEJRVWNzVDBGQlR5eERRVUZETEdOQlFXTXNRMEZCUXl4RFFVRkRPenRCUVVWNFF5eEpRVUZOTEV0QlFVc3NSMEZCUnl4TFFVRkxMRU5CUVVNc1YwRkJWeXhEUVVGRE96czdRVUZGT1VJc2FVSkJRV1VzUlVGQlJTd3lRa0ZCVnp0QlFVTXhRaXhYUVVGUExFVkJRVU1zU1VGQlNTeEZRVUZGTEdWQlFXVXNRMEZCUXl4UFFVRlBMRVZCUVVVc1JVRkJReXhEUVVGRE8wZEJRekZET3p0QlFVVkVMRzFDUVVGcFFpeEZRVUZGTERaQ1FVRlhPMEZCUXpWQ0xGRkJRVTBzUlVGQlJTeEhRVUZITEV0QlFVc3NRMEZCUXl4WFFVRlhMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UVVGRGJrTXNiVUpCUVdVc1EwRkJReXh4UWtGQmNVSXNRMEZCUXl4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03UVVGRGRFUXNWMEZCVHl4RFFVRkRMRTFCUVUwc1EwRkJReXhGUVVGRkxFTkJRVU1zUTBGQlF6dEhRVU53UWpzN1FVRkZSQ3h2UWtGQmEwSXNSVUZCUlN3NFFrRkJWenRCUVVNM1FpeFhRVUZQTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdSMEZEYWtNN08wRkJSVVFzVjBGQlV5eEZRVUZGTEhGQ1FVRlhPMEZCUTNCQ0xGRkJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTTdRVUZEV2l4VlFVRkpMRVZCUVVVc1pVRkJaU3hEUVVGRExFOUJRVThzUlVGQlJUdExRVU5vUXl4RFFVRkRMRU5CUVVNN1IwRkRTanM3UVVGRlJDeHpRa0ZCYjBJc1JVRkJSU3huUTBGQlZ6dEJRVU12UWl4dFFrRkJaU3hEUVVGRExIZENRVUYzUWl4RFFVRkRMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dEhRVU14UkRzN1FVRkZSQ3hSUVVGTkxFVkJRVVVzYTBKQlFWYzdRVUZEYWtJc1YwRkRSU3cyUWtGQlN5eFRRVUZUTEVWQlFVTXNUMEZCVHl4SFFVRlBMRU5CUXpkQ08wZEJRMGc3UTBGRFJpeERRVUZETEVOQlFVTTdPMEZCUlVnc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eExRVUZMTEVOQlFVTWlMQ0ptYVd4bElqb2lMMVZ6WlhKekwyZHlaV2R2Y25sZlptOXpkR1Z5TDJSaGRHRXRaVzVuTDJodmJtVjVjRzkwTDJSbGRpOXpZM0pwY0hSekwzVnBMME5vWVhKMExtcHplQ0lzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWk4dklFTm9ZWEowTG1welhHNHZMeUJVYUdVZ1luSnBaR2RsSUdKbGRIZGxaVzRnVW1WaFkzUWdZVzVrSUVRelhHNHZLbXB6YUdsdWRDQmxjMjVsZUhRNklIUnlkV1VnS2k5Y2JpQmNibU52Ym5OMElFUmxkR0ZwYkZacFpYZFRkRzl5WlNBOUlISmxjWFZwY21Vb0p5NHVMM04wYjNKbGN5OUVaWFJoYVd4V2FXVjNVM1J2Y21VbktUdGNibU52Ym5OMElHUXpRMmhoY25RZ1BTQnlaWEYxYVhKbEtDY3VMMlF6UTJoaGNuUXVhbk1uS1R0Y2JseHVZMjl1YzNRZ1EyaGhjblFnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hHNGdJRnh1SUNCblpYUkpibWwwYVdGc1UzUmhkR1U2SUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUI3WkdGMFlUb2dSR1YwWVdsc1ZtbGxkMU4wYjNKbExtZGxkRVJoZEdFb0tYMDdYRzRnSUgwc1hHNWNiaUFnWTI5dGNHOXVaVzUwUkdsa1RXOTFiblE2SUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0FnSUdOdmJuTjBJR1ZzSUQwZ1VtVmhZM1F1Wm1sdVpFUlBUVTV2WkdVb2RHaHBjeWs3WEc0Z0lDQWdSR1YwWVdsc1ZtbGxkMU4wYjNKbExtRmtaRVJoZEdGVmNHUmhkR1ZNYVhOMFpXNWxjaWgwYUdsekxsOXZia05vWVc1blpTazdYRzRnSUNBZ1pETkRhR0Z5ZEM1amNtVmhkR1VvWld3cE8xeHVJQ0I5TEZ4dVhHNGdJR052YlhCdmJtVnVkRVJwWkZWd1pHRjBaVG9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnWkRORGFHRnlkQzUxY0dSaGRHVW9kR2hwY3k1emRHRjBaUzVrWVhSaEtUdGNiaUFnZlN4Y2JseHVJQ0JmYjI1RGFHRnVaMlU2SUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0FnSUhSb2FYTXVjMlYwVTNSaGRHVW9lMXh1SUNBZ0lDQWdaR0YwWVRvZ1JHVjBZV2xzVm1sbGQxTjBiM0psTG1kbGRFUmhkR0VvS1Z4dUlDQWdJSDBwTzF4dUlDQjlMRnh1WEc0Z0lHTnZiWEJ2Ym1WdWRGZHBiR3hWYm0xdmRXNTBPaUJtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0JFWlhSaGFXeFdhV1YzVTNSdmNtVXVjbVZ0YjNabFJHRjBZVlZ3WkdGMFpVeHBjM1JsYm1WeUtIUm9hWE11WDI5dVEyaGhibWRsS1R0Y2JpQWdmU3hjYmx4dUlDQnlaVzVrWlhJNklHWjFibU4wYVc5dUtDa2dlMXh1SUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDBuWTJoaGNuUW5Qand2WkdsMlBseHVJQ0FnSUNrN1hHNGdJSDFjYm4wcE8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRU5vWVhKME8xeHVJbDE5IiwiLypqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIERldGFpbFZpZXdTdG9yZSA9IHJlcXVpcmUoJy4uL3N0b3Jlcy9EZXRhaWxWaWV3U3RvcmUnKTtcbnZhciBEZXRhaWxWaWV3QWN0aW9ucyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvRGV0YWlsVmlld0FjdGlvbnMnKTtcblxudmFyIERldGFpbFRleHQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnRGV0YWlsVGV4dCcsXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIERldGFpbFZpZXdTdG9yZS5nZXRTdG9yZSgpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBEZXRhaWxWaWV3U3RvcmUuYWRkRGF0YVVwZGF0ZUxpc3RlbmVyKHRoaXMuX29uTWV0YWRhdGFDaGFuZ2UpO1xuICAgIERldGFpbFZpZXdTdG9yZS5hZGRGb2N1c1VwZGF0ZUxpc3RlbmVyKHRoaXMuX29uRm9jdXNDaGFuZ2UpO1xuICAgIERldGFpbFZpZXdTdG9yZS5hZGRNZWFzdXJlQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25NZWFzdXJlQ2hhbmdlKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRVbm1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRVbm1vdW50KCkge1xuICAgIERldGFpbFZpZXdTdG9yZS5yZW1vdmVEYXRhVXBkYXRlTGlzdGVuZXIodGhpcy5fb25NZXRhZGF0YUNoYW5nZSk7XG4gICAgRGV0YWlsVmlld1N0b3JlLnJlbW92ZUZvY3VzVXBkYXRlTGlzdGVuZXIodGhpcy5fb25Gb2N1c0NoYW5nZSk7XG4gICAgRGV0YWlsVmlld1N0b3JlLnJlbW92ZU1lYXN1cmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbk1lYXN1cmVDaGFuZ2UpO1xuICB9LFxuXG4gIF9vbkZvY3VzQ2hhbmdlOiBmdW5jdGlvbiBfb25Gb2N1c0NoYW5nZSgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGZvY3VzVmFsdWU6IERldGFpbFZpZXdTdG9yZS5nZXRGb2N1c1ZhbHVlKCksXG4gICAgICBmb2N1c0RhdGU6IERldGFpbFZpZXdTdG9yZS5nZXRGb2N1c0RhdGUoKVxuICAgIH0pO1xuICB9LFxuXG4gIF9vbk1lYXN1cmVDaGFuZ2U6IGZ1bmN0aW9uIF9vbk1lYXN1cmVDaGFuZ2UoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBtZWFzdXJlOiBEZXRhaWxWaWV3U3RvcmUuZ2V0TWVhc3VyZSgpXG4gICAgfSk7XG4gIH0sXG5cbiAgX29uTWV0YWRhdGFDaGFuZ2U6IGZ1bmN0aW9uIF9vbk1ldGFkYXRhQ2hhbmdlKCkge1xuICAgIHZhciBkZXRhaWxzID0gRGV0YWlsVmlld1N0b3JlLmdldERldGFpbHMoKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG5hbWU6IGRldGFpbHMubmFtZSxcbiAgICAgIG93bmVyOiBkZXRhaWxzLm93bmVyXG4gICAgfSk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIGZvY3VzRGF0ZSA9IERldGFpbFZpZXdTdG9yZS5nZXRGb2N1c0RhdGUoKTtcbiAgICB2YXIgZm9ybWF0dGVkRm9jdXNEYXRlID0gXCJcIjtcbiAgICBpZiAoZm9jdXNEYXRlKSB7XG4gICAgICBmb3JtYXR0ZWRGb2N1c0RhdGUgPSBmb2N1c0RhdGUuZ2V0TW9udGgoKSArIDEgKyAnLycgKyBmb2N1c0RhdGUuZ2V0RGF0ZSgpICsgJy8nICsgZm9jdXNEYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgfVxuICAgIHZhciBudW1iZXJGb3JtYXR0ZXIgPSBkMy5mb3JtYXQoJy4zcycpO1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ2RpdicsXG4gICAgICB7IGNsYXNzTmFtZTogJ2RldGFpbFRleHQnIH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICd0aXRsZVJvdycgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnaDEnLFxuICAgICAgICAgIHsgY2xhc3NOYW1lOiAnY3VySWQnIH0sXG4gICAgICAgICAgdGhpcy5zdGF0ZS5uYW1lXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2gxJyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ21lYXN1cmUnIH0sXG4gICAgICAgICAgdGhpcy5zdGF0ZS5tZWFzdXJlXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2gxJyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ2ZvY3VzVmFsJyB9LFxuICAgICAgICAgIG51bWJlckZvcm1hdHRlcih0aGlzLnN0YXRlLmZvY3VzVmFsdWUpXG4gICAgICAgIClcbiAgICAgICksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IGNsYXNzTmFtZTogJ2RpdmlkZXInIH0pLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHsgY2xhc3NOYW1lOiAnaW5mb1JvdycgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAncCcsXG4gICAgICAgICAgeyBjbGFzc05hbWU6ICdvd25lcicgfSxcbiAgICAgICAgICB0aGlzLnN0YXRlLm93bmVyXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ3AnLFxuICAgICAgICAgIHsgY2xhc3NOYW1lOiAnZm9jdXNEYXRlJyB9LFxuICAgICAgICAgIGZvcm1hdHRlZEZvY3VzRGF0ZVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGV0YWlsVGV4dDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OW5jbVZuYjNKNVgyWnZjM1JsY2k5a1lYUmhMV1Z1Wnk5b2IyNWxlWEJ2ZEM5a1pYWXZjMk55YVhCMGN5OTFhUzlFWlhSaGFXeFVaWGgwTG1wemVDSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPMEZCUlVFc1NVRkJUU3hsUVVGbExFZEJRVWNzVDBGQlR5eERRVUZETERKQ1FVRXlRaXhEUVVGRExFTkJRVU03UVVGRE4wUXNTVUZCVFN4cFFrRkJhVUlzUjBGQlJ5eFBRVUZQTEVOQlFVTXNPRUpCUVRoQ0xFTkJRVU1zUTBGQlF6czdRVUZGYkVVc1NVRkJUU3hWUVVGVkxFZEJRVWNzUzBGQlN5eERRVUZETEZkQlFWY3NRMEZCUXpzN08wRkJSVzVETEdsQ1FVRmxMRVZCUVVVc01rSkJRVmM3UVVGRE1VSXNWMEZCVHl4bFFVRmxMRU5CUVVNc1VVRkJVU3hGUVVGRkxFTkJRVU03UjBGRGJrTTdPMEZCUlVRc2JVSkJRV2xDTEVWQlFVVXNOa0pCUVZjN1FVRkROVUlzYlVKQlFXVXNRMEZEV2l4eFFrRkJjVUlzUTBGQlF5eEpRVUZKTEVOQlFVTXNhVUpCUVdsQ0xFTkJRVU1zUTBGQlF6dEJRVU5xUkN4dFFrRkJaU3hEUVVOYUxITkNRVUZ6UWl4RFFVRkRMRWxCUVVrc1EwRkJReXhqUVVGakxFTkJRVU1zUTBGQlF6dEJRVU12UXl4dFFrRkJaU3hEUVVOYUxIZENRVUYzUWl4RFFVRkRMRWxCUVVrc1EwRkJReXhuUWtGQlowSXNRMEZCUXl4RFFVRkRPMGRCUTNCRU96dEJRVVZFTEhGQ1FVRnRRaXhGUVVGRkxDdENRVUZYTzBGQlF6bENMRzFDUVVGbExFTkJRMW9zZDBKQlFYZENMRU5CUVVNc1NVRkJTU3hEUVVGRExHbENRVUZwUWl4RFFVRkRMRU5CUVVNN1FVRkRjRVFzYlVKQlFXVXNRMEZEV2l4NVFrRkJlVUlzUTBGQlF5eEpRVUZKTEVOQlFVTXNZMEZCWXl4RFFVRkRMRU5CUVVNN1FVRkRiRVFzYlVKQlFXVXNRMEZEV2l3eVFrRkJNa0lzUTBGQlF5eEpRVUZKTEVOQlFVTXNaMEpCUVdkQ0xFTkJRVU1zUTBGQlF6dEhRVU4yUkRzN1FVRkZSQ3huUWtGQll5eEZRVUZGTERCQ1FVRlZPMEZCUTNoQ0xGRkJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTTdRVUZEV2l4blFrRkJWU3hGUVVGRExHVkJRV1VzUTBGQlF5eGhRVUZoTEVWQlFVVTdRVUZETVVNc1pVRkJVeXhGUVVGRExHVkJRV1VzUTBGQlF5eFpRVUZaTEVWQlFVVTdTMEZEZWtNc1EwRkJReXhEUVVGRE8wZEJRMG83TzBGQlJVUXNhMEpCUVdkQ0xFVkJRVVVzTkVKQlFWVTdRVUZETVVJc1VVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF6dEJRVU5hTEdGQlFVOHNSVUZCUXl4bFFVRmxMRU5CUVVNc1ZVRkJWU3hGUVVGRk8wdEJRM0pETEVOQlFVTXNRMEZCUXp0SFFVTktPenRCUVVWRUxHMUNRVUZwUWl4RlFVRkZMRFpDUVVGVk8wRkJRek5DTEZGQlFVMHNUMEZCVHl4SFFVRkhMR1ZCUVdVc1EwRkJReXhWUVVGVkxFVkJRVVVzUTBGQlF6dEJRVU0zUXl4UlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRE8wRkJRMW9zVlVGQlNTeEZRVUZGTEU5QlFVOHNRMEZCUXl4SlFVRkpPMEZCUTJ4Q0xGZEJRVXNzUlVGQlJTeFBRVUZQTEVOQlFVTXNTMEZCU3p0TFFVTnlRaXhEUVVGRExFTkJRVU03UjBGRFNqczdRVUZGUkN4UlFVRk5MRVZCUVVVc2EwSkJRVmM3UVVGRGFrSXNVVUZCVFN4VFFVRlRMRWRCUVVjc1pVRkJaU3hEUVVGRExGbEJRVmtzUlVGQlJTeERRVUZETzBGQlEycEVMRkZCUVVrc2EwSkJRV3RDTEVkQlFVY3NSVUZCUlN4RFFVRkRPMEZCUXpWQ0xGRkJRVWtzVTBGQlV5eEZRVUZGTzBGQlEySXNkMEpCUVd0Q0xFZEJRVWNzUVVGQlF5eFRRVUZUTEVOQlFVTXNVVUZCVVN4RlFVRkZMRWRCUVVjc1EwRkJReXhIUVVNNVF5eEhRVUZITEVkQlFVY3NVMEZCVXl4RFFVRkRMRTlCUVU4c1JVRkJSU3hIUVVONlFpeEhRVUZITEVkQlFVY3NVMEZCVXl4RFFVRkRMRmRCUVZjc1JVRkJSU3hEUVVGRE8wdEJReTlDTzBGQlEwUXNVVUZCVFN4bFFVRmxMRWRCUVVjc1JVRkJSU3hEUVVGRExFMUJRVTBzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXp0QlFVTjZReXhYUVVORk96dFJRVUZMTEZOQlFWTXNSVUZCUXl4WlFVRlpPMDFCUTNwQ096dFZRVUZMTEZOQlFWTXNSVUZCUXl4VlFVRlZPMUZCUTNaQ096dFpRVUZKTEZOQlFWTXNSVUZCUXl4UFFVRlBPMVZCUVVVc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eEpRVUZKTzFOQlFVMDdVVUZETlVNN08xbEJRVWtzVTBGQlV5eEZRVUZETEZOQlFWTTdWVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFOUJRVTg3VTBGQlRUdFJRVU5xUkRzN1dVRkJTU3hUUVVGVExFVkJRVU1zVlVGQlZUdFZRVUZGTEdWQlFXVXNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGVkJRVlVzUTBGQlF6dFRRVUZOTzA5QlEyeEZPMDFCUTA0c05rSkJRVXNzVTBGQlV5eEZRVUZETEZOQlFWTXNSMEZCVHp0TlFVTXZRanM3VlVGQlN5eFRRVUZUTEVWQlFVTXNVMEZCVXp0UlFVTjBRanM3V1VGQlJ5eFRRVUZUTEVWQlFVTXNUMEZCVHp0VlFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUzBGQlN6dFRRVUZMTzFGQlF6TkRPenRaUVVGSExGTkJRVk1zUlVGQlF5eFhRVUZYTzFWQlEzSkNMR3RDUVVGclFqdFRRVU5xUWp0UFFVTkJPMHRCUTBZc1EwRkRUanRIUVVOSU8wTkJRMFlzUTBGQlF5eERRVUZET3p0QlFVZElMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzVlVGQlZTeERRVUZESWl3aVptbHNaU0k2SWk5VmMyVnljeTluY21WbmIzSjVYMlp2YzNSbGNpOWtZWFJoTFdWdVp5OW9iMjVsZVhCdmRDOWtaWFl2YzJOeWFYQjBjeTkxYVM5RVpYUmhhV3hVWlhoMExtcHplQ0lzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWk4cWFuTm9hVzUwSUdWemJtVjRkRG9nZEhKMVpTQXFMMXh1WEc1amIyNXpkQ0JFWlhSaGFXeFdhV1YzVTNSdmNtVWdQU0J5WlhGMWFYSmxLQ2N1TGk5emRHOXlaWE12UkdWMFlXbHNWbWxsZDFOMGIzSmxKeWs3WEc1amIyNXpkQ0JFWlhSaGFXeFdhV1YzUVdOMGFXOXVjeUE5SUhKbGNYVnBjbVVvSnk0dUwyRmpkR2x2Ym5NdlJHVjBZV2xzVm1sbGQwRmpkR2x2Ym5NbktUdGNibHh1WTI5dWMzUWdSR1YwWVdsc1ZHVjRkQ0E5SUZKbFlXTjBMbU55WldGMFpVTnNZWE56S0h0Y2JseHVJQ0JuWlhSSmJtbDBhV0ZzVTNSaGRHVTZJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQkVaWFJoYVd4V2FXVjNVM1J2Y21VdVoyVjBVM1J2Y21Vb0tUc2dYRzRnSUgwc1hHNWNiaUFnWTI5dGNHOXVaVzUwUkdsa1RXOTFiblE2SUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0FnSUVSbGRHRnBiRlpwWlhkVGRHOXlaVnh1SUNBZ0lDQWdMbUZrWkVSaGRHRlZjR1JoZEdWTWFYTjBaVzVsY2loMGFHbHpMbDl2YmsxbGRHRmtZWFJoUTJoaGJtZGxLVHNnWEc0Z0lDQWdSR1YwWVdsc1ZtbGxkMU4wYjNKbFhHNGdJQ0FnSUNBdVlXUmtSbTlqZFhOVmNHUmhkR1ZNYVhOMFpXNWxjaWgwYUdsekxsOXZia1p2WTNWelEyaGhibWRsS1RzZ1hHNGdJQ0FnUkdWMFlXbHNWbWxsZDFOMGIzSmxYRzRnSUNBZ0lDQXVZV1JrVFdWaGMzVnlaVU5vWVc1blpVeHBjM1JsYm1WeUtIUm9hWE11WDI5dVRXVmhjM1Z5WlVOb1lXNW5aU2s3SUZ4dUlDQjlMRnh1WEc0Z0lHTnZiWEJ2Ym1WdWRFUnBaRlZ1Ylc5MWJuUTZJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQWdJRVJsZEdGcGJGWnBaWGRUZEc5eVpWeHVJQ0FnSUNBZ0xuSmxiVzkyWlVSaGRHRlZjR1JoZEdWTWFYTjBaVzVsY2loMGFHbHpMbDl2YmsxbGRHRmtZWFJoUTJoaGJtZGxLVHNnWEc0Z0lDQWdSR1YwWVdsc1ZtbGxkMU4wYjNKbFhHNGdJQ0FnSUNBdWNtVnRiM1psUm05amRYTlZjR1JoZEdWTWFYTjBaVzVsY2loMGFHbHpMbDl2YmtadlkzVnpRMmhoYm1kbEtUc2dYRzRnSUNBZ1JHVjBZV2xzVm1sbGQxTjBiM0psWEc0Z0lDQWdJQ0F1Y21WdGIzWmxUV1ZoYzNWeVpVTm9ZVzVuWlV4cGMzUmxibVZ5S0hSb2FYTXVYMjl1VFdWaGMzVnlaVU5vWVc1blpTazdJRnh1SUNCOUxGeHVYRzRnSUY5dmJrWnZZM1Z6UTJoaGJtZGxPaUJtZFc1amRHbHZiaWdwZTF4dUlDQWdJSFJvYVhNdWMyVjBVM1JoZEdVb2UxeHVJQ0FnSUNBZ1ptOWpkWE5XWVd4MVpUcEVaWFJoYVd4V2FXVjNVM1J2Y21VdVoyVjBSbTlqZFhOV1lXeDFaU2dwTEZ4dUlDQWdJQ0FnWm05amRYTkVZWFJsT2tSbGRHRnBiRlpwWlhkVGRHOXlaUzVuWlhSR2IyTjFjMFJoZEdVb0tWeHVJQ0FnSUgwcE8xeHVJQ0I5TEZ4dVhHNGdJRjl2YmsxbFlYTjFjbVZEYUdGdVoyVTZJR1oxYm1OMGFXOXVLQ2w3WEc0Z0lDQWdkR2hwY3k1elpYUlRkR0YwWlNoN1hHNGdJQ0FnSUNCdFpXRnpkWEpsT2tSbGRHRnBiRlpwWlhkVGRHOXlaUzVuWlhSTlpXRnpkWEpsS0NsY2JpQWdJQ0I5S1R0Y2JpQWdmU3hjYmx4dUlDQmZiMjVOWlhSaFpHRjBZVU5vWVc1blpUb2dablZ1WTNScGIyNG9LWHRjYmlBZ0lDQmpiMjV6ZENCa1pYUmhhV3h6SUQwZ1JHVjBZV2xzVm1sbGQxTjBiM0psTG1kbGRFUmxkR0ZwYkhNb0tUdGNiaUFnSUNCMGFHbHpMbk5sZEZOMFlYUmxLSHRjYmlBZ0lDQWdJRzVoYldVNklHUmxkR0ZwYkhNdWJtRnRaU3hjYmlBZ0lDQWdJRzkzYm1WeU9pQmtaWFJoYVd4ekxtOTNibVZ5WEc0Z0lDQWdmU2s3WEc0Z0lIMHNYRzVjYmlBZ2NtVnVaR1Z5T2lCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNCamIyNXpkQ0JtYjJOMWMwUmhkR1VnUFNCRVpYUmhhV3hXYVdWM1UzUnZjbVV1WjJWMFJtOWpkWE5FWVhSbEtDazdYRzRnSUNBZ2JHVjBJR1p2Y20xaGRIUmxaRVp2WTNWelJHRjBaU0E5SUZ3aVhDSTdYRzRnSUNBZ2FXWWdLR1p2WTNWelJHRjBaU2tnZTF4dUlDQWdJQ0FnWm05eWJXRjBkR1ZrUm05amRYTkVZWFJsSUQwZ0tHWnZZM1Z6UkdGMFpTNW5aWFJOYjI1MGFDZ3BJQ3NnTVNrZ0t5QmNiaUFnSUNBZ0lDY3ZKeUFySUdadlkzVnpSR0YwWlM1blpYUkVZWFJsS0NrZ0t5QmNiaUFnSUNBZ0lDY3ZKeUFySUdadlkzVnpSR0YwWlM1blpYUkdkV3hzV1dWaGNpZ3BPMXh1SUNBZ0lIMWNiaUFnSUNCamIyNXpkQ0J1ZFcxaVpYSkdiM0p0WVhSMFpYSWdQU0JrTXk1bWIzSnRZWFFvSnk0emN5Y3BPMXh1SUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDBuWkdWMFlXbHNWR1Y0ZENjK1hHNGdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFNkMGFYUnNaVkp2ZHljK1hHNGdJQ0FnSUNBZ0lDQWdQR2d4SUdOc1lYTnpUbUZ0WlQwblkzVnlTV1FuUG50MGFHbHpMbk4wWVhSbExtNWhiV1Y5UEM5b01UNWNiaUFnSUNBZ0lDQWdJQ0E4YURFZ1kyeGhjM05PWVcxbFBTZHRaV0Z6ZFhKbEp6NTdkR2hwY3k1emRHRjBaUzV0WldGemRYSmxmVHd2YURFK1hHNGdJQ0FnSUNBZ0lDQWdQR2d4SUdOc1lYTnpUbUZ0WlQwblptOWpkWE5XWVd3blBudHVkVzFpWlhKR2IzSnRZWFIwWlhJb2RHaHBjeTV6ZEdGMFpTNW1iMk4xYzFaaGJIVmxLWDA4TDJneFBseHVJQ0FnSUNBZ0lDQThMMlJwZGo1Y2JpQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5SjJScGRtbGtaWEluUGp3dlpHbDJQbHh1SUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMG5hVzVtYjFKdmR5YytYRzRnSUNBZ0lDQWdJQ0FnUEhBZ1kyeGhjM05PWVcxbFBTZHZkMjVsY2ljK2UzUm9hWE11YzNSaGRHVXViM2R1WlhKOVBDOXdQbHh1SUNBZ0lDQWdJQ0FnSUR4d0lHTnNZWE56VG1GdFpUMG5abTlqZFhORVlYUmxKejVjYmlBZ0lDQWdJQ0FnSUNBZ0lIdG1iM0p0WVhSMFpXUkdiMk4xYzBSaGRHVjlYRzRnSUNBZ0lDQWdJQ0FnUEM5d1BseHVJQ0FnSUNBZ0lDQThMMlJwZGo1Y2JpQWdJQ0FnSUR3dlpHbDJQbHh1SUNBZ0lDazdYRzRnSUgxY2JuMHBPMXh1WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1JHVjBZV2xzVkdWNGREdGNiaUpkZlE9PSIsIi8qanNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBDaGFydCA9IHJlcXVpcmUoJy4vQ2hhcnQuanN4Jyk7XG52YXIgTWVhc3VyZVJvdyA9IHJlcXVpcmUoJy4vTWVhc3VyZVJvdy5qc3gnKTtcblxudmFyIERldGFpbFZpZXcgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnRGV0YWlsVmlldycsXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnZGl2JyxcbiAgICAgIHsgY2xhc3NOYW1lOiAnZGV0YWlsVmlldycgfSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWVhc3VyZVJvdywgeyBuYW1lOiAnbWVhc3VyZScsIGxhYmVsczogWydJL08nLCAnQ1BVJywgJ01hcHBlcnMnLCAnUmVkdWNlcnMnXSB9KSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ2hhcnQsIG51bGwpXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGV0YWlsVmlldztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OW5jbVZuYjNKNVgyWnZjM1JsY2k5a1lYUmhMV1Z1Wnk5b2IyNWxlWEJ2ZEM5a1pYWXZjMk55YVhCMGN5OTFhUzlFWlhSaGFXeFdhV1YzTG1wemVDSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPMEZCUlVFc1NVRkJUU3hMUVVGTExFZEJRVWNzVDBGQlR5eERRVUZETEdGQlFXRXNRMEZCUXl4RFFVRkRPMEZCUTNKRExFbEJRVTBzVlVGQlZTeEhRVUZITEU5QlFVOHNRMEZCUXl4clFrRkJhMElzUTBGQlF5eERRVUZET3p0QlFVVXZReXhKUVVGTkxGVkJRVlVzUjBGQlJ5eExRVUZMTEVOQlFVTXNWMEZCVnl4RFFVRkRPenM3UVVGRGJrTXNVVUZCVFN4RlFVRkZMR3RDUVVGWE8wRkJRMnBDTEZkQlEwVTdPMUZCUVVzc1UwRkJVeXhGUVVGRExGbEJRVms3VFVGRGVrSXNiMEpCUVVNc1ZVRkJWU3hKUVVGRExFbEJRVWtzUlVGQlF5eFRRVUZUTEVWQlFVTXNUVUZCVFN4RlFVRkZMRU5CUVVNc1MwRkJTeXhGUVVGRExFdEJRVXNzUlVGQlF5eFRRVUZUTEVWQlFVTXNWVUZCVlN4RFFVRkRMRUZCUVVNc1IwRkJSenROUVVONlJTeHZRa0ZCUXl4TFFVRkxMRTlCUVVjN1MwRkRUQ3hEUVVOT08wZEJRMGc3UTBGRFJpeERRVUZETEVOQlFVTTdPMEZCUlVnc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eFZRVUZWTEVOQlFVTWlMQ0ptYVd4bElqb2lMMVZ6WlhKekwyZHlaV2R2Y25sZlptOXpkR1Z5TDJSaGRHRXRaVzVuTDJodmJtVjVjRzkwTDJSbGRpOXpZM0pwY0hSekwzVnBMMFJsZEdGcGJGWnBaWGN1YW5ONElpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lMeXBxYzJocGJuUWdaWE51WlhoME9pQjBjblZsSUNvdlhHNWNibU52Ym5OMElFTm9ZWEowSUQwZ2NtVnhkV2x5WlNnbkxpOURhR0Z5ZEM1cWMzZ25LVHRjYm1OdmJuTjBJRTFsWVhOMWNtVlNiM2NnUFNCeVpYRjFhWEpsS0NjdUwwMWxZWE4xY21WU2IzY3Vhbk40SnlrN1hHNWNibU52Ym5OMElFUmxkR0ZwYkZacFpYY2dQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUNoY2JpQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQU2RrWlhSaGFXeFdhV1YzSno1Y2JpQWdJQ0FnSUNBZ1BFMWxZWE4xY21WU2IzY2dibUZ0WlQwbmJXVmhjM1Z5WlNjZ2JHRmlaV3h6UFh0Ykowa3ZUeWNzSjBOUVZTY3NKMDFoY0hCbGNuTW5MQ2RTWldSMVkyVnljeWRkZlNBdlBseHVJQ0FnSUNBZ0lDQThRMmhoY25RZ0x6NWNiaUFnSUNBZ0lEd3ZaR2wyUGx4dUlDQWdJQ2s3WEc0Z0lIMWNibjBwTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlFUmxkR0ZwYkZacFpYYzdYRzRpWFgwPSIsIi8qanNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIEZpbHRlckJ1dHRvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6IFwiRmlsdGVyQnV0dG9uXCIsXG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgbGFiZWw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBoYW5kbGVyOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICBcImJ1dHRvblwiLFxuICAgICAgeyBvbkNsaWNrOiB0aGlzLnByb3BzLmhhbmRsZXIsIGNsYXNzTmFtZTogdGhpcy5wcm9wcy5jbGFzc05hbWUgfSxcbiAgICAgIHRoaXMucHJvcHMubGFiZWxcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaWx0ZXJCdXR0b247XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTluY21WbmIzSjVYMlp2YzNSbGNpOWtZWFJoTFdWdVp5OW9iMjVsZVhCdmRDOWtaWFl2YzJOeWFYQjBjeTkxYVM5R2FXeDBaWEpDZFhSMGIyNHVhbk40SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN1FVRkZRU3hKUVVGTkxGbEJRVmtzUjBGQlJ5eExRVUZMTEVOQlFVTXNWMEZCVnl4RFFVRkRPenM3UVVGRmNrTXNWMEZCVXl4RlFVRkZPMEZCUTFRc1UwRkJTeXhGUVVGRkxFdEJRVXNzUTBGQlF5eFRRVUZUTEVOQlFVTXNUVUZCVFN4RFFVRkRMRlZCUVZVN1FVRkRlRU1zVjBGQlR5eEZRVUZGTEV0QlFVc3NRMEZCUXl4VFFVRlRMRU5CUVVNc1NVRkJTU3hEUVVGRExGVkJRVlU3UjBGRGVrTTdPMEZCUlVRc1VVRkJUU3hGUVVGRkxHdENRVUZYTzBGQlEycENMRmRCUTBVN08xRkJRVkVzVDBGQlR5eEZRVUZGTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1QwRkJUeXhCUVVGRExFVkJRVU1zVTBGQlV5eEZRVUZGTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1UwRkJVeXhCUVVGRE8wMUJRMnhGTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJTenRMUVVOV0xFTkJRMVE3UjBGRFNEdERRVU5HTEVOQlFVTXNRMEZCUXpzN1FVRkZTQ3hOUVVGTkxFTkJRVU1zVDBGQlR5eEhRVUZITEZsQlFWa3NRMEZCUXlJc0ltWnBiR1VpT2lJdlZYTmxjbk12WjNKbFoyOXllVjltYjNOMFpYSXZaR0YwWVMxbGJtY3ZhRzl1Wlhsd2IzUXZaR1YyTDNOamNtbHdkSE12ZFdrdlJtbHNkR1Z5UW5WMGRHOXVMbXB6ZUNJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHFhbk5vYVc1MElHVnpibVY0ZERvZ2RISjFaU0FxTDF4dVhHNWpiMjV6ZENCR2FXeDBaWEpDZFhSMGIyNGdQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEc1Y2JpQWdjSEp2Y0ZSNWNHVnpPaUI3WEc0Z0lDQWdiR0ZpWld3NklGSmxZV04wTGxCeWIzQlVlWEJsY3k1emRISnBibWN1YVhOU1pYRjFhWEpsWkN4Y2JpQWdJQ0JvWVc1a2JHVnlPaUJTWldGamRDNVFjbTl3Vkhsd1pYTXVablZ1WXk1cGMxSmxjWFZwY21Wa0xGeHVJQ0I5TEZ4dVhHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lEeGlkWFIwYjI0Z2IyNURiR2xqYXoxN2RHaHBjeTV3Y205d2N5NW9ZVzVrYkdWeWZTQmpiR0Z6YzA1aGJXVTllM1JvYVhNdWNISnZjSE11WTJ4aGMzTk9ZVzFsZlQ1Y2JpQWdJQ0FnSUNBZ2UzUm9hWE11Y0hKdmNITXViR0ZpWld4OVhHNGdJQ0FnSUNBOEwySjFkSFJ2Ymo1Y2JpQWdJQ0FwTzF4dUlDQjlYRzU5S1R0Y2JseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQkdhV3gwWlhKQ2RYUjBiMjQ3WEc0aVhYMD0iLCIvLyBGSUxURVJPUFRJT05ST1dcbi8qanNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBGaWx0ZXJBY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9GaWx0ZXJBY3Rpb25zJyk7XG52YXIgRmlsdGVyQnV0dG9uID0gcmVxdWlyZSgnLi9GaWx0ZXJCdXR0b24uanN4Jyk7XG5cbnZhciBGaWx0ZXJPcHRpb25Sb3cgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnRmlsdGVyT3B0aW9uUm93JyxcblxuICBwcm9wVHlwZXM6IHtcbiAgICBuYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgbGFiZWxzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZFxuICB9LFxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7IHNlbGVjdGVkOiAwIH07XG4gIH0sXG5cbiAgaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uIGhhbmRsZUNsaWNrKGluZGV4KSB7XG4gICAgaWYgKGluZGV4ICE9IHRoaXMuc3RhdGUuc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBzZWxlY3RlZDogaW5kZXggfSk7XG4gICAgICBGaWx0ZXJBY3Rpb25zLnVwZGF0ZUZpbHRlcih0aGlzLnByb3BzLm5hbWUsIHRoaXMucHJvcHMubGFiZWxzW2luZGV4XSk7XG4gICAgfVxuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBzcGFuID0gdW5kZWZpbmVkO1xuXG4gICAgc3dpdGNoICh0aGlzLnByb3BzLmxhYmVscy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgc3BhbiA9ICdoYWxmJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIHNwYW4gPSAndGhpcmQnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgNDpcbiAgICAgICAgc3BhbiA9ICdxdWFydGVyJztcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ2RpdicsXG4gICAgICB7IGNsYXNzTmFtZTogJ2ZpbHRlck9wdGlvblJvdycgfSxcbiAgICAgIHRoaXMucHJvcHMubGFiZWxzLm1hcChmdW5jdGlvbiAoY3VyTGFiZWwsIGkpIHtcbiAgICAgICAgdmFyIHNlbGVjdGVkID0gaSA9PSB0aGlzLnN0YXRlLnNlbGVjdGVkID8gJ3NlbGVjdGVkJyA6ICdkZXNlbGVjdGVkJztcblxuICAgICAgICB2YXIgcHJvcHMgPSB7XG4gICAgICAgICAgbGFiZWw6IGN1ckxhYmVsLFxuICAgICAgICAgIGhhbmRsZXI6IHRoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzLCBpKSxcbiAgICAgICAgICBjbGFzc05hbWU6ICdmaWx0ZXJCdXR0b24nICsgJyAnICsgc3BhbiArICcgJyArIHNlbGVjdGVkXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KEZpbHRlckJ1dHRvbiwgcHJvcHMpO1xuICAgICAgfSwgdGhpcylcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaWx0ZXJPcHRpb25Sb3c7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTluY21WbmIzSjVYMlp2YzNSbGNpOWtZWFJoTFdWdVp5OW9iMjVsZVhCdmRDOWtaWFl2YzJOeWFYQjBjeTkxYVM5R2FXeDBaWEpQY0hScGIyNVNiM2N1YW5ONElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN096czdPMEZCUjBFc1NVRkJUU3hoUVVGaExFZEJRVWNzVDBGQlR5eERRVUZETERCQ1FVRXdRaXhEUVVGRExFTkJRVU03UVVGRE1VUXNTVUZCVFN4WlFVRlpMRWRCUVVjc1QwRkJUeXhEUVVGRExHOUNRVUZ2UWl4RFFVRkRMRU5CUVVNN08wRkJSVzVFTEVsQlFVMHNaVUZCWlN4SFFVRkhMRXRCUVVzc1EwRkJReXhYUVVGWExFTkJRVU03T3p0QlFVVjRReXhYUVVGVExFVkJRVVU3UVVGRFZDeFJRVUZKTEVWQlFVVXNTMEZCU3l4RFFVRkRMRk5CUVZNc1EwRkJReXhOUVVGTkxFTkJRVU1zVlVGQlZUdEJRVU4yUXl4VlFVRk5MRVZCUVVVc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eExRVUZMTEVOQlFVTXNWVUZCVlR0SFFVTjZRenM3UVVGRlJDeHBRa0ZCWlN4RlFVRkZMREpDUVVGWE8wRkJRekZDTEZkQlFVOHNSVUZCUXl4UlFVRlJMRVZCUVVVc1EwRkJReXhGUVVGRExFTkJRVU03UjBGRGRFSTdPMEZCUlVRc1lVRkJWeXhGUVVGRkxIRkNRVUZUTEV0QlFVc3NSVUZCUlR0QlFVTXpRaXhSUVVGSkxFdEJRVXNzU1VGQlNTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRkZCUVZFc1JVRkJSVHRCUVVOb1F5eFZRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRVZCUVVNc1VVRkJVU3hGUVVGRkxFdEJRVXNzUlVGQlF5eERRVUZETEVOQlFVTTdRVUZEYWtNc2JVSkJRV0VzUTBGQlF5eFpRVUZaTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhKUVVGSkxFVkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TlFVRk5MRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF6dExRVU4yUlR0SFFVTkdPenRCUVVWRUxGRkJRVTBzUlVGQlJTeHJRa0ZCVnp0QlFVTnFRaXhSUVVGSkxFbEJRVWtzV1VGQlFTeERRVUZET3p0QlFVVlVMRmxCUVU4c1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eE5RVUZOTEVOQlFVTXNUVUZCVFR0QlFVTTNRaXhYUVVGTExFTkJRVU03UVVGRFNpeFpRVUZKTEVkQlFVY3NUVUZCVFN4RFFVRkRPMEZCUTJRc1kwRkJUVHRCUVVGQkxFRkJRMUlzVjBGQlN5eERRVUZETzBGQlEwb3NXVUZCU1N4SFFVRkhMRTlCUVU4c1EwRkJRenRCUVVObUxHTkJRVTA3UVVGQlFTeEJRVU5TTEZkQlFVc3NRMEZCUXp0QlFVTktMRmxCUVVrc1IwRkJSeXhUUVVGVExFTkJRVU03UVVGRGFrSXNZMEZCVFR0QlFVRkJMRXRCUTFRN1FVRkRSQ3hYUVVORk96dFJRVUZMTEZOQlFWTXNSVUZCUXl4cFFrRkJhVUk3VFVGRE4wSXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhOUVVGTkxFTkJRVU1zUjBGQlJ5eERRVUZETEZWQlFWTXNVVUZCVVN4RlFVRkZMRU5CUVVNc1JVRkJSVHRCUVVNelF5eFpRVUZOTEZGQlFWRXNSMEZCUnl4QlFVRkRMRU5CUVVNc1NVRkJTU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZGQlFWRXNSMEZCU1N4VlFVRlZMRWRCUVVjc1dVRkJXU3hEUVVGQk96dEJRVVYyUlN4WlFVRk5MRXRCUVVzc1IwRkJSenRCUVVOYUxHVkJRVXNzUlVGQlF5eFJRVUZSTzBGQlEyUXNhVUpCUVU4c1JVRkJReXhKUVVGSkxFTkJRVU1zVjBGQlZ5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRVZCUVVNc1EwRkJReXhEUVVGRE8wRkJRM0pETEcxQ1FVRlRMRVZCUVVNc1kwRkJZeXhIUVVGRExFZEJRVWNzUjBGQlF5eEpRVUZKTEVkQlFVTXNSMEZCUnl4SFFVRkRMRkZCUVZFN1UwRkRMME1zUTBGQlFUdEJRVU5FTEdWQlEwVXNiMEpCUVVNc1dVRkJXU3hGUVVGTExFdEJRVXNzUTBGQlNTeERRVU16UWp0UFFVTklMRVZCUVVVc1NVRkJTU3hEUVVGRE8wdEJRMG9zUTBGRFRqdEhRVU5JTzBOQlEwWXNRMEZCUXl4RFFVRkRPenRCUVVWSUxFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NaVUZCWlN4RFFVRkRJaXdpWm1sc1pTSTZJaTlWYzJWeWN5OW5jbVZuYjNKNVgyWnZjM1JsY2k5a1lYUmhMV1Z1Wnk5b2IyNWxlWEJ2ZEM5a1pYWXZjMk55YVhCMGN5OTFhUzlHYVd4MFpYSlBjSFJwYjI1U2IzY3Vhbk40SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUx5OGdSa2xNVkVWU1QxQlVTVTlPVWs5WFhHNHZLbXB6YUdsdWRDQmxjMjVsZUhRNklIUnlkV1VnS2k5Y2JseHVZMjl1YzNRZ1JtbHNkR1Z5UVdOMGFXOXVjeUE5SUhKbGNYVnBjbVVvSnk0dUwyRmpkR2x2Ym5NdlJtbHNkR1Z5UVdOMGFXOXVjeWNwTzF4dVkyOXVjM1FnUm1sc2RHVnlRblYwZEc5dUlEMGdjbVZ4ZFdseVpTZ25MaTlHYVd4MFpYSkNkWFIwYjI0dWFuTjRKeWs3WEc1Y2JtTnZibk4wSUVacGJIUmxjazl3ZEdsdmJsSnZkeUE5SUZKbFlXTjBMbU55WldGMFpVTnNZWE56S0h0Y2JseHVJQ0J3Y205d1ZIbHdaWE02SUh0Y2JpQWdJQ0J1WVcxbE9pQlNaV0ZqZEM1UWNtOXdWSGx3WlhNdWMzUnlhVzVuTG1selVtVnhkV2x5WldRc1hHNGdJQ0FnYkdGaVpXeHpPaUJTWldGamRDNVFjbTl3Vkhsd1pYTXVZWEp5WVhrdWFYTlNaWEYxYVhKbFpDQmNiaUFnZlN4Y2JseHVJQ0JuWlhSSmJtbDBhV0ZzVTNSaGRHVTZJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQjdjMlZzWldOMFpXUTZJREI5TzF4dUlDQjlMRnh1WEc0Z0lHaGhibVJzWlVOc2FXTnJPaUJtZFc1amRHbHZiaWhwYm1SbGVDa2dlMXh1SUNBZ0lHbG1JQ2hwYm1SbGVDQWhQU0IwYUdsekxuTjBZWFJsTG5ObGJHVmpkR1ZrS1NCN1hHNGdJQ0FnSUNCMGFHbHpMbk5sZEZOMFlYUmxLSHR6Wld4bFkzUmxaRG9nYVc1a1pYaDlLVHRjYmlBZ0lDQWdJRVpwYkhSbGNrRmpkR2x2Ym5NdWRYQmtZWFJsUm1sc2RHVnlLSFJvYVhNdWNISnZjSE11Ym1GdFpTd2dkR2hwY3k1d2NtOXdjeTVzWVdKbGJITmJhVzVrWlhoZEtUdGNiaUFnSUNCOVhHNGdJSDBzWEc1Y2JpQWdjbVZ1WkdWeU9pQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQnNaWFFnYzNCaGJqdGNibHh1SUNBZ0lITjNhWFJqYUNoMGFHbHpMbkJ5YjNCekxteGhZbVZzY3k1c1pXNW5kR2dwSUh0Y2JpQWdJQ0FnSUdOaGMyVWdNanBjYmlBZ0lDQWdJQ0FnYzNCaGJpQTlJQ2RvWVd4bUp6dGNiaUFnSUNBZ0lDQWdZbkpsWVdzN1hHNGdJQ0FnSUNCallYTmxJRE02WEc0Z0lDQWdJQ0FnSUhOd1lXNGdQU0FuZEdocGNtUW5PMXh1SUNBZ0lDQWdJQ0JpY21WaGF6dGNiaUFnSUNBZ0lHTmhjMlVnTkRwY2JpQWdJQ0FnSUNBZ2MzQmhiaUE5SUNkeGRXRnlkR1Z5Snp0Y2JpQWdJQ0FnSUNBZ1luSmxZV3M3WEc0Z0lDQWdmVnh1SUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDBuWm1sc2RHVnlUM0IwYVc5dVVtOTNKejVjYmlBZ0lDQWdJQ0FnZTNSb2FYTXVjSEp2Y0hNdWJHRmlaV3h6TG0xaGNDaG1kVzVqZEdsdmJpaGpkWEpNWVdKbGJDd2dhU2tnZTF4dUlDQWdJQ0FnSUNBZ0lHTnZibk4wSUhObGJHVmpkR1ZrSUQwZ0tHa2dQVDBnZEdocGN5NXpkR0YwWlM1elpXeGxZM1JsWkNrZ1B5QW5jMlZzWldOMFpXUW5JRG9nSjJSbGMyVnNaV04wWldRblhHNWNiaUFnSUNBZ0lDQWdJQ0JqYjI1emRDQndjbTl3Y3lBOUlIdGNiaUFnSUNBZ0lDQWdJQ0FnSUd4aFltVnNPbU4xY2t4aFltVnNMQ0JjYmlBZ0lDQWdJQ0FnSUNBZ0lHaGhibVJzWlhJNmRHaHBjeTVvWVc1a2JHVkRiR2xqYXk1aWFXNWtLSFJvYVhNc2FTa3NYRzRnSUNBZ0lDQWdJQ0FnSUNCamJHRnpjMDVoYldVNkoyWnBiSFJsY2tKMWRIUnZiaWNySnlBbkszTndZVzRySnlBbkszTmxiR1ZqZEdWa1hHNGdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0FnSUNBZ0lDQThSbWxzZEdWeVFuVjBkRzl1SUhzdUxpNXdjbTl3YzMwZ0x6NWNiaUFnSUNBZ0lDQWdJQ0FwTzF4dUlDQWdJQ0FnSUNCOUxDQjBhR2x6S1gxY2JpQWdJQ0FnSUR3dlpHbDJQbHh1SUNBZ0lDazdYRzRnSUgxY2JuMHBPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUVacGJIUmxjazl3ZEdsdmJsSnZkenRjYmlKZGZRPT0iLCIvLyBGSUxURVJSRVNVTFRST1dcbi8qanNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBGaWx0ZXJSZXN1bHRSb3cgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnRmlsdGVyUmVzdWx0Um93JyxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgY2xhc3NOYW1lID0gJ2ZpbHRlclJlc3VsdFJvdyc7XG4gICAgaWYgKHRoaXMucHJvcHMuc2VsZWN0ZWQpIHtcbiAgICAgIGNsYXNzTmFtZSA9IGNsYXNzTmFtZSArICcgc2VsZWN0ZWQnO1xuICAgIH1cbiAgICB2YXIgZm9ybWF0dGVyID0gZDMuZm9ybWF0KCcuM3MnKTtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICd0cicsXG4gICAgICB7IGNsYXNzTmFtZTogY2xhc3NOYW1lLCBvbkNsaWNrOiB0aGlzLnByb3BzLmhhbmRsZXIgfSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICd0ZCcsXG4gICAgICAgIHsgY2xhc3NOYW1lOiAnZmlsdGVyUmVzdWx0Um93TmFtZScgfSxcbiAgICAgICAgdGhpcy5wcm9wcy5uYW1lXG4gICAgICApLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ3RkJyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdmaWx0ZXJSZXN1bHRSb3dWYWx1ZScgfSxcbiAgICAgICAgZm9ybWF0dGVyKHRoaXMucHJvcHMudmFsdWUpXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRmlsdGVyUmVzdWx0Um93O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5bmNtVm5iM0o1WDJadmMzUmxjaTlrWVhSaExXVnVaeTlvYjI1bGVYQnZkQzlrWlhZdmMyTnlhWEIwY3k5MWFTOUdhV3gwWlhKU1pYTjFiSFJTYjNjdWFuTjRJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdPenM3TzBGQlIwRXNTVUZCVFN4bFFVRmxMRWRCUVVjc1MwRkJTeXhEUVVGRExGZEJRVmNzUTBGQlF6czdPMEZCUTNoRExGRkJRVTBzUlVGQlJTeHJRa0ZCVnp0QlFVTnFRaXhSUVVGSkxGTkJRVk1zUjBGQlJ5eHBRa0ZCYVVJc1EwRkJRenRCUVVOc1F5eFJRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1VVRkJVU3hGUVVGRk8wRkJRVU1zWlVGQlV5eEhRVUZITEZOQlFWTXNSMEZCUnl4WFFVRlhMRU5CUVVNN1MwRkJRenRCUVVNdlJDeFJRVUZOTEZOQlFWTXNSMEZCUnl4RlFVRkZMRU5CUVVNc1RVRkJUU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETzBGQlEyNURMRmRCUTBVN08xRkJRVWtzVTBGQlV5eEZRVUZGTEZOQlFWTXNRVUZCUXl4RlFVRkRMRTlCUVU4c1JVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVOHNRVUZCUXp0TlFVTndSRHM3VlVGQlNTeFRRVUZUTEVWQlFVTXNjVUpCUVhGQ08xRkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4SlFVRkpPMDlCUVUwN1RVRkRNVVE3TzFWQlFVa3NVMEZCVXl4RlFVRkRMSE5DUVVGelFqdFJRVUZGTEZOQlFWTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFdEJRVXNzUTBGQlF6dFBRVUZOTzB0QlEzQkZMRU5CUTB3N1IwRkRTRHREUVVOR0xFTkJRVU1zUTBGQlF6czdRVUZGU0N4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExHVkJRV1VzUTBGQlF5SXNJbVpwYkdVaU9pSXZWWE5sY25NdlozSmxaMjl5ZVY5bWIzTjBaWEl2WkdGMFlTMWxibWN2YUc5dVpYbHdiM1F2WkdWMkwzTmpjbWx3ZEhNdmRXa3ZSbWxzZEdWeVVtVnpkV3gwVW05M0xtcHplQ0lzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWk4dklFWkpURlJGVWxKRlUxVk1WRkpQVjF4dUx5cHFjMmhwYm5RZ1pYTnVaWGgwT2lCMGNuVmxJQ292WEc1Y2JtTnZibk4wSUVacGJIUmxjbEpsYzNWc2RGSnZkeUE5SUZKbFlXTjBMbU55WldGMFpVTnNZWE56S0h0Y2JpQWdjbVZ1WkdWeU9pQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQnNaWFFnWTJ4aGMzTk9ZVzFsSUQwZ0oyWnBiSFJsY2xKbGMzVnNkRkp2ZHljN1hHNGdJQ0FnYVdZZ0tIUm9hWE11Y0hKdmNITXVjMlZzWldOMFpXUXBJSHRqYkdGemMwNWhiV1VnUFNCamJHRnpjMDVoYldVZ0t5QW5JSE5sYkdWamRHVmtKenQ5WEc0Z0lDQWdZMjl1YzNRZ1ptOXliV0YwZEdWeUlEMGdaRE11Wm05eWJXRjBLQ2N1TTNNbktUdGNiaUFnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnUEhSeUlHTnNZWE56VG1GdFpUMTdZMnhoYzNOT1lXMWxmU0J2YmtOc2FXTnJQWHQwYUdsekxuQnliM0J6TG1oaGJtUnNaWEo5UGx4dUlDQWdJQ0FnSUNBOGRHUWdZMnhoYzNOT1lXMWxQU2RtYVd4MFpYSlNaWE4xYkhSU2IzZE9ZVzFsSno1N2RHaHBjeTV3Y205d2N5NXVZVzFsZlR3dmRHUStYRzRnSUNBZ0lDQWdJRHgwWkNCamJHRnpjMDVoYldVOUoyWnBiSFJsY2xKbGMzVnNkRkp2ZDFaaGJIVmxKejU3Wm05eWJXRjBkR1Z5S0hSb2FYTXVjSEp2Y0hNdWRtRnNkV1VwZlR3dmRHUStYRzRnSUNBZ0lDQThMM1J5UGx4dUlDQWdJQ2s3WEc0Z0lIMWNibjBwTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlFWnBiSFJsY2xKbGMzVnNkRkp2ZHp0Y2JpSmRmUT09IiwiLy8gRklMVEVSUkVTVUxUU1RBQkxFXG4vKmpzaGludCBlc25leHQ6IHRydWUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgRmlsdGVyU3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZXMvRmlsdGVyU3RvcmUnKTtcbnZhciBGaWx0ZXJBY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9GaWx0ZXJBY3Rpb25zJyk7XG52YXIgRGV0YWlsVmlld0FjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL0RldGFpbFZpZXdBY3Rpb25zLmpzJyk7XG52YXIgRmlsdGVyUmVzdWx0Um93ID0gcmVxdWlyZSgnLi9GaWx0ZXJSZXN1bHRSb3cuanN4Jyk7XG5cbnZhciBGaWx0ZXJSZXN1bHRzVGFibGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnRmlsdGVyUmVzdWx0c1RhYmxlJyxcblxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdWx0czogRmlsdGVyU3RvcmUuZ2V0UmVzdWx0cygpLFxuICAgICAgaGVhZGVyczogRmlsdGVyU3RvcmUuZ2V0UmVzdWx0SGVhZGVycygpLFxuICAgICAgZGVzY3JpcHRpb246IEZpbHRlclN0b3JlLmdldERlc2NyaXB0aW9uU3RyaW5nKClcbiAgICB9O1xuICB9LFxuXG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbiBoYW5kbGVDbGljayhpbmRleCkge1xuICAgIERldGFpbFZpZXdBY3Rpb25zLnVwZGF0ZURldGFpbFZpZXcodGhpcy5zdGF0ZS5oZWFkZXJzWzBdLnJlcGxhY2UoJyBuYW1lJywgJycpLCB0aGlzLnN0YXRlLnJlc3VsdHNbaW5kZXhdLm5hbWUpO1xuXG4gICAgaWYgKEZpbHRlclN0b3JlLmlzU2hvd2luZ0RhZ3MoKSkge1xuICAgICAgRmlsdGVyQWN0aW9ucy51cGRhdGVGaWx0ZXIoXCJkYWdcIiwgdGhpcy5zdGF0ZS5yZXN1bHRzW2luZGV4XS5uYW1lKTtcbiAgICAgIERldGFpbFZpZXdBY3Rpb25zLnVwZGF0ZURhZyh0aGlzLnN0YXRlLnJlc3VsdHNbaW5kZXhdLm5hbWUpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0ZWQ6IGluZGV4XG4gICAgfSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIEZpbHRlclN0b3JlLmFkZEZpbHRlclJlc3VsdHNDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkVW5tb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkVW5tb3VudCgpIHtcbiAgICBGaWx0ZXJTdG9yZS5yZW1vdmVGaWx0ZXJSZXN1bHRzQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG4gIF9vbkNoYW5nZTogZnVuY3Rpb24gX29uQ2hhbmdlKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVzdWx0czogRmlsdGVyU3RvcmUuZ2V0UmVzdWx0cygpLFxuICAgICAgaGVhZGVyczogRmlsdGVyU3RvcmUuZ2V0UmVzdWx0SGVhZGVycygpLFxuICAgICAgZGVzY3JpcHRpb246IEZpbHRlclN0b3JlLmdldERlc2NyaXB0aW9uU3RyaW5nKClcbiAgICB9KTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5yZXN1bHRzKSB7XG4gICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ3RhYmxlJyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdmaWx0ZXJSZXN1bHRzJyB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdwJyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ2ZpbHRlckRlc2NyaXB0aW9uJyB9LFxuICAgICAgICAgIHRoaXMuc3RhdGUuZGVzY3JpcHRpb25cbiAgICAgICAgKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAndHInLFxuICAgICAgICAgIG51bGwsXG4gICAgICAgICAgdGhpcy5zdGF0ZS5oZWFkZXJzLm1hcChmdW5jdGlvbiAoaGVhZGVyLCBpKSB7XG4gICAgICAgICAgICB2YXIgbmFtZSA9ICdmaWx0ZXJSZXN1bHRSb3dWYWx1ZSc7XG4gICAgICAgICAgICBpZiAoaSA9PSAwKSBuYW1lID0gJ2ZpbHRlclJlc3VsdFJvd05hbWUnO1xuICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICd0aCcsXG4gICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiBuYW1lIH0sXG4gICAgICAgICAgICAgIGhlYWRlclxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9LCB0aGlzKVxuICAgICAgICApLFxuICAgICAgICB0aGlzLnN0YXRlLnJlc3VsdHMubWFwKGZ1bmN0aW9uIChyZXN1bHQsIGkpIHtcbiAgICAgICAgICAvLyBDcmVhdGUgYWxsIHRoZSByZXN1bHQgcm93c1xuICAgICAgICAgIHZhciByZXN1bHRzUm93UHJvcHMgPSB7XG4gICAgICAgICAgICBuYW1lOiByZXN1bHQubmFtZSxcbiAgICAgICAgICAgIGtleTogaSxcbiAgICAgICAgICAgIHZhbHVlOiBOdW1iZXIocmVzdWx0LnZhbHVlLnRvRml4ZWQoMSkpLFxuICAgICAgICAgICAgaGFuZGxlcjogdGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMsIGkpLFxuICAgICAgICAgICAgc2VsZWN0ZWQ6IGkgPT0gdGhpcy5zdGF0ZS5zZWxlY3RlZCA/IHRydWUgOiBmYWxzZVxuICAgICAgICAgIH07XG4gICAgICAgICAgLy8gU2hvcnRlbiBuYW1lIHRvIHByZXZlbnQgb3ZlcmZsb3dcbiAgICAgICAgICBpZiAocmVzdWx0c1Jvd1Byb3BzLm5hbWUubGVuZ3RoID4gMjUpIHtcbiAgICAgICAgICAgIHJlc3VsdHNSb3dQcm9wcy5uYW1lID0gcmVzdWx0c1Jvd1Byb3BzLm5hbWUuc2xpY2UoMCwgMjUpICsgJy4uLic7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRmlsdGVyUmVzdWx0Um93LCByZXN1bHRzUm93UHJvcHMpO1xuICAgICAgICB9LCB0aGlzKVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RhYmxlJywgeyBjbGFzc05hbWU6ICdmaWx0ZXJSZXN1bHRzJyB9KTtcbiAgICB9XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZpbHRlclJlc3VsdHNUYWJsZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OW5jbVZuYjNKNVgyWnZjM1JsY2k5a1lYUmhMV1Z1Wnk5b2IyNWxlWEJ2ZEM5a1pYWXZjMk55YVhCMGN5OTFhUzlHYVd4MFpYSlNaWE4xYkhSelZHRmliR1V1YW5ONElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN096czdPMEZCUjBFc1NVRkJUU3hYUVVGWExFZEJRVWNzVDBGQlR5eERRVUZETEhWQ1FVRjFRaXhEUVVGRExFTkJRVU03UVVGRGNrUXNTVUZCVFN4aFFVRmhMRWRCUVVjc1QwRkJUeXhEUVVGRExEQkNRVUV3UWl4RFFVRkRMRU5CUVVNN1FVRkRNVVFzU1VGQlRTeHBRa0ZCYVVJc1IwRkJSeXhQUVVGUExFTkJRVU1zYVVOQlFXbERMRU5CUVVNc1EwRkJRenRCUVVOeVJTeEpRVUZOTEdWQlFXVXNSMEZCUnl4UFFVRlBMRU5CUVVNc2RVSkJRWFZDTEVOQlFVTXNRMEZCUXpzN1FVRkZla1FzU1VGQlRTeHJRa0ZCYTBJc1IwRkJSeXhMUVVGTExFTkJRVU1zVjBGQlZ5eERRVUZET3pzN1FVRkRNME1zYVVKQlFXVXNSVUZCUlN3eVFrRkJWenRCUVVNeFFpeFhRVUZQTzBGQlEwd3NZVUZCVHl4RlFVRkZMRmRCUVZjc1EwRkJReXhWUVVGVkxFVkJRVVU3UVVGRGFrTXNZVUZCVHl4RlFVRkZMRmRCUVZjc1EwRkJReXhuUWtGQlowSXNSVUZCUlR0QlFVTjJReXhwUWtGQlZ5eEZRVUZGTEZkQlFWY3NRMEZCUXl4dlFrRkJiMElzUlVGQlJUdExRVU5vUkN4RFFVRkRPMGRCUTBnN08wRkJSVVFzWVVGQlZ5eEZRVUZGTEhGQ1FVRlRMRXRCUVVzc1JVRkJSVHRCUVVNelFpeHhRa0ZCYVVJc1EwRkJReXhuUWtGQlowSXNRMEZEYUVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1QwRkJUeXhEUVVGRExFOUJRVThzUlVGQlJTeEZRVUZGTEVOQlFVTXNSVUZETVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFBRVUZQTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNc1NVRkJTU3hEUVVNdlFpeERRVUZET3p0QlFVVkdMRkZCUVVrc1YwRkJWeXhEUVVGRExHRkJRV0VzUlVGQlJTeEZRVUZGTzBGQlF5OUNMRzFDUVVGaExFTkJRVU1zV1VGQldTeERRVUZETEV0QlFVc3NSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFOUJRVThzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRCUVVOc1JTeDFRa0ZCYVVJc1EwRkJReXhUUVVGVExFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdTMEZETjBRN08wRkJSVVFzVVVGQlNTeERRVUZETEZGQlFWRXNRMEZCUXp0QlFVTmFMR05CUVZFc1JVRkJSU3hMUVVGTE8wdEJRMmhDTEVOQlFVTXNRMEZCUXp0SFFVTktPenRCUVVWRUxHMUNRVUZwUWl4RlFVRkZMRFpDUVVGWE8wRkJRelZDTEdWQlFWY3NRMEZCUXl3NFFrRkJPRUlzUTBGQlF5eEpRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN1IwRkROVVE3TzBGQlJVUXNjVUpCUVcxQ0xFVkJRVVVzSzBKQlFWYzdRVUZET1VJc1pVRkJWeXhEUVVGRExHbERRVUZwUXl4RFFVRkRMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dEhRVU12UkRzN1FVRkZSQ3hYUVVGVExFVkJRVVVzY1VKQlFWVTdRVUZEYmtJc1VVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF6dEJRVU5hTEdGQlFVOHNSVUZCUlN4WFFVRlhMRU5CUVVNc1ZVRkJWU3hGUVVGRk8wRkJRMnBETEdGQlFVOHNSVUZCUlN4WFFVRlhMRU5CUVVNc1owSkJRV2RDTEVWQlFVVTdRVUZEZGtNc2FVSkJRVmNzUlVGQlJTeFhRVUZYTEVOQlFVTXNiMEpCUVc5Q0xFVkJRVVU3UzBGRGFFUXNRMEZCUXl4RFFVRkRPMGRCUTBvN08wRkJSVVFzVVVGQlRTeEZRVUZGTEd0Q1FVRlhPMEZCUTJwQ0xGRkJRVWtzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRVZCUVVVN1FVRkRkRUlzWVVGRFJUczdWVUZCVHl4VFFVRlRMRVZCUVVNc1pVRkJaVHRSUVVNNVFqczdXVUZCUnl4VFFVRlRMRVZCUVVNc2JVSkJRVzFDTzFWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhYUVVGWE8xTkJRVXM3VVVGRE4wUTdPenRWUVVOSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWRCUVVjc1EwRkJReXhWUVVGVExFMUJRVTBzUlVGQlJTeERRVUZETEVWQlFVTTdRVUZEZWtNc1owSkJRVWtzU1VGQlNTeEhRVUZITEhOQ1FVRnpRaXhEUVVGRE8wRkJRMnhETEdkQ1FVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFVkJRVVVzU1VGQlNTeEhRVUZITEhGQ1FVRnhRaXhEUVVGRE8wRkJRM3BETEcxQ1FVTkZPenRuUWtGQlNTeFRRVUZUTEVWQlFVVXNTVUZCU1N4QlFVRkRPMk5CUVVVc1RVRkJUVHRoUVVGTkxFTkJRMnhETzFkQlEwZ3NSVUZCUlN4SlFVRkpMRU5CUVVNN1UwRkRURHRSUVVOS0xFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWRCUVVjc1EwRkJReXhWUVVGVExFMUJRVTBzUlVGQlJTeERRVUZETEVWQlFVTTdPMEZCUlhwRExHTkJRVWtzWlVGQlpTeEhRVUZITzBGQlEzQkNMR2RDUVVGSkxFVkJRVVVzVFVGQlRTeERRVUZETEVsQlFVazdRVUZEYWtJc1pVRkJSeXhGUVVGRkxFTkJRVU03UVVGRFRpeHBRa0ZCU3l4RlFVRkZMRTFCUVUwc1EwRkJReXhOUVVGTkxFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRCUVVOMFF5eHRRa0ZCVHl4RlFVRkRMRWxCUVVrc1EwRkJReXhYUVVGWExFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NSVUZCUXl4RFFVRkRMRU5CUVVNN1FVRkRja01zYjBKQlFWRXNSVUZCUXl4QlFVRkRMRU5CUVVNc1NVRkJTU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZGQlFWRXNSMEZCU1N4SlFVRkpMRWRCUVVjc1MwRkJTenRYUVVOdVJDeERRVUZCT3p0QlFVVkVMR05CUVVrc1pVRkJaU3hEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEVkQlFVY3NSVUZCUlN4RlFVRkRPMEZCUTI1RExESkNRVUZsTEVOQlFVTXNTVUZCU1N4SFFVRkhMR1ZCUVdVc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNSVUZCUXl4RlFVRkZMRU5CUVVNc1IwRkJSeXhMUVVGTExFTkJRVU03VjBGRGFrVTdPMEZCUlVRc2FVSkJRVk1zYjBKQlFVTXNaVUZCWlN4RlFVRk5MR1ZCUVdVc1EwRkJTU3hEUVVGSE8xTkJRM1JFTEVWQlFVVXNTVUZCU1N4RFFVRkRPMDlCUTBZc1EwRkRVanRMUVVOSUxFMUJRMGs3UVVGRFNDeGhRVU5GTEN0Q1FVRlBMRk5CUVZNc1JVRkJReXhsUVVGbExFZEJRVk1zUTBGRGVrTTdTMEZEU0R0SFFVTkdPME5CUTBZc1EwRkJReXhEUVVGRE96dEJRVVZJTEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc2EwSkJRV3RDTEVOQlFVTWlMQ0ptYVd4bElqb2lMMVZ6WlhKekwyZHlaV2R2Y25sZlptOXpkR1Z5TDJSaGRHRXRaVzVuTDJodmJtVjVjRzkwTDJSbGRpOXpZM0pwY0hSekwzVnBMMFpwYkhSbGNsSmxjM1ZzZEhOVVlXSnNaUzVxYzNnaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZMeUJHU1V4VVJWSlNSVk5WVEZSVFZFRkNURVZjYmk4cWFuTm9hVzUwSUdWemJtVjRkRG9nZEhKMVpTQXFMMXh1WEc1amIyNXpkQ0JHYVd4MFpYSlRkRzl5WlNBOUlISmxjWFZwY21Vb0p5NHVMM04wYjNKbGN5OUdhV3gwWlhKVGRHOXlaU2NwTzF4dVkyOXVjM1FnUm1sc2RHVnlRV04wYVc5dWN5QTlJSEpsY1hWcGNtVW9KeTR1TDJGamRHbHZibk12Um1sc2RHVnlRV04wYVc5dWN5Y3BPMXh1WTI5dWMzUWdSR1YwWVdsc1ZtbGxkMEZqZEdsdmJuTWdQU0J5WlhGMWFYSmxLQ2N1TGk5aFkzUnBiMjV6TDBSbGRHRnBiRlpwWlhkQlkzUnBiMjV6TG1wekp5azdYRzVqYjI1emRDQkdhV3gwWlhKU1pYTjFiSFJTYjNjZ1BTQnlaWEYxYVhKbEtDY3VMMFpwYkhSbGNsSmxjM1ZzZEZKdmR5NXFjM2duS1R0Y2JseHVZMjl1YzNRZ1JtbHNkR1Z5VW1WemRXeDBjMVJoWW14bElEMGdVbVZoWTNRdVkzSmxZWFJsUTJ4aGMzTW9lMXh1SUNCblpYUkpibWwwYVdGc1UzUmhkR1U2SUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUI3WEc0Z0lDQWdJQ0J5WlhOMWJIUnpPaUJHYVd4MFpYSlRkRzl5WlM1blpYUlNaWE4xYkhSektDa3NJRnh1SUNBZ0lDQWdhR1ZoWkdWeWN6b2dSbWxzZEdWeVUzUnZjbVV1WjJWMFVtVnpkV3gwU0dWaFpHVnljeWdwTEZ4dUlDQWdJQ0FnWkdWelkzSnBjSFJwYjI0NklFWnBiSFJsY2xOMGIzSmxMbWRsZEVSbGMyTnlhWEIwYVc5dVUzUnlhVzVuS0NsY2JpQWdJQ0I5TzF4dUlDQjlMRnh1WEc0Z0lHaGhibVJzWlVOc2FXTnJPaUJtZFc1amRHbHZiaWhwYm1SbGVDa2dlMXh1SUNBZ0lFUmxkR0ZwYkZacFpYZEJZM1JwYjI1ekxuVndaR0YwWlVSbGRHRnBiRlpwWlhjb1hHNGdJQ0FnSUNCMGFHbHpMbk4wWVhSbExtaGxZV1JsY25OYk1GMHVjbVZ3YkdGalpTZ25JRzVoYldVbkxDQW5KeWtzWEc0Z0lDQWdJQ0IwYUdsekxuTjBZWFJsTG5KbGMzVnNkSE5iYVc1a1pYaGRMbTVoYldWY2JpQWdJQ0FwTzF4dVhHNGdJQ0FnYVdZZ0tFWnBiSFJsY2xOMGIzSmxMbWx6VTJodmQybHVaMFJoWjNNb0tTa2dlMXh1SUNBZ0lDQWdSbWxzZEdWeVFXTjBhVzl1Y3k1MWNHUmhkR1ZHYVd4MFpYSW9YQ0prWVdkY0lpd2dkR2hwY3k1emRHRjBaUzV5WlhOMWJIUnpXMmx1WkdWNFhTNXVZVzFsS1R0Y2JpQWdJQ0FnSUVSbGRHRnBiRlpwWlhkQlkzUnBiMjV6TG5Wd1pHRjBaVVJoWnloMGFHbHpMbk4wWVhSbExuSmxjM1ZzZEhOYmFXNWtaWGhkTG01aGJXVXBPMXh1SUNBZ0lIMWNiaUFnSUNCY2JpQWdJQ0IwYUdsekxuTmxkRk4wWVhSbEtIdGNiaUFnSUNBZ0lITmxiR1ZqZEdWa09pQnBibVJsZUZ4dUlDQWdJSDBwTzF4dUlDQjlMRnh1WEc0Z0lHTnZiWEJ2Ym1WdWRFUnBaRTF2ZFc1ME9pQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQkdhV3gwWlhKVGRHOXlaUzVoWkdSR2FXeDBaWEpTWlhOMWJIUnpRMmhoYm1kbFRHbHpkR1Z1WlhJb2RHaHBjeTVmYjI1RGFHRnVaMlVwT3lCY2JpQWdmU3hjYmx4dUlDQmpiMjF3YjI1bGJuUkVhV1JWYm0xdmRXNTBPaUJtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0JHYVd4MFpYSlRkRzl5WlM1eVpXMXZkbVZHYVd4MFpYSlNaWE4xYkhSelEyaGhibWRsVEdsemRHVnVaWElvZEdocGN5NWZiMjVEYUdGdVoyVXBPeUJjYmlBZ2ZTeGNibHh1SUNCZmIyNURhR0Z1WjJVNklHWjFibU4wYVc5dUtDbDdYRzRnSUNBZ2RHaHBjeTV6WlhSVGRHRjBaU2g3WEc0Z0lDQWdJQ0J5WlhOMWJIUnpPaUJHYVd4MFpYSlRkRzl5WlM1blpYUlNaWE4xYkhSektDa3NYRzRnSUNBZ0lDQm9aV0ZrWlhKek9pQkdhV3gwWlhKVGRHOXlaUzVuWlhSU1pYTjFiSFJJWldGa1pYSnpLQ2tzWEc0Z0lDQWdJQ0JrWlhOamNtbHdkR2x2YmpvZ1JtbHNkR1Z5VTNSdmNtVXVaMlYwUkdWelkzSnBjSFJwYjI1VGRISnBibWNvS1Z4dUlDQWdJSDBwTzF4dUlDQjlMRnh1WEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ2FXWWdLSFJvYVhNdWMzUmhkR1V1Y21WemRXeDBjeWtnZTF4dUlDQWdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJQ0FnUEhSaFlteGxJR05zWVhOelRtRnRaVDBuWm1sc2RHVnlVbVZ6ZFd4MGN5YytYRzRnSUNBZ0lDQWdJQ0FnUEhBZ1kyeGhjM05PWVcxbFBTZG1hV3gwWlhKRVpYTmpjbWx3ZEdsdmJpYytlM1JvYVhNdWMzUmhkR1V1WkdWelkzSnBjSFJwYjI1OVBDOXdQbHh1SUNBZ0lDQWdJQ0FnSUR4MGNqNWNiaUFnSUNBZ0lDQWdJQ0FnSUh0MGFHbHpMbk4wWVhSbExtaGxZV1JsY25NdWJXRndLR1oxYm1OMGFXOXVLR2hsWVdSbGNpd2dhU2w3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJR3hsZENCdVlXMWxJRDBnSjJacGJIUmxjbEpsYzNWc2RGSnZkMVpoYkhWbEp6dGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLR2tnUFQwZ01Da2dibUZ0WlNBOUlDZG1hV3gwWlhKU1pYTjFiSFJTYjNkT1lXMWxKenRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThkR2dnWTJ4aGMzTk9ZVzFsUFh0dVlXMWxmVDU3YUdWaFpHVnlmVHd2ZEdnK1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0I5TENCMGFHbHpLWDFjYmlBZ0lDQWdJQ0FnSUNBOEwzUnlQbHh1SUNBZ0lDQWdJQ0FnSUh0MGFHbHpMbk4wWVhSbExuSmxjM1ZzZEhNdWJXRndLR1oxYm1OMGFXOXVLSEpsYzNWc2RDd2dhU2w3WEc0Z0lDQWdJQ0FnSUNBZ0lDQXZMeUJEY21WaGRHVWdZV3hzSUhSb1pTQnlaWE4xYkhRZ2NtOTNjMXh1SUNBZ0lDQWdJQ0FnSUNBZ2JHVjBJSEpsYzNWc2RITlNiM2RRY205d2N5QTlJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdibUZ0WlRvZ2NtVnpkV3gwTG01aGJXVXNYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lHdGxlVG9nYVN4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnZG1Gc2RXVTZJRTUxYldKbGNpaHlaWE4xYkhRdWRtRnNkV1V1ZEc5R2FYaGxaQ2d4S1Nrc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUdoaGJtUnNaWEk2ZEdocGN5NW9ZVzVrYkdWRGJHbGpheTVpYVc1a0tIUm9hWE1zYVNrc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUhObGJHVmpkR1ZrT2locElEMDlJSFJvYVhNdWMzUmhkR1V1YzJWc1pXTjBaV1FwSUQ4Z2RISjFaU0E2SUdaaGJITmxYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lDQWdJQ0F2THlCVGFHOXlkR1Z1SUc1aGJXVWdkRzhnY0hKbGRtVnVkQ0J2ZG1WeVpteHZkMXh1SUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLSEpsYzNWc2RITlNiM2RRY205d2N5NXVZVzFsTG14bGJtZDBhQ0ErSURJMUtYc2dYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lISmxjM1ZzZEhOU2IzZFFjbTl3Y3k1dVlXMWxJRDBnY21WemRXeDBjMUp2ZDFCeWIzQnpMbTVoYldVdWMyeHBZMlVvTUN3eU5Ta2dLeUFuTGk0dUp6dGNiaUFnSUNBZ0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJQ2dnUEVacGJIUmxjbEpsYzNWc2RGSnZkeUFnZXk0dUxuSmxjM1ZzZEhOU2IzZFFjbTl3YzMwZ0x6NGdLVHRjYmlBZ0lDQWdJQ0FnSUNCOUxDQjBhR2x6S1gxY2JpQWdJQ0FnSUNBZ1BDOTBZV0pzWlQ0Z1hHNGdJQ0FnSUNBcE8xeHVJQ0FnSUgxY2JpQWdJQ0JsYkhObElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBZ0lEeDBZV0pzWlNCamJHRnpjMDVoYldVOUoyWnBiSFJsY2xKbGMzVnNkSE1uUGp3dmRHRmliR1UrWEc0Z0lDQWdJQ0FwTzF4dUlDQWdJSDFjYmlBZ2ZWeHVmU2s3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1JtbHNkR1Z5VW1WemRXeDBjMVJoWW14bE8xeHVJbDE5IiwiLypqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIERldGFpbFZpZXdTdG9yZSA9IHJlcXVpcmUoJy4uL3N0b3Jlcy9EZXRhaWxWaWV3U3RvcmUnKTtcbnZhciBEZXRhaWxWaWV3QWN0aW9ucyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvRGV0YWlsVmlld0FjdGlvbnMnKTtcbnZhciBGaWx0ZXJCdXR0b24gPSByZXF1aXJlKCcuL0ZpbHRlckJ1dHRvbi5qc3gnKTtcblxudmFyIE1lYXN1cmVSb3cgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnTWVhc3VyZVJvdycsXG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgbGFiZWxzOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZFxuICB9LFxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7IHNlbGVjdGVkOiAwIH07XG4gIH0sXG5cbiAgaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uIGhhbmRsZUNsaWNrKGluZGV4KSB7XG4gICAgaWYgKGluZGV4ICE9IHRoaXMuc3RhdGUuc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBzZWxlY3RlZDogaW5kZXggfSk7XG4gICAgICBEZXRhaWxWaWV3QWN0aW9ucy51cGRhdGVNZWFzdXJlKHRoaXMucHJvcHMubGFiZWxzW2luZGV4XSk7XG4gICAgfVxuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybihcbiAgICAgIC8vIENyZWF0ZSBhIHJhZGlvIGJ1dHRvbiBmb3IgZWFjaCBsYWJlbCBwYXNzZWQgaW4gdG8gdGhlIHByb3BzXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdtZWFzdXJlUm93JyB9LFxuICAgICAgICB0aGlzLnByb3BzLmxhYmVscy5tYXAoZnVuY3Rpb24gKGN1ckxhYmVsLCBpKSB7XG4gICAgICAgICAgdmFyIHNlbGVjdGVkID0gaSA9PSB0aGlzLnN0YXRlLnNlbGVjdGVkID8gJ3NlbGVjdGVkJyA6ICdkZXNlbGVjdGVkJztcblxuICAgICAgICAgIHZhciBmaWx0ZXJCdXR0b25Qcm9wcyA9IHtcbiAgICAgICAgICAgIGxhYmVsOiBjdXJMYWJlbCxcbiAgICAgICAgICAgIGhhbmRsZXI6IHRoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzLCBpKSxcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2ZpbHRlckJ1dHRvbicgKyAnICcgKyBzZWxlY3RlZFxuICAgICAgICAgIH07XG5cbiAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChGaWx0ZXJCdXR0b24sIGZpbHRlckJ1dHRvblByb3BzKTtcbiAgICAgICAgfSwgdGhpcylcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBNZWFzdXJlUm93O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5bmNtVm5iM0o1WDJadmMzUmxjaTlrWVhSaExXVnVaeTlvYjI1bGVYQnZkQzlrWlhZdmMyTnlhWEIwY3k5MWFTOU5aV0Z6ZFhKbFVtOTNMbXB6ZUNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN08wRkJSVUVzU1VGQlRTeGxRVUZsTEVkQlFVY3NUMEZCVHl4RFFVRkRMREpDUVVFeVFpeERRVUZETEVOQlFVTTdRVUZETjBRc1NVRkJUU3hwUWtGQmFVSXNSMEZCUnl4UFFVRlBMRU5CUVVNc09FSkJRVGhDTEVOQlFVTXNRMEZCUXp0QlFVTnNSU3hKUVVGTkxGbEJRVmtzUjBGQlJ5eFBRVUZQTEVOQlFVTXNiMEpCUVc5Q0xFTkJRVU1zUTBGQlF6czdRVUZGYmtRc1NVRkJUU3hWUVVGVkxFZEJRVWNzUzBGQlN5eERRVUZETEZkQlFWY3NRMEZCUXpzN08wRkJSVzVETEZkQlFWTXNSVUZCUlR0QlFVTlVMRlZCUVUwc1JVRkJSU3hMUVVGTExFTkJRVU1zVTBGQlV5eERRVUZETEV0QlFVc3NRMEZCUXl4VlFVRlZPMGRCUTNwRE96dEJRVVZFTEdsQ1FVRmxMRVZCUVVVc01rSkJRVmM3UVVGRE1VSXNWMEZCVHl4RlFVRkRMRkZCUVZFc1JVRkJSU3hEUVVGRExFVkJRVU1zUTBGQlF6dEhRVU4wUWpzN1FVRkZSQ3hoUVVGWExFVkJRVVVzY1VKQlFWTXNTMEZCU3l4RlFVRkZPMEZCUXpOQ0xGRkJRVWtzUzBGQlN5eEpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1VVRkJVU3hGUVVGRk8wRkJRMmhETEZWQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1JVRkJReXhSUVVGUkxFVkJRVVVzUzBGQlN5eEZRVUZETEVOQlFVTXNRMEZCUXp0QlFVTnFReXgxUWtGQmFVSXNRMEZCUXl4aFFVRmhMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eE5RVUZOTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJRenRMUVVNelJEdEhRVU5HT3p0QlFVVkVMRkZCUVUwc1JVRkJSU3hyUWtGQlZ6dEJRVU5xUWpzN1FVRkZSVHM3VlVGQlN5eFRRVUZUTEVWQlFVTXNXVUZCV1R0UlFVTjRRaXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEUxQlFVMHNRMEZCUXl4SFFVRkhMRU5CUVVNc1ZVRkJVeXhSUVVGUkxFVkJRVVVzUTBGQlF5eEZRVUZGTzBGQlF6TkRMR05CUVUwc1VVRkJVU3hIUVVGSExFRkJRVU1zUTBGQlF5eEpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1VVRkJVU3hIUVVGSkxGVkJRVlVzUjBGQlJ5eFpRVUZaTEVOQlFVRTdPMEZCUlhaRkxHTkJRVTBzYVVKQlFXbENMRWRCUVVjN1FVRkRlRUlzYVVKQlFVc3NSVUZCUXl4UlFVRlJPMEZCUTJRc2JVSkJRVThzUlVGQlF5eEpRVUZKTEVOQlFVTXNWMEZCVnl4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFVkJRVU1zUTBGQlF5eERRVUZETzBGQlEzSkRMSEZDUVVGVExFVkJRVU1zWTBGQll5eEhRVUZETEVkQlFVY3NSMEZCUXl4UlFVRlJPMWRCUTNSRExFTkJRVUU3TzBGQlJVUXNhVUpCUTBVc2IwSkJRVU1zV1VGQldTeEZRVUZMTEdsQ1FVRnBRaXhEUVVGSkxFTkJRM1pETzFOQlEwZ3NSVUZCUlN4SlFVRkpMRU5CUVVNN1QwRkRTanROUVVOT08wZEJRMGc3UTBGRFJpeERRVUZETEVOQlFVTTdPMEZCUlVnc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eFZRVUZWTEVOQlFVTWlMQ0ptYVd4bElqb2lMMVZ6WlhKekwyZHlaV2R2Y25sZlptOXpkR1Z5TDJSaGRHRXRaVzVuTDJodmJtVjVjRzkwTDJSbGRpOXpZM0pwY0hSekwzVnBMMDFsWVhOMWNtVlNiM2N1YW5ONElpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lMeXBxYzJocGJuUWdaWE51WlhoME9pQjBjblZsSUNvdlhHNWNibU52Ym5OMElFUmxkR0ZwYkZacFpYZFRkRzl5WlNBOUlISmxjWFZwY21Vb0p5NHVMM04wYjNKbGN5OUVaWFJoYVd4V2FXVjNVM1J2Y21VbktUdGNibU52Ym5OMElFUmxkR0ZwYkZacFpYZEJZM1JwYjI1eklEMGdjbVZ4ZFdseVpTZ25MaTR2WVdOMGFXOXVjeTlFWlhSaGFXeFdhV1YzUVdOMGFXOXVjeWNwTzF4dVkyOXVjM1FnUm1sc2RHVnlRblYwZEc5dUlEMGdjbVZ4ZFdseVpTZ25MaTlHYVd4MFpYSkNkWFIwYjI0dWFuTjRKeWs3WEc1Y2JtTnZibk4wSUUxbFlYTjFjbVZTYjNjZ1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYRzVjYmlBZ2NISnZjRlI1Y0dWek9pQjdYRzRnSUNBZ2JHRmlaV3h6T2lCU1pXRmpkQzVRY205d1ZIbHdaWE11WVhKeVlYa3VhWE5TWlhGMWFYSmxaQ0JjYmlBZ2ZTeGNibHh1SUNCblpYUkpibWwwYVdGc1UzUmhkR1U2SUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUI3YzJWc1pXTjBaV1E2SURCOU8xeHVJQ0I5TEZ4dVhHNGdJR2hoYm1Sc1pVTnNhV05yT2lCbWRXNWpkR2x2YmlocGJtUmxlQ2tnZTF4dUlDQWdJR2xtSUNocGJtUmxlQ0FoUFNCMGFHbHpMbk4wWVhSbExuTmxiR1ZqZEdWa0tTQjdYRzRnSUNBZ0lDQjBhR2x6TG5ObGRGTjBZWFJsS0h0elpXeGxZM1JsWkRvZ2FXNWtaWGg5S1R0Y2JpQWdJQ0FnSUVSbGRHRnBiRlpwWlhkQlkzUnBiMjV6TG5Wd1pHRjBaVTFsWVhOMWNtVW9kR2hwY3k1d2NtOXdjeTVzWVdKbGJITmJhVzVrWlhoZEtUdGNiaUFnSUNCOVhHNGdJSDBzWEc1Y2JpQWdjbVZ1WkdWeU9pQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ0x5OGdRM0psWVhSbElHRWdjbUZrYVc4Z1luVjBkRzl1SUdadmNpQmxZV05vSUd4aFltVnNJSEJoYzNObFpDQnBiaUIwYnlCMGFHVWdjSEp2Y0hOY2JpQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQU2R0WldGemRYSmxVbTkzSno1Y2JpQWdJQ0FnSUNBZ2UzUm9hWE11Y0hKdmNITXViR0ZpWld4ekxtMWhjQ2htZFc1amRHbHZiaWhqZFhKTVlXSmxiQ3dnYVNrZ2UxeHVJQ0FnSUNBZ0lDQWdJR052Ym5OMElITmxiR1ZqZEdWa0lEMGdLR2tnUFQwZ2RHaHBjeTV6ZEdGMFpTNXpaV3hsWTNSbFpDa2dQeUFuYzJWc1pXTjBaV1FuSURvZ0oyUmxjMlZzWldOMFpXUW5YRzVjYmlBZ0lDQWdJQ0FnSUNCamIyNXpkQ0JtYVd4MFpYSkNkWFIwYjI1UWNtOXdjeUE5SUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJR3hoWW1Wc09tTjFja3hoWW1Wc0xDQmNiaUFnSUNBZ0lDQWdJQ0FnSUdoaGJtUnNaWEk2ZEdocGN5NW9ZVzVrYkdWRGJHbGpheTVpYVc1a0tIUm9hWE1zYVNrc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqYkdGemMwNWhiV1U2SjJacGJIUmxja0oxZEhSdmJpY3JKeUFuSzNObGJHVmpkR1ZrWEc0Z0lDQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJQ0FnSUNBZ0lEeEdhV3gwWlhKQ2RYUjBiMjRnZXk0dUxtWnBiSFJsY2tKMWRIUnZibEJ5YjNCemZTQXZQbHh1SUNBZ0lDQWdJQ0FnSUNrN1hHNGdJQ0FnSUNBZ0lIMHNJSFJvYVhNcGZWeHVJQ0FnSUNBZ1BDOWthWFkrWEc0Z0lDQWdLVHRjYmlBZ2ZWeHVmU2s3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1RXVmhjM1Z5WlZKdmR6dGNiaUpkZlE9PSIsIi8vIFNFQVJDSEJPWFxuLypqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIEZpbHRlckFjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL0ZpbHRlckFjdGlvbnMnKTtcblxudmFyIFNlYXJjaEJveCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdTZWFyY2hCb3gnLFxuXG4gIGhhbmRsZUNoYW5nZTogZnVuY3Rpb24gaGFuZGxlQ2hhbmdlKGUpIHtcbiAgICBGaWx0ZXJBY3Rpb25zLnVwZGF0ZVNlYXJjaChlLnRhcmdldC52YWx1ZSk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnZm9ybScsXG4gICAgICB7IGNsYXNzTmFtZTogJ3NlYXJjaEJveCcsXG4gICAgICAgIG9uQ2hhbmdlOiB0aGlzLmhhbmRsZUNoYW5nZSxcbiAgICAgICAgb25TdWJtaXQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdpbnB1dCcsIHsgdHlwZTogJ3RleHQnLCBwbGFjZWhvbGRlcjogJ2ZpbHRlcicsIHJlZjogJ3NlYXJjaFRleHQnIH0pXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gU2VhcmNoQm94O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5bmNtVm5iM0o1WDJadmMzUmxjaTlrWVhSaExXVnVaeTlvYjI1bGVYQnZkQzlrWlhZdmMyTnlhWEIwY3k5MWFTOVRaV0Z5WTJoQ2IzZ3Vhbk40SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN08wRkJSMEVzU1VGQlRTeGhRVUZoTEVkQlFVY3NUMEZCVHl4RFFVRkRMREJDUVVFd1FpeERRVUZETEVOQlFVTTdPMEZCUlRGRUxFbEJRVTBzVTBGQlV5eEhRVUZITEV0QlFVc3NRMEZCUXl4WFFVRlhMRU5CUVVNN096dEJRVU5zUXl4alFVRlpMRVZCUVVVc2MwSkJRVk1zUTBGQlF5eEZRVUZGTzBGQlEzaENMR2xDUVVGaExFTkJRVU1zV1VGQldTeERRVUZETEVOQlFVTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU03UjBGRE5VTTdPMEZCUlVRc1VVRkJUU3hGUVVGRkxHdENRVUZYTzBGQlEycENMRmRCUTBVN08xRkJRVTBzVTBGQlV5eEZRVUZETEZkQlFWYzdRVUZEZWtJc1owSkJRVkVzUlVGQlJTeEpRVUZKTEVOQlFVTXNXVUZCV1N4QlFVRkRPMEZCUXpWQ0xHZENRVUZSTEVWQlFVVXNWVUZCVXl4RFFVRkRMRVZCUVVNN1FVRkJReXhwUWtGQlR5eExRVUZMTEVOQlFVTTdVMEZCUXl4QlFVRkRPMDFCUTNKRExDdENRVUZQTEVsQlFVa3NSVUZCUXl4TlFVRk5MRVZCUVVNc1YwRkJWeXhGUVVGRExGRkJRVkVzUlVGQlF5eEhRVUZITEVWQlFVTXNXVUZCV1N4SFFVRkhPMHRCUTNSRUxFTkJRMUE3UjBGRFNEdERRVU5HTEVOQlFVTXNRMEZCUXpzN1FVRkZTQ3hOUVVGTkxFTkJRVU1zVDBGQlR5eEhRVUZITEZOQlFWTXNRMEZCUXlJc0ltWnBiR1VpT2lJdlZYTmxjbk12WjNKbFoyOXllVjltYjNOMFpYSXZaR0YwWVMxbGJtY3ZhRzl1Wlhsd2IzUXZaR1YyTDNOamNtbHdkSE12ZFdrdlUyVmhjbU5vUW05NExtcHplQ0lzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWk4dklGTkZRVkpEU0VKUFdGeHVMeXBxYzJocGJuUWdaWE51WlhoME9pQjBjblZsSUNvdlhHNWNibU52Ym5OMElFWnBiSFJsY2tGamRHbHZibk1nUFNCeVpYRjFhWEpsS0NjdUxpOWhZM1JwYjI1ekwwWnBiSFJsY2tGamRHbHZibk1uS1R0Y2JseHVZMjl1YzNRZ1UyVmhjbU5vUW05NElEMGdVbVZoWTNRdVkzSmxZWFJsUTJ4aGMzTW9lMXh1SUNCb1lXNWtiR1ZEYUdGdVoyVTZJR1oxYm1OMGFXOXVLR1VwSUh0Y2JpQWdJQ0JHYVd4MFpYSkJZM1JwYjI1ekxuVndaR0YwWlZObFlYSmphQ2hsTG5SaGNtZGxkQzUyWVd4MVpTazdYRzRnSUgwc1hHNWNiaUFnY21WdVpHVnlPaUJtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdLRnh1SUNBZ0lDQWdQR1p2Y20wZ1kyeGhjM05PWVcxbFBTZHpaV0Z5WTJoQ2IzZ25YRzRnSUNBZ0lDQWdJRzl1UTJoaGJtZGxQWHQwYUdsekxtaGhibVJzWlVOb1lXNW5aWDBnWEc0Z0lDQWdJQ0FnSUc5dVUzVmliV2wwUFh0bWRXNWpkR2x2YmlobEtYdHlaWFIxY200Z1ptRnNjMlU3ZlgwK1hHNGdJQ0FnSUNBZ0lEeHBibkIxZENCMGVYQmxQU2QwWlhoMEp5QndiR0ZqWldodmJHUmxjajBuWm1sc2RHVnlKeUJ5WldZOUozTmxZWEpqYUZSbGVIUW5JQzgrSUZ4dUlDQWdJQ0FnUEM5bWIzSnRQbHh1SUNBZ0lDazdYRzRnSUgxY2JuMHBPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUZObFlYSmphRUp2ZUR0Y2JpSmRmUT09IiwiLy8gU0lERUJBUlxuLypqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFNlYXJjaEJveCA9IHJlcXVpcmUoJy4vU2VhcmNoQm94LmpzeCcpO1xudmFyIEZpbHRlck9wdGlvblJvdyA9IHJlcXVpcmUoJy4vRmlsdGVyT3B0aW9uUm93LmpzeCcpO1xudmFyIEZpbHRlclJlc3VsdHNUYWJsZSA9IHJlcXVpcmUoJy4vRmlsdGVyUmVzdWx0c1RhYmxlLmpzeCcpO1xudmFyIEZpbHRlclN0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL0ZpbHRlclN0b3JlJyk7XG5cbnZhciBTaWRlYmFyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ1NpZGViYXInLFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBGaWx0ZXJTdG9yZS5hZGREYWdTZXRMaXN0ZW5lcih0aGlzLl9vbkRhZ1NldCk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkVW5tb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkVW5tb3VudCgpIHtcbiAgICBGaWx0ZXJTdG9yZS5yZW1vdmVEYWdTZXRMaXN0ZW5lcih0aGlzLl9vbkRhZ1NldCk7XG4gIH0sXG5cbiAgX29uRGFnU2V0OiBmdW5jdGlvbiBfb25EYWdTZXQoKSB7XG4gICAgdGhpcy5yZWZzLmdyYWluUm93LnNldFN0YXRlKHsgc2VsZWN0ZWQ6IDEgfSk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnZGl2JyxcbiAgICAgIHsgY2xhc3NOYW1lOiAnc2lkZWJhcicgfSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2VhcmNoQm94LCBudWxsKSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdkaXYnLFxuICAgICAgICB7IGNsYXNzTmFtZTogJ2ZpbHRlck9wdGlvbnMnIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRmlsdGVyT3B0aW9uUm93LCB7IG5hbWU6ICdtZWFzdXJlJywgbGFiZWxzOiBbJ0kvTycsICdDUFUnLCAnTWFwcGVycycsICdSZWR1Y2VycyddIH0pLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZpbHRlck9wdGlvblJvdywgeyBuYW1lOiAndGltZScsIGxhYmVsczogWydXZWVrJywgJ01vbnRoJywgJ1llYXInXSB9KSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGaWx0ZXJPcHRpb25Sb3csIHsgcmVmOiAnZ3JhaW5Sb3cnLCBuYW1lOiAnZ3JhaW4nLCBsYWJlbHM6IFsnREFHJywgJ1Rhc2snXSB9KVxuICAgICAgKSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRmlsdGVyUmVzdWx0c1RhYmxlLCBudWxsKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNpZGViYXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTluY21WbmIzSjVYMlp2YzNSbGNpOWtZWFJoTFdWdVp5OW9iMjVsZVhCdmRDOWtaWFl2YzJOeWFYQjBjeTkxYVM5VGFXUmxZbUZ5TG1wemVDSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPenRCUVVkQkxFbEJRVTBzVTBGQlV5eEhRVUZITEU5QlFVOHNRMEZCUXl4cFFrRkJhVUlzUTBGQlF5eERRVUZETzBGQlF6ZERMRWxCUVUwc1pVRkJaU3hIUVVGSExFOUJRVThzUTBGQlF5eDFRa0ZCZFVJc1EwRkJReXhEUVVGRE8wRkJRM3BFTEVsQlFVMHNhMEpCUVd0Q0xFZEJRVWNzVDBGQlR5eERRVUZETERCQ1FVRXdRaXhEUVVGRExFTkJRVU03UVVGREwwUXNTVUZCVFN4WFFVRlhMRWRCUVVjc1QwRkJUeXhEUVVGRExIVkNRVUYxUWl4RFFVRkRMRU5CUVVNN08wRkJSWEpFTEVsQlFVMHNUMEZCVHl4SFFVRkhMRXRCUVVzc1EwRkJReXhYUVVGWExFTkJRVU03T3p0QlFVVm9ReXh0UWtGQmFVSXNSVUZCUlN3MlFrRkJWenRCUVVNMVFpeGxRVUZYTEVOQlFVTXNhVUpCUVdsQ0xFTkJRVU1zU1VGQlNTeERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRPMGRCUXk5RE96dEJRVVZFTEhGQ1FVRnRRaXhGUVVGRkxDdENRVUZYTzBGQlF6bENMR1ZCUVZjc1EwRkJReXh2UWtGQmIwSXNRMEZCUXl4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03UjBGRGJFUTdPMEZCUlVRc1YwRkJVeXhGUVVGRkxIRkNRVUZWTzBGQlEyNUNMRkZCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEZGQlFWRXNRMEZCUXl4RlFVRkRMRkZCUVZFc1JVRkJSU3hEUVVGRExFVkJRVU1zUTBGQlF5eERRVUZETzBkQlF6VkRPenRCUVVWRUxGRkJRVTBzUlVGQlJTeHJRa0ZCVnp0QlFVTnFRaXhYUVVORk96dFJRVUZMTEZOQlFWTXNSVUZCUXl4VFFVRlRPMDFCUTNSQ0xHOUNRVUZETEZOQlFWTXNUMEZCUnp0TlFVTmlPenRWUVVGTExGTkJRVk1zUlVGQlF5eGxRVUZsTzFGQlF6VkNMRzlDUVVGRExHVkJRV1VzU1VGQlF5eEpRVUZKTEVWQlFVVXNVMEZCVXl4QlFVRkRMRVZCUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU1zUzBGQlN5eEZRVUZETEV0QlFVc3NSVUZCUXl4VFFVRlRMRVZCUVVNc1ZVRkJWU3hEUVVGRExFRkJRVU1zUjBGQlJ6dFJRVU5vUml4dlFrRkJReXhsUVVGbExFbEJRVU1zU1VGQlNTeEZRVUZGTEUxQlFVMHNRVUZCUXl4RlFVRkRMRTFCUVUwc1JVRkJSU3hEUVVGRExFMUJRVTBzUlVGQlF5eFBRVUZQTEVWQlFVTXNUVUZCVFN4RFFVRkRMRUZCUVVNc1IwRkJSenRSUVVOc1JTeHZRa0ZCUXl4bFFVRmxMRWxCUVVNc1IwRkJSeXhGUVVGRExGVkJRVlVzUlVGQlF5eEpRVUZKTEVWQlFVVXNUMEZCVHl4QlFVRkRMRVZCUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU1zUzBGQlN5eEZRVUZETEUxQlFVMHNRMEZCUXl4QlFVRkRMRWRCUVVjN1QwRkRja1U3VFVGRFRpeHZRa0ZCUXl4clFrRkJhMElzVDBGQlJ6dExRVU5zUWl4RFFVTk9PMGRCUTBnN1EwRkRSaXhEUVVGRExFTkJRVU03TzBGQlJVZ3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhQUVVGUExFTkJRVU1pTENKbWFXeGxJam9pTDFWelpYSnpMMmR5WldkdmNubGZabTl6ZEdWeUwyUmhkR0V0Wlc1bkwyaHZibVY1Y0c5MEwyUmxkaTl6WTNKcGNIUnpMM1ZwTDFOcFpHVmlZWEl1YW5ONElpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lMeThnVTBsRVJVSkJVbHh1THlwcWMyaHBiblFnWlhOdVpYaDBPaUIwY25WbElDb3ZYRzVjYm1OdmJuTjBJRk5sWVhKamFFSnZlQ0E5SUhKbGNYVnBjbVVvSnk0dlUyVmhjbU5vUW05NExtcHplQ2NwTzF4dVkyOXVjM1FnUm1sc2RHVnlUM0IwYVc5dVVtOTNJRDBnY21WeGRXbHlaU2duTGk5R2FXeDBaWEpQY0hScGIyNVNiM2N1YW5ONEp5azdYRzVqYjI1emRDQkdhV3gwWlhKU1pYTjFiSFJ6VkdGaWJHVWdQU0J5WlhGMWFYSmxLQ2N1TDBacGJIUmxjbEpsYzNWc2RITlVZV0pzWlM1cWMzZ25LVHRjYm1OdmJuTjBJRVpwYkhSbGNsTjBiM0psSUQwZ2NtVnhkV2x5WlNnbkxpNHZjM1J2Y21WekwwWnBiSFJsY2xOMGIzSmxKeWs3WEc1Y2JtTnZibk4wSUZOcFpHVmlZWElnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hHNWNiaUFnWTI5dGNHOXVaVzUwUkdsa1RXOTFiblE2SUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0FnSUVacGJIUmxjbE4wYjNKbExtRmtaRVJoWjFObGRFeHBjM1JsYm1WeUtIUm9hWE11WDI5dVJHRm5VMlYwS1RzZ1hHNGdJSDBzWEc1Y2JpQWdZMjl0Y0c5dVpXNTBSR2xrVlc1dGIzVnVkRG9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnUm1sc2RHVnlVM1J2Y21VdWNtVnRiM1psUkdGblUyVjBUR2x6ZEdWdVpYSW9kR2hwY3k1ZmIyNUVZV2RUWlhRcE95QmNiaUFnZlN4Y2JseHVJQ0JmYjI1RVlXZFRaWFE2SUdaMWJtTjBhVzl1S0NsN1hHNGdJQ0FnZEdocGN5NXlaV1p6TG1keVlXbHVVbTkzTG5ObGRGTjBZWFJsS0h0elpXeGxZM1JsWkRvZ01YMHBPMXh1SUNCOUxGeHVYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBTZHphV1JsWW1GeUp6NWNiaUFnSUNBZ0lDQWdQRk5sWVhKamFFSnZlQ0F2UGx4dUlDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDBuWm1sc2RHVnlUM0IwYVc5dWN5YytYRzRnSUNBZ0lDQWdJQ0FnUEVacGJIUmxjazl3ZEdsdmJsSnZkeUJ1WVcxbFBYc25iV1ZoYzNWeVpTZDlJR3hoWW1Wc2N6MTdXeWRKTDA4bkxDZERVRlVuTENkTllYQndaWEp6Snl3blVtVmtkV05sY25NblhYMGdMejVjYmlBZ0lDQWdJQ0FnSUNBOFJtbHNkR1Z5VDNCMGFXOXVVbTkzSUc1aGJXVTlleWQwYVcxbEozMGdiR0ZpWld4elBYdGJKMWRsWldzbkxDZE5iMjUwYUNjc0oxbGxZWEluWFgwZ0x6NWNiaUFnSUNBZ0lDQWdJQ0E4Um1sc2RHVnlUM0IwYVc5dVVtOTNJSEpsWmowblozSmhhVzVTYjNjbklHNWhiV1U5ZXlkbmNtRnBiaWQ5SUd4aFltVnNjejE3V3lkRVFVY25MQ2RVWVhOckoxMTlJQzgrWEc0Z0lDQWdJQ0FnSUR3dlpHbDJQbHh1SUNBZ0lDQWdJQ0E4Um1sc2RHVnlVbVZ6ZFd4MGMxUmhZbXhsSUM4K1hHNGdJQ0FnSUNBOEwyUnBkajVjYmlBZ0lDQXBPMXh1SUNCOVhHNTlLVHRjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCVGFXUmxZbUZ5TzF4dUlsMTkiLCIvLyBkM0NoYXJ0LmpzXG4vKmpzaGludCBlc25leHQ6IHRydWUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZDNDaGFydCA9IHt9O1xudmFyIERldGFpbFZpZXdBY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9EZXRhaWxWaWV3QWN0aW9ucycpO1xuXG5kM0NoYXJ0LmNyZWF0ZSA9IGZ1bmN0aW9uIChlbCkge1xuXG4gIHZhciBjaGFydCA9IGQzLnNlbGVjdChlbCkuYXBwZW5kKCdzdmcnKS5hdHRyKCdjbGFzcycsICdtYWluQ2hhcnQnKS5vbignbW91c2Vtb3ZlJywgZDNDaGFydC5tb3VzZW1vdmUpO1xuXG4gIGNoYXJ0LmFwcGVuZCgnY2xpcFBhdGgnKS5hdHRyKCdpZCcsICdwbG90QXJlYUNsaXAnKS5hcHBlbmQoJ3JlY3QnKS5hdHRyKCdpZCcsICdwbG90QXJlYUNsaXBSZWN0Jyk7XG5cbiAgdmFyIHBsb3RBcmVhID0gY2hhcnQuYXBwZW5kKCdnJyk7XG5cbiAgcGxvdEFyZWEuYXBwZW5kKCdzdmc6cGF0aCcpLmF0dHIoJ2NsYXNzJywgJ2xpbmUnKTtcblxuICBwbG90QXJlYS5hcHBlbmQoJ3N2ZzpsaW5lJykuYXR0cignY2xhc3MnLCAnZm9jdXNMaW5lJyk7XG5cbiAgY2hhcnQuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAneEF4aXMnKTtcblxuICBjaGFydC5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd5QXhpcycpO1xuXG4gIHZhciBuYXZDaGFydCA9IGQzLnNlbGVjdChlbCkuYXBwZW5kKCdzdmcnKS5jbGFzc2VkKCduYXZpZ2F0b3InLCB0cnVlKTtcblxuICBuYXZDaGFydC5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd4QXhpcycpO1xuXG4gIG5hdkNoYXJ0LmFwcGVuZCgncGF0aCcpLmF0dHIoJ2NsYXNzJywgJ2ZpbGwnKTtcblxuICBuYXZDaGFydC5hcHBlbmQoJ3BhdGgnKS5hdHRyKCdjbGFzcycsICdsaW5lJykuYXR0cignc3Ryb2tlJywgJ2JsdWUnKS5hdHRyKCdzdHJva2Utd2lkdGgnLCAyKS5hdHRyKCdmaWxsJywgJ25vbmUnKTtcblxuICBuYXZDaGFydC5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd2aWV3cG9ydCcpO1xufTtcblxuZDNDaGFydC5saW5lRnVuY3Rpb24gPSBmdW5jdGlvbiAoc2NhbGVzKSB7XG4gIHJldHVybiBkMy5zdmcubGluZSgpLngoZnVuY3Rpb24gKGQpIHtcbiAgICByZXR1cm4gc2NhbGVzLngoZC5kYXRlKTtcbiAgfSkueShmdW5jdGlvbiAoZCkge1xuICAgIHJldHVybiBzY2FsZXMueShkLnZhbHVlKTtcbiAgfSkuaW50ZXJwb2xhdGUoJ2xpbmVhcicpO1xufTtcblxuLy8gU0laSU5HIElORk9STUFUSU9OXG5cbmQzQ2hhcnQubWFyZ2lucyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHsgYm90dG9tOiA1MCwgbGVmdDogNzUgfTtcbn07XG5cbmQzQ2hhcnQubWFpblNpemUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBjaGFydCA9IGQzLnNlbGVjdCgnc3ZnJylbMF1bMF07XG4gIHZhciB3aWR0aCA9IGNoYXJ0Lm9mZnNldFdpZHRoO1xuICB2YXIgaGVpZ2h0ID0gY2hhcnQub2Zmc2V0SGVpZ2h0O1xuICByZXR1cm4geyB3aWR0aDogd2lkdGgsIGhlaWdodDogaGVpZ2h0IH07XG59O1xuXG5kM0NoYXJ0Lm5hdlNpemUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBjaGFydCA9IGQzLnNlbGVjdCgnc3ZnJylbMF1bMF07XG4gIHZhciB3aWR0aCA9IGNoYXJ0Lm9mZnNldFdpZHRoO1xuICB2YXIgaGVpZ2h0ID0gY2hhcnQub2Zmc2V0SGVpZ2h0ICogKDEgLyA2KTtcbiAgcmV0dXJuIHsgd2lkdGg6IHdpZHRoLCBoZWlnaHQ6IGhlaWdodCB9O1xufTtcblxuZDNDaGFydC51cGRhdGUgPSBmdW5jdGlvbiAoZGF0YSkge1xuXG4gIC8vIE1BSU4gQ0hBUlRcbiAgZDNDaGFydC5kYXRhID0gZGF0YTtcbiAgdmFyIG1haW5TaXplID0gdGhpcy5tYWluU2l6ZSgpO1xuICB2YXIgbWFyZ2lucyA9IHRoaXMubWFyZ2lucygpO1xuICBkM0NoYXJ0Lm1haW5TY2FsZXMgPSB0aGlzLl9zY2FsZXMoe1xuICAgIHg6IG1hcmdpbnMubGVmdCxcbiAgICB5OiAwLFxuICAgIHdpZHRoOiBtYWluU2l6ZS53aWR0aCxcbiAgICBoZWlnaHQ6IG1haW5TaXplLmhlaWdodCAtIG1hcmdpbnMuYm90dG9tXG4gIH0pO1xuXG4gIHZhciBsaW5lRnVuYyA9IHRoaXMubGluZUZ1bmN0aW9uKGQzQ2hhcnQubWFpblNjYWxlcyk7XG5cbiAgdmFyIHhBeGlzID0gZDMuc3ZnLmF4aXMoKS5zY2FsZShkM0NoYXJ0Lm1haW5TY2FsZXMueCkub3JpZW50KCdib3R0b20nKS50aWNrcyg2KTtcblxuICB2YXIgeUF4aXMgPSBkMy5zdmcuYXhpcygpLnNjYWxlKGQzQ2hhcnQubWFpblNjYWxlcy55KS5vcmllbnQoJ2xlZnQnKS50aWNrRm9ybWF0KGQzLmZvcm1hdChcIi4zc1wiKSkudGlja3MoNSk7XG5cbiAgdmFyIG1haW5DaGFydCA9IGQzLnNlbGVjdCgnLm1haW5DaGFydCcpO1xuICBtYWluQ2hhcnQuc2VsZWN0KCcueEF4aXMnKS5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsICcgKyAobWFpblNpemUuaGVpZ2h0IC0gbWFyZ2lucy5ib3R0b20pICsgJyknKS50cmFuc2l0aW9uKCkuY2FsbCh4QXhpcyk7XG4gIG1haW5DaGFydC5zZWxlY3QoJy55QXhpcycpLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIG1hcmdpbnMubGVmdCArICcsIDApJykudHJhbnNpdGlvbigpLmNhbGwoeUF4aXMpO1xuICBtYWluQ2hhcnQuc2VsZWN0KCcubGluZScpLnRyYW5zaXRpb24oKS5hdHRyKCdkJywgbGluZUZ1bmMoZDNDaGFydC5kYXRhKSk7XG5cbiAgLy8gTkFWIENIQVJUXG4gIHZhciBuYXZTaXplID0gdGhpcy5uYXZTaXplKCk7XG4gIGQzQ2hhcnQubmF2U2NhbGVzID0gdGhpcy5fc2NhbGVzKHtcbiAgICB4OiBtYXJnaW5zLmxlZnQsXG4gICAgeTogMCxcbiAgICB3aWR0aDogbmF2U2l6ZS53aWR0aCxcbiAgICBoZWlnaHQ6IG5hdlNpemUuaGVpZ2h0XG4gIH0pO1xuXG4gIHZhciBuYXZDaGFydCA9IGQzLnNlbGVjdCgnLm5hdmlnYXRvcicpLmF0dHIoJ3dpZHRoJywgbmF2U2l6ZS53aWR0aCArIG1hcmdpbnMubGVmdCkuYXR0cignaGVpZ2h0JywgbmF2U2l6ZS5oZWlnaHQgKyBtYXJnaW5zLmJvdHRvbSkuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgbWFyZ2lucy5sZWZ0ICsgJywnICsgbWFyZ2lucy5ib3R0b20gKyAnKScpO1xuXG4gIHZhciBuYXZYQXhpcyA9IGQzLnN2Zy5heGlzKCkuc2NhbGUoZDNDaGFydC5uYXZTY2FsZXMueCkub3JpZW50KCdib3R0b20nKS50aWNrcyg1KTtcblxuICBuYXZDaGFydC5zZWxlY3QoJy54QXhpcycpLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwnICsgbmF2U2l6ZS5oZWlnaHQgKyAnKScpLmNhbGwobmF2WEF4aXMpO1xuXG4gIC8vIE5hdiBHcmFwaCBGdW5jdGlvbiBmb3IgYXJlYVxuICB2YXIgbmF2RmlsbCA9IGQzLnN2Zy5hcmVhKCkueChmdW5jdGlvbiAoZCkge1xuICAgIHJldHVybiBkM0NoYXJ0Lm5hdlNjYWxlcy54KGQuZGF0ZSk7XG4gIH0pLnkwKG5hdlNpemUuaGVpZ2h0KS55MShmdW5jdGlvbiAoZCkge1xuICAgIHJldHVybiBkM0NoYXJ0Lm5hdlNjYWxlcy55KGQudmFsdWUpO1xuICB9KTtcblxuICAvLyBOYXYgR3JhcGggRnVuY3Rpb24gZm9yIGxpbmVcbiAgdmFyIG5hdkxpbmUgPSBkMy5zdmcubGluZSgpLngoZnVuY3Rpb24gKGQpIHtcbiAgICByZXR1cm4gZDNDaGFydC5uYXZTY2FsZXMueChkLmRhdGUpO1xuICB9KS55KGZ1bmN0aW9uIChkKSB7XG4gICAgcmV0dXJuIGQzQ2hhcnQubmF2U2NhbGVzLnkoZC52YWx1ZSk7XG4gIH0pO1xuXG4gIG5hdkNoYXJ0LnNlbGVjdCgnLmZpbGwnKS50cmFuc2l0aW9uKCkuYXR0cignZCcsIG5hdkZpbGwoZDNDaGFydC5kYXRhKSk7XG5cbiAgbmF2Q2hhcnQuc2VsZWN0KCcubGluZScpLnRyYW5zaXRpb24oKS5hdHRyKCdkJywgbmF2TGluZShkM0NoYXJ0LmRhdGEpKTtcblxuICB2YXIgdmlld3BvcnQgPSBkMy5zdmcuYnJ1c2goKS54KGQzQ2hhcnQubmF2U2NhbGVzLngpLm9uKCdicnVzaCcsIGZ1bmN0aW9uICgpIHtcbiAgICBkM0NoYXJ0Lm1haW5TY2FsZXMueC5kb21haW4odmlld3BvcnQuZW1wdHkoKSA/IGQzQ2hhcnQubmF2U2NhbGVzLnguZG9tYWluKCkgOiB2aWV3cG9ydC5leHRlbnQoKSk7XG4gICAgZDNDaGFydC5yZWRyYXdDaGFydChkM0NoYXJ0Lm1haW5TY2FsZXMsIHhBeGlzLCBkM0NoYXJ0LmRhdGEpO1xuICB9KTtcblxuICBuYXZDaGFydC5zZWxlY3QoJy52aWV3cG9ydCcpLmNhbGwodmlld3BvcnQpLnNlbGVjdEFsbCgncmVjdCcpLmF0dHIoJ2hlaWdodCcsIG5hdlNpemUuaGVpZ2h0KTtcbn07XG5cbmQzQ2hhcnQucmVkcmF3Q2hhcnQgPSBmdW5jdGlvbiAoc2NhbGVzLCB4QXhpcywgZGF0YSkge1xuICB2YXIgbGluZUZ1bmMgPSB0aGlzLmxpbmVGdW5jdGlvbihzY2FsZXMpO1xuICB4QXhpcy5zY2FsZShzY2FsZXMueCk7XG4gIGQzLnNlbGVjdCgnLm1haW5DaGFydCcpLnNlbGVjdCgnLnhBeGlzJykuY2FsbCh4QXhpcyk7XG4gIGQzLnNlbGVjdCgnLm1haW5DaGFydCcpLnNlbGVjdCgnLmxpbmUnKS5hdHRyKCdkJywgbGluZUZ1bmMoZDNDaGFydC5kYXRhKSk7XG59O1xuXG5kM0NoYXJ0Ll9zY2FsZXMgPSBmdW5jdGlvbiAocmVjdCkge1xuXG4gIHZhciBkYXRlcyA9IGQzQ2hhcnQuZGF0YS5tYXAoZnVuY3Rpb24gKGN1cikge1xuICAgIHJldHVybiBjdXIuZGF0ZTtcbiAgfSk7XG4gIHZhciB2YWx1ZXMgPSBkM0NoYXJ0LmRhdGEubWFwKGZ1bmN0aW9uIChjdXIpIHtcbiAgICByZXR1cm4gY3VyLnZhbHVlO1xuICB9KTtcblxuICB2YXIgbWF4RGF0ZSA9IG5ldyBEYXRlKE1hdGgubWF4LmFwcGx5KG51bGwsIGRhdGVzKSk7XG4gIHZhciBtaW5EYXRlID0gbmV3IERhdGUoTWF0aC5taW4uYXBwbHkobnVsbCwgZGF0ZXMpKTtcbiAgdmFyIG1heFZhbHVlID0gTWF0aC5tYXguYXBwbHkobnVsbCwgdmFsdWVzKTtcbiAgdmFyIG1pblZhbHVlID0gTWF0aC5taW4uYXBwbHkobnVsbCwgdmFsdWVzKTtcblxuICB2YXIgeFNjYWxlID0gZDMudGltZS5zY2FsZSgpLmRvbWFpbihbbWluRGF0ZSwgbWF4RGF0ZV0pLnJhbmdlKFtyZWN0LngsIHJlY3Qud2lkdGhdKTtcblxuICB2YXIgeVNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFttaW5WYWx1ZSAqIDAuOCwgbWF4VmFsdWUgKiAxLjFdKS5yYW5nZShbcmVjdC5oZWlnaHQsIHJlY3QueV0pO1xuXG4gIHJldHVybiB7IHg6IHhTY2FsZSwgeTogeVNjYWxlIH07XG59O1xuXG5kM0NoYXJ0LmJpc2VjdERhdGUgPSBkMy5iaXNlY3RvcihmdW5jdGlvbiAoZCkge1xuICByZXR1cm4gZC5kYXRlO1xufSkubGVmdDtcblxuLy8gRHJhdyBhIHZlcnRpY2FsIGxpbmUgYW5kIHVwZGF0ZSB0aGUgZm9jdXMgZGF0ZSAvIHZhbHVlXG5kM0NoYXJ0Lm1vdXNlbW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gU25hcCB0byBvbmUgbW91c2UgcG9pbnQgYmVjYXVzZSB3aWxsIG5ldmVyIG1vdXNlIG92ZXIgYSBkYXRlIGV4YWN0bHlcbiAgaWYgKGQzQ2hhcnQuZGF0YSkge1xuICAgIHZhciBtb3VzZW92ZXJEYXRlID0gZDNDaGFydC5tYWluU2NhbGVzLnguaW52ZXJ0KGQzLm1vdXNlKHRoaXMpWzBdKSxcbiAgICAgICAgaW5kZXggPSBkM0NoYXJ0LmJpc2VjdERhdGUoZDNDaGFydC5kYXRhLCBtb3VzZW92ZXJEYXRlLCAxKSxcbiAgICAgICAgcG9pbnRCZWZvcmVEYXRlID0gZDNDaGFydC5kYXRhW2luZGV4IC0gMV0sXG4gICAgICAgIHBvaW50T25EYXRlID0gZDNDaGFydC5kYXRhW2luZGV4XSxcbiAgICAgICAgcG9pbnQgPSBtb3VzZW92ZXJEYXRlIC0gcG9pbnRCZWZvcmVEYXRlLmRhdGUgPiBwb2ludE9uRGF0ZS5kYXRlIC0gbW91c2VvdmVyRGF0ZSA/IHBvaW50T25EYXRlIDogcG9pbnRCZWZvcmVEYXRlO1xuICAgIERldGFpbFZpZXdBY3Rpb25zLnVwZGF0ZUZvY3VzRGF0YShwb2ludC5kYXRlLCBwb2ludC52YWx1ZSk7XG4gICAgLy8gRHJhdyB0aGUgbGluZVxuICAgIHZhciBtYXJnaW5zID0gZDNDaGFydC5tYXJnaW5zKCk7XG4gICAgdmFyIHggPSBkMy5tb3VzZSh0aGlzKVswXSA8IG1hcmdpbnMubGVmdCA/IG1hcmdpbnMubGVmdCA6IGQzLm1vdXNlKHRoaXMpWzBdO1xuICAgIHZhciBmb2N1c0xpbmUgPSBkMy5zZWxlY3QoJy5mb2N1c0xpbmUnKS5hdHRyKCd4MScsIHgpLmF0dHIoJ3gyJywgeCkuYXR0cigneTEnLCAwKS5hdHRyKCd5MScsIGQzQ2hhcnQubWFpblNpemUoKS5oZWlnaHQgLSBtYXJnaW5zLmJvdHRvbSk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZDNDaGFydDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OW5jbVZuYjNKNVgyWnZjM1JsY2k5a1lYUmhMV1Z1Wnk5b2IyNWxlWEJ2ZEM5a1pYWXZjMk55YVhCMGN5OTFhUzlrTTBOb1lYSjBMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN08wRkJSMEVzU1VGQlRTeFBRVUZQTEVkQlFVY3NSVUZCUlN4RFFVRkRPMEZCUTI1Q0xFbEJRVTBzYVVKQlFXbENMRWRCUVVjc1QwRkJUeXhEUVVGRExEaENRVUU0UWl4RFFVRkRMRU5CUVVNN08wRkJSV3hGTEU5QlFVOHNRMEZCUXl4TlFVRk5MRWRCUVVjc1ZVRkJVeXhGUVVGRkxFVkJRVVU3TzBGQlJUVkNMRTFCUVUwc1MwRkJTeXhIUVVGSExFVkJRVVVzUTBGQlF5eE5RVUZOTEVOQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNc1RVRkJUU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVU4wUXl4SlFVRkpMRU5CUVVNc1QwRkJUeXhGUVVGRkxGZEJRVmNzUTBGQlF5eERRVU14UWl4RlFVRkZMRU5CUVVNc1YwRkJWeXhGUVVGRkxFOUJRVThzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXpzN1FVRkZkRU1zVDBGQlN5eERRVUZETEUxQlFVMHNRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkRja0lzU1VGQlNTeERRVUZETEVsQlFVa3NSVUZCUlN4alFVRmpMRU5CUVVNc1EwRkRNVUlzVFVGQlRTeERRVUZETEUxQlFVMHNRMEZCUXl4RFFVTmtMRWxCUVVrc1EwRkJReXhKUVVGSkxFVkJRVVVzYTBKQlFXdENMRU5CUVVNc1EwRkJRenM3UVVGRmJFTXNUVUZCVFN4UlFVRlJMRWRCUVVjc1MwRkJTeXhEUVVGRExFMUJRVTBzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXpzN1FVRkZia01zVlVGQlVTeERRVU5NTEUxQlFVMHNRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkRiRUlzU1VGQlNTeERRVUZETEU5QlFVOHNSVUZCUlN4TlFVRk5MRU5CUVVNc1EwRkJRenM3UVVGRmVrSXNWVUZCVVN4RFFVTk1MRTFCUVUwc1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGRGJFSXNTVUZCU1N4RFFVRkRMRTlCUVU4c1JVRkJSU3hYUVVGWExFTkJRVU1zUTBGQlF6czdRVUZGT1VJc1QwRkJTeXhEUVVGRExFMUJRVTBzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZEWkN4SlFVRkpMRU5CUVVNc1QwRkJUeXhGUVVGRkxFOUJRVThzUTBGQlF5eERRVUZET3p0QlFVVXhRaXhQUVVGTExFTkJRVU1zVFVGQlRTeERRVUZETEVkQlFVY3NRMEZCUXl4RFFVTmtMRWxCUVVrc1EwRkJReXhQUVVGUExFVkJRVVVzVDBGQlR5eERRVUZETEVOQlFVTTdPMEZCUlRGQ0xFMUJRVTBzVVVGQlVTeEhRVUZITEVWQlFVVXNRMEZCUXl4TlFVRk5MRU5CUVVNc1JVRkJSU3hEUVVGRExFTkJRVU1zVFVGQlRTeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVTjZReXhQUVVGUExFTkJRVU1zVjBGQlZ5eEZRVUZGTEVsQlFVa3NRMEZCUXl4RFFVRkRPenRCUVVVNVFpeFZRVUZSTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVOcVFpeEpRVUZKTEVOQlFVTXNUMEZCVHl4RlFVRkZMRTlCUVU4c1EwRkJReXhEUVVGRE96dEJRVVV4UWl4VlFVRlJMRU5CUVVNc1RVRkJUU3hEUVVGRExFMUJRVTBzUTBGQlF5eERRVU53UWl4SlFVRkpMRU5CUVVNc1QwRkJUeXhGUVVGRkxFMUJRVTBzUTBGQlF5eERRVUZET3p0QlFVVjZRaXhWUVVGUkxFTkJRVU1zVFVGQlRTeERRVUZETEUxQlFVMHNRMEZCUXl4RFFVTndRaXhKUVVGSkxFTkJRVU1zVDBGQlR5eEZRVUZGTEUxQlFVMHNRMEZCUXl4RFFVTnlRaXhKUVVGSkxFTkJRVU1zVVVGQlVTeEZRVUZGTEUxQlFVMHNRMEZCUXl4RFFVTjBRaXhKUVVGSkxFTkJRVU1zWTBGQll5eEZRVUZGTEVOQlFVTXNRMEZCUXl4RFFVTjJRaXhKUVVGSkxFTkJRVU1zVFVGQlRTeEZRVUZGTEUxQlFVMHNRMEZCUXl4RFFVRkRPenRCUVVWNFFpeFZRVUZSTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVOcVFpeEpRVUZKTEVOQlFVTXNUMEZCVHl4RlFVRkZMRlZCUVZVc1EwRkJReXhEUVVGRE8wTkJRemxDTEVOQlFVTTdPMEZCUlVZc1QwRkJUeXhEUVVGRExGbEJRVmtzUjBGQlJ5eFZRVUZUTEUxQlFVMHNSVUZCUlR0QlFVTjBReXhUUVVGUExFVkJRVVVzUTBGQlF5eEhRVUZITEVOQlFVTXNTVUZCU1N4RlFVRkZMRU5CUTJwQ0xFTkJRVU1zUTBGQlF5eFZRVUZUTEVOQlFVTXNSVUZCUlR0QlFVTmlMRmRCUVU4c1RVRkJUU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1IwRkRla0lzUTBGQlF5eERRVU5FTEVOQlFVTXNRMEZCUXl4VlFVRlRMRU5CUVVNc1JVRkJSVHRCUVVOaUxGZEJRVThzVFVGQlRTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU03UjBGRE1VSXNRMEZCUXl4RFFVTkVMRmRCUVZjc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dERRVU14UWl4RFFVRkRPenM3TzBGQlNVWXNUMEZCVHl4RFFVRkRMRTlCUVU4c1IwRkJSeXhaUVVGWE8wRkJRek5DTEZOQlFVOHNSVUZCUXl4TlFVRk5MRVZCUVVNc1JVRkJSU3hGUVVGRExFbEJRVWtzUlVGQlF5eEZRVUZGTEVWQlFVTXNRMEZCUXp0RFFVTTFRaXhEUVVGRE96dEJRVVZHTEU5QlFVOHNRMEZCUXl4UlFVRlJMRWRCUVVjc1dVRkJWenRCUVVNMVFpeE5RVUZOTEV0QlFVc3NSMEZCUnl4RlFVRkZMRU5CUVVNc1RVRkJUU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRM0pETEUxQlFVMHNTMEZCU3l4SFFVRkhMRXRCUVVzc1EwRkJReXhYUVVGWExFTkJRVU03UVVGRGFFTXNUVUZCVFN4TlFVRk5MRWRCUVVjc1MwRkJTeXhEUVVGRExGbEJRVmtzUTBGQlF6dEJRVU5zUXl4VFFVRlBMRVZCUVVNc1MwRkJTeXhGUVVGRExFdEJRVXNzUlVGQlJTeE5RVUZOTEVWQlFVTXNUVUZCVFN4RlFVRkRMRU5CUVVNN1EwRkRja01zUTBGQlF6czdRVUZGUml4UFFVRlBMRU5CUVVNc1QwRkJUeXhIUVVGSExGbEJRVmM3UVVGRE0wSXNUVUZCVFN4TFFVRkxMRWRCUVVjc1JVRkJSU3hEUVVGRExFMUJRVTBzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU55UXl4TlFVRk5MRXRCUVVzc1IwRkJSeXhMUVVGTExFTkJRVU1zVjBGQlZ5eERRVUZETzBGQlEyaERMRTFCUVUwc1RVRkJUU3hIUVVGSExFdEJRVXNzUTBGQlF5eFpRVUZaTEVsQlFVa3NRMEZCUXl4SFFVRkRMRU5CUVVNc1EwRkJRU3hCUVVGRExFTkJRVU03UVVGRE1VTXNVMEZCVHl4RlFVRkRMRXRCUVVzc1JVRkJReXhMUVVGTExFVkJRVVVzVFVGQlRTeEZRVUZETEUxQlFVMHNSVUZCUXl4RFFVRkRPME5CUTNKRExFTkJRVU03TzBGQlJVWXNUMEZCVHl4RFFVRkRMRTFCUVUwc1IwRkJSeXhWUVVGVExFbEJRVWtzUlVGQlJUczdPMEZCUnpsQ0xGTkJRVThzUTBGQlF5eEpRVUZKTEVkQlFVY3NTVUZCU1N4RFFVRkRPMEZCUTNCQ0xFMUJRVTBzVVVGQlVTeEhRVUZITEVsQlFVa3NRMEZCUXl4UlFVRlJMRVZCUVVVc1EwRkJRenRCUVVOcVF5eE5RVUZOTEU5QlFVOHNSMEZCUnl4SlFVRkpMRU5CUVVNc1QwRkJUeXhGUVVGRkxFTkJRVU03UVVGREwwSXNVMEZCVHl4RFFVRkRMRlZCUVZVc1IwRkJSeXhKUVVGSkxFTkJRVU1zVDBGQlR5eERRVUZETzBGQlF6bENMRXRCUVVNc1JVRkJReXhQUVVGUExFTkJRVU1zU1VGQlNUdEJRVU5rTEV0QlFVTXNSVUZCUXl4RFFVRkRPMEZCUTBnc1UwRkJTeXhGUVVGRExGRkJRVkVzUTBGQlF5eExRVUZMTzBGQlEzQkNMRlZCUVUwc1JVRkJReXhSUVVGUkxFTkJRVU1zVFVGQlRTeEhRVUZITEU5QlFVOHNRMEZCUXl4TlFVRk5PMGRCUTNoRExFTkJRVU1zUTBGQlF6czdRVUZGVEN4TlFVRk5MRkZCUVZFc1IwRkJSeXhKUVVGSkxFTkJRVU1zV1VGQldTeERRVUZETEU5QlFVOHNRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkJRenM3UVVGRmRrUXNUVUZCVFN4TFFVRkxMRWRCUVVjc1JVRkJSU3hEUVVGRExFZEJRVWNzUTBGQlF5eEpRVUZKTEVWQlFVVXNRMEZEZUVJc1MwRkJTeXhEUVVGRExFOUJRVThzUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUXpOQ0xFMUJRVTBzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZEYUVJc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZET3p0QlFVVmFMRTFCUVUwc1MwRkJTeXhIUVVGSExFVkJRVVVzUTBGQlF5eEhRVUZITEVOQlFVTXNTVUZCU1N4RlFVRkZMRU5CUTNoQ0xFdEJRVXNzUTBGQlF5eFBRVUZQTEVOQlFVTXNWVUZCVlN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVNelFpeE5RVUZOTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUTJRc1ZVRkJWU3hEUVVGRExFVkJRVVVzUTBGQlF5eE5RVUZOTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkROVUlzUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVWYUxFMUJRVTBzVTBGQlV5eEhRVUZITEVWQlFVVXNRMEZCUXl4TlFVRk5MRU5CUVVNc1dVRkJXU3hEUVVGRExFTkJRVU03UVVGRE1VTXNWMEZCVXl4RFFVRkRMRTFCUVUwc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGRGRrSXNTVUZCU1N4RFFVRkRMRmRCUVZjc1JVRkJSU3hsUVVGbExFbEJRVVVzVVVGQlVTeERRVUZETEUxQlFVMHNSMEZCUXl4UFFVRlBMRU5CUVVNc1RVRkJUU3hEUVVGQkxFRkJRVU1zUjBGQlF5eEhRVUZITEVOQlFVTXNRMEZEZGtVc1ZVRkJWU3hGUVVGRkxFTkJRMW9zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRPMEZCUTJZc1YwRkJVeXhEUVVGRExFMUJRVTBzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZEZGtJc1NVRkJTU3hEUVVGRExGZEJRVmNzUlVGQlJTeFpRVUZaTEVkQlFVTXNUMEZCVHl4RFFVRkRMRWxCUVVrc1IwRkJReXhOUVVGTkxFTkJRVU1zUTBGRGJrUXNWVUZCVlN4RlFVRkZMRU5CUTFvc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETzBGQlEyWXNWMEZCVXl4RFFVRkRMRTFCUVUwc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGRGRFSXNWVUZCVlN4RlFVRkZMRU5CUTFvc1NVRkJTU3hEUVVGRExFZEJRVWNzUlVGQlJTeFJRVUZSTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU03T3p0QlFVZHlReXhOUVVGTkxFOUJRVThzUjBGQlJ5eEpRVUZKTEVOQlFVTXNUMEZCVHl4RlFVRkZMRU5CUVVNN1FVRkRMMElzVTBGQlR5eERRVUZETEZOQlFWTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1QwRkJUeXhEUVVGRE8wRkJReTlDTEV0QlFVTXNSVUZCUXl4UFFVRlBMRU5CUVVNc1NVRkJTVHRCUVVOa0xFdEJRVU1zUlVGQlF5eERRVUZETzBGQlEwZ3NVMEZCU3l4RlFVRkRMRTlCUVU4c1EwRkJReXhMUVVGTE8wRkJRMjVDTEZWQlFVMHNSVUZCUXl4UFFVRlBMRU5CUVVNc1RVRkJUVHRIUVVOMFFpeERRVUZETEVOQlFVTTdPMEZCUlVnc1RVRkJUU3hSUVVGUkxFZEJRVWNzUlVGQlJTeERRVUZETEUxQlFVMHNRMEZCUXl4WlFVRlpMRU5CUVVNc1EwRkRja01zU1VGQlNTeERRVUZETEU5QlFVOHNSVUZCUlN4UFFVRlBMRU5CUVVNc1MwRkJTeXhIUVVGSExFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZETTBNc1NVRkJTU3hEUVVGRExGRkJRVkVzUlVGQlJTeFBRVUZQTEVOQlFVTXNUVUZCVFN4SFFVRkhMRTlCUVU4c1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGREwwTXNTVUZCU1N4RFFVRkRMRmRCUVZjc1JVRkJSU3haUVVGWkxFZEJRVU1zVDBGQlR5eERRVUZETEVsQlFVa3NSMEZCUXl4SFFVRkhMRWRCUVVNc1QwRkJUeXhEUVVGRExFMUJRVTBzUjBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXpzN1FVRkZka1VzVFVGQlRTeFJRVUZSTEVkQlFVY3NSVUZCUlN4RFFVRkRMRWRCUVVjc1EwRkJReXhKUVVGSkxFVkJRVVVzUTBGRE0wSXNTMEZCU3l4RFFVRkRMRTlCUVU4c1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlF6RkNMRTFCUVUwc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGRGFFSXNTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE96dEJRVVZhTEZWQlFWRXNRMEZCUXl4TlFVRk5MRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRM1JDTEVsQlFVa3NRMEZCUXl4WFFVRlhMRVZCUVVVc1kwRkJZeXhIUVVGSExFOUJRVThzUTBGQlF5eE5RVUZOTEVkQlFVY3NSMEZCUnl4RFFVRkRMRU5CUTNoRUxFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXpzN08wRkJSMnhDTEUxQlFVMHNUMEZCVHl4SFFVRkhMRVZCUVVVc1EwRkJReXhIUVVGSExFTkJRVU1zU1VGQlNTeEZRVUZGTEVOQlF6RkNMRU5CUVVNc1EwRkJReXhWUVVGVkxFTkJRVU1zUlVGQlJUdEJRVUZGTEZkQlFVOHNUMEZCVHl4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMGRCUVVVc1EwRkJReXhEUVVOMlJDeEZRVUZGTEVOQlFVTXNUMEZCVHl4RFFVRkRMRTFCUVUwc1EwRkJReXhEUVVOc1FpeEZRVUZGTEVOQlFVTXNWVUZCVlN4RFFVRkRMRVZCUVVVN1FVRkJSU3hYUVVGUExFOUJRVThzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF6dEhRVUZGTEVOQlFVTXNRMEZCUXpzN08wRkJSemRFTEUxQlFVMHNUMEZCVHl4SFFVRkhMRVZCUVVVc1EwRkJReXhIUVVGSExFTkJRVU1zU1VGQlNTeEZRVUZGTEVOQlF6RkNMRU5CUVVNc1EwRkJReXhWUVVGVkxFTkJRVU1zUlVGQlJUdEJRVUZGTEZkQlFVOHNUMEZCVHl4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMGRCUVVVc1EwRkJReXhEUVVOMlJDeERRVUZETEVOQlFVTXNWVUZCVlN4RFFVRkRMRVZCUVVVN1FVRkJSU3hYUVVGUExFOUJRVThzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF6dEhRVUZGTEVOQlFVTXNRMEZCUXpzN1FVRkZOVVFzVlVGQlVTeERRVUZETEUxQlFVMHNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkRja0lzVlVGQlZTeEZRVUZGTEVOQlExb3NTVUZCU1N4RFFVRkRMRWRCUVVjc1JVRkJSU3hQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSWEJETEZWQlFWRXNRMEZCUXl4TlFVRk5MRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRM0pDTEZWQlFWVXNSVUZCUlN4RFFVTmFMRWxCUVVrc1EwRkJReXhIUVVGSExFVkJRVVVzVDBGQlR5eERRVUZETEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRE96dEJRVVZ3UXl4TlFVRk5MRkZCUVZFc1IwRkJSeXhGUVVGRkxFTkJRVU1zUjBGQlJ5eERRVUZETEV0QlFVc3NSVUZCUlN4RFFVTTFRaXhEUVVGRExFTkJRVU1zVDBGQlR5eERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkRkRUlzUlVGQlJTeERRVUZETEU5QlFVOHNSVUZCUlN4WlFVRlpPMEZCUTNaQ0xGZEJRVThzUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXl4RFFVRkRMRTFCUVUwc1EwRkJReXhSUVVGUkxFTkJRVU1zUzBGQlN5eEZRVUZGTEVkQlFVY3NUMEZCVHl4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRExFTkJRVU1zVFVGQlRTeEZRVUZGTEVkQlFVY3NVVUZCVVN4RFFVRkRMRTFCUVUwc1JVRkJSU3hEUVVGRExFTkJRVU03UVVGRGFrY3NWMEZCVHl4RFFVRkRMRmRCUVZjc1EwRkJReXhQUVVGUExFTkJRVU1zVlVGQlZTeEZRVUZGTEV0QlFVc3NSVUZCUlN4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UjBGRE9VUXNRMEZCUXl4RFFVRkRPenRCUVVWTUxGVkJRVkVzUTBGQlF5eE5RVUZOTEVOQlFVTXNWMEZCVnl4RFFVRkRMRU5CUTNwQ0xFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZEWkN4VFFVRlRMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRMnBDTEVsQlFVa3NRMEZCUXl4UlFVRlJMRVZCUVVVc1QwRkJUeXhEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZETzBOQlEyNURMRU5CUVVNN08wRkJSVVlzVDBGQlR5eERRVUZETEZkQlFWY3NSMEZCUnl4VlFVRlRMRTFCUVUwc1JVRkJSU3hMUVVGTExFVkJRVVVzU1VGQlNTeEZRVUZGTzBGQlEyeEVMRTFCUVUwc1VVRkJVU3hIUVVGSExFbEJRVWtzUTBGQlF5eFpRVUZaTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1FVRkRNME1zVDBGQlN5eERRVUZETEV0QlFVc3NRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03UVVGRGRFSXNTVUZCUlN4RFFVRkRMRTFCUVUwc1EwRkJReXhaUVVGWkxFTkJRVU1zUTBGQlF5eE5RVUZOTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETzBGQlEzSkVMRWxCUVVVc1EwRkJReXhOUVVGTkxFTkJRVU1zV1VGQldTeERRVUZETEVOQlFVTXNUVUZCVFN4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRExFbEJRVWtzUTBGQlF5eEhRVUZITEVWQlFVVXNVVUZCVVN4RFFVRkRMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF5eERRVUZETzBOQlF6TkZMRU5CUVVNN08wRkJSVVlzVDBGQlR5eERRVUZETEU5QlFVOHNSMEZCUnl4VlFVRlRMRWxCUVVrc1JVRkJSVHM3UVVGRkwwSXNUVUZCVFN4TFFVRkxMRWRCUVVjc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNWVUZCVXl4SFFVRkhMRVZCUVVNN1FVRkJReXhYUVVGUExFZEJRVWNzUTBGQlF5eEpRVUZKTEVOQlFVTTdSMEZCUXl4RFFVRkRMRU5CUVVNN1FVRkRhRVVzVFVGQlRTeE5RVUZOTEVkQlFVY3NUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zVlVGQlV5eEhRVUZITEVWQlFVTTdRVUZCUXl4WFFVRlBMRWRCUVVjc1EwRkJReXhMUVVGTExFTkJRVU03UjBGQlF5eERRVUZETEVOQlFVTTdPMEZCUld4RkxFMUJRVTBzVDBGQlR5eEhRVUZITEVsQlFVa3NTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVa3NSVUZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRM0pFTEUxQlFVMHNUMEZCVHl4SFFVRkhMRWxCUVVrc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNTMEZCU3l4RFFVRkRMRWxCUVVrc1JVRkJReXhMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETzBGQlEzSkVMRTFCUVUwc1VVRkJVU3hIUVVGSExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNTMEZCU3l4RFFVRkRMRWxCUVVrc1JVRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6dEJRVU0zUXl4TlFVRk5MRkZCUVZFc1IwRkJSeXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEV0QlFVc3NRMEZCUXl4SlFVRkpMRVZCUVVNc1RVRkJUU3hEUVVGRExFTkJRVU03TzBGQlJUZERMRTFCUVUwc1RVRkJUU3hIUVVGSExFVkJRVVVzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RlFVRkZMRU5CUXpOQ0xFMUJRVTBzUTBGQlF5eERRVUZETEU5QlFVOHNSVUZCUXl4UFFVRlBMRU5CUVVNc1EwRkJReXhEUVVONlFpeExRVUZMTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhGUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVVdlFpeE5RVUZOTEUxQlFVMHNSMEZCUnl4RlFVRkZMRU5CUVVNc1MwRkJTeXhEUVVGRExFMUJRVTBzUlVGQlJTeERRVU0zUWl4TlFVRk5MRU5CUVVNc1EwRkJReXhSUVVGUkxFZEJRVWNzUjBGQlJ5eEZRVUZGTEZGQlFWRXNSMEZCUnl4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVONFF5eExRVUZMTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1RVRkJUU3hGUVVGRkxFbEJRVWtzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVWb1F5eFRRVUZQTEVWQlFVTXNRMEZCUXl4RlFVRkZMRTFCUVUwc1JVRkJSU3hEUVVGRExFVkJRVVVzVFVGQlRTeEZRVUZETEVOQlFVTTdRMEZETDBJc1EwRkJRenM3UVVGRlJpeFBRVUZQTEVOQlFVTXNWVUZCVlN4SFFVRkhMRVZCUVVVc1EwRkJReXhSUVVGUkxFTkJRVU1zVlVGQlV5eERRVUZETEVWQlFVVTdRVUZCUlN4VFFVRlBMRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU03UTBGQlJTeERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRPenM3UVVGSGRFVXNUMEZCVHl4RFFVRkRMRk5CUVZNc1IwRkJSeXhaUVVGWE96dEJRVVUzUWl4TlFVRkpMRTlCUVU4c1EwRkJReXhKUVVGSkxFVkJRVVU3UVVGRGFFSXNVVUZCVFN4aFFVRmhMRWRCUVVjc1QwRkJUeXhEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETEVOQlFVTXNUVUZCVFN4RFFVRkRMRVZCUVVVc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRiRVVzUzBGQlN5eEhRVUZITEU5QlFVOHNRMEZCUXl4VlFVRlZMRU5CUVVNc1QwRkJUeXhEUVVGRExFbEJRVWtzUlVGQlJTeGhRVUZoTEVWQlFVVXNRMEZCUXl4RFFVRkRPMUZCUXpGRUxHVkJRV1VzUjBGQlJ5eFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1IwRkJSeXhEUVVGRExFTkJRVU03VVVGRGVrTXNWMEZCVnl4SFFVRkhMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETzFGQlEycERMRXRCUVVzc1IwRkJSeXhCUVVGRExHRkJRV0VzUjBGQlJ5eGxRVUZsTEVOQlFVTXNTVUZCU1N4SFFVRkxMRmRCUVZjc1EwRkJReXhKUVVGSkxFZEJRVWNzWVVGQllTeEJRVUZETEVkQlEycEdMRmRCUVZjc1IwRkJSeXhsUVVGbExFTkJRVU03UVVGRGJFTXNjVUpCUVdsQ0xFTkJRVU1zWlVGQlpTeERRVUZETEV0QlFVc3NRMEZCUXl4SlFVRkpMRVZCUVVVc1MwRkJTeXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZET3p0QlFVVXpSQ3hSUVVGTkxFOUJRVThzUjBGQlJ5eFBRVUZQTEVOQlFVTXNUMEZCVHl4RlFVRkZMRU5CUVVNN1FVRkRiRU1zVVVGQlRTeERRVUZETEVkQlFVY3NSVUZCUlN4RFFVRkRMRXRCUVVzc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNSMEZCUnl4UFFVRlBMRU5CUVVNc1NVRkJTU3hIUVVGSExFOUJRVThzUTBGQlF5eEpRVUZKTEVkQlFVY3NSVUZCUlN4RFFVRkRMRXRCUVVzc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0QlFVTTVSU3hSUVVGTkxGTkJRVk1zUjBGQlJ5eEZRVUZGTEVOQlFVTXNUVUZCVFN4RFFVRkRMRmxCUVZrc1EwRkJReXhEUVVOMFF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVOaUxFbEJRVWtzUTBGQlF5eEpRVUZKTEVWQlFVVXNRMEZCUXl4RFFVRkRMRU5CUTJJc1NVRkJTU3hEUVVGRExFbEJRVWtzUlVGQlJTeERRVUZETEVOQlFVTXNRMEZEWWl4SlFVRkpMRU5CUVVNc1NVRkJTU3hGUVVGRkxFOUJRVThzUTBGQlF5eFJRVUZSTEVWQlFVVXNRMEZCUXl4TlFVRk5MRWRCUVVjc1QwRkJUeXhEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZETzBkQlF6TkVPME5CUTBZc1EwRkJRenM3UVVGRlJpeE5RVUZOTEVOQlFVTXNUMEZCVHl4SFFVRkhMRTlCUVU4c1EwRkJReUlzSW1acGJHVWlPaUl2VlhObGNuTXZaM0psWjI5eWVWOW1iM04wWlhJdlpHRjBZUzFsYm1jdmFHOXVaWGx3YjNRdlpHVjJMM05qY21sd2RITXZkV2t2WkRORGFHRnlkQzVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHZJR1F6UTJoaGNuUXVhbk5jYmk4cWFuTm9hVzUwSUdWemJtVjRkRG9nZEhKMVpTQXFMMXh1WEc1amIyNXpkQ0JrTTBOb1lYSjBJRDBnZTMwN1hHNWpiMjV6ZENCRVpYUmhhV3hXYVdWM1FXTjBhVzl1Y3lBOUlISmxjWFZwY21Vb0p5NHVMMkZqZEdsdmJuTXZSR1YwWVdsc1ZtbGxkMEZqZEdsdmJuTW5LVHRjYmx4dVpETkRhR0Z5ZEM1amNtVmhkR1VnUFNCbWRXNWpkR2x2YmlobGJDa2dlMXh1WEc0Z0lHTnZibk4wSUdOb1lYSjBJRDBnWkRNdWMyVnNaV04wS0dWc0tTNWhjSEJsYm1Rb0ozTjJaeWNwWEc0Z0lDQWdMbUYwZEhJb0oyTnNZWE56Snl3Z0oyMWhhVzVEYUdGeWRDY3BYRzRnSUNBZ0xtOXVLQ2R0YjNWelpXMXZkbVVuTENCa00wTm9ZWEowTG0xdmRYTmxiVzkyWlNrN1hHNWNiaUFnWTJoaGNuUXVZWEJ3Wlc1a0tDZGpiR2x3VUdGMGFDY3BYRzRnSUNBZ0xtRjBkSElvSjJsa0p5d2dKM0JzYjNSQmNtVmhRMnhwY0NjcFhHNGdJQ0FnTG1Gd2NHVnVaQ2duY21WamRDY3BYRzRnSUNBZ0xtRjBkSElvSjJsa0p5d2dKM0JzYjNSQmNtVmhRMnhwY0ZKbFkzUW5LVHRjYmlBZ0lDQmNiaUFnWTI5dWMzUWdjR3h2ZEVGeVpXRWdQU0JqYUdGeWRDNWhjSEJsYm1Rb0oyY25LVHRjYmx4dUlDQndiRzkwUVhKbFlWeHVJQ0FnSUM1aGNIQmxibVFvSjNOMlp6cHdZWFJvSnlsY2JpQWdJQ0F1WVhSMGNpZ25ZMnhoYzNNbkxDQW5iR2x1WlNjcE8xeHVYRzRnSUhCc2IzUkJjbVZoWEc0Z0lDQWdMbUZ3Y0dWdVpDZ25jM1puT214cGJtVW5LVnh1SUNBZ0lDNWhkSFJ5S0NkamJHRnpjeWNzSUNkbWIyTjFjMHhwYm1VbktUdGNibHh1SUNCamFHRnlkQzVoY0hCbGJtUW9KMmNuS1Z4dUlDQWdJQzVoZEhSeUtDZGpiR0Z6Y3ljc0lDZDRRWGhwY3ljcE8xeHVYRzRnSUdOb1lYSjBMbUZ3Y0dWdVpDZ25aeWNwWEc0Z0lDQWdMbUYwZEhJb0oyTnNZWE56Snl3Z0ozbEJlR2x6SnlrN1hHNWNiaUFnWTI5dWMzUWdibUYyUTJoaGNuUWdQU0JrTXk1elpXeGxZM1FvWld3cExtRndjR1Z1WkNnbmMzWm5KeWxjYmlBZ0lDQXVZMnhoYzNObFpDZ25ibUYyYVdkaGRHOXlKeXdnZEhKMVpTazdYRzVjYmlBZ2JtRjJRMmhoY25RdVlYQndaVzVrS0Nkbkp5bGNiaUFnSUNBdVlYUjBjaWduWTJ4aGMzTW5MQ0FuZUVGNGFYTW5LVHRjYmx4dUlDQnVZWFpEYUdGeWRDNWhjSEJsYm1Rb0ozQmhkR2duS1Z4dUlDQWdJQzVoZEhSeUtDZGpiR0Z6Y3ljc0lDZG1hV3hzSnlrN1hHNWNiaUFnYm1GMlEyaGhjblF1WVhCd1pXNWtLQ2R3WVhSb0p5bGNiaUFnSUNBdVlYUjBjaWduWTJ4aGMzTW5MQ0FuYkdsdVpTY3BYRzRnSUNBZ0xtRjBkSElvSjNOMGNtOXJaU2NzSUNkaWJIVmxKeWxjYmlBZ0lDQXVZWFIwY2lnbmMzUnliMnRsTFhkcFpIUm9KeXdnTWlsY2JpQWdJQ0F1WVhSMGNpZ25abWxzYkNjc0lDZHViMjVsSnlrN1hHNWNiaUFnYm1GMlEyaGhjblF1WVhCd1pXNWtLQ2RuSnlsY2JpQWdJQ0F1WVhSMGNpZ25ZMnhoYzNNbkxDQW5kbWxsZDNCdmNuUW5LVHRjYm4wN1hHNWNibVF6UTJoaGNuUXViR2x1WlVaMWJtTjBhVzl1SUQwZ1puVnVZM1JwYjI0b2MyTmhiR1Z6S1NCN1hHNGdJSEpsZEhWeWJpQmtNeTV6ZG1jdWJHbHVaU2dwWEc0Z0lDQWdMbmdvWm5WdVkzUnBiMjRvWkNrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhOallXeGxjeTU0S0dRdVpHRjBaU2s3WEc0Z0lDQWdmU2xjYmlBZ0lDQXVlU2htZFc1amRHbHZiaWhrS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnYzJOaGJHVnpMbmtvWkM1MllXeDFaU2s3WEc0Z0lDQWdmU2xjYmlBZ0lDQXVhVzUwWlhKd2IyeGhkR1VvSjJ4cGJtVmhjaWNwTzF4dWZUdGNibHh1THk4Z1UwbGFTVTVISUVsT1JrOVNUVUZVU1U5T1hHNWNibVF6UTJoaGNuUXViV0Z5WjJsdWN5QTlJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQnlaWFIxY200Z2UySnZkSFJ2YlRvMU1DeHNaV1owT2pjMWZUdGNibjA3WEc1Y2JtUXpRMmhoY25RdWJXRnBibE5wZW1VZ1BTQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ1kyOXVjM1FnWTJoaGNuUWdQU0JrTXk1elpXeGxZM1FvSjNOMlp5Y3BXekJkV3pCZE8xeHVJQ0JqYjI1emRDQjNhV1IwYUNBOUlHTm9ZWEowTG05bVpuTmxkRmRwWkhSb08xeHVJQ0JqYjI1emRDQm9aV2xuYUhRZ1BTQmphR0Z5ZEM1dlptWnpaWFJJWldsbmFIUTdYRzRnSUhKbGRIVnliaUI3ZDJsa2RHZzZkMmxrZEdnc0lHaGxhV2RvZERwb1pXbG5hSFI5TzF4dWZUdGNibHh1WkRORGFHRnlkQzV1WVhaVGFYcGxJRDBnWm5WdVkzUnBiMjRvS1NCN1hHNGdJR052Ym5OMElHTm9ZWEowSUQwZ1pETXVjMlZzWldOMEtDZHpkbWNuS1Zzd1hWc3dYVHRjYmlBZ1kyOXVjM1FnZDJsa2RHZ2dQU0JqYUdGeWRDNXZabVp6WlhSWGFXUjBhRHRjYmlBZ1kyOXVjM1FnYUdWcFoyaDBJRDBnWTJoaGNuUXViMlptYzJWMFNHVnBaMmgwSUNvZ0tERXZOaWs3WEc0Z0lISmxkSFZ5YmlCN2QybGtkR2c2ZDJsa2RHZ3NJR2hsYVdkb2REcG9aV2xuYUhSOU8xeHVmVHRjYmx4dVpETkRhR0Z5ZEM1MWNHUmhkR1VnUFNCbWRXNWpkR2x2Ymloa1lYUmhLU0I3WEc1Y2JpQWdMeThnVFVGSlRpQkRTRUZTVkZ4dUlDQmtNME5vWVhKMExtUmhkR0VnUFNCa1lYUmhPMXh1SUNCamIyNXpkQ0J0WVdsdVUybDZaU0E5SUhSb2FYTXViV0ZwYmxOcGVtVW9LVHRjYmlBZ1kyOXVjM1FnYldGeVoybHVjeUE5SUhSb2FYTXViV0Z5WjJsdWN5Z3BPMXh1SUNCa00wTm9ZWEowTG0xaGFXNVRZMkZzWlhNZ1BTQjBhR2x6TGw5elkyRnNaWE1vZTF4dUlDQWdJQ0FnZURwdFlYSm5hVzV6TG14bFpuUXNYRzRnSUNBZ0lDQjVPakFzWEc0Z0lDQWdJQ0IzYVdSMGFEcHRZV2x1VTJsNlpTNTNhV1IwYUN4Y2JpQWdJQ0FnSUdobGFXZG9kRHB0WVdsdVUybDZaUzVvWldsbmFIUWdMU0J0WVhKbmFXNXpMbUp2ZEhSdmJTeGNiaUFnSUNCOUtUdGNibHh1SUNCamIyNXpkQ0JzYVc1bFJuVnVZeUE5SUhSb2FYTXViR2x1WlVaMWJtTjBhVzl1S0dRelEyaGhjblF1YldGcGJsTmpZV3hsY3lrN1hHNWNiaUFnWTI5dWMzUWdlRUY0YVhNZ1BTQmtNeTV6ZG1jdVlYaHBjeWdwWEc0Z0lDQWdMbk5qWVd4bEtHUXpRMmhoY25RdWJXRnBibE5qWVd4bGN5NTRLVnh1SUNBZ0lDNXZjbWxsYm5Rb0oySnZkSFJ2YlNjcFhHNGdJQ0FnTG5ScFkydHpLRFlwTzF4dVhHNGdJR052Ym5OMElIbEJlR2x6SUQwZ1pETXVjM1puTG1GNGFYTW9LVnh1SUNBZ0lDNXpZMkZzWlNoa00wTm9ZWEowTG0xaGFXNVRZMkZzWlhNdWVTbGNiaUFnSUNBdWIzSnBaVzUwS0Nkc1pXWjBKeWxjYmlBZ0lDQXVkR2xqYTBadmNtMWhkQ2hrTXk1bWIzSnRZWFFvWENJdU0zTmNJaWtwWEc0Z0lDQWdMblJwWTJ0ektEVXBPMXh1WEc0Z0lHTnZibk4wSUcxaGFXNURhR0Z5ZENBOUlHUXpMbk5sYkdWamRDZ25MbTFoYVc1RGFHRnlkQ2NwT3lCY2JpQWdiV0ZwYmtOb1lYSjBMbk5sYkdWamRDZ25MbmhCZUdsekp5bGNiaUFnSUNBdVlYUjBjaWduZEhKaGJuTm1iM0p0Snl3Z0ozUnlZVzV6YkdGMFpTZ3dMQ0FuS3lodFlXbHVVMmw2WlM1b1pXbG5hSFF0YldGeVoybHVjeTVpYjNSMGIyMHBLeWNwSnlrZ0lGeHVJQ0FnSUM1MGNtRnVjMmwwYVc5dUtDbGNiaUFnSUNBdVkyRnNiQ2g0UVhocGN5azdYRzRnSUcxaGFXNURhR0Z5ZEM1elpXeGxZM1FvSnk1NVFYaHBjeWNwWEc0Z0lDQWdMbUYwZEhJb0ozUnlZVzV6Wm05eWJTY3NJQ2QwY21GdWMyeGhkR1VvSnl0dFlYSm5hVzV6TG14bFpuUXJKeXdnTUNrbktTQWdYRzRnSUNBZ0xuUnlZVzV6YVhScGIyNG9LVnh1SUNBZ0lDNWpZV3hzS0hsQmVHbHpLVHRjYmlBZ2JXRnBia05vWVhKMExuTmxiR1ZqZENnbkxteHBibVVuS1Z4dUlDQWdJQzUwY21GdWMybDBhVzl1S0NsY2JpQWdJQ0F1WVhSMGNpZ25aQ2NzSUd4cGJtVkdkVzVqS0dRelEyaGhjblF1WkdGMFlTa3BPMXh1WEc0Z0lDOHZJRTVCVmlCRFNFRlNWRnh1SUNCamIyNXpkQ0J1WVhaVGFYcGxJRDBnZEdocGN5NXVZWFpUYVhwbEtDazdYRzRnSUdRelEyaGhjblF1Ym1GMlUyTmhiR1Z6SUQwZ2RHaHBjeTVmYzJOaGJHVnpLSHRjYmlBZ0lDQjRPbTFoY21kcGJuTXViR1ZtZEN4Y2JpQWdJQ0I1T2pBc1hHNGdJQ0FnZDJsa2RHZzZibUYyVTJsNlpTNTNhV1IwYUN4Y2JpQWdJQ0JvWldsbmFIUTZibUYyVTJsNlpTNW9aV2xuYUhRc1hHNGdJSDBwTzF4dVhHNGdJR052Ym5OMElHNWhka05vWVhKMElEMGdaRE11YzJWc1pXTjBLQ2N1Ym1GMmFXZGhkRzl5SnlsY2JpQWdJQ0F1WVhSMGNpZ25kMmxrZEdnbkxDQnVZWFpUYVhwbExuZHBaSFJvSUNzZ2JXRnlaMmx1Y3k1c1pXWjBLVnh1SUNBZ0lDNWhkSFJ5S0Nkb1pXbG5hSFFuTENCdVlYWlRhWHBsTG1obGFXZG9kQ0FySUcxaGNtZHBibk11WW05MGRHOXRLVnh1SUNBZ0lDNWhkSFJ5S0NkMGNtRnVjMlp2Y20wbkxDQW5kSEpoYm5Oc1lYUmxLQ2NyYldGeVoybHVjeTVzWldaMEt5Y3NKeXR0WVhKbmFXNXpMbUp2ZEhSdmJTc25LU2NwTzF4dVhHNGdJR052Ym5OMElHNWhkbGhCZUdseklEMGdaRE11YzNabkxtRjRhWE1vS1Z4dUlDQWdJQzV6WTJGc1pTaGtNME5vWVhKMExtNWhkbE5qWVd4bGN5NTRLVnh1SUNBZ0lDNXZjbWxsYm5Rb0oySnZkSFJ2YlNjcFhHNGdJQ0FnTG5ScFkydHpLRFVwTzF4dVhHNGdJRzVoZGtOb1lYSjBMbk5sYkdWamRDZ25MbmhCZUdsekp5bGNiaUFnSUNBdVlYUjBjaWduZEhKaGJuTm1iM0p0Snl3Z0ozUnlZVzV6YkdGMFpTZ3dMQ2NnS3lCdVlYWlRhWHBsTG1obGFXZG9kQ0FySUNjcEp5bGNiaUFnSUNBdVkyRnNiQ2h1WVhaWVFYaHBjeWs3WEc1Y2JpQWdMeThnVG1GMklFZHlZWEJvSUVaMWJtTjBhVzl1SUdadmNpQmhjbVZoWEc0Z0lHTnZibk4wSUc1aGRrWnBiR3dnUFNCa015NXpkbWN1WVhKbFlTZ3BYRzRnSUNBZ0xuZ29ablZ1WTNScGIyNGdLR1FwSUhzZ2NtVjBkWEp1SUdRelEyaGhjblF1Ym1GMlUyTmhiR1Z6TG5nb1pDNWtZWFJsS1RzZ2ZTbGNiaUFnSUNBdWVUQW9ibUYyVTJsNlpTNW9aV2xuYUhRcFhHNGdJQ0FnTG5reEtHWjFibU4wYVc5dUlDaGtLU0I3SUhKbGRIVnliaUJrTTBOb1lYSjBMbTVoZGxOallXeGxjeTU1S0dRdWRtRnNkV1VwT3lCOUtUdGNibHh1SUNBdkx5Qk9ZWFlnUjNKaGNHZ2dSblZ1WTNScGIyNGdabTl5SUd4cGJtVmNiaUFnWTI5dWMzUWdibUYyVEdsdVpTQTlJR1F6TG5OMlp5NXNhVzVsS0NsY2JpQWdJQ0F1ZUNobWRXNWpkR2x2YmlBb1pDa2dleUJ5WlhSMWNtNGdaRE5EYUdGeWRDNXVZWFpUWTJGc1pYTXVlQ2hrTG1SaGRHVXBPeUI5S1Z4dUlDQWdJQzU1S0daMWJtTjBhVzl1SUNoa0tTQjdJSEpsZEhWeWJpQmtNME5vWVhKMExtNWhkbE5qWVd4bGN5NTVLR1F1ZG1Gc2RXVXBPeUI5S1R0Y2JseHVJQ0J1WVhaRGFHRnlkQzV6Wld4bFkzUW9KeTVtYVd4c0p5bGNiaUFnSUNBdWRISmhibk5wZEdsdmJpZ3BYRzRnSUNBZ0xtRjBkSElvSjJRbkxDQnVZWFpHYVd4c0tHUXpRMmhoY25RdVpHRjBZU2twTzF4dVhHNGdJRzVoZGtOb1lYSjBMbk5sYkdWamRDZ25MbXhwYm1VbktWeHVJQ0FnSUM1MGNtRnVjMmwwYVc5dUtDbGNiaUFnSUNBdVlYUjBjaWduWkNjc0lHNWhka3hwYm1Vb1pETkRhR0Z5ZEM1a1lYUmhLU2s3WEc1Y2JpQWdZMjl1YzNRZ2RtbGxkM0J2Y25RZ1BTQmtNeTV6ZG1jdVluSjFjMmdvS1Z4dUlDQWdJQzU0S0dRelEyaGhjblF1Ym1GMlUyTmhiR1Z6TG5ncFhHNGdJQ0FnTG05dUtDZGljblZ6YUNjc0lHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQWdJR1F6UTJoaGNuUXViV0ZwYmxOallXeGxjeTU0TG1SdmJXRnBiaWgyYVdWM2NHOXlkQzVsYlhCMGVTZ3BJRDhnWkRORGFHRnlkQzV1WVhaVFkyRnNaWE11ZUM1a2IyMWhhVzRvS1NBNklIWnBaWGR3YjNKMExtVjRkR1Z1ZENncEtUdGNiaUFnSUNBZ0lHUXpRMmhoY25RdWNtVmtjbUYzUTJoaGNuUW9aRE5EYUdGeWRDNXRZV2x1VTJOaGJHVnpMQ0I0UVhocGN5d2daRE5EYUdGeWRDNWtZWFJoS1R0Y2JpQWdJQ0I5S1RzZ1hHNWNiaUFnYm1GMlEyaGhjblF1YzJWc1pXTjBLQ2N1ZG1sbGQzQnZjblFuS1Z4dUlDQWdJQzVqWVd4c0tIWnBaWGR3YjNKMEtWeHVJQ0FnSUM1elpXeGxZM1JCYkd3b0ozSmxZM1FuS1Z4dUlDQWdJQzVoZEhSeUtDZG9aV2xuYUhRbkxDQnVZWFpUYVhwbExtaGxhV2RvZENrN1hHNTlPMXh1WEc1a00wTm9ZWEowTG5KbFpISmhkME5vWVhKMElEMGdablZ1WTNScGIyNG9jMk5oYkdWekxDQjRRWGhwY3l3Z1pHRjBZU2tnZTF4dUlDQmpiMjV6ZENCc2FXNWxSblZ1WXlBOUlIUm9hWE11YkdsdVpVWjFibU4wYVc5dUtITmpZV3hsY3lrN1hHNGdJSGhCZUdsekxuTmpZV3hsS0hOallXeGxjeTU0S1R0Y2JpQWdaRE11YzJWc1pXTjBLQ2N1YldGcGJrTm9ZWEowSnlrdWMyVnNaV04wS0NjdWVFRjRhWE1uS1M1allXeHNLSGhCZUdsektUdGNiaUFnWkRNdWMyVnNaV04wS0NjdWJXRnBia05vWVhKMEp5a3VjMlZzWldOMEtDY3ViR2x1WlNjcExtRjBkSElvSjJRbkxDQnNhVzVsUm5WdVl5aGtNME5vWVhKMExtUmhkR0VwS1R0Y2JuMDdYRzVjYm1RelEyaGhjblF1WDNOallXeGxjeUE5SUdaMWJtTjBhVzl1S0hKbFkzUXBJSHRjYmx4dUlDQmpiMjV6ZENCa1lYUmxjeUE5SUdRelEyaGhjblF1WkdGMFlTNXRZWEFvWm5WdVkzUnBiMjRvWTNWeUtYdHlaWFIxY200Z1kzVnlMbVJoZEdVN2ZTazdYRzRnSUdOdmJuTjBJSFpoYkhWbGN5QTlJR1F6UTJoaGNuUXVaR0YwWVM1dFlYQW9ablZ1WTNScGIyNG9ZM1Z5S1h0eVpYUjFjbTRnWTNWeUxuWmhiSFZsTzMwcE8xeHVJQ0JjYmlBZ1kyOXVjM1FnYldGNFJHRjBaU0E5SUc1bGR5QkVZWFJsS0UxaGRHZ3ViV0Y0TG1Gd2NHeDVLRzUxYkd3c1pHRjBaWE1wS1R0Y2JpQWdZMjl1YzNRZ2JXbHVSR0YwWlNBOUlHNWxkeUJFWVhSbEtFMWhkR2d1YldsdUxtRndjR3g1S0c1MWJHd3NaR0YwWlhNcEtUdGNiaUFnWTI5dWMzUWdiV0Y0Vm1Gc2RXVWdQU0JOWVhSb0xtMWhlQzVoY0hCc2VTaHVkV3hzTEhaaGJIVmxjeWs3WEc0Z0lHTnZibk4wSUcxcGJsWmhiSFZsSUQwZ1RXRjBhQzV0YVc0dVlYQndiSGtvYm5Wc2JDeDJZV3gxWlhNcE8xeHVJQ0JjYmlBZ1kyOXVjM1FnZUZOallXeGxJRDBnWkRNdWRHbHRaUzV6WTJGc1pTZ3BYRzRnSUNBZ0xtUnZiV0ZwYmloYmJXbHVSR0YwWlN4dFlYaEVZWFJsWFNsY2JpQWdJQ0F1Y21GdVoyVW9XM0psWTNRdWVDd2djbVZqZEM1M2FXUjBhRjBwTzF4dUlDQWdJRnh1SUNCamIyNXpkQ0I1VTJOaGJHVWdQU0JrTXk1elkyRnNaUzVzYVc1bFlYSW9LVnh1SUNBZ0lDNWtiMjFoYVc0b1cyMXBibFpoYkhWbElDb2dNQzQ0TENCdFlYaFdZV3gxWlNBcUlERXVNVjBwWEc0Z0lDQWdMbkpoYm1kbEtGdHlaV04wTG1obGFXZG9kQ3dnY21WamRDNTVYU2s3WEc1Y2JpQWdjbVYwZFhKdUlIdDRPaUI0VTJOaGJHVXNJSGs2SUhsVFkyRnNaWDA3WEc1OU8xeHVYRzVrTTBOb1lYSjBMbUpwYzJWamRFUmhkR1VnUFNCa015NWlhWE5sWTNSdmNpaG1kVzVqZEdsdmJpaGtLU0I3SUhKbGRIVnliaUJrTG1SaGRHVTdJSDBwTG14bFpuUTdYRzVjYmk4dklFUnlZWGNnWVNCMlpYSjBhV05oYkNCc2FXNWxJR0Z1WkNCMWNHUmhkR1VnZEdobElHWnZZM1Z6SUdSaGRHVWdMeUIyWVd4MVpWeHVaRE5EYUdGeWRDNXRiM1Z6WlcxdmRtVWdQU0JtZFc1amRHbHZiaWdwSUh0Y2JpQWdMeThnVTI1aGNDQjBieUJ2Ym1VZ2JXOTFjMlVnY0c5cGJuUWdZbVZqWVhWelpTQjNhV3hzSUc1bGRtVnlJRzF2ZFhObElHOTJaWElnWVNCa1lYUmxJR1Y0WVdOMGJIbGNiaUFnYVdZZ0tHUXpRMmhoY25RdVpHRjBZU2tnZTF4dUlDQWdJR052Ym5OMElHMXZkWE5sYjNabGNrUmhkR1VnUFNCa00wTm9ZWEowTG0xaGFXNVRZMkZzWlhNdWVDNXBiblpsY25Rb1pETXViVzkxYzJVb2RHaHBjeWxiTUYwcExGeHVJQ0FnSUNBZ2FXNWtaWGdnUFNCa00wTm9ZWEowTG1KcGMyVmpkRVJoZEdVb1pETkRhR0Z5ZEM1a1lYUmhMQ0J0YjNWelpXOTJaWEpFWVhSbExDQXhLU3hjYmlBZ0lDQWdJSEJ2YVc1MFFtVm1iM0psUkdGMFpTQTlJR1F6UTJoaGNuUXVaR0YwWVZ0cGJtUmxlQ0F0SURGZExGeHVJQ0FnSUNBZ2NHOXBiblJQYmtSaGRHVWdQU0JrTTBOb1lYSjBMbVJoZEdGYmFXNWtaWGhkTEZ4dUlDQWdJQ0FnY0c5cGJuUWdQU0FvYlc5MWMyVnZkbVZ5UkdGMFpTQXRJSEJ2YVc1MFFtVm1iM0psUkdGMFpTNWtZWFJsS1NBK0lDaHdiMmx1ZEU5dVJHRjBaUzVrWVhSbElDMGdiVzkxYzJWdmRtVnlSR0YwWlNrZ1AxeHVJQ0FnSUNBZ0lDQndiMmx1ZEU5dVJHRjBaU0E2SUhCdmFXNTBRbVZtYjNKbFJHRjBaVHRjYmlBZ0lDQkVaWFJoYVd4V2FXVjNRV04wYVc5dWN5NTFjR1JoZEdWR2IyTjFjMFJoZEdFb2NHOXBiblF1WkdGMFpTd2djRzlwYm5RdWRtRnNkV1VwTzF4dUlDQWdJQzh2SUVSeVlYY2dkR2hsSUd4cGJtVmNiaUFnSUNCamIyNXpkQ0J0WVhKbmFXNXpJRDBnWkRORGFHRnlkQzV0WVhKbmFXNXpLQ2s3WEc0Z0lDQWdZMjl1YzNRZ2VDQTlJR1F6TG0xdmRYTmxLSFJvYVhNcFd6QmRJRHdnYldGeVoybHVjeTVzWldaMElEOGdiV0Z5WjJsdWN5NXNaV1owSURvZ1pETXViVzkxYzJVb2RHaHBjeWxiTUYwN1hHNGdJQ0FnWTI5dWMzUWdabTlqZFhOTWFXNWxJRDBnWkRNdWMyVnNaV04wS0NjdVptOWpkWE5NYVc1bEp5bGNiaUFnSUNBZ0lDNWhkSFJ5S0NkNE1TY3NJSGdwWEc0Z0lDQWdJQ0F1WVhSMGNpZ25lREluTENCNEtWeHVJQ0FnSUNBZ0xtRjBkSElvSjNreEp5d2dNQ2xjYmlBZ0lDQWdJQzVoZEhSeUtDZDVNU2NzSUdRelEyaGhjblF1YldGcGJsTnBlbVVvS1M1b1pXbG5hSFFnTFNCdFlYSm5hVzV6TG1KdmRIUnZiU2s3WEc0Z0lIMWNibjA3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1pETkRhR0Z5ZER0Y2JpSmRmUT09IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIHZhciBtO1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbihlbWl0dGVyLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IDE7XG4gIGVsc2VcbiAgICByZXQgPSBlbWl0dGVyLl9ldmVudHNbdHlwZV0ubGVuZ3RoO1xuICByZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbm1vZHVsZS5leHBvcnRzLkRpc3BhdGNoZXIgPSByZXF1aXJlKCcuL2xpYi9EaXNwYXRjaGVyJylcbiIsIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgRGlzcGF0Y2hlclxuICogQHR5cGVjaGVja3NcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJy4vaW52YXJpYW50Jyk7XG5cbnZhciBfbGFzdElEID0gMTtcbnZhciBfcHJlZml4ID0gJ0lEXyc7XG5cbi8qKlxuICogRGlzcGF0Y2hlciBpcyB1c2VkIHRvIGJyb2FkY2FzdCBwYXlsb2FkcyB0byByZWdpc3RlcmVkIGNhbGxiYWNrcy4gVGhpcyBpc1xuICogZGlmZmVyZW50IGZyb20gZ2VuZXJpYyBwdWItc3ViIHN5c3RlbXMgaW4gdHdvIHdheXM6XG4gKlxuICogICAxKSBDYWxsYmFja3MgYXJlIG5vdCBzdWJzY3JpYmVkIHRvIHBhcnRpY3VsYXIgZXZlbnRzLiBFdmVyeSBwYXlsb2FkIGlzXG4gKiAgICAgIGRpc3BhdGNoZWQgdG8gZXZlcnkgcmVnaXN0ZXJlZCBjYWxsYmFjay5cbiAqICAgMikgQ2FsbGJhY2tzIGNhbiBiZSBkZWZlcnJlZCBpbiB3aG9sZSBvciBwYXJ0IHVudGlsIG90aGVyIGNhbGxiYWNrcyBoYXZlXG4gKiAgICAgIGJlZW4gZXhlY3V0ZWQuXG4gKlxuICogRm9yIGV4YW1wbGUsIGNvbnNpZGVyIHRoaXMgaHlwb3RoZXRpY2FsIGZsaWdodCBkZXN0aW5hdGlvbiBmb3JtLCB3aGljaFxuICogc2VsZWN0cyBhIGRlZmF1bHQgY2l0eSB3aGVuIGEgY291bnRyeSBpcyBzZWxlY3RlZDpcbiAqXG4gKiAgIHZhciBmbGlnaHREaXNwYXRjaGVyID0gbmV3IERpc3BhdGNoZXIoKTtcbiAqXG4gKiAgIC8vIEtlZXBzIHRyYWNrIG9mIHdoaWNoIGNvdW50cnkgaXMgc2VsZWN0ZWRcbiAqICAgdmFyIENvdW50cnlTdG9yZSA9IHtjb3VudHJ5OiBudWxsfTtcbiAqXG4gKiAgIC8vIEtlZXBzIHRyYWNrIG9mIHdoaWNoIGNpdHkgaXMgc2VsZWN0ZWRcbiAqICAgdmFyIENpdHlTdG9yZSA9IHtjaXR5OiBudWxsfTtcbiAqXG4gKiAgIC8vIEtlZXBzIHRyYWNrIG9mIHRoZSBiYXNlIGZsaWdodCBwcmljZSBvZiB0aGUgc2VsZWN0ZWQgY2l0eVxuICogICB2YXIgRmxpZ2h0UHJpY2VTdG9yZSA9IHtwcmljZTogbnVsbH1cbiAqXG4gKiBXaGVuIGEgdXNlciBjaGFuZ2VzIHRoZSBzZWxlY3RlZCBjaXR5LCB3ZSBkaXNwYXRjaCB0aGUgcGF5bG9hZDpcbiAqXG4gKiAgIGZsaWdodERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICogICAgIGFjdGlvblR5cGU6ICdjaXR5LXVwZGF0ZScsXG4gKiAgICAgc2VsZWN0ZWRDaXR5OiAncGFyaXMnXG4gKiAgIH0pO1xuICpcbiAqIFRoaXMgcGF5bG9hZCBpcyBkaWdlc3RlZCBieSBgQ2l0eVN0b3JlYDpcbiAqXG4gKiAgIGZsaWdodERpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24ocGF5bG9hZCkge1xuICogICAgIGlmIChwYXlsb2FkLmFjdGlvblR5cGUgPT09ICdjaXR5LXVwZGF0ZScpIHtcbiAqICAgICAgIENpdHlTdG9yZS5jaXR5ID0gcGF5bG9hZC5zZWxlY3RlZENpdHk7XG4gKiAgICAgfVxuICogICB9KTtcbiAqXG4gKiBXaGVuIHRoZSB1c2VyIHNlbGVjdHMgYSBjb3VudHJ5LCB3ZSBkaXNwYXRjaCB0aGUgcGF5bG9hZDpcbiAqXG4gKiAgIGZsaWdodERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICogICAgIGFjdGlvblR5cGU6ICdjb3VudHJ5LXVwZGF0ZScsXG4gKiAgICAgc2VsZWN0ZWRDb3VudHJ5OiAnYXVzdHJhbGlhJ1xuICogICB9KTtcbiAqXG4gKiBUaGlzIHBheWxvYWQgaXMgZGlnZXN0ZWQgYnkgYm90aCBzdG9yZXM6XG4gKlxuICogICAgQ291bnRyeVN0b3JlLmRpc3BhdGNoVG9rZW4gPSBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAqICAgICBpZiAocGF5bG9hZC5hY3Rpb25UeXBlID09PSAnY291bnRyeS11cGRhdGUnKSB7XG4gKiAgICAgICBDb3VudHJ5U3RvcmUuY291bnRyeSA9IHBheWxvYWQuc2VsZWN0ZWRDb3VudHJ5O1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogV2hlbiB0aGUgY2FsbGJhY2sgdG8gdXBkYXRlIGBDb3VudHJ5U3RvcmVgIGlzIHJlZ2lzdGVyZWQsIHdlIHNhdmUgYSByZWZlcmVuY2VcbiAqIHRvIHRoZSByZXR1cm5lZCB0b2tlbi4gVXNpbmcgdGhpcyB0b2tlbiB3aXRoIGB3YWl0Rm9yKClgLCB3ZSBjYW4gZ3VhcmFudGVlXG4gKiB0aGF0IGBDb3VudHJ5U3RvcmVgIGlzIHVwZGF0ZWQgYmVmb3JlIHRoZSBjYWxsYmFjayB0aGF0IHVwZGF0ZXMgYENpdHlTdG9yZWBcbiAqIG5lZWRzIHRvIHF1ZXJ5IGl0cyBkYXRhLlxuICpcbiAqICAgQ2l0eVN0b3JlLmRpc3BhdGNoVG9rZW4gPSBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAqICAgICBpZiAocGF5bG9hZC5hY3Rpb25UeXBlID09PSAnY291bnRyeS11cGRhdGUnKSB7XG4gKiAgICAgICAvLyBgQ291bnRyeVN0b3JlLmNvdW50cnlgIG1heSBub3QgYmUgdXBkYXRlZC5cbiAqICAgICAgIGZsaWdodERpc3BhdGNoZXIud2FpdEZvcihbQ291bnRyeVN0b3JlLmRpc3BhdGNoVG9rZW5dKTtcbiAqICAgICAgIC8vIGBDb3VudHJ5U3RvcmUuY291bnRyeWAgaXMgbm93IGd1YXJhbnRlZWQgdG8gYmUgdXBkYXRlZC5cbiAqXG4gKiAgICAgICAvLyBTZWxlY3QgdGhlIGRlZmF1bHQgY2l0eSBmb3IgdGhlIG5ldyBjb3VudHJ5XG4gKiAgICAgICBDaXR5U3RvcmUuY2l0eSA9IGdldERlZmF1bHRDaXR5Rm9yQ291bnRyeShDb3VudHJ5U3RvcmUuY291bnRyeSk7XG4gKiAgICAgfVxuICogICB9KTtcbiAqXG4gKiBUaGUgdXNhZ2Ugb2YgYHdhaXRGb3IoKWAgY2FuIGJlIGNoYWluZWQsIGZvciBleGFtcGxlOlxuICpcbiAqICAgRmxpZ2h0UHJpY2VTdG9yZS5kaXNwYXRjaFRva2VuID1cbiAqICAgICBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAqICAgICAgIHN3aXRjaCAocGF5bG9hZC5hY3Rpb25UeXBlKSB7XG4gKiAgICAgICAgIGNhc2UgJ2NvdW50cnktdXBkYXRlJzpcbiAqICAgICAgICAgICBmbGlnaHREaXNwYXRjaGVyLndhaXRGb3IoW0NpdHlTdG9yZS5kaXNwYXRjaFRva2VuXSk7XG4gKiAgICAgICAgICAgRmxpZ2h0UHJpY2VTdG9yZS5wcmljZSA9XG4gKiAgICAgICAgICAgICBnZXRGbGlnaHRQcmljZVN0b3JlKENvdW50cnlTdG9yZS5jb3VudHJ5LCBDaXR5U3RvcmUuY2l0eSk7XG4gKiAgICAgICAgICAgYnJlYWs7XG4gKlxuICogICAgICAgICBjYXNlICdjaXR5LXVwZGF0ZSc6XG4gKiAgICAgICAgICAgRmxpZ2h0UHJpY2VTdG9yZS5wcmljZSA9XG4gKiAgICAgICAgICAgICBGbGlnaHRQcmljZVN0b3JlKENvdW50cnlTdG9yZS5jb3VudHJ5LCBDaXR5U3RvcmUuY2l0eSk7XG4gKiAgICAgICAgICAgYnJlYWs7XG4gKiAgICAgfVxuICogICB9KTtcbiAqXG4gKiBUaGUgYGNvdW50cnktdXBkYXRlYCBwYXlsb2FkIHdpbGwgYmUgZ3VhcmFudGVlZCB0byBpbnZva2UgdGhlIHN0b3JlcydcbiAqIHJlZ2lzdGVyZWQgY2FsbGJhY2tzIGluIG9yZGVyOiBgQ291bnRyeVN0b3JlYCwgYENpdHlTdG9yZWAsIHRoZW5cbiAqIGBGbGlnaHRQcmljZVN0b3JlYC5cbiAqL1xuXG4gIGZ1bmN0aW9uIERpc3BhdGNoZXIoKSB7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3MgPSB7fTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzUGVuZGluZyA9IHt9O1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNIYW5kbGVkID0ge307XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nID0gZmFsc2U7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9wZW5kaW5nUGF5bG9hZCA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgaW52b2tlZCB3aXRoIGV2ZXJ5IGRpc3BhdGNoZWQgcGF5bG9hZC4gUmV0dXJuc1xuICAgKiBhIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgd2l0aCBgd2FpdEZvcigpYC5cbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUucmVnaXN0ZXI9ZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICB2YXIgaWQgPSBfcHJlZml4ICsgX2xhc3RJRCsrO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXSA9IGNhbGxiYWNrO1xuICAgIHJldHVybiBpZDtcbiAgfTtcblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGNhbGxiYWNrIGJhc2VkIG9uIGl0cyB0b2tlbi5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS51bnJlZ2lzdGVyPWZ1bmN0aW9uKGlkKSB7XG4gICAgaW52YXJpYW50KFxuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3NbaWRdLFxuICAgICAgJ0Rpc3BhdGNoZXIudW5yZWdpc3RlciguLi4pOiBgJXNgIGRvZXMgbm90IG1hcCB0byBhIHJlZ2lzdGVyZWQgY2FsbGJhY2suJyxcbiAgICAgIGlkXG4gICAgKTtcbiAgICBkZWxldGUgdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3NbaWRdO1xuICB9O1xuXG4gIC8qKlxuICAgKiBXYWl0cyBmb3IgdGhlIGNhbGxiYWNrcyBzcGVjaWZpZWQgdG8gYmUgaW52b2tlZCBiZWZvcmUgY29udGludWluZyBleGVjdXRpb25cbiAgICogb2YgdGhlIGN1cnJlbnQgY2FsbGJhY2suIFRoaXMgbWV0aG9kIHNob3VsZCBvbmx5IGJlIHVzZWQgYnkgYSBjYWxsYmFjayBpblxuICAgKiByZXNwb25zZSB0byBhIGRpc3BhdGNoZWQgcGF5bG9hZC5cbiAgICpcbiAgICogQHBhcmFtIHthcnJheTxzdHJpbmc+fSBpZHNcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLndhaXRGb3I9ZnVuY3Rpb24oaWRzKSB7XG4gICAgaW52YXJpYW50KFxuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nLFxuICAgICAgJ0Rpc3BhdGNoZXIud2FpdEZvciguLi4pOiBNdXN0IGJlIGludm9rZWQgd2hpbGUgZGlzcGF0Y2hpbmcuJ1xuICAgICk7XG4gICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IGlkcy5sZW5ndGg7IGlpKyspIHtcbiAgICAgIHZhciBpZCA9IGlkc1tpaV07XG4gICAgICBpZiAodGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmdbaWRdKSB7XG4gICAgICAgIGludmFyaWFudChcbiAgICAgICAgICB0aGlzLiREaXNwYXRjaGVyX2lzSGFuZGxlZFtpZF0sXG4gICAgICAgICAgJ0Rpc3BhdGNoZXIud2FpdEZvciguLi4pOiBDaXJjdWxhciBkZXBlbmRlbmN5IGRldGVjdGVkIHdoaWxlICcgK1xuICAgICAgICAgICd3YWl0aW5nIGZvciBgJXNgLicsXG4gICAgICAgICAgaWRcbiAgICAgICAgKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpbnZhcmlhbnQoXG4gICAgICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXSxcbiAgICAgICAgJ0Rpc3BhdGNoZXIud2FpdEZvciguLi4pOiBgJXNgIGRvZXMgbm90IG1hcCB0byBhIHJlZ2lzdGVyZWQgY2FsbGJhY2suJyxcbiAgICAgICAgaWRcbiAgICAgICk7XG4gICAgICB0aGlzLiREaXNwYXRjaGVyX2ludm9rZUNhbGxiYWNrKGlkKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoZXMgYSBwYXlsb2FkIHRvIGFsbCByZWdpc3RlcmVkIGNhbGxiYWNrcy5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IHBheWxvYWRcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLmRpc3BhdGNoPWZ1bmN0aW9uKHBheWxvYWQpIHtcbiAgICBpbnZhcmlhbnQoXG4gICAgICAhdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nLFxuICAgICAgJ0Rpc3BhdGNoLmRpc3BhdGNoKC4uLik6IENhbm5vdCBkaXNwYXRjaCBpbiB0aGUgbWlkZGxlIG9mIGEgZGlzcGF0Y2guJ1xuICAgICk7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9zdGFydERpc3BhdGNoaW5nKHBheWxvYWQpO1xuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBpZCBpbiB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrcykge1xuICAgICAgICBpZiAodGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmdbaWRdKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pbnZva2VDYWxsYmFjayhpZCk7XG4gICAgICB9XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfc3RvcERpc3BhdGNoaW5nKCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBJcyB0aGlzIERpc3BhdGNoZXIgY3VycmVudGx5IGRpc3BhdGNoaW5nLlxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUuaXNEaXNwYXRjaGluZz1mdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDYWxsIHRoZSBjYWxsYmFjayBzdG9yZWQgd2l0aCB0aGUgZ2l2ZW4gaWQuIEFsc28gZG8gc29tZSBpbnRlcm5hbFxuICAgKiBib29ra2VlcGluZy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUuJERpc3BhdGNoZXJfaW52b2tlQ2FsbGJhY2s9ZnVuY3Rpb24oaWQpIHtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzUGVuZGluZ1tpZF0gPSB0cnVlO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXSh0aGlzLiREaXNwYXRjaGVyX3BlbmRpbmdQYXlsb2FkKTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzSGFuZGxlZFtpZF0gPSB0cnVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZXQgdXAgYm9va2tlZXBpbmcgbmVlZGVkIHdoZW4gZGlzcGF0Y2hpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXlsb2FkXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUuJERpc3BhdGNoZXJfc3RhcnREaXNwYXRjaGluZz1mdW5jdGlvbihwYXlsb2FkKSB7XG4gICAgZm9yICh2YXIgaWQgaW4gdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3MpIHtcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nW2lkXSA9IGZhbHNlO1xuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0hhbmRsZWRbaWRdID0gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMuJERpc3BhdGNoZXJfcGVuZGluZ1BheWxvYWQgPSBwYXlsb2FkO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyA9IHRydWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIENsZWFyIGJvb2trZWVwaW5nIHVzZWQgZm9yIGRpc3BhdGNoaW5nLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLiREaXNwYXRjaGVyX3N0b3BEaXNwYXRjaGluZz1mdW5jdGlvbigpIHtcbiAgICB0aGlzLiREaXNwYXRjaGVyX3BlbmRpbmdQYXlsb2FkID0gbnVsbDtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmcgPSBmYWxzZTtcbiAgfTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IERpc3BhdGNoZXI7XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBpbnZhcmlhbnRcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBVc2UgaW52YXJpYW50KCkgdG8gYXNzZXJ0IHN0YXRlIHdoaWNoIHlvdXIgcHJvZ3JhbSBhc3N1bWVzIHRvIGJlIHRydWUuXG4gKlxuICogUHJvdmlkZSBzcHJpbnRmLXN0eWxlIGZvcm1hdCAob25seSAlcyBpcyBzdXBwb3J0ZWQpIGFuZCBhcmd1bWVudHNcbiAqIHRvIHByb3ZpZGUgaW5mb3JtYXRpb24gYWJvdXQgd2hhdCBicm9rZSBhbmQgd2hhdCB5b3Ugd2VyZVxuICogZXhwZWN0aW5nLlxuICpcbiAqIFRoZSBpbnZhcmlhbnQgbWVzc2FnZSB3aWxsIGJlIHN0cmlwcGVkIGluIHByb2R1Y3Rpb24sIGJ1dCB0aGUgaW52YXJpYW50XG4gKiB3aWxsIHJlbWFpbiB0byBlbnN1cmUgbG9naWMgZG9lcyBub3QgZGlmZmVyIGluIHByb2R1Y3Rpb24uXG4gKi9cblxudmFyIGludmFyaWFudCA9IGZ1bmN0aW9uKGNvbmRpdGlvbiwgZm9ybWF0LCBhLCBiLCBjLCBkLCBlLCBmKSB7XG4gIGlmIChmYWxzZSkge1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhcmlhbnQgcmVxdWlyZXMgYW4gZXJyb3IgbWVzc2FnZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgfVxuXG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdmFyIGVycm9yO1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoXG4gICAgICAgICdNaW5pZmllZCBleGNlcHRpb24gb2NjdXJyZWQ7IHVzZSB0aGUgbm9uLW1pbmlmaWVkIGRldiBlbnZpcm9ubWVudCAnICtcbiAgICAgICAgJ2ZvciB0aGUgZnVsbCBlcnJvciBtZXNzYWdlIGFuZCBhZGRpdGlvbmFsIGhlbHBmdWwgd2FybmluZ3MuJ1xuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGFyZ3MgPSBbYSwgYiwgYywgZCwgZSwgZl07XG4gICAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoXG4gICAgICAgICdJbnZhcmlhbnQgVmlvbGF0aW9uOiAnICtcbiAgICAgICAgZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJnc1thcmdJbmRleCsrXTsgfSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZXJyb3IuZnJhbWVzVG9Qb3AgPSAxOyAvLyB3ZSBkb24ndCBjYXJlIGFib3V0IGludmFyaWFudCdzIG93biBmcmFtZVxuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGludmFyaWFudDtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBDb25zdHJ1Y3RzIGFuIGVudW1lcmF0aW9uIHdpdGgga2V5cyBlcXVhbCB0byB0aGVpciB2YWx1ZS5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiAgIHZhciBDT0xPUlMgPSBrZXlNaXJyb3Ioe2JsdWU6IG51bGwsIHJlZDogbnVsbH0pO1xuICogICB2YXIgbXlDb2xvciA9IENPTE9SUy5ibHVlO1xuICogICB2YXIgaXNDb2xvclZhbGlkID0gISFDT0xPUlNbbXlDb2xvcl07XG4gKlxuICogVGhlIGxhc3QgbGluZSBjb3VsZCBub3QgYmUgcGVyZm9ybWVkIGlmIHRoZSB2YWx1ZXMgb2YgdGhlIGdlbmVyYXRlZCBlbnVtIHdlcmVcbiAqIG5vdCBlcXVhbCB0byB0aGVpciBrZXlzLlxuICpcbiAqICAgSW5wdXQ6ICB7a2V5MTogdmFsMSwga2V5MjogdmFsMn1cbiAqICAgT3V0cHV0OiB7a2V5MToga2V5MSwga2V5Mjoga2V5Mn1cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtvYmplY3R9XG4gKi9cbnZhciBrZXlNaXJyb3IgPSBmdW5jdGlvbihvYmopIHtcbiAgdmFyIHJldCA9IHt9O1xuICB2YXIga2V5O1xuICBpZiAoIShvYmogaW5zdGFuY2VvZiBPYmplY3QgJiYgIUFycmF5LmlzQXJyYXkob2JqKSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2tleU1pcnJvciguLi4pOiBBcmd1bWVudCBtdXN0IGJlIGFuIG9iamVjdC4nKTtcbiAgfVxuICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgcmV0W2tleV0gPSBrZXk7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5TWlycm9yO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiBUb09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PSBudWxsKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gb3duRW51bWVyYWJsZUtleXMob2JqKSB7XG5cdHZhciBrZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqKTtcblxuXHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdGtleXMgPSBrZXlzLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKG9iaikpO1xuXHR9XG5cblx0cmV0dXJuIGtleXMuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRyZXR1cm4gcHJvcElzRW51bWVyYWJsZS5jYWxsKG9iaiwga2V5KTtcblx0fSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcblx0dmFyIGZyb207XG5cdHZhciBrZXlzO1xuXHR2YXIgdG8gPSBUb09iamVjdCh0YXJnZXQpO1xuXG5cdGZvciAodmFyIHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgcysrKSB7XG5cdFx0ZnJvbSA9IGFyZ3VtZW50c1tzXTtcblx0XHRrZXlzID0gb3duRW51bWVyYWJsZUtleXMoT2JqZWN0KGZyb20pKTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dG9ba2V5c1tpXV0gPSBmcm9tW2tleXNbaV1dO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iXX0=
