(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/actions/DetailViewActions.js":[function(require,module,exports){
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


},{"../constants/DetailViewConstants":"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/constants/DetailViewConstants.js","../dispatcher/AppDispatcher":"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/dispatcher/AppDispatcher.js"}],"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/actions/FilterActions.js":[function(require,module,exports){
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


},{"../constants/FilterConstants":"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/constants/FilterConstants.js","../dispatcher/AppDispatcher":"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/dispatcher/AppDispatcher.js"}],"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/app.jsx":[function(require,module,exports){
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


},{"./ui/DetailText.jsx":"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/ui/DetailText.jsx","./ui/DetailView.jsx":"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/ui/DetailView.jsx","./ui/Sidebar.jsx":"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/ui/Sidebar.jsx"}],"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/constants/DetailViewConstants.js":[function(require,module,exports){
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


},{"keymirror":"/Users/gregory_foster/opensource_honeypot/honeypot/node_modules/keymirror/index.js"}],"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/constants/FilterConstants.js":[function(require,module,exports){
/*jshint esnext: true */

'use strict';

var keyMirror = require('keymirror');

module.exports = keyMirror({
  UPDATE_FILTER: null,
  UPDATE_SEARCH: null
});


},{"keymirror":"/Users/gregory_foster/opensource_honeypot/honeypot/node_modules/keymirror/index.js"}],"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/dispatcher/AppDispatcher.js":[function(require,module,exports){
/*jshint esnext: true */

'use strict';

var Dispatcher = require('flux').Dispatcher;

module.exports = new Dispatcher();


},{"flux":"/Users/gregory_foster/opensource_honeypot/honeypot/node_modules/flux/index.js"}],"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/stores/DetailViewStore.js":[function(require,module,exports){
// DetailViewStore.js
// The flux datastore for the entire detail view
/*jshint esnext: true */

'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var DetailViewConstants = require('../constants/DetailViewConstants');
var assign = require('object.assign');

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


},{"../constants/DetailViewConstants":"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/constants/DetailViewConstants.js","../dispatcher/AppDispatcher":"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/dispatcher/AppDispatcher.js","events":"/Users/gregory_foster/opensource_honeypot/honeypot/node_modules/events/events.js","object.assign":"/Users/gregory_foster/opensource_honeypot/honeypot/node_modules/object.assign/index.js"}],"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/stores/FilterStore.js":[function(require,module,exports){
// FilterStore.js
// The flux datastore for the left sidebar
/*jshint esnext: true */

'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var FilterConstants = require('../constants/FilterConstants');
var assign = require('object.assign');
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


},{"../constants/FilterConstants":"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/constants/FilterConstants.js","../dispatcher/AppDispatcher":"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/dispatcher/AppDispatcher.js","./DetailViewStore":"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/stores/DetailViewStore.js","events":"/Users/gregory_foster/opensource_honeypot/honeypot/node_modules/events/events.js","object.assign":"/Users/gregory_foster/opensource_honeypot/honeypot/node_modules/object.assign/index.js"}],"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/ui/Chart.jsx":[function(require,module,exports){
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


},{"../stores/DetailViewStore":"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/stores/DetailViewStore.js","./d3Chart.js":"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/ui/d3Chart.js"}],"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/ui/DetailText.jsx":[function(require,module,exports){
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


},{"../actions/DetailViewActions":"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/actions/DetailViewActions.js","../stores/DetailViewStore":"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/stores/DetailViewStore.js"}],"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/ui/DetailView.jsx":[function(require,module,exports){
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


},{"./Chart.jsx":"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/ui/Chart.jsx","./MeasureRow.jsx":"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/ui/MeasureRow.jsx"}],"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/ui/FilterButton.jsx":[function(require,module,exports){
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


},{}],"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/ui/FilterOptionRow.jsx":[function(require,module,exports){
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


},{"../actions/FilterActions":"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/actions/FilterActions.js","./FilterButton.jsx":"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/ui/FilterButton.jsx"}],"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/ui/FilterResultRow.jsx":[function(require,module,exports){
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


},{}],"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/ui/FilterResultsTable.jsx":[function(require,module,exports){
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


},{"../actions/DetailViewActions.js":"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/actions/DetailViewActions.js","../actions/FilterActions":"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/actions/FilterActions.js","../stores/FilterStore":"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/stores/FilterStore.js","./FilterResultRow.jsx":"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/ui/FilterResultRow.jsx"}],"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/ui/MeasureRow.jsx":[function(require,module,exports){
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


},{"../actions/DetailViewActions":"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/actions/DetailViewActions.js","../stores/DetailViewStore":"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/stores/DetailViewStore.js","./FilterButton.jsx":"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/ui/FilterButton.jsx"}],"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/ui/SearchBox.jsx":[function(require,module,exports){
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


},{"../actions/FilterActions":"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/actions/FilterActions.js"}],"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/ui/Sidebar.jsx":[function(require,module,exports){
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


},{"../stores/FilterStore":"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/stores/FilterStore.js","./FilterOptionRow.jsx":"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/ui/FilterOptionRow.jsx","./FilterResultsTable.jsx":"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/ui/FilterResultsTable.jsx","./SearchBox.jsx":"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/ui/SearchBox.jsx"}],"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/ui/d3Chart.js":[function(require,module,exports){
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


},{"../actions/DetailViewActions":"/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/actions/DetailViewActions.js"}],"/Users/gregory_foster/opensource_honeypot/honeypot/node_modules/browserify/node_modules/process/browser.js":[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            currentQueue[queueIndex].run();
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],"/Users/gregory_foster/opensource_honeypot/honeypot/node_modules/events/events.js":[function(require,module,exports){
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

},{}],"/Users/gregory_foster/opensource_honeypot/honeypot/node_modules/flux/index.js":[function(require,module,exports){
/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

module.exports.Dispatcher = require('./lib/Dispatcher');

},{"./lib/Dispatcher":"/Users/gregory_foster/opensource_honeypot/honeypot/node_modules/flux/lib/Dispatcher.js"}],"/Users/gregory_foster/opensource_honeypot/honeypot/node_modules/flux/lib/Dispatcher.js":[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Dispatcher
 * 
 * @preventMunge
 */

'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var invariant = require('fbjs/lib/invariant');

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
 *   CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
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
 *         case 'city-update':
 *           flightDispatcher.waitFor([CityStore.dispatchToken]);
 *           FlightPriceStore.price =
 *             getFlightPriceStore(CountryStore.country, CityStore.city);
 *           break;
 *     }
 *   });
 *
 * The `country-update` payload will be guaranteed to invoke the stores'
 * registered callbacks in order: `CountryStore`, `CityStore`, then
 * `FlightPriceStore`.
 */

var Dispatcher = (function () {
  function Dispatcher() {
    _classCallCheck(this, Dispatcher);

    this._callbacks = {};
    this._isDispatching = false;
    this._isHandled = {};
    this._isPending = {};
    this._lastID = 1;
  }

  /**
   * Registers a callback to be invoked with every dispatched payload. Returns
   * a token that can be used with `waitFor()`.
   */

  Dispatcher.prototype.register = function register(callback) {
    var id = _prefix + this._lastID++;
    this._callbacks[id] = callback;
    return id;
  };

  /**
   * Removes a callback based on its token.
   */

  Dispatcher.prototype.unregister = function unregister(id) {
    !this._callbacks[id] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.unregister(...): `%s` does not map to a registered callback.', id) : invariant(false) : undefined;
    delete this._callbacks[id];
  };

  /**
   * Waits for the callbacks specified to be invoked before continuing execution
   * of the current callback. This method should only be used by a callback in
   * response to a dispatched payload.
   */

  Dispatcher.prototype.waitFor = function waitFor(ids) {
    !this._isDispatching ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.waitFor(...): Must be invoked while dispatching.') : invariant(false) : undefined;
    for (var ii = 0; ii < ids.length; ii++) {
      var id = ids[ii];
      if (this._isPending[id]) {
        !this._isHandled[id] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.waitFor(...): Circular dependency detected while ' + 'waiting for `%s`.', id) : invariant(false) : undefined;
        continue;
      }
      !this._callbacks[id] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.waitFor(...): `%s` does not map to a registered callback.', id) : invariant(false) : undefined;
      this._invokeCallback(id);
    }
  };

  /**
   * Dispatches a payload to all registered callbacks.
   */

  Dispatcher.prototype.dispatch = function dispatch(payload) {
    !!this._isDispatching ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.') : invariant(false) : undefined;
    this._startDispatching(payload);
    try {
      for (var id in this._callbacks) {
        if (this._isPending[id]) {
          continue;
        }
        this._invokeCallback(id);
      }
    } finally {
      this._stopDispatching();
    }
  };

  /**
   * Is this Dispatcher currently dispatching.
   */

  Dispatcher.prototype.isDispatching = function isDispatching() {
    return this._isDispatching;
  };

  /**
   * Call the callback stored with the given id. Also do some internal
   * bookkeeping.
   *
   * @internal
   */

  Dispatcher.prototype._invokeCallback = function _invokeCallback(id) {
    this._isPending[id] = true;
    this._callbacks[id](this._pendingPayload);
    this._isHandled[id] = true;
  };

  /**
   * Set up bookkeeping needed when dispatching.
   *
   * @internal
   */

  Dispatcher.prototype._startDispatching = function _startDispatching(payload) {
    for (var id in this._callbacks) {
      this._isPending[id] = false;
      this._isHandled[id] = false;
    }
    this._pendingPayload = payload;
    this._isDispatching = true;
  };

  /**
   * Clear bookkeeping used for dispatching.
   *
   * @internal
   */

  Dispatcher.prototype._stopDispatching = function _stopDispatching() {
    delete this._pendingPayload;
    this._isDispatching = false;
  };

  return Dispatcher;
})();

module.exports = Dispatcher;
}).call(this,require('_process'))

},{"_process":"/Users/gregory_foster/opensource_honeypot/honeypot/node_modules/browserify/node_modules/process/browser.js","fbjs/lib/invariant":"/Users/gregory_foster/opensource_honeypot/honeypot/node_modules/flux/node_modules/fbjs/lib/invariant.js"}],"/Users/gregory_foster/opensource_honeypot/honeypot/node_modules/flux/node_modules/fbjs/lib/invariant.js":[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
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

var invariant = function (condition, format, a, b, c, d, e, f) {
  if (process.env.NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error('Invariant Violation: ' + format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;
}).call(this,require('_process'))

},{"_process":"/Users/gregory_foster/opensource_honeypot/honeypot/node_modules/browserify/node_modules/process/browser.js"}],"/Users/gregory_foster/opensource_honeypot/honeypot/node_modules/keymirror/index.js":[function(require,module,exports){
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

},{}],"/Users/gregory_foster/opensource_honeypot/honeypot/node_modules/object.assign/hasSymbols.js":[function(require,module,exports){
var keys = require('object-keys');

module.exports = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	var obj = {};
	var sym = Symbol('test');
	if (typeof sym === 'string') { return false; }
	if (sym instanceof Symbol) { return false; }
	obj[sym] = 42;
	for (sym in obj) { return false; }
	if (keys(obj).length !== 0) { return false; }
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== 42 || descriptor.enumerable !== true) { return false; }
	}

	return true;
};

},{"object-keys":"/Users/gregory_foster/opensource_honeypot/honeypot/node_modules/object.assign/node_modules/object-keys/index.js"}],"/Users/gregory_foster/opensource_honeypot/honeypot/node_modules/object.assign/index.js":[function(require,module,exports){
'use strict';

// modified from https://github.com/es-shims/es6-shim
var keys = require('object-keys');
var canBeObject = function (obj) {
	return typeof obj !== 'undefined' && obj !== null;
};
var hasSymbols = require('./hasSymbols')();
var defineProperties = require('define-properties');
var toObject = Object;
var push = Array.prototype.push;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

var assignShim = function assign(target, source1) {
	if (!canBeObject(target)) { throw new TypeError('target must be an object'); }
	var objTarget = toObject(target);
	var s, source, i, props, syms;
	for (s = 1; s < arguments.length; ++s) {
		source = toObject(arguments[s]);
		props = keys(source);
		if (hasSymbols && Object.getOwnPropertySymbols) {
			syms = Object.getOwnPropertySymbols(source);
			for (i = 0; i < syms.length; ++i) {
				if (propIsEnumerable.call(source, syms[i])) {
					push.call(props, syms[i]);
				}
			}
		}
		for (i = 0; i < props.length; ++i) {
			objTarget[props[i]] = source[props[i]];
		}
	}
	return objTarget;
};

defineProperties(assignShim, {
	shim: function shimObjectAssign() {
		var assignHasPendingExceptions = function () {
			if (!Object.assign || !Object.preventExtensions) {
				return false;
			}
			// Firefox 37 still has "pending exception" logic in its Object.assign implementation,
			// which is 72% slower than our shim, and Firefox 40's native implementation.
			var thrower = Object.preventExtensions({ 1: 2 });
			try {
				Object.assign(thrower, 'xy');
			} catch (e) {
				return thrower[1] === 'y';
			}
		};
		defineProperties(
			Object,
			{ assign: assignShim },
			{ assign: assignHasPendingExceptions }
		);
		return Object.assign || assignShim;
	}
});

module.exports = assignShim;

},{"./hasSymbols":"/Users/gregory_foster/opensource_honeypot/honeypot/node_modules/object.assign/hasSymbols.js","define-properties":"/Users/gregory_foster/opensource_honeypot/honeypot/node_modules/object.assign/node_modules/define-properties/index.js","object-keys":"/Users/gregory_foster/opensource_honeypot/honeypot/node_modules/object.assign/node_modules/object-keys/index.js"}],"/Users/gregory_foster/opensource_honeypot/honeypot/node_modules/object.assign/node_modules/define-properties/index.js":[function(require,module,exports){
'use strict';

var keys = require('object-keys');
var foreach = require('foreach');
var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';

var toStr = Object.prototype.toString;

var isFunction = function (fn) {
	return typeof fn === 'function' && toStr.call(fn) === '[object Function]';
};

var arePropertyDescriptorsSupported = function () {
	var obj = {};
	try {
		Object.defineProperty(obj, 'x', { value: obj, enumerable: false });
        /* eslint-disable no-unused-vars */
        for (var _ in obj) { return false; }
        /* eslint-enable no-unused-vars */
		return obj.x === obj;
	} catch (e) { /* this is IE 8. */
		return false;
	}
};
var supportsDescriptors = Object.defineProperty && arePropertyDescriptorsSupported();

var defineProperty = function (object, name, value, predicate) {
	if (name in object && (!isFunction(predicate) || !predicate())) {
		return;
	}
	if (supportsDescriptors) {
		Object.defineProperty(object, name, {
			configurable: true,
			enumerable: false,
			writable: true,
			value: value
		});
	} else {
		object[name] = value;
	}
};

var defineProperties = function (object, map) {
	var predicates = arguments.length > 2 ? arguments[2] : {};
	var props = keys(map);
	if (hasSymbols) {
		props = props.concat(Object.getOwnPropertySymbols(map));
	}
	foreach(props, function (name) {
		defineProperty(object, name, map[name], predicates[name]);
	});
};

defineProperties.supportsDescriptors = !!supportsDescriptors;

module.exports = defineProperties;

},{"foreach":"/Users/gregory_foster/opensource_honeypot/honeypot/node_modules/object.assign/node_modules/define-properties/node_modules/foreach/index.js","object-keys":"/Users/gregory_foster/opensource_honeypot/honeypot/node_modules/object.assign/node_modules/object-keys/index.js"}],"/Users/gregory_foster/opensource_honeypot/honeypot/node_modules/object.assign/node_modules/define-properties/node_modules/foreach/index.js":[function(require,module,exports){

var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

module.exports = function forEach (obj, fn, ctx) {
    if (toString.call(fn) !== '[object Function]') {
        throw new TypeError('iterator must be a function');
    }
    var l = obj.length;
    if (l === +l) {
        for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
        }
    } else {
        for (var k in obj) {
            if (hasOwn.call(obj, k)) {
                fn.call(ctx, obj[k], k, obj);
            }
        }
    }
};


},{}],"/Users/gregory_foster/opensource_honeypot/honeypot/node_modules/object.assign/node_modules/object-keys/index.js":[function(require,module,exports){
'use strict';

// modified from https://github.com/es-shims/es5-shim
var has = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var slice = Array.prototype.slice;
var isArgs = require('./isArguments');
var hasDontEnumBug = !({ 'toString': null }).propertyIsEnumerable('toString');
var hasProtoEnumBug = function () {}.propertyIsEnumerable('prototype');
var dontEnums = [
	'toString',
	'toLocaleString',
	'valueOf',
	'hasOwnProperty',
	'isPrototypeOf',
	'propertyIsEnumerable',
	'constructor'
];
var equalsConstructorPrototype = function (o) {
	var ctor = o.constructor;
	return ctor && ctor.prototype === o;
};
var blacklistedKeys = {
	$window: true,
	$console: true,
	$parent: true,
	$self: true,
	$frames: true,
	$webkitIndexedDB: true,
	$webkitStorageInfo: true
};
var hasAutomationEqualityBug = (function () {
	/* global window */
	if (typeof window === 'undefined') { return false; }
	for (var k in window) {
		if (!blacklistedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
			try {
				equalsConstructorPrototype(window[k]);
			} catch (e) {
				return true;
			}
		}
	}
	return false;
}());
var equalsConstructorPrototypeIfNotBuggy = function (o) {
	/* global window */
	if (typeof window === 'undefined' && !hasAutomationEqualityBug) {
		return equalsConstructorPrototype(o);
	}
	try {
		return equalsConstructorPrototype(o);
	} catch (e) {
		return false;
	}
};

var keysShim = function keys(object) {
	var isObject = object !== null && typeof object === 'object';
	var isFunction = toStr.call(object) === '[object Function]';
	var isArguments = isArgs(object);
	var isString = isObject && toStr.call(object) === '[object String]';
	var theKeys = [];

	if (!isObject && !isFunction && !isArguments) {
		throw new TypeError('Object.keys called on a non-object');
	}

	var skipProto = hasProtoEnumBug && isFunction;
	if (isString && object.length > 0 && !has.call(object, 0)) {
		for (var i = 0; i < object.length; ++i) {
			theKeys.push(String(i));
		}
	}

	if (isArguments && object.length > 0) {
		for (var j = 0; j < object.length; ++j) {
			theKeys.push(String(j));
		}
	} else {
		for (var name in object) {
			if (!(skipProto && name === 'prototype') && has.call(object, name)) {
				theKeys.push(String(name));
			}
		}
	}

	if (hasDontEnumBug) {
		var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

		for (var k = 0; k < dontEnums.length; ++k) {
			if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
				theKeys.push(dontEnums[k]);
			}
		}
	}
	return theKeys;
};

keysShim.shim = function shimObjectKeys() {
	if (!Object.keys) {
		Object.keys = keysShim;
	} else {
		var keysWorksWithArguments = (function () {
			// Safari 5.0 bug
			return (Object.keys(arguments) || '').length === 2;
		}(1, 2));
		if (!keysWorksWithArguments) {
			var originalKeys = Object.keys;
			Object.keys = function keys(object) {
				if (isArgs(object)) {
					return originalKeys(slice.call(object));
				} else {
					return originalKeys(object);
				}
			};
		}
	}
	return Object.keys || keysShim;
};

module.exports = keysShim;

},{"./isArguments":"/Users/gregory_foster/opensource_honeypot/honeypot/node_modules/object.assign/node_modules/object-keys/isArguments.js"}],"/Users/gregory_foster/opensource_honeypot/honeypot/node_modules/object.assign/node_modules/object-keys/isArguments.js":[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;

module.exports = function isArguments(value) {
	var str = toStr.call(value);
	var isArgs = str === '[object Arguments]';
	if (!isArgs) {
		isArgs = str !== '[object Array]' &&
			value !== null &&
			typeof value === 'object' &&
			typeof value.length === 'number' &&
			value.length >= 0 &&
			toStr.call(value.callee) === '[object Function]';
	}
	return isArgs;
};

},{}]},{},["/Users/gregory_foster/opensource_honeypot/honeypot/dev/scripts/app.jsx"])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZ3JlZ29yeV9mb3N0ZXIvb3BlbnNvdXJjZV9ob25leXBvdC9ob25leXBvdC9kZXYvc2NyaXB0cy9hY3Rpb25zL0RldGFpbFZpZXdBY3Rpb25zLmpzIiwiL1VzZXJzL2dyZWdvcnlfZm9zdGVyL29wZW5zb3VyY2VfaG9uZXlwb3QvaG9uZXlwb3QvZGV2L3NjcmlwdHMvYWN0aW9ucy9GaWx0ZXJBY3Rpb25zLmpzIiwiL1VzZXJzL2dyZWdvcnlfZm9zdGVyL29wZW5zb3VyY2VfaG9uZXlwb3QvaG9uZXlwb3QvZGV2L3NjcmlwdHMvYXBwLmpzeCIsIi9Vc2Vycy9ncmVnb3J5X2Zvc3Rlci9vcGVuc291cmNlX2hvbmV5cG90L2hvbmV5cG90L2Rldi9zY3JpcHRzL2NvbnN0YW50cy9EZXRhaWxWaWV3Q29uc3RhbnRzLmpzIiwiL1VzZXJzL2dyZWdvcnlfZm9zdGVyL29wZW5zb3VyY2VfaG9uZXlwb3QvaG9uZXlwb3QvZGV2L3NjcmlwdHMvY29uc3RhbnRzL0ZpbHRlckNvbnN0YW50cy5qcyIsIi9Vc2Vycy9ncmVnb3J5X2Zvc3Rlci9vcGVuc291cmNlX2hvbmV5cG90L2hvbmV5cG90L2Rldi9zY3JpcHRzL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlci5qcyIsIi9Vc2Vycy9ncmVnb3J5X2Zvc3Rlci9vcGVuc291cmNlX2hvbmV5cG90L2hvbmV5cG90L2Rldi9zY3JpcHRzL3N0b3Jlcy9EZXRhaWxWaWV3U3RvcmUuanMiLCIvVXNlcnMvZ3JlZ29yeV9mb3N0ZXIvb3BlbnNvdXJjZV9ob25leXBvdC9ob25leXBvdC9kZXYvc2NyaXB0cy9zdG9yZXMvRmlsdGVyU3RvcmUuanMiLCIvVXNlcnMvZ3JlZ29yeV9mb3N0ZXIvb3BlbnNvdXJjZV9ob25leXBvdC9ob25leXBvdC9kZXYvc2NyaXB0cy91aS9DaGFydC5qc3giLCIvVXNlcnMvZ3JlZ29yeV9mb3N0ZXIvb3BlbnNvdXJjZV9ob25leXBvdC9ob25leXBvdC9kZXYvc2NyaXB0cy91aS9EZXRhaWxUZXh0LmpzeCIsIi9Vc2Vycy9ncmVnb3J5X2Zvc3Rlci9vcGVuc291cmNlX2hvbmV5cG90L2hvbmV5cG90L2Rldi9zY3JpcHRzL3VpL0RldGFpbFZpZXcuanN4IiwiL1VzZXJzL2dyZWdvcnlfZm9zdGVyL29wZW5zb3VyY2VfaG9uZXlwb3QvaG9uZXlwb3QvZGV2L3NjcmlwdHMvdWkvRmlsdGVyQnV0dG9uLmpzeCIsIi9Vc2Vycy9ncmVnb3J5X2Zvc3Rlci9vcGVuc291cmNlX2hvbmV5cG90L2hvbmV5cG90L2Rldi9zY3JpcHRzL3VpL0ZpbHRlck9wdGlvblJvdy5qc3giLCIvVXNlcnMvZ3JlZ29yeV9mb3N0ZXIvb3BlbnNvdXJjZV9ob25leXBvdC9ob25leXBvdC9kZXYvc2NyaXB0cy91aS9GaWx0ZXJSZXN1bHRSb3cuanN4IiwiL1VzZXJzL2dyZWdvcnlfZm9zdGVyL29wZW5zb3VyY2VfaG9uZXlwb3QvaG9uZXlwb3QvZGV2L3NjcmlwdHMvdWkvRmlsdGVyUmVzdWx0c1RhYmxlLmpzeCIsIi9Vc2Vycy9ncmVnb3J5X2Zvc3Rlci9vcGVuc291cmNlX2hvbmV5cG90L2hvbmV5cG90L2Rldi9zY3JpcHRzL3VpL01lYXN1cmVSb3cuanN4IiwiL1VzZXJzL2dyZWdvcnlfZm9zdGVyL29wZW5zb3VyY2VfaG9uZXlwb3QvaG9uZXlwb3QvZGV2L3NjcmlwdHMvdWkvU2VhcmNoQm94LmpzeCIsIi9Vc2Vycy9ncmVnb3J5X2Zvc3Rlci9vcGVuc291cmNlX2hvbmV5cG90L2hvbmV5cG90L2Rldi9zY3JpcHRzL3VpL1NpZGViYXIuanN4IiwiL1VzZXJzL2dyZWdvcnlfZm9zdGVyL29wZW5zb3VyY2VfaG9uZXlwb3QvaG9uZXlwb3QvZGV2L3NjcmlwdHMvdWkvZDNDaGFydC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9mbHV4L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZsdXgvbGliL0Rpc3BhdGNoZXIuanMiLCJub2RlX21vZHVsZXMvZmx1eC9ub2RlX21vZHVsZXMvZmJqcy9saWIvaW52YXJpYW50LmpzIiwibm9kZV9tb2R1bGVzL2tleW1pcnJvci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QuYXNzaWduL2hhc1N5bWJvbHMuanMiLCJub2RlX21vZHVsZXMvb2JqZWN0LmFzc2lnbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QuYXNzaWduL25vZGVfbW9kdWxlcy9kZWZpbmUtcHJvcGVydGllcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QuYXNzaWduL25vZGVfbW9kdWxlcy9kZWZpbmUtcHJvcGVydGllcy9ub2RlX21vZHVsZXMvZm9yZWFjaC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QuYXNzaWduL25vZGVfbW9kdWxlcy9vYmplY3Qta2V5cy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QuYXNzaWduL25vZGVfbW9kdWxlcy9vYmplY3Qta2V5cy9pc0FyZ3VtZW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLHdCQUF3Qjs7QUFFeEIsWUFBWSxDQUFDOztBQUViLElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBQzNELElBQUksbUJBQW1CLEdBQUcsT0FBTyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7O0FBRXRFLElBQUksaUJBQWlCLEdBQUc7O0VBRXRCLGFBQWEsRUFBRSxTQUFTLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM5QyxhQUFhLENBQUMsUUFBUSxDQUFDO01BQ3JCLFVBQVUsRUFBRSxtQkFBbUIsQ0FBQyxjQUFjO01BQzlDLE9BQU8sRUFBRSxPQUFPO0tBQ2pCLENBQUMsQ0FBQztBQUNQLEdBQUc7O0VBRUQsVUFBVSxFQUFFLFNBQVMs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TUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFcEYsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsY0FBYyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3BHOztFQUVFLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7SUFDMUMsT0FBTyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDcEMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7SUFDckMsT0FBTyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEMsR0FBRyxDQUFDLENBQUM7QUFDTDs7RUFFRSxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDO0lBQzFDLE9BQU8sT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ3BDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztJQUNqQixPQUFPLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4QyxHQUFHLENBQUMsQ0FBQzs7QUFFTCxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7O0FBRXpFLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7RUFFdkUsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQztJQUM1RSxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQ2pHLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pFLEdBQUcsQ0FBQyxDQUFDOztFQUVILFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMvRixDQUFDLENBQUM7O0FBRUYsT0FBTyxDQUFDLFdBQVcsR0FBRyxVQUFVLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUM7RUFDcEQsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUN6QyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN0QixFQUFFLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDckQsRUFBRSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDNUUsQ0FBQyxDQUFDOztBQUVGLE9BQU8sQ0FBQyxPQUFPLEdBQUcsVUFBVSxJQUFJLEVBQUUsQ0FBQzs7RUFFakMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztJQUMzQyxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUM7R0FDakIsQ0FBQyxDQUFDO0VBQ0gsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztJQUM1QyxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUM7QUFDckIsR0FBRyxDQUFDLENBQUM7O0VBRUgsSUFBSSxPQUFPLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7RUFDcEQsSUFBSSxPQUFPLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7RUFDcEQsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzlDLEVBQUUsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUU5QyxFQUFFLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsT0FB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUN0T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qanNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBBcHBEaXNwYXRjaGVyID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJyk7XG52YXIgRGV0YWlsVmlld0NvbnN0YW50cyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9EZXRhaWxWaWV3Q29uc3RhbnRzJyk7XG5cbnZhciBEZXRhaWxWaWV3QWN0aW9ucyA9IHtcblxuICB1cGRhdGVNZWFzdXJlOiBmdW5jdGlvbiB1cGRhdGVNZWFzdXJlKG1lYXN1cmUpIHtcbiAgICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICAgIGFjdGlvblR5cGU6IERldGFpbFZpZXdDb25zdGFudHMuVVBEQVRFX01FQVNVUkUsXG4gICAgICBtZWFzdXJlOiBtZWFzdXJlXG4gICAgfSk7XG4gIH0sXG5cbiAgdXBkYXRlRGF0YTogZnVuY3Rpb24gdXBkYXRlRGF0YSgpIHtcbiAgICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICAgIGFjdGlvblR5cGU6IERldGFpbFZpZXdDb25zdGFudHMuVVBEQVRFX0RBVEFcbiAgICB9KTtcbiAgfSxcblxuICB1cGRhdGVEZXRhaWxWaWV3OiBmdW5jdGlvbiB1cGRhdGVEZXRhaWxWaWV3KGRhZywgbmFtZSkge1xuICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgYWN0aW9uVHlwZTogRGV0YWlsVmlld0NvbnN0YW50cy5VUERBVEVfREVUQUlMX1ZJRVcsXG4gICAgICBkYWc6IGRhZyxcbiAgICAgIG5hbWU6IG5hbWVcbiAgICB9KTtcbiAgfSxcblxuICB1cGRhdGVGb2N1c0RhdGE6IGZ1bmN0aW9uIHVwZGF0ZUZvY3VzRGF0YShkYXRlLCB2YWx1ZSkge1xuICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgYWN0aW9uVHlwZTogRGV0YWlsVmlld0NvbnN0YW50cy5VUERBVEVfRk9DVVNfREFUQSxcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGRhdGU6IGRhdGVcbiAgICB9KTtcbiAgfSxcblxuICB1cGRhdGVEYWc6IGZ1bmN0aW9uIHVwZGF0ZURhZyhkYWcpIHtcbiAgICBBcHBEaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICAgIGFjdGlvblR5cGU6IERldGFpbFZpZXdDb25zdGFudHMuVVBEQVRFX0RBRyxcbiAgICAgIGRhZzogZGFnXG4gICAgfSk7XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEZXRhaWxWaWV3QWN0aW9ucztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OW5jbVZuYjNKNVgyWnZjM1JsY2k5dmNHVnVjMjkxY21ObFgyaHZibVY1Y0c5MEwyaHZibVY1Y0c5MEwyUmxkaTl6WTNKcGNIUnpMMkZqZEdsdmJuTXZSR1YwWVdsc1ZtbGxkMEZqZEdsdmJuTXVhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanM3T3p0QlFVVkJMRWxCUVUwc1lVRkJZU3hIUVVGSExFOUJRVThzUTBGQlF5dzJRa0ZCTmtJc1EwRkJReXhEUVVGRE8wRkJRemRFTEVsQlFVMHNiVUpCUVcxQ0xFZEJRVWNzVDBGQlR5eERRVUZETEd0RFFVRnJReXhEUVVGRExFTkJRVU03TzBGQlJYaEZMRWxCUVUwc2FVSkJRV2xDTEVkQlFVYzdPMEZCUlhoQ0xHVkJRV0VzUlVGQlJTeDFRa0ZCVXl4UFFVRlBMRVZCUVVVN1FVRkRMMElzYVVKQlFXRXNRMEZCUXl4UlFVRlJMRU5CUVVNN1FVRkRja0lzWjBKQlFWVXNSVUZCUlN4dFFrRkJiVUlzUTBGQlF5eGpRVUZqTzBGQlF6bERMR0ZCUVU4c1JVRkJSU3hQUVVGUE8wdEJRMnBDTEVOQlFVTXNRMEZCUXp0SFFVTktPenRCUVVWRUxGbEJRVlVzUlVGQlJTeHpRa0ZCVnp0QlFVTnlRaXhwUWtGQllTeERRVUZETEZGQlFWRXNRMEZCUXp0QlFVTnlRaXhuUWtGQlZTeEZRVUZGTEcxQ1FVRnRRaXhEUVVGRExGZEJRVmM3UzBGRE5VTXNRMEZCUXl4RFFVRkRPMGRCUTBvN08wRkJSVVFzYTBKQlFXZENMRVZCUVVVc01FSkJRVk1zUjBGQlJ5eEZRVUZETEVsQlFVa3NSVUZCUlR0QlFVTnVReXhwUWtGQllTeERRVUZETEZGQlFWRXNRMEZCUXp0QlFVTnlRaXhuUWtGQlZTeEZRVUZGTEcxQ1FVRnRRaXhEUVVGRExHdENRVUZyUWp0QlFVTnNSQ3hUUVVGSExFVkJRVVVzUjBGQlJ6dEJRVU5TTEZWQlFVa3NSVUZCUlN4SlFVRkpPMHRCUTFnc1EwRkJReXhEUVVGRE8wZEJRMG83TzBGQlJVUXNhVUpCUVdVc1JVRkJSU3g1UWtGQlV5eEpRVUZKTEVWQlFVTXNTMEZCU3l4RlFVRkZPMEZCUTNCRExHbENRVUZoTEVOQlFVTXNVVUZCVVN4RFFVRkRPMEZCUTNKQ0xHZENRVUZWTEVWQlFVVXNiVUpCUVcxQ0xFTkJRVU1zYVVKQlFXbENPMEZCUTJwRUxGZEJRVXNzUlVGQlJTeExRVUZMTzBGQlExb3NWVUZCU1N4RlFVRkZMRWxCUVVrN1MwRkRXQ3hEUVVGRExFTkJRVU03UjBGRFNqczdRVUZGUkN4WFFVRlRMRVZCUVVVc2JVSkJRVk1zUjBGQlJ5eEZRVUZGTzBGQlEzWkNMR2xDUVVGaExFTkJRVU1zVVVGQlVTeERRVUZETzBGQlEzSkNMR2RDUVVGVkxFVkJRVVVzYlVKQlFXMUNMRU5CUVVNc1ZVRkJWVHRCUVVNeFF5eFRRVUZITEVWQlFVVXNSMEZCUnp0TFFVTlVMRU5CUVVNc1EwRkJRenRIUVVOS096dERRVVZHTEVOQlFVTTdPMEZCUlVZc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eHBRa0ZCYVVJc1EwRkJReUlzSW1acGJHVWlPaUl2VlhObGNuTXZaM0psWjI5eWVWOW1iM04wWlhJdmIzQmxibk52ZFhKalpWOW9iMjVsZVhCdmRDOW9iMjVsZVhCdmRDOWtaWFl2YzJOeWFYQjBjeTloWTNScGIyNXpMMFJsZEdGcGJGWnBaWGRCWTNScGIyNXpMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUx5cHFjMmhwYm5RZ1pYTnVaWGgwT2lCMGNuVmxJQ292WEc1Y2JtTnZibk4wSUVGd2NFUnBjM0JoZEdOb1pYSWdQU0J5WlhGMWFYSmxLQ2N1TGk5a2FYTndZWFJqYUdWeUwwRndjRVJwYzNCaGRHTm9aWEluS1R0Y2JtTnZibk4wSUVSbGRHRnBiRlpwWlhkRGIyNXpkR0Z1ZEhNZ1BTQnlaWEYxYVhKbEtDY3VMaTlqYjI1emRHRnVkSE12UkdWMFlXbHNWbWxsZDBOdmJuTjBZVzUwY3ljcE8xeHVYRzVqYjI1emRDQkVaWFJoYVd4V2FXVjNRV04wYVc5dWN5QTlJSHRjYmx4dUlDQjFjR1JoZEdWTlpXRnpkWEpsT2lCbWRXNWpkR2x2YmlodFpXRnpkWEpsS1NCN1hHNGdJQ0FnUVhCd1JHbHpjR0YwWTJobGNpNWthWE53WVhSamFDaDdYRzRnSUNBZ0lDQmhZM1JwYjI1VWVYQmxPaUJFWlhSaGFXeFdhV1YzUTI5dWMzUmhiblJ6TGxWUVJFRlVSVjlOUlVGVFZWSkZMRnh1SUNBZ0lDQWdiV1ZoYzNWeVpUb2diV1ZoYzNWeVpTeGNiaUFnSUNCOUtUdGNiaUFnZlN4Y2JseHVJQ0IxY0dSaGRHVkVZWFJoT2lCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNCQmNIQkVhWE53WVhSamFHVnlMbVJwYzNCaGRHTm9LSHRjYmlBZ0lDQWdJR0ZqZEdsdmJsUjVjR1U2SUVSbGRHRnBiRlpwWlhkRGIyNXpkR0Z1ZEhNdVZWQkVRVlJGWDBSQlZFRmNiaUFnSUNCOUtUdGNiaUFnZlN4Y2JseHVJQ0IxY0dSaGRHVkVaWFJoYVd4V2FXVjNPaUJtZFc1amRHbHZiaWhrWVdjc2JtRnRaU2tnZTF4dUlDQWdJRUZ3Y0VScGMzQmhkR05vWlhJdVpHbHpjR0YwWTJnb2UxeHVJQ0FnSUNBZ1lXTjBhVzl1Vkhsd1pUb2dSR1YwWVdsc1ZtbGxkME52Ym5OMFlXNTBjeTVWVUVSQlZFVmZSRVZVUVVsTVgxWkpSVmNzWEc0Z0lDQWdJQ0JrWVdjNklHUmhaeXhjYmlBZ0lDQWdJRzVoYldVNklHNWhiV1ZjYmlBZ0lDQjlLVHRjYmlBZ2ZTeGNiaUFnWEc0Z0lIVndaR0YwWlVadlkzVnpSR0YwWVRvZ1puVnVZM1JwYjI0b1pHRjBaU3gyWVd4MVpTa2dlMXh1SUNBZ0lFRndjRVJwYzNCaGRHTm9aWEl1WkdsemNHRjBZMmdvZTF4dUlDQWdJQ0FnWVdOMGFXOXVWSGx3WlRvZ1JHVjBZV2xzVm1sbGQwTnZibk4wWVc1MGN5NVZVRVJCVkVWZlJrOURWVk5mUkVGVVFTeGNiaUFnSUNBZ0lIWmhiSFZsT2lCMllXeDFaU3hjYmlBZ0lDQWdJR1JoZEdVNklHUmhkR1VnWEc0Z0lDQWdmU2s3WEc0Z0lIMHNYRzVjYmlBZ2RYQmtZWFJsUkdGbk9pQm1kVzVqZEdsdmJpaGtZV2NwSUh0Y2JpQWdJQ0JCY0hCRWFYTndZWFJqYUdWeUxtUnBjM0JoZEdOb0tIdGNiaUFnSUNBZ0lHRmpkR2x2YmxSNWNHVTZJRVJsZEdGcGJGWnBaWGREYjI1emRHRnVkSE11VlZCRVFWUkZYMFJCUnl4Y2JpQWdJQ0FnSUdSaFp6b2daR0ZuWEc0Z0lDQWdmU2s3WEc0Z0lIMWNibHh1ZlR0Y2JseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQkVaWFJoYVd4V2FXVjNRV04wYVc5dWN6dGNiaUpkZlE9PSIsIi8qanNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBBcHBEaXNwYXRjaGVyID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJyk7XG52YXIgRmlsdGVyQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL0ZpbHRlckNvbnN0YW50cycpO1xuXG52YXIgRmlsdGVyQWN0aW9ucyA9IHtcblxuICB1cGRhdGVGaWx0ZXI6IGZ1bmN0aW9uIHVwZGF0ZUZpbHRlcihrZXksIHZhbHVlKSB7XG4gICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgICBhY3Rpb25UeXBlOiBGaWx0ZXJDb25zdGFudHMuVVBEQVRFX0ZJTFRFUixcbiAgICAgIGtleToga2V5LFxuICAgICAgdmFsdWU6IHZhbHVlXG4gICAgfSk7XG4gIH0sXG5cbiAgdXBkYXRlU2VhcmNoOiBmdW5jdGlvbiB1cGRhdGVTZWFyY2goc2VhcmNoRmlsdGVyKSB7XG4gICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgICBhY3Rpb25UeXBlOiBGaWx0ZXJDb25zdGFudHMuVVBEQVRFX1NFQVJDSCxcbiAgICAgIHNlYXJjaEZpbHRlcjogc2VhcmNoRmlsdGVyXG4gICAgfSk7XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaWx0ZXJBY3Rpb25zO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5bmNtVm5iM0o1WDJadmMzUmxjaTl2Y0dWdWMyOTFjbU5sWDJodmJtVjVjRzkwTDJodmJtVjVjRzkwTDJSbGRpOXpZM0pwY0hSekwyRmpkR2x2Ym5NdlJtbHNkR1Z5UVdOMGFXOXVjeTVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN08wRkJSVUVzU1VGQlRTeGhRVUZoTEVkQlFVY3NUMEZCVHl4RFFVRkRMRFpDUVVFMlFpeERRVUZETEVOQlFVTTdRVUZETjBRc1NVRkJUU3hsUVVGbExFZEJRVWNzVDBGQlR5eERRVUZETERoQ1FVRTRRaXhEUVVGRExFTkJRVU03TzBGQlJXaEZMRWxCUVUwc1lVRkJZU3hIUVVGSE96dEJRVVZ3UWl4alFVRlpMRVZCUVVVc2MwSkJRVk1zUjBGQlJ5eEZRVUZETEV0QlFVc3NSVUZCUlR0QlFVTm9ReXhwUWtGQllTeERRVUZETEZGQlFWRXNRMEZCUXp0QlFVTnlRaXhuUWtGQlZTeEZRVUZGTEdWQlFXVXNRMEZCUXl4aFFVRmhPMEZCUTNwRExGTkJRVWNzUlVGQlJTeEhRVUZITzBGQlExSXNWMEZCU3l4RlFVRkZMRXRCUVVzN1MwRkRZaXhEUVVGRExFTkJRVU03UjBGRFNqczdRVUZGUkN4alFVRlpMRVZCUVVVc2MwSkJRVk1zV1VGQldTeEZRVUZGTzBGQlEyNURMR2xDUVVGaExFTkJRVU1zVVVGQlVTeERRVUZETzBGQlEzSkNMR2RDUVVGVkxFVkJRVVVzWlVGQlpTeERRVUZETEdGQlFXRTdRVUZEZWtNc2EwSkJRVmtzUlVGQlJTeFpRVUZaTzB0QlF6TkNMRU5CUVVNc1EwRkJRenRIUVVOS096dERRVVZHTEVOQlFVTTdPMEZCUlVZc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eGhRVUZoTEVOQlFVTWlMQ0ptYVd4bElqb2lMMVZ6WlhKekwyZHlaV2R2Y25sZlptOXpkR1Z5TDI5d1pXNXpiM1Z5WTJWZmFHOXVaWGx3YjNRdmFHOXVaWGx3YjNRdlpHVjJMM05qY21sd2RITXZZV04wYVc5dWN5OUdhV3gwWlhKQlkzUnBiMjV6TG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lMeXBxYzJocGJuUWdaWE51WlhoME9pQjBjblZsSUNvdlhHNWNibU52Ym5OMElFRndjRVJwYzNCaGRHTm9aWElnUFNCeVpYRjFhWEpsS0NjdUxpOWthWE53WVhSamFHVnlMMEZ3Y0VScGMzQmhkR05vWlhJbktUdGNibU52Ym5OMElFWnBiSFJsY2tOdmJuTjBZVzUwY3lBOUlISmxjWFZwY21Vb0p5NHVMMk52Ym5OMFlXNTBjeTlHYVd4MFpYSkRiMjV6ZEdGdWRITW5LVHRjYmx4dVkyOXVjM1FnUm1sc2RHVnlRV04wYVc5dWN5QTlJSHRjYmx4dUlDQjFjR1JoZEdWR2FXeDBaWEk2SUdaMWJtTjBhVzl1S0d0bGVTeDJZV3gxWlNrZ2UxeHVJQ0FnSUVGd2NFUnBjM0JoZEdOb1pYSXVaR2x6Y0dGMFkyZ29lMXh1SUNBZ0lDQWdZV04wYVc5dVZIbHdaVG9nUm1sc2RHVnlRMjl1YzNSaGJuUnpMbFZRUkVGVVJWOUdTVXhVUlZJc1hHNGdJQ0FnSUNCclpYazZJR3RsZVN4Y2JpQWdJQ0FnSUhaaGJIVmxPaUIyWVd4MVpWeHVJQ0FnSUgwcE8xeHVJQ0I5TEZ4dVhHNGdJSFZ3WkdGMFpWTmxZWEpqYURvZ1puVnVZM1JwYjI0b2MyVmhjbU5vUm1sc2RHVnlLU0I3WEc0Z0lDQWdRWEJ3UkdsemNHRjBZMmhsY2k1a2FYTndZWFJqYUNoN1hHNGdJQ0FnSUNCaFkzUnBiMjVVZVhCbE9pQkdhV3gwWlhKRGIyNXpkR0Z1ZEhNdVZWQkVRVlJGWDFORlFWSkRTQ3hjYmlBZ0lDQWdJSE5sWVhKamFFWnBiSFJsY2pvZ2MyVmhjbU5vUm1sc2RHVnlYRzRnSUNBZ2ZTazdYRzRnSUgwc1hHNWNibjA3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1JtbHNkR1Z5UVdOMGFXOXVjenRjYmlKZGZRPT0iLCIvKmpzaGludCBlc25leHQ6IHRydWUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgU2lkZWJhciA9IHJlcXVpcmUoJy4vdWkvU2lkZWJhci5qc3gnKTtcbnZhciBEZXRhaWxWaWV3ID0gcmVxdWlyZSgnLi91aS9EZXRhaWxWaWV3LmpzeCcpO1xudmFyIERldGFpbFRleHQgPSByZXF1aXJlKCcuL3VpL0RldGFpbFRleHQuanN4Jyk7XG5cblJlYWN0LnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAnZGl2JyxcbiAgbnVsbCxcbiAgUmVhY3QuY3JlYXRlRWxlbWVudChTaWRlYmFyLCBudWxsKSxcbiAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAnZGl2JyxcbiAgICB7IGNsYXNzTmFtZTogJ2RldGFpbENvbHVtbicgfSxcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KERldGFpbFRleHQsIG51bGwpLFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRGV0YWlsVmlldywgbnVsbClcbiAgKVxuKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dyYXAnKSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTluY21WbmIzSjVYMlp2YzNSbGNpOXZjR1Z1YzI5MWNtTmxYMmh2Ym1WNWNHOTBMMmh2Ym1WNWNHOTBMMlJsZGk5elkzSnBjSFJ6TDJGd2NDNXFjM2dpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanM3T3p0QlFVVkJMRWxCUVUwc1QwRkJUeXhIUVVGSExFOUJRVThzUTBGQlF5eHJRa0ZCYTBJc1EwRkJReXhEUVVGRE8wRkJRelZETEVsQlFVMHNWVUZCVlN4SFFVRkhMRTlCUVU4c1EwRkJReXh4UWtGQmNVSXNRMEZCUXl4RFFVRkRPMEZCUTJ4RUxFbEJRVTBzVlVGQlZTeEhRVUZITEU5QlFVOHNRMEZCUXl4eFFrRkJjVUlzUTBGQlF5eERRVUZET3p0QlFVVnNSQ3hMUVVGTExFTkJRVU1zVFVGQlRTeERRVU5XT3pzN1JVRkRSU3h2UWtGQlF5eFBRVUZQTEU5QlFVYzdSVUZEV0RzN1RVRkJTeXhUUVVGVExFVkJRVU1zWTBGQll6dEpRVU16UWl4dlFrRkJReXhWUVVGVkxFOUJRVWM3U1VGRFpDeHZRa0ZCUXl4VlFVRlZMRTlCUVVjN1IwRkRWanREUVVOR0xFVkJRMDRzVVVGQlVTeERRVUZETEdOQlFXTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkRhRU1zUTBGQlF5SXNJbVpwYkdVaU9pSXZWWE5sY25NdlozSmxaMjl5ZVY5bWIzTjBaWEl2YjNCbGJuTnZkWEpqWlY5b2IyNWxlWEJ2ZEM5b2IyNWxlWEJ2ZEM5a1pYWXZjMk55YVhCMGN5OWhjSEF1YW5ONElpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lMeXBxYzJocGJuUWdaWE51WlhoME9pQjBjblZsSUNvdlhHNWNibU52Ym5OMElGTnBaR1ZpWVhJZ1BTQnlaWEYxYVhKbEtDY3VMM1ZwTDFOcFpHVmlZWEl1YW5ONEp5azdYRzVqYjI1emRDQkVaWFJoYVd4V2FXVjNJRDBnY21WeGRXbHlaU2duTGk5MWFTOUVaWFJoYVd4V2FXVjNMbXB6ZUNjcE8xeHVZMjl1YzNRZ1JHVjBZV2xzVkdWNGRDQTlJSEpsY1hWcGNtVW9KeTR2ZFdrdlJHVjBZV2xzVkdWNGRDNXFjM2duS1R0Y2JseHVVbVZoWTNRdWNtVnVaR1Z5S0Z4dUlDQThaR2wyUGx4dUlDQWdJRHhUYVdSbFltRnlJQzgrWEc0Z0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOUoyUmxkR0ZwYkVOdmJIVnRiaWMrWEc0Z0lDQWdJQ0E4UkdWMFlXbHNWR1Y0ZENBdlBseHVJQ0FnSUNBZ1BFUmxkR0ZwYkZacFpYY2dMejVjYmlBZ0lDQThMMlJwZGo1Y2JpQWdQQzlrYVhZK0xGeHVJQ0JrYjJOMWJXVnVkQzVuWlhSRmJHVnRaVzUwUW5sSlpDZ25kM0poY0NjcFhHNHBPMXh1SWwxOSIsIi8qanNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBrZXlNaXJyb3IgPSByZXF1aXJlKCdrZXltaXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBrZXlNaXJyb3Ioe1xuICBVUERBVEVfTUVBU1VSRTogbnVsbCxcbiAgVVBEQVRFX0RBVEE6IG51bGwsXG4gIFVQREFURV9ERVRBSUxfVklFVzogbnVsbCxcbiAgVVBEQVRFX0ZPQ1VTX0RBVEE6IG51bGwsXG4gIFVQREFURV9EQUc6IG51bGxcbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5bmNtVm5iM0o1WDJadmMzUmxjaTl2Y0dWdWMyOTFjbU5sWDJodmJtVjVjRzkwTDJodmJtVjVjRzkwTDJSbGRpOXpZM0pwY0hSekwyTnZibk4wWVc1MGN5OUVaWFJoYVd4V2FXVjNRMjl1YzNSaGJuUnpMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN1FVRkZRU3hKUVVGTkxGTkJRVk1zUjBGQlJ5eFBRVUZQTEVOQlFVTXNWMEZCVnl4RFFVRkRMRU5CUVVNN08wRkJSWFpETEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1UwRkJVeXhEUVVGRE8wRkJRM3BDTEdkQ1FVRmpMRVZCUVVVc1NVRkJTVHRCUVVOd1FpeGhRVUZYTEVWQlFVVXNTVUZCU1R0QlFVTnFRaXh2UWtGQmEwSXNSVUZCUlN4SlFVRkpPMEZCUTNoQ0xHMUNRVUZwUWl4RlFVRkZMRWxCUVVrN1FVRkRka0lzV1VGQlZTeEZRVUZGTEVsQlFVazdRMEZEYWtJc1EwRkJReXhEUVVGRElpd2labWxzWlNJNklpOVZjMlZ5Y3k5bmNtVm5iM0o1WDJadmMzUmxjaTl2Y0dWdWMyOTFjbU5sWDJodmJtVjVjRzkwTDJodmJtVjVjRzkwTDJSbGRpOXpZM0pwY0hSekwyTnZibk4wWVc1MGN5OUVaWFJoYVd4V2FXVjNRMjl1YzNSaGJuUnpMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUx5cHFjMmhwYm5RZ1pYTnVaWGgwT2lCMGNuVmxJQ292WEc1Y2JtTnZibk4wSUd0bGVVMXBjbkp2Y2lBOUlISmxjWFZwY21Vb0oydGxlVzFwY25KdmNpY3BPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUd0bGVVMXBjbkp2Y2loN1hHNGdJRlZRUkVGVVJWOU5SVUZUVlZKRk9pQnVkV3hzTEZ4dUlDQlZVRVJCVkVWZlJFRlVRVG9nYm5Wc2JDeGNiaUFnVlZCRVFWUkZYMFJGVkVGSlRGOVdTVVZYT2lCdWRXeHNMRnh1SUNCVlVFUkJWRVZmUms5RFZWTmZSRUZVUVRvZ2JuVnNiQ3hjYmlBZ1ZWQkVRVlJGWDBSQlJ6b2diblZzYkN4Y2JuMHBPMXh1SWwxOSIsIi8qanNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBrZXlNaXJyb3IgPSByZXF1aXJlKCdrZXltaXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBrZXlNaXJyb3Ioe1xuICBVUERBVEVfRklMVEVSOiBudWxsLFxuICBVUERBVEVfU0VBUkNIOiBudWxsXG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OW5jbVZuYjNKNVgyWnZjM1JsY2k5dmNHVnVjMjkxY21ObFgyaHZibVY1Y0c5MEwyaHZibVY1Y0c5MEwyUmxkaTl6WTNKcGNIUnpMMk52Ym5OMFlXNTBjeTlHYVd4MFpYSkRiMjV6ZEdGdWRITXVhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanM3T3p0QlFVVkJMRWxCUVUwc1UwRkJVeXhIUVVGSExFOUJRVThzUTBGQlF5eFhRVUZYTEVOQlFVTXNRMEZCUXpzN1FVRkZka01zVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4VFFVRlRMRU5CUVVNN1FVRkRla0lzWlVGQllTeEZRVUZGTEVsQlFVazdRVUZEYmtJc1pVRkJZU3hGUVVGRkxFbEJRVWs3UTBGRGNFSXNRMEZCUXl4RFFVRkRJaXdpWm1sc1pTSTZJaTlWYzJWeWN5OW5jbVZuYjNKNVgyWnZjM1JsY2k5dmNHVnVjMjkxY21ObFgyaHZibVY1Y0c5MEwyaHZibVY1Y0c5MEwyUmxkaTl6WTNKcGNIUnpMMk52Ym5OMFlXNTBjeTlHYVd4MFpYSkRiMjV6ZEdGdWRITXVhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdkttcHphR2x1ZENCbGMyNWxlSFE2SUhSeWRXVWdLaTljYmx4dVkyOXVjM1FnYTJWNVRXbHljbTl5SUQwZ2NtVnhkV2x5WlNnbmEyVjViV2x5Y205eUp5azdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnYTJWNVRXbHljbTl5S0h0Y2JpQWdWVkJFUVZSRlgwWkpURlJGVWpvZ2JuVnNiQ3hjYmlBZ1ZWQkVRVlJGWDFORlFWSkRTRG9nYm5Wc2JDeGNibjBwTzF4dUlsMTkiLCIvKmpzaGludCBlc25leHQ6IHRydWUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgRGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2ZsdXgnKS5EaXNwYXRjaGVyO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBEaXNwYXRjaGVyKCk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTluY21WbmIzSjVYMlp2YzNSbGNpOXZjR1Z1YzI5MWNtTmxYMmh2Ym1WNWNHOTBMMmh2Ym1WNWNHOTBMMlJsZGk5elkzSnBjSFJ6TDJScGMzQmhkR05vWlhJdlFYQndSR2x6Y0dGMFkyaGxjaTVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN08wRkJSVUVzU1VGQlRTeFZRVUZWTEVkQlFVY3NUMEZCVHl4RFFVRkRMRTFCUVUwc1EwRkJReXhEUVVGRExGVkJRVlVzUTBGQlF6czdRVUZGT1VNc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eEpRVUZKTEZWQlFWVXNSVUZCUlN4RFFVRkRJaXdpWm1sc1pTSTZJaTlWYzJWeWN5OW5jbVZuYjNKNVgyWnZjM1JsY2k5dmNHVnVjMjkxY21ObFgyaHZibVY1Y0c5MEwyaHZibVY1Y0c5MEwyUmxkaTl6WTNKcGNIUnpMMlJwYzNCaGRHTm9aWEl2UVhCd1JHbHpjR0YwWTJobGNpNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWk4cWFuTm9hVzUwSUdWemJtVjRkRG9nZEhKMVpTQXFMMXh1WEc1amIyNXpkQ0JFYVhOd1lYUmphR1Z5SUQwZ2NtVnhkV2x5WlNnblpteDFlQ2NwTGtScGMzQmhkR05vWlhJN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdibVYzSUVScGMzQmhkR05vWlhJb0tUdGNiaUpkZlE9PSIsIi8vIERldGFpbFZpZXdTdG9yZS5qc1xuLy8gVGhlIGZsdXggZGF0YXN0b3JlIGZvciB0aGUgZW50aXJlIGRldGFpbCB2aWV3XG4vKmpzaGludCBlc25leHQ6IHRydWUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgQXBwRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcicpO1xudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcbnZhciBEZXRhaWxWaWV3Q29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL0RldGFpbFZpZXdDb25zdGFudHMnKTtcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdvYmplY3QuYXNzaWduJyk7XG5cbnZhciBNRUFTVVJFX0NIQU5HRV9FVkVOVCA9ICdtZWFzdXJlX2NoYW5nZSc7XG52YXIgREFUQV9VUERBVEVfRVZFTlQgPSAnZGF0YV91cGRhdGUnO1xudmFyIERFVEFJTFNfVVBEQVRFX0VWRU5UID0gJ2RldGFpbHNfdXBkYXRlJztcbnZhciBGT0NVU19VUERBVEVfRVZFTlQgPSAnZm9jdXNfdXBkYXRlJztcblxudmFyIF9zdG9yZSA9IHtcbiAgbWVhc3VyZTogJ2lvJywgLy8gVGhlIGN1cnJlbnRseSBzZWxlY3RlZCBtZWFzdXJlIGZvciB0aGUgZ3JhcGhcbiAgZGFnOiBudWxsLCAvLyBUaGUgY3VycmVudGx5IHNlbGVjdGVkIERBR1xuICBuYW1lOiAnU2VsZWN0IGEgREFHIG9yIFRhc2snLCAvLyBUaGUgaWQgKG5hbWUpIG9mIHRoZSB0aGluZyBiZWluZyB2aWV3ZWRcbiAgb3duZXI6ICdvd25lcicsIC8vIHRoZSBvd25lciBvZiB0aGUgdGhpbmcgYmVpbmcgdmlld2VkXG4gIGZvY3VzVmFsdWU6IDAsIC8vIFRoZSB2YWx1ZSBvZiB3aGF0ZXZlciBpcyBiZWluZyBtb3VzZWQgb3ZlciBvbiB0aGUgZ3JhcGhcbiAgZm9jdXNEYXRlOiAwLCAvLyBUaGUgZGF0ZSBvZiB0aGUgcG9pbnQgY3VycmVudGx5IG1vdXNlZCBvdmVyIG9uIHRoZSBncmFwaFxuICBkYXRhOiBbXSB9O1xuXG4vLyBGaXJlcyBvZiBhbiBBamF4IGdldCByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgdG8gZ2V0IHZhbHVlcyBhbmQgZGF0ZXMgZm9yIGdyYXBoXG4vLyBUaGUgcm93cyByZXRyaWV2ZWQgZnJvbSB0aGUgc2VydmVyIHdpdGggdmFsdWVzIGFuZCBkYXRlc1xuZnVuY3Rpb24gdXBkYXRlRGF0YSgpIHtcbiAgJC5nZXRKU09OKHdpbmRvdy5sb2NhdGlvbiArICdkYXRhJywge1xuICAgIG1lYXN1cmU6IF9zdG9yZS5tZWFzdXJlLFxuICAgIGRhZzogX3N0b3JlLmRhZyxcbiAgICBpZDogX3N0b3JlLmlkXG4gIH0sIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIGFycmF5ID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIGRhdGEpIHtcbiAgICAgIGFycmF5LnB1c2goeyB2YWx1ZTogZGF0YVtrZXldLnZhbHVlLCBkYXRlOiBuZXcgRGF0ZShkYXRhW2tleV0uZHMpIH0pO1xuICAgIH1cbiAgICBfc3RvcmUuZGF0YSA9IGFycmF5O1xuICAgIF9zdG9yZS51cGRhdGluZyA9IGZhbHNlO1xuICAgIERldGFpbFZpZXdTdG9yZS5lbWl0KERBVEFfVVBEQVRFX0VWRU5UKTtcbiAgfSk7XG59XG5cbi8vIEZpcmVzIG9mIGFuIEFqYXggZ2V0IHJlcXVlc3QgdG8gdGhlIHNlcnZlciB0byBnZXQgbWV0YWRhdGEgb24gY3VycmVudCB0aGluZ1xuZnVuY3Rpb24gdXBkYXRlRGV0YWlscygpIHtcbiAgJC5nZXRKU09OKHdpbmRvdy5sb2NhdGlvbiArICdkZXRhaWxzJywge1xuICAgIGRhZzogX3N0b3JlLmRhZyxcbiAgICBpZDogX3N0b3JlLmlkXG4gIH0sIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgaWYgKGRhdGEubGVuZ3RoID4gMCkge1xuICAgICAgX3N0b3JlLm93bmVyID0gZGF0YVswXS5vd25lcjtcbiAgICB9XG4gICAgRGV0YWlsVmlld1N0b3JlLmVtaXQoREVUQUlMU19VUERBVEVfRVZFTlQpO1xuICB9KTtcbn1cblxudmFyIERldGFpbFZpZXdTdG9yZSA9IGFzc2lnbih7fSwgRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwge1xuXG4gIC8vIExpc3RlbmVyIGZvciB3aGVuIG1vdXNlIG1vdmVzXG4gIGFkZEZvY3VzVXBkYXRlTGlzdGVuZXI6IGZ1bmN0aW9uIGFkZEZvY3VzVXBkYXRlTGlzdGVuZXIoY2IpIHtcbiAgICB0aGlzLm9uKEZPQ1VTX1VQREFURV9FVkVOVCwgY2IpO1xuICB9LFxuXG4gIHJlbW92ZUZvY3VzVXBkYXRlTGlzdGVuZXI6IGZ1bmN0aW9uIHJlbW92ZUZvY3VzVXBkYXRlTGlzdGVuZXIoY2IpIHtcbiAgICB0aGlzLm9uKEZPQ1VTX1VQREFURV9FVkVOVCwgY2IpO1xuICB9LFxuXG4gIC8vIExpc3RlbmVyIGZvciB3aGVuIHRoaW5nIG1ldGFkYXRhIGNoYW5nZXNcbiAgYWRkRGV0YWlsVXBkYXRlTGlzdGVuZXI6IGZ1bmN0aW9uIGFkZERldGFpbFVwZGF0ZUxpc3RlbmVyKGNiKSB7XG4gICAgdGhpcy5vbihERVRBSUxTX1VQREFURV9FVkVOVCwgY2IpO1xuICB9LFxuXG4gIHJlbW92ZURldGFpbFVwZGF0ZUxpc3RlbmVyOiBmdW5jdGlvbiByZW1vdmVEZXRhaWxVcGRhdGVMaXN0ZW5lcihjYikge1xuICAgIHRoaXMub24oREVUQUlMU19VUERBVEVfRVZFTlQsIGNiKTtcbiAgfSxcblxuICAvLyBMaXN0ZW5lciBmb3Igd2hlbiBkYXRhIHZhbHVlcyBhbmQgZGF0ZXMgY2hhbmdlXG4gIGFkZERhdGFVcGRhdGVMaXN0ZW5lcjogZnVuY3Rpb24gYWRkRGF0YVVwZGF0ZUxpc3RlbmVyKGNiKSB7XG4gICAgdGhpcy5vbihEQVRBX1VQREFURV9FVkVOVCwgY2IpO1xuICB9LFxuXG4gIHJlbW92ZURhdGFVcGRhdGVMaXN0ZW5lcjogZnVuY3Rpb24gcmVtb3ZlRGF0YVVwZGF0ZUxpc3RlbmVyKGNiKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcihEQVRBX1VQREFURV9FVkVOVCwgY2IpO1xuICB9LFxuXG4gIC8vIExpc3RlbmVyIGZvciB3aGVuIHVzZXIgc2VsZWN0cyBhIGRpZmZlcmVudCBtZWFzdXJlXG4gIGFkZE1lYXN1cmVDaGFuZ2VMaXN0ZW5lcjogZnVuY3Rpb24gYWRkTWVhc3VyZUNoYW5nZUxpc3RlbmVyKGNiKSB7XG4gICAgdGhpcy5vbihNRUFTVVJFX0NIQU5HRV9FVkVOVCwgY2IpO1xuICB9LFxuXG4gIHJlbW92ZU1lYXN1cmVDaGFuZ2VMaXN0ZW5lcjogZnVuY3Rpb24gcmVtb3ZlTWVhc3VyZUNoYW5nZUxpc3RlbmVyKGNiKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcihNRUFTVVJFX0NIQU5HRV9FVkVOVCwgY2IpO1xuICB9LFxuXG4gIC8vIEdldHRlciBtZXRob2QgZm9yIGRhdGEgdGhhdCBjcmVhdGVzIGZldGNoIGlmIG5lZWQgYmVcbiAgZ2V0RGF0YTogZnVuY3Rpb24gZ2V0RGF0YSgpIHtcbiAgICByZXR1cm4gX3N0b3JlLmRhdGE7XG4gIH0sXG5cbiAgLy8gR2V0dGVyIG1ldGhvZCBmb3IgZGV0YWlscyB0aGF0IGNyZWF0ZXMgZmV0Y2ggaWYgbmVlZCBiZVxuICBnZXREZXRhaWxzOiBmdW5jdGlvbiBnZXREZXRhaWxzKCkge1xuICAgIHZhciBuYW1lID0gX3N0b3JlLmlkO1xuICAgIGlmIChfc3RvcmUuZGFnICE9PSBfc3RvcmUuaWQpIHtcbiAgICAgIG5hbWUgPSBfc3RvcmUuZGFnICsgJy4nICsgX3N0b3JlLmlkO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIG93bmVyOiBfc3RvcmUub3duZXJcbiAgICB9O1xuICB9LFxuXG4gIC8vIEdldHRlciBtZXRob2QgdG8gZ2V0IGN1cnJlbnQgbW91c2VvdmVyIHZhbHVlc1xuICBnZXRGb2N1c0RhdGU6IGZ1bmN0aW9uIGdldEZvY3VzRGF0ZSgpIHtcbiAgICByZXR1cm4gX3N0b3JlLmZvY3VzRGF0ZTtcbiAgfSxcblxuICBnZXRGb2N1c1ZhbHVlOiBmdW5jdGlvbiBnZXRGb2N1c1ZhbHVlKCkge1xuICAgIHJldHVybiBfc3RvcmUuZm9jdXNWYWx1ZTtcbiAgfSxcblxuICAvLyBHZXR0ZXIgbWV0aG9kIHRvIGdldCBjdXJyZW50bHkgc2VsZWN0ZWQgbWVhc3VyZVxuICBnZXRNZWFzdXJlOiBmdW5jdGlvbiBnZXRNZWFzdXJlKCkge1xuICAgIHJldHVybiBfc3RvcmUubWVhc3VyZTtcbiAgfSxcblxuICAvLyBHZXR0ZXIgbWV0aG9kIGZvciB0aGUgZW50aXJlIHN0b3JlXG4gIGdldFN0b3JlOiBmdW5jdGlvbiBnZXRTdG9yZSgpIHtcbiAgICByZXR1cm4gX3N0b3JlO1xuICB9LFxuXG4gIC8vIFNldHMgdGhlIGRhZyBvZiB0aGUgc3RvcmVcbiAgc2V0RGFnOiBmdW5jdGlvbiBzZXREYWcoZGFnKSB7XG4gICAgX3N0b3JlLmRhZyA9IGRhZztcbiAgfVxufSk7XG5cbi8vIFJlZ2lzdGVyIGNhbGxiYWNrIHRvIGhhbmRsZSBhbGwgdXBkYXRlc1xuQXBwRGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbiAoYWN0aW9uKSB7XG4gIHN3aXRjaCAoYWN0aW9uLmFjdGlvblR5cGUpIHtcbiAgICAvLyBUaGUgbWVhc3VyZSBjaGFuZ2VkIGFuZCB3ZSBuZWVkIHRvIGZldGNoIG5ldyBkYXRhXG4gICAgY2FzZSBEZXRhaWxWaWV3Q29uc3RhbnRzLlVQREFURV9NRUFTVVJFOlxuICAgICAgX3N0b3JlLm1lYXN1cmUgPSBhY3Rpb24ubWVhc3VyZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJy8nLCAnJyk7XG4gICAgICBEZXRhaWxWaWV3U3RvcmUuZW1pdChNRUFTVVJFX0NIQU5HRV9FVkVOVCk7XG4gICAgICB1cGRhdGVEYXRhKCk7XG4gICAgICBicmVhaztcbiAgICAvLyBXZSBuZWVkIHRvIGZldGNoIG5ldyBkYXRhXG4gICAgY2FzZSBEZXRhaWxWaWV3Q29uc3RhbnRzLlVQREFURV9EQVRBOlxuICAgICAgdXBkYXRlRGF0YSgpO1xuICAgICAgYnJlYWs7XG4gICAgLy8gV2UgbmVlZCB0byBmZXRjaCBuZXcgZGV0YWlscyBvbiB0aGUgY3VycmVudCBkYWcvdGFza1xuICAgIGNhc2UgRGV0YWlsVmlld0NvbnN0YW50cy5VUERBVEVfREVUQUlMX1ZJRVc6XG4gICAgICBfc3RvcmUuaWQgPSBhY3Rpb24ubmFtZTtcbiAgICAgIHVwZGF0ZURhdGEoKTtcbiAgICAgIHVwZGF0ZURldGFpbHMoKTtcbiAgICAgIGJyZWFrO1xuICAgIC8vIFdlIG5lZWQgdG8gdXBkYXRlIG91ciByZWNvcmQgb2Ygb3VyIGN1cnJlbnQgbW91c2VvdmVyIHBvaW50XG4gICAgY2FzZSBEZXRhaWxWaWV3Q29uc3RhbnRzLlVQREFURV9GT0NVU19EQVRBOlxuICAgICAgX3N0b3JlLmZvY3VzVmFsdWUgPSBhY3Rpb24udmFsdWU7XG4gICAgICBfc3RvcmUuZm9jdXNEYXRlID0gYWN0aW9uLmRhdGU7XG4gICAgICBEZXRhaWxWaWV3U3RvcmUuZW1pdChGT0NVU19VUERBVEVfRVZFTlQpO1xuICAgICAgYnJlYWs7XG4gICAgLy8gV2UgbmVlZCB0byB1cGRhdGUgb3VyIHJlY29yZCBvZiBvdXIgY3VycmVudCBtb3VzZW92ZXIgcG9pbnRcbiAgICBjYXNlIERldGFpbFZpZXdDb25zdGFudHMuVVBEQVRFX0RBRzpcbiAgICAgIF9zdG9yZS5kYWcgPSBhY3Rpb24uZGFnO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAvLyBubyBvcFxuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBEZXRhaWxWaWV3U3RvcmU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTluY21WbmIzSjVYMlp2YzNSbGNpOXZjR1Z1YzI5MWNtTmxYMmh2Ym1WNWNHOTBMMmh2Ym1WNWNHOTBMMlJsZGk5elkzSnBjSFJ6TDNOMGIzSmxjeTlFWlhSaGFXeFdhV1YzVTNSdmNtVXVhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanM3T3pzN08wRkJTVUVzU1VGQlRTeGhRVUZoTEVkQlFVY3NUMEZCVHl4RFFVRkRMRFpDUVVFMlFpeERRVUZETEVOQlFVTTdRVUZETjBRc1NVRkJUU3haUVVGWkxFZEJRVWNzVDBGQlR5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRMRmxCUVZrc1EwRkJRenRCUVVOd1JDeEpRVUZOTEcxQ1FVRnRRaXhIUVVGSExFOUJRVThzUTBGQlF5eHJRMEZCYTBNc1EwRkJReXhEUVVGRE8wRkJRM2hGTEVsQlFVMHNUVUZCVFN4SFFVRkhMRTlCUVU4c1EwRkJReXhsUVVGbExFTkJRVU1zUTBGQlF6czdRVUZGZUVNc1NVRkJUU3h2UWtGQmIwSXNSMEZCUnl4blFrRkJaMElzUTBGQlF6dEJRVU01UXl4SlFVRk5MR2xDUVVGcFFpeEhRVUZITEdGQlFXRXNRMEZCUXp0QlFVTjRReXhKUVVGTkxHOUNRVUZ2UWl4SFFVRkhMR2RDUVVGblFpeERRVUZETzBGQlF6bERMRWxCUVUwc2EwSkJRV3RDTEVkQlFVY3NZMEZCWXl4RFFVRkRPenRCUVVVeFF5eEpRVUZOTEUxQlFVMHNSMEZCUnp0QlFVTmlMRk5CUVU4c1JVRkJSU3hKUVVGSk8wRkJRMklzUzBGQlJ5eEZRVUZGTEVsQlFVazdRVUZEVkN4TlFVRkpMRVZCUVVVc2MwSkJRWE5DTzBGQlF6VkNMRTlCUVVzc1JVRkJSU3hQUVVGUE8wRkJRMlFzV1VGQlZTeEZRVUZGTEVOQlFVTTdRVUZEWWl4WFFVRlRMRVZCUVVVc1EwRkJRenRCUVVOYUxFMUJRVWtzUlVGQlJTeEZRVUZGTEVWQlExUXNRMEZCUXpzN096dEJRVWRHTEZOQlFWTXNWVUZCVlN4SFFVRkhPMEZCUTNCQ0xFZEJRVU1zUTBGQlF5eFBRVUZQTEVOQlExQXNUVUZCVFN4RFFVRkRMRkZCUVZFc1IwRkJSeXhOUVVGTkxFVkJRM2hDTzBGQlEwVXNWMEZCVHl4RlFVRkRMRTFCUVUwc1EwRkJReXhQUVVGUE8wRkJRM1JDTEU5QlFVY3NSVUZCUlN4TlFVRk5MRU5CUVVNc1IwRkJSenRCUVVObUxFMUJRVVVzUlVGQlJTeE5RVUZOTEVOQlFVTXNSVUZCUlR0SFFVTmtMRVZCUTBRc1ZVRkJVeXhKUVVGSkxFVkJRVVU3UVVGRFlpeFJRVUZOTEV0QlFVc3NSMEZCUnl4RlFVRkZMRU5CUVVNN1FVRkRha0lzVTBGQlN5eEpRVUZOTEVkQlFVY3NTVUZCU1N4SlFVRkpMRVZCUVVVN1FVRkRkRUlzVjBGQlN5eERRVUZETEVsQlFVa3NRMEZCUXl4RlFVRkRMRXRCUVVzc1JVRkJReXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTXNTMEZCU3l4RlFVRkZMRWxCUVVrc1JVRkJSU3hKUVVGSkxFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNc1JVRkJSU3hEUVVGRExFRkJRVU1zUlVGQlF5eERRVUZETEVOQlFVTTdTMEZEY0VVN1FVRkRSQ3hWUVVGTkxFTkJRVU1zU1VGQlNTeEhRVUZITEV0QlFVc3NRMEZCUXp0QlFVTndRaXhWUVVGTkxFTkJRVU1zVVVGQlVTeEhRVUZITEV0QlFVc3NRMEZCUXp0QlFVTjRRaXh0UWtGQlpTeERRVUZETEVsQlFVa3NRMEZCUXl4cFFrRkJhVUlzUTBGQlF5eERRVUZETzBkQlEzcERMRU5CUVVNc1EwRkJRenREUVVOT096czdRVUZIUkN4VFFVRlRMR0ZCUVdFc1IwRkJSenRCUVVOMlFpeEhRVUZETEVOQlFVTXNUMEZCVHl4RFFVTlFMRTFCUVUwc1EwRkJReXhSUVVGUkxFZEJRVWNzVTBGQlV5eEZRVU16UWp0QlFVTkZMRTlCUVVjc1JVRkJSU3hOUVVGTkxFTkJRVU1zUjBGQlJ6dEJRVU5tTEUxQlFVVXNSVUZCUlN4TlFVRk5MRU5CUVVNc1JVRkJSVHRIUVVOa0xFVkJRMFFzVlVGQlV5eEpRVUZKTEVWQlFVVTdRVUZEWWl4UlFVRkpMRWxCUVVrc1EwRkJReXhOUVVGTkxFZEJRVWNzUTBGQlF5eEZRVUZGTzBGQlEyNUNMRmxCUVUwc1EwRkJReXhMUVVGTExFZEJRVWNzU1VGQlNTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRXRCUVVzc1EwRkJRenRMUVVNNVFqdEJRVU5FTEcxQ1FVRmxMRU5CUVVNc1NVRkJTU3hEUVVGRExHOUNRVUZ2UWl4RFFVRkRMRU5CUVVNN1IwRkROVU1zUTBGQlF5eERRVUZETzBOQlEwNDdPMEZCUlVRc1NVRkJUU3hsUVVGbExFZEJRVWNzVFVGQlRTeERRVUZETEVWQlFVVXNSVUZCUlN4WlFVRlpMRU5CUVVNc1UwRkJVeXhGUVVGRk96czdRVUZIZWtRc2QwSkJRWE5DTEVWQlFVVXNaME5CUVZNc1JVRkJSU3hGUVVGRE8wRkJRMnhETEZGQlFVa3NRMEZCUXl4RlFVRkZMRU5CUVVNc2EwSkJRV3RDTEVWQlFVVXNSVUZCUlN4RFFVRkRMRU5CUVVNN1IwRkRha003TzBGQlJVUXNNa0pCUVhsQ0xFVkJRVVVzYlVOQlFWTXNSVUZCUlN4RlFVRkRPMEZCUTNKRExGRkJRVWtzUTBGQlF5eEZRVUZGTEVOQlFVTXNhMEpCUVd0Q0xFVkJRVVVzUlVGQlJTeERRVUZETEVOQlFVTTdSMEZEYWtNN096dEJRVWRFTEhsQ1FVRjFRaXhGUVVGRkxHbERRVUZUTEVWQlFVVXNSVUZCUXp0QlFVTnVReXhSUVVGSkxFTkJRVU1zUlVGQlJTeERRVUZETEc5Q1FVRnZRaXhGUVVGRkxFVkJRVVVzUTBGQlF5eERRVUZETzBkQlEyNURPenRCUVVWRUxEUkNRVUV3UWl4RlFVRkZMRzlEUVVGVExFVkJRVVVzUlVGQlF6dEJRVU4wUXl4UlFVRkpMRU5CUVVNc1JVRkJSU3hEUVVGRExHOUNRVUZ2UWl4RlFVRkZMRVZCUVVVc1EwRkJReXhEUVVGRE8wZEJRMjVET3pzN1FVRkhSQ3gxUWtGQmNVSXNSVUZCUlN3clFrRkJVeXhGUVVGRkxFVkJRVU03UVVGRGFrTXNVVUZCU1N4RFFVRkRMRVZCUVVVc1EwRkJReXhwUWtGQmFVSXNSVUZCUlN4RlFVRkZMRU5CUVVNc1EwRkJRenRIUVVOb1F6czdRVUZGUkN3d1FrRkJkMElzUlVGQlJTeHJRMEZCVXl4RlFVRkZMRVZCUVVNN1FVRkRjRU1zVVVGQlNTeERRVUZETEdOQlFXTXNRMEZCUXl4cFFrRkJhVUlzUlVGQlJTeEZRVUZGTEVOQlFVTXNRMEZCUXp0SFFVTTFRenM3TzBGQlIwUXNNRUpCUVhkQ0xFVkJRVVVzYTBOQlFWTXNSVUZCUlN4RlFVRkRPMEZCUTNCRExGRkJRVWtzUTBGQlF5eEZRVUZGTEVOQlFVTXNiMEpCUVc5Q0xFVkJRVVVzUlVGQlJTeERRVUZETEVOQlFVTTdSMEZEYmtNN08wRkJSVVFzTmtKQlFUSkNMRVZCUVVVc2NVTkJRVk1zUlVGQlJTeEZRVUZETzBGQlEzWkRMRkZCUVVrc1EwRkJReXhqUVVGakxFTkJRVU1zYjBKQlFXOUNMRVZCUVVVc1JVRkJSU3hEUVVGRExFTkJRVU03UjBGREwwTTdPenRCUVVkRUxGTkJRVThzUlVGQlJTeHRRa0ZCVlR0QlFVTnFRaXhYUVVGUExFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTTdSMEZEY0VJN096dEJRVWRFTEZsQlFWVXNSVUZCUlN4elFrRkJWVHRCUVVOd1FpeFJRVUZKTEVsQlFVa3NSMEZCUnl4TlFVRk5MRU5CUVVNc1JVRkJSU3hEUVVGRE8wRkJRM0pDTEZGQlFVa3NUVUZCVFN4RFFVRkRMRWRCUVVjc1MwRkJTeXhOUVVGTkxFTkJRVU1zUlVGQlJTeEZRVUZGTzBGQlF6VkNMRlZCUVVrc1IwRkJSeXhOUVVGTkxFTkJRVU1zUjBGQlJ5eEhRVUZITEVkQlFVY3NSMEZCUnl4TlFVRk5MRU5CUVVNc1JVRkJSU3hEUVVGRE8wdEJRM0pETzBGQlEwUXNWMEZCVHp0QlFVTk1MRlZCUVVrc1JVRkJSU3hKUVVGSk8wRkJRMVlzVjBGQlN5eEZRVUZGTEUxQlFVMHNRMEZCUXl4TFFVRkxPMHRCUTNCQ0xFTkJRVU03UjBGRFNEczdPMEZCUjBRc1kwRkJXU3hGUVVGRkxIZENRVUZWTzBGQlEzUkNMRmRCUVU4c1RVRkJUU3hEUVVGRExGTkJRVk1zUTBGQlF6dEhRVU42UWpzN1FVRkZSQ3hsUVVGaExFVkJRVVVzZVVKQlFWVTdRVUZEZGtJc1YwRkJUeXhOUVVGTkxFTkJRVU1zVlVGQlZTeERRVUZETzBkQlF6RkNPenM3UVVGSFJDeFpRVUZWTEVWQlFVVXNjMEpCUVZVN1FVRkRjRUlzVjBGQlR5eE5RVUZOTEVOQlFVTXNUMEZCVHl4RFFVRkRPMGRCUTNaQ096czdRVUZIUkN4VlFVRlJMRVZCUVVVc2IwSkJRVlU3UVVGRGJFSXNWMEZCVHl4TlFVRk5MRU5CUVVNN1IwRkRaanM3TzBGQlIwUXNVVUZCVFN4RlFVRkZMR2RDUVVGVExFZEJRVWNzUlVGQlF6dEJRVU51UWl4VlFVRk5MRU5CUVVNc1IwRkJSeXhIUVVGSExFZEJRVWNzUTBGQlF6dEhRVU5zUWp0RFFVTkdMRU5CUVVNc1EwRkJRenM3TzBGQlNVZ3NZVUZCWVN4RFFVRkRMRkZCUVZFc1EwRkJReXhWUVVGVExFMUJRVTBzUlVGQlJUdEJRVU4wUXl4VlFVRlBMRTFCUVUwc1EwRkJReXhWUVVGVk96dEJRVVYwUWl4VFFVRkxMRzFDUVVGdFFpeERRVUZETEdOQlFXTTdRVUZEY2tNc1dVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eE5RVUZOTEVOQlFVTXNUMEZCVHl4RFFVRkRMRmRCUVZjc1JVRkJSU3hEUVVGRExFOUJRVThzUTBGQlF5eEhRVUZITEVWQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNN1FVRkRPVVFzY1VKQlFXVXNRMEZCUXl4SlFVRkpMRU5CUVVNc2IwSkJRVzlDTEVOQlFVTXNRMEZCUXp0QlFVTXpReXhuUWtGQlZTeEZRVUZGTEVOQlFVTTdRVUZEWWl4WlFVRk5PMEZCUVVFN1FVRkZVaXhUUVVGTExHMUNRVUZ0UWl4RFFVRkRMRmRCUVZjN1FVRkRiRU1zWjBKQlFWVXNSVUZCUlN4RFFVRkRPMEZCUTJJc1dVRkJUVHRCUVVGQk8wRkJSVklzVTBGQlN5eHRRa0ZCYlVJc1EwRkJReXhyUWtGQmEwSTdRVUZEZWtNc1dVRkJUU3hEUVVGRExFVkJRVVVzUjBGQlJ5eE5RVUZOTEVOQlFVTXNTVUZCU1N4RFFVRkRPMEZCUTNoQ0xHZENRVUZWTEVWQlFVVXNRMEZCUXp0QlFVTmlMRzFDUVVGaExFVkJRVVVzUTBGQlF6dEJRVU5vUWl4WlFVRk5PMEZCUVVFN1FVRkZVaXhUUVVGTExHMUNRVUZ0UWl4RFFVRkRMR2xDUVVGcFFqdEJRVU40UXl4WlFVRk5MRU5CUVVNc1ZVRkJWU3hIUVVGSExFMUJRVTBzUTBGQlF5eExRVUZMTEVOQlFVTTdRVUZEYWtNc1dVRkJUU3hEUVVGRExGTkJRVk1zUjBGQlJ5eE5RVUZOTEVOQlFVTXNTVUZCU1N4RFFVRkRPMEZCUXk5Q0xIRkNRVUZsTEVOQlFVTXNTVUZCU1N4RFFVRkRMR3RDUVVGclFpeERRVUZETEVOQlFVTTdRVUZEZWtNc1dVRkJUVHRCUVVGQk8wRkJSVklzVTBGQlN5eHRRa0ZCYlVJc1EwRkJReXhWUVVGVk8wRkJRMnBETEZsQlFVMHNRMEZCUXl4SFFVRkhMRWRCUVVjc1RVRkJUU3hEUVVGRExFZEJRVWNzUTBGQlF6dEJRVU40UWl4WlFVRk5PMEZCUVVFc1FVRkRVaXhaUVVGUk96dEhRVVZVTzBOQlEwWXNRMEZCUXl4RFFVRkRPenRCUVVWSUxFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NaVUZCWlN4RFFVRkRJaXdpWm1sc1pTSTZJaTlWYzJWeWN5OW5jbVZuYjNKNVgyWnZjM1JsY2k5dmNHVnVjMjkxY21ObFgyaHZibVY1Y0c5MEwyaHZibVY1Y0c5MEwyUmxkaTl6WTNKcGNIUnpMM04wYjNKbGN5OUVaWFJoYVd4V2FXVjNVM1J2Y21VdWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2THlCRVpYUmhhV3hXYVdWM1UzUnZjbVV1YW5OY2JpOHZJRlJvWlNCbWJIVjRJR1JoZEdGemRHOXlaU0JtYjNJZ2RHaGxJR1Z1ZEdseVpTQmtaWFJoYVd3Z2RtbGxkMXh1THlwcWMyaHBiblFnWlhOdVpYaDBPaUIwY25WbElDb3ZYRzVjYm1OdmJuTjBJRUZ3Y0VScGMzQmhkR05vWlhJZ1BTQnlaWEYxYVhKbEtDY3VMaTlrYVhOd1lYUmphR1Z5TDBGd2NFUnBjM0JoZEdOb1pYSW5LVHRjYm1OdmJuTjBJRVYyWlc1MFJXMXBkSFJsY2lBOUlISmxjWFZwY21Vb0oyVjJaVzUwY3ljcExrVjJaVzUwUlcxcGRIUmxjanRjYm1OdmJuTjBJRVJsZEdGcGJGWnBaWGREYjI1emRHRnVkSE1nUFNCeVpYRjFhWEpsS0NjdUxpOWpiMjV6ZEdGdWRITXZSR1YwWVdsc1ZtbGxkME52Ym5OMFlXNTBjeWNwTzF4dVkyOXVjM1FnWVhOemFXZHVJRDBnY21WeGRXbHlaU2duYjJKcVpXTjBMbUZ6YzJsbmJpY3BPMXh1WEc1amIyNXpkQ0JOUlVGVFZWSkZYME5JUVU1SFJWOUZWa1ZPVkNBOUlDZHRaV0Z6ZFhKbFgyTm9ZVzVuWlNjN1hHNWpiMjV6ZENCRVFWUkJYMVZRUkVGVVJWOUZWa1ZPVkNBOUlDZGtZWFJoWDNWd1pHRjBaU2M3WEc1amIyNXpkQ0JFUlZSQlNVeFRYMVZRUkVGVVJWOUZWa1ZPVkNBOUlDZGtaWFJoYVd4elgzVndaR0YwWlNjN1hHNWpiMjV6ZENCR1QwTlZVMTlWVUVSQlZFVmZSVlpGVGxRZ1BTQW5abTlqZFhOZmRYQmtZWFJsSnp0Y2JseHVZMjl1YzNRZ1gzTjBiM0psSUQwZ2UxeHVJQ0J0WldGemRYSmxPaUFuYVc4bkxDQXZMeUJVYUdVZ1kzVnljbVZ1ZEd4NUlITmxiR1ZqZEdWa0lHMWxZWE4xY21VZ1ptOXlJSFJvWlNCbmNtRndhRnh1SUNCa1lXYzZJRzUxYkd3c0lDOHZJRlJvWlNCamRYSnlaVzUwYkhrZ2MyVnNaV04wWldRZ1JFRkhYRzRnSUc1aGJXVTZJQ2RUWld4bFkzUWdZU0JFUVVjZ2IzSWdWR0Z6YXljc0lDOHZJRlJvWlNCcFpDQW9ibUZ0WlNrZ2IyWWdkR2hsSUhSb2FXNW5JR0psYVc1bklIWnBaWGRsWkZ4dUlDQnZkMjVsY2pvZ0oyOTNibVZ5Snl3Z0x5OGdkR2hsSUc5M2JtVnlJRzltSUhSb1pTQjBhR2x1WnlCaVpXbHVaeUIyYVdWM1pXUmNiaUFnWm05amRYTldZV3gxWlRvZ01Dd2dMeThnVkdobElIWmhiSFZsSUc5bUlIZG9ZWFJsZG1WeUlHbHpJR0psYVc1bklHMXZkWE5sWkNCdmRtVnlJRzl1SUhSb1pTQm5jbUZ3YUZ4dUlDQm1iMk4xYzBSaGRHVTZJREFzSUM4dklGUm9aU0JrWVhSbElHOW1JSFJvWlNCd2IybHVkQ0JqZFhKeVpXNTBiSGtnYlc5MWMyVmtJRzkyWlhJZ2IyNGdkR2hsSUdkeVlYQm9YRzRnSUdSaGRHRTZJRnRkTENBdkx5QlVhR1VnY205M2N5QnlaWFJ5YVdWMlpXUWdabkp2YlNCMGFHVWdjMlZ5ZG1WeUlIZHBkR2dnZG1Gc2RXVnpJR0Z1WkNCa1lYUmxjMXh1ZlR0Y2JseHVMeThnUm1seVpYTWdiMllnWVc0Z1FXcGhlQ0JuWlhRZ2NtVnhkV1Z6ZENCMGJ5QjBhR1VnYzJWeWRtVnlJSFJ2SUdkbGRDQjJZV3gxWlhNZ1lXNWtJR1JoZEdWeklHWnZjaUJuY21Gd2FGeHVablZ1WTNScGIyNGdkWEJrWVhSbFJHRjBZU2dwSUh0Y2JpQWdKQzVuWlhSS1UwOU9LRnh1SUNBZ0lIZHBibVJ2ZHk1c2IyTmhkR2x2YmlBcklDZGtZWFJoSnl4Y2JpQWdJQ0I3WEc0Z0lDQWdJQ0J0WldGemRYSmxPbDl6ZEc5eVpTNXRaV0Z6ZFhKbExGeHVJQ0FnSUNBZ1pHRm5PaUJmYzNSdmNtVXVaR0ZuTEZ4dUlDQWdJQ0FnYVdRNklGOXpkRzl5WlM1cFpGeHVJQ0FnSUgwc1hHNGdJQ0FnWm5WdVkzUnBiMjRvWkdGMFlTa2dlMXh1SUNBZ0lDQWdZMjl1YzNRZ1lYSnlZWGtnUFNCYlhUdGNiaUFnSUNBZ0lHWnZjaUFvWTI5dWMzUWdhMlY1SUdsdUlHUmhkR0VwSUh0Y2JpQWdJQ0FnSUNBZ1lYSnlZWGt1Y0hWemFDaDdkbUZzZFdVNlpHRjBZVnRyWlhsZExuWmhiSFZsTENCa1lYUmxPaWh1WlhjZ1JHRjBaU2hrWVhSaFcydGxlVjB1WkhNcEtYMHBPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lDQWdYM04wYjNKbExtUmhkR0VnUFNCaGNuSmhlVHRjYmlBZ0lDQWdJRjl6ZEc5eVpTNTFjR1JoZEdsdVp5QTlJR1poYkhObE8xeHVJQ0FnSUNBZ1JHVjBZV2xzVm1sbGQxTjBiM0psTG1WdGFYUW9SRUZVUVY5VlVFUkJWRVZmUlZaRlRsUXBPMXh1SUNBZ0lIMHBPMXh1ZlNCY2JseHVMeThnUm1seVpYTWdiMllnWVc0Z1FXcGhlQ0JuWlhRZ2NtVnhkV1Z6ZENCMGJ5QjBhR1VnYzJWeWRtVnlJSFJ2SUdkbGRDQnRaWFJoWkdGMFlTQnZiaUJqZFhKeVpXNTBJSFJvYVc1blhHNW1kVzVqZEdsdmJpQjFjR1JoZEdWRVpYUmhhV3h6S0NrZ2UxeHVJQ0FrTG1kbGRFcFRUMDRvWEc0Z0lDQWdkMmx1Wkc5M0xteHZZMkYwYVc5dUlDc2dKMlJsZEdGcGJITW5MRnh1SUNBZ0lIdGNiaUFnSUNBZ0lHUmhaem9nWDNOMGIzSmxMbVJoWnl4Y2JpQWdJQ0FnSUdsa09pQmZjM1J2Y21VdWFXUXNYRzRnSUNBZ2ZTeGNiaUFnSUNCbWRXNWpkR2x2Ymloa1lYUmhLU0I3WEc0Z0lDQWdJQ0JwWmlBb1pHRjBZUzVzWlc1bmRHZ2dQaUF3S1NCN1hHNGdJQ0FnSUNBZ0lGOXpkRzl5WlM1dmQyNWxjaUE5SUdSaGRHRmJNRjB1YjNkdVpYSTdYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQkVaWFJoYVd4V2FXVjNVM1J2Y21VdVpXMXBkQ2hFUlZSQlNVeFRYMVZRUkVGVVJWOUZWa1ZPVkNrN1hHNGdJQ0FnZlNrN1hHNTlJRnh1WEc1amIyNXpkQ0JFWlhSaGFXeFdhV1YzVTNSdmNtVWdQU0JoYzNOcFoyNG9lMzBzSUVWMlpXNTBSVzFwZEhSbGNpNXdjbTkwYjNSNWNHVXNJSHRjYmx4dUlDQXZMeUJNYVhOMFpXNWxjaUJtYjNJZ2QyaGxiaUJ0YjNWelpTQnRiM1psYzF4dUlDQmhaR1JHYjJOMWMxVndaR0YwWlV4cGMzUmxibVZ5T2lCbWRXNWpkR2x2YmloallpbDdYRzRnSUNBZ2RHaHBjeTV2YmloR1QwTlZVMTlWVUVSQlZFVmZSVlpGVGxRc0lHTmlLVHRjYmlBZ2ZTeGNibHh1SUNCeVpXMXZkbVZHYjJOMWMxVndaR0YwWlV4cGMzUmxibVZ5T2lCbWRXNWpkR2x2YmloallpbDdYRzRnSUNBZ2RHaHBjeTV2YmloR1QwTlZVMTlWVUVSQlZFVmZSVlpGVGxRc0lHTmlLVHRjYmlBZ2ZTeGNibHh1SUNBdkx5Qk1hWE4wWlc1bGNpQm1iM0lnZDJobGJpQjBhR2x1WnlCdFpYUmhaR0YwWVNCamFHRnVaMlZ6WEc0Z0lHRmtaRVJsZEdGcGJGVndaR0YwWlV4cGMzUmxibVZ5T2lCbWRXNWpkR2x2YmloallpbDdYRzRnSUNBZ2RHaHBjeTV2YmloRVJWUkJTVXhUWDFWUVJFRlVSVjlGVmtWT1ZDd2dZMklwTzF4dUlDQjlMRnh1WEc0Z0lISmxiVzkyWlVSbGRHRnBiRlZ3WkdGMFpVeHBjM1JsYm1WeU9pQm1kVzVqZEdsdmJpaGpZaWw3WEc0Z0lDQWdkR2hwY3k1dmJpaEVSVlJCU1V4VFgxVlFSRUZVUlY5RlZrVk9WQ3dnWTJJcE8xeHVJQ0I5TEZ4dVhHNGdJQzh2SUV4cGMzUmxibVZ5SUdadmNpQjNhR1Z1SUdSaGRHRWdkbUZzZFdWeklHRnVaQ0JrWVhSbGN5QmphR0Z1WjJWY2JpQWdZV1JrUkdGMFlWVndaR0YwWlV4cGMzUmxibVZ5T2lCbWRXNWpkR2x2YmloallpbDdYRzRnSUNBZ2RHaHBjeTV2YmloRVFWUkJYMVZRUkVGVVJWOUZWa1ZPVkN3Z1kySXBPMXh1SUNCOUxGeHVYRzRnSUhKbGJXOTJaVVJoZEdGVmNHUmhkR1ZNYVhOMFpXNWxjam9nWm5WdVkzUnBiMjRvWTJJcGUxeHVJQ0FnSUhSb2FYTXVjbVZ0YjNabFRHbHpkR1Z1WlhJb1JFRlVRVjlWVUVSQlZFVmZSVlpGVGxRc0lHTmlLVHRjYmlBZ2ZTeGNibHh1SUNBdkx5Qk1hWE4wWlc1bGNpQm1iM0lnZDJobGJpQjFjMlZ5SUhObGJHVmpkSE1nWVNCa2FXWm1aWEpsYm5RZ2JXVmhjM1Z5WlZ4dUlDQmhaR1JOWldGemRYSmxRMmhoYm1kbFRHbHpkR1Z1WlhJNklHWjFibU4wYVc5dUtHTmlLWHRjYmlBZ0lDQjBhR2x6TG05dUtFMUZRVk5WVWtWZlEwaEJUa2RGWDBWV1JVNVVMQ0JqWWlrN1hHNGdJSDBzWEc1Y2JpQWdjbVZ0YjNabFRXVmhjM1Z5WlVOb1lXNW5aVXhwYzNSbGJtVnlPaUJtZFc1amRHbHZiaWhqWWlsN1hHNGdJQ0FnZEdocGN5NXlaVzF2ZG1WTWFYTjBaVzVsY2loTlJVRlRWVkpGWDBOSVFVNUhSVjlGVmtWT1ZDd2dZMklwTzF4dUlDQjlMRnh1WEc0Z0lDOHZJRWRsZEhSbGNpQnRaWFJvYjJRZ1ptOXlJR1JoZEdFZ2RHaGhkQ0JqY21WaGRHVnpJR1psZEdOb0lHbG1JRzVsWldRZ1ltVmNiaUFnWjJWMFJHRjBZVG9nWm5WdVkzUnBiMjRvS1h0Y2JpQWdJQ0J5WlhSMWNtNGdYM04wYjNKbExtUmhkR0U3WEc0Z0lIMHNYRzVjYmlBZ0x5OGdSMlYwZEdWeUlHMWxkR2h2WkNCbWIzSWdaR1YwWVdsc2N5QjBhR0YwSUdOeVpXRjBaWE1nWm1WMFkyZ2dhV1lnYm1WbFpDQmlaVnh1SUNCblpYUkVaWFJoYVd4ek9pQm1kVzVqZEdsdmJpZ3BlMXh1SUNBZ0lHeGxkQ0J1WVcxbElEMGdYM04wYjNKbExtbGtPMXh1SUNBZ0lHbG1JQ2hmYzNSdmNtVXVaR0ZuSUNFOVBTQmZjM1J2Y21VdWFXUXBJSHRjYmlBZ0lDQWdJRzVoYldVZ1BTQmZjM1J2Y21VdVpHRm5JQ3NnSnk0bklDc2dYM04wYjNKbExtbGtPMXh1SUNBZ0lIMWNiaUFnSUNCeVpYUjFjbTRnZTF4dUlDQWdJQ0FnYm1GdFpUb2dibUZ0WlN4Y2JpQWdJQ0FnSUc5M2JtVnlPaUJmYzNSdmNtVXViM2R1WlhKY2JpQWdJQ0I5TzF4dUlDQjlMRnh1SUNCY2JpQWdMeThnUjJWMGRHVnlJRzFsZEdodlpDQjBieUJuWlhRZ1kzVnljbVZ1ZENCdGIzVnpaVzkyWlhJZ2RtRnNkV1Z6WEc0Z0lHZGxkRVp2WTNWelJHRjBaVG9nWm5WdVkzUnBiMjRvS1h0Y2JpQWdJQ0J5WlhSMWNtNGdYM04wYjNKbExtWnZZM1Z6UkdGMFpUdGNiaUFnZlN4Y2JseHVJQ0JuWlhSR2IyTjFjMVpoYkhWbE9pQm1kVzVqZEdsdmJpZ3BlMXh1SUNBZ0lISmxkSFZ5YmlCZmMzUnZjbVV1Wm05amRYTldZV3gxWlR0Y2JpQWdmU3hjYmx4dUlDQXZMeUJIWlhSMFpYSWdiV1YwYUc5a0lIUnZJR2RsZENCamRYSnlaVzUwYkhrZ2MyVnNaV04wWldRZ2JXVmhjM1Z5WlZ4dUlDQm5aWFJOWldGemRYSmxPaUJtZFc1amRHbHZiaWdwZTF4dUlDQWdJSEpsZEhWeWJpQmZjM1J2Y21VdWJXVmhjM1Z5WlR0Y2JpQWdmU3hjYmx4dUlDQXZMeUJIWlhSMFpYSWdiV1YwYUc5a0lHWnZjaUIwYUdVZ1pXNTBhWEpsSUhOMGIzSmxYRzRnSUdkbGRGTjBiM0psT2lCbWRXNWpkR2x2YmlncGUxeHVJQ0FnSUhKbGRIVnliaUJmYzNSdmNtVTdYRzRnSUgwc1hHNWNiaUFnTHk4Z1UyVjBjeUIwYUdVZ1pHRm5JRzltSUhSb1pTQnpkRzl5WlZ4dUlDQnpaWFJFWVdjNklHWjFibU4wYVc5dUtHUmhaeWw3WEc0Z0lDQWdYM04wYjNKbExtUmhaeUE5SUdSaFp6dGNiaUFnZlN4Y2JuMHBPMXh1WEc1Y2JpOHZJRkpsWjJsemRHVnlJR05oYkd4aVlXTnJJSFJ2SUdoaGJtUnNaU0JoYkd3Z2RYQmtZWFJsYzF4dVFYQndSR2x6Y0dGMFkyaGxjaTV5WldkcGMzUmxjaWhtZFc1amRHbHZiaWhoWTNScGIyNHBJSHRjYmlBZ2MzZHBkR05vS0dGamRHbHZiaTVoWTNScGIyNVVlWEJsS1NCN1hHNGdJQ0FnTHk4Z1ZHaGxJRzFsWVhOMWNtVWdZMmhoYm1kbFpDQmhibVFnZDJVZ2JtVmxaQ0IwYnlCbVpYUmphQ0J1WlhjZ1pHRjBZVnh1SUNBZ0lHTmhjMlVnUkdWMFlXbHNWbWxsZDBOdmJuTjBZVzUwY3k1VlVFUkJWRVZmVFVWQlUxVlNSVHBjYmlBZ0lDQWdJRjl6ZEc5eVpTNXRaV0Z6ZFhKbElEMGdZV04wYVc5dUxtMWxZWE4xY21VdWRHOU1iM2RsY2tOaGMyVW9LUzV5WlhCc1lXTmxLQ2N2Snl3bkp5azdYRzRnSUNBZ0lDQkVaWFJoYVd4V2FXVjNVM1J2Y21VdVpXMXBkQ2hOUlVGVFZWSkZYME5JUVU1SFJWOUZWa1ZPVkNrN1hHNGdJQ0FnSUNCMWNHUmhkR1ZFWVhSaEtDazdYRzRnSUNBZ0lDQmljbVZoYXp0Y2JpQWdJQ0F2THlCWFpTQnVaV1ZrSUhSdklHWmxkR05vSUc1bGR5QmtZWFJoWEc0Z0lDQWdZMkZ6WlNCRVpYUmhhV3hXYVdWM1EyOXVjM1JoYm5SekxsVlFSRUZVUlY5RVFWUkJPbHh1SUNBZ0lDQWdkWEJrWVhSbFJHRjBZU2dwTzF4dUlDQWdJQ0FnWW5KbFlXczdYRzRnSUNBZ0x5OGdWMlVnYm1WbFpDQjBieUJtWlhSamFDQnVaWGNnWkdWMFlXbHNjeUJ2YmlCMGFHVWdZM1Z5Y21WdWRDQmtZV2N2ZEdGemExeHVJQ0FnSUdOaGMyVWdSR1YwWVdsc1ZtbGxkME52Ym5OMFlXNTBjeTVWVUVSQlZFVmZSRVZVUVVsTVgxWkpSVmM2WEc0Z0lDQWdJQ0JmYzNSdmNtVXVhV1FnUFNCaFkzUnBiMjR1Ym1GdFpUdGNiaUFnSUNBZ0lIVndaR0YwWlVSaGRHRW9LVHRjYmlBZ0lDQWdJSFZ3WkdGMFpVUmxkR0ZwYkhNb0tUdGNiaUFnSUNBZ0lHSnlaV0ZyTzF4dUlDQWdJQzh2SUZkbElHNWxaV1FnZEc4Z2RYQmtZWFJsSUc5MWNpQnlaV052Y21RZ2IyWWdiM1Z5SUdOMWNuSmxiblFnYlc5MWMyVnZkbVZ5SUhCdmFXNTBYRzRnSUNBZ1kyRnpaU0JFWlhSaGFXeFdhV1YzUTI5dWMzUmhiblJ6TGxWUVJFRlVSVjlHVDBOVlUxOUVRVlJCT2x4dUlDQWdJQ0FnWDNOMGIzSmxMbVp2WTNWelZtRnNkV1VnUFNCaFkzUnBiMjR1ZG1Gc2RXVTdYRzRnSUNBZ0lDQmZjM1J2Y21VdVptOWpkWE5FWVhSbElEMGdZV04wYVc5dUxtUmhkR1U3WEc0Z0lDQWdJQ0JFWlhSaGFXeFdhV1YzVTNSdmNtVXVaVzFwZENoR1QwTlZVMTlWVUVSQlZFVmZSVlpGVGxRcE8xeHVJQ0FnSUNBZ1luSmxZV3M3WEc0Z0lDQWdMeThnVjJVZ2JtVmxaQ0IwYnlCMWNHUmhkR1VnYjNWeUlISmxZMjl5WkNCdlppQnZkWElnWTNWeWNtVnVkQ0J0YjNWelpXOTJaWElnY0c5cGJuUmNiaUFnSUNCallYTmxJRVJsZEdGcGJGWnBaWGREYjI1emRHRnVkSE11VlZCRVFWUkZYMFJCUnpwY2JpQWdJQ0FnSUY5emRHOXlaUzVrWVdjZ1BTQmhZM1JwYjI0dVpHRm5PMXh1SUNBZ0lDQWdZbkpsWVdzN1hHNGdJQ0FnWkdWbVlYVnNkRHBjYmlBZ0lDQWdJQzh2SUc1dklHOXdYRzRnSUgxY2JuMHBPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUVSbGRHRnBiRlpwWlhkVGRHOXlaVHRjYmlKZGZRPT0iLCIvLyBGaWx0ZXJTdG9yZS5qc1xuLy8gVGhlIGZsdXggZGF0YXN0b3JlIGZvciB0aGUgbGVmdCBzaWRlYmFyXG4vKmpzaGludCBlc25leHQ6IHRydWUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgQXBwRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcicpO1xudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcbnZhciBGaWx0ZXJDb25zdGFudHMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvRmlsdGVyQ29uc3RhbnRzJyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LmFzc2lnbicpO1xudmFyIERldGFpbFZpZXdTdG9yZSA9IHJlcXVpcmUoJy4vRGV0YWlsVmlld1N0b3JlJyk7XG5cbnZhciBGSUxURVJfQ0hBTkdFX0VWRU5UID0gJ2ZpbHRlcl9jaGFuZ2UnO1xudmFyIERBR19TRVRfRVZFTlQgPSAnZGFnX2Nob3Nlbic7XG5cbnZhciBfc3RvcmUgPSB7XG4gIHJlc3VsdHM6IG51bGwsIC8vIFRoZSBjdXJyZW50IGRhZ3MvdGFza3MgbGlzdGVkIG9uIHRoZSBzaWRlYmFyIHcvIHZhbHVlc1xuICBtZWFzdXJlOiAnaW8nLCAvLyBUaGUgY3VycmVudCBmaWx0ZXIgbWVhc3VyZVxuICB0aW1lOiAnd2VlaycsIC8vIFRoZSBjdXJyZW50IGZpbHRlciB0aW1lIHJhbmdlXG4gIGRhZzogbnVsbCwgLy8gVGhlIGN1cnJlbnRseSBzZWxlY3RlZCB0YXNrIG9yIGRhZ1xuICBjaGFuZ2U6ICdwZXJjZW50JywgLy8gV2hldGhlciB0aGUgZmlsdGVyIHNob3dzIGFic29sdXRlIG9yIHJlbGF0aXZlIGNoYW5nZVxuICBzZWFyY2hGaWx0ZXI6ICcnIH07XG5cbi8vIEZpcmVzIG9mIGFuIEFqYXggZ2V0IHJlcXVlc3QgdG8gdGhlIHNlcnZlciB0byBnZXQgZGFncy90YXNrcyBmb3Igc2lkZWJhclxuLy8gVGhlIGNvbnRlbnRzIG9mIHRoZSBzZWFyY2ggYmFyIHRoYXQgZmlsdGVycyByZXN1bHRzXG5mdW5jdGlvbiB1cGRhdGVSZXN1bHRzKCkge1xuICAkLmdldEpTT04od2luZG93LmxvY2F0aW9uICsgJ2ZpbHRlcicsIHtcbiAgICBtZWFzdXJlOiBfc3RvcmUubWVhc3VyZSxcbiAgICB0aW1lOiBfc3RvcmUudGltZSxcbiAgICBkYWc6IF9zdG9yZS5kYWdcbiAgfSwgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAvLyBjb252ZXJ0IGRpY3QgdG8gYXJyYXlcbiAgICB2YXIgYXJyYXkgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gZGF0YSkge1xuICAgICAgYXJyYXkucHVzaChkYXRhW2tleV0pO1xuICAgIH1cbiAgICBfc3RvcmUucmVzdWx0cyA9IGFycmF5O1xuICAgIF9zdG9yZS51cGRhdGluZyA9IGZhbHNlO1xuICAgIEZpbHRlclN0b3JlLmVtaXQoRklMVEVSX0NIQU5HRV9FVkVOVCk7XG4gIH0pO1xufVxuXG52YXIgRmlsdGVyU3RvcmUgPSBhc3NpZ24oe30sIEV2ZW50RW1pdHRlci5wcm90b3R5cGUsIHtcbiAgLy8gTGlzdGVuZXIgZm9yIHdoZW4gcmFkaW8gYnV0dG9uIGNoYW5nZXMgYW5kIHJlc3VsdHMgbmVlZCB0byB1cGRhdGVcbiAgYWRkRmlsdGVyUmVzdWx0c0NoYW5nZUxpc3RlbmVyOiBmdW5jdGlvbiBhZGRGaWx0ZXJSZXN1bHRzQ2hhbmdlTGlzdGVuZXIoY2IpIHtcbiAgICB0aGlzLm9uKEZJTFRFUl9DSEFOR0VfRVZFTlQsIGNiKTtcbiAgfSxcbiAgcmVtb3ZlRmlsdGVyUmVzdWx0c0NoYW5nZUxpc3RlbmVyOiBmdW5jdGlvbiByZW1vdmVGaWx0ZXJSZXN1bHRzQ2hhbmdlTGlzdGVuZXIoY2IpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKEZJTFRFUl9DSEFOR0VfRVZFTlQsIGNiKTtcbiAgfSxcbiAgLy8gTGlzdGVuZXIgZm9yIHdoZW4gZGFnIGlzIHNldCBhbmQgYnV0dG9uIG5lZWRzIHRvIHVwZGF0ZVxuICBhZGREYWdTZXRMaXN0ZW5lcjogZnVuY3Rpb24gYWRkRGFnU2V0TGlzdGVuZXIoY2IpIHtcbiAgICB0aGlzLm9uKERBR19TRVRfRVZFTlQsIGNiKTtcbiAgfSxcbiAgcmVtb3ZlRGFnU2V0TGlzdGVuZXI6IGZ1bmN0aW9uIHJlbW92ZURhZ1NldExpc3RlbmVyKGNiKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcihEQUdfU0VUX0VWRU5ULCBjYik7XG4gIH0sXG4gIC8vIEdldHRlciBmb3IgcmVzdWx0cyB0aGF0IGZldGNoZXMgcmVzdWx0cyBpZiBzdG9yZSBpcyBlbXB0eVxuICBnZXRSZXN1bHRzOiBmdW5jdGlvbiBnZXRSZXN1bHRzKCkge1xuICAgIGlmICghX3N0b3JlLnJlc3VsdHMpIHtcbiAgICAgIHVwZGF0ZVJlc3VsdHMoKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gX3N0b3JlLnJlc3VsdHMuZmlsdGVyKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICByZXR1cm4gZWxlbWVudC5uYW1lLmluZGV4T2YoX3N0b3JlLnNlYXJjaEZpbHRlcikgIT09IC0xO1xuICAgIH0pO1xuICB9LFxuICAvLyBUcmFuc2llbnQgZ2V0dGVyIHRoYXQgY2FsY3VsYXRlcyBoZWFkZXJzIGV2ZXJ5IHRpbWVcbiAgZ2V0UmVzdWx0SGVhZGVyczogZnVuY3Rpb24gZ2V0UmVzdWx0SGVhZGVycygpIHtcbiAgICBpZiAoX3N0b3JlLmRhZyAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIFsndGFzayBuYW1lJywgX3N0b3JlLm1lYXN1cmVdO1xuICAgIH1cbiAgICByZXR1cm4gWydkYWcgbmFtZScsIF9zdG9yZS5tZWFzdXJlXTtcbiAgfSxcbiAgLy8gVHJhbnNpZW50IGdldHRlciB0aGF0IGNhbGN1bGF0ZXMgZmlsdGVyIGRlc2NyaXB0aW9uIHN0cmluZ1xuICBnZXREZXNjcmlwdGlvblN0cmluZzogZnVuY3Rpb24gZ2V0RGVzY3JpcHRpb25TdHJpbmcoKSB7XG4gICAgdmFyIG1lYXN1cmVTdHJpbmcgPSB1bmRlZmluZWQ7XG4gICAgc3dpdGNoIChfc3RvcmUubWVhc3VyZSkge1xuICAgICAgY2FzZSAnaW8nOlxuICAgICAgICBtZWFzdXJlU3RyaW5nID0gJ3JlYWQgYW5kIHdyaXRlIG9wZXJhdG9yaW9ucyc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY3B1JzpcbiAgICAgICAgbWVhc3VyZVN0cmluZyA9ICd0b3RhbCBjcHUgdGltZSBpbiBzZWNvbmRzJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtYXBwZXJzJzpcbiAgICAgICAgbWVhc3VyZVN0cmluZyA9ICdudW1iZXIgb2YgbWFwcGVycyc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmVkdWNlcnMnOlxuICAgICAgICBtZWFzdXJlU3RyaW5nID0gJ251bWJlciBvZiByZWR1Y2Vycyc7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gJ0F2ZXJhZ2UgJyArIG1lYXN1cmVTdHJpbmcgKyAnIG92ZXIgdGhlIGxhc3QgJyArIF9zdG9yZS50aW1lLnRvTG93ZXJDYXNlKCkgKyAnLic7XG4gIH0sXG5cbiAgLy8gUmV0dXJuIGEgYm9vbCBhcyB0byB3aGV0aGVyIGZpbHRlciByZXN1bHRzIGFyZSBkYWdzIG9yIHRhc2tzXG4gIGlzU2hvd2luZ0RhZ3M6IGZ1bmN0aW9uIGlzU2hvd2luZ0RhZ3MoKSB7XG4gICAgaWYgKF9zdG9yZS5kYWcgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxufSk7XG5cbi8vIFJlZ2lzdGVyIGNhbGxiYWNrIHRvIGhhbmRsZSBhbGwgdXBkYXRlc1xuQXBwRGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbiAoYWN0aW9uKSB7XG4gIHN3aXRjaCAoYWN0aW9uLmFjdGlvblR5cGUpIHtcbiAgICAvLyBSYWRpbyBidXR0b25zIGNoYW5nZWQsIGZldGNoIG5ldyBkYWcvdGFzayBkYXRhXG4gICAgY2FzZSBGaWx0ZXJDb25zdGFudHMuVVBEQVRFX0ZJTFRFUjpcbiAgICAgIGlmIChhY3Rpb24ua2V5IGluIF9zdG9yZSkge1xuICAgICAgICBfc3RvcmVbYWN0aW9uLmtleV0gPSBhY3Rpb24udmFsdWUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCcvJywgJycpO1xuICAgICAgICBpZiAoYWN0aW9uLmtleSA9PSAnZGFnJykge1xuICAgICAgICAgIEZpbHRlclN0b3JlLmVtaXQoREFHX1NFVF9FVkVOVCk7XG4gICAgICAgIH1cbiAgICAgICAgdXBkYXRlUmVzdWx0cygpO1xuICAgICAgfSBlbHNlIGlmIChhY3Rpb24ua2V5ID09ICdncmFpbicpIHtcbiAgICAgICAgaWYgKGFjdGlvbi52YWx1ZS50b0xvd2VyQ2FzZSgpID09ICdkYWcnKSB7XG4gICAgICAgICAgX3N0b3JlLmRhZyA9IG51bGw7XG4gICAgICAgICAgRGV0YWlsVmlld1N0b3JlLnNldERhZyhudWxsKTtcbiAgICAgICAgICB1cGRhdGVSZXN1bHRzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIC8vIFRoZSBzZWFyY2ggY2hhbmdlZCwgcmVmcmVzaCB0aGUgYWNjZXB0YWJsZSBkYWcvdGFza3NcbiAgICBjYXNlIEZpbHRlckNvbnN0YW50cy5VUERBVEVfU0VBUkNIOlxuICAgICAgX3N0b3JlLnNlYXJjaEZpbHRlciA9IGFjdGlvbi5zZWFyY2hGaWx0ZXI7XG4gICAgICBGaWx0ZXJTdG9yZS5lbWl0KEZJTFRFUl9DSEFOR0VfRVZFTlQpO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAvLyBubyBvcFxuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaWx0ZXJTdG9yZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OW5jbVZuYjNKNVgyWnZjM1JsY2k5dmNHVnVjMjkxY21ObFgyaHZibVY1Y0c5MEwyaHZibVY1Y0c5MEwyUmxkaTl6WTNKcGNIUnpMM04wYjNKbGN5OUdhV3gwWlhKVGRHOXlaUzVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN096czdRVUZKUVN4SlFVRk5MR0ZCUVdFc1IwRkJSeXhQUVVGUExFTkJRVU1zTmtKQlFUWkNMRU5CUVVNc1EwRkJRenRCUVVNM1JDeEpRVUZOTEZsQlFWa3NSMEZCUnl4UFFVRlBMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU1zV1VGQldTeERRVUZETzBGQlEzQkVMRWxCUVUwc1pVRkJaU3hIUVVGSExFOUJRVThzUTBGQlF5dzRRa0ZCT0VJc1EwRkJReXhEUVVGRE8wRkJRMmhGTEVsQlFVMHNUVUZCVFN4SFFVRkhMRTlCUVU4c1EwRkJReXhsUVVGbExFTkJRVU1zUTBGQlF6dEJRVU40UXl4SlFVRk5MR1ZCUVdVc1IwRkJSeXhQUVVGUExFTkJRVU1zYlVKQlFXMUNMRU5CUVVNc1EwRkJRenM3UVVGRmNrUXNTVUZCVFN4dFFrRkJiVUlzUjBGQlJ5eGxRVUZsTEVOQlFVTTdRVUZETlVNc1NVRkJUU3hoUVVGaExFZEJRVWNzV1VGQldTeERRVUZET3p0QlFVVnVReXhKUVVGTkxFMUJRVTBzUjBGQlJ6dEJRVU5pTEZOQlFVOHNSVUZCUlN4SlFVRkpPMEZCUTJJc1UwRkJUeXhGUVVGRkxFbEJRVWs3UVVGRFlpeE5RVUZKTEVWQlFVVXNUVUZCVFR0QlFVTmFMRXRCUVVjc1JVRkJSU3hKUVVGSk8wRkJRMVFzVVVGQlRTeEZRVUZGTEZOQlFWTTdRVUZEYWtJc1kwRkJXU3hGUVVGRkxFVkJRVVVzUlVGRGFrSXNRMEZCUXpzN096dEJRVWRHTEZOQlFWTXNZVUZCWVN4SFFVRkhPMEZCUTNaQ0xFZEJRVU1zUTBGQlF5eFBRVUZQTEVOQlExQXNUVUZCVFN4RFFVRkRMRkZCUVZFc1IwRkJSeXhSUVVGUkxFVkJRekZDTzBGQlEwVXNWMEZCVHl4RlFVRkZMRTFCUVUwc1EwRkJReXhQUVVGUE8wRkJRM1pDTEZGQlFVa3NSVUZCUlN4TlFVRk5MRU5CUVVNc1NVRkJTVHRCUVVOcVFpeFBRVUZITEVWQlFVVXNUVUZCVFN4RFFVRkRMRWRCUVVjN1IwRkRhRUlzUlVGRFJDeFZRVUZUTEVsQlFVa3NSVUZCUlRzN1FVRkZZaXhSUVVGTkxFdEJRVXNzUjBGQlJ5eEZRVUZGTEVOQlFVTTdRVUZEYWtJc1UwRkJTeXhKUVVGTkxFZEJRVWNzU1VGQlNTeEpRVUZKTEVWQlFVVTdRVUZEZEVJc1YwRkJTeXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJRenRMUVVOMlFqdEJRVU5FTEZWQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1MwRkJTeXhEUVVGRE8wRkJRM1pDTEZWQlFVMHNRMEZCUXl4UlFVRlJMRWRCUVVjc1MwRkJTeXhEUVVGRE8wRkJRM2hDTEdWQlFWY3NRMEZCUXl4SlFVRkpMRU5CUVVNc2JVSkJRVzFDTEVOQlFVTXNRMEZCUXp0SFFVTjJReXhEUVVGRExFTkJRVU03UTBGRFRqczdRVUZIUkN4SlFVRk5MRmRCUVZjc1IwRkJSeXhOUVVGTkxFTkJRVU1zUlVGQlJTeEZRVUZGTEZsQlFWa3NRMEZCUXl4VFFVRlRMRVZCUVVVN08wRkJSWEpFTEdkRFFVRTRRaXhGUVVGRkxIZERRVUZUTEVWQlFVVXNSVUZCUXp0QlFVTXhReXhSUVVGSkxFTkJRVU1zUlVGQlJTeERRVUZETEcxQ1FVRnRRaXhGUVVGRkxFVkJRVVVzUTBGQlF5eERRVUZETzBkQlEyeERPMEZCUTBRc2JVTkJRV2xETEVWQlFVVXNNa05CUVZNc1JVRkJSU3hGUVVGRE8wRkJRemRETEZGQlFVa3NRMEZCUXl4alFVRmpMRU5CUVVNc2JVSkJRVzFDTEVWQlFVVXNSVUZCUlN4RFFVRkRMRU5CUVVNN1IwRkRPVU03TzBGQlJVUXNiVUpCUVdsQ0xFVkJRVVVzTWtKQlFWTXNSVUZCUlN4RlFVRkRPMEZCUXpkQ0xGRkJRVWtzUTBGQlF5eEZRVUZGTEVOQlFVTXNZVUZCWVN4RlFVRkZMRVZCUVVVc1EwRkJReXhEUVVGRE8wZEJRelZDTzBGQlEwUXNjMEpCUVc5Q0xFVkJRVVVzT0VKQlFWTXNSVUZCUlN4RlFVRkRPMEZCUTJoRExGRkJRVWtzUTBGQlF5eGpRVUZqTEVOQlFVTXNZVUZCWVN4RlFVRkZMRVZCUVVVc1EwRkJReXhEUVVGRE8wZEJRM2hET3p0QlFVVkVMRmxCUVZVc1JVRkJSU3h6UWtGQlZUdEJRVU53UWl4UlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRExFOUJRVThzUlVGQlJUdEJRVU51UWl4dFFrRkJZU3hGUVVGRkxFTkJRVU03UVVGRGFFSXNZVUZCVHl4SlFVRkpMRU5CUVVNN1MwRkRZanRCUVVORUxGZEJRVThzVFVGQlRTeERRVUZETEU5QlFVOHNRMEZCUXl4TlFVRk5MRU5CUVVNc1ZVRkJVeXhQUVVGUExFVkJRVVU3UVVGRE4wTXNZVUZCVVN4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFOUJRVThzUTBGQlF5eE5RVUZOTEVOQlFVTXNXVUZCV1N4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVVU3UzBGRE0wUXNRMEZCUXl4RFFVRkRPMGRCUTBvN08wRkJSVVFzYTBKQlFXZENMRVZCUVVVc05FSkJRVlU3UVVGRE1VSXNVVUZCU1N4TlFVRk5MRU5CUVVNc1IwRkJSeXhMUVVGTExFbEJRVWtzUlVGQlJUdEJRVU4yUWl4aFFVRlBMRU5CUVVNc1YwRkJWeXhGUVVGRkxFMUJRVTBzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0TFFVTjBRenRCUVVORUxGZEJRVThzUTBGQlF5eFZRVUZWTEVWQlFVVXNUVUZCVFN4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRE8wZEJSWEpET3p0QlFVVkVMSE5DUVVGdlFpeEZRVUZGTEdkRFFVRlZPMEZCUXpsQ0xGRkJRVWtzWVVGQllTeFpRVUZCTEVOQlFVTTdRVUZEYkVJc1dVRkJVU3hOUVVGTkxFTkJRVU1zVDBGQlR6dEJRVU53UWl4WFFVRkxMRWxCUVVrN1FVRkRVQ3h4UWtGQllTeEhRVUZITERaQ1FVRTJRaXhEUVVGRE8wRkJRemxETEdOQlFVMDdRVUZCUVN4QlFVTlNMRmRCUVVzc1MwRkJTenRCUVVOU0xIRkNRVUZoTEVkQlFVY3NNa0pCUVRKQ0xFTkJRVU03UVVGRE5VTXNZMEZCVFR0QlFVRkJMRUZCUTFJc1YwRkJTeXhUUVVGVE8wRkJRMW9zY1VKQlFXRXNSMEZCUnl4dFFrRkJiVUlzUTBGQlF6dEJRVU53UXl4alFVRk5PMEZCUVVFc1FVRkRVaXhYUVVGTExGVkJRVlU3UVVGRFlpeHhRa0ZCWVN4SFFVRkhMRzlDUVVGdlFpeERRVUZETzBGQlEzSkRMR05CUVUwN1FVRkJRU3hMUVVOVU8wRkJRMFFzVjBGQlR5eFZRVUZWTEVkQlEyWXNZVUZCWVN4SFFVTmlMR2xDUVVGcFFpeEhRVU5xUWl4TlFVRk5MRU5CUVVNc1NVRkJTU3hEUVVGRExGZEJRVmNzUlVGQlJTeEhRVUZITEVkQlFVY3NRMEZCUXp0SFFVTnVRenM3TzBGQlIwUXNaVUZCWVN4RlFVRkZMSGxDUVVGVk8wRkJRM1pDTEZGQlFVa3NUVUZCVFN4RFFVRkRMRWRCUVVjc1MwRkJTeXhKUVVGSkxFVkJRVVU3UVVGQlF5eGhRVUZQTEVsQlFVa3NRMEZCUXp0TFFVRkRPMEZCUTNaRExGZEJRVThzUzBGQlN5eERRVUZETzBkQlEyUTdPME5CUlVZc1EwRkJReXhEUVVGRE96czdRVUZKU0N4aFFVRmhMRU5CUVVNc1VVRkJVU3hEUVVGRExGVkJRVk1zVFVGQlRTeEZRVUZGTzBGQlEzUkRMRlZCUVU4c1RVRkJUU3hEUVVGRExGVkJRVlU3TzBGQlJYUkNMRk5CUVVzc1pVRkJaU3hEUVVGRExHRkJRV0U3UVVGRGFFTXNWVUZCU1N4TlFVRk5MRU5CUVVNc1IwRkJSeXhKUVVGSkxFMUJRVTBzUlVGQlJUdEJRVU40UWl4alFVRk5MRU5CUVVNc1RVRkJUU3hEUVVGRExFZEJRVWNzUTBGQlF5eEhRVUZITEUxQlFVMHNRMEZCUXl4TFFVRkxMRU5CUVVNc1YwRkJWeXhGUVVGRkxFTkJRVU1zVDBGQlR5eERRVUZETEVkQlFVY3NSVUZCUXl4RlFVRkZMRU5CUVVNc1EwRkJRenRCUVVOb1JTeFpRVUZKTEUxQlFVMHNRMEZCUXl4SFFVRkhMRWxCUVVrc1MwRkJTeXhGUVVGRk8wRkJRM1pDTEhGQ1FVRlhMRU5CUVVNc1NVRkJTU3hEUVVGRExHRkJRV0VzUTBGQlF5eERRVUZETzFOQlEycERPMEZCUTBRc2NVSkJRV0VzUlVGQlJTeERRVUZETzA5QlEycENMRTFCUTBrc1NVRkJTU3hOUVVGTkxFTkJRVU1zUjBGQlJ5eEpRVUZKTEU5QlFVOHNSVUZCUlR0QlFVTTVRaXhaUVVGSkxFMUJRVTBzUTBGQlF5eExRVUZMTEVOQlFVTXNWMEZCVnl4RlFVRkZMRWxCUVVrc1MwRkJTeXhGUVVGRk8wRkJRM1pETEdkQ1FVRk5MRU5CUVVNc1IwRkJSeXhIUVVGSExFbEJRVWtzUTBGQlF6dEJRVU5zUWl4NVFrRkJaU3hEUVVGRExFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0QlFVTTNRaXgxUWtGQllTeEZRVUZGTEVOQlFVTTdVMEZEYWtJN1QwRkRSanRCUVVORUxGbEJRVTA3UVVGQlFUdEJRVVZTTEZOQlFVc3NaVUZCWlN4RFFVRkRMR0ZCUVdFN1FVRkRhRU1zV1VGQlRTeERRVUZETEZsQlFWa3NSMEZCUnl4TlFVRk5MRU5CUVVNc1dVRkJXU3hEUVVGRE8wRkJRekZETEdsQ1FVRlhMRU5CUVVNc1NVRkJTU3hEUVVGRExHMUNRVUZ0UWl4RFFVRkRMRU5CUVVNN1FVRkRkRU1zV1VGQlRUdEJRVUZCTEVGQlExSXNXVUZCVVRzN1IwRkZWRHREUVVOR0xFTkJRVU1zUTBGQlF6czdRVUZGU0N4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExGZEJRVmNzUTBGQlF5SXNJbVpwYkdVaU9pSXZWWE5sY25NdlozSmxaMjl5ZVY5bWIzTjBaWEl2YjNCbGJuTnZkWEpqWlY5b2IyNWxlWEJ2ZEM5b2IyNWxlWEJ2ZEM5a1pYWXZjMk55YVhCMGN5OXpkRzl5WlhNdlJtbHNkR1Z5VTNSdmNtVXVhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdkx5QkdhV3gwWlhKVGRHOXlaUzVxYzF4dUx5OGdWR2hsSUdac2RYZ2daR0YwWVhOMGIzSmxJR1p2Y2lCMGFHVWdiR1ZtZENCemFXUmxZbUZ5WEc0dkttcHphR2x1ZENCbGMyNWxlSFE2SUhSeWRXVWdLaTljYmx4dVkyOXVjM1FnUVhCd1JHbHpjR0YwWTJobGNpQTlJSEpsY1hWcGNtVW9KeTR1TDJScGMzQmhkR05vWlhJdlFYQndSR2x6Y0dGMFkyaGxjaWNwTzF4dVkyOXVjM1FnUlhabGJuUkZiV2wwZEdWeUlEMGdjbVZ4ZFdseVpTZ25aWFpsYm5Sekp5a3VSWFpsYm5SRmJXbDBkR1Z5TzF4dVkyOXVjM1FnUm1sc2RHVnlRMjl1YzNSaGJuUnpJRDBnY21WeGRXbHlaU2duTGk0dlkyOXVjM1JoYm5SekwwWnBiSFJsY2tOdmJuTjBZVzUwY3ljcE8xeHVZMjl1YzNRZ1lYTnphV2R1SUQwZ2NtVnhkV2x5WlNnbmIySnFaV04wTG1GemMybG5iaWNwTzF4dVkyOXVjM1FnUkdWMFlXbHNWbWxsZDFOMGIzSmxJRDBnY21WeGRXbHlaU2duTGk5RVpYUmhhV3hXYVdWM1UzUnZjbVVuS1R0Y2JseHVZMjl1YzNRZ1JrbE1WRVZTWDBOSVFVNUhSVjlGVmtWT1ZDQTlJQ2RtYVd4MFpYSmZZMmhoYm1kbEp6dGNibU52Ym5OMElFUkJSMTlUUlZSZlJWWkZUbFFnUFNBblpHRm5YMk5vYjNObGJpYzdYRzVjYm1OdmJuTjBJRjl6ZEc5eVpTQTlJSHRjYmlBZ2NtVnpkV3gwY3pvZ2JuVnNiQ3dnTHk4Z1ZHaGxJR04xY25KbGJuUWdaR0ZuY3k5MFlYTnJjeUJzYVhOMFpXUWdiMjRnZEdobElITnBaR1ZpWVhJZ2R5OGdkbUZzZFdWelhHNGdJRzFsWVhOMWNtVTZJQ2RwYnljc0lDOHZJRlJvWlNCamRYSnlaVzUwSUdacGJIUmxjaUJ0WldGemRYSmxYRzRnSUhScGJXVTZJQ2QzWldWckp5d2dMeThnVkdobElHTjFjbkpsYm5RZ1ptbHNkR1Z5SUhScGJXVWdjbUZ1WjJWY2JpQWdaR0ZuT2lCdWRXeHNMQ0F2THlCVWFHVWdZM1Z5Y21WdWRHeDVJSE5sYkdWamRHVmtJSFJoYzJzZ2IzSWdaR0ZuWEc0Z0lHTm9ZVzVuWlRvZ0ozQmxjbU5sYm5RbkxDQXZMeUJYYUdWMGFHVnlJSFJvWlNCbWFXeDBaWElnYzJodmQzTWdZV0p6YjJ4MWRHVWdiM0lnY21Wc1lYUnBkbVVnWTJoaGJtZGxYRzRnSUhObFlYSmphRVpwYkhSbGNqb2dKeWNzSUM4dklGUm9aU0JqYjI1MFpXNTBjeUJ2WmlCMGFHVWdjMlZoY21Ob0lHSmhjaUIwYUdGMElHWnBiSFJsY25NZ2NtVnpkV3gwYzF4dWZUdGNibHh1THk4Z1JtbHlaWE1nYjJZZ1lXNGdRV3BoZUNCblpYUWdjbVZ4ZFdWemRDQjBieUIwYUdVZ2MyVnlkbVZ5SUhSdklHZGxkQ0JrWVdkekwzUmhjMnR6SUdadmNpQnphV1JsWW1GeVhHNW1kVzVqZEdsdmJpQjFjR1JoZEdWU1pYTjFiSFJ6S0NrZ2UxeHVJQ0FrTG1kbGRFcFRUMDRvWEc0Z0lDQWdkMmx1Wkc5M0xteHZZMkYwYVc5dUlDc2dKMlpwYkhSbGNpY3NYRzRnSUNBZ2UxeHVJQ0FnSUNBZ2JXVmhjM1Z5WlRvZ1gzTjBiM0psTG0xbFlYTjFjbVVzWEc0Z0lDQWdJQ0IwYVcxbE9pQmZjM1J2Y21VdWRHbHRaU3hjYmlBZ0lDQWdJR1JoWnpvZ1gzTjBiM0psTG1SaFp5eGNiaUFnSUNCOUxGeHVJQ0FnSUdaMWJtTjBhVzl1S0dSaGRHRXBJSHRjYmlBZ0lDQWdJQzh2SUdOdmJuWmxjblFnWkdsamRDQjBieUJoY25KaGVWeHVJQ0FnSUNBZ1kyOXVjM1FnWVhKeVlYa2dQU0JiWFR0Y2JpQWdJQ0FnSUdadmNpQW9ZMjl1YzNRZ2EyVjVJR2x1SUdSaGRHRXBJSHRjYmlBZ0lDQWdJQ0FnWVhKeVlYa3VjSFZ6YUNoa1lYUmhXMnRsZVYwcE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ1gzTjBiM0psTG5KbGMzVnNkSE1nUFNCaGNuSmhlVHRjYmlBZ0lDQWdJRjl6ZEc5eVpTNTFjR1JoZEdsdVp5QTlJR1poYkhObE8xeHVJQ0FnSUNBZ1JtbHNkR1Z5VTNSdmNtVXVaVzFwZENoR1NVeFVSVkpmUTBoQlRrZEZYMFZXUlU1VUtUdGNiaUFnSUNCOUtUdGNibjBnWEc1Y2JseHVZMjl1YzNRZ1JtbHNkR1Z5VTNSdmNtVWdQU0JoYzNOcFoyNG9lMzBzSUVWMlpXNTBSVzFwZEhSbGNpNXdjbTkwYjNSNWNHVXNJSHRjYmlBZ0x5OGdUR2x6ZEdWdVpYSWdabTl5SUhkb1pXNGdjbUZrYVc4Z1luVjBkRzl1SUdOb1lXNW5aWE1nWVc1a0lISmxjM1ZzZEhNZ2JtVmxaQ0IwYnlCMWNHUmhkR1ZjYmlBZ1lXUmtSbWxzZEdWeVVtVnpkV3gwYzBOb1lXNW5aVXhwYzNSbGJtVnlPaUJtZFc1amRHbHZiaWhqWWlsN1hHNGdJQ0FnZEdocGN5NXZiaWhHU1V4VVJWSmZRMGhCVGtkRlgwVldSVTVVTENCallpazdYRzRnSUgwc1hHNGdJSEpsYlc5MlpVWnBiSFJsY2xKbGMzVnNkSE5EYUdGdVoyVk1hWE4wWlc1bGNqb2dablZ1WTNScGIyNG9ZMklwZTF4dUlDQWdJSFJvYVhNdWNtVnRiM1psVEdsemRHVnVaWElvUmtsTVZFVlNYME5JUVU1SFJWOUZWa1ZPVkN3Z1kySXBPMXh1SUNCOUxGeHVJQ0F2THlCTWFYTjBaVzVsY2lCbWIzSWdkMmhsYmlCa1lXY2dhWE1nYzJWMElHRnVaQ0JpZFhSMGIyNGdibVZsWkhNZ2RHOGdkWEJrWVhSbFhHNGdJR0ZrWkVSaFoxTmxkRXhwYzNSbGJtVnlPaUJtZFc1amRHbHZiaWhqWWlsN1hHNGdJQ0FnZEdocGN5NXZiaWhFUVVkZlUwVlVYMFZXUlU1VUxDQmpZaWs3WEc0Z0lIMHNYRzRnSUhKbGJXOTJaVVJoWjFObGRFeHBjM1JsYm1WeU9pQm1kVzVqZEdsdmJpaGpZaWw3WEc0Z0lDQWdkR2hwY3k1eVpXMXZkbVZNYVhOMFpXNWxjaWhFUVVkZlUwVlVYMFZXUlU1VUxDQmpZaWs3WEc0Z0lIMHNYRzRnSUM4dklFZGxkSFJsY2lCbWIzSWdjbVZ6ZFd4MGN5QjBhR0YwSUdabGRHTm9aWE1nY21WemRXeDBjeUJwWmlCemRHOXlaU0JwY3lCbGJYQjBlVnh1SUNCblpYUlNaWE4xYkhSek9pQm1kVzVqZEdsdmJpZ3BlMXh1SUNBZ0lHbG1JQ2doWDNOMGIzSmxMbkpsYzNWc2RITXBJSHRjYmlBZ0lDQWdJSFZ3WkdGMFpWSmxjM1ZzZEhNb0tUdGNiaUFnSUNBZ0lISmxkSFZ5YmlCdWRXeHNPMXh1SUNBZ0lIMWNiaUFnSUNCeVpYUjFjbTRnWDNOMGIzSmxMbkpsYzNWc2RITXVabWxzZEdWeUtHWjFibU4wYVc5dUtHVnNaVzFsYm5RcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlBb1pXeGxiV1Z1ZEM1dVlXMWxMbWx1WkdWNFQyWW9YM04wYjNKbExuTmxZWEpqYUVacGJIUmxjaWtnSVQwOUlDMHhLVHRjYmlBZ0lDQjlLVHRjYmlBZ2ZTeGNiaUFnTHk4Z1ZISmhibk5wWlc1MElHZGxkSFJsY2lCMGFHRjBJR05oYkdOMWJHRjBaWE1nYUdWaFpHVnljeUJsZG1WeWVTQjBhVzFsWEc0Z0lHZGxkRkpsYzNWc2RFaGxZV1JsY25NNklHWjFibU4wYVc5dUtDbDdYRzRnSUNBZ2FXWWdLRjl6ZEc5eVpTNWtZV2NnSVQwOUlHNTFiR3dwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJiSjNSaGMyc2dibUZ0WlNjc0lGOXpkRzl5WlM1dFpXRnpkWEpsWFR0Y2JpQWdJQ0I5WEc0Z0lDQWdjbVYwZFhKdUlGc25aR0ZuSUc1aGJXVW5MQ0JmYzNSdmNtVXViV1ZoYzNWeVpWMDdYRzVjYmlBZ2ZTeGNiaUFnTHk4Z1ZISmhibk5wWlc1MElHZGxkSFJsY2lCMGFHRjBJR05oYkdOMWJHRjBaWE1nWm1sc2RHVnlJR1JsYzJOeWFYQjBhVzl1SUhOMGNtbHVaMXh1SUNCblpYUkVaWE5qY21sd2RHbHZibE4wY21sdVp6b2dablZ1WTNScGIyNG9LWHRjYmlBZ0lDQnNaWFFnYldWaGMzVnlaVk4wY21sdVp6dGNiaUFnSUNCemQybDBZMmdnS0Y5emRHOXlaUzV0WldGemRYSmxLU0I3WEc0Z0lDQWdJQ0JqWVhObElDZHBieWM2WEc0Z0lDQWdJQ0FnSUcxbFlYTjFjbVZUZEhKcGJtY2dQU0FuY21WaFpDQmhibVFnZDNKcGRHVWdiM0JsY21GMGIzSnBiMjV6Snp0Y2JpQWdJQ0FnSUNBZ1luSmxZV3M3WEc0Z0lDQWdJQ0JqWVhObElDZGpjSFVuT2x4dUlDQWdJQ0FnSUNCdFpXRnpkWEpsVTNSeWFXNW5JRDBnSjNSdmRHRnNJR053ZFNCMGFXMWxJR2x1SUhObFkyOXVaSE1uTzF4dUlDQWdJQ0FnSUNCaWNtVmhhenRjYmlBZ0lDQWdJR05oYzJVZ0oyMWhjSEJsY25Nbk9seHVJQ0FnSUNBZ0lDQnRaV0Z6ZFhKbFUzUnlhVzVuSUQwZ0oyNTFiV0psY2lCdlppQnRZWEJ3WlhKekp6dGNiaUFnSUNBZ0lDQWdZbkpsWVdzN1hHNGdJQ0FnSUNCallYTmxJQ2R5WldSMVkyVnljeWM2WEc0Z0lDQWdJQ0FnSUcxbFlYTjFjbVZUZEhKcGJtY2dQU0FuYm5WdFltVnlJRzltSUhKbFpIVmpaWEp6Snp0Y2JpQWdJQ0FnSUNBZ1luSmxZV3M3WEc0Z0lDQWdmVnh1SUNBZ0lISmxkSFZ5YmlBblFYWmxjbUZuWlNBbklDdGNiaUFnSUNBZ0lHMWxZWE4xY21WVGRISnBibWNnSzF4dUlDQWdJQ0FnSnlCdmRtVnlJSFJvWlNCc1lYTjBJQ2NnSzF4dUlDQWdJQ0FnWDNOMGIzSmxMblJwYldVdWRHOU1iM2RsY2tOaGMyVW9LU0FySUNjdUp6dGNiaUFnZlN4Y2JseHVJQ0F2THlCU1pYUjFjbTRnWVNCaWIyOXNJR0Z6SUhSdklIZG9aWFJvWlhJZ1ptbHNkR1Z5SUhKbGMzVnNkSE1nWVhKbElHUmhaM01nYjNJZ2RHRnphM05jYmlBZ2FYTlRhRzkzYVc1blJHRm5jem9nWm5WdVkzUnBiMjRvS1h0Y2JpQWdJQ0JwWmlBb1gzTjBiM0psTG1SaFp5QTlQVDBnYm5Wc2JDa2dlM0psZEhWeWJpQjBjblZsTzMxY2JpQWdJQ0J5WlhSMWNtNGdabUZzYzJVN1hHNGdJSDFjYmx4dWZTazdYRzVjYmx4dUx5OGdVbVZuYVhOMFpYSWdZMkZzYkdKaFkyc2dkRzhnYUdGdVpHeGxJR0ZzYkNCMWNHUmhkR1Z6WEc1QmNIQkVhWE53WVhSamFHVnlMbkpsWjJsemRHVnlLR1oxYm1OMGFXOXVLR0ZqZEdsdmJpa2dlMXh1SUNCemQybDBZMmdvWVdOMGFXOXVMbUZqZEdsdmJsUjVjR1VwSUh0Y2JpQWdJQ0F2THlCU1lXUnBieUJpZFhSMGIyNXpJR05vWVc1blpXUXNJR1psZEdOb0lHNWxkeUJrWVdjdmRHRnpheUJrWVhSaFhHNGdJQ0FnWTJGelpTQkdhV3gwWlhKRGIyNXpkR0Z1ZEhNdVZWQkVRVlJGWDBaSlRGUkZVanBjYmlBZ0lDQWdJR2xtSUNoaFkzUnBiMjR1YTJWNUlHbHVJRjl6ZEc5eVpTa2dlMXh1SUNBZ0lDQWdJQ0JmYzNSdmNtVmJZV04wYVc5dUxtdGxlVjBnUFNCaFkzUnBiMjR1ZG1Gc2RXVXVkRzlNYjNkbGNrTmhjMlVvS1M1eVpYQnNZV05sS0Njdkp5d25KeWs3WEc0Z0lDQWdJQ0FnSUdsbUlDaGhZM1JwYjI0dWEyVjVJRDA5SUNka1lXY25LU0I3WEc0Z0lDQWdJQ0FnSUNBZ1JtbHNkR1Z5VTNSdmNtVXVaVzFwZENoRVFVZGZVMFZVWDBWV1JVNVVLVHRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNCMWNHUmhkR1ZTWlhOMWJIUnpLQ2s3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdJQ0JsYkhObElHbG1JQ2hoWTNScGIyNHVhMlY1SUQwOUlDZG5jbUZwYmljcElIdGNiaUFnSUNBZ0lDQWdhV1lnS0dGamRHbHZiaTUyWVd4MVpTNTBiMHh2ZDJWeVEyRnpaU2dwSUQwOUlDZGtZV2NuS1NCN1hHNGdJQ0FnSUNBZ0lDQWdYM04wYjNKbExtUmhaeUE5SUc1MWJHdzdYRzRnSUNBZ0lDQWdJQ0FnUkdWMFlXbHNWbWxsZDFOMGIzSmxMbk5sZEVSaFp5aHVkV3hzS1R0Y2JpQWdJQ0FnSUNBZ0lDQjFjR1JoZEdWU1pYTjFiSFJ6S0NrN1hHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lIMWNiaUFnSUNBZ0lHSnlaV0ZyTzF4dUlDQWdJQzh2SUZSb1pTQnpaV0Z5WTJnZ1kyaGhibWRsWkN3Z2NtVm1jbVZ6YUNCMGFHVWdZV05qWlhCMFlXSnNaU0JrWVdjdmRHRnphM05jYmlBZ0lDQmpZWE5sSUVacGJIUmxja052Ym5OMFlXNTBjeTVWVUVSQlZFVmZVMFZCVWtOSU9seHVJQ0FnSUNBZ1gzTjBiM0psTG5ObFlYSmphRVpwYkhSbGNpQTlJR0ZqZEdsdmJpNXpaV0Z5WTJoR2FXeDBaWEk3WEc0Z0lDQWdJQ0JHYVd4MFpYSlRkRzl5WlM1bGJXbDBLRVpKVEZSRlVsOURTRUZPUjBWZlJWWkZUbFFwTzF4dUlDQWdJQ0FnWW5KbFlXczdYRzRnSUNBZ1pHVm1ZWFZzZERwY2JpQWdJQ0FnSUM4dklHNXZJRzl3WEc0Z0lIMWNibjBwTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlFWnBiSFJsY2xOMGIzSmxPMXh1SWwxOSIsIi8vIENoYXJ0LmpzXG4vLyBUaGUgYnJpZGdlIGJldHdlZW4gUmVhY3QgYW5kIEQzXG4vKmpzaGludCBlc25leHQ6IHRydWUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgRGV0YWlsVmlld1N0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL0RldGFpbFZpZXdTdG9yZScpO1xudmFyIGQzQ2hhcnQgPSByZXF1aXJlKCcuL2QzQ2hhcnQuanMnKTtcblxudmFyIENoYXJ0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ0NoYXJ0JyxcblxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4geyBkYXRhOiBEZXRhaWxWaWV3U3RvcmUuZ2V0RGF0YSgpIH07XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHZhciBlbCA9IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMpO1xuICAgIERldGFpbFZpZXdTdG9yZS5hZGREYXRhVXBkYXRlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICAgIGQzQ2hhcnQuY3JlYXRlKGVsKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICBkM0NoYXJ0LnVwZGF0ZSh0aGlzLnN0YXRlLmRhdGEpO1xuICB9LFxuXG4gIF9vbkNoYW5nZTogZnVuY3Rpb24gX29uQ2hhbmdlKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZGF0YTogRGV0YWlsVmlld1N0b3JlLmdldERhdGEoKVxuICAgIH0pO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICBEZXRhaWxWaWV3U3RvcmUucmVtb3ZlRGF0YVVwZGF0ZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBjbGFzc05hbWU6ICdjaGFydCcgfSk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENoYXJ0O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5bmNtVm5iM0o1WDJadmMzUmxjaTl2Y0dWdWMyOTFjbU5sWDJodmJtVjVjRzkwTDJodmJtVjVjRzkwTDJSbGRpOXpZM0pwY0hSekwzVnBMME5vWVhKMExtcHplQ0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3T3pzN1FVRkpRU3hKUVVGTkxHVkJRV1VzUjBGQlJ5eFBRVUZQTEVOQlFVTXNNa0pCUVRKQ0xFTkJRVU1zUTBGQlF6dEJRVU0zUkN4SlFVRk5MRTlCUVU4c1IwRkJSeXhQUVVGUExFTkJRVU1zWTBGQll5eERRVUZETEVOQlFVTTdPMEZCUlhoRExFbEJRVTBzUzBGQlN5eEhRVUZITEV0QlFVc3NRMEZCUXl4WFFVRlhMRU5CUVVNN096dEJRVVU1UWl4cFFrRkJaU3hGUVVGRkxESkNRVUZYTzBGQlF6RkNMRmRCUVU4c1JVRkJReXhKUVVGSkxFVkJRVVVzWlVGQlpTeERRVUZETEU5QlFVOHNSVUZCUlN4RlFVRkRMRU5CUVVNN1IwRkRNVU03TzBGQlJVUXNiVUpCUVdsQ0xFVkJRVVVzTmtKQlFWYzdRVUZETlVJc1VVRkJUU3hGUVVGRkxFZEJRVWNzUzBGQlN5eERRVUZETEZkQlFWY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRCUVVOdVF5eHRRa0ZCWlN4RFFVRkRMSEZDUVVGeFFpeERRVUZETEVsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRCUVVOMFJDeFhRVUZQTEVOQlFVTXNUVUZCVFN4RFFVRkRMRVZCUVVVc1EwRkJReXhEUVVGRE8wZEJRM0JDT3p0QlFVVkVMRzlDUVVGclFpeEZRVUZGTERoQ1FVRlhPMEZCUXpkQ0xGZEJRVThzUTBGQlF5eE5RVUZOTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dEhRVU5xUXpzN1FVRkZSQ3hYUVVGVExFVkJRVVVzY1VKQlFWYzdRVUZEY0VJc1VVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF6dEJRVU5hTEZWQlFVa3NSVUZCUlN4bFFVRmxMRU5CUVVNc1QwRkJUeXhGUVVGRk8wdEJRMmhETEVOQlFVTXNRMEZCUXp0SFFVTktPenRCUVVWRUxITkNRVUZ2UWl4RlFVRkZMR2REUVVGWE8wRkJReTlDTEcxQ1FVRmxMRU5CUVVNc2QwSkJRWGRDTEVOQlFVTXNTVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRE8wZEJRekZFT3p0QlFVVkVMRkZCUVUwc1JVRkJSU3hyUWtGQlZ6dEJRVU5xUWl4WFFVTkZMRFpDUVVGTExGTkJRVk1zUlVGQlF5eFBRVUZQTEVkQlFVOHNRMEZETjBJN1IwRkRTRHREUVVOR0xFTkJRVU1zUTBGQlF6czdRVUZGU0N4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExFdEJRVXNzUTBGQlF5SXNJbVpwYkdVaU9pSXZWWE5sY25NdlozSmxaMjl5ZVY5bWIzTjBaWEl2YjNCbGJuTnZkWEpqWlY5b2IyNWxlWEJ2ZEM5b2IyNWxlWEJ2ZEM5a1pYWXZjMk55YVhCMGN5OTFhUzlEYUdGeWRDNXFjM2dpTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdkx5QkRhR0Z5ZEM1cWMxeHVMeThnVkdobElHSnlhV1JuWlNCaVpYUjNaV1Z1SUZKbFlXTjBJR0Z1WkNCRU0xeHVMeXBxYzJocGJuUWdaWE51WlhoME9pQjBjblZsSUNvdlhHNGdYRzVqYjI1emRDQkVaWFJoYVd4V2FXVjNVM1J2Y21VZ1BTQnlaWEYxYVhKbEtDY3VMaTl6ZEc5eVpYTXZSR1YwWVdsc1ZtbGxkMU4wYjNKbEp5azdYRzVqYjI1emRDQmtNME5vWVhKMElEMGdjbVZ4ZFdseVpTZ25MaTlrTTBOb1lYSjBMbXB6SnlrN1hHNWNibU52Ym5OMElFTm9ZWEowSUQwZ1VtVmhZM1F1WTNKbFlYUmxRMnhoYzNNb2UxeHVJQ0JjYmlBZ1oyVjBTVzVwZEdsaGJGTjBZWFJsT2lCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNCeVpYUjFjbTRnZTJSaGRHRTZJRVJsZEdGcGJGWnBaWGRUZEc5eVpTNW5aWFJFWVhSaEtDbDlPMXh1SUNCOUxGeHVYRzRnSUdOdmJYQnZibVZ1ZEVScFpFMXZkVzUwT2lCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNCamIyNXpkQ0JsYkNBOUlGSmxZV04wTG1acGJtUkVUMDFPYjJSbEtIUm9hWE1wTzF4dUlDQWdJRVJsZEdGcGJGWnBaWGRUZEc5eVpTNWhaR1JFWVhSaFZYQmtZWFJsVEdsemRHVnVaWElvZEdocGN5NWZiMjVEYUdGdVoyVXBPMXh1SUNBZ0lHUXpRMmhoY25RdVkzSmxZWFJsS0dWc0tUdGNiaUFnZlN4Y2JseHVJQ0JqYjIxd2IyNWxiblJFYVdSVmNHUmhkR1U2SUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0FnSUdRelEyaGhjblF1ZFhCa1lYUmxLSFJvYVhNdWMzUmhkR1V1WkdGMFlTazdYRzRnSUgwc1hHNWNiaUFnWDI5dVEyaGhibWRsT2lCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNCMGFHbHpMbk5sZEZOMFlYUmxLSHRjYmlBZ0lDQWdJR1JoZEdFNklFUmxkR0ZwYkZacFpYZFRkRzl5WlM1blpYUkVZWFJoS0NsY2JpQWdJQ0I5S1R0Y2JpQWdmU3hjYmx4dUlDQmpiMjF3YjI1bGJuUlhhV3hzVlc1dGIzVnVkRG9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnUkdWMFlXbHNWbWxsZDFOMGIzSmxMbkpsYlc5MlpVUmhkR0ZWY0dSaGRHVk1hWE4wWlc1bGNpaDBhR2x6TGw5dmJrTm9ZVzVuWlNrN1hHNGdJSDBzWEc1Y2JpQWdjbVZ1WkdWeU9pQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5SjJOb1lYSjBKejQ4TDJScGRqNWNiaUFnSUNBcE8xeHVJQ0I5WEc1OUtUdGNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JEYUdGeWREdGNiaUpkZlE9PSIsIi8qanNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBEZXRhaWxWaWV3U3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZXMvRGV0YWlsVmlld1N0b3JlJyk7XG52YXIgRGV0YWlsVmlld0FjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL0RldGFpbFZpZXdBY3Rpb25zJyk7XG5cbnZhciBEZXRhaWxUZXh0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ0RldGFpbFRleHQnLFxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiBEZXRhaWxWaWV3U3RvcmUuZ2V0U3RvcmUoKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgRGV0YWlsVmlld1N0b3JlLmFkZERhdGFVcGRhdGVMaXN0ZW5lcih0aGlzLl9vbk1ldGFkYXRhQ2hhbmdlKTtcbiAgICBEZXRhaWxWaWV3U3RvcmUuYWRkRm9jdXNVcGRhdGVMaXN0ZW5lcih0aGlzLl9vbkZvY3VzQ2hhbmdlKTtcbiAgICBEZXRhaWxWaWV3U3RvcmUuYWRkTWVhc3VyZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uTWVhc3VyZUNoYW5nZSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkVW5tb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkVW5tb3VudCgpIHtcbiAgICBEZXRhaWxWaWV3U3RvcmUucmVtb3ZlRGF0YVVwZGF0ZUxpc3RlbmVyKHRoaXMuX29uTWV0YWRhdGFDaGFuZ2UpO1xuICAgIERldGFpbFZpZXdTdG9yZS5yZW1vdmVGb2N1c1VwZGF0ZUxpc3RlbmVyKHRoaXMuX29uRm9jdXNDaGFuZ2UpO1xuICAgIERldGFpbFZpZXdTdG9yZS5yZW1vdmVNZWFzdXJlQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25NZWFzdXJlQ2hhbmdlKTtcbiAgfSxcblxuICBfb25Gb2N1c0NoYW5nZTogZnVuY3Rpb24gX29uRm9jdXNDaGFuZ2UoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBmb2N1c1ZhbHVlOiBEZXRhaWxWaWV3U3RvcmUuZ2V0Rm9jdXNWYWx1ZSgpLFxuICAgICAgZm9jdXNEYXRlOiBEZXRhaWxWaWV3U3RvcmUuZ2V0Rm9jdXNEYXRlKClcbiAgICB9KTtcbiAgfSxcblxuICBfb25NZWFzdXJlQ2hhbmdlOiBmdW5jdGlvbiBfb25NZWFzdXJlQ2hhbmdlKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbWVhc3VyZTogRGV0YWlsVmlld1N0b3JlLmdldE1lYXN1cmUoKVxuICAgIH0pO1xuICB9LFxuXG4gIF9vbk1ldGFkYXRhQ2hhbmdlOiBmdW5jdGlvbiBfb25NZXRhZGF0YUNoYW5nZSgpIHtcbiAgICB2YXIgZGV0YWlscyA9IERldGFpbFZpZXdTdG9yZS5nZXREZXRhaWxzKCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBuYW1lOiBkZXRhaWxzLm5hbWUsXG4gICAgICBvd25lcjogZGV0YWlscy5vd25lclxuICAgIH0pO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBmb2N1c0RhdGUgPSBEZXRhaWxWaWV3U3RvcmUuZ2V0Rm9jdXNEYXRlKCk7XG4gICAgdmFyIGZvcm1hdHRlZEZvY3VzRGF0ZSA9IFwiXCI7XG4gICAgaWYgKGZvY3VzRGF0ZSkge1xuICAgICAgZm9ybWF0dGVkRm9jdXNEYXRlID0gZm9jdXNEYXRlLmdldE1vbnRoKCkgKyAxICsgJy8nICsgZm9jdXNEYXRlLmdldERhdGUoKSArICcvJyArIGZvY3VzRGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgIH1cbiAgICB2YXIgbnVtYmVyRm9ybWF0dGVyID0gZDMuZm9ybWF0KCcuM3MnKTtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICdkaXYnLFxuICAgICAgeyBjbGFzc05hbWU6ICdkZXRhaWxUZXh0JyB9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHsgY2xhc3NOYW1lOiAndGl0bGVSb3cnIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2gxJyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ2N1cklkJyB9LFxuICAgICAgICAgIHRoaXMuc3RhdGUubmFtZVxuICAgICAgICApLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdoMScsXG4gICAgICAgICAgeyBjbGFzc05hbWU6ICdtZWFzdXJlJyB9LFxuICAgICAgICAgIHRoaXMuc3RhdGUubWVhc3VyZVxuICAgICAgICApLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdoMScsXG4gICAgICAgICAgeyBjbGFzc05hbWU6ICdmb2N1c1ZhbCcgfSxcbiAgICAgICAgICBudW1iZXJGb3JtYXR0ZXIodGhpcy5zdGF0ZS5mb2N1c1ZhbHVlKVxuICAgICAgICApXG4gICAgICApLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBjbGFzc05hbWU6ICdkaXZpZGVyJyB9KSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdkaXYnLFxuICAgICAgICB7IGNsYXNzTmFtZTogJ2luZm9Sb3cnIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ3AnLFxuICAgICAgICAgIHsgY2xhc3NOYW1lOiAnb3duZXInIH0sXG4gICAgICAgICAgdGhpcy5zdGF0ZS5vd25lclxuICAgICAgICApLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdwJyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ2ZvY3VzRGF0ZScgfSxcbiAgICAgICAgICBmb3JtYXR0ZWRGb2N1c0RhdGVcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERldGFpbFRleHQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTluY21WbmIzSjVYMlp2YzNSbGNpOXZjR1Z1YzI5MWNtTmxYMmh2Ym1WNWNHOTBMMmh2Ym1WNWNHOTBMMlJsZGk5elkzSnBjSFJ6TDNWcEwwUmxkR0ZwYkZSbGVIUXVhbk40SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN1FVRkZRU3hKUVVGTkxHVkJRV1VzUjBGQlJ5eFBRVUZQTEVOQlFVTXNNa0pCUVRKQ0xFTkJRVU1zUTBGQlF6dEJRVU0zUkN4SlFVRk5MR2xDUVVGcFFpeEhRVUZITEU5QlFVOHNRMEZCUXl3NFFrRkJPRUlzUTBGQlF5eERRVUZET3p0QlFVVnNSU3hKUVVGTkxGVkJRVlVzUjBGQlJ5eExRVUZMTEVOQlFVTXNWMEZCVnl4RFFVRkRPenM3UVVGRmJrTXNhVUpCUVdVc1JVRkJSU3d5UWtGQlZ6dEJRVU14UWl4WFFVRlBMR1ZCUVdVc1EwRkJReXhSUVVGUkxFVkJRVVVzUTBGQlF6dEhRVU51UXpzN1FVRkZSQ3h0UWtGQmFVSXNSVUZCUlN3MlFrRkJWenRCUVVNMVFpeHRRa0ZCWlN4RFFVTmFMSEZDUVVGeFFpeERRVUZETEVsQlFVa3NRMEZCUXl4cFFrRkJhVUlzUTBGQlF5eERRVUZETzBGQlEycEVMRzFDUVVGbExFTkJRMW9zYzBKQlFYTkNMRU5CUVVNc1NVRkJTU3hEUVVGRExHTkJRV01zUTBGQlF5eERRVUZETzBGQlF5OURMRzFDUVVGbExFTkJRMW9zZDBKQlFYZENMRU5CUVVNc1NVRkJTU3hEUVVGRExHZENRVUZuUWl4RFFVRkRMRU5CUVVNN1IwRkRjRVE3TzBGQlJVUXNjVUpCUVcxQ0xFVkJRVVVzSzBKQlFWYzdRVUZET1VJc2JVSkJRV1VzUTBGRFdpeDNRa0ZCZDBJc1EwRkJReXhKUVVGSkxFTkJRVU1zYVVKQlFXbENMRU5CUVVNc1EwRkJRenRCUVVOd1JDeHRRa0ZCWlN4RFFVTmFMSGxDUVVGNVFpeERRVUZETEVsQlFVa3NRMEZCUXl4alFVRmpMRU5CUVVNc1EwRkJRenRCUVVOc1JDeHRRa0ZCWlN4RFFVTmFMREpDUVVFeVFpeERRVUZETEVsQlFVa3NRMEZCUXl4blFrRkJaMElzUTBGQlF5eERRVUZETzBkQlEzWkVPenRCUVVWRUxHZENRVUZqTEVWQlFVVXNNRUpCUVZVN1FVRkRlRUlzVVVGQlNTeERRVUZETEZGQlFWRXNRMEZCUXp0QlFVTmFMR2RDUVVGVkxFVkJRVU1zWlVGQlpTeERRVUZETEdGQlFXRXNSVUZCUlR0QlFVTXhReXhsUVVGVExFVkJRVU1zWlVGQlpTeERRVUZETEZsQlFWa3NSVUZCUlR0TFFVTjZReXhEUVVGRExFTkJRVU03UjBGRFNqczdRVUZGUkN4clFrRkJaMElzUlVGQlJTdzBRa0ZCVlR0QlFVTXhRaXhSUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETzBGQlExb3NZVUZCVHl4RlFVRkRMR1ZCUVdVc1EwRkJReXhWUVVGVkxFVkJRVVU3UzBGRGNrTXNRMEZCUXl4RFFVRkRPMGRCUTBvN08wRkJSVVFzYlVKQlFXbENMRVZCUVVVc05rSkJRVlU3UVVGRE0wSXNVVUZCVFN4UFFVRlBMRWRCUVVjc1pVRkJaU3hEUVVGRExGVkJRVlVzUlVGQlJTeERRVUZETzBGQlF6ZERMRkZCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU03UVVGRFdpeFZRVUZKTEVWQlFVVXNUMEZCVHl4RFFVRkRMRWxCUVVrN1FVRkRiRUlzVjBGQlN5eEZRVUZGTEU5QlFVOHNRMEZCUXl4TFFVRkxPMHRCUTNKQ0xFTkJRVU1zUTBGQlF6dEhRVU5LT3p0QlFVVkVMRkZCUVUwc1JVRkJSU3hyUWtGQlZ6dEJRVU5xUWl4UlFVRk5MRk5CUVZNc1IwRkJSeXhsUVVGbExFTkJRVU1zV1VGQldTeEZRVUZGTEVOQlFVTTdRVUZEYWtRc1VVRkJTU3hyUWtGQmEwSXNSMEZCUnl4RlFVRkZMRU5CUVVNN1FVRkROVUlzVVVGQlNTeFRRVUZUTEVWQlFVVTdRVUZEWWl4M1FrRkJhMElzUjBGQlJ5eEJRVUZETEZOQlFWTXNRMEZCUXl4UlFVRlJMRVZCUVVVc1IwRkJSeXhEUVVGRExFZEJRemxETEVkQlFVY3NSMEZCUnl4VFFVRlRMRU5CUVVNc1QwRkJUeXhGUVVGRkxFZEJRM3BDTEVkQlFVY3NSMEZCUnl4VFFVRlRMRU5CUVVNc1YwRkJWeXhGUVVGRkxFTkJRVU03UzBGREwwSTdRVUZEUkN4UlFVRk5MR1ZCUVdVc1IwRkJSeXhGUVVGRkxFTkJRVU1zVFVGQlRTeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRPMEZCUTNwRExGZEJRMFU3TzFGQlFVc3NVMEZCVXl4RlFVRkRMRmxCUVZrN1RVRkRla0k3TzFWQlFVc3NVMEZCVXl4RlFVRkRMRlZCUVZVN1VVRkRka0k3TzFsQlFVa3NVMEZCVXl4RlFVRkRMRTlCUVU4N1ZVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVazdVMEZCVFR0UlFVTTFRenM3V1VGQlNTeFRRVUZUTEVWQlFVTXNVMEZCVXp0VlFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVDBGQlR6dFRRVUZOTzFGQlEycEVPenRaUVVGSkxGTkJRVk1zUlVGQlF5eFZRVUZWTzFWQlFVVXNaVUZCWlN4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVlVGQlZTeERRVUZETzFOQlFVMDdUMEZEYkVVN1RVRkRUaXcyUWtGQlN5eFRRVUZUTEVWQlFVTXNVMEZCVXl4SFFVRlBPMDFCUXk5Q096dFZRVUZMTEZOQlFWTXNSVUZCUXl4VFFVRlRPMUZCUTNSQ096dFpRVUZITEZOQlFWTXNSVUZCUXl4UFFVRlBPMVZCUVVVc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eExRVUZMTzFOQlFVczdVVUZETTBNN08xbEJRVWNzVTBGQlV5eEZRVUZETEZkQlFWYzdWVUZEY2tJc2EwSkJRV3RDTzFOQlEycENPMDlCUTBFN1MwRkRSaXhEUVVOT08wZEJRMGc3UTBGRFJpeERRVUZETEVOQlFVTTdPMEZCUjBnc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eFZRVUZWTEVOQlFVTWlMQ0ptYVd4bElqb2lMMVZ6WlhKekwyZHlaV2R2Y25sZlptOXpkR1Z5TDI5d1pXNXpiM1Z5WTJWZmFHOXVaWGx3YjNRdmFHOXVaWGx3YjNRdlpHVjJMM05qY21sd2RITXZkV2t2UkdWMFlXbHNWR1Y0ZEM1cWMzZ2lMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2S21wemFHbHVkQ0JsYzI1bGVIUTZJSFJ5ZFdVZ0tpOWNibHh1WTI5dWMzUWdSR1YwWVdsc1ZtbGxkMU4wYjNKbElEMGdjbVZ4ZFdseVpTZ25MaTR2YzNSdmNtVnpMMFJsZEdGcGJGWnBaWGRUZEc5eVpTY3BPMXh1WTI5dWMzUWdSR1YwWVdsc1ZtbGxkMEZqZEdsdmJuTWdQU0J5WlhGMWFYSmxLQ2N1TGk5aFkzUnBiMjV6TDBSbGRHRnBiRlpwWlhkQlkzUnBiMjV6SnlrN1hHNWNibU52Ym5OMElFUmxkR0ZwYkZSbGVIUWdQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEc1Y2JpQWdaMlYwU1c1cGRHbGhiRk4wWVhSbE9pQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z1JHVjBZV2xzVm1sbGQxTjBiM0psTG1kbGRGTjBiM0psS0NrN0lGeHVJQ0I5TEZ4dVhHNGdJR052YlhCdmJtVnVkRVJwWkUxdmRXNTBPaUJtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0JFWlhSaGFXeFdhV1YzVTNSdmNtVmNiaUFnSUNBZ0lDNWhaR1JFWVhSaFZYQmtZWFJsVEdsemRHVnVaWElvZEdocGN5NWZiMjVOWlhSaFpHRjBZVU5vWVc1blpTazdJRnh1SUNBZ0lFUmxkR0ZwYkZacFpYZFRkRzl5WlZ4dUlDQWdJQ0FnTG1Ga1pFWnZZM1Z6VlhCa1lYUmxUR2x6ZEdWdVpYSW9kR2hwY3k1ZmIyNUdiMk4xYzBOb1lXNW5aU2s3SUZ4dUlDQWdJRVJsZEdGcGJGWnBaWGRUZEc5eVpWeHVJQ0FnSUNBZ0xtRmtaRTFsWVhOMWNtVkRhR0Z1WjJWTWFYTjBaVzVsY2loMGFHbHpMbDl2YmsxbFlYTjFjbVZEYUdGdVoyVXBPeUJjYmlBZ2ZTeGNibHh1SUNCamIyMXdiMjVsYm5SRWFXUlZibTF2ZFc1ME9pQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQkVaWFJoYVd4V2FXVjNVM1J2Y21WY2JpQWdJQ0FnSUM1eVpXMXZkbVZFWVhSaFZYQmtZWFJsVEdsemRHVnVaWElvZEdocGN5NWZiMjVOWlhSaFpHRjBZVU5vWVc1blpTazdJRnh1SUNBZ0lFUmxkR0ZwYkZacFpYZFRkRzl5WlZ4dUlDQWdJQ0FnTG5KbGJXOTJaVVp2WTNWelZYQmtZWFJsVEdsemRHVnVaWElvZEdocGN5NWZiMjVHYjJOMWMwTm9ZVzVuWlNrN0lGeHVJQ0FnSUVSbGRHRnBiRlpwWlhkVGRHOXlaVnh1SUNBZ0lDQWdMbkpsYlc5MlpVMWxZWE4xY21WRGFHRnVaMlZNYVhOMFpXNWxjaWgwYUdsekxsOXZiazFsWVhOMWNtVkRhR0Z1WjJVcE95QmNiaUFnZlN4Y2JseHVJQ0JmYjI1R2IyTjFjME5vWVc1blpUb2dablZ1WTNScGIyNG9LWHRjYmlBZ0lDQjBhR2x6TG5ObGRGTjBZWFJsS0h0Y2JpQWdJQ0FnSUdadlkzVnpWbUZzZFdVNlJHVjBZV2xzVm1sbGQxTjBiM0psTG1kbGRFWnZZM1Z6Vm1Gc2RXVW9LU3hjYmlBZ0lDQWdJR1p2WTNWelJHRjBaVHBFWlhSaGFXeFdhV1YzVTNSdmNtVXVaMlYwUm05amRYTkVZWFJsS0NsY2JpQWdJQ0I5S1R0Y2JpQWdmU3hjYmx4dUlDQmZiMjVOWldGemRYSmxRMmhoYm1kbE9pQm1kVzVqZEdsdmJpZ3BlMXh1SUNBZ0lIUm9hWE11YzJWMFUzUmhkR1VvZTF4dUlDQWdJQ0FnYldWaGMzVnlaVHBFWlhSaGFXeFdhV1YzVTNSdmNtVXVaMlYwVFdWaGMzVnlaU2dwWEc0Z0lDQWdmU2s3WEc0Z0lIMHNYRzVjYmlBZ1gyOXVUV1YwWVdSaGRHRkRhR0Z1WjJVNklHWjFibU4wYVc5dUtDbDdYRzRnSUNBZ1kyOXVjM1FnWkdWMFlXbHNjeUE5SUVSbGRHRnBiRlpwWlhkVGRHOXlaUzVuWlhSRVpYUmhhV3h6S0NrN1hHNGdJQ0FnZEdocGN5NXpaWFJUZEdGMFpTaDdYRzRnSUNBZ0lDQnVZVzFsT2lCa1pYUmhhV3h6TG01aGJXVXNYRzRnSUNBZ0lDQnZkMjVsY2pvZ1pHVjBZV2xzY3k1dmQyNWxjbHh1SUNBZ0lIMHBPMXh1SUNCOUxGeHVYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnWTI5dWMzUWdabTlqZFhORVlYUmxJRDBnUkdWMFlXbHNWbWxsZDFOMGIzSmxMbWRsZEVadlkzVnpSR0YwWlNncE8xeHVJQ0FnSUd4bGRDQm1iM0p0WVhSMFpXUkdiMk4xYzBSaGRHVWdQU0JjSWx3aU8xeHVJQ0FnSUdsbUlDaG1iMk4xYzBSaGRHVXBJSHRjYmlBZ0lDQWdJR1p2Y20xaGRIUmxaRVp2WTNWelJHRjBaU0E5SUNobWIyTjFjMFJoZEdVdVoyVjBUVzl1ZEdnb0tTQXJJREVwSUNzZ1hHNGdJQ0FnSUNBbkx5Y2dLeUJtYjJOMWMwUmhkR1V1WjJWMFJHRjBaU2dwSUNzZ1hHNGdJQ0FnSUNBbkx5Y2dLeUJtYjJOMWMwUmhkR1V1WjJWMFJuVnNiRmxsWVhJb0tUdGNiaUFnSUNCOVhHNGdJQ0FnWTI5dWMzUWdiblZ0WW1WeVJtOXliV0YwZEdWeUlEMGdaRE11Wm05eWJXRjBLQ2N1TTNNbktUdGNiaUFnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlKMlJsZEdGcGJGUmxlSFFuUGx4dUlDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDBuZEdsMGJHVlNiM2NuUGx4dUlDQWdJQ0FnSUNBZ0lEeG9NU0JqYkdGemMwNWhiV1U5SjJOMWNrbGtKejU3ZEdocGN5NXpkR0YwWlM1dVlXMWxmVHd2YURFK1hHNGdJQ0FnSUNBZ0lDQWdQR2d4SUdOc1lYTnpUbUZ0WlQwbmJXVmhjM1Z5WlNjK2UzUm9hWE11YzNSaGRHVXViV1ZoYzNWeVpYMDhMMmd4UGx4dUlDQWdJQ0FnSUNBZ0lEeG9NU0JqYkdGemMwNWhiV1U5SjJadlkzVnpWbUZzSno1N2JuVnRZbVZ5Um05eWJXRjBkR1Z5S0hSb2FYTXVjM1JoZEdVdVptOWpkWE5XWVd4MVpTbDlQQzlvTVQ1Y2JpQWdJQ0FnSUNBZ1BDOWthWFkrWEc0Z0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQU2RrYVhacFpHVnlKejQ4TDJScGRqNWNiaUFnSUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOUoybHVabTlTYjNjblBseHVJQ0FnSUNBZ0lDQWdJRHh3SUdOc1lYTnpUbUZ0WlQwbmIzZHVaWEluUG50MGFHbHpMbk4wWVhSbExtOTNibVZ5ZlR3dmNENWNiaUFnSUNBZ0lDQWdJQ0E4Y0NCamJHRnpjMDVoYldVOUoyWnZZM1Z6UkdGMFpTYytYRzRnSUNBZ0lDQWdJQ0FnSUNCN1ptOXliV0YwZEdWa1JtOWpkWE5FWVhSbGZWeHVJQ0FnSUNBZ0lDQWdJRHd2Y0Q1Y2JpQWdJQ0FnSUNBZ1BDOWthWFkrWEc0Z0lDQWdJQ0E4TDJScGRqNWNiaUFnSUNBcE8xeHVJQ0I5WEc1OUtUdGNibHh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUVSbGRHRnBiRlJsZUhRN1hHNGlYWDA9IiwiLypqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIENoYXJ0ID0gcmVxdWlyZSgnLi9DaGFydC5qc3gnKTtcbnZhciBNZWFzdXJlUm93ID0gcmVxdWlyZSgnLi9NZWFzdXJlUm93LmpzeCcpO1xuXG52YXIgRGV0YWlsVmlldyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdEZXRhaWxWaWV3JyxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICdkaXYnLFxuICAgICAgeyBjbGFzc05hbWU6ICdkZXRhaWxWaWV3JyB9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNZWFzdXJlUm93LCB7IG5hbWU6ICdtZWFzdXJlJywgbGFiZWxzOiBbJ0kvTycsICdDUFUnLCAnTWFwcGVycycsICdSZWR1Y2VycyddIH0pLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDaGFydCwgbnVsbClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBEZXRhaWxWaWV3O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5bmNtVm5iM0o1WDJadmMzUmxjaTl2Y0dWdWMyOTFjbU5sWDJodmJtVjVjRzkwTDJodmJtVjVjRzkwTDJSbGRpOXpZM0pwY0hSekwzVnBMMFJsZEdGcGJGWnBaWGN1YW5ONElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN096czdRVUZGUVN4SlFVRk5MRXRCUVVzc1IwRkJSeXhQUVVGUExFTkJRVU1zWVVGQllTeERRVUZETEVOQlFVTTdRVUZEY2tNc1NVRkJUU3hWUVVGVkxFZEJRVWNzVDBGQlR5eERRVUZETEd0Q1FVRnJRaXhEUVVGRExFTkJRVU03TzBGQlJTOURMRWxCUVUwc1ZVRkJWU3hIUVVGSExFdEJRVXNzUTBGQlF5eFhRVUZYTEVOQlFVTTdPenRCUVVOdVF5eFJRVUZOTEVWQlFVVXNhMEpCUVZjN1FVRkRha0lzVjBGRFJUczdVVUZCU3l4VFFVRlRMRVZCUVVNc1dVRkJXVHROUVVONlFpeHZRa0ZCUXl4VlFVRlZMRWxCUVVNc1NVRkJTU3hGUVVGRExGTkJRVk1zUlVGQlF5eE5RVUZOTEVWQlFVVXNRMEZCUXl4TFFVRkxMRVZCUVVNc1MwRkJTeXhGUVVGRExGTkJRVk1zUlVGQlF5eFZRVUZWTEVOQlFVTXNRVUZCUXl4SFFVRkhPMDFCUTNwRkxHOUNRVUZETEV0QlFVc3NUMEZCUnp0TFFVTk1MRU5CUTA0N1IwRkRTRHREUVVOR0xFTkJRVU1zUTBGQlF6czdRVUZGU0N4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExGVkJRVlVzUTBGQlF5SXNJbVpwYkdVaU9pSXZWWE5sY25NdlozSmxaMjl5ZVY5bWIzTjBaWEl2YjNCbGJuTnZkWEpqWlY5b2IyNWxlWEJ2ZEM5b2IyNWxlWEJ2ZEM5a1pYWXZjMk55YVhCMGN5OTFhUzlFWlhSaGFXeFdhV1YzTG1wemVDSXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaThxYW5Ob2FXNTBJR1Z6Ym1WNGREb2dkSEoxWlNBcUwxeHVYRzVqYjI1emRDQkRhR0Z5ZENBOUlISmxjWFZwY21Vb0p5NHZRMmhoY25RdWFuTjRKeWs3WEc1amIyNXpkQ0JOWldGemRYSmxVbTkzSUQwZ2NtVnhkV2x5WlNnbkxpOU5aV0Z6ZFhKbFVtOTNMbXB6ZUNjcE8xeHVYRzVqYjI1emRDQkVaWFJoYVd4V2FXVjNJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4dUlDQnlaVzVrWlhJNklHWjFibU4wYVc5dUtDa2dlMXh1SUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDBuWkdWMFlXbHNWbWxsZHljK1hHNGdJQ0FnSUNBZ0lEeE5aV0Z6ZFhKbFVtOTNJRzVoYldVOUoyMWxZWE4xY21VbklHeGhZbVZzY3oxN1d5ZEpMMDhuTENkRFVGVW5MQ2ROWVhCd1pYSnpKeXduVW1Wa2RXTmxjbk1uWFgwZ0x6NWNiaUFnSUNBZ0lDQWdQRU5vWVhKMElDOCtYRzRnSUNBZ0lDQThMMlJwZGo1Y2JpQWdJQ0FwTzF4dUlDQjlYRzU5S1R0Y2JseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQkVaWFJoYVd4V2FXVjNPMXh1SWwxOSIsIi8qanNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIEZpbHRlckJ1dHRvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6IFwiRmlsdGVyQnV0dG9uXCIsXG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgbGFiZWw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBoYW5kbGVyOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICBcImJ1dHRvblwiLFxuICAgICAgeyBvbkNsaWNrOiB0aGlzLnByb3BzLmhhbmRsZXIsIGNsYXNzTmFtZTogdGhpcy5wcm9wcy5jbGFzc05hbWUgfSxcbiAgICAgIHRoaXMucHJvcHMubGFiZWxcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaWx0ZXJCdXR0b247XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTluY21WbmIzSjVYMlp2YzNSbGNpOXZjR1Z1YzI5MWNtTmxYMmh2Ym1WNWNHOTBMMmh2Ym1WNWNHOTBMMlJsZGk5elkzSnBjSFJ6TDNWcEwwWnBiSFJsY2tKMWRIUnZiaTVxYzNnaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWpzN096dEJRVVZCTEVsQlFVMHNXVUZCV1N4SFFVRkhMRXRCUVVzc1EwRkJReXhYUVVGWExFTkJRVU03T3p0QlFVVnlReXhYUVVGVExFVkJRVVU3UVVGRFZDeFRRVUZMTEVWQlFVVXNTMEZCU3l4RFFVRkRMRk5CUVZNc1EwRkJReXhOUVVGTkxFTkJRVU1zVlVGQlZUdEJRVU40UXl4WFFVRlBMRVZCUVVVc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eEpRVUZKTEVOQlFVTXNWVUZCVlR0SFFVTjZRenM3UVVGRlJDeFJRVUZOTEVWQlFVVXNhMEpCUVZjN1FVRkRha0lzVjBGRFJUczdVVUZCVVN4UFFVRlBMRVZCUVVVc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFBRVUZQTEVGQlFVTXNSVUZCUXl4VFFVRlRMRVZCUVVVc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFRRVUZUTEVGQlFVTTdUVUZEYkVVc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eExRVUZMTzB0QlExWXNRMEZEVkR0SFFVTklPME5CUTBZc1EwRkJReXhEUVVGRE96dEJRVVZJTEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1dVRkJXU3hEUVVGRElpd2labWxzWlNJNklpOVZjMlZ5Y3k5bmNtVm5iM0o1WDJadmMzUmxjaTl2Y0dWdWMyOTFjbU5sWDJodmJtVjVjRzkwTDJodmJtVjVjRzkwTDJSbGRpOXpZM0pwY0hSekwzVnBMMFpwYkhSbGNrSjFkSFJ2Ymk1cWMzZ2lMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2S21wemFHbHVkQ0JsYzI1bGVIUTZJSFJ5ZFdVZ0tpOWNibHh1WTI5dWMzUWdSbWxzZEdWeVFuVjBkRzl1SUQwZ1VtVmhZM1F1WTNKbFlYUmxRMnhoYzNNb2UxeHVYRzRnSUhCeWIzQlVlWEJsY3pvZ2UxeHVJQ0FnSUd4aFltVnNPaUJTWldGamRDNVFjbTl3Vkhsd1pYTXVjM1J5YVc1bkxtbHpVbVZ4ZFdseVpXUXNYRzRnSUNBZ2FHRnVaR3hsY2pvZ1VtVmhZM1F1VUhKdmNGUjVjR1Z6TG1aMWJtTXVhWE5TWlhGMWFYSmxaQ3hjYmlBZ2ZTeGNibHh1SUNCeVpXNWtaWEk2SUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0E4WW5WMGRHOXVJRzl1UTJ4cFkyczllM1JvYVhNdWNISnZjSE11YUdGdVpHeGxjbjBnWTJ4aGMzTk9ZVzFsUFh0MGFHbHpMbkJ5YjNCekxtTnNZWE56VG1GdFpYMCtYRzRnSUNBZ0lDQWdJSHQwYUdsekxuQnliM0J6TG14aFltVnNmVnh1SUNBZ0lDQWdQQzlpZFhSMGIyNCtYRzRnSUNBZ0tUdGNiaUFnZlZ4dWZTazdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnUm1sc2RHVnlRblYwZEc5dU8xeHVJbDE5IiwiLy8gRklMVEVST1BUSU9OUk9XXG4vKmpzaGludCBlc25leHQ6IHRydWUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgRmlsdGVyQWN0aW9ucyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvRmlsdGVyQWN0aW9ucycpO1xudmFyIEZpbHRlckJ1dHRvbiA9IHJlcXVpcmUoJy4vRmlsdGVyQnV0dG9uLmpzeCcpO1xuXG52YXIgRmlsdGVyT3B0aW9uUm93ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ0ZpbHRlck9wdGlvblJvdycsXG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgbmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGxhYmVsczogUmVhY3QuUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWRcbiAgfSxcblxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4geyBzZWxlY3RlZDogMCB9O1xuICB9LFxuXG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbiBoYW5kbGVDbGljayhpbmRleCkge1xuICAgIGlmIChpbmRleCAhPSB0aGlzLnN0YXRlLnNlbGVjdGVkKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgc2VsZWN0ZWQ6IGluZGV4IH0pO1xuICAgICAgRmlsdGVyQWN0aW9ucy51cGRhdGVGaWx0ZXIodGhpcy5wcm9wcy5uYW1lLCB0aGlzLnByb3BzLmxhYmVsc1tpbmRleF0pO1xuICAgIH1cbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgc3BhbiA9IHVuZGVmaW5lZDtcblxuICAgIHN3aXRjaCAodGhpcy5wcm9wcy5sYWJlbHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIHNwYW4gPSAnaGFsZic7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBzcGFuID0gJ3RoaXJkJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDQ6XG4gICAgICAgIHNwYW4gPSAncXVhcnRlcic7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICdkaXYnLFxuICAgICAgeyBjbGFzc05hbWU6ICdmaWx0ZXJPcHRpb25Sb3cnIH0sXG4gICAgICB0aGlzLnByb3BzLmxhYmVscy5tYXAoZnVuY3Rpb24gKGN1ckxhYmVsLCBpKSB7XG4gICAgICAgIHZhciBzZWxlY3RlZCA9IGkgPT0gdGhpcy5zdGF0ZS5zZWxlY3RlZCA/ICdzZWxlY3RlZCcgOiAnZGVzZWxlY3RlZCc7XG5cbiAgICAgICAgdmFyIHByb3BzID0ge1xuICAgICAgICAgIGxhYmVsOiBjdXJMYWJlbCxcbiAgICAgICAgICBoYW5kbGVyOiB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcywgaSksXG4gICAgICAgICAgY2xhc3NOYW1lOiAnZmlsdGVyQnV0dG9uJyArICcgJyArIHNwYW4gKyAnICcgKyBzZWxlY3RlZFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChGaWx0ZXJCdXR0b24sIHByb3BzKTtcbiAgICAgIH0sIHRoaXMpXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRmlsdGVyT3B0aW9uUm93O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5bmNtVm5iM0o1WDJadmMzUmxjaTl2Y0dWdWMyOTFjbU5sWDJodmJtVjVjRzkwTDJodmJtVjVjRzkwTDJSbGRpOXpZM0pwY0hSekwzVnBMMFpwYkhSbGNrOXdkR2x2YmxKdmR5NXFjM2dpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanM3T3pzN1FVRkhRU3hKUVVGTkxHRkJRV0VzUjBGQlJ5eFBRVUZQTEVOQlFVTXNNRUpCUVRCQ0xFTkJRVU1zUTBGQlF6dEJRVU14UkN4SlFVRk5MRmxCUVZrc1IwRkJSeXhQUVVGUExFTkJRVU1zYjBKQlFXOUNMRU5CUVVNc1EwRkJRenM3UVVGRmJrUXNTVUZCVFN4bFFVRmxMRWRCUVVjc1MwRkJTeXhEUVVGRExGZEJRVmNzUTBGQlF6czdPMEZCUlhoRExGZEJRVk1zUlVGQlJUdEJRVU5VTEZGQlFVa3NSVUZCUlN4TFFVRkxMRU5CUVVNc1UwRkJVeXhEUVVGRExFMUJRVTBzUTBGQlF5eFZRVUZWTzBGQlEzWkRMRlZCUVUwc1JVRkJSU3hMUVVGTExFTkJRVU1zVTBGQlV5eERRVUZETEV0QlFVc3NRMEZCUXl4VlFVRlZPMGRCUTNwRE96dEJRVVZFTEdsQ1FVRmxMRVZCUVVVc01rSkJRVmM3UVVGRE1VSXNWMEZCVHl4RlFVRkRMRkZCUVZFc1JVRkJSU3hEUVVGRExFVkJRVU1zUTBGQlF6dEhRVU4wUWpzN1FVRkZSQ3hoUVVGWExFVkJRVVVzY1VKQlFWTXNTMEZCU3l4RlFVRkZPMEZCUXpOQ0xGRkJRVWtzUzBGQlN5eEpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1VVRkJVU3hGUVVGRk8wRkJRMmhETEZWQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1JVRkJReXhSUVVGUkxFVkJRVVVzUzBGQlN5eEZRVUZETEVOQlFVTXNRMEZCUXp0QlFVTnFReXh0UWtGQllTeERRVUZETEZsQlFWa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUlVGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTFCUVUwc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETzB0QlEzWkZPMGRCUTBZN08wRkJSVVFzVVVGQlRTeEZRVUZGTEd0Q1FVRlhPMEZCUTJwQ0xGRkJRVWtzU1VGQlNTeFpRVUZCTEVOQlFVTTdPMEZCUlZRc1dVRkJUeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEUxQlFVMHNRMEZCUXl4TlFVRk5PMEZCUXpkQ0xGZEJRVXNzUTBGQlF6dEJRVU5LTEZsQlFVa3NSMEZCUnl4TlFVRk5MRU5CUVVNN1FVRkRaQ3hqUVVGTk8wRkJRVUVzUVVGRFVpeFhRVUZMTEVOQlFVTTdRVUZEU2l4WlFVRkpMRWRCUVVjc1QwRkJUeXhEUVVGRE8wRkJRMllzWTBGQlRUdEJRVUZCTEVGQlExSXNWMEZCU3l4RFFVRkRPMEZCUTBvc1dVRkJTU3hIUVVGSExGTkJRVk1zUTBGQlF6dEJRVU5xUWl4alFVRk5PMEZCUVVFc1MwRkRWRHRCUVVORUxGZEJRMFU3TzFGQlFVc3NVMEZCVXl4RlFVRkRMR2xDUVVGcFFqdE5RVU0zUWl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFMUJRVTBzUTBGQlF5eEhRVUZITEVOQlFVTXNWVUZCVXl4UlFVRlJMRVZCUVVVc1EwRkJReXhGUVVGRk8wRkJRek5ETEZsQlFVMHNVVUZCVVN4SFFVRkhMRUZCUVVNc1EwRkJReXhKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVVUZCVVN4SFFVRkpMRlZCUVZVc1IwRkJSeXhaUVVGWkxFTkJRVUU3TzBGQlJYWkZMRmxCUVUwc1MwRkJTeXhIUVVGSE8wRkJRMW9zWlVGQlN5eEZRVUZETEZGQlFWRTdRVUZEWkN4cFFrRkJUeXhGUVVGRExFbEJRVWtzUTBGQlF5eFhRVUZYTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1JVRkJReXhEUVVGRExFTkJRVU03UVVGRGNrTXNiVUpCUVZNc1JVRkJReXhqUVVGakxFZEJRVU1zUjBGQlJ5eEhRVUZETEVsQlFVa3NSMEZCUXl4SFFVRkhMRWRCUVVNc1VVRkJVVHRUUVVNdlF5eERRVUZCTzBGQlEwUXNaVUZEUlN4dlFrRkJReXhaUVVGWkxFVkJRVXNzUzBGQlN5eERRVUZKTEVOQlF6TkNPMDlCUTBnc1JVRkJSU3hKUVVGSkxFTkJRVU03UzBGRFNpeERRVU5PTzBkQlEwZzdRMEZEUml4RFFVRkRMRU5CUVVNN08wRkJSVWdzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4bFFVRmxMRU5CUVVNaUxDSm1hV3hsSWpvaUwxVnpaWEp6TDJkeVpXZHZjbmxmWm05emRHVnlMMjl3Wlc1emIzVnlZMlZmYUc5dVpYbHdiM1F2YUc5dVpYbHdiM1F2WkdWMkwzTmpjbWx3ZEhNdmRXa3ZSbWxzZEdWeVQzQjBhVzl1VW05M0xtcHplQ0lzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWk4dklFWkpURlJGVWs5UVZFbFBUbEpQVjF4dUx5cHFjMmhwYm5RZ1pYTnVaWGgwT2lCMGNuVmxJQ292WEc1Y2JtTnZibk4wSUVacGJIUmxja0ZqZEdsdmJuTWdQU0J5WlhGMWFYSmxLQ2N1TGk5aFkzUnBiMjV6TDBacGJIUmxja0ZqZEdsdmJuTW5LVHRjYm1OdmJuTjBJRVpwYkhSbGNrSjFkSFJ2YmlBOUlISmxjWFZwY21Vb0p5NHZSbWxzZEdWeVFuVjBkRzl1TG1wemVDY3BPMXh1WEc1amIyNXpkQ0JHYVd4MFpYSlBjSFJwYjI1U2IzY2dQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEc1Y2JpQWdjSEp2Y0ZSNWNHVnpPaUI3WEc0Z0lDQWdibUZ0WlRvZ1VtVmhZM1F1VUhKdmNGUjVjR1Z6TG5OMGNtbHVaeTVwYzFKbGNYVnBjbVZrTEZ4dUlDQWdJR3hoWW1Wc2N6b2dVbVZoWTNRdVVISnZjRlI1Y0dWekxtRnljbUY1TG1selVtVnhkV2x5WldRZ1hHNGdJSDBzWEc1Y2JpQWdaMlYwU1c1cGRHbGhiRk4wWVhSbE9pQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z2UzTmxiR1ZqZEdWa09pQXdmVHRjYmlBZ2ZTeGNibHh1SUNCb1lXNWtiR1ZEYkdsamF6b2dablZ1WTNScGIyNG9hVzVrWlhncElIdGNiaUFnSUNCcFppQW9hVzVrWlhnZ0lUMGdkR2hwY3k1emRHRjBaUzV6Wld4bFkzUmxaQ2tnZTF4dUlDQWdJQ0FnZEdocGN5NXpaWFJUZEdGMFpTaDdjMlZzWldOMFpXUTZJR2x1WkdWNGZTazdYRzRnSUNBZ0lDQkdhV3gwWlhKQlkzUnBiMjV6TG5Wd1pHRjBaVVpwYkhSbGNpaDBhR2x6TG5CeWIzQnpMbTVoYldVc0lIUm9hWE11Y0hKdmNITXViR0ZpWld4elcybHVaR1Y0WFNrN1hHNGdJQ0FnZlZ4dUlDQjlMRnh1WEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ2JHVjBJSE53WVc0N1hHNWNiaUFnSUNCemQybDBZMmdvZEdocGN5NXdjbTl3Y3k1c1lXSmxiSE11YkdWdVozUm9LU0I3WEc0Z0lDQWdJQ0JqWVhObElESTZYRzRnSUNBZ0lDQWdJSE53WVc0Z1BTQW5hR0ZzWmljN1hHNGdJQ0FnSUNBZ0lHSnlaV0ZyTzF4dUlDQWdJQ0FnWTJGelpTQXpPbHh1SUNBZ0lDQWdJQ0J6Y0dGdUlEMGdKM1JvYVhKa0p6dGNiaUFnSUNBZ0lDQWdZbkpsWVdzN1hHNGdJQ0FnSUNCallYTmxJRFE2WEc0Z0lDQWdJQ0FnSUhOd1lXNGdQU0FuY1hWaGNuUmxjaWM3WEc0Z0lDQWdJQ0FnSUdKeVpXRnJPMXh1SUNBZ0lIMWNiaUFnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlKMlpwYkhSbGNrOXdkR2x2YmxKdmR5YytYRzRnSUNBZ0lDQWdJSHQwYUdsekxuQnliM0J6TG14aFltVnNjeTV0WVhBb1puVnVZM1JwYjI0b1kzVnlUR0ZpWld3c0lHa3BJSHRjYmlBZ0lDQWdJQ0FnSUNCamIyNXpkQ0J6Wld4bFkzUmxaQ0E5SUNocElEMDlJSFJvYVhNdWMzUmhkR1V1YzJWc1pXTjBaV1FwSUQ4Z0ozTmxiR1ZqZEdWa0p5QTZJQ2RrWlhObGJHVmpkR1ZrSjF4dVhHNGdJQ0FnSUNBZ0lDQWdZMjl1YzNRZ2NISnZjSE1nUFNCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0JzWVdKbGJEcGpkWEpNWVdKbGJDd2dYRzRnSUNBZ0lDQWdJQ0FnSUNCb1lXNWtiR1Z5T25Sb2FYTXVhR0Z1Wkd4bFEyeHBZMnN1WW1sdVpDaDBhR2x6TEdrcExGeHVJQ0FnSUNBZ0lDQWdJQ0FnWTJ4aGMzTk9ZVzFsT2lkbWFXeDBaWEpDZFhSMGIyNG5LeWNnSnl0emNHRnVLeWNnSnl0elpXeGxZM1JsWkZ4dUlDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdLRnh1SUNBZ0lDQWdJQ0FnSUNBZ1BFWnBiSFJsY2tKMWRIUnZiaUI3TGk0dWNISnZjSE45SUM4K1hHNGdJQ0FnSUNBZ0lDQWdLVHRjYmlBZ0lDQWdJQ0FnZlN3Z2RHaHBjeWw5WEc0Z0lDQWdJQ0E4TDJScGRqNWNiaUFnSUNBcE8xeHVJQ0I5WEc1OUtUdGNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JHYVd4MFpYSlBjSFJwYjI1U2IzYzdYRzRpWFgwPSIsIi8vIEZJTFRFUlJFU1VMVFJPV1xuLypqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIEZpbHRlclJlc3VsdFJvdyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdGaWx0ZXJSZXN1bHRSb3cnLFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBjbGFzc05hbWUgPSAnZmlsdGVyUmVzdWx0Um93JztcbiAgICBpZiAodGhpcy5wcm9wcy5zZWxlY3RlZCkge1xuICAgICAgY2xhc3NOYW1lID0gY2xhc3NOYW1lICsgJyBzZWxlY3RlZCc7XG4gICAgfVxuICAgIHZhciBmb3JtYXR0ZXIgPSBkMy5mb3JtYXQoJy4zcycpO1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ3RyJyxcbiAgICAgIHsgY2xhc3NOYW1lOiBjbGFzc05hbWUsIG9uQ2xpY2s6IHRoaXMucHJvcHMuaGFuZGxlciB9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ3RkJyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdmaWx0ZXJSZXN1bHRSb3dOYW1lJyB9LFxuICAgICAgICB0aGlzLnByb3BzLm5hbWVcbiAgICAgICksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAndGQnLFxuICAgICAgICB7IGNsYXNzTmFtZTogJ2ZpbHRlclJlc3VsdFJvd1ZhbHVlJyB9LFxuICAgICAgICBmb3JtYXR0ZXIodGhpcy5wcm9wcy52YWx1ZSlcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaWx0ZXJSZXN1bHRSb3c7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTluY21WbmIzSjVYMlp2YzNSbGNpOXZjR1Z1YzI5MWNtTmxYMmh2Ym1WNWNHOTBMMmh2Ym1WNWNHOTBMMlJsZGk5elkzSnBjSFJ6TDNWcEwwWnBiSFJsY2xKbGMzVnNkRkp2ZHk1cWMzZ2lYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqczdPenM3UVVGSFFTeEpRVUZOTEdWQlFXVXNSMEZCUnl4TFFVRkxMRU5CUVVNc1YwRkJWeXhEUVVGRE96czdRVUZEZUVNc1VVRkJUU3hGUVVGRkxHdENRVUZYTzBGQlEycENMRkZCUVVrc1UwRkJVeXhIUVVGSExHbENRVUZwUWl4RFFVRkRPMEZCUTJ4RExGRkJRVWtzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UlFVRlJMRVZCUVVVN1FVRkJReXhsUVVGVExFZEJRVWNzVTBGQlV5eEhRVUZITEZkQlFWY3NRMEZCUXp0TFFVRkRPMEZCUXk5RUxGRkJRVTBzVTBGQlV5eEhRVUZITEVWQlFVVXNRMEZCUXl4TlFVRk5MRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU03UVVGRGJrTXNWMEZEUlRzN1VVRkJTU3hUUVVGVExFVkJRVVVzVTBGQlV5eEJRVUZETEVWQlFVTXNUMEZCVHl4RlFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVDBGQlR5eEJRVUZETzAxQlEzQkVPenRWUVVGSkxGTkJRVk1zUlVGQlF5eHhRa0ZCY1VJN1VVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVazdUMEZCVFR0TlFVTXhSRHM3VlVGQlNTeFRRVUZUTEVWQlFVTXNjMEpCUVhOQ08xRkJRVVVzVTBGQlV5eERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJTeXhEUVVGRE8wOUJRVTA3UzBGRGNFVXNRMEZEVER0SFFVTklPME5CUTBZc1EwRkJReXhEUVVGRE96dEJRVVZJTEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1pVRkJaU3hEUVVGRElpd2labWxzWlNJNklpOVZjMlZ5Y3k5bmNtVm5iM0o1WDJadmMzUmxjaTl2Y0dWdWMyOTFjbU5sWDJodmJtVjVjRzkwTDJodmJtVjVjRzkwTDJSbGRpOXpZM0pwY0hSekwzVnBMMFpwYkhSbGNsSmxjM1ZzZEZKdmR5NXFjM2dpTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdkx5QkdTVXhVUlZKU1JWTlZURlJTVDFkY2JpOHFhbk5vYVc1MElHVnpibVY0ZERvZ2RISjFaU0FxTDF4dVhHNWpiMjV6ZENCR2FXeDBaWEpTWlhOMWJIUlNiM2NnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdiR1YwSUdOc1lYTnpUbUZ0WlNBOUlDZG1hV3gwWlhKU1pYTjFiSFJTYjNjbk8xeHVJQ0FnSUdsbUlDaDBhR2x6TG5CeWIzQnpMbk5sYkdWamRHVmtLU0I3WTJ4aGMzTk9ZVzFsSUQwZ1kyeGhjM05PWVcxbElDc2dKeUJ6Wld4bFkzUmxaQ2M3ZlZ4dUlDQWdJR052Ym5OMElHWnZjbTFoZEhSbGNpQTlJR1F6TG1admNtMWhkQ2duTGpOekp5azdYRzRnSUNBZ2NtVjBkWEp1SUNoY2JpQWdJQ0FnSUR4MGNpQmpiR0Z6YzA1aGJXVTllMk5zWVhOelRtRnRaWDBnYjI1RGJHbGphejE3ZEdocGN5NXdjbTl3Y3k1b1lXNWtiR1Z5ZlQ1Y2JpQWdJQ0FnSUNBZ1BIUmtJR05zWVhOelRtRnRaVDBuWm1sc2RHVnlVbVZ6ZFd4MFVtOTNUbUZ0WlNjK2UzUm9hWE11Y0hKdmNITXVibUZ0WlgwOEwzUmtQbHh1SUNBZ0lDQWdJQ0E4ZEdRZ1kyeGhjM05PWVcxbFBTZG1hV3gwWlhKU1pYTjFiSFJTYjNkV1lXeDFaU2MrZTJadmNtMWhkSFJsY2loMGFHbHpMbkJ5YjNCekxuWmhiSFZsS1gwOEwzUmtQbHh1SUNBZ0lDQWdQQzkwY2o1Y2JpQWdJQ0FwTzF4dUlDQjlYRzU5S1R0Y2JseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQkdhV3gwWlhKU1pYTjFiSFJTYjNjN1hHNGlYWDA9IiwiLy8gRklMVEVSUkVTVUxUU1RBQkxFXG4vKmpzaGludCBlc25leHQ6IHRydWUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgRmlsdGVyU3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZXMvRmlsdGVyU3RvcmUnKTtcbnZhciBGaWx0ZXJBY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9GaWx0ZXJBY3Rpb25zJyk7XG52YXIgRGV0YWlsVmlld0FjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL0RldGFpbFZpZXdBY3Rpb25zLmpzJyk7XG52YXIgRmlsdGVyUmVzdWx0Um93ID0gcmVxdWlyZSgnLi9GaWx0ZXJSZXN1bHRSb3cuanN4Jyk7XG5cbnZhciBGaWx0ZXJSZXN1bHRzVGFibGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnRmlsdGVyUmVzdWx0c1RhYmxlJyxcblxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdWx0czogRmlsdGVyU3RvcmUuZ2V0UmVzdWx0cygpLFxuICAgICAgaGVhZGVyczogRmlsdGVyU3RvcmUuZ2V0UmVzdWx0SGVhZGVycygpLFxuICAgICAgZGVzY3JpcHRpb246IEZpbHRlclN0b3JlLmdldERlc2NyaXB0aW9uU3RyaW5nKClcbiAgICB9O1xuICB9LFxuXG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbiBoYW5kbGVDbGljayhpbmRleCkge1xuICAgIERldGFpbFZpZXdBY3Rpb25zLnVwZGF0ZURldGFpbFZpZXcodGhpcy5zdGF0ZS5oZWFkZXJzWzBdLnJlcGxhY2UoJyBuYW1lJywgJycpLCB0aGlzLnN0YXRlLnJlc3VsdHNbaW5kZXhdLm5hbWUpO1xuXG4gICAgaWYgKEZpbHRlclN0b3JlLmlzU2hvd2luZ0RhZ3MoKSkge1xuICAgICAgRmlsdGVyQWN0aW9ucy51cGRhdGVGaWx0ZXIoXCJkYWdcIiwgdGhpcy5zdGF0ZS5yZXN1bHRzW2luZGV4XS5uYW1lKTtcbiAgICAgIERldGFpbFZpZXdBY3Rpb25zLnVwZGF0ZURhZyh0aGlzLnN0YXRlLnJlc3VsdHNbaW5kZXhdLm5hbWUpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0ZWQ6IGluZGV4XG4gICAgfSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIEZpbHRlclN0b3JlLmFkZEZpbHRlclJlc3VsdHNDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZSk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkVW5tb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkVW5tb3VudCgpIHtcbiAgICBGaWx0ZXJTdG9yZS5yZW1vdmVGaWx0ZXJSZXN1bHRzQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG4gIF9vbkNoYW5nZTogZnVuY3Rpb24gX29uQ2hhbmdlKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVzdWx0czogRmlsdGVyU3RvcmUuZ2V0UmVzdWx0cygpLFxuICAgICAgaGVhZGVyczogRmlsdGVyU3RvcmUuZ2V0UmVzdWx0SGVhZGVycygpLFxuICAgICAgZGVzY3JpcHRpb246IEZpbHRlclN0b3JlLmdldERlc2NyaXB0aW9uU3RyaW5nKClcbiAgICB9KTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5yZXN1bHRzKSB7XG4gICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ3RhYmxlJyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdmaWx0ZXJSZXN1bHRzJyB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdwJyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ2ZpbHRlckRlc2NyaXB0aW9uJyB9LFxuICAgICAgICAgIHRoaXMuc3RhdGUuZGVzY3JpcHRpb25cbiAgICAgICAgKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAndHInLFxuICAgICAgICAgIG51bGwsXG4gICAgICAgICAgdGhpcy5zdGF0ZS5oZWFkZXJzLm1hcChmdW5jdGlvbiAoaGVhZGVyLCBpKSB7XG4gICAgICAgICAgICB2YXIgbmFtZSA9ICdmaWx0ZXJSZXN1bHRSb3dWYWx1ZSc7XG4gICAgICAgICAgICBpZiAoaSA9PSAwKSBuYW1lID0gJ2ZpbHRlclJlc3VsdFJvd05hbWUnO1xuICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICd0aCcsXG4gICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiBuYW1lIH0sXG4gICAgICAgICAgICAgIGhlYWRlclxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9LCB0aGlzKVxuICAgICAgICApLFxuICAgICAgICB0aGlzLnN0YXRlLnJlc3VsdHMubWFwKGZ1bmN0aW9uIChyZXN1bHQsIGkpIHtcbiAgICAgICAgICAvLyBDcmVhdGUgYWxsIHRoZSByZXN1bHQgcm93c1xuICAgICAgICAgIHZhciByZXN1bHRzUm93UHJvcHMgPSB7XG4gICAgICAgICAgICBuYW1lOiByZXN1bHQubmFtZSxcbiAgICAgICAgICAgIGtleTogaSxcbiAgICAgICAgICAgIHZhbHVlOiBOdW1iZXIocmVzdWx0LnZhbHVlLnRvRml4ZWQoMSkpLFxuICAgICAgICAgICAgaGFuZGxlcjogdGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMsIGkpLFxuICAgICAgICAgICAgc2VsZWN0ZWQ6IGkgPT0gdGhpcy5zdGF0ZS5zZWxlY3RlZCA/IHRydWUgOiBmYWxzZVxuICAgICAgICAgIH07XG4gICAgICAgICAgLy8gU2hvcnRlbiBuYW1lIHRvIHByZXZlbnQgb3ZlcmZsb3dcbiAgICAgICAgICBpZiAocmVzdWx0c1Jvd1Byb3BzLm5hbWUubGVuZ3RoID4gMjUpIHtcbiAgICAgICAgICAgIHJlc3VsdHNSb3dQcm9wcy5uYW1lID0gcmVzdWx0c1Jvd1Byb3BzLm5hbWUuc2xpY2UoMCwgMjUpICsgJy4uLic7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRmlsdGVyUmVzdWx0Um93LCByZXN1bHRzUm93UHJvcHMpO1xuICAgICAgICB9LCB0aGlzKVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RhYmxlJywgeyBjbGFzc05hbWU6ICdmaWx0ZXJSZXN1bHRzJyB9KTtcbiAgICB9XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZpbHRlclJlc3VsdHNUYWJsZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OW5jbVZuYjNKNVgyWnZjM1JsY2k5dmNHVnVjMjkxY21ObFgyaHZibVY1Y0c5MEwyaHZibVY1Y0c5MEwyUmxkaTl6WTNKcGNIUnpMM1ZwTDBacGJIUmxjbEpsYzNWc2RITlVZV0pzWlM1cWMzZ2lYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqczdPenM3UVVGSFFTeEpRVUZOTEZkQlFWY3NSMEZCUnl4UFFVRlBMRU5CUVVNc2RVSkJRWFZDTEVOQlFVTXNRMEZCUXp0QlFVTnlSQ3hKUVVGTkxHRkJRV0VzUjBGQlJ5eFBRVUZQTEVOQlFVTXNNRUpCUVRCQ0xFTkJRVU1zUTBGQlF6dEJRVU14UkN4SlFVRk5MR2xDUVVGcFFpeEhRVUZITEU5QlFVOHNRMEZCUXl4cFEwRkJhVU1zUTBGQlF5eERRVUZETzBGQlEzSkZMRWxCUVUwc1pVRkJaU3hIUVVGSExFOUJRVThzUTBGQlF5eDFRa0ZCZFVJc1EwRkJReXhEUVVGRE96dEJRVVY2UkN4SlFVRk5MR3RDUVVGclFpeEhRVUZITEV0QlFVc3NRMEZCUXl4WFFVRlhMRU5CUVVNN096dEJRVU16UXl4cFFrRkJaU3hGUVVGRkxESkNRVUZYTzBGQlF6RkNMRmRCUVU4N1FVRkRUQ3hoUVVGUExFVkJRVVVzVjBGQlZ5eERRVUZETEZWQlFWVXNSVUZCUlR0QlFVTnFReXhoUVVGUExFVkJRVVVzVjBGQlZ5eERRVUZETEdkQ1FVRm5RaXhGUVVGRk8wRkJRM1pETEdsQ1FVRlhMRVZCUVVVc1YwRkJWeXhEUVVGRExHOUNRVUZ2UWl4RlFVRkZPMHRCUTJoRUxFTkJRVU03UjBGRFNEczdRVUZGUkN4aFFVRlhMRVZCUVVVc2NVSkJRVk1zUzBGQlN5eEZRVUZGTzBGQlF6TkNMSEZDUVVGcFFpeERRVUZETEdkQ1FVRm5RaXhEUVVOb1F5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eFBRVUZQTEVOQlFVTXNUMEZCVHl4RlFVRkZMRVZCUVVVc1EwRkJReXhGUVVNeFF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTlCUVU4c1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF5eEpRVUZKTEVOQlF5OUNMRU5CUVVNN08wRkJSVVlzVVVGQlNTeFhRVUZYTEVOQlFVTXNZVUZCWVN4RlFVRkZMRVZCUVVVN1FVRkRMMElzYlVKQlFXRXNRMEZCUXl4WlFVRlpMRU5CUVVNc1MwRkJTeXhGUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzBGQlEyeEZMSFZDUVVGcFFpeERRVUZETEZOQlFWTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFOUJRVThzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRMUVVNM1JEczdRVUZGUkN4UlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRE8wRkJRMW9zWTBGQlVTeEZRVUZGTEV0QlFVczdTMEZEYUVJc1EwRkJReXhEUVVGRE8wZEJRMG83TzBGQlJVUXNiVUpCUVdsQ0xFVkJRVVVzTmtKQlFWYzdRVUZETlVJc1pVRkJWeXhEUVVGRExEaENRVUU0UWl4RFFVRkRMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dEhRVU0xUkRzN1FVRkZSQ3h4UWtGQmJVSXNSVUZCUlN3clFrRkJWenRCUVVNNVFpeGxRVUZYTEVOQlFVTXNhVU5CUVdsRExFTkJRVU1zU1VGQlNTeERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRPMGRCUXk5RU96dEJRVVZFTEZkQlFWTXNSVUZCUlN4eFFrRkJWVHRCUVVOdVFpeFJRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRPMEZCUTFvc1lVRkJUeXhGUVVGRkxGZEJRVmNzUTBGQlF5eFZRVUZWTEVWQlFVVTdRVUZEYWtNc1lVRkJUeXhGUVVGRkxGZEJRVmNzUTBGQlF5eG5Ra0ZCWjBJc1JVRkJSVHRCUVVOMlF5eHBRa0ZCVnl4RlFVRkZMRmRCUVZjc1EwRkJReXh2UWtGQmIwSXNSVUZCUlR0TFFVTm9SQ3hEUVVGRExFTkJRVU03UjBGRFNqczdRVUZGUkN4UlFVRk5MRVZCUVVVc2EwSkJRVmM3UVVGRGFrSXNVVUZCU1N4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFOUJRVThzUlVGQlJUdEJRVU4wUWl4aFFVTkZPenRWUVVGUExGTkJRVk1zUlVGQlF5eGxRVUZsTzFGQlF6bENPenRaUVVGSExGTkJRVk1zUlVGQlF5eHRRa0ZCYlVJN1ZVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZkQlFWYzdVMEZCU3p0UlFVTTNSRHM3TzFWQlEwY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhQUVVGUExFTkJRVU1zUjBGQlJ5eERRVUZETEZWQlFWTXNUVUZCVFN4RlFVRkZMRU5CUVVNc1JVRkJRenRCUVVONlF5eG5Ra0ZCU1N4SlFVRkpMRWRCUVVjc2MwSkJRWE5DTEVOQlFVTTdRVUZEYkVNc1owSkJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNSVUZCUlN4SlFVRkpMRWRCUVVjc2NVSkJRWEZDTEVOQlFVTTdRVUZEZWtNc2JVSkJRMFU3TzJkQ1FVRkpMRk5CUVZNc1JVRkJSU3hKUVVGSkxFRkJRVU03WTBGQlJTeE5RVUZOTzJGQlFVMHNRMEZEYkVNN1YwRkRTQ3hGUVVGRkxFbEJRVWtzUTBGQlF6dFRRVU5NTzFGQlEwb3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhQUVVGUExFTkJRVU1zUjBGQlJ5eERRVUZETEZWQlFWTXNUVUZCVFN4RlFVRkZMRU5CUVVNc1JVRkJRenM3UVVGRmVrTXNZMEZCU1N4bFFVRmxMRWRCUVVjN1FVRkRjRUlzWjBKQlFVa3NSVUZCUlN4TlFVRk5MRU5CUVVNc1NVRkJTVHRCUVVOcVFpeGxRVUZITEVWQlFVVXNRMEZCUXp0QlFVTk9MR2xDUVVGTExFVkJRVVVzVFVGQlRTeERRVUZETEUxQlFVMHNRMEZCUXl4TFFVRkxMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzBGQlEzUkRMRzFDUVVGUExFVkJRVU1zU1VGQlNTeERRVUZETEZkQlFWY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hGUVVGRExFTkJRVU1zUTBGQlF6dEJRVU55UXl4dlFrRkJVU3hGUVVGRExFRkJRVU1zUTBGQlF5eEpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1VVRkJVU3hIUVVGSkxFbEJRVWtzUjBGQlJ5eExRVUZMTzFkQlEyNUVMRU5CUVVFN08wRkJSVVFzWTBGQlNTeGxRVUZsTEVOQlFVTXNTVUZCU1N4RFFVRkRMRTFCUVUwc1IwRkJSeXhGUVVGRkxFVkJRVU03UVVGRGJrTXNNa0pCUVdVc1EwRkJReXhKUVVGSkxFZEJRVWNzWlVGQlpTeERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhGUVVGRExFVkJRVVVzUTBGQlF5eEhRVUZITEV0QlFVc3NRMEZCUXp0WFFVTnFSVHM3UVVGRlJDeHBRa0ZCVXl4dlFrRkJReXhsUVVGbExFVkJRVTBzWlVGQlpTeERRVUZKTEVOQlFVYzdVMEZEZEVRc1JVRkJSU3hKUVVGSkxFTkJRVU03VDBGRFJpeERRVU5TTzB0QlEwZ3NUVUZEU1R0QlFVTklMR0ZCUTBVc0swSkJRVThzVTBGQlV5eEZRVUZETEdWQlFXVXNSMEZCVXl4RFFVTjZRenRMUVVOSU8wZEJRMFk3UTBGRFJpeERRVUZETEVOQlFVTTdPMEZCUlVnc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eHJRa0ZCYTBJc1EwRkJReUlzSW1acGJHVWlPaUl2VlhObGNuTXZaM0psWjI5eWVWOW1iM04wWlhJdmIzQmxibk52ZFhKalpWOW9iMjVsZVhCdmRDOW9iMjVsZVhCdmRDOWtaWFl2YzJOeWFYQjBjeTkxYVM5R2FXeDBaWEpTWlhOMWJIUnpWR0ZpYkdVdWFuTjRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpTHk4Z1JrbE1WRVZTVWtWVFZVeFVVMVJCUWt4RlhHNHZLbXB6YUdsdWRDQmxjMjVsZUhRNklIUnlkV1VnS2k5Y2JseHVZMjl1YzNRZ1JtbHNkR1Z5VTNSdmNtVWdQU0J5WlhGMWFYSmxLQ2N1TGk5emRHOXlaWE12Um1sc2RHVnlVM1J2Y21VbktUdGNibU52Ym5OMElFWnBiSFJsY2tGamRHbHZibk1nUFNCeVpYRjFhWEpsS0NjdUxpOWhZM1JwYjI1ekwwWnBiSFJsY2tGamRHbHZibk1uS1R0Y2JtTnZibk4wSUVSbGRHRnBiRlpwWlhkQlkzUnBiMjV6SUQwZ2NtVnhkV2x5WlNnbkxpNHZZV04wYVc5dWN5OUVaWFJoYVd4V2FXVjNRV04wYVc5dWN5NXFjeWNwTzF4dVkyOXVjM1FnUm1sc2RHVnlVbVZ6ZFd4MFVtOTNJRDBnY21WeGRXbHlaU2duTGk5R2FXeDBaWEpTWlhOMWJIUlNiM2N1YW5ONEp5azdYRzVjYm1OdmJuTjBJRVpwYkhSbGNsSmxjM1ZzZEhOVVlXSnNaU0E5SUZKbFlXTjBMbU55WldGMFpVTnNZWE56S0h0Y2JpQWdaMlYwU1c1cGRHbGhiRk4wWVhSbE9pQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z2UxeHVJQ0FnSUNBZ2NtVnpkV3gwY3pvZ1JtbHNkR1Z5VTNSdmNtVXVaMlYwVW1WemRXeDBjeWdwTENCY2JpQWdJQ0FnSUdobFlXUmxjbk02SUVacGJIUmxjbE4wYjNKbExtZGxkRkpsYzNWc2RFaGxZV1JsY25Nb0tTeGNiaUFnSUNBZ0lHUmxjMk55YVhCMGFXOXVPaUJHYVd4MFpYSlRkRzl5WlM1blpYUkVaWE5qY21sd2RHbHZibE4wY21sdVp5Z3BYRzRnSUNBZ2ZUdGNiaUFnZlN4Y2JseHVJQ0JvWVc1a2JHVkRiR2xqYXpvZ1puVnVZM1JwYjI0b2FXNWtaWGdwSUh0Y2JpQWdJQ0JFWlhSaGFXeFdhV1YzUVdOMGFXOXVjeTUxY0dSaGRHVkVaWFJoYVd4V2FXVjNLRnh1SUNBZ0lDQWdkR2hwY3k1emRHRjBaUzVvWldGa1pYSnpXekJkTG5KbGNHeGhZMlVvSnlCdVlXMWxKeXdnSnljcExGeHVJQ0FnSUNBZ2RHaHBjeTV6ZEdGMFpTNXlaWE4xYkhSelcybHVaR1Y0WFM1dVlXMWxYRzRnSUNBZ0tUdGNibHh1SUNBZ0lHbG1JQ2hHYVd4MFpYSlRkRzl5WlM1cGMxTm9iM2RwYm1kRVlXZHpLQ2twSUh0Y2JpQWdJQ0FnSUVacGJIUmxja0ZqZEdsdmJuTXVkWEJrWVhSbFJtbHNkR1Z5S0Z3aVpHRm5YQ0lzSUhSb2FYTXVjM1JoZEdVdWNtVnpkV3gwYzF0cGJtUmxlRjB1Ym1GdFpTazdYRzRnSUNBZ0lDQkVaWFJoYVd4V2FXVjNRV04wYVc5dWN5NTFjR1JoZEdWRVlXY29kR2hwY3k1emRHRjBaUzV5WlhOMWJIUnpXMmx1WkdWNFhTNXVZVzFsS1R0Y2JpQWdJQ0I5WEc0Z0lDQWdYRzRnSUNBZ2RHaHBjeTV6WlhSVGRHRjBaU2g3WEc0Z0lDQWdJQ0J6Wld4bFkzUmxaRG9nYVc1a1pYaGNiaUFnSUNCOUtUdGNiaUFnZlN4Y2JseHVJQ0JqYjIxd2IyNWxiblJFYVdSTmIzVnVkRG9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnUm1sc2RHVnlVM1J2Y21VdVlXUmtSbWxzZEdWeVVtVnpkV3gwYzBOb1lXNW5aVXhwYzNSbGJtVnlLSFJvYVhNdVgyOXVRMmhoYm1kbEtUc2dYRzRnSUgwc1hHNWNiaUFnWTI5dGNHOXVaVzUwUkdsa1ZXNXRiM1Z1ZERvZ1puVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ1JtbHNkR1Z5VTNSdmNtVXVjbVZ0YjNabFJtbHNkR1Z5VW1WemRXeDBjME5vWVc1blpVeHBjM1JsYm1WeUtIUm9hWE11WDI5dVEyaGhibWRsS1RzZ1hHNGdJSDBzWEc1Y2JpQWdYMjl1UTJoaGJtZGxPaUJtZFc1amRHbHZiaWdwZTF4dUlDQWdJSFJvYVhNdWMyVjBVM1JoZEdVb2UxeHVJQ0FnSUNBZ2NtVnpkV3gwY3pvZ1JtbHNkR1Z5VTNSdmNtVXVaMlYwVW1WemRXeDBjeWdwTEZ4dUlDQWdJQ0FnYUdWaFpHVnljem9nUm1sc2RHVnlVM1J2Y21VdVoyVjBVbVZ6ZFd4MFNHVmhaR1Z5Y3lncExGeHVJQ0FnSUNBZ1pHVnpZM0pwY0hScGIyNDZJRVpwYkhSbGNsTjBiM0psTG1kbGRFUmxjMk55YVhCMGFXOXVVM1J5YVc1bktDbGNiaUFnSUNCOUtUdGNiaUFnZlN4Y2JseHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQWdJR2xtSUNoMGFHbHpMbk4wWVhSbExuSmxjM1ZzZEhNcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBZ0lEeDBZV0pzWlNCamJHRnpjMDVoYldVOUoyWnBiSFJsY2xKbGMzVnNkSE1uUGx4dUlDQWdJQ0FnSUNBZ0lEeHdJR05zWVhOelRtRnRaVDBuWm1sc2RHVnlSR1Z6WTNKcGNIUnBiMjRuUG50MGFHbHpMbk4wWVhSbExtUmxjMk55YVhCMGFXOXVmVHd2Y0Q1Y2JpQWdJQ0FnSUNBZ0lDQThkSEkrWEc0Z0lDQWdJQ0FnSUNBZ0lDQjdkR2hwY3k1emRHRjBaUzVvWldGa1pYSnpMbTFoY0NobWRXNWpkR2x2Ymlob1pXRmtaWElzSUdrcGUxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCc1pYUWdibUZ0WlNBOUlDZG1hV3gwWlhKU1pYTjFiSFJTYjNkV1lXeDFaU2M3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJR2xtSUNocElEMDlJREFwSUc1aGJXVWdQU0FuWm1sc2RHVnlVbVZ6ZFd4MFVtOTNUbUZ0WlNjN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhSb0lHTnNZWE56VG1GdFpUMTdibUZ0WlgwK2UyaGxZV1JsY24wOEwzUm9QbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQXBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2ZTd2dkR2hwY3lsOVhHNGdJQ0FnSUNBZ0lDQWdQQzkwY2o1Y2JpQWdJQ0FnSUNBZ0lDQjdkR2hwY3k1emRHRjBaUzV5WlhOMWJIUnpMbTFoY0NobWRXNWpkR2x2YmloeVpYTjFiSFFzSUdrcGUxeHVJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z1EzSmxZWFJsSUdGc2JDQjBhR1VnY21WemRXeDBJSEp2ZDNOY2JpQWdJQ0FnSUNBZ0lDQWdJR3hsZENCeVpYTjFiSFJ6VW05M1VISnZjSE1nUFNCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUc1aGJXVTZJSEpsYzNWc2RDNXVZVzFsTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0JyWlhrNklHa3NYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lIWmhiSFZsT2lCT2RXMWlaWElvY21WemRXeDBMblpoYkhWbExuUnZSbWw0WldRb01Ta3BMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQm9ZVzVrYkdWeU9uUm9hWE11YUdGdVpHeGxRMnhwWTJzdVltbHVaQ2gwYUdsekxHa3BMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQnpaV3hsWTNSbFpEb29hU0E5UFNCMGFHbHpMbk4wWVhSbExuTmxiR1ZqZEdWa0tTQS9JSFJ5ZFdVZ09pQm1ZV3h6WlZ4dUlDQWdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0FnSUNBZ0x5OGdVMmh2Y25SbGJpQnVZVzFsSUhSdklIQnlaWFpsYm5RZ2IzWmxjbVpzYjNkY2JpQWdJQ0FnSUNBZ0lDQWdJR2xtSUNoeVpYTjFiSFJ6VW05M1VISnZjSE11Ym1GdFpTNXNaVzVuZEdnZ1BpQXlOU2w3SUZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0J5WlhOMWJIUnpVbTkzVUhKdmNITXVibUZ0WlNBOUlISmxjM1ZzZEhOU2IzZFFjbTl3Y3k1dVlXMWxMbk5zYVdObEtEQXNNalVwSUNzZ0p5NHVMaWM3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlBb0lEeEdhV3gwWlhKU1pYTjFiSFJTYjNjZ0lIc3VMaTV5WlhOMWJIUnpVbTkzVUhKdmNITjlJQzgrSUNrN1hHNGdJQ0FnSUNBZ0lDQWdmU3dnZEdocGN5bDlYRzRnSUNBZ0lDQWdJRHd2ZEdGaWJHVStJRnh1SUNBZ0lDQWdLVHRjYmlBZ0lDQjlYRzRnSUNBZ1pXeHpaU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdLRnh1SUNBZ0lDQWdJQ0E4ZEdGaWJHVWdZMnhoYzNOT1lXMWxQU2RtYVd4MFpYSlNaWE4xYkhSekp6NDhMM1JoWW14bFBseHVJQ0FnSUNBZ0tUdGNiaUFnSUNCOVhHNGdJSDFjYm4wcE8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRVpwYkhSbGNsSmxjM1ZzZEhOVVlXSnNaVHRjYmlKZGZRPT0iLCIvKmpzaGludCBlc25leHQ6IHRydWUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgRGV0YWlsVmlld1N0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL0RldGFpbFZpZXdTdG9yZScpO1xudmFyIERldGFpbFZpZXdBY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9EZXRhaWxWaWV3QWN0aW9ucycpO1xudmFyIEZpbHRlckJ1dHRvbiA9IHJlcXVpcmUoJy4vRmlsdGVyQnV0dG9uLmpzeCcpO1xuXG52YXIgTWVhc3VyZVJvdyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdNZWFzdXJlUm93JyxcblxuICBwcm9wVHlwZXM6IHtcbiAgICBsYWJlbHM6IFJlYWN0LlByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkXG4gIH0sXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIHsgc2VsZWN0ZWQ6IDAgfTtcbiAgfSxcblxuICBoYW5kbGVDbGljazogZnVuY3Rpb24gaGFuZGxlQ2xpY2soaW5kZXgpIHtcbiAgICBpZiAoaW5kZXggIT0gdGhpcy5zdGF0ZS5zZWxlY3RlZCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNlbGVjdGVkOiBpbmRleCB9KTtcbiAgICAgIERldGFpbFZpZXdBY3Rpb25zLnVwZGF0ZU1lYXN1cmUodGhpcy5wcm9wcy5sYWJlbHNbaW5kZXhdKTtcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuKFxuICAgICAgLy8gQ3JlYXRlIGEgcmFkaW8gYnV0dG9uIGZvciBlYWNoIGxhYmVsIHBhc3NlZCBpbiB0byB0aGUgcHJvcHNcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdkaXYnLFxuICAgICAgICB7IGNsYXNzTmFtZTogJ21lYXN1cmVSb3cnIH0sXG4gICAgICAgIHRoaXMucHJvcHMubGFiZWxzLm1hcChmdW5jdGlvbiAoY3VyTGFiZWwsIGkpIHtcbiAgICAgICAgICB2YXIgc2VsZWN0ZWQgPSBpID09IHRoaXMuc3RhdGUuc2VsZWN0ZWQgPyAnc2VsZWN0ZWQnIDogJ2Rlc2VsZWN0ZWQnO1xuXG4gICAgICAgICAgdmFyIGZpbHRlckJ1dHRvblByb3BzID0ge1xuICAgICAgICAgICAgbGFiZWw6IGN1ckxhYmVsLFxuICAgICAgICAgICAgaGFuZGxlcjogdGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMsIGkpLFxuICAgICAgICAgICAgY2xhc3NOYW1lOiAnZmlsdGVyQnV0dG9uJyArICcgJyArIHNlbGVjdGVkXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KEZpbHRlckJ1dHRvbiwgZmlsdGVyQnV0dG9uUHJvcHMpO1xuICAgICAgICB9LCB0aGlzKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1lYXN1cmVSb3c7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTluY21WbmIzSjVYMlp2YzNSbGNpOXZjR1Z1YzI5MWNtTmxYMmh2Ym1WNWNHOTBMMmh2Ym1WNWNHOTBMMlJsZGk5elkzSnBjSFJ6TDNWcEwwMWxZWE4xY21WU2IzY3Vhbk40SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN1FVRkZRU3hKUVVGTkxHVkJRV1VzUjBGQlJ5eFBRVUZQTEVOQlFVTXNNa0pCUVRKQ0xFTkJRVU1zUTBGQlF6dEJRVU0zUkN4SlFVRk5MR2xDUVVGcFFpeEhRVUZITEU5QlFVOHNRMEZCUXl3NFFrRkJPRUlzUTBGQlF5eERRVUZETzBGQlEyeEZMRWxCUVUwc1dVRkJXU3hIUVVGSExFOUJRVThzUTBGQlF5eHZRa0ZCYjBJc1EwRkJReXhEUVVGRE96dEJRVVZ1UkN4SlFVRk5MRlZCUVZVc1IwRkJSeXhMUVVGTExFTkJRVU1zVjBGQlZ5eERRVUZET3pzN1FVRkZia01zVjBGQlV5eEZRVUZGTzBGQlExUXNWVUZCVFN4RlFVRkZMRXRCUVVzc1EwRkJReXhUUVVGVExFTkJRVU1zUzBGQlN5eERRVUZETEZWQlFWVTdSMEZEZWtNN08wRkJSVVFzYVVKQlFXVXNSVUZCUlN3eVFrRkJWenRCUVVNeFFpeFhRVUZQTEVWQlFVTXNVVUZCVVN4RlFVRkZMRU5CUVVNc1JVRkJReXhEUVVGRE8wZEJRM1JDT3p0QlFVVkVMR0ZCUVZjc1JVRkJSU3h4UWtGQlV5eExRVUZMTEVWQlFVVTdRVUZETTBJc1VVRkJTU3hMUVVGTExFbEJRVWtzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UlFVRlJMRVZCUVVVN1FVRkRhRU1zVlVGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4RlFVRkRMRkZCUVZFc1JVRkJSU3hMUVVGTExFVkJRVU1zUTBGQlF5eERRVUZETzBGQlEycERMSFZDUVVGcFFpeERRVUZETEdGQlFXRXNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFMUJRVTBzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRPMHRCUXpORU8wZEJRMFk3TzBGQlJVUXNVVUZCVFN4RlFVRkZMR3RDUVVGWE8wRkJRMnBDT3p0QlFVVkZPenRWUVVGTExGTkJRVk1zUlVGQlF5eFpRVUZaTzFGQlEzaENMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVFVGQlRTeERRVUZETEVkQlFVY3NRMEZCUXl4VlFVRlRMRkZCUVZFc1JVRkJSU3hEUVVGRExFVkJRVVU3UVVGRE0wTXNZMEZCVFN4UlFVRlJMRWRCUVVjc1FVRkJReXhEUVVGRExFbEJRVWtzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UlFVRlJMRWRCUVVrc1ZVRkJWU3hIUVVGSExGbEJRVmtzUTBGQlFUczdRVUZGZGtVc1kwRkJUU3hwUWtGQmFVSXNSMEZCUnp0QlFVTjRRaXhwUWtGQlN5eEZRVUZETEZGQlFWRTdRVUZEWkN4dFFrRkJUeXhGUVVGRExFbEJRVWtzUTBGQlF5eFhRVUZYTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1JVRkJReXhEUVVGRExFTkJRVU03UVVGRGNrTXNjVUpCUVZNc1JVRkJReXhqUVVGakxFZEJRVU1zUjBGQlJ5eEhRVUZETEZGQlFWRTdWMEZEZEVNc1EwRkJRVHM3UVVGRlJDeHBRa0ZEUlN4dlFrRkJReXhaUVVGWkxFVkJRVXNzYVVKQlFXbENMRU5CUVVrc1EwRkRka003VTBGRFNDeEZRVUZGTEVsQlFVa3NRMEZCUXp0UFFVTktPMDFCUTA0N1IwRkRTRHREUVVOR0xFTkJRVU1zUTBGQlF6czdRVUZGU0N4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExGVkJRVlVzUTBGQlF5SXNJbVpwYkdVaU9pSXZWWE5sY25NdlozSmxaMjl5ZVY5bWIzTjBaWEl2YjNCbGJuTnZkWEpqWlY5b2IyNWxlWEJ2ZEM5b2IyNWxlWEJ2ZEM5a1pYWXZjMk55YVhCMGN5OTFhUzlOWldGemRYSmxVbTkzTG1wemVDSXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaThxYW5Ob2FXNTBJR1Z6Ym1WNGREb2dkSEoxWlNBcUwxeHVYRzVqYjI1emRDQkVaWFJoYVd4V2FXVjNVM1J2Y21VZ1BTQnlaWEYxYVhKbEtDY3VMaTl6ZEc5eVpYTXZSR1YwWVdsc1ZtbGxkMU4wYjNKbEp5azdYRzVqYjI1emRDQkVaWFJoYVd4V2FXVjNRV04wYVc5dWN5QTlJSEpsY1hWcGNtVW9KeTR1TDJGamRHbHZibk12UkdWMFlXbHNWbWxsZDBGamRHbHZibk1uS1R0Y2JtTnZibk4wSUVacGJIUmxja0oxZEhSdmJpQTlJSEpsY1hWcGNtVW9KeTR2Um1sc2RHVnlRblYwZEc5dUxtcHplQ2NwTzF4dVhHNWpiMjV6ZENCTlpXRnpkWEpsVW05M0lEMGdVbVZoWTNRdVkzSmxZWFJsUTJ4aGMzTW9lMXh1WEc0Z0lIQnliM0JVZVhCbGN6b2dlMXh1SUNBZ0lHeGhZbVZzY3pvZ1VtVmhZM1F1VUhKdmNGUjVjR1Z6TG1GeWNtRjVMbWx6VW1WeGRXbHlaV1FnWEc0Z0lIMHNYRzVjYmlBZ1oyVjBTVzVwZEdsaGJGTjBZWFJsT2lCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNCeVpYUjFjbTRnZTNObGJHVmpkR1ZrT2lBd2ZUdGNiaUFnZlN4Y2JseHVJQ0JvWVc1a2JHVkRiR2xqYXpvZ1puVnVZM1JwYjI0b2FXNWtaWGdwSUh0Y2JpQWdJQ0JwWmlBb2FXNWtaWGdnSVQwZ2RHaHBjeTV6ZEdGMFpTNXpaV3hsWTNSbFpDa2dlMXh1SUNBZ0lDQWdkR2hwY3k1elpYUlRkR0YwWlNoN2MyVnNaV04wWldRNklHbHVaR1Y0ZlNrN1hHNGdJQ0FnSUNCRVpYUmhhV3hXYVdWM1FXTjBhVzl1Y3k1MWNHUmhkR1ZOWldGemRYSmxLSFJvYVhNdWNISnZjSE11YkdGaVpXeHpXMmx1WkdWNFhTazdYRzRnSUNBZ2ZWeHVJQ0I5TEZ4dVhHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lDOHZJRU55WldGMFpTQmhJSEpoWkdsdklHSjFkSFJ2YmlCbWIzSWdaV0ZqYUNCc1lXSmxiQ0J3WVhOelpXUWdhVzRnZEc4Z2RHaGxJSEJ5YjNCelhHNGdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDBuYldWaGMzVnlaVkp2ZHljK1hHNGdJQ0FnSUNBZ0lIdDBhR2x6TG5CeWIzQnpMbXhoWW1Wc2N5NXRZWEFvWm5WdVkzUnBiMjRvWTNWeVRHRmlaV3dzSUdrcElIdGNiaUFnSUNBZ0lDQWdJQ0JqYjI1emRDQnpaV3hsWTNSbFpDQTlJQ2hwSUQwOUlIUm9hWE11YzNSaGRHVXVjMlZzWldOMFpXUXBJRDhnSjNObGJHVmpkR1ZrSnlBNklDZGtaWE5sYkdWamRHVmtKMXh1WEc0Z0lDQWdJQ0FnSUNBZ1kyOXVjM1FnWm1sc2RHVnlRblYwZEc5dVVISnZjSE1nUFNCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0JzWVdKbGJEcGpkWEpNWVdKbGJDd2dYRzRnSUNBZ0lDQWdJQ0FnSUNCb1lXNWtiR1Z5T25Sb2FYTXVhR0Z1Wkd4bFEyeHBZMnN1WW1sdVpDaDBhR2x6TEdrcExGeHVJQ0FnSUNBZ0lDQWdJQ0FnWTJ4aGMzTk9ZVzFsT2lkbWFXeDBaWEpDZFhSMGIyNG5LeWNnSnl0elpXeGxZM1JsWkZ4dUlDQWdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0FnSUNBZ0lDQThSbWxzZEdWeVFuVjBkRzl1SUhzdUxpNW1hV3gwWlhKQ2RYUjBiMjVRY205d2MzMGdMejVjYmlBZ0lDQWdJQ0FnSUNBcE8xeHVJQ0FnSUNBZ0lDQjlMQ0IwYUdsektYMWNiaUFnSUNBZ0lEd3ZaR2wyUGx4dUlDQWdJQ2s3WEc0Z0lIMWNibjBwTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlFMWxZWE4xY21WU2IzYzdYRzRpWFgwPSIsIi8vIFNFQVJDSEJPWFxuLypqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIEZpbHRlckFjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL0ZpbHRlckFjdGlvbnMnKTtcblxudmFyIFNlYXJjaEJveCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdTZWFyY2hCb3gnLFxuXG4gIGhhbmRsZUNoYW5nZTogZnVuY3Rpb24gaGFuZGxlQ2hhbmdlKGUpIHtcbiAgICBGaWx0ZXJBY3Rpb25zLnVwZGF0ZVNlYXJjaChlLnRhcmdldC52YWx1ZSk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnZm9ybScsXG4gICAgICB7IGNsYXNzTmFtZTogJ3NlYXJjaEJveCcsXG4gICAgICAgIG9uQ2hhbmdlOiB0aGlzLmhhbmRsZUNoYW5nZSxcbiAgICAgICAgb25TdWJtaXQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdpbnB1dCcsIHsgdHlwZTogJ3RleHQnLCBwbGFjZWhvbGRlcjogJ2ZpbHRlcicsIHJlZjogJ3NlYXJjaFRleHQnIH0pXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gU2VhcmNoQm94O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5bmNtVm5iM0o1WDJadmMzUmxjaTl2Y0dWdWMyOTFjbU5sWDJodmJtVjVjRzkwTDJodmJtVjVjRzkwTDJSbGRpOXpZM0pwY0hSekwzVnBMMU5sWVhKamFFSnZlQzVxYzNnaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWpzN096czdRVUZIUVN4SlFVRk5MR0ZCUVdFc1IwRkJSeXhQUVVGUExFTkJRVU1zTUVKQlFUQkNMRU5CUVVNc1EwRkJRenM3UVVGRk1VUXNTVUZCVFN4VFFVRlRMRWRCUVVjc1MwRkJTeXhEUVVGRExGZEJRVmNzUTBGQlF6czdPMEZCUTJ4RExHTkJRVmtzUlVGQlJTeHpRa0ZCVXl4RFFVRkRMRVZCUVVVN1FVRkRlRUlzYVVKQlFXRXNRMEZCUXl4WlFVRlpMRU5CUVVNc1EwRkJReXhEUVVGRExFMUJRVTBzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXp0SFFVTTFRenM3UVVGRlJDeFJRVUZOTEVWQlFVVXNhMEpCUVZjN1FVRkRha0lzVjBGRFJUczdVVUZCVFN4VFFVRlRMRVZCUVVNc1YwRkJWenRCUVVONlFpeG5Ra0ZCVVN4RlFVRkZMRWxCUVVrc1EwRkJReXhaUVVGWkxFRkJRVU03UVVGRE5VSXNaMEpCUVZFc1JVRkJSU3hWUVVGVExFTkJRVU1zUlVGQlF6dEJRVUZETEdsQ1FVRlBMRXRCUVVzc1EwRkJRenRUUVVGRExFRkJRVU03VFVGRGNrTXNLMEpCUVU4c1NVRkJTU3hGUVVGRExFMUJRVTBzUlVGQlF5eFhRVUZYTEVWQlFVTXNVVUZCVVN4RlFVRkRMRWRCUVVjc1JVRkJReXhaUVVGWkxFZEJRVWM3UzBGRGRFUXNRMEZEVUR0SFFVTklPME5CUTBZc1EwRkJReXhEUVVGRE96dEJRVVZJTEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1UwRkJVeXhEUVVGRElpd2labWxzWlNJNklpOVZjMlZ5Y3k5bmNtVm5iM0o1WDJadmMzUmxjaTl2Y0dWdWMyOTFjbU5sWDJodmJtVjVjRzkwTDJodmJtVjVjRzkwTDJSbGRpOXpZM0pwY0hSekwzVnBMMU5sWVhKamFFSnZlQzVxYzNnaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZMeUJUUlVGU1EwaENUMWhjYmk4cWFuTm9hVzUwSUdWemJtVjRkRG9nZEhKMVpTQXFMMXh1WEc1amIyNXpkQ0JHYVd4MFpYSkJZM1JwYjI1eklEMGdjbVZ4ZFdseVpTZ25MaTR2WVdOMGFXOXVjeTlHYVd4MFpYSkJZM1JwYjI1ekp5azdYRzVjYm1OdmJuTjBJRk5sWVhKamFFSnZlQ0E5SUZKbFlXTjBMbU55WldGMFpVTnNZWE56S0h0Y2JpQWdhR0Z1Wkd4bFEyaGhibWRsT2lCbWRXNWpkR2x2YmlobEtTQjdYRzRnSUNBZ1JtbHNkR1Z5UVdOMGFXOXVjeTUxY0dSaGRHVlRaV0Z5WTJnb1pTNTBZWEpuWlhRdWRtRnNkV1VwTzF4dUlDQjlMRnh1WEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUNoY2JpQWdJQ0FnSUR4bWIzSnRJR05zWVhOelRtRnRaVDBuYzJWaGNtTm9RbTk0SjF4dUlDQWdJQ0FnSUNCdmJrTm9ZVzVuWlQxN2RHaHBjeTVvWVc1a2JHVkRhR0Z1WjJWOUlGeHVJQ0FnSUNBZ0lDQnZibE4xWW0xcGREMTdablZ1WTNScGIyNG9aU2w3Y21WMGRYSnVJR1poYkhObE8zMTlQbHh1SUNBZ0lDQWdJQ0E4YVc1d2RYUWdkSGx3WlQwbmRHVjRkQ2NnY0d4aFkyVm9iMnhrWlhJOUoyWnBiSFJsY2ljZ2NtVm1QU2R6WldGeVkyaFVaWGgwSnlBdlBpQmNiaUFnSUNBZ0lEd3ZabTl5YlQ1Y2JpQWdJQ0FwTzF4dUlDQjlYRzU5S1R0Y2JseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQlRaV0Z5WTJoQ2IzZzdYRzRpWFgwPSIsIi8vIFNJREVCQVJcbi8qanNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBTZWFyY2hCb3ggPSByZXF1aXJlKCcuL1NlYXJjaEJveC5qc3gnKTtcbnZhciBGaWx0ZXJPcHRpb25Sb3cgPSByZXF1aXJlKCcuL0ZpbHRlck9wdGlvblJvdy5qc3gnKTtcbnZhciBGaWx0ZXJSZXN1bHRzVGFibGUgPSByZXF1aXJlKCcuL0ZpbHRlclJlc3VsdHNUYWJsZS5qc3gnKTtcbnZhciBGaWx0ZXJTdG9yZSA9IHJlcXVpcmUoJy4uL3N0b3Jlcy9GaWx0ZXJTdG9yZScpO1xuXG52YXIgU2lkZWJhciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdTaWRlYmFyJyxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgRmlsdGVyU3RvcmUuYWRkRGFnU2V0TGlzdGVuZXIodGhpcy5fb25EYWdTZXQpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZFVubW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZFVubW91bnQoKSB7XG4gICAgRmlsdGVyU3RvcmUucmVtb3ZlRGFnU2V0TGlzdGVuZXIodGhpcy5fb25EYWdTZXQpO1xuICB9LFxuXG4gIF9vbkRhZ1NldDogZnVuY3Rpb24gX29uRGFnU2V0KCkge1xuICAgIHRoaXMucmVmcy5ncmFpblJvdy5zZXRTdGF0ZSh7IHNlbGVjdGVkOiAxIH0pO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ2RpdicsXG4gICAgICB7IGNsYXNzTmFtZTogJ3NpZGViYXInIH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFNlYXJjaEJveCwgbnVsbCksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdmaWx0ZXJPcHRpb25zJyB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZpbHRlck9wdGlvblJvdywgeyBuYW1lOiAnbWVhc3VyZScsIGxhYmVsczogWydJL08nLCAnQ1BVJywgJ01hcHBlcnMnLCAnUmVkdWNlcnMnXSB9KSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGaWx0ZXJPcHRpb25Sb3csIHsgbmFtZTogJ3RpbWUnLCBsYWJlbHM6IFsnV2VlaycsICdNb250aCcsICdZZWFyJ10gfSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRmlsdGVyT3B0aW9uUm93LCB7IHJlZjogJ2dyYWluUm93JywgbmFtZTogJ2dyYWluJywgbGFiZWxzOiBbJ0RBRycsICdUYXNrJ10gfSlcbiAgICAgICksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZpbHRlclJlc3VsdHNUYWJsZSwgbnVsbClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBTaWRlYmFyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5bmNtVm5iM0o1WDJadmMzUmxjaTl2Y0dWdWMyOTFjbU5sWDJodmJtVjVjRzkwTDJodmJtVjVjRzkwTDJSbGRpOXpZM0pwY0hSekwzVnBMMU5wWkdWaVlYSXVhbk40SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN08wRkJSMEVzU1VGQlRTeFRRVUZUTEVkQlFVY3NUMEZCVHl4RFFVRkRMR2xDUVVGcFFpeERRVUZETEVOQlFVTTdRVUZETjBNc1NVRkJUU3hsUVVGbExFZEJRVWNzVDBGQlR5eERRVUZETEhWQ1FVRjFRaXhEUVVGRExFTkJRVU03UVVGRGVrUXNTVUZCVFN4clFrRkJhMElzUjBGQlJ5eFBRVUZQTEVOQlFVTXNNRUpCUVRCQ0xFTkJRVU1zUTBGQlF6dEJRVU12UkN4SlFVRk5MRmRCUVZjc1IwRkJSeXhQUVVGUExFTkJRVU1zZFVKQlFYVkNMRU5CUVVNc1EwRkJRenM3UVVGRmNrUXNTVUZCVFN4UFFVRlBMRWRCUVVjc1MwRkJTeXhEUVVGRExGZEJRVmNzUTBGQlF6czdPMEZCUldoRExHMUNRVUZwUWl4RlFVRkZMRFpDUVVGWE8wRkJRelZDTEdWQlFWY3NRMEZCUXl4cFFrRkJhVUlzUTBGQlF5eEpRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN1IwRkRMME03TzBGQlJVUXNjVUpCUVcxQ0xFVkJRVVVzSzBKQlFWYzdRVUZET1VJc1pVRkJWeXhEUVVGRExHOUNRVUZ2UWl4RFFVRkRMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dEhRVU5zUkRzN1FVRkZSQ3hYUVVGVExFVkJRVVVzY1VKQlFWVTdRVUZEYmtJc1VVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNVVUZCVVN4RFFVRkRMRVZCUVVNc1VVRkJVU3hGUVVGRkxFTkJRVU1zUlVGQlF5eERRVUZETEVOQlFVTTdSMEZETlVNN08wRkJSVVFzVVVGQlRTeEZRVUZGTEd0Q1FVRlhPMEZCUTJwQ0xGZEJRMFU3TzFGQlFVc3NVMEZCVXl4RlFVRkRMRk5CUVZNN1RVRkRkRUlzYjBKQlFVTXNVMEZCVXl4UFFVRkhPMDFCUTJJN08xVkJRVXNzVTBGQlV5eEZRVUZETEdWQlFXVTdVVUZETlVJc2IwSkJRVU1zWlVGQlpTeEpRVUZETEVsQlFVa3NSVUZCUlN4VFFVRlRMRUZCUVVNc1JVRkJReXhOUVVGTkxFVkJRVVVzUTBGQlF5eExRVUZMTEVWQlFVTXNTMEZCU3l4RlFVRkRMRk5CUVZNc1JVRkJReXhWUVVGVkxFTkJRVU1zUVVGQlF5eEhRVUZITzFGQlEyaEdMRzlDUVVGRExHVkJRV1VzU1VGQlF5eEpRVUZKTEVWQlFVVXNUVUZCVFN4QlFVRkRMRVZCUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU1zVFVGQlRTeEZRVUZETEU5QlFVOHNSVUZCUXl4TlFVRk5MRU5CUVVNc1FVRkJReXhIUVVGSE8xRkJRMnhGTEc5Q1FVRkRMR1ZCUVdVc1NVRkJReXhIUVVGSExFVkJRVU1zVlVGQlZTeEZRVUZETEVsQlFVa3NSVUZCUlN4UFFVRlBMRUZCUVVNc1JVRkJReXhOUVVGTkxFVkJRVVVzUTBGQlF5eExRVUZMTEVWQlFVTXNUVUZCVFN4RFFVRkRMRUZCUVVNc1IwRkJSenRQUVVOeVJUdE5RVU5PTEc5Q1FVRkRMR3RDUVVGclFpeFBRVUZITzB0QlEyeENMRU5CUTA0N1IwRkRTRHREUVVOR0xFTkJRVU1zUTBGQlF6czdRVUZGU0N4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExFOUJRVThzUTBGQlF5SXNJbVpwYkdVaU9pSXZWWE5sY25NdlozSmxaMjl5ZVY5bWIzTjBaWEl2YjNCbGJuTnZkWEpqWlY5b2IyNWxlWEJ2ZEM5b2IyNWxlWEJ2ZEM5a1pYWXZjMk55YVhCMGN5OTFhUzlUYVdSbFltRnlMbXB6ZUNJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHZJRk5KUkVWQ1FWSmNiaThxYW5Ob2FXNTBJR1Z6Ym1WNGREb2dkSEoxWlNBcUwxeHVYRzVqYjI1emRDQlRaV0Z5WTJoQ2IzZ2dQU0J5WlhGMWFYSmxLQ2N1TDFObFlYSmphRUp2ZUM1cWMzZ25LVHRjYm1OdmJuTjBJRVpwYkhSbGNrOXdkR2x2YmxKdmR5QTlJSEpsY1hWcGNtVW9KeTR2Um1sc2RHVnlUM0IwYVc5dVVtOTNMbXB6ZUNjcE8xeHVZMjl1YzNRZ1JtbHNkR1Z5VW1WemRXeDBjMVJoWW14bElEMGdjbVZ4ZFdseVpTZ25MaTlHYVd4MFpYSlNaWE4xYkhSelZHRmliR1V1YW5ONEp5azdYRzVqYjI1emRDQkdhV3gwWlhKVGRHOXlaU0E5SUhKbGNYVnBjbVVvSnk0dUwzTjBiM0psY3k5R2FXeDBaWEpUZEc5eVpTY3BPMXh1WEc1amIyNXpkQ0JUYVdSbFltRnlJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4dVhHNGdJR052YlhCdmJtVnVkRVJwWkUxdmRXNTBPaUJtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0JHYVd4MFpYSlRkRzl5WlM1aFpHUkVZV2RUWlhSTWFYTjBaVzVsY2loMGFHbHpMbDl2YmtSaFoxTmxkQ2s3SUZ4dUlDQjlMRnh1WEc0Z0lHTnZiWEJ2Ym1WdWRFUnBaRlZ1Ylc5MWJuUTZJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQWdJRVpwYkhSbGNsTjBiM0psTG5KbGJXOTJaVVJoWjFObGRFeHBjM1JsYm1WeUtIUm9hWE11WDI5dVJHRm5VMlYwS1RzZ1hHNGdJSDBzWEc1Y2JpQWdYMjl1UkdGblUyVjBPaUJtZFc1amRHbHZiaWdwZTF4dUlDQWdJSFJvYVhNdWNtVm1jeTVuY21GcGJsSnZkeTV6WlhSVGRHRjBaU2g3YzJWc1pXTjBaV1E2SURGOUtUdGNiaUFnZlN4Y2JseHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQwbmMybGtaV0poY2ljK1hHNGdJQ0FnSUNBZ0lEeFRaV0Z5WTJoQ2IzZ2dMejVjYmlBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlKMlpwYkhSbGNrOXdkR2x2Ym5NblBseHVJQ0FnSUNBZ0lDQWdJRHhHYVd4MFpYSlBjSFJwYjI1U2IzY2dibUZ0WlQxN0oyMWxZWE4xY21VbmZTQnNZV0psYkhNOWUxc25TUzlQSnl3blExQlZKeXduVFdGd2NHVnljeWNzSjFKbFpIVmpaWEp6SjExOUlDOCtYRzRnSUNBZ0lDQWdJQ0FnUEVacGJIUmxjazl3ZEdsdmJsSnZkeUJ1WVcxbFBYc25kR2x0WlNkOUlHeGhZbVZzY3oxN1d5ZFhaV1ZySnl3blRXOXVkR2duTENkWlpXRnlKMTE5SUM4K1hHNGdJQ0FnSUNBZ0lDQWdQRVpwYkhSbGNrOXdkR2x2YmxKdmR5QnlaV1k5SjJkeVlXbHVVbTkzSnlCdVlXMWxQWHNuWjNKaGFXNG5mU0JzWVdKbGJITTllMXNuUkVGSEp5d25WR0Z6YXlkZGZTQXZQbHh1SUNBZ0lDQWdJQ0E4TDJScGRqNWNiaUFnSUNBZ0lDQWdQRVpwYkhSbGNsSmxjM1ZzZEhOVVlXSnNaU0F2UGx4dUlDQWdJQ0FnUEM5a2FYWStYRzRnSUNBZ0tUdGNiaUFnZlZ4dWZTazdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnVTJsa1pXSmhjanRjYmlKZGZRPT0iLCIvLyBkM0NoYXJ0LmpzXG4vKmpzaGludCBlc25leHQ6IHRydWUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZDNDaGFydCA9IHt9O1xudmFyIERldGFpbFZpZXdBY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9EZXRhaWxWaWV3QWN0aW9ucycpO1xuXG5kM0NoYXJ0LmNyZWF0ZSA9IGZ1bmN0aW9uIChlbCkge1xuXG4gIHZhciBjaGFydCA9IGQzLnNlbGVjdChlbCkuYXBwZW5kKCdzdmcnKS5hdHRyKCdjbGFzcycsICdtYWluQ2hhcnQnKS5vbignbW91c2Vtb3ZlJywgZDNDaGFydC5tb3VzZW1vdmUpO1xuXG4gIGNoYXJ0LmFwcGVuZCgnY2xpcFBhdGgnKS5hdHRyKCdpZCcsICdwbG90QXJlYUNsaXAnKS5hcHBlbmQoJ3JlY3QnKS5hdHRyKCdpZCcsICdwbG90QXJlYUNsaXBSZWN0Jyk7XG5cbiAgdmFyIHBsb3RBcmVhID0gY2hhcnQuYXBwZW5kKCdnJyk7XG5cbiAgcGxvdEFyZWEuYXBwZW5kKCdzdmc6cGF0aCcpLmF0dHIoJ2NsYXNzJywgJ2xpbmUnKTtcblxuICBwbG90QXJlYS5hcHBlbmQoJ3N2ZzpsaW5lJykuYXR0cignY2xhc3MnLCAnZm9jdXNMaW5lJyk7XG5cbiAgY2hhcnQuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAneEF4aXMnKTtcblxuICBjaGFydC5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd5QXhpcycpO1xuXG4gIHZhciBuYXZDaGFydCA9IGQzLnNlbGVjdChlbCkuYXBwZW5kKCdzdmcnKS5jbGFzc2VkKCduYXZpZ2F0b3InLCB0cnVlKTtcblxuICBuYXZDaGFydC5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd4QXhpcycpO1xuXG4gIG5hdkNoYXJ0LmFwcGVuZCgncGF0aCcpLmF0dHIoJ2NsYXNzJywgJ2ZpbGwnKTtcblxuICBuYXZDaGFydC5hcHBlbmQoJ3BhdGgnKS5hdHRyKCdjbGFzcycsICdsaW5lJykuYXR0cignc3Ryb2tlJywgJ2JsdWUnKS5hdHRyKCdzdHJva2Utd2lkdGgnLCAyKS5hdHRyKCdmaWxsJywgJ25vbmUnKTtcblxuICBuYXZDaGFydC5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd2aWV3cG9ydCcpO1xufTtcblxuZDNDaGFydC5saW5lRnVuY3Rpb24gPSBmdW5jdGlvbiAoc2NhbGVzKSB7XG4gIHJldHVybiBkMy5zdmcubGluZSgpLngoZnVuY3Rpb24gKGQpIHtcbiAgICByZXR1cm4gc2NhbGVzLngoZC5kYXRlKTtcbiAgfSkueShmdW5jdGlvbiAoZCkge1xuICAgIHJldHVybiBzY2FsZXMueShkLnZhbHVlKTtcbiAgfSkuaW50ZXJwb2xhdGUoJ2xpbmVhcicpO1xufTtcblxuLy8gU0laSU5HIElORk9STUFUSU9OXG5cbmQzQ2hhcnQubWFyZ2lucyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHsgYm90dG9tOiA1MCwgbGVmdDogNzUgfTtcbn07XG5cbmQzQ2hhcnQubWFpblNpemUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBjaGFydCA9IGQzLnNlbGVjdCgnc3ZnJylbMF1bMF07XG4gIHZhciB3aWR0aCA9IGNoYXJ0Lm9mZnNldFdpZHRoO1xuICB2YXIgaGVpZ2h0ID0gY2hhcnQub2Zmc2V0SGVpZ2h0O1xuICByZXR1cm4geyB3aWR0aDogd2lkdGgsIGhlaWdodDogaGVpZ2h0IH07XG59O1xuXG5kM0NoYXJ0Lm5hdlNpemUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBjaGFydCA9IGQzLnNlbGVjdCgnc3ZnJylbMF1bMF07XG4gIHZhciB3aWR0aCA9IGNoYXJ0Lm9mZnNldFdpZHRoO1xuICB2YXIgaGVpZ2h0ID0gY2hhcnQub2Zmc2V0SGVpZ2h0ICogKDEgLyA2KTtcbiAgcmV0dXJuIHsgd2lkdGg6IHdpZHRoLCBoZWlnaHQ6IGhlaWdodCB9O1xufTtcblxuZDNDaGFydC51cGRhdGUgPSBmdW5jdGlvbiAoZGF0YSkge1xuXG4gIC8vIE1BSU4gQ0hBUlRcbiAgZDNDaGFydC5kYXRhID0gZGF0YTtcbiAgdmFyIG1haW5TaXplID0gdGhpcy5tYWluU2l6ZSgpO1xuICB2YXIgbWFyZ2lucyA9IHRoaXMubWFyZ2lucygpO1xuICBkM0NoYXJ0Lm1haW5TY2FsZXMgPSB0aGlzLl9zY2FsZXMoe1xuICAgIHg6IG1hcmdpbnMubGVmdCxcbiAgICB5OiAwLFxuICAgIHdpZHRoOiBtYWluU2l6ZS53aWR0aCxcbiAgICBoZWlnaHQ6IG1haW5TaXplLmhlaWdodCAtIG1hcmdpbnMuYm90dG9tXG4gIH0pO1xuXG4gIHZhciBsaW5lRnVuYyA9IHRoaXMubGluZUZ1bmN0aW9uKGQzQ2hhcnQubWFpblNjYWxlcyk7XG5cbiAgdmFyIHhBeGlzID0gZDMuc3ZnLmF4aXMoKS5zY2FsZShkM0NoYXJ0Lm1haW5TY2FsZXMueCkub3JpZW50KCdib3R0b20nKS50aWNrcyg2KTtcblxuICB2YXIgeUF4aXMgPSBkMy5zdmcuYXhpcygpLnNjYWxlKGQzQ2hhcnQubWFpblNjYWxlcy55KS5vcmllbnQoJ2xlZnQnKS50aWNrRm9ybWF0KGQzLmZvcm1hdChcIi4zc1wiKSkudGlja3MoNSk7XG5cbiAgdmFyIG1haW5DaGFydCA9IGQzLnNlbGVjdCgnLm1haW5DaGFydCcpO1xuICBtYWluQ2hhcnQuc2VsZWN0KCcueEF4aXMnKS5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsICcgKyAobWFpblNpemUuaGVpZ2h0IC0gbWFyZ2lucy5ib3R0b20pICsgJyknKS50cmFuc2l0aW9uKCkuY2FsbCh4QXhpcyk7XG4gIG1haW5DaGFydC5zZWxlY3QoJy55QXhpcycpLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIG1hcmdpbnMubGVmdCArICcsIDApJykudHJhbnNpdGlvbigpLmNhbGwoeUF4aXMpO1xuICBtYWluQ2hhcnQuc2VsZWN0KCcubGluZScpLnRyYW5zaXRpb24oKS5hdHRyKCdkJywgbGluZUZ1bmMoZDNDaGFydC5kYXRhKSk7XG5cbiAgLy8gTkFWIENIQVJUXG4gIHZhciBuYXZTaXplID0gdGhpcy5uYXZTaXplKCk7XG4gIGQzQ2hhcnQubmF2U2NhbGVzID0gdGhpcy5fc2NhbGVzKHtcbiAgICB4OiBtYXJnaW5zLmxlZnQsXG4gICAgeTogMCxcbiAgICB3aWR0aDogbmF2U2l6ZS53aWR0aCxcbiAgICBoZWlnaHQ6IG5hdlNpemUuaGVpZ2h0XG4gIH0pO1xuXG4gIHZhciBuYXZDaGFydCA9IGQzLnNlbGVjdCgnLm5hdmlnYXRvcicpLmF0dHIoJ3dpZHRoJywgbmF2U2l6ZS53aWR0aCArIG1hcmdpbnMubGVmdCkuYXR0cignaGVpZ2h0JywgbmF2U2l6ZS5oZWlnaHQgKyBtYXJnaW5zLmJvdHRvbSkuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgbWFyZ2lucy5sZWZ0ICsgJywnICsgbWFyZ2lucy5ib3R0b20gKyAnKScpO1xuXG4gIHZhciBuYXZYQXhpcyA9IGQzLnN2Zy5heGlzKCkuc2NhbGUoZDNDaGFydC5uYXZTY2FsZXMueCkub3JpZW50KCdib3R0b20nKS50aWNrcyg1KTtcblxuICBuYXZDaGFydC5zZWxlY3QoJy54QXhpcycpLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwnICsgbmF2U2l6ZS5oZWlnaHQgKyAnKScpLmNhbGwobmF2WEF4aXMpO1xuXG4gIC8vIE5hdiBHcmFwaCBGdW5jdGlvbiBmb3IgYXJlYVxuICB2YXIgbmF2RmlsbCA9IGQzLnN2Zy5hcmVhKCkueChmdW5jdGlvbiAoZCkge1xuICAgIHJldHVybiBkM0NoYXJ0Lm5hdlNjYWxlcy54KGQuZGF0ZSk7XG4gIH0pLnkwKG5hdlNpemUuaGVpZ2h0KS55MShmdW5jdGlvbiAoZCkge1xuICAgIHJldHVybiBkM0NoYXJ0Lm5hdlNjYWxlcy55KGQudmFsdWUpO1xuICB9KTtcblxuICAvLyBOYXYgR3JhcGggRnVuY3Rpb24gZm9yIGxpbmVcbiAgdmFyIG5hdkxpbmUgPSBkMy5zdmcubGluZSgpLngoZnVuY3Rpb24gKGQpIHtcbiAgICByZXR1cm4gZDNDaGFydC5uYXZTY2FsZXMueChkLmRhdGUpO1xuICB9KS55KGZ1bmN0aW9uIChkKSB7XG4gICAgcmV0dXJuIGQzQ2hhcnQubmF2U2NhbGVzLnkoZC52YWx1ZSk7XG4gIH0pO1xuXG4gIG5hdkNoYXJ0LnNlbGVjdCgnLmZpbGwnKS50cmFuc2l0aW9uKCkuYXR0cignZCcsIG5hdkZpbGwoZDNDaGFydC5kYXRhKSk7XG5cbiAgbmF2Q2hhcnQuc2VsZWN0KCcubGluZScpLnRyYW5zaXRpb24oKS5hdHRyKCdkJywgbmF2TGluZShkM0NoYXJ0LmRhdGEpKTtcblxuICB2YXIgdmlld3BvcnQgPSBkMy5zdmcuYnJ1c2goKS54KGQzQ2hhcnQubmF2U2NhbGVzLngpLm9uKCdicnVzaCcsIGZ1bmN0aW9uICgpIHtcbiAgICBkM0NoYXJ0Lm1haW5TY2FsZXMueC5kb21haW4odmlld3BvcnQuZW1wdHkoKSA/IGQzQ2hhcnQubmF2U2NhbGVzLnguZG9tYWluKCkgOiB2aWV3cG9ydC5leHRlbnQoKSk7XG4gICAgZDNDaGFydC5yZWRyYXdDaGFydChkM0NoYXJ0Lm1haW5TY2FsZXMsIHhBeGlzLCBkM0NoYXJ0LmRhdGEpO1xuICB9KTtcblxuICBuYXZDaGFydC5zZWxlY3QoJy52aWV3cG9ydCcpLmNhbGwodmlld3BvcnQpLnNlbGVjdEFsbCgncmVjdCcpLmF0dHIoJ2hlaWdodCcsIG5hdlNpemUuaGVpZ2h0KTtcbn07XG5cbmQzQ2hhcnQucmVkcmF3Q2hhcnQgPSBmdW5jdGlvbiAoc2NhbGVzLCB4QXhpcywgZGF0YSkge1xuICB2YXIgbGluZUZ1bmMgPSB0aGlzLmxpbmVGdW5jdGlvbihzY2FsZXMpO1xuICB4QXhpcy5zY2FsZShzY2FsZXMueCk7XG4gIGQzLnNlbGVjdCgnLm1haW5DaGFydCcpLnNlbGVjdCgnLnhBeGlzJykuY2FsbCh4QXhpcyk7XG4gIGQzLnNlbGVjdCgnLm1haW5DaGFydCcpLnNlbGVjdCgnLmxpbmUnKS5hdHRyKCdkJywgbGluZUZ1bmMoZDNDaGFydC5kYXRhKSk7XG59O1xuXG5kM0NoYXJ0Ll9zY2FsZXMgPSBmdW5jdGlvbiAocmVjdCkge1xuXG4gIHZhciBkYXRlcyA9IGQzQ2hhcnQuZGF0YS5tYXAoZnVuY3Rpb24gKGN1cikge1xuICAgIHJldHVybiBjdXIuZGF0ZTtcbiAgfSk7XG4gIHZhciB2YWx1ZXMgPSBkM0NoYXJ0LmRhdGEubWFwKGZ1bmN0aW9uIChjdXIpIHtcbiAgICByZXR1cm4gY3VyLnZhbHVlO1xuICB9KTtcblxuICB2YXIgbWF4RGF0ZSA9IG5ldyBEYXRlKE1hdGgubWF4LmFwcGx5KG51bGwsIGRhdGVzKSk7XG4gIHZhciBtaW5EYXRlID0gbmV3IERhdGUoTWF0aC5taW4uYXBwbHkobnVsbCwgZGF0ZXMpKTtcbiAgdmFyIG1heFZhbHVlID0gTWF0aC5tYXguYXBwbHkobnVsbCwgdmFsdWVzKTtcbiAgdmFyIG1pblZhbHVlID0gTWF0aC5taW4uYXBwbHkobnVsbCwgdmFsdWVzKTtcblxuICB2YXIgeFNjYWxlID0gZDMudGltZS5zY2FsZSgpLmRvbWFpbihbbWluRGF0ZSwgbWF4RGF0ZV0pLnJhbmdlKFtyZWN0LngsIHJlY3Qud2lkdGhdKTtcblxuICB2YXIgeVNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFttaW5WYWx1ZSAqIDAuOCwgbWF4VmFsdWUgKiAxLjFdKS5yYW5nZShbcmVjdC5oZWlnaHQsIHJlY3QueV0pO1xuXG4gIHJldHVybiB7IHg6IHhTY2FsZSwgeTogeVNjYWxlIH07XG59O1xuXG5kM0NoYXJ0LmJpc2VjdERhdGUgPSBkMy5iaXNlY3RvcihmdW5jdGlvbiAoZCkge1xuICByZXR1cm4gZC5kYXRlO1xufSkubGVmdDtcblxuLy8gRHJhdyBhIHZlcnRpY2FsIGxpbmUgYW5kIHVwZGF0ZSB0aGUgZm9jdXMgZGF0ZSAvIHZhbHVlXG5kM0NoYXJ0Lm1vdXNlbW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gU25hcCB0byBvbmUgbW91c2UgcG9pbnQgYmVjYXVzZSB3aWxsIG5ldmVyIG1vdXNlIG92ZXIgYSBkYXRlIGV4YWN0bHlcbiAgaWYgKGQzQ2hhcnQuZGF0YSkge1xuICAgIHZhciBtb3VzZW92ZXJEYXRlID0gZDNDaGFydC5tYWluU2NhbGVzLnguaW52ZXJ0KGQzLm1vdXNlKHRoaXMpWzBdKSxcbiAgICAgICAgaW5kZXggPSBkM0NoYXJ0LmJpc2VjdERhdGUoZDNDaGFydC5kYXRhLCBtb3VzZW92ZXJEYXRlLCAxKSxcbiAgICAgICAgcG9pbnRCZWZvcmVEYXRlID0gZDNDaGFydC5kYXRhW2luZGV4IC0gMV0sXG4gICAgICAgIHBvaW50T25EYXRlID0gZDNDaGFydC5kYXRhW2luZGV4XSxcbiAgICAgICAgcG9pbnQgPSBtb3VzZW92ZXJEYXRlIC0gcG9pbnRCZWZvcmVEYXRlLmRhdGUgPiBwb2ludE9uRGF0ZS5kYXRlIC0gbW91c2VvdmVyRGF0ZSA/IHBvaW50T25EYXRlIDogcG9pbnRCZWZvcmVEYXRlO1xuICAgIERldGFpbFZpZXdBY3Rpb25zLnVwZGF0ZUZvY3VzRGF0YShwb2ludC5kYXRlLCBwb2ludC52YWx1ZSk7XG4gICAgLy8gRHJhdyB0aGUgbGluZVxuICAgIHZhciBtYXJnaW5zID0gZDNDaGFydC5tYXJnaW5zKCk7XG4gICAgdmFyIHggPSBkMy5tb3VzZSh0aGlzKVswXSA8IG1hcmdpbnMubGVmdCA/IG1hcmdpbnMubGVmdCA6IGQzLm1vdXNlKHRoaXMpWzBdO1xuICAgIHZhciBmb2N1c0xpbmUgPSBkMy5zZWxlY3QoJy5mb2N1c0xpbmUnKS5hdHRyKCd4MScsIHgpLmF0dHIoJ3gyJywgeCkuYXR0cigneTEnLCAwKS5hdHRyKCd5MScsIGQzQ2hhcnQubWFpblNpemUoKS5oZWlnaHQgLSBtYXJnaW5zLmJvdHRvbSk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZDNDaGFydDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OW5jbVZuYjNKNVgyWnZjM1JsY2k5dmNHVnVjMjkxY21ObFgyaHZibVY1Y0c5MEwyaHZibVY1Y0c5MEwyUmxkaTl6WTNKcGNIUnpMM1ZwTDJRelEyaGhjblF1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWpzN096czdRVUZIUVN4SlFVRk5MRTlCUVU4c1IwRkJSeXhGUVVGRkxFTkJRVU03UVVGRGJrSXNTVUZCVFN4cFFrRkJhVUlzUjBGQlJ5eFBRVUZQTEVOQlFVTXNPRUpCUVRoQ0xFTkJRVU1zUTBGQlF6czdRVUZGYkVVc1QwRkJUeXhEUVVGRExFMUJRVTBzUjBGQlJ5eFZRVUZUTEVWQlFVVXNSVUZCUlRzN1FVRkZOVUlzVFVGQlRTeExRVUZMTEVkQlFVY3NSVUZCUlN4RFFVRkRMRTFCUVUwc1EwRkJReXhGUVVGRkxFTkJRVU1zUTBGQlF5eE5RVUZOTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUTNSRExFbEJRVWtzUTBGQlF5eFBRVUZQTEVWQlFVVXNWMEZCVnl4RFFVRkRMRU5CUXpGQ0xFVkJRVVVzUTBGQlF5eFhRVUZYTEVWQlFVVXNUMEZCVHl4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRE96dEJRVVYwUXl4UFFVRkxMRU5CUVVNc1RVRkJUU3hEUVVGRExGVkJRVlVzUTBGQlF5eERRVU55UWl4SlFVRkpMRU5CUVVNc1NVRkJTU3hGUVVGRkxHTkJRV01zUTBGQlF5eERRVU14UWl4TlFVRk5MRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRMlFzU1VGQlNTeERRVUZETEVsQlFVa3NSVUZCUlN4clFrRkJhMElzUTBGQlF5eERRVUZET3p0QlFVVnNReXhOUVVGTkxGRkJRVkVzUjBGQlJ5eExRVUZMTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRE96dEJRVVZ1UXl4VlFVRlJMRU5CUTB3c1RVRkJUU3hEUVVGRExGVkJRVlVzUTBGQlF5eERRVU5zUWl4SlFVRkpMRU5CUVVNc1QwRkJUeXhGUVVGRkxFMUJRVTBzUTBGQlF5eERRVUZET3p0QlFVVjZRaXhWUVVGUkxFTkJRMHdzVFVGQlRTeERRVUZETEZWQlFWVXNRMEZCUXl4RFFVTnNRaXhKUVVGSkxFTkJRVU1zVDBGQlR5eEZRVUZGTEZkQlFWY3NRMEZCUXl4RFFVRkRPenRCUVVVNVFpeFBRVUZMTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVOa0xFbEJRVWtzUTBGQlF5eFBRVUZQTEVWQlFVVXNUMEZCVHl4RFFVRkRMRU5CUVVNN08wRkJSVEZDTEU5QlFVc3NRMEZCUXl4TlFVRk5MRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRMlFzU1VGQlNTeERRVUZETEU5QlFVOHNSVUZCUlN4UFFVRlBMRU5CUVVNc1EwRkJRenM3UVVGRk1VSXNUVUZCVFN4UlFVRlJMRWRCUVVjc1JVRkJSU3hEUVVGRExFMUJRVTBzUTBGQlF5eEZRVUZGTEVOQlFVTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRM3BETEU5QlFVOHNRMEZCUXl4WFFVRlhMRVZCUVVVc1NVRkJTU3hEUVVGRExFTkJRVU03TzBGQlJUbENMRlZCUVZFc1EwRkJReXhOUVVGTkxFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlEycENMRWxCUVVrc1EwRkJReXhQUVVGUExFVkJRVVVzVDBGQlR5eERRVUZETEVOQlFVTTdPMEZCUlRGQ0xGVkJRVkVzUTBGQlF5eE5RVUZOTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUTNCQ0xFbEJRVWtzUTBGQlF5eFBRVUZQTEVWQlFVVXNUVUZCVFN4RFFVRkRMRU5CUVVNN08wRkJSWHBDTEZWQlFWRXNRMEZCUXl4TlFVRk5MRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRM0JDTEVsQlFVa3NRMEZCUXl4UFFVRlBMRVZCUVVVc1RVRkJUU3hEUVVGRExFTkJRM0pDTEVsQlFVa3NRMEZCUXl4UlFVRlJMRVZCUVVVc1RVRkJUU3hEUVVGRExFTkJRM1JDTEVsQlFVa3NRMEZCUXl4alFVRmpMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRM1pDTEVsQlFVa3NRMEZCUXl4TlFVRk5MRVZCUVVVc1RVRkJUU3hEUVVGRExFTkJRVU03TzBGQlJYaENMRlZCUVZFc1EwRkJReXhOUVVGTkxFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlEycENMRWxCUVVrc1EwRkJReXhQUVVGUExFVkJRVVVzVlVGQlZTeERRVUZETEVOQlFVTTdRMEZET1VJc1EwRkJRenM3UVVGRlJpeFBRVUZQTEVOQlFVTXNXVUZCV1N4SFFVRkhMRlZCUVZNc1RVRkJUU3hGUVVGRk8wRkJRM1JETEZOQlFVOHNSVUZCUlN4RFFVRkRMRWRCUVVjc1EwRkJReXhKUVVGSkxFVkJRVVVzUTBGRGFrSXNRMEZCUXl4RFFVRkRMRlZCUVZNc1EwRkJReXhGUVVGRk8wRkJRMklzVjBGQlR5eE5RVUZOTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dEhRVU42UWl4RFFVRkRMRU5CUTBRc1EwRkJReXhEUVVGRExGVkJRVk1zUTBGQlF5eEZRVUZGTzBGQlEySXNWMEZCVHl4TlFVRk5MRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXp0SFFVTXhRaXhEUVVGRExFTkJRMFFzVjBGQlZ5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPME5CUXpGQ0xFTkJRVU03T3pzN1FVRkpSaXhQUVVGUExFTkJRVU1zVDBGQlR5eEhRVUZITEZsQlFWYzdRVUZETTBJc1UwRkJUeXhGUVVGRExFMUJRVTBzUlVGQlF5eEZRVUZGTEVWQlFVTXNTVUZCU1N4RlFVRkRMRVZCUVVVc1JVRkJReXhEUVVGRE8wTkJRelZDTEVOQlFVTTdPMEZCUlVZc1QwRkJUeXhEUVVGRExGRkJRVkVzUjBGQlJ5eFpRVUZYTzBGQlF6VkNMRTFCUVUwc1MwRkJTeXhIUVVGSExFVkJRVVVzUTBGQlF5eE5RVUZOTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdRVUZEY2tNc1RVRkJUU3hMUVVGTExFZEJRVWNzUzBGQlN5eERRVUZETEZkQlFWY3NRMEZCUXp0QlFVTm9ReXhOUVVGTkxFMUJRVTBzUjBGQlJ5eExRVUZMTEVOQlFVTXNXVUZCV1N4RFFVRkRPMEZCUTJ4RExGTkJRVThzUlVGQlF5eExRVUZMTEVWQlFVTXNTMEZCU3l4RlFVRkZMRTFCUVUwc1JVRkJReXhOUVVGTkxFVkJRVU1zUTBGQlF6dERRVU55UXl4RFFVRkRPenRCUVVWR0xFOUJRVThzUTBGQlF5eFBRVUZQTEVkQlFVY3NXVUZCVnp0QlFVTXpRaXhOUVVGTkxFdEJRVXNzUjBGQlJ5eEZRVUZGTEVOQlFVTXNUVUZCVFN4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMEZCUTNKRExFMUJRVTBzUzBGQlN5eEhRVUZITEV0QlFVc3NRMEZCUXl4WFFVRlhMRU5CUVVNN1FVRkRhRU1zVFVGQlRTeE5RVUZOTEVkQlFVY3NTMEZCU3l4RFFVRkRMRmxCUVZrc1NVRkJTU3hEUVVGRExFZEJRVU1zUTBGQlF5eERRVUZCTEVGQlFVTXNRMEZCUXp0QlFVTXhReXhUUVVGUExFVkJRVU1zUzBGQlN5eEZRVUZETEV0QlFVc3NSVUZCUlN4TlFVRk5MRVZCUVVNc1RVRkJUU3hGUVVGRExFTkJRVU03UTBGRGNrTXNRMEZCUXpzN1FVRkZSaXhQUVVGUExFTkJRVU1zVFVGQlRTeEhRVUZITEZWQlFWTXNTVUZCU1N4RlFVRkZPenM3UVVGSE9VSXNVMEZCVHl4RFFVRkRMRWxCUVVrc1IwRkJSeXhKUVVGSkxFTkJRVU03UVVGRGNFSXNUVUZCVFN4UlFVRlJMRWRCUVVjc1NVRkJTU3hEUVVGRExGRkJRVkVzUlVGQlJTeERRVUZETzBGQlEycERMRTFCUVUwc1QwRkJUeXhIUVVGSExFbEJRVWtzUTBGQlF5eFBRVUZQTEVWQlFVVXNRMEZCUXp0QlFVTXZRaXhUUVVGUExFTkJRVU1zVlVGQlZTeEhRVUZITEVsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNN1FVRkRPVUlzUzBGQlF5eEZRVUZETEU5QlFVOHNRMEZCUXl4SlFVRkpPMEZCUTJRc1MwRkJReXhGUVVGRExFTkJRVU03UVVGRFNDeFRRVUZMTEVWQlFVTXNVVUZCVVN4RFFVRkRMRXRCUVVzN1FVRkRjRUlzVlVGQlRTeEZRVUZETEZGQlFWRXNRMEZCUXl4TlFVRk5MRWRCUVVjc1QwRkJUeXhEUVVGRExFMUJRVTA3UjBGRGVFTXNRMEZCUXl4RFFVRkRPenRCUVVWTUxFMUJRVTBzVVVGQlVTeEhRVUZITEVsQlFVa3NRMEZCUXl4WlFVRlpMRU5CUVVNc1QwRkJUeXhEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZET3p0QlFVVjJSQ3hOUVVGTkxFdEJRVXNzUjBGQlJ5eEZRVUZGTEVOQlFVTXNSMEZCUnl4RFFVRkRMRWxCUVVrc1JVRkJSU3hEUVVONFFpeExRVUZMTEVOQlFVTXNUMEZCVHl4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGRE0wSXNUVUZCVFN4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVOb1FpeExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSVm9zVFVGQlRTeExRVUZMTEVkQlFVY3NSVUZCUlN4RFFVRkRMRWRCUVVjc1EwRkJReXhKUVVGSkxFVkJRVVVzUTBGRGVFSXNTMEZCU3l4RFFVRkRMRTlCUVU4c1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlF6TkNMRTFCUVUwc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGRFpDeFZRVUZWTEVOQlFVTXNSVUZCUlN4RFFVRkRMRTFCUVUwc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF5eERRVU0xUWl4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJWb3NUVUZCVFN4VFFVRlRMRWRCUVVjc1JVRkJSU3hEUVVGRExFMUJRVTBzUTBGQlF5eFpRVUZaTEVOQlFVTXNRMEZCUXp0QlFVTXhReXhYUVVGVExFTkJRVU1zVFVGQlRTeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVTjJRaXhKUVVGSkxFTkJRVU1zVjBGQlZ5eEZRVUZGTEdWQlFXVXNTVUZCUlN4UlFVRlJMRU5CUVVNc1RVRkJUU3hIUVVGRExFOUJRVThzUTBGQlF5eE5RVUZOTEVOQlFVRXNRVUZCUXl4SFFVRkRMRWRCUVVjc1EwRkJReXhEUVVOMlJTeFZRVUZWTEVWQlFVVXNRMEZEV2l4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU03UVVGRFppeFhRVUZUTEVOQlFVTXNUVUZCVFN4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVOMlFpeEpRVUZKTEVOQlFVTXNWMEZCVnl4RlFVRkZMRmxCUVZrc1IwRkJReXhQUVVGUExFTkJRVU1zU1VGQlNTeEhRVUZETEUxQlFVMHNRMEZCUXl4RFFVTnVSQ3hWUVVGVkxFVkJRVVVzUTBGRFdpeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNN1FVRkRaaXhYUVVGVExFTkJRVU1zVFVGQlRTeERRVUZETEU5QlFVOHNRMEZCUXl4RFFVTjBRaXhWUVVGVkxFVkJRVVVzUTBGRFdpeEpRVUZKTEVOQlFVTXNSMEZCUnl4RlFVRkZMRkZCUVZFc1EwRkJReXhQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTXNRMEZCUXpzN08wRkJSM0pETEUxQlFVMHNUMEZCVHl4SFFVRkhMRWxCUVVrc1EwRkJReXhQUVVGUExFVkJRVVVzUTBGQlF6dEJRVU12UWl4VFFVRlBMRU5CUVVNc1UwRkJVeXhIUVVGSExFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTTdRVUZETDBJc1MwRkJReXhGUVVGRExFOUJRVThzUTBGQlF5eEpRVUZKTzBGQlEyUXNTMEZCUXl4RlFVRkRMRU5CUVVNN1FVRkRTQ3hUUVVGTExFVkJRVU1zVDBGQlR5eERRVUZETEV0QlFVczdRVUZEYmtJc1ZVRkJUU3hGUVVGRExFOUJRVThzUTBGQlF5eE5RVUZOTzBkQlEzUkNMRU5CUVVNc1EwRkJRenM3UVVGRlNDeE5RVUZOTEZGQlFWRXNSMEZCUnl4RlFVRkZMRU5CUVVNc1RVRkJUU3hEUVVGRExGbEJRVmtzUTBGQlF5eERRVU55UXl4SlFVRkpMRU5CUVVNc1QwRkJUeXhGUVVGRkxFOUJRVThzUTBGQlF5eExRVUZMTEVkQlFVY3NUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVNelF5eEpRVUZKTEVOQlFVTXNVVUZCVVN4RlFVRkZMRTlCUVU4c1EwRkJReXhOUVVGTkxFZEJRVWNzVDBGQlR5eERRVUZETEUxQlFVMHNRMEZCUXl4RFFVTXZReXhKUVVGSkxFTkJRVU1zVjBGQlZ5eEZRVUZGTEZsQlFWa3NSMEZCUXl4UFFVRlBMRU5CUVVNc1NVRkJTU3hIUVVGRExFZEJRVWNzUjBGQlF5eFBRVUZQTEVOQlFVTXNUVUZCVFN4SFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRE96dEJRVVYyUlN4TlFVRk5MRkZCUVZFc1IwRkJSeXhGUVVGRkxFTkJRVU1zUjBGQlJ5eERRVUZETEVsQlFVa3NSVUZCUlN4RFFVTXpRaXhMUVVGTExFTkJRVU1zVDBGQlR5eERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkRNVUlzVFVGQlRTeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVTm9RaXhMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdPMEZCUlZvc1ZVRkJVU3hEUVVGRExFMUJRVTBzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZEZEVJc1NVRkJTU3hEUVVGRExGZEJRVmNzUlVGQlJTeGpRVUZqTEVkQlFVY3NUMEZCVHl4RFFVRkRMRTFCUVUwc1IwRkJSeXhIUVVGSExFTkJRVU1zUTBGRGVFUXNTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRE96czdRVUZIYkVJc1RVRkJUU3hQUVVGUExFZEJRVWNzUlVGQlJTeERRVUZETEVkQlFVY3NRMEZCUXl4SlFVRkpMRVZCUVVVc1EwRkRNVUlzUTBGQlF5eERRVUZETEZWQlFWVXNRMEZCUXl4RlFVRkZPMEZCUVVVc1YwRkJUeXhQUVVGUExFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UjBGQlJTeERRVUZETEVOQlEzWkVMRVZCUVVVc1EwRkJReXhQUVVGUExFTkJRVU1zVFVGQlRTeERRVUZETEVOQlEyeENMRVZCUVVVc1EwRkJReXhWUVVGVkxFTkJRVU1zUlVGQlJUdEJRVUZGTEZkQlFVOHNUMEZCVHl4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRPMGRCUVVVc1EwRkJReXhEUVVGRE96czdRVUZITjBRc1RVRkJUU3hQUVVGUExFZEJRVWNzUlVGQlJTeERRVUZETEVkQlFVY3NRMEZCUXl4SlFVRkpMRVZCUVVVc1EwRkRNVUlzUTBGQlF5eERRVUZETEZWQlFWVXNRMEZCUXl4RlFVRkZPMEZCUVVVc1YwRkJUeXhQUVVGUExFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UjBGQlJTeERRVUZETEVOQlEzWkVMRU5CUVVNc1EwRkJReXhWUVVGVkxFTkJRVU1zUlVGQlJUdEJRVUZGTEZkQlFVOHNUMEZCVHl4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRPMGRCUVVVc1EwRkJReXhEUVVGRE96dEJRVVUxUkN4VlFVRlJMRU5CUVVNc1RVRkJUU3hEUVVGRExFOUJRVThzUTBGQlF5eERRVU55UWl4VlFVRlZMRVZCUVVVc1EwRkRXaXhKUVVGSkxFTkJRVU1zUjBGQlJ5eEZRVUZGTEU5QlFVOHNRMEZCUXl4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU1zUTBGQlF6czdRVUZGY0VNc1ZVRkJVU3hEUVVGRExFMUJRVTBzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZEY2tJc1ZVRkJWU3hGUVVGRkxFTkJRMW9zU1VGQlNTeERRVUZETEVkQlFVY3NSVUZCUlN4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETEVOQlFVTTdPMEZCUlhCRExFMUJRVTBzVVVGQlVTeEhRVUZITEVWQlFVVXNRMEZCUXl4SFFVRkhMRU5CUVVNc1MwRkJTeXhGUVVGRkxFTkJRelZDTEVOQlFVTXNRMEZCUXl4UFFVRlBMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVU4wUWl4RlFVRkZMRU5CUVVNc1QwRkJUeXhGUVVGRkxGbEJRVms3UVVGRGRrSXNWMEZCVHl4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRExFTkJRVU1zVFVGQlRTeERRVUZETEZGQlFWRXNRMEZCUXl4TFFVRkxMRVZCUVVVc1IwRkJSeXhQUVVGUExFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTXNRMEZCUXl4TlFVRk5MRVZCUVVVc1IwRkJSeXhSUVVGUkxFTkJRVU1zVFVGQlRTeEZRVUZGTEVOQlFVTXNRMEZCUXp0QlFVTnFSeXhYUVVGUExFTkJRVU1zVjBGQlZ5eERRVUZETEU5QlFVOHNRMEZCUXl4VlFVRlZMRVZCUVVVc1MwRkJTeXhGUVVGRkxFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0SFFVTTVSQ3hEUVVGRExFTkJRVU03TzBGQlJVd3NWVUZCVVN4RFFVRkRMRTFCUVUwc1EwRkJReXhYUVVGWExFTkJRVU1zUTBGRGVrSXNTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVOa0xGTkJRVk1zUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZEYWtJc1NVRkJTU3hEUVVGRExGRkJRVkVzUlVGQlJTeFBRVUZQTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1EwRkRia01zUTBGQlF6czdRVUZGUml4UFFVRlBMRU5CUVVNc1YwRkJWeXhIUVVGSExGVkJRVk1zVFVGQlRTeEZRVUZGTEV0QlFVc3NSVUZCUlN4SlFVRkpMRVZCUVVVN1FVRkRiRVFzVFVGQlRTeFJRVUZSTEVkQlFVY3NTVUZCU1N4RFFVRkRMRmxCUVZrc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6dEJRVU16UXl4UFFVRkxMRU5CUVVNc1MwRkJTeXhEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0QlFVTjBRaXhKUVVGRkxFTkJRVU1zVFVGQlRTeERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRMRTFCUVUwc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNN1FVRkRja1FzU1VGQlJTeERRVUZETEUxQlFVMHNRMEZCUXl4WlFVRlpMRU5CUVVNc1EwRkJReXhOUVVGTkxFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMRWRCUVVjc1JVRkJSU3hSUVVGUkxFTkJRVU1zVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNN1EwRkRNMFVzUTBGQlF6czdRVUZGUml4UFFVRlBMRU5CUVVNc1QwRkJUeXhIUVVGSExGVkJRVk1zU1VGQlNTeEZRVUZGT3p0QlFVVXZRaXhOUVVGTkxFdEJRVXNzUjBGQlJ5eFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhWUVVGVExFZEJRVWNzUlVGQlF6dEJRVUZETEZkQlFVOHNSMEZCUnl4RFFVRkRMRWxCUVVrc1EwRkJRenRIUVVGRExFTkJRVU1zUTBGQlF6dEJRVU5vUlN4TlFVRk5MRTFCUVUwc1IwRkJSeXhQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4VlFVRlRMRWRCUVVjc1JVRkJRenRCUVVGRExGZEJRVThzUjBGQlJ5eERRVUZETEV0QlFVc3NRMEZCUXp0SFFVRkRMRU5CUVVNc1EwRkJRenM3UVVGRmJFVXNUVUZCVFN4UFFVRlBMRWRCUVVjc1NVRkJTU3hKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJTU3hGUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTTdRVUZEY2tRc1RVRkJUU3hQUVVGUExFZEJRVWNzU1VGQlNTeEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeEZRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNN1FVRkRja1FzVFVGQlRTeFJRVUZSTEVkQlFVY3NTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeEZRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMEZCUXpkRExFMUJRVTBzVVVGQlVTeEhRVUZITEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUlVGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXpzN1FVRkZOME1zVFVGQlRTeE5RVUZOTEVkQlFVY3NSVUZCUlN4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFVkJRVVVzUTBGRE0wSXNUVUZCVFN4RFFVRkRMRU5CUVVNc1QwRkJUeXhGUVVGRExFOUJRVThzUTBGQlF5eERRVUZETEVOQlEzcENMRXRCUVVzc1EwRkJReXhEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETEVWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJTOUNMRTFCUVUwc1RVRkJUU3hIUVVGSExFVkJRVVVzUTBGQlF5eExRVUZMTEVOQlFVTXNUVUZCVFN4RlFVRkZMRU5CUXpkQ0xFMUJRVTBzUTBGQlF5eERRVUZETEZGQlFWRXNSMEZCUnl4SFFVRkhMRVZCUVVVc1VVRkJVU3hIUVVGSExFZEJRVWNzUTBGQlF5eERRVUZETEVOQlEzaERMRXRCUVVzc1EwRkJReXhEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEVWQlFVVXNTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJXaERMRk5CUVU4c1JVRkJReXhEUVVGRExFVkJRVVVzVFVGQlRTeEZRVUZGTEVOQlFVTXNSVUZCUlN4TlFVRk5MRVZCUVVNc1EwRkJRenREUVVNdlFpeERRVUZET3p0QlFVVkdMRTlCUVU4c1EwRkJReXhWUVVGVkxFZEJRVWNzUlVGQlJTeERRVUZETEZGQlFWRXNRMEZCUXl4VlFVRlRMRU5CUVVNc1JVRkJSVHRCUVVGRkxGTkJRVThzUTBGQlF5eERRVUZETEVsQlFVa3NRMEZCUXp0RFFVRkZMRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU03T3p0QlFVZDBSU3hQUVVGUExFTkJRVU1zVTBGQlV5eEhRVUZITEZsQlFWYzdPMEZCUlRkQ0xFMUJRVWtzVDBGQlR5eERRVUZETEVsQlFVa3NSVUZCUlR0QlFVTm9RaXhSUVVGTkxHRkJRV0VzUjBGQlJ5eFBRVUZQTEVOQlFVTXNWVUZCVlN4RFFVRkRMRU5CUVVNc1EwRkJReXhOUVVGTkxFTkJRVU1zUlVGQlJTeERRVUZETEV0QlFVc3NRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dFJRVU5zUlN4TFFVRkxMRWRCUVVjc1QwRkJUeXhEUVVGRExGVkJRVlVzUTBGQlF5eFBRVUZQTEVOQlFVTXNTVUZCU1N4RlFVRkZMR0ZCUVdFc1JVRkJSU3hEUVVGRExFTkJRVU03VVVGRE1VUXNaVUZCWlN4SFFVRkhMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eEhRVUZITEVOQlFVTXNRMEZCUXp0UlFVTjZReXhYUVVGWExFZEJRVWNzVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNN1VVRkRha01zUzBGQlN5eEhRVUZITEVGQlFVTXNZVUZCWVN4SFFVRkhMR1ZCUVdVc1EwRkJReXhKUVVGSkxFZEJRVXNzVjBGQlZ5eERRVUZETEVsQlFVa3NSMEZCUnl4aFFVRmhMRUZCUVVNc1IwRkRha1lzVjBGQlZ5eEhRVUZITEdWQlFXVXNRMEZCUXp0QlFVTnNReXh4UWtGQmFVSXNRMEZCUXl4bFFVRmxMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUlVGQlJTeExRVUZMTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNN08wRkJSVE5FTEZGQlFVMHNUMEZCVHl4SFFVRkhMRTlCUVU4c1EwRkJReXhQUVVGUExFVkJRVVVzUTBGQlF6dEJRVU5zUXl4UlFVRk5MRU5CUVVNc1IwRkJSeXhGUVVGRkxFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhIUVVGSExFOUJRVThzUTBGQlF5eEpRVUZKTEVkQlFVY3NUMEZCVHl4RFFVRkRMRWxCUVVrc1IwRkJSeXhGUVVGRkxFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRemxGTEZGQlFVMHNVMEZCVXl4SFFVRkhMRVZCUVVVc1EwRkJReXhOUVVGTkxFTkJRVU1zV1VGQldTeERRVUZETEVOQlEzUkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFVkJRVVVzUTBGQlF5eERRVUZETEVOQlEySXNTVUZCU1N4RFFVRkRMRWxCUVVrc1JVRkJSU3hEUVVGRExFTkJRVU1zUTBGRFlpeEpRVUZKTEVOQlFVTXNTVUZCU1N4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVOaUxFbEJRVWtzUTBGQlF5eEpRVUZKTEVWQlFVVXNUMEZCVHl4RFFVRkRMRkZCUVZFc1JVRkJSU3hEUVVGRExFMUJRVTBzUjBGQlJ5eFBRVUZQTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1IwRkRNMFE3UTBGRFJpeERRVUZET3p0QlFVVkdMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzVDBGQlR5eERRVUZESWl3aVptbHNaU0k2SWk5VmMyVnljeTluY21WbmIzSjVYMlp2YzNSbGNpOXZjR1Z1YzI5MWNtTmxYMmh2Ym1WNWNHOTBMMmh2Ym1WNWNHOTBMMlJsZGk5elkzSnBjSFJ6TDNWcEwyUXpRMmhoY25RdWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2THlCa00wTm9ZWEowTG1welhHNHZLbXB6YUdsdWRDQmxjMjVsZUhRNklIUnlkV1VnS2k5Y2JseHVZMjl1YzNRZ1pETkRhR0Z5ZENBOUlIdDlPMXh1WTI5dWMzUWdSR1YwWVdsc1ZtbGxkMEZqZEdsdmJuTWdQU0J5WlhGMWFYSmxLQ2N1TGk5aFkzUnBiMjV6TDBSbGRHRnBiRlpwWlhkQlkzUnBiMjV6SnlrN1hHNWNibVF6UTJoaGNuUXVZM0psWVhSbElEMGdablZ1WTNScGIyNG9aV3dwSUh0Y2JseHVJQ0JqYjI1emRDQmphR0Z5ZENBOUlHUXpMbk5sYkdWamRDaGxiQ2t1WVhCd1pXNWtLQ2R6ZG1jbktWeHVJQ0FnSUM1aGRIUnlLQ2RqYkdGemN5Y3NJQ2R0WVdsdVEyaGhjblFuS1Z4dUlDQWdJQzV2YmlnbmJXOTFjMlZ0YjNabEp5d2daRE5EYUdGeWRDNXRiM1Z6WlcxdmRtVXBPMXh1WEc0Z0lHTm9ZWEowTG1Gd2NHVnVaQ2duWTJ4cGNGQmhkR2duS1Z4dUlDQWdJQzVoZEhSeUtDZHBaQ2NzSUNkd2JHOTBRWEpsWVVOc2FYQW5LVnh1SUNBZ0lDNWhjSEJsYm1Rb0ozSmxZM1FuS1Z4dUlDQWdJQzVoZEhSeUtDZHBaQ2NzSUNkd2JHOTBRWEpsWVVOc2FYQlNaV04wSnlrN1hHNGdJQ0FnWEc0Z0lHTnZibk4wSUhCc2IzUkJjbVZoSUQwZ1kyaGhjblF1WVhCd1pXNWtLQ2RuSnlrN1hHNWNiaUFnY0d4dmRFRnlaV0ZjYmlBZ0lDQXVZWEJ3Wlc1a0tDZHpkbWM2Y0dGMGFDY3BYRzRnSUNBZ0xtRjBkSElvSjJOc1lYTnpKeXdnSjJ4cGJtVW5LVHRjYmx4dUlDQndiRzkwUVhKbFlWeHVJQ0FnSUM1aGNIQmxibVFvSjNOMlp6cHNhVzVsSnlsY2JpQWdJQ0F1WVhSMGNpZ25ZMnhoYzNNbkxDQW5abTlqZFhOTWFXNWxKeWs3WEc1Y2JpQWdZMmhoY25RdVlYQndaVzVrS0Nkbkp5bGNiaUFnSUNBdVlYUjBjaWduWTJ4aGMzTW5MQ0FuZUVGNGFYTW5LVHRjYmx4dUlDQmphR0Z5ZEM1aGNIQmxibVFvSjJjbktWeHVJQ0FnSUM1aGRIUnlLQ2RqYkdGemN5Y3NJQ2Q1UVhocGN5Y3BPMXh1WEc0Z0lHTnZibk4wSUc1aGRrTm9ZWEowSUQwZ1pETXVjMlZzWldOMEtHVnNLUzVoY0hCbGJtUW9KM04yWnljcFhHNGdJQ0FnTG1Oc1lYTnpaV1FvSjI1aGRtbG5ZWFJ2Y2ljc0lIUnlkV1VwTzF4dVhHNGdJRzVoZGtOb1lYSjBMbUZ3Y0dWdVpDZ25aeWNwWEc0Z0lDQWdMbUYwZEhJb0oyTnNZWE56Snl3Z0ozaEJlR2x6SnlrN1hHNWNiaUFnYm1GMlEyaGhjblF1WVhCd1pXNWtLQ2R3WVhSb0p5bGNiaUFnSUNBdVlYUjBjaWduWTJ4aGMzTW5MQ0FuWm1sc2JDY3BPMXh1WEc0Z0lHNWhka05vWVhKMExtRndjR1Z1WkNnbmNHRjBhQ2NwWEc0Z0lDQWdMbUYwZEhJb0oyTnNZWE56Snl3Z0oyeHBibVVuS1Z4dUlDQWdJQzVoZEhSeUtDZHpkSEp2YTJVbkxDQW5ZbXgxWlNjcFhHNGdJQ0FnTG1GMGRISW9KM04wY205clpTMTNhV1IwYUNjc0lESXBYRzRnSUNBZ0xtRjBkSElvSjJacGJHd25MQ0FuYm05dVpTY3BPMXh1WEc0Z0lHNWhka05vWVhKMExtRndjR1Z1WkNnblp5Y3BYRzRnSUNBZ0xtRjBkSElvSjJOc1lYTnpKeXdnSjNacFpYZHdiM0owSnlrN1hHNTlPMXh1WEc1a00wTm9ZWEowTG14cGJtVkdkVzVqZEdsdmJpQTlJR1oxYm1OMGFXOXVLSE5qWVd4bGN5a2dlMXh1SUNCeVpYUjFjbTRnWkRNdWMzWm5MbXhwYm1Vb0tWeHVJQ0FnSUM1NEtHWjFibU4wYVc5dUtHUXBJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQnpZMkZzWlhNdWVDaGtMbVJoZEdVcE8xeHVJQ0FnSUgwcFhHNGdJQ0FnTG5rb1puVnVZM1JwYjI0b1pDa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlITmpZV3hsY3k1NUtHUXVkbUZzZFdVcE8xeHVJQ0FnSUgwcFhHNGdJQ0FnTG1sdWRHVnljRzlzWVhSbEtDZHNhVzVsWVhJbktUdGNibjA3WEc1Y2JpOHZJRk5KV2tsT1J5QkpUa1pQVWsxQlZFbFBUbHh1WEc1a00wTm9ZWEowTG0xaGNtZHBibk1nUFNCbWRXNWpkR2x2YmlncElIdGNiaUFnY21WMGRYSnVJSHRpYjNSMGIyMDZOVEFzYkdWbWREbzNOWDA3WEc1OU8xeHVYRzVrTTBOb1lYSjBMbTFoYVc1VGFYcGxJRDBnWm5WdVkzUnBiMjRvS1NCN1hHNGdJR052Ym5OMElHTm9ZWEowSUQwZ1pETXVjMlZzWldOMEtDZHpkbWNuS1Zzd1hWc3dYVHRjYmlBZ1kyOXVjM1FnZDJsa2RHZ2dQU0JqYUdGeWRDNXZabVp6WlhSWGFXUjBhRHRjYmlBZ1kyOXVjM1FnYUdWcFoyaDBJRDBnWTJoaGNuUXViMlptYzJWMFNHVnBaMmgwTzF4dUlDQnlaWFIxY200Z2UzZHBaSFJvT25kcFpIUm9MQ0JvWldsbmFIUTZhR1ZwWjJoMGZUdGNibjA3WEc1Y2JtUXpRMmhoY25RdWJtRjJVMmw2WlNBOUlHWjFibU4wYVc5dUtDa2dlMXh1SUNCamIyNXpkQ0JqYUdGeWRDQTlJR1F6TG5ObGJHVmpkQ2duYzNabkp5bGJNRjFiTUYwN1hHNGdJR052Ym5OMElIZHBaSFJvSUQwZ1kyaGhjblF1YjJabWMyVjBWMmxrZEdnN1hHNGdJR052Ym5OMElHaGxhV2RvZENBOUlHTm9ZWEowTG05bVpuTmxkRWhsYVdkb2RDQXFJQ2d4THpZcE8xeHVJQ0J5WlhSMWNtNGdlM2RwWkhSb09uZHBaSFJvTENCb1pXbG5hSFE2YUdWcFoyaDBmVHRjYm4wN1hHNWNibVF6UTJoaGNuUXVkWEJrWVhSbElEMGdablZ1WTNScGIyNG9aR0YwWVNrZ2UxeHVYRzRnSUM4dklFMUJTVTRnUTBoQlVsUmNiaUFnWkRORGFHRnlkQzVrWVhSaElEMGdaR0YwWVR0Y2JpQWdZMjl1YzNRZ2JXRnBibE5wZW1VZ1BTQjBhR2x6TG0xaGFXNVRhWHBsS0NrN1hHNGdJR052Ym5OMElHMWhjbWRwYm5NZ1BTQjBhR2x6TG0xaGNtZHBibk1vS1R0Y2JpQWdaRE5EYUdGeWRDNXRZV2x1VTJOaGJHVnpJRDBnZEdocGN5NWZjMk5oYkdWektIdGNiaUFnSUNBZ0lIZzZiV0Z5WjJsdWN5NXNaV1owTEZ4dUlDQWdJQ0FnZVRvd0xGeHVJQ0FnSUNBZ2QybGtkR2c2YldGcGJsTnBlbVV1ZDJsa2RHZ3NYRzRnSUNBZ0lDQm9aV2xuYUhRNmJXRnBibE5wZW1VdWFHVnBaMmgwSUMwZ2JXRnlaMmx1Y3k1aWIzUjBiMjBzWEc0Z0lDQWdmU2s3WEc1Y2JpQWdZMjl1YzNRZ2JHbHVaVVoxYm1NZ1BTQjBhR2x6TG14cGJtVkdkVzVqZEdsdmJpaGtNME5vWVhKMExtMWhhVzVUWTJGc1pYTXBPMXh1WEc0Z0lHTnZibk4wSUhoQmVHbHpJRDBnWkRNdWMzWm5MbUY0YVhNb0tWeHVJQ0FnSUM1elkyRnNaU2hrTTBOb1lYSjBMbTFoYVc1VFkyRnNaWE11ZUNsY2JpQWdJQ0F1YjNKcFpXNTBLQ2RpYjNSMGIyMG5LVnh1SUNBZ0lDNTBhV05yY3lnMktUdGNibHh1SUNCamIyNXpkQ0I1UVhocGN5QTlJR1F6TG5OMlp5NWhlR2x6S0NsY2JpQWdJQ0F1YzJOaGJHVW9aRE5EYUdGeWRDNXRZV2x1VTJOaGJHVnpMbmtwWEc0Z0lDQWdMbTl5YVdWdWRDZ25iR1ZtZENjcFhHNGdJQ0FnTG5ScFkydEdiM0p0WVhRb1pETXVabTl5YldGMEtGd2lMak56WENJcEtWeHVJQ0FnSUM1MGFXTnJjeWcxS1R0Y2JseHVJQ0JqYjI1emRDQnRZV2x1UTJoaGNuUWdQU0JrTXk1elpXeGxZM1FvSnk1dFlXbHVRMmhoY25RbktUc2dYRzRnSUcxaGFXNURhR0Z5ZEM1elpXeGxZM1FvSnk1NFFYaHBjeWNwWEc0Z0lDQWdMbUYwZEhJb0ozUnlZVzV6Wm05eWJTY3NJQ2QwY21GdWMyeGhkR1VvTUN3Z0p5c29iV0ZwYmxOcGVtVXVhR1ZwWjJoMExXMWhjbWRwYm5NdVltOTBkRzl0S1NzbktTY3BJQ0JjYmlBZ0lDQXVkSEpoYm5OcGRHbHZiaWdwWEc0Z0lDQWdMbU5oYkd3b2VFRjRhWE1wTzF4dUlDQnRZV2x1UTJoaGNuUXVjMlZzWldOMEtDY3VlVUY0YVhNbktWeHVJQ0FnSUM1aGRIUnlLQ2QwY21GdWMyWnZjbTBuTENBbmRISmhibk5zWVhSbEtDY3JiV0Z5WjJsdWN5NXNaV1owS3ljc0lEQXBKeWtnSUZ4dUlDQWdJQzUwY21GdWMybDBhVzl1S0NsY2JpQWdJQ0F1WTJGc2JDaDVRWGhwY3lrN1hHNGdJRzFoYVc1RGFHRnlkQzV6Wld4bFkzUW9KeTVzYVc1bEp5bGNiaUFnSUNBdWRISmhibk5wZEdsdmJpZ3BYRzRnSUNBZ0xtRjBkSElvSjJRbkxDQnNhVzVsUm5WdVl5aGtNME5vWVhKMExtUmhkR0VwS1R0Y2JseHVJQ0F2THlCT1FWWWdRMGhCVWxSY2JpQWdZMjl1YzNRZ2JtRjJVMmw2WlNBOUlIUm9hWE11Ym1GMlUybDZaU2dwTzF4dUlDQmtNME5vWVhKMExtNWhkbE5qWVd4bGN5QTlJSFJvYVhNdVgzTmpZV3hsY3loN1hHNGdJQ0FnZURwdFlYSm5hVzV6TG14bFpuUXNYRzRnSUNBZ2VUb3dMRnh1SUNBZ0lIZHBaSFJvT201aGRsTnBlbVV1ZDJsa2RHZ3NYRzRnSUNBZ2FHVnBaMmgwT201aGRsTnBlbVV1YUdWcFoyaDBMRnh1SUNCOUtUdGNibHh1SUNCamIyNXpkQ0J1WVhaRGFHRnlkQ0E5SUdRekxuTmxiR1ZqZENnbkxtNWhkbWxuWVhSdmNpY3BYRzRnSUNBZ0xtRjBkSElvSjNkcFpIUm9KeXdnYm1GMlUybDZaUzUzYVdSMGFDQXJJRzFoY21kcGJuTXViR1ZtZENsY2JpQWdJQ0F1WVhSMGNpZ25hR1ZwWjJoMEp5d2dibUYyVTJsNlpTNW9aV2xuYUhRZ0t5QnRZWEpuYVc1ekxtSnZkSFJ2YlNsY2JpQWdJQ0F1WVhSMGNpZ25kSEpoYm5ObWIzSnRKeXdnSjNSeVlXNXpiR0YwWlNnbksyMWhjbWRwYm5NdWJHVm1kQ3NuTENjcmJXRnlaMmx1Y3k1aWIzUjBiMjBySnlrbktUdGNibHh1SUNCamIyNXpkQ0J1WVhaWVFYaHBjeUE5SUdRekxuTjJaeTVoZUdsektDbGNiaUFnSUNBdWMyTmhiR1VvWkRORGFHRnlkQzV1WVhaVFkyRnNaWE11ZUNsY2JpQWdJQ0F1YjNKcFpXNTBLQ2RpYjNSMGIyMG5LVnh1SUNBZ0lDNTBhV05yY3lnMUtUdGNibHh1SUNCdVlYWkRhR0Z5ZEM1elpXeGxZM1FvSnk1NFFYaHBjeWNwWEc0Z0lDQWdMbUYwZEhJb0ozUnlZVzV6Wm05eWJTY3NJQ2QwY21GdWMyeGhkR1VvTUN3bklDc2dibUYyVTJsNlpTNW9aV2xuYUhRZ0t5QW5LU2NwWEc0Z0lDQWdMbU5oYkd3b2JtRjJXRUY0YVhNcE8xeHVYRzRnSUM4dklFNWhkaUJIY21Gd2FDQkdkVzVqZEdsdmJpQm1iM0lnWVhKbFlWeHVJQ0JqYjI1emRDQnVZWFpHYVd4c0lEMGdaRE11YzNabkxtRnlaV0VvS1Z4dUlDQWdJQzU0S0daMWJtTjBhVzl1SUNoa0tTQjdJSEpsZEhWeWJpQmtNME5vWVhKMExtNWhkbE5qWVd4bGN5NTRLR1F1WkdGMFpTazdJSDBwWEc0Z0lDQWdMbmt3S0c1aGRsTnBlbVV1YUdWcFoyaDBLVnh1SUNBZ0lDNTVNU2htZFc1amRHbHZiaUFvWkNrZ2V5QnlaWFIxY200Z1pETkRhR0Z5ZEM1dVlYWlRZMkZzWlhNdWVTaGtMblpoYkhWbEtUc2dmU2s3WEc1Y2JpQWdMeThnVG1GMklFZHlZWEJvSUVaMWJtTjBhVzl1SUdadmNpQnNhVzVsWEc0Z0lHTnZibk4wSUc1aGRreHBibVVnUFNCa015NXpkbWN1YkdsdVpTZ3BYRzRnSUNBZ0xuZ29ablZ1WTNScGIyNGdLR1FwSUhzZ2NtVjBkWEp1SUdRelEyaGhjblF1Ym1GMlUyTmhiR1Z6TG5nb1pDNWtZWFJsS1RzZ2ZTbGNiaUFnSUNBdWVTaG1kVzVqZEdsdmJpQW9aQ2tnZXlCeVpYUjFjbTRnWkRORGFHRnlkQzV1WVhaVFkyRnNaWE11ZVNoa0xuWmhiSFZsS1RzZ2ZTazdYRzVjYmlBZ2JtRjJRMmhoY25RdWMyVnNaV04wS0NjdVptbHNiQ2NwWEc0Z0lDQWdMblJ5WVc1emFYUnBiMjRvS1Z4dUlDQWdJQzVoZEhSeUtDZGtKeXdnYm1GMlJtbHNiQ2hrTTBOb1lYSjBMbVJoZEdFcEtUdGNibHh1SUNCdVlYWkRhR0Z5ZEM1elpXeGxZM1FvSnk1c2FXNWxKeWxjYmlBZ0lDQXVkSEpoYm5OcGRHbHZiaWdwWEc0Z0lDQWdMbUYwZEhJb0oyUW5MQ0J1WVhaTWFXNWxLR1F6UTJoaGNuUXVaR0YwWVNrcE8xeHVYRzRnSUdOdmJuTjBJSFpwWlhkd2IzSjBJRDBnWkRNdWMzWm5MbUp5ZFhOb0tDbGNiaUFnSUNBdWVDaGtNME5vWVhKMExtNWhkbE5qWVd4bGN5NTRLVnh1SUNBZ0lDNXZiaWduWW5KMWMyZ25MQ0JtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnSUNCa00wTm9ZWEowTG0xaGFXNVRZMkZzWlhNdWVDNWtiMjFoYVc0b2RtbGxkM0J2Y25RdVpXMXdkSGtvS1NBL0lHUXpRMmhoY25RdWJtRjJVMk5oYkdWekxuZ3VaRzl0WVdsdUtDa2dPaUIyYVdWM2NHOXlkQzVsZUhSbGJuUW9LU2s3WEc0Z0lDQWdJQ0JrTTBOb1lYSjBMbkpsWkhKaGQwTm9ZWEowS0dRelEyaGhjblF1YldGcGJsTmpZV3hsY3l3Z2VFRjRhWE1zSUdRelEyaGhjblF1WkdGMFlTazdYRzRnSUNBZ2ZTazdJRnh1WEc0Z0lHNWhka05vWVhKMExuTmxiR1ZqZENnbkxuWnBaWGR3YjNKMEp5bGNiaUFnSUNBdVkyRnNiQ2gyYVdWM2NHOXlkQ2xjYmlBZ0lDQXVjMlZzWldOMFFXeHNLQ2R5WldOMEp5bGNiaUFnSUNBdVlYUjBjaWduYUdWcFoyaDBKeXdnYm1GMlUybDZaUzVvWldsbmFIUXBPMXh1ZlR0Y2JseHVaRE5EYUdGeWRDNXlaV1J5WVhkRGFHRnlkQ0E5SUdaMWJtTjBhVzl1S0hOallXeGxjeXdnZUVGNGFYTXNJR1JoZEdFcElIdGNiaUFnWTI5dWMzUWdiR2x1WlVaMWJtTWdQU0IwYUdsekxteHBibVZHZFc1amRHbHZiaWh6WTJGc1pYTXBPMXh1SUNCNFFYaHBjeTV6WTJGc1pTaHpZMkZzWlhNdWVDazdYRzRnSUdRekxuTmxiR1ZqZENnbkxtMWhhVzVEYUdGeWRDY3BMbk5sYkdWamRDZ25MbmhCZUdsekp5a3VZMkZzYkNoNFFYaHBjeWs3WEc0Z0lHUXpMbk5sYkdWamRDZ25MbTFoYVc1RGFHRnlkQ2NwTG5ObGJHVmpkQ2duTG14cGJtVW5LUzVoZEhSeUtDZGtKeXdnYkdsdVpVWjFibU1vWkRORGFHRnlkQzVrWVhSaEtTazdYRzU5TzF4dVhHNWtNME5vWVhKMExsOXpZMkZzWlhNZ1BTQm1kVzVqZEdsdmJpaHlaV04wS1NCN1hHNWNiaUFnWTI5dWMzUWdaR0YwWlhNZ1BTQmtNME5vWVhKMExtUmhkR0V1YldGd0tHWjFibU4wYVc5dUtHTjFjaWw3Y21WMGRYSnVJR04xY2k1a1lYUmxPMzBwTzF4dUlDQmpiMjV6ZENCMllXeDFaWE1nUFNCa00wTm9ZWEowTG1SaGRHRXViV0Z3S0daMWJtTjBhVzl1S0dOMWNpbDdjbVYwZFhKdUlHTjFjaTUyWVd4MVpUdDlLVHRjYmlBZ1hHNGdJR052Ym5OMElHMWhlRVJoZEdVZ1BTQnVaWGNnUkdGMFpTaE5ZWFJvTG0xaGVDNWhjSEJzZVNodWRXeHNMR1JoZEdWektTazdYRzRnSUdOdmJuTjBJRzFwYmtSaGRHVWdQU0J1WlhjZ1JHRjBaU2hOWVhSb0xtMXBiaTVoY0hCc2VTaHVkV3hzTEdSaGRHVnpLU2s3WEc0Z0lHTnZibk4wSUcxaGVGWmhiSFZsSUQwZ1RXRjBhQzV0WVhndVlYQndiSGtvYm5Wc2JDeDJZV3gxWlhNcE8xeHVJQ0JqYjI1emRDQnRhVzVXWVd4MVpTQTlJRTFoZEdndWJXbHVMbUZ3Y0d4NUtHNTFiR3dzZG1Gc2RXVnpLVHRjYmlBZ1hHNGdJR052Ym5OMElIaFRZMkZzWlNBOUlHUXpMblJwYldVdWMyTmhiR1VvS1Z4dUlDQWdJQzVrYjIxaGFXNG9XMjFwYmtSaGRHVXNiV0Y0UkdGMFpWMHBYRzRnSUNBZ0xuSmhibWRsS0Z0eVpXTjBMbmdzSUhKbFkzUXVkMmxrZEdoZEtUdGNiaUFnSUNCY2JpQWdZMjl1YzNRZ2VWTmpZV3hsSUQwZ1pETXVjMk5oYkdVdWJHbHVaV0Z5S0NsY2JpQWdJQ0F1Wkc5dFlXbHVLRnR0YVc1V1lXeDFaU0FxSURBdU9Dd2diV0Y0Vm1Gc2RXVWdLaUF4TGpGZEtWeHVJQ0FnSUM1eVlXNW5aU2hiY21WamRDNW9aV2xuYUhRc0lISmxZM1F1ZVYwcE8xeHVYRzRnSUhKbGRIVnliaUI3ZURvZ2VGTmpZV3hsTENCNU9pQjVVMk5oYkdWOU8xeHVmVHRjYmx4dVpETkRhR0Z5ZEM1aWFYTmxZM1JFWVhSbElEMGdaRE11WW1selpXTjBiM0lvWm5WdVkzUnBiMjRvWkNrZ2V5QnlaWFIxY200Z1pDNWtZWFJsT3lCOUtTNXNaV1owTzF4dVhHNHZMeUJFY21GM0lHRWdkbVZ5ZEdsallXd2diR2x1WlNCaGJtUWdkWEJrWVhSbElIUm9aU0JtYjJOMWN5QmtZWFJsSUM4Z2RtRnNkV1ZjYm1RelEyaGhjblF1Ylc5MWMyVnRiM1psSUQwZ1puVnVZM1JwYjI0b0tTQjdYRzRnSUM4dklGTnVZWEFnZEc4Z2IyNWxJRzF2ZFhObElIQnZhVzUwSUdKbFkyRjFjMlVnZDJsc2JDQnVaWFpsY2lCdGIzVnpaU0J2ZG1WeUlHRWdaR0YwWlNCbGVHRmpkR3g1WEc0Z0lHbG1JQ2hrTTBOb1lYSjBMbVJoZEdFcElIdGNiaUFnSUNCamIyNXpkQ0J0YjNWelpXOTJaWEpFWVhSbElEMGdaRE5EYUdGeWRDNXRZV2x1VTJOaGJHVnpMbmd1YVc1MlpYSjBLR1F6TG0xdmRYTmxLSFJvYVhNcFd6QmRLU3hjYmlBZ0lDQWdJR2x1WkdWNElEMGdaRE5EYUdGeWRDNWlhWE5sWTNSRVlYUmxLR1F6UTJoaGNuUXVaR0YwWVN3Z2JXOTFjMlZ2ZG1WeVJHRjBaU3dnTVNrc1hHNGdJQ0FnSUNCd2IybHVkRUpsWm05eVpVUmhkR1VnUFNCa00wTm9ZWEowTG1SaGRHRmJhVzVrWlhnZ0xTQXhYU3hjYmlBZ0lDQWdJSEJ2YVc1MFQyNUVZWFJsSUQwZ1pETkRhR0Z5ZEM1a1lYUmhXMmx1WkdWNFhTeGNiaUFnSUNBZ0lIQnZhVzUwSUQwZ0tHMXZkWE5sYjNabGNrUmhkR1VnTFNCd2IybHVkRUpsWm05eVpVUmhkR1V1WkdGMFpTa2dQaUFvY0c5cGJuUlBia1JoZEdVdVpHRjBaU0F0SUcxdmRYTmxiM1psY2tSaGRHVXBJRDljYmlBZ0lDQWdJQ0FnY0c5cGJuUlBia1JoZEdVZ09pQndiMmx1ZEVKbFptOXlaVVJoZEdVN1hHNGdJQ0FnUkdWMFlXbHNWbWxsZDBGamRHbHZibk11ZFhCa1lYUmxSbTlqZFhORVlYUmhLSEJ2YVc1MExtUmhkR1VzSUhCdmFXNTBMblpoYkhWbEtUdGNiaUFnSUNBdkx5QkVjbUYzSUhSb1pTQnNhVzVsWEc0Z0lDQWdZMjl1YzNRZ2JXRnlaMmx1Y3lBOUlHUXpRMmhoY25RdWJXRnlaMmx1Y3lncE8xeHVJQ0FnSUdOdmJuTjBJSGdnUFNCa015NXRiM1Z6WlNoMGFHbHpLVnN3WFNBOElHMWhjbWRwYm5NdWJHVm1kQ0EvSUcxaGNtZHBibk11YkdWbWRDQTZJR1F6TG0xdmRYTmxLSFJvYVhNcFd6QmRPMXh1SUNBZ0lHTnZibk4wSUdadlkzVnpUR2x1WlNBOUlHUXpMbk5sYkdWamRDZ25MbVp2WTNWelRHbHVaU2NwWEc0Z0lDQWdJQ0F1WVhSMGNpZ25lREVuTENCNEtWeHVJQ0FnSUNBZ0xtRjBkSElvSjNneUp5d2dlQ2xjYmlBZ0lDQWdJQzVoZEhSeUtDZDVNU2NzSURBcFhHNGdJQ0FnSUNBdVlYUjBjaWduZVRFbkxDQmtNME5vWVhKMExtMWhhVzVUYVhwbEtDa3VhR1ZwWjJoMElDMGdiV0Z5WjJsdWN5NWliM1IwYjIwcE8xeHVJQ0I5WEc1OU8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJR1F6UTJoaGNuUTdYRzRpWFgwPSIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIHZhciBtO1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbihlbWl0dGVyLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IDE7XG4gIGVsc2VcbiAgICByZXQgPSBlbWl0dGVyLl9ldmVudHNbdHlwZV0ubGVuZ3RoO1xuICByZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbm1vZHVsZS5leHBvcnRzLkRpc3BhdGNoZXIgPSByZXF1aXJlKCcuL2xpYi9EaXNwYXRjaGVyJyk7XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNC0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIERpc3BhdGNoZXJcbiAqIFxuICogQHByZXZlbnRNdW5nZVxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb24nKTsgfSB9XG5cbnZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCdmYmpzL2xpYi9pbnZhcmlhbnQnKTtcblxudmFyIF9wcmVmaXggPSAnSURfJztcblxuLyoqXG4gKiBEaXNwYXRjaGVyIGlzIHVzZWQgdG8gYnJvYWRjYXN0IHBheWxvYWRzIHRvIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLiBUaGlzIGlzXG4gKiBkaWZmZXJlbnQgZnJvbSBnZW5lcmljIHB1Yi1zdWIgc3lzdGVtcyBpbiB0d28gd2F5czpcbiAqXG4gKiAgIDEpIENhbGxiYWNrcyBhcmUgbm90IHN1YnNjcmliZWQgdG8gcGFydGljdWxhciBldmVudHMuIEV2ZXJ5IHBheWxvYWQgaXNcbiAqICAgICAgZGlzcGF0Y2hlZCB0byBldmVyeSByZWdpc3RlcmVkIGNhbGxiYWNrLlxuICogICAyKSBDYWxsYmFja3MgY2FuIGJlIGRlZmVycmVkIGluIHdob2xlIG9yIHBhcnQgdW50aWwgb3RoZXIgY2FsbGJhY2tzIGhhdmVcbiAqICAgICAgYmVlbiBleGVjdXRlZC5cbiAqXG4gKiBGb3IgZXhhbXBsZSwgY29uc2lkZXIgdGhpcyBoeXBvdGhldGljYWwgZmxpZ2h0IGRlc3RpbmF0aW9uIGZvcm0sIHdoaWNoXG4gKiBzZWxlY3RzIGEgZGVmYXVsdCBjaXR5IHdoZW4gYSBjb3VudHJ5IGlzIHNlbGVjdGVkOlxuICpcbiAqICAgdmFyIGZsaWdodERpc3BhdGNoZXIgPSBuZXcgRGlzcGF0Y2hlcigpO1xuICpcbiAqICAgLy8gS2VlcHMgdHJhY2sgb2Ygd2hpY2ggY291bnRyeSBpcyBzZWxlY3RlZFxuICogICB2YXIgQ291bnRyeVN0b3JlID0ge2NvdW50cnk6IG51bGx9O1xuICpcbiAqICAgLy8gS2VlcHMgdHJhY2sgb2Ygd2hpY2ggY2l0eSBpcyBzZWxlY3RlZFxuICogICB2YXIgQ2l0eVN0b3JlID0ge2NpdHk6IG51bGx9O1xuICpcbiAqICAgLy8gS2VlcHMgdHJhY2sgb2YgdGhlIGJhc2UgZmxpZ2h0IHByaWNlIG9mIHRoZSBzZWxlY3RlZCBjaXR5XG4gKiAgIHZhciBGbGlnaHRQcmljZVN0b3JlID0ge3ByaWNlOiBudWxsfVxuICpcbiAqIFdoZW4gYSB1c2VyIGNoYW5nZXMgdGhlIHNlbGVjdGVkIGNpdHksIHdlIGRpc3BhdGNoIHRoZSBwYXlsb2FkOlxuICpcbiAqICAgZmxpZ2h0RGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gKiAgICAgYWN0aW9uVHlwZTogJ2NpdHktdXBkYXRlJyxcbiAqICAgICBzZWxlY3RlZENpdHk6ICdwYXJpcydcbiAqICAgfSk7XG4gKlxuICogVGhpcyBwYXlsb2FkIGlzIGRpZ2VzdGVkIGJ5IGBDaXR5U3RvcmVgOlxuICpcbiAqICAgZmxpZ2h0RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihwYXlsb2FkKSB7XG4gKiAgICAgaWYgKHBheWxvYWQuYWN0aW9uVHlwZSA9PT0gJ2NpdHktdXBkYXRlJykge1xuICogICAgICAgQ2l0eVN0b3JlLmNpdHkgPSBwYXlsb2FkLnNlbGVjdGVkQ2l0eTtcbiAqICAgICB9XG4gKiAgIH0pO1xuICpcbiAqIFdoZW4gdGhlIHVzZXIgc2VsZWN0cyBhIGNvdW50cnksIHdlIGRpc3BhdGNoIHRoZSBwYXlsb2FkOlxuICpcbiAqICAgZmxpZ2h0RGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gKiAgICAgYWN0aW9uVHlwZTogJ2NvdW50cnktdXBkYXRlJyxcbiAqICAgICBzZWxlY3RlZENvdW50cnk6ICdhdXN0cmFsaWEnXG4gKiAgIH0pO1xuICpcbiAqIFRoaXMgcGF5bG9hZCBpcyBkaWdlc3RlZCBieSBib3RoIHN0b3JlczpcbiAqXG4gKiAgIENvdW50cnlTdG9yZS5kaXNwYXRjaFRva2VuID0gZmxpZ2h0RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihwYXlsb2FkKSB7XG4gKiAgICAgaWYgKHBheWxvYWQuYWN0aW9uVHlwZSA9PT0gJ2NvdW50cnktdXBkYXRlJykge1xuICogICAgICAgQ291bnRyeVN0b3JlLmNvdW50cnkgPSBwYXlsb2FkLnNlbGVjdGVkQ291bnRyeTtcbiAqICAgICB9XG4gKiAgIH0pO1xuICpcbiAqIFdoZW4gdGhlIGNhbGxiYWNrIHRvIHVwZGF0ZSBgQ291bnRyeVN0b3JlYCBpcyByZWdpc3RlcmVkLCB3ZSBzYXZlIGEgcmVmZXJlbmNlXG4gKiB0byB0aGUgcmV0dXJuZWQgdG9rZW4uIFVzaW5nIHRoaXMgdG9rZW4gd2l0aCBgd2FpdEZvcigpYCwgd2UgY2FuIGd1YXJhbnRlZVxuICogdGhhdCBgQ291bnRyeVN0b3JlYCBpcyB1cGRhdGVkIGJlZm9yZSB0aGUgY2FsbGJhY2sgdGhhdCB1cGRhdGVzIGBDaXR5U3RvcmVgXG4gKiBuZWVkcyB0byBxdWVyeSBpdHMgZGF0YS5cbiAqXG4gKiAgIENpdHlTdG9yZS5kaXNwYXRjaFRva2VuID0gZmxpZ2h0RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihwYXlsb2FkKSB7XG4gKiAgICAgaWYgKHBheWxvYWQuYWN0aW9uVHlwZSA9PT0gJ2NvdW50cnktdXBkYXRlJykge1xuICogICAgICAgLy8gYENvdW50cnlTdG9yZS5jb3VudHJ5YCBtYXkgbm90IGJlIHVwZGF0ZWQuXG4gKiAgICAgICBmbGlnaHREaXNwYXRjaGVyLndhaXRGb3IoW0NvdW50cnlTdG9yZS5kaXNwYXRjaFRva2VuXSk7XG4gKiAgICAgICAvLyBgQ291bnRyeVN0b3JlLmNvdW50cnlgIGlzIG5vdyBndWFyYW50ZWVkIHRvIGJlIHVwZGF0ZWQuXG4gKlxuICogICAgICAgLy8gU2VsZWN0IHRoZSBkZWZhdWx0IGNpdHkgZm9yIHRoZSBuZXcgY291bnRyeVxuICogICAgICAgQ2l0eVN0b3JlLmNpdHkgPSBnZXREZWZhdWx0Q2l0eUZvckNvdW50cnkoQ291bnRyeVN0b3JlLmNvdW50cnkpO1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogVGhlIHVzYWdlIG9mIGB3YWl0Rm9yKClgIGNhbiBiZSBjaGFpbmVkLCBmb3IgZXhhbXBsZTpcbiAqXG4gKiAgIEZsaWdodFByaWNlU3RvcmUuZGlzcGF0Y2hUb2tlbiA9XG4gKiAgICAgZmxpZ2h0RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihwYXlsb2FkKSB7XG4gKiAgICAgICBzd2l0Y2ggKHBheWxvYWQuYWN0aW9uVHlwZSkge1xuICogICAgICAgICBjYXNlICdjb3VudHJ5LXVwZGF0ZSc6XG4gKiAgICAgICAgIGNhc2UgJ2NpdHktdXBkYXRlJzpcbiAqICAgICAgICAgICBmbGlnaHREaXNwYXRjaGVyLndhaXRGb3IoW0NpdHlTdG9yZS5kaXNwYXRjaFRva2VuXSk7XG4gKiAgICAgICAgICAgRmxpZ2h0UHJpY2VTdG9yZS5wcmljZSA9XG4gKiAgICAgICAgICAgICBnZXRGbGlnaHRQcmljZVN0b3JlKENvdW50cnlTdG9yZS5jb3VudHJ5LCBDaXR5U3RvcmUuY2l0eSk7XG4gKiAgICAgICAgICAgYnJlYWs7XG4gKiAgICAgfVxuICogICB9KTtcbiAqXG4gKiBUaGUgYGNvdW50cnktdXBkYXRlYCBwYXlsb2FkIHdpbGwgYmUgZ3VhcmFudGVlZCB0byBpbnZva2UgdGhlIHN0b3JlcydcbiAqIHJlZ2lzdGVyZWQgY2FsbGJhY2tzIGluIG9yZGVyOiBgQ291bnRyeVN0b3JlYCwgYENpdHlTdG9yZWAsIHRoZW5cbiAqIGBGbGlnaHRQcmljZVN0b3JlYC5cbiAqL1xuXG52YXIgRGlzcGF0Y2hlciA9IChmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIERpc3BhdGNoZXIoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIERpc3BhdGNoZXIpO1xuXG4gICAgdGhpcy5fY2FsbGJhY2tzID0ge307XG4gICAgdGhpcy5faXNEaXNwYXRjaGluZyA9IGZhbHNlO1xuICAgIHRoaXMuX2lzSGFuZGxlZCA9IHt9O1xuICAgIHRoaXMuX2lzUGVuZGluZyA9IHt9O1xuICAgIHRoaXMuX2xhc3RJRCA9IDE7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgaW52b2tlZCB3aXRoIGV2ZXJ5IGRpc3BhdGNoZWQgcGF5bG9hZC4gUmV0dXJuc1xuICAgKiBhIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgd2l0aCBgd2FpdEZvcigpYC5cbiAgICovXG5cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUucmVnaXN0ZXIgPSBmdW5jdGlvbiByZWdpc3RlcihjYWxsYmFjaykge1xuICAgIHZhciBpZCA9IF9wcmVmaXggKyB0aGlzLl9sYXN0SUQrKztcbiAgICB0aGlzLl9jYWxsYmFja3NbaWRdID0gY2FsbGJhY2s7XG4gICAgcmV0dXJuIGlkO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgY2FsbGJhY2sgYmFzZWQgb24gaXRzIHRva2VuLlxuICAgKi9cblxuICBEaXNwYXRjaGVyLnByb3RvdHlwZS51bnJlZ2lzdGVyID0gZnVuY3Rpb24gdW5yZWdpc3RlcihpZCkge1xuICAgICF0aGlzLl9jYWxsYmFja3NbaWRdID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ0Rpc3BhdGNoZXIudW5yZWdpc3RlciguLi4pOiBgJXNgIGRvZXMgbm90IG1hcCB0byBhIHJlZ2lzdGVyZWQgY2FsbGJhY2suJywgaWQpIDogaW52YXJpYW50KGZhbHNlKSA6IHVuZGVmaW5lZDtcbiAgICBkZWxldGUgdGhpcy5fY2FsbGJhY2tzW2lkXTtcbiAgfTtcblxuICAvKipcbiAgICogV2FpdHMgZm9yIHRoZSBjYWxsYmFja3Mgc3BlY2lmaWVkIHRvIGJlIGludm9rZWQgYmVmb3JlIGNvbnRpbnVpbmcgZXhlY3V0aW9uXG4gICAqIG9mIHRoZSBjdXJyZW50IGNhbGxiYWNrLiBUaGlzIG1ldGhvZCBzaG91bGQgb25seSBiZSB1c2VkIGJ5IGEgY2FsbGJhY2sgaW5cbiAgICogcmVzcG9uc2UgdG8gYSBkaXNwYXRjaGVkIHBheWxvYWQuXG4gICAqL1xuXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLndhaXRGb3IgPSBmdW5jdGlvbiB3YWl0Rm9yKGlkcykge1xuICAgICF0aGlzLl9pc0Rpc3BhdGNoaW5nID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ0Rpc3BhdGNoZXIud2FpdEZvciguLi4pOiBNdXN0IGJlIGludm9rZWQgd2hpbGUgZGlzcGF0Y2hpbmcuJykgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCBpZHMubGVuZ3RoOyBpaSsrKSB7XG4gICAgICB2YXIgaWQgPSBpZHNbaWldO1xuICAgICAgaWYgKHRoaXMuX2lzUGVuZGluZ1tpZF0pIHtcbiAgICAgICAgIXRoaXMuX2lzSGFuZGxlZFtpZF0gPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnRGlzcGF0Y2hlci53YWl0Rm9yKC4uLik6IENpcmN1bGFyIGRlcGVuZGVuY3kgZGV0ZWN0ZWQgd2hpbGUgJyArICd3YWl0aW5nIGZvciBgJXNgLicsIGlkKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgIXRoaXMuX2NhbGxiYWNrc1tpZF0gPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnRGlzcGF0Y2hlci53YWl0Rm9yKC4uLik6IGAlc2AgZG9lcyBub3QgbWFwIHRvIGEgcmVnaXN0ZXJlZCBjYWxsYmFjay4nLCBpZCkgOiBpbnZhcmlhbnQoZmFsc2UpIDogdW5kZWZpbmVkO1xuICAgICAgdGhpcy5faW52b2tlQ2FsbGJhY2soaWQpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogRGlzcGF0Y2hlcyBhIHBheWxvYWQgdG8gYWxsIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLlxuICAgKi9cblxuICBEaXNwYXRjaGVyLnByb3RvdHlwZS5kaXNwYXRjaCA9IGZ1bmN0aW9uIGRpc3BhdGNoKHBheWxvYWQpIHtcbiAgICAhIXRoaXMuX2lzRGlzcGF0Y2hpbmcgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnRGlzcGF0Y2guZGlzcGF0Y2goLi4uKTogQ2Fubm90IGRpc3BhdGNoIGluIHRoZSBtaWRkbGUgb2YgYSBkaXNwYXRjaC4nKSA6IGludmFyaWFudChmYWxzZSkgOiB1bmRlZmluZWQ7XG4gICAgdGhpcy5fc3RhcnREaXNwYXRjaGluZyhwYXlsb2FkKTtcbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgaWQgaW4gdGhpcy5fY2FsbGJhY2tzKSB7XG4gICAgICAgIGlmICh0aGlzLl9pc1BlbmRpbmdbaWRdKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5faW52b2tlQ2FsbGJhY2soaWQpO1xuICAgICAgfVxuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLl9zdG9wRGlzcGF0Y2hpbmcoKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIElzIHRoaXMgRGlzcGF0Y2hlciBjdXJyZW50bHkgZGlzcGF0Y2hpbmcuXG4gICAqL1xuXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLmlzRGlzcGF0Y2hpbmcgPSBmdW5jdGlvbiBpc0Rpc3BhdGNoaW5nKCkge1xuICAgIHJldHVybiB0aGlzLl9pc0Rpc3BhdGNoaW5nO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDYWxsIHRoZSBjYWxsYmFjayBzdG9yZWQgd2l0aCB0aGUgZ2l2ZW4gaWQuIEFsc28gZG8gc29tZSBpbnRlcm5hbFxuICAgKiBib29ra2VlcGluZy5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLl9pbnZva2VDYWxsYmFjayA9IGZ1bmN0aW9uIF9pbnZva2VDYWxsYmFjayhpZCkge1xuICAgIHRoaXMuX2lzUGVuZGluZ1tpZF0gPSB0cnVlO1xuICAgIHRoaXMuX2NhbGxiYWNrc1tpZF0odGhpcy5fcGVuZGluZ1BheWxvYWQpO1xuICAgIHRoaXMuX2lzSGFuZGxlZFtpZF0gPSB0cnVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBTZXQgdXAgYm9va2tlZXBpbmcgbmVlZGVkIHdoZW4gZGlzcGF0Y2hpbmcuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cblxuICBEaXNwYXRjaGVyLnByb3RvdHlwZS5fc3RhcnREaXNwYXRjaGluZyA9IGZ1bmN0aW9uIF9zdGFydERpc3BhdGNoaW5nKHBheWxvYWQpIHtcbiAgICBmb3IgKHZhciBpZCBpbiB0aGlzLl9jYWxsYmFja3MpIHtcbiAgICAgIHRoaXMuX2lzUGVuZGluZ1tpZF0gPSBmYWxzZTtcbiAgICAgIHRoaXMuX2lzSGFuZGxlZFtpZF0gPSBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy5fcGVuZGluZ1BheWxvYWQgPSBwYXlsb2FkO1xuICAgIHRoaXMuX2lzRGlzcGF0Y2hpbmcgPSB0cnVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDbGVhciBib29ra2VlcGluZyB1c2VkIGZvciBkaXNwYXRjaGluZy5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLl9zdG9wRGlzcGF0Y2hpbmcgPSBmdW5jdGlvbiBfc3RvcERpc3BhdGNoaW5nKCkge1xuICAgIGRlbGV0ZSB0aGlzLl9wZW5kaW5nUGF5bG9hZDtcbiAgICB0aGlzLl9pc0Rpc3BhdGNoaW5nID0gZmFsc2U7XG4gIH07XG5cbiAgcmV0dXJuIERpc3BhdGNoZXI7XG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpc3BhdGNoZXI7IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIGludmFyaWFudFxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIFVzZSBpbnZhcmlhbnQoKSB0byBhc3NlcnQgc3RhdGUgd2hpY2ggeW91ciBwcm9ncmFtIGFzc3VtZXMgdG8gYmUgdHJ1ZS5cbiAqXG4gKiBQcm92aWRlIHNwcmludGYtc3R5bGUgZm9ybWF0IChvbmx5ICVzIGlzIHN1cHBvcnRlZCkgYW5kIGFyZ3VtZW50c1xuICogdG8gcHJvdmlkZSBpbmZvcm1hdGlvbiBhYm91dCB3aGF0IGJyb2tlIGFuZCB3aGF0IHlvdSB3ZXJlXG4gKiBleHBlY3RpbmcuXG4gKlxuICogVGhlIGludmFyaWFudCBtZXNzYWdlIHdpbGwgYmUgc3RyaXBwZWQgaW4gcHJvZHVjdGlvbiwgYnV0IHRoZSBpbnZhcmlhbnRcbiAqIHdpbGwgcmVtYWluIHRvIGVuc3VyZSBsb2dpYyBkb2VzIG5vdCBkaWZmZXIgaW4gcHJvZHVjdGlvbi5cbiAqL1xuXG52YXIgaW52YXJpYW50ID0gZnVuY3Rpb24gKGNvbmRpdGlvbiwgZm9ybWF0LCBhLCBiLCBjLCBkLCBlLCBmKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFyaWFudCByZXF1aXJlcyBhbiBlcnJvciBtZXNzYWdlIGFyZ3VtZW50Jyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFjb25kaXRpb24pIHtcbiAgICB2YXIgZXJyb3I7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcignTWluaWZpZWQgZXhjZXB0aW9uIG9jY3VycmVkOyB1c2UgdGhlIG5vbi1taW5pZmllZCBkZXYgZW52aXJvbm1lbnQgJyArICdmb3IgdGhlIGZ1bGwgZXJyb3IgbWVzc2FnZSBhbmQgYWRkaXRpb25hbCBoZWxwZnVsIHdhcm5pbmdzLicpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYXJncyA9IFthLCBiLCBjLCBkLCBlLCBmXTtcbiAgICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcignSW52YXJpYW50IFZpb2xhdGlvbjogJyArIGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBhcmdzW2FyZ0luZGV4KytdO1xuICAgICAgfSkpO1xuICAgIH1cblxuICAgIGVycm9yLmZyYW1lc1RvUG9wID0gMTsgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCBpbnZhcmlhbnQncyBvd24gZnJhbWVcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbnZhcmlhbnQ7IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE0IEZhY2Vib29rLCBJbmMuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIENvbnN0cnVjdHMgYW4gZW51bWVyYXRpb24gd2l0aCBrZXlzIGVxdWFsIHRvIHRoZWlyIHZhbHVlLlxuICpcbiAqIEZvciBleGFtcGxlOlxuICpcbiAqICAgdmFyIENPTE9SUyA9IGtleU1pcnJvcih7Ymx1ZTogbnVsbCwgcmVkOiBudWxsfSk7XG4gKiAgIHZhciBteUNvbG9yID0gQ09MT1JTLmJsdWU7XG4gKiAgIHZhciBpc0NvbG9yVmFsaWQgPSAhIUNPTE9SU1tteUNvbG9yXTtcbiAqXG4gKiBUaGUgbGFzdCBsaW5lIGNvdWxkIG5vdCBiZSBwZXJmb3JtZWQgaWYgdGhlIHZhbHVlcyBvZiB0aGUgZ2VuZXJhdGVkIGVudW0gd2VyZVxuICogbm90IGVxdWFsIHRvIHRoZWlyIGtleXMuXG4gKlxuICogICBJbnB1dDogIHtrZXkxOiB2YWwxLCBrZXkyOiB2YWwyfVxuICogICBPdXRwdXQ6IHtrZXkxOiBrZXkxLCBrZXkyOiBrZXkyfVxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge29iamVjdH1cbiAqL1xudmFyIGtleU1pcnJvciA9IGZ1bmN0aW9uKG9iaikge1xuICB2YXIgcmV0ID0ge307XG4gIHZhciBrZXk7XG4gIGlmICghKG9iaiBpbnN0YW5jZW9mIE9iamVjdCAmJiAhQXJyYXkuaXNBcnJheShvYmopKSkge1xuICAgIHRocm93IG5ldyBFcnJvcigna2V5TWlycm9yKC4uLik6IEFyZ3VtZW50IG11c3QgYmUgYW4gb2JqZWN0LicpO1xuICB9XG4gIGZvciAoa2V5IGluIG9iaikge1xuICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICByZXRba2V5XSA9IGtleTtcbiAgfVxuICByZXR1cm4gcmV0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBrZXlNaXJyb3I7XG4iLCJ2YXIga2V5cyA9IHJlcXVpcmUoJ29iamVjdC1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaGFzU3ltYm9scygpIHtcblx0aWYgKHR5cGVvZiBTeW1ib2wgIT09ICdmdW5jdGlvbicgfHwgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgIT09ICdmdW5jdGlvbicpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdGlmICh0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSAnc3ltYm9sJykgeyByZXR1cm4gdHJ1ZTsgfVxuXG5cdHZhciBvYmogPSB7fTtcblx0dmFyIHN5bSA9IFN5bWJvbCgndGVzdCcpO1xuXHRpZiAodHlwZW9mIHN5bSA9PT0gJ3N0cmluZycpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdGlmIChzeW0gaW5zdGFuY2VvZiBTeW1ib2wpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdG9ialtzeW1dID0gNDI7XG5cdGZvciAoc3ltIGluIG9iaikgeyByZXR1cm4gZmFsc2U7IH1cblx0aWYgKGtleXMob2JqKS5sZW5ndGggIT09IDApIHsgcmV0dXJuIGZhbHNlOyB9XG5cdGlmICh0eXBlb2YgT2JqZWN0LmtleXMgPT09ICdmdW5jdGlvbicgJiYgT2JqZWN0LmtleXMob2JqKS5sZW5ndGggIT09IDApIHsgcmV0dXJuIGZhbHNlOyB9XG5cblx0aWYgKHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyA9PT0gJ2Z1bmN0aW9uJyAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmopLmxlbmd0aCAhPT0gMCkgeyByZXR1cm4gZmFsc2U7IH1cblxuXHR2YXIgc3ltcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMob2JqKTtcblx0aWYgKHN5bXMubGVuZ3RoICE9PSAxIHx8IHN5bXNbMF0gIT09IHN5bSkgeyByZXR1cm4gZmFsc2U7IH1cblxuXHRpZiAoIU9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChvYmosIHN5bSkpIHsgcmV0dXJuIGZhbHNlOyB9XG5cblx0aWYgKHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0dmFyIGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwgc3ltKTtcblx0XHRpZiAoZGVzY3JpcHRvci52YWx1ZSAhPT0gNDIgfHwgZGVzY3JpcHRvci5lbnVtZXJhYmxlICE9PSB0cnVlKSB7IHJldHVybiBmYWxzZTsgfVxuXHR9XG5cblx0cmV0dXJuIHRydWU7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBtb2RpZmllZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9lcy1zaGltcy9lczYtc2hpbVxudmFyIGtleXMgPSByZXF1aXJlKCdvYmplY3Qta2V5cycpO1xudmFyIGNhbkJlT2JqZWN0ID0gZnVuY3Rpb24gKG9iaikge1xuXHRyZXR1cm4gdHlwZW9mIG9iaiAhPT0gJ3VuZGVmaW5lZCcgJiYgb2JqICE9PSBudWxsO1xufTtcbnZhciBoYXNTeW1ib2xzID0gcmVxdWlyZSgnLi9oYXNTeW1ib2xzJykoKTtcbnZhciBkZWZpbmVQcm9wZXJ0aWVzID0gcmVxdWlyZSgnZGVmaW5lLXByb3BlcnRpZXMnKTtcbnZhciB0b09iamVjdCA9IE9iamVjdDtcbnZhciBwdXNoID0gQXJyYXkucHJvdG90eXBlLnB1c2g7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbnZhciBhc3NpZ25TaGltID0gZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlMSkge1xuXHRpZiAoIWNhbkJlT2JqZWN0KHRhcmdldCkpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcigndGFyZ2V0IG11c3QgYmUgYW4gb2JqZWN0Jyk7IH1cblx0dmFyIG9ialRhcmdldCA9IHRvT2JqZWN0KHRhcmdldCk7XG5cdHZhciBzLCBzb3VyY2UsIGksIHByb3BzLCBzeW1zO1xuXHRmb3IgKHMgPSAxOyBzIDwgYXJndW1lbnRzLmxlbmd0aDsgKytzKSB7XG5cdFx0c291cmNlID0gdG9PYmplY3QoYXJndW1lbnRzW3NdKTtcblx0XHRwcm9wcyA9IGtleXMoc291cmNlKTtcblx0XHRpZiAoaGFzU3ltYm9scyAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1zID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzb3VyY2UpO1xuXHRcdFx0Zm9yIChpID0gMDsgaSA8IHN5bXMubGVuZ3RoOyArK2kpIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChzb3VyY2UsIHN5bXNbaV0pKSB7XG5cdFx0XHRcdFx0cHVzaC5jYWxsKHByb3BzLCBzeW1zW2ldKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRmb3IgKGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyArK2kpIHtcblx0XHRcdG9ialRhcmdldFtwcm9wc1tpXV0gPSBzb3VyY2VbcHJvcHNbaV1dO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gb2JqVGFyZ2V0O1xufTtcblxuZGVmaW5lUHJvcGVydGllcyhhc3NpZ25TaGltLCB7XG5cdHNoaW06IGZ1bmN0aW9uIHNoaW1PYmplY3RBc3NpZ24oKSB7XG5cdFx0dmFyIGFzc2lnbkhhc1BlbmRpbmdFeGNlcHRpb25zID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYgKCFPYmplY3QuYXNzaWduIHx8ICFPYmplY3QucHJldmVudEV4dGVuc2lvbnMpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0Ly8gRmlyZWZveCAzNyBzdGlsbCBoYXMgXCJwZW5kaW5nIGV4Y2VwdGlvblwiIGxvZ2ljIGluIGl0cyBPYmplY3QuYXNzaWduIGltcGxlbWVudGF0aW9uLFxuXHRcdFx0Ly8gd2hpY2ggaXMgNzIlIHNsb3dlciB0aGFuIG91ciBzaGltLCBhbmQgRmlyZWZveCA0MCdzIG5hdGl2ZSBpbXBsZW1lbnRhdGlvbi5cblx0XHRcdHZhciB0aHJvd2VyID0gT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zKHsgMTogMiB9KTtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdE9iamVjdC5hc3NpZ24odGhyb3dlciwgJ3h5Jyk7XG5cdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdHJldHVybiB0aHJvd2VyWzFdID09PSAneSc7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRkZWZpbmVQcm9wZXJ0aWVzKFxuXHRcdFx0T2JqZWN0LFxuXHRcdFx0eyBhc3NpZ246IGFzc2lnblNoaW0gfSxcblx0XHRcdHsgYXNzaWduOiBhc3NpZ25IYXNQZW5kaW5nRXhjZXB0aW9ucyB9XG5cdFx0KTtcblx0XHRyZXR1cm4gT2JqZWN0LmFzc2lnbiB8fCBhc3NpZ25TaGltO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBhc3NpZ25TaGltO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIga2V5cyA9IHJlcXVpcmUoJ29iamVjdC1rZXlzJyk7XG52YXIgZm9yZWFjaCA9IHJlcXVpcmUoJ2ZvcmVhY2gnKTtcbnZhciBoYXNTeW1ib2xzID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgU3ltYm9sKCkgPT09ICdzeW1ib2wnO1xuXG52YXIgdG9TdHIgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG52YXIgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uIChmbikge1xuXHRyZXR1cm4gdHlwZW9mIGZuID09PSAnZnVuY3Rpb24nICYmIHRvU3RyLmNhbGwoZm4pID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufTtcblxudmFyIGFyZVByb3BlcnR5RGVzY3JpcHRvcnNTdXBwb3J0ZWQgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciBvYmogPSB7fTtcblx0dHJ5IHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCAneCcsIHsgdmFsdWU6IG9iaiwgZW51bWVyYWJsZTogZmFsc2UgfSk7XG4gICAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4gICAgICAgIGZvciAodmFyIF8gaW4gb2JqKSB7IHJldHVybiBmYWxzZTsgfVxuICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXG5cdFx0cmV0dXJuIG9iai54ID09PSBvYmo7XG5cdH0gY2F0Y2ggKGUpIHsgLyogdGhpcyBpcyBJRSA4LiAqL1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufTtcbnZhciBzdXBwb3J0c0Rlc2NyaXB0b3JzID0gT2JqZWN0LmRlZmluZVByb3BlcnR5ICYmIGFyZVByb3BlcnR5RGVzY3JpcHRvcnNTdXBwb3J0ZWQoKTtcblxudmFyIGRlZmluZVByb3BlcnR5ID0gZnVuY3Rpb24gKG9iamVjdCwgbmFtZSwgdmFsdWUsIHByZWRpY2F0ZSkge1xuXHRpZiAobmFtZSBpbiBvYmplY3QgJiYgKCFpc0Z1bmN0aW9uKHByZWRpY2F0ZSkgfHwgIXByZWRpY2F0ZSgpKSkge1xuXHRcdHJldHVybjtcblx0fVxuXHRpZiAoc3VwcG9ydHNEZXNjcmlwdG9ycykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIHtcblx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRcdGVudW1lcmFibGU6IGZhbHNlLFxuXHRcdFx0d3JpdGFibGU6IHRydWUsXG5cdFx0XHR2YWx1ZTogdmFsdWVcblx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHRvYmplY3RbbmFtZV0gPSB2YWx1ZTtcblx0fVxufTtcblxudmFyIGRlZmluZVByb3BlcnRpZXMgPSBmdW5jdGlvbiAob2JqZWN0LCBtYXApIHtcblx0dmFyIHByZWRpY2F0ZXMgPSBhcmd1bWVudHMubGVuZ3RoID4gMiA/IGFyZ3VtZW50c1syXSA6IHt9O1xuXHR2YXIgcHJvcHMgPSBrZXlzKG1hcCk7XG5cdGlmIChoYXNTeW1ib2xzKSB7XG5cdFx0cHJvcHMgPSBwcm9wcy5jb25jYXQoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhtYXApKTtcblx0fVxuXHRmb3JlYWNoKHByb3BzLCBmdW5jdGlvbiAobmFtZSkge1xuXHRcdGRlZmluZVByb3BlcnR5KG9iamVjdCwgbmFtZSwgbWFwW25hbWVdLCBwcmVkaWNhdGVzW25hbWVdKTtcblx0fSk7XG59O1xuXG5kZWZpbmVQcm9wZXJ0aWVzLnN1cHBvcnRzRGVzY3JpcHRvcnMgPSAhIXN1cHBvcnRzRGVzY3JpcHRvcnM7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmaW5lUHJvcGVydGllcztcbiIsIlxudmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZvckVhY2ggKG9iaiwgZm4sIGN0eCkge1xuICAgIGlmICh0b1N0cmluZy5jYWxsKGZuKSAhPT0gJ1tvYmplY3QgRnVuY3Rpb25dJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdpdGVyYXRvciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgICB9XG4gICAgdmFyIGwgPSBvYmoubGVuZ3RoO1xuICAgIGlmIChsID09PSArbCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgZm4uY2FsbChjdHgsIG9ialtpXSwgaSwgb2JqKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAodmFyIGsgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwob2JqLCBrKSkge1xuICAgICAgICAgICAgICAgIGZuLmNhbGwoY3R4LCBvYmpba10sIGssIG9iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIG1vZGlmaWVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2VzLXNoaW1zL2VzNS1zaGltXG52YXIgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciB0b1N0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG52YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG52YXIgaXNBcmdzID0gcmVxdWlyZSgnLi9pc0FyZ3VtZW50cycpO1xudmFyIGhhc0RvbnRFbnVtQnVnID0gISh7ICd0b1N0cmluZyc6IG51bGwgfSkucHJvcGVydHlJc0VudW1lcmFibGUoJ3RvU3RyaW5nJyk7XG52YXIgaGFzUHJvdG9FbnVtQnVnID0gZnVuY3Rpb24gKCkge30ucHJvcGVydHlJc0VudW1lcmFibGUoJ3Byb3RvdHlwZScpO1xudmFyIGRvbnRFbnVtcyA9IFtcblx0J3RvU3RyaW5nJyxcblx0J3RvTG9jYWxlU3RyaW5nJyxcblx0J3ZhbHVlT2YnLFxuXHQnaGFzT3duUHJvcGVydHknLFxuXHQnaXNQcm90b3R5cGVPZicsXG5cdCdwcm9wZXJ0eUlzRW51bWVyYWJsZScsXG5cdCdjb25zdHJ1Y3Rvcidcbl07XG52YXIgZXF1YWxzQ29uc3RydWN0b3JQcm90b3R5cGUgPSBmdW5jdGlvbiAobykge1xuXHR2YXIgY3RvciA9IG8uY29uc3RydWN0b3I7XG5cdHJldHVybiBjdG9yICYmIGN0b3IucHJvdG90eXBlID09PSBvO1xufTtcbnZhciBibGFja2xpc3RlZEtleXMgPSB7XG5cdCR3aW5kb3c6IHRydWUsXG5cdCRjb25zb2xlOiB0cnVlLFxuXHQkcGFyZW50OiB0cnVlLFxuXHQkc2VsZjogdHJ1ZSxcblx0JGZyYW1lczogdHJ1ZSxcblx0JHdlYmtpdEluZGV4ZWREQjogdHJ1ZSxcblx0JHdlYmtpdFN0b3JhZ2VJbmZvOiB0cnVlXG59O1xudmFyIGhhc0F1dG9tYXRpb25FcXVhbGl0eUJ1ZyA9IChmdW5jdGlvbiAoKSB7XG5cdC8qIGdsb2JhbCB3aW5kb3cgKi9cblx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7IHJldHVybiBmYWxzZTsgfVxuXHRmb3IgKHZhciBrIGluIHdpbmRvdykge1xuXHRcdGlmICghYmxhY2tsaXN0ZWRLZXlzWyckJyArIGtdICYmIGhhcy5jYWxsKHdpbmRvdywgaykgJiYgd2luZG93W2tdICE9PSBudWxsICYmIHR5cGVvZiB3aW5kb3dba10gPT09ICdvYmplY3QnKSB7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRlcXVhbHNDb25zdHJ1Y3RvclByb3RvdHlwZSh3aW5kb3dba10pO1xuXHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIGZhbHNlO1xufSgpKTtcbnZhciBlcXVhbHNDb25zdHJ1Y3RvclByb3RvdHlwZUlmTm90QnVnZ3kgPSBmdW5jdGlvbiAobykge1xuXHQvKiBnbG9iYWwgd2luZG93ICovXG5cdGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyAmJiAhaGFzQXV0b21hdGlvbkVxdWFsaXR5QnVnKSB7XG5cdFx0cmV0dXJuIGVxdWFsc0NvbnN0cnVjdG9yUHJvdG90eXBlKG8pO1xuXHR9XG5cdHRyeSB7XG5cdFx0cmV0dXJuIGVxdWFsc0NvbnN0cnVjdG9yUHJvdG90eXBlKG8pO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59O1xuXG52YXIga2V5c1NoaW0gPSBmdW5jdGlvbiBrZXlzKG9iamVjdCkge1xuXHR2YXIgaXNPYmplY3QgPSBvYmplY3QgIT09IG51bGwgJiYgdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCc7XG5cdHZhciBpc0Z1bmN0aW9uID0gdG9TdHIuY2FsbChvYmplY3QpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xuXHR2YXIgaXNBcmd1bWVudHMgPSBpc0FyZ3Mob2JqZWN0KTtcblx0dmFyIGlzU3RyaW5nID0gaXNPYmplY3QgJiYgdG9TdHIuY2FsbChvYmplY3QpID09PSAnW29iamVjdCBTdHJpbmddJztcblx0dmFyIHRoZUtleXMgPSBbXTtcblxuXHRpZiAoIWlzT2JqZWN0ICYmICFpc0Z1bmN0aW9uICYmICFpc0FyZ3VtZW50cykge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5rZXlzIGNhbGxlZCBvbiBhIG5vbi1vYmplY3QnKTtcblx0fVxuXG5cdHZhciBza2lwUHJvdG8gPSBoYXNQcm90b0VudW1CdWcgJiYgaXNGdW5jdGlvbjtcblx0aWYgKGlzU3RyaW5nICYmIG9iamVjdC5sZW5ndGggPiAwICYmICFoYXMuY2FsbChvYmplY3QsIDApKSB7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBvYmplY3QubGVuZ3RoOyArK2kpIHtcblx0XHRcdHRoZUtleXMucHVzaChTdHJpbmcoaSkpO1xuXHRcdH1cblx0fVxuXG5cdGlmIChpc0FyZ3VtZW50cyAmJiBvYmplY3QubGVuZ3RoID4gMCkge1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgb2JqZWN0Lmxlbmd0aDsgKytqKSB7XG5cdFx0XHR0aGVLZXlzLnB1c2goU3RyaW5nKGopKTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0Zm9yICh2YXIgbmFtZSBpbiBvYmplY3QpIHtcblx0XHRcdGlmICghKHNraXBQcm90byAmJiBuYW1lID09PSAncHJvdG90eXBlJykgJiYgaGFzLmNhbGwob2JqZWN0LCBuYW1lKSkge1xuXHRcdFx0XHR0aGVLZXlzLnB1c2goU3RyaW5nKG5hbWUpKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRpZiAoaGFzRG9udEVudW1CdWcpIHtcblx0XHR2YXIgc2tpcENvbnN0cnVjdG9yID0gZXF1YWxzQ29uc3RydWN0b3JQcm90b3R5cGVJZk5vdEJ1Z2d5KG9iamVjdCk7XG5cblx0XHRmb3IgKHZhciBrID0gMDsgayA8IGRvbnRFbnVtcy5sZW5ndGg7ICsraykge1xuXHRcdFx0aWYgKCEoc2tpcENvbnN0cnVjdG9yICYmIGRvbnRFbnVtc1trXSA9PT0gJ2NvbnN0cnVjdG9yJykgJiYgaGFzLmNhbGwob2JqZWN0LCBkb250RW51bXNba10pKSB7XG5cdFx0XHRcdHRoZUtleXMucHVzaChkb250RW51bXNba10pO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gdGhlS2V5cztcbn07XG5cbmtleXNTaGltLnNoaW0gPSBmdW5jdGlvbiBzaGltT2JqZWN0S2V5cygpIHtcblx0aWYgKCFPYmplY3Qua2V5cykge1xuXHRcdE9iamVjdC5rZXlzID0ga2V5c1NoaW07XG5cdH0gZWxzZSB7XG5cdFx0dmFyIGtleXNXb3Jrc1dpdGhBcmd1bWVudHMgPSAoZnVuY3Rpb24gKCkge1xuXHRcdFx0Ly8gU2FmYXJpIDUuMCBidWdcblx0XHRcdHJldHVybiAoT2JqZWN0LmtleXMoYXJndW1lbnRzKSB8fCAnJykubGVuZ3RoID09PSAyO1xuXHRcdH0oMSwgMikpO1xuXHRcdGlmICgha2V5c1dvcmtzV2l0aEFyZ3VtZW50cykge1xuXHRcdFx0dmFyIG9yaWdpbmFsS2V5cyA9IE9iamVjdC5rZXlzO1xuXHRcdFx0T2JqZWN0LmtleXMgPSBmdW5jdGlvbiBrZXlzKG9iamVjdCkge1xuXHRcdFx0XHRpZiAoaXNBcmdzKG9iamVjdCkpIHtcblx0XHRcdFx0XHRyZXR1cm4gb3JpZ2luYWxLZXlzKHNsaWNlLmNhbGwob2JqZWN0KSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIG9yaWdpbmFsS2V5cyhvYmplY3QpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gT2JqZWN0LmtleXMgfHwga2V5c1NoaW07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtleXNTaGltO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdG9TdHIgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQXJndW1lbnRzKHZhbHVlKSB7XG5cdHZhciBzdHIgPSB0b1N0ci5jYWxsKHZhbHVlKTtcblx0dmFyIGlzQXJncyA9IHN0ciA9PT0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG5cdGlmICghaXNBcmdzKSB7XG5cdFx0aXNBcmdzID0gc3RyICE9PSAnW29iamVjdCBBcnJheV0nICYmXG5cdFx0XHR2YWx1ZSAhPT0gbnVsbCAmJlxuXHRcdFx0dHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuXHRcdFx0dHlwZW9mIHZhbHVlLmxlbmd0aCA9PT0gJ251bWJlcicgJiZcblx0XHRcdHZhbHVlLmxlbmd0aCA+PSAwICYmXG5cdFx0XHR0b1N0ci5jYWxsKHZhbHVlLmNhbGxlZSkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG5cdH1cblx0cmV0dXJuIGlzQXJncztcbn07XG4iXX0=
