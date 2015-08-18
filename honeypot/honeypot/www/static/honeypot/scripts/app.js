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
  dag: null,
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
    return {
      name: _store.id,
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
  time: 'month', // The current filter time range
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
        this.props.value
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
          if (name.length > 15) props.name = props.name.slice(0, 15) + '...';

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
        React.createElement(FilterOptionRow, { name: 'time', labels: ['Day', 'Week', 'Month'] }),
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZ3JlZ29yeV9mb3N0ZXIvZGF0YS1lbmcvaG9uZXlwb3QvZGV2L3NjcmlwdHMvYWN0aW9ucy9EZXRhaWxWaWV3QWN0aW9ucy5qcyIsIi9Vc2Vycy9ncmVnb3J5X2Zvc3Rlci9kYXRhLWVuZy9ob25leXBvdC9kZXYvc2NyaXB0cy9hY3Rpb25zL0ZpbHRlckFjdGlvbnMuanMiLCIvVXNlcnMvZ3JlZ29yeV9mb3N0ZXIvZGF0YS1lbmcvaG9uZXlwb3QvZGV2L3NjcmlwdHMvYXBwLmpzeCIsIi9Vc2Vycy9ncmVnb3J5X2Zvc3Rlci9kYXRhLWVuZy9ob25leXBvdC9kZXYvc2NyaXB0cy9jb25zdGFudHMvRGV0YWlsVmlld0NvbnN0YW50cy5qcyIsIi9Vc2Vycy9ncmVnb3J5X2Zvc3Rlci9kYXRhLWVuZy9ob25leXBvdC9kZXYvc2NyaXB0cy9jb25zdGFudHMvRmlsdGVyQ29uc3RhbnRzLmpzIiwiL1VzZXJzL2dyZWdvcnlfZm9zdGVyL2RhdGEtZW5nL2hvbmV5cG90L2Rldi9zY3JpcHRzL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlci5qcyIsIi9Vc2Vycy9ncmVnb3J5X2Zvc3Rlci9kYXRhLWVuZy9ob25leXBvdC9kZXYvc2NyaXB0cy9zdG9yZXMvRGV0YWlsVmlld1N0b3JlLmpzIiwiL1VzZXJzL2dyZWdvcnlfZm9zdGVyL2RhdGEtZW5nL2hvbmV5cG90L2Rldi9zY3JpcHRzL3N0b3Jlcy9GaWx0ZXJTdG9yZS5qcyIsIi9Vc2Vycy9ncmVnb3J5X2Zvc3Rlci9kYXRhLWVuZy9ob25leXBvdC9kZXYvc2NyaXB0cy91aS9DaGFydC5qc3giLCIvVXNlcnMvZ3JlZ29yeV9mb3N0ZXIvZGF0YS1lbmcvaG9uZXlwb3QvZGV2L3NjcmlwdHMvdWkvRGV0YWlsVGV4dC5qc3giLCIvVXNlcnMvZ3JlZ29yeV9mb3N0ZXIvZGF0YS1lbmcvaG9uZXlwb3QvZGV2L3NjcmlwdHMvdWkvRGV0YWlsVmlldy5qc3giLCIvVXNlcnMvZ3JlZ29yeV9mb3N0ZXIvZGF0YS1lbmcvaG9uZXlwb3QvZGV2L3NjcmlwdHMvdWkvRmlsdGVyQnV0dG9uLmpzeCIsIi9Vc2Vycy9ncmVnb3J5X2Zvc3Rlci9kYXRhLWVuZy9ob25leXBvdC9kZXYvc2NyaXB0cy91aS9GaWx0ZXJPcHRpb25Sb3cuanN4IiwiL1VzZXJzL2dyZWdvcnlfZm9zdGVyL2RhdGEtZW5nL2hvbmV5cG90L2Rldi9zY3JpcHRzL3VpL0ZpbHRlclJlc3VsdFJvdy5qc3giLCIvVXNlcnMvZ3JlZ29yeV9mb3N0ZXIvZGF0YS1lbmcvaG9uZXlwb3QvZGV2L3NjcmlwdHMvdWkvRmlsdGVyUmVzdWx0c1RhYmxlLmpzeCIsIi9Vc2Vycy9ncmVnb3J5X2Zvc3Rlci9kYXRhLWVuZy9ob25leXBvdC9kZXYvc2NyaXB0cy91aS9NZWFzdXJlUm93LmpzeCIsIi9Vc2Vycy9ncmVnb3J5X2Zvc3Rlci9kYXRhLWVuZy9ob25leXBvdC9kZXYvc2NyaXB0cy91aS9TZWFyY2hCb3guanN4IiwiL1VzZXJzL2dyZWdvcnlfZm9zdGVyL2RhdGEtZW5nL2hvbmV5cG90L2Rldi9zY3JpcHRzL3VpL1NpZGViYXIuanN4IiwiL1VzZXJzL2dyZWdvcnlfZm9zdGVyL2RhdGEtZW5nL2hvbmV5cG90L2Rldi9zY3JpcHRzL3VpL2QzQ2hhcnQuanMiLCJub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9mbHV4L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2ZsdXgvbGliL0Rpc3BhdGNoZXIuanMiLCJub2RlX21vZHVsZXMvZmx1eC9saWIvaW52YXJpYW50LmpzIiwibm9kZV9tb2R1bGVzL2tleW1pcnJvci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsd0JBQXdCOztBQUV4QixZQUFZLENBQUM7O0FBRWIsSUFBSSxhQUFh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SyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFcEYsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsY0FBYyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3BHOztFQUVFLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7SUFDMUMsT0FBTyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDcEMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7SUFDckMsT0FBTyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEMsR0FBRyxDQUFDLENBQUM7QUFDTDs7RUFFRSxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDO0lBQzFDLE9BQU8sT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ3BDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztJQUNqQixPQUFPLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4QyxHQUFHLENBQUMsQ0FBQzs7QUFFTCxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7O0FBRXpFLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7RUFFdkUsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQztJQUM1RSxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQ2pHLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pFLEdBQUcsQ0FBQyxDQUFDOztFQUVILFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMvRixDQUFDLENBQUM7O0FBRUYsT0FBTyxDQUFDLFdBQVcsR0FBRyxVQUFVLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUM7RUFDcEQsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztFQUN6QyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN0QixFQUFFLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDckQsRUFBRSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDNUUsQ0FBQyxDQUFDOztBQUVGLE9BQU8sQ0FBQyxPQUFPLEdBQUcsVUFBVSxJQUFJLEVBQUUsQ0FBQzs7RUFFakMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztJQUMzQyxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUM7R0FDakIsQ0FBQyxDQUFDO0VBQ0gsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztJQUM1QyxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUM7QUFDckIsR0FBRyxDQUFDLENBQUM7O0VBRUgsSUFBSSxPQUFPLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7RUFDcEQsSUFBSSxPQUFPLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7RUFDcEQsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzlDLEVBQUUsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUU5QyxFQUFFLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQyxJ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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIEFwcERpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyL0FwcERpc3BhdGNoZXInKTtcbnZhciBEZXRhaWxWaWV3Q29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL0RldGFpbFZpZXdDb25zdGFudHMnKTtcblxudmFyIERldGFpbFZpZXdBY3Rpb25zID0ge1xuXG4gIHVwZGF0ZU1lYXN1cmU6IGZ1bmN0aW9uIHVwZGF0ZU1lYXN1cmUobWVhc3VyZSkge1xuICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgYWN0aW9uVHlwZTogRGV0YWlsVmlld0NvbnN0YW50cy5VUERBVEVfTUVBU1VSRSxcbiAgICAgIG1lYXN1cmU6IG1lYXN1cmVcbiAgICB9KTtcbiAgfSxcblxuICB1cGRhdGVEYXRhOiBmdW5jdGlvbiB1cGRhdGVEYXRhKCkge1xuICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgYWN0aW9uVHlwZTogRGV0YWlsVmlld0NvbnN0YW50cy5VUERBVEVfREFUQVxuICAgIH0pO1xuICB9LFxuXG4gIHVwZGF0ZURldGFpbFZpZXc6IGZ1bmN0aW9uIHVwZGF0ZURldGFpbFZpZXcoZGFnLCBuYW1lKSB7XG4gICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgICBhY3Rpb25UeXBlOiBEZXRhaWxWaWV3Q29uc3RhbnRzLlVQREFURV9ERVRBSUxfVklFVyxcbiAgICAgIGRhZzogZGFnLFxuICAgICAgbmFtZTogbmFtZVxuICAgIH0pO1xuICB9LFxuXG4gIHVwZGF0ZUZvY3VzRGF0YTogZnVuY3Rpb24gdXBkYXRlRm9jdXNEYXRhKGRhdGUsIHZhbHVlKSB7XG4gICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgICBhY3Rpb25UeXBlOiBEZXRhaWxWaWV3Q29uc3RhbnRzLlVQREFURV9GT0NVU19EQVRBLFxuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZGF0ZTogZGF0ZVxuICAgIH0pO1xuICB9LFxuXG4gIHVwZGF0ZURhZzogZnVuY3Rpb24gdXBkYXRlRGFnKGRhZykge1xuICAgIEFwcERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgYWN0aW9uVHlwZTogRGV0YWlsVmlld0NvbnN0YW50cy5VUERBVEVfREFHLFxuICAgICAgZGFnOiBkYWdcbiAgICB9KTtcbiAgfVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERldGFpbFZpZXdBY3Rpb25zO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5bmNtVm5iM0o1WDJadmMzUmxjaTlrWVhSaExXVnVaeTlvYjI1bGVYQnZkQzlrWlhZdmMyTnlhWEIwY3k5aFkzUnBiMjV6TDBSbGRHRnBiRlpwWlhkQlkzUnBiMjV6TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN096czdRVUZGUVN4SlFVRk5MR0ZCUVdFc1IwRkJSeXhQUVVGUExFTkJRVU1zTmtKQlFUWkNMRU5CUVVNc1EwRkJRenRCUVVNM1JDeEpRVUZOTEcxQ1FVRnRRaXhIUVVGSExFOUJRVThzUTBGQlF5eHJRMEZCYTBNc1EwRkJReXhEUVVGRE96dEJRVVY0UlN4SlFVRk5MR2xDUVVGcFFpeEhRVUZIT3p0QlFVVjRRaXhsUVVGaExFVkJRVVVzZFVKQlFWTXNUMEZCVHl4RlFVRkZPMEZCUXk5Q0xHbENRVUZoTEVOQlFVTXNVVUZCVVN4RFFVRkRPMEZCUTNKQ0xHZENRVUZWTEVWQlFVVXNiVUpCUVcxQ0xFTkJRVU1zWTBGQll6dEJRVU01UXl4aFFVRlBMRVZCUVVVc1QwRkJUenRMUVVOcVFpeERRVUZETEVOQlFVTTdSMEZEU2pzN1FVRkZSQ3haUVVGVkxFVkJRVVVzYzBKQlFWYzdRVUZEY2tJc2FVSkJRV0VzUTBGQlF5eFJRVUZSTEVOQlFVTTdRVUZEY2tJc1owSkJRVlVzUlVGQlJTeHRRa0ZCYlVJc1EwRkJReXhYUVVGWE8wdEJRelZETEVOQlFVTXNRMEZCUXp0SFFVTktPenRCUVVWRUxHdENRVUZuUWl4RlFVRkZMREJDUVVGVExFZEJRVWNzUlVGQlF5eEpRVUZKTEVWQlFVVTdRVUZEYmtNc2FVSkJRV0VzUTBGQlF5eFJRVUZSTEVOQlFVTTdRVUZEY2tJc1owSkJRVlVzUlVGQlJTeHRRa0ZCYlVJc1EwRkJReXhyUWtGQmEwSTdRVUZEYkVRc1UwRkJSeXhGUVVGRkxFZEJRVWM3UVVGRFVpeFZRVUZKTEVWQlFVVXNTVUZCU1R0TFFVTllMRU5CUVVNc1EwRkJRenRIUVVOS096dEJRVVZFTEdsQ1FVRmxMRVZCUVVVc2VVSkJRVk1zU1VGQlNTeEZRVUZETEV0QlFVc3NSVUZCUlR0QlFVTndReXhwUWtGQllTeERRVUZETEZGQlFWRXNRMEZCUXp0QlFVTnlRaXhuUWtGQlZTeEZRVUZGTEcxQ1FVRnRRaXhEUVVGRExHbENRVUZwUWp0QlFVTnFSQ3hYUVVGTExFVkJRVVVzUzBGQlN6dEJRVU5hTEZWQlFVa3NSVUZCUlN4SlFVRkpPMHRCUTFnc1EwRkJReXhEUVVGRE8wZEJRMG83TzBGQlJVUXNWMEZCVXl4RlFVRkZMRzFDUVVGVExFZEJRVWNzUlVGQlJUdEJRVU4yUWl4cFFrRkJZU3hEUVVGRExGRkJRVkVzUTBGQlF6dEJRVU55UWl4blFrRkJWU3hGUVVGRkxHMUNRVUZ0UWl4RFFVRkRMRlZCUVZVN1FVRkRNVU1zVTBGQlJ5eEZRVUZGTEVkQlFVYzdTMEZEVkN4RFFVRkRMRU5CUVVNN1IwRkRTanM3UTBGRlJpeERRVUZET3p0QlFVVkdMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzYVVKQlFXbENMRU5CUVVNaUxDSm1hV3hsSWpvaUwxVnpaWEp6TDJkeVpXZHZjbmxmWm05emRHVnlMMlJoZEdFdFpXNW5MMmh2Ym1WNWNHOTBMMlJsZGk5elkzSnBjSFJ6TDJGamRHbHZibk12UkdWMFlXbHNWbWxsZDBGamRHbHZibk11YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZLbXB6YUdsdWRDQmxjMjVsZUhRNklIUnlkV1VnS2k5Y2JseHVZMjl1YzNRZ1FYQndSR2x6Y0dGMFkyaGxjaUE5SUhKbGNYVnBjbVVvSnk0dUwyUnBjM0JoZEdOb1pYSXZRWEJ3UkdsemNHRjBZMmhsY2ljcE8xeHVZMjl1YzNRZ1JHVjBZV2xzVm1sbGQwTnZibk4wWVc1MGN5QTlJSEpsY1hWcGNtVW9KeTR1TDJOdmJuTjBZVzUwY3k5RVpYUmhhV3hXYVdWM1EyOXVjM1JoYm5Sekp5azdYRzVjYm1OdmJuTjBJRVJsZEdGcGJGWnBaWGRCWTNScGIyNXpJRDBnZTF4dVhHNGdJSFZ3WkdGMFpVMWxZWE4xY21VNklHWjFibU4wYVc5dUtHMWxZWE4xY21VcElIdGNiaUFnSUNCQmNIQkVhWE53WVhSamFHVnlMbVJwYzNCaGRHTm9LSHRjYmlBZ0lDQWdJR0ZqZEdsdmJsUjVjR1U2SUVSbGRHRnBiRlpwWlhkRGIyNXpkR0Z1ZEhNdVZWQkVRVlJGWDAxRlFWTlZVa1VzWEc0Z0lDQWdJQ0J0WldGemRYSmxPaUJ0WldGemRYSmxMRnh1SUNBZ0lIMHBPMXh1SUNCOUxGeHVYRzRnSUhWd1pHRjBaVVJoZEdFNklHWjFibU4wYVc5dUtDa2dlMXh1SUNBZ0lFRndjRVJwYzNCaGRHTm9aWEl1WkdsemNHRjBZMmdvZTF4dUlDQWdJQ0FnWVdOMGFXOXVWSGx3WlRvZ1JHVjBZV2xzVm1sbGQwTnZibk4wWVc1MGN5NVZVRVJCVkVWZlJFRlVRVnh1SUNBZ0lIMHBPMXh1SUNCOUxGeHVYRzRnSUhWd1pHRjBaVVJsZEdGcGJGWnBaWGM2SUdaMWJtTjBhVzl1S0dSaFp5eHVZVzFsS1NCN1hHNGdJQ0FnUVhCd1JHbHpjR0YwWTJobGNpNWthWE53WVhSamFDaDdYRzRnSUNBZ0lDQmhZM1JwYjI1VWVYQmxPaUJFWlhSaGFXeFdhV1YzUTI5dWMzUmhiblJ6TGxWUVJFRlVSVjlFUlZSQlNVeGZWa2xGVnl4Y2JpQWdJQ0FnSUdSaFp6b2daR0ZuTEZ4dUlDQWdJQ0FnYm1GdFpUb2dibUZ0WlZ4dUlDQWdJSDBwTzF4dUlDQjlMRnh1SUNCY2JpQWdkWEJrWVhSbFJtOWpkWE5FWVhSaE9pQm1kVzVqZEdsdmJpaGtZWFJsTEhaaGJIVmxLU0I3WEc0Z0lDQWdRWEJ3UkdsemNHRjBZMmhsY2k1a2FYTndZWFJqYUNoN1hHNGdJQ0FnSUNCaFkzUnBiMjVVZVhCbE9pQkVaWFJoYVd4V2FXVjNRMjl1YzNSaGJuUnpMbFZRUkVGVVJWOUdUME5WVTE5RVFWUkJMRnh1SUNBZ0lDQWdkbUZzZFdVNklIWmhiSFZsTEZ4dUlDQWdJQ0FnWkdGMFpUb2daR0YwWlNCY2JpQWdJQ0I5S1R0Y2JpQWdmU3hjYmx4dUlDQjFjR1JoZEdWRVlXYzZJR1oxYm1OMGFXOXVLR1JoWnlrZ2UxeHVJQ0FnSUVGd2NFUnBjM0JoZEdOb1pYSXVaR2x6Y0dGMFkyZ29lMXh1SUNBZ0lDQWdZV04wYVc5dVZIbHdaVG9nUkdWMFlXbHNWbWxsZDBOdmJuTjBZVzUwY3k1VlVFUkJWRVZmUkVGSExGeHVJQ0FnSUNBZ1pHRm5PaUJrWVdkY2JpQWdJQ0I5S1R0Y2JpQWdmVnh1WEc1OU8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRVJsZEdGcGJGWnBaWGRCWTNScGIyNXpPMXh1SWwxOSIsIi8qanNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBBcHBEaXNwYXRjaGVyID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJyk7XG52YXIgRmlsdGVyQ29uc3RhbnRzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL0ZpbHRlckNvbnN0YW50cycpO1xuXG52YXIgRmlsdGVyQWN0aW9ucyA9IHtcblxuICB1cGRhdGVGaWx0ZXI6IGZ1bmN0aW9uIHVwZGF0ZUZpbHRlcihrZXksIHZhbHVlKSB7XG4gICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgICBhY3Rpb25UeXBlOiBGaWx0ZXJDb25zdGFudHMuVVBEQVRFX0ZJTFRFUixcbiAgICAgIGtleToga2V5LFxuICAgICAgdmFsdWU6IHZhbHVlXG4gICAgfSk7XG4gIH0sXG5cbiAgdXBkYXRlU2VhcmNoOiBmdW5jdGlvbiB1cGRhdGVTZWFyY2goc2VhcmNoRmlsdGVyKSB7XG4gICAgQXBwRGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgICBhY3Rpb25UeXBlOiBGaWx0ZXJDb25zdGFudHMuVVBEQVRFX1NFQVJDSCxcbiAgICAgIHNlYXJjaEZpbHRlcjogc2VhcmNoRmlsdGVyXG4gICAgfSk7XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaWx0ZXJBY3Rpb25zO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5bmNtVm5iM0o1WDJadmMzUmxjaTlrWVhSaExXVnVaeTlvYjI1bGVYQnZkQzlrWlhZdmMyTnlhWEIwY3k5aFkzUnBiMjV6TDBacGJIUmxja0ZqZEdsdmJuTXVhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanM3T3p0QlFVVkJMRWxCUVUwc1lVRkJZU3hIUVVGSExFOUJRVThzUTBGQlF5dzJRa0ZCTmtJc1EwRkJReXhEUVVGRE8wRkJRemRFTEVsQlFVMHNaVUZCWlN4SFFVRkhMRTlCUVU4c1EwRkJReXc0UWtGQk9FSXNRMEZCUXl4RFFVRkRPenRCUVVWb1JTeEpRVUZOTEdGQlFXRXNSMEZCUnpzN1FVRkZjRUlzWTBGQldTeEZRVUZGTEhOQ1FVRlRMRWRCUVVjc1JVRkJReXhMUVVGTExFVkJRVVU3UVVGRGFFTXNhVUpCUVdFc1EwRkJReXhSUVVGUkxFTkJRVU03UVVGRGNrSXNaMEpCUVZVc1JVRkJSU3hsUVVGbExFTkJRVU1zWVVGQllUdEJRVU42UXl4VFFVRkhMRVZCUVVVc1IwRkJSenRCUVVOU0xGZEJRVXNzUlVGQlJTeExRVUZMTzB0QlEySXNRMEZCUXl4RFFVRkRPMGRCUTBvN08wRkJSVVFzWTBGQldTeEZRVUZGTEhOQ1FVRlRMRmxCUVZrc1JVRkJSVHRCUVVOdVF5eHBRa0ZCWVN4RFFVRkRMRkZCUVZFc1EwRkJRenRCUVVOeVFpeG5Ra0ZCVlN4RlFVRkZMR1ZCUVdVc1EwRkJReXhoUVVGaE8wRkJRM3BETEd0Q1FVRlpMRVZCUVVVc1dVRkJXVHRMUVVNelFpeERRVUZETEVOQlFVTTdSMEZEU2pzN1EwRkZSaXhEUVVGRE96dEJRVVZHTEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1lVRkJZU3hEUVVGRElpd2labWxzWlNJNklpOVZjMlZ5Y3k5bmNtVm5iM0o1WDJadmMzUmxjaTlrWVhSaExXVnVaeTlvYjI1bGVYQnZkQzlrWlhZdmMyTnlhWEIwY3k5aFkzUnBiMjV6TDBacGJIUmxja0ZqZEdsdmJuTXVhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdkttcHphR2x1ZENCbGMyNWxlSFE2SUhSeWRXVWdLaTljYmx4dVkyOXVjM1FnUVhCd1JHbHpjR0YwWTJobGNpQTlJSEpsY1hWcGNtVW9KeTR1TDJScGMzQmhkR05vWlhJdlFYQndSR2x6Y0dGMFkyaGxjaWNwTzF4dVkyOXVjM1FnUm1sc2RHVnlRMjl1YzNSaGJuUnpJRDBnY21WeGRXbHlaU2duTGk0dlkyOXVjM1JoYm5SekwwWnBiSFJsY2tOdmJuTjBZVzUwY3ljcE8xeHVYRzVqYjI1emRDQkdhV3gwWlhKQlkzUnBiMjV6SUQwZ2UxeHVYRzRnSUhWd1pHRjBaVVpwYkhSbGNqb2dablZ1WTNScGIyNG9hMlY1TEhaaGJIVmxLU0I3WEc0Z0lDQWdRWEJ3UkdsemNHRjBZMmhsY2k1a2FYTndZWFJqYUNoN1hHNGdJQ0FnSUNCaFkzUnBiMjVVZVhCbE9pQkdhV3gwWlhKRGIyNXpkR0Z1ZEhNdVZWQkVRVlJGWDBaSlRGUkZVaXhjYmlBZ0lDQWdJR3RsZVRvZ2EyVjVMRnh1SUNBZ0lDQWdkbUZzZFdVNklIWmhiSFZsWEc0Z0lDQWdmU2s3WEc0Z0lIMHNYRzVjYmlBZ2RYQmtZWFJsVTJWaGNtTm9PaUJtZFc1amRHbHZiaWh6WldGeVkyaEdhV3gwWlhJcElIdGNiaUFnSUNCQmNIQkVhWE53WVhSamFHVnlMbVJwYzNCaGRHTm9LSHRjYmlBZ0lDQWdJR0ZqZEdsdmJsUjVjR1U2SUVacGJIUmxja052Ym5OMFlXNTBjeTVWVUVSQlZFVmZVMFZCVWtOSUxGeHVJQ0FnSUNBZ2MyVmhjbU5vUm1sc2RHVnlPaUJ6WldGeVkyaEdhV3gwWlhKY2JpQWdJQ0I5S1R0Y2JpQWdmU3hjYmx4dWZUdGNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JHYVd4MFpYSkJZM1JwYjI1ek8xeHVJbDE5IiwiLypqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFNpZGViYXIgPSByZXF1aXJlKCcuL3VpL1NpZGViYXIuanN4Jyk7XG52YXIgRGV0YWlsVmlldyA9IHJlcXVpcmUoJy4vdWkvRGV0YWlsVmlldy5qc3gnKTtcbnZhciBEZXRhaWxUZXh0ID0gcmVxdWlyZSgnLi91aS9EZXRhaWxUZXh0LmpzeCcpO1xuXG5SZWFjdC5yZW5kZXIoUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgJ2RpdicsXG4gIG51bGwsXG4gIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2lkZWJhciwgbnVsbCksXG4gIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgJ2RpdicsXG4gICAgeyBjbGFzc05hbWU6ICdkZXRhaWxDb2x1bW4nIH0sXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChEZXRhaWxUZXh0LCBudWxsKSxcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KERldGFpbFZpZXcsIG51bGwpXG4gIClcbiksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cmFwJykpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5bmNtVm5iM0o1WDJadmMzUmxjaTlrWVhSaExXVnVaeTlvYjI1bGVYQnZkQzlrWlhZdmMyTnlhWEIwY3k5aGNIQXVhbk40SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN1FVRkZRU3hKUVVGTkxFOUJRVThzUjBGQlJ5eFBRVUZQTEVOQlFVTXNhMEpCUVd0Q0xFTkJRVU1zUTBGQlF6dEJRVU0xUXl4SlFVRk5MRlZCUVZVc1IwRkJSeXhQUVVGUExFTkJRVU1zY1VKQlFYRkNMRU5CUVVNc1EwRkJRenRCUVVOc1JDeEpRVUZOTEZWQlFWVXNSMEZCUnl4UFFVRlBMRU5CUVVNc2NVSkJRWEZDTEVOQlFVTXNRMEZCUXpzN1FVRkZiRVFzUzBGQlN5eERRVUZETEUxQlFVMHNRMEZEVmpzN08wVkJRMFVzYjBKQlFVTXNUMEZCVHl4UFFVRkhPMFZCUTFnN08wMUJRVXNzVTBGQlV5eEZRVUZETEdOQlFXTTdTVUZETTBJc2IwSkJRVU1zVlVGQlZTeFBRVUZITzBsQlEyUXNiMEpCUVVNc1ZVRkJWU3hQUVVGSE8wZEJRMVk3UTBGRFJpeEZRVU5PTEZGQlFWRXNRMEZCUXl4alFVRmpMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRMmhETEVOQlFVTWlMQ0ptYVd4bElqb2lMMVZ6WlhKekwyZHlaV2R2Y25sZlptOXpkR1Z5TDJSaGRHRXRaVzVuTDJodmJtVjVjRzkwTDJSbGRpOXpZM0pwY0hSekwyRndjQzVxYzNnaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZLbXB6YUdsdWRDQmxjMjVsZUhRNklIUnlkV1VnS2k5Y2JseHVZMjl1YzNRZ1UybGtaV0poY2lBOUlISmxjWFZwY21Vb0p5NHZkV2t2VTJsa1pXSmhjaTVxYzNnbktUdGNibU52Ym5OMElFUmxkR0ZwYkZacFpYY2dQU0J5WlhGMWFYSmxLQ2N1TDNWcEwwUmxkR0ZwYkZacFpYY3Vhbk40SnlrN1hHNWpiMjV6ZENCRVpYUmhhV3hVWlhoMElEMGdjbVZ4ZFdseVpTZ25MaTkxYVM5RVpYUmhhV3hVWlhoMExtcHplQ2NwTzF4dVhHNVNaV0ZqZEM1eVpXNWtaWElvWEc0Z0lEeGthWFkrWEc0Z0lDQWdQRk5wWkdWaVlYSWdMejVjYmlBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQwblpHVjBZV2xzUTI5c2RXMXVKejVjYmlBZ0lDQWdJRHhFWlhSaGFXeFVaWGgwSUM4K1hHNGdJQ0FnSUNBOFJHVjBZV2xzVm1sbGR5QXZQbHh1SUNBZ0lEd3ZaR2wyUGx4dUlDQThMMlJwZGo0c1hHNGdJR1J2WTNWdFpXNTBMbWRsZEVWc1pXMWxiblJDZVVsa0tDZDNjbUZ3SnlsY2JpazdYRzRpWFgwPSIsIi8qanNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBrZXlNaXJyb3IgPSByZXF1aXJlKCdrZXltaXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBrZXlNaXJyb3Ioe1xuICBVUERBVEVfTUVBU1VSRTogbnVsbCxcbiAgVVBEQVRFX0RBVEE6IG51bGwsXG4gIFVQREFURV9ERVRBSUxfVklFVzogbnVsbCxcbiAgVVBEQVRFX0ZPQ1VTX0RBVEE6IG51bGwsXG4gIFVQREFURV9EQUc6IG51bGxcbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5bmNtVm5iM0o1WDJadmMzUmxjaTlrWVhSaExXVnVaeTlvYjI1bGVYQnZkQzlrWlhZdmMyTnlhWEIwY3k5amIyNXpkR0Z1ZEhNdlJHVjBZV2xzVm1sbGQwTnZibk4wWVc1MGN5NXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenM3TzBGQlJVRXNTVUZCVFN4VFFVRlRMRWRCUVVjc1QwRkJUeXhEUVVGRExGZEJRVmNzUTBGQlF5eERRVUZET3p0QlFVVjJReXhOUVVGTkxFTkJRVU1zVDBGQlR5eEhRVUZITEZOQlFWTXNRMEZCUXp0QlFVTjZRaXhuUWtGQll5eEZRVUZGTEVsQlFVazdRVUZEY0VJc1lVRkJWeXhGUVVGRkxFbEJRVWs3UVVGRGFrSXNiMEpCUVd0Q0xFVkJRVVVzU1VGQlNUdEJRVU40UWl4dFFrRkJhVUlzUlVGQlJTeEpRVUZKTzBGQlEzWkNMRmxCUVZVc1JVRkJSU3hKUVVGSk8wTkJRMnBDTEVOQlFVTXNRMEZCUXlJc0ltWnBiR1VpT2lJdlZYTmxjbk12WjNKbFoyOXllVjltYjNOMFpYSXZaR0YwWVMxbGJtY3ZhRzl1Wlhsd2IzUXZaR1YyTDNOamNtbHdkSE12WTI5dWMzUmhiblJ6TDBSbGRHRnBiRlpwWlhkRGIyNXpkR0Z1ZEhNdWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2S21wemFHbHVkQ0JsYzI1bGVIUTZJSFJ5ZFdVZ0tpOWNibHh1WTI5dWMzUWdhMlY1VFdseWNtOXlJRDBnY21WeGRXbHlaU2duYTJWNWJXbHljbTl5SnlrN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdhMlY1VFdseWNtOXlLSHRjYmlBZ1ZWQkVRVlJGWDAxRlFWTlZVa1U2SUc1MWJHd3NYRzRnSUZWUVJFRlVSVjlFUVZSQk9pQnVkV3hzTEZ4dUlDQlZVRVJCVkVWZlJFVlVRVWxNWDFaSlJWYzZJRzUxYkd3c1hHNGdJRlZRUkVGVVJWOUdUME5WVTE5RVFWUkJPaUJ1ZFd4c0xGeHVJQ0JWVUVSQlZFVmZSRUZIT2lCdWRXeHNMRnh1ZlNrN1hHNGlYWDA9IiwiLypqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGtleU1pcnJvciA9IHJlcXVpcmUoJ2tleW1pcnJvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtleU1pcnJvcih7XG4gIFVQREFURV9GSUxURVI6IG51bGwsXG4gIFVQREFURV9TRUFSQ0g6IG51bGxcbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5bmNtVm5iM0o1WDJadmMzUmxjaTlrWVhSaExXVnVaeTlvYjI1bGVYQnZkQzlrWlhZdmMyTnlhWEIwY3k5amIyNXpkR0Z1ZEhNdlJtbHNkR1Z5UTI5dWMzUmhiblJ6TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN096czdRVUZGUVN4SlFVRk5MRk5CUVZNc1IwRkJSeXhQUVVGUExFTkJRVU1zVjBGQlZ5eERRVUZETEVOQlFVTTdPMEZCUlhaRExFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NVMEZCVXl4RFFVRkRPMEZCUTNwQ0xHVkJRV0VzUlVGQlJTeEpRVUZKTzBGQlEyNUNMR1ZCUVdFc1JVRkJSU3hKUVVGSk8wTkJRM0JDTEVOQlFVTXNRMEZCUXlJc0ltWnBiR1VpT2lJdlZYTmxjbk12WjNKbFoyOXllVjltYjNOMFpYSXZaR0YwWVMxbGJtY3ZhRzl1Wlhsd2IzUXZaR1YyTDNOamNtbHdkSE12WTI5dWMzUmhiblJ6TDBacGJIUmxja052Ym5OMFlXNTBjeTVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHFhbk5vYVc1MElHVnpibVY0ZERvZ2RISjFaU0FxTDF4dVhHNWpiMjV6ZENCclpYbE5hWEp5YjNJZ1BTQnlaWEYxYVhKbEtDZHJaWGx0YVhKeWIzSW5LVHRjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCclpYbE5hWEp5YjNJb2UxeHVJQ0JWVUVSQlZFVmZSa2xNVkVWU09pQnVkV3hzTEZ4dUlDQlZVRVJCVkVWZlUwVkJVa05JT2lCdWRXeHNMRnh1ZlNrN1hHNGlYWDA9IiwiLypqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIERpc3BhdGNoZXIgPSByZXF1aXJlKCdmbHV4JykuRGlzcGF0Y2hlcjtcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgRGlzcGF0Y2hlcigpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5bmNtVm5iM0o1WDJadmMzUmxjaTlrWVhSaExXVnVaeTlvYjI1bGVYQnZkQzlrWlhZdmMyTnlhWEIwY3k5a2FYTndZWFJqYUdWeUwwRndjRVJwYzNCaGRHTm9aWEl1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWpzN096dEJRVVZCTEVsQlFVMHNWVUZCVlN4SFFVRkhMRTlCUVU4c1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF5eFZRVUZWTEVOQlFVTTdPMEZCUlRsRExFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NTVUZCU1N4VlFVRlZMRVZCUVVVc1EwRkJReUlzSW1acGJHVWlPaUl2VlhObGNuTXZaM0psWjI5eWVWOW1iM04wWlhJdlpHRjBZUzFsYm1jdmFHOXVaWGx3YjNRdlpHVjJMM05qY21sd2RITXZaR2x6Y0dGMFkyaGxjaTlCY0hCRWFYTndZWFJqYUdWeUxtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpTHlwcWMyaHBiblFnWlhOdVpYaDBPaUIwY25WbElDb3ZYRzVjYm1OdmJuTjBJRVJwYzNCaGRHTm9aWElnUFNCeVpYRjFhWEpsS0NkbWJIVjRKeWt1UkdsemNHRjBZMmhsY2p0Y2JseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQnVaWGNnUkdsemNHRjBZMmhsY2lncE8xeHVJbDE5IiwiLy8gRGV0YWlsVmlld1N0b3JlLmpzXG4vLyBUaGUgZmx1eCBkYXRhc3RvcmUgZm9yIHRoZSBlbnRpcmUgZGV0YWlsIHZpZXdcbi8qanNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBBcHBEaXNwYXRjaGVyID0gcmVxdWlyZSgnLi4vZGlzcGF0Y2hlci9BcHBEaXNwYXRjaGVyJyk7XG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xudmFyIERldGFpbFZpZXdDb25zdGFudHMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvRGV0YWlsVmlld0NvbnN0YW50cycpO1xudmFyIGFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcblxudmFyIE1FQVNVUkVfQ0hBTkdFX0VWRU5UID0gJ21lYXN1cmVfY2hhbmdlJztcbnZhciBEQVRBX1VQREFURV9FVkVOVCA9ICdkYXRhX3VwZGF0ZSc7XG52YXIgREVUQUlMU19VUERBVEVfRVZFTlQgPSAnZGV0YWlsc191cGRhdGUnO1xudmFyIEZPQ1VTX1VQREFURV9FVkVOVCA9ICdmb2N1c191cGRhdGUnO1xuXG52YXIgX3N0b3JlID0ge1xuICBtZWFzdXJlOiAnaW8nLCAvLyBUaGUgY3VycmVudGx5IHNlbGVjdGVkIG1lYXN1cmUgZm9yIHRoZSBncmFwaFxuICBkYWc6IG51bGwsXG4gIG5hbWU6ICdTZWxlY3QgYSBEQUcgb3IgVGFzaycsIC8vIFRoZSBpZCAobmFtZSkgb2YgdGhlIHRoaW5nIGJlaW5nIHZpZXdlZFxuICBvd25lcjogJ293bmVyJywgLy8gdGhlIG93bmVyIG9mIHRoZSB0aGluZyBiZWluZyB2aWV3ZWRcbiAgZm9jdXNWYWx1ZTogMCwgLy8gVGhlIHZhbHVlIG9mIHdoYXRldmVyIGlzIGJlaW5nIG1vdXNlZCBvdmVyIG9uIHRoZSBncmFwaFxuICBmb2N1c0RhdGU6IDAsIC8vIFRoZSBkYXRlIG9mIHRoZSBwb2ludCBjdXJyZW50bHkgbW91c2VkIG92ZXIgb24gdGhlIGdyYXBoXG4gIGRhdGE6IFtdIH07XG5cbi8vIEZpcmVzIG9mIGFuIEFqYXggZ2V0IHJlcXVlc3QgdG8gdGhlIHNlcnZlciB0byBnZXQgdmFsdWVzIGFuZCBkYXRlcyBmb3IgZ3JhcGhcbi8vIFRoZSByb3dzIHJldHJpZXZlZCBmcm9tIHRoZSBzZXJ2ZXIgd2l0aCB2YWx1ZXMgYW5kIGRhdGVzXG5mdW5jdGlvbiB1cGRhdGVEYXRhKCkge1xuICAkLmdldEpTT04od2luZG93LmxvY2F0aW9uICsgJ2RhdGEnLCB7XG4gICAgbWVhc3VyZTogX3N0b3JlLm1lYXN1cmUsXG4gICAgZGFnOiBfc3RvcmUuZGFnLFxuICAgIGlkOiBfc3RvcmUuaWRcbiAgfSwgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgYXJyYXkgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gZGF0YSkge1xuICAgICAgYXJyYXkucHVzaCh7IHZhbHVlOiBkYXRhW2tleV0udmFsdWUsIGRhdGU6IG5ldyBEYXRlKGRhdGFba2V5XS5kcykgfSk7XG4gICAgfVxuICAgIF9zdG9yZS5kYXRhID0gYXJyYXk7XG4gICAgX3N0b3JlLnVwZGF0aW5nID0gZmFsc2U7XG4gICAgRGV0YWlsVmlld1N0b3JlLmVtaXQoREFUQV9VUERBVEVfRVZFTlQpO1xuICB9KTtcbn1cblxuLy8gRmlyZXMgb2YgYW4gQWpheCBnZXQgcmVxdWVzdCB0byB0aGUgc2VydmVyIHRvIGdldCBtZXRhZGF0YSBvbiBjdXJyZW50IHRoaW5nXG5mdW5jdGlvbiB1cGRhdGVEZXRhaWxzKCkge1xuICAkLmdldEpTT04od2luZG93LmxvY2F0aW9uICsgJ2RldGFpbHMnLCB7XG4gICAgZGFnOiBfc3RvcmUuZGFnLFxuICAgIGlkOiBfc3RvcmUuaWRcbiAgfSwgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBpZiAoZGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICBfc3RvcmUub3duZXIgPSBkYXRhWzBdLm93bmVyO1xuICAgIH1cbiAgICBEZXRhaWxWaWV3U3RvcmUuZW1pdChERVRBSUxTX1VQREFURV9FVkVOVCk7XG4gIH0pO1xufVxuXG52YXIgRGV0YWlsVmlld1N0b3JlID0gYXNzaWduKHt9LCBFdmVudEVtaXR0ZXIucHJvdG90eXBlLCB7XG5cbiAgLy8gTGlzdGVuZXIgZm9yIHdoZW4gbW91c2UgbW92ZXNcbiAgYWRkRm9jdXNVcGRhdGVMaXN0ZW5lcjogZnVuY3Rpb24gYWRkRm9jdXNVcGRhdGVMaXN0ZW5lcihjYikge1xuICAgIHRoaXMub24oRk9DVVNfVVBEQVRFX0VWRU5ULCBjYik7XG4gIH0sXG5cbiAgcmVtb3ZlRm9jdXNVcGRhdGVMaXN0ZW5lcjogZnVuY3Rpb24gcmVtb3ZlRm9jdXNVcGRhdGVMaXN0ZW5lcihjYikge1xuICAgIHRoaXMub24oRk9DVVNfVVBEQVRFX0VWRU5ULCBjYik7XG4gIH0sXG5cbiAgLy8gTGlzdGVuZXIgZm9yIHdoZW4gdGhpbmcgbWV0YWRhdGEgY2hhbmdlc1xuICBhZGREZXRhaWxVcGRhdGVMaXN0ZW5lcjogZnVuY3Rpb24gYWRkRGV0YWlsVXBkYXRlTGlzdGVuZXIoY2IpIHtcbiAgICB0aGlzLm9uKERFVEFJTFNfVVBEQVRFX0VWRU5ULCBjYik7XG4gIH0sXG5cbiAgcmVtb3ZlRGV0YWlsVXBkYXRlTGlzdGVuZXI6IGZ1bmN0aW9uIHJlbW92ZURldGFpbFVwZGF0ZUxpc3RlbmVyKGNiKSB7XG4gICAgdGhpcy5vbihERVRBSUxTX1VQREFURV9FVkVOVCwgY2IpO1xuICB9LFxuXG4gIC8vIExpc3RlbmVyIGZvciB3aGVuIGRhdGEgdmFsdWVzIGFuZCBkYXRlcyBjaGFuZ2VcbiAgYWRkRGF0YVVwZGF0ZUxpc3RlbmVyOiBmdW5jdGlvbiBhZGREYXRhVXBkYXRlTGlzdGVuZXIoY2IpIHtcbiAgICB0aGlzLm9uKERBVEFfVVBEQVRFX0VWRU5ULCBjYik7XG4gIH0sXG5cbiAgcmVtb3ZlRGF0YVVwZGF0ZUxpc3RlbmVyOiBmdW5jdGlvbiByZW1vdmVEYXRhVXBkYXRlTGlzdGVuZXIoY2IpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKERBVEFfVVBEQVRFX0VWRU5ULCBjYik7XG4gIH0sXG5cbiAgLy8gTGlzdGVuZXIgZm9yIHdoZW4gdXNlciBzZWxlY3RzIGEgZGlmZmVyZW50IG1lYXN1cmVcbiAgYWRkTWVhc3VyZUNoYW5nZUxpc3RlbmVyOiBmdW5jdGlvbiBhZGRNZWFzdXJlQ2hhbmdlTGlzdGVuZXIoY2IpIHtcbiAgICB0aGlzLm9uKE1FQVNVUkVfQ0hBTkdFX0VWRU5ULCBjYik7XG4gIH0sXG5cbiAgcmVtb3ZlTWVhc3VyZUNoYW5nZUxpc3RlbmVyOiBmdW5jdGlvbiByZW1vdmVNZWFzdXJlQ2hhbmdlTGlzdGVuZXIoY2IpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKE1FQVNVUkVfQ0hBTkdFX0VWRU5ULCBjYik7XG4gIH0sXG5cbiAgLy8gR2V0dGVyIG1ldGhvZCBmb3IgZGF0YSB0aGF0IGNyZWF0ZXMgZmV0Y2ggaWYgbmVlZCBiZVxuICBnZXREYXRhOiBmdW5jdGlvbiBnZXREYXRhKCkge1xuICAgIHJldHVybiBfc3RvcmUuZGF0YTtcbiAgfSxcblxuICAvLyBHZXR0ZXIgbWV0aG9kIGZvciBkZXRhaWxzIHRoYXQgY3JlYXRlcyBmZXRjaCBpZiBuZWVkIGJlXG4gIGdldERldGFpbHM6IGZ1bmN0aW9uIGdldERldGFpbHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IF9zdG9yZS5pZCxcbiAgICAgIG93bmVyOiBfc3RvcmUub3duZXJcbiAgICB9O1xuICB9LFxuXG4gIC8vIEdldHRlciBtZXRob2QgdG8gZ2V0IGN1cnJlbnQgbW91c2VvdmVyIHZhbHVlc1xuICBnZXRGb2N1c0RhdGU6IGZ1bmN0aW9uIGdldEZvY3VzRGF0ZSgpIHtcbiAgICByZXR1cm4gX3N0b3JlLmZvY3VzRGF0ZTtcbiAgfSxcblxuICBnZXRGb2N1c1ZhbHVlOiBmdW5jdGlvbiBnZXRGb2N1c1ZhbHVlKCkge1xuICAgIHJldHVybiBfc3RvcmUuZm9jdXNWYWx1ZTtcbiAgfSxcblxuICAvLyBHZXR0ZXIgbWV0aG9kIHRvIGdldCBjdXJyZW50bHkgc2VsZWN0ZWQgbWVhc3VyZVxuICBnZXRNZWFzdXJlOiBmdW5jdGlvbiBnZXRNZWFzdXJlKCkge1xuICAgIHJldHVybiBfc3RvcmUubWVhc3VyZTtcbiAgfSxcblxuICAvLyBHZXR0ZXIgbWV0aG9kIGZvciB0aGUgZW50aXJlIHN0b3JlXG4gIGdldFN0b3JlOiBmdW5jdGlvbiBnZXRTdG9yZSgpIHtcbiAgICByZXR1cm4gX3N0b3JlO1xuICB9LFxuXG4gIC8vIFNldHMgdGhlIGRhZyBvZiB0aGUgc3RvcmVcbiAgc2V0RGFnOiBmdW5jdGlvbiBzZXREYWcoZGFnKSB7XG4gICAgX3N0b3JlLmRhZyA9IGRhZztcbiAgfVxufSk7XG5cbi8vIFJlZ2lzdGVyIGNhbGxiYWNrIHRvIGhhbmRsZSBhbGwgdXBkYXRlc1xuQXBwRGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbiAoYWN0aW9uKSB7XG4gIHN3aXRjaCAoYWN0aW9uLmFjdGlvblR5cGUpIHtcbiAgICAvLyBUaGUgbWVhc3VyZSBjaGFuZ2VkIGFuZCB3ZSBuZWVkIHRvIGZldGNoIG5ldyBkYXRhXG4gICAgY2FzZSBEZXRhaWxWaWV3Q29uc3RhbnRzLlVQREFURV9NRUFTVVJFOlxuICAgICAgX3N0b3JlLm1lYXN1cmUgPSBhY3Rpb24ubWVhc3VyZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJy8nLCAnJyk7XG4gICAgICBEZXRhaWxWaWV3U3RvcmUuZW1pdChNRUFTVVJFX0NIQU5HRV9FVkVOVCk7XG4gICAgICB1cGRhdGVEYXRhKCk7XG4gICAgICBicmVhaztcbiAgICAvLyBXZSBuZWVkIHRvIGZldGNoIG5ldyBkYXRhXG4gICAgY2FzZSBEZXRhaWxWaWV3Q29uc3RhbnRzLlVQREFURV9EQVRBOlxuICAgICAgdXBkYXRlRGF0YSgpO1xuICAgICAgYnJlYWs7XG4gICAgLy8gV2UgbmVlZCB0byBmZXRjaCBuZXcgZGV0YWlscyBvbiB0aGUgY3VycmVudCBkYWcvdGFza1xuICAgIGNhc2UgRGV0YWlsVmlld0NvbnN0YW50cy5VUERBVEVfREVUQUlMX1ZJRVc6XG4gICAgICBfc3RvcmUuaWQgPSBhY3Rpb24ubmFtZTtcbiAgICAgIHVwZGF0ZURhdGEoKTtcbiAgICAgIHVwZGF0ZURldGFpbHMoKTtcbiAgICAgIGJyZWFrO1xuICAgIC8vIFdlIG5lZWQgdG8gdXBkYXRlIG91ciByZWNvcmQgb2Ygb3VyIGN1cnJlbnQgbW91c2VvdmVyIHBvaW50XG4gICAgY2FzZSBEZXRhaWxWaWV3Q29uc3RhbnRzLlVQREFURV9GT0NVU19EQVRBOlxuICAgICAgX3N0b3JlLmZvY3VzVmFsdWUgPSBhY3Rpb24udmFsdWU7XG4gICAgICBfc3RvcmUuZm9jdXNEYXRlID0gYWN0aW9uLmRhdGU7XG4gICAgICBEZXRhaWxWaWV3U3RvcmUuZW1pdChGT0NVU19VUERBVEVfRVZFTlQpO1xuICAgICAgYnJlYWs7XG4gICAgLy8gV2UgbmVlZCB0byB1cGRhdGUgb3VyIHJlY29yZCBvZiBvdXIgY3VycmVudCBtb3VzZW92ZXIgcG9pbnRcbiAgICBjYXNlIERldGFpbFZpZXdDb25zdGFudHMuVVBEQVRFX0RBRzpcbiAgICAgIF9zdG9yZS5kYWcgPSBhY3Rpb24uZGFnO1xuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OlxuICAgIC8vIG5vIG9wXG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERldGFpbFZpZXdTdG9yZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OW5jbVZuYjNKNVgyWnZjM1JsY2k5a1lYUmhMV1Z1Wnk5b2IyNWxlWEJ2ZEM5a1pYWXZjMk55YVhCMGN5OXpkRzl5WlhNdlJHVjBZV2xzVm1sbGQxTjBiM0psTG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN096czdPenRCUVVsQkxFbEJRVTBzWVVGQllTeEhRVUZITEU5QlFVOHNRMEZCUXl3MlFrRkJOa0lzUTBGQlF5eERRVUZETzBGQlF6ZEVMRWxCUVUwc1dVRkJXU3hIUVVGSExFOUJRVThzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXl4WlFVRlpMRU5CUVVNN1FVRkRjRVFzU1VGQlRTeHRRa0ZCYlVJc1IwRkJSeXhQUVVGUExFTkJRVU1zYTBOQlFXdERMRU5CUVVNc1EwRkJRenRCUVVONFJTeEpRVUZOTEUxQlFVMHNSMEZCUnl4UFFVRlBMRU5CUVVNc1pVRkJaU3hEUVVGRExFTkJRVU03TzBGQlJYaERMRWxCUVUwc2IwSkJRVzlDTEVkQlFVY3NaMEpCUVdkQ0xFTkJRVU03UVVGRE9VTXNTVUZCVFN4cFFrRkJhVUlzUjBGQlJ5eGhRVUZoTEVOQlFVTTdRVUZEZUVNc1NVRkJUU3h2UWtGQmIwSXNSMEZCUnl4blFrRkJaMElzUTBGQlF6dEJRVU01UXl4SlFVRk5MR3RDUVVGclFpeEhRVUZITEdOQlFXTXNRMEZCUXpzN1FVRkZNVU1zU1VGQlRTeE5RVUZOTEVkQlFVYzdRVUZEWWl4VFFVRlBMRVZCUVVVc1NVRkJTVHRCUVVOaUxFdEJRVWNzUlVGQlJTeEpRVUZKTzBGQlExUXNUVUZCU1N4RlFVRkZMSE5DUVVGelFqdEJRVU0xUWl4UFFVRkxMRVZCUVVVc1QwRkJUenRCUVVOa0xGbEJRVlVzUlVGQlJTeERRVUZETzBGQlEySXNWMEZCVXl4RlFVRkZMRU5CUVVNN1FVRkRXaXhOUVVGSkxFVkJRVVVzUlVGQlJTeEZRVU5VTEVOQlFVTTdPenM3UVVGSFJpeFRRVUZUTEZWQlFWVXNSMEZCUnp0QlFVTndRaXhIUVVGRExFTkJRVU1zVDBGQlR5eERRVU5RTEUxQlFVMHNRMEZCUXl4UlFVRlJMRWRCUVVjc1RVRkJUU3hGUVVONFFqdEJRVU5GTEZkQlFVOHNSVUZCUXl4TlFVRk5MRU5CUVVNc1QwRkJUenRCUVVOMFFpeFBRVUZITEVWQlFVVXNUVUZCVFN4RFFVRkRMRWRCUVVjN1FVRkRaaXhOUVVGRkxFVkJRVVVzVFVGQlRTeERRVUZETEVWQlFVVTdSMEZEWkN4RlFVTkVMRlZCUVZNc1NVRkJTU3hGUVVGRk8wRkJRMklzVVVGQlRTeExRVUZMTEVkQlFVY3NSVUZCUlN4RFFVRkRPMEZCUTJwQ0xGTkJRVXNzU1VGQlRTeEhRVUZITEVsQlFVa3NTVUZCU1N4RlFVRkZPMEZCUTNSQ0xGZEJRVXNzUTBGQlF5eEpRVUZKTEVOQlFVTXNSVUZCUXl4TFFVRkxMRVZCUVVNc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEV0QlFVc3NSVUZCUlN4SlFVRkpMRVZCUVVVc1NVRkJTU3hKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRMRVZCUVVVc1EwRkJReXhCUVVGRExFVkJRVU1zUTBGQlF5eERRVUZETzB0QlEzQkZPMEZCUTBRc1ZVRkJUU3hEUVVGRExFbEJRVWtzUjBGQlJ5eExRVUZMTEVOQlFVTTdRVUZEY0VJc1ZVRkJUU3hEUVVGRExGRkJRVkVzUjBGQlJ5eExRVUZMTEVOQlFVTTdRVUZEZUVJc2JVSkJRV1VzUTBGQlF5eEpRVUZKTEVOQlFVTXNhVUpCUVdsQ0xFTkJRVU1zUTBGQlF6dEhRVU42UXl4RFFVRkRMRU5CUVVNN1EwRkRUanM3TzBGQlIwUXNVMEZCVXl4aFFVRmhMRWRCUVVjN1FVRkRka0lzUjBGQlF5eERRVUZETEU5QlFVOHNRMEZEVUN4TlFVRk5MRU5CUVVNc1VVRkJVU3hIUVVGSExGTkJRVk1zUlVGRE0wSTdRVUZEUlN4UFFVRkhMRVZCUVVVc1RVRkJUU3hEUVVGRExFZEJRVWM3UVVGRFppeE5RVUZGTEVWQlFVVXNUVUZCVFN4RFFVRkRMRVZCUVVVN1IwRkRaQ3hGUVVORUxGVkJRVk1zU1VGQlNTeEZRVUZGTzBGQlEySXNVVUZCU1N4SlFVRkpMRU5CUVVNc1RVRkJUU3hIUVVGSExFTkJRVU1zUlVGQlJUdEJRVU51UWl4WlFVRk5MRU5CUVVNc1MwRkJTeXhIUVVGSExFbEJRVWtzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4TFFVRkxMRU5CUVVNN1MwRkRPVUk3UVVGRFJDeHRRa0ZCWlN4RFFVRkRMRWxCUVVrc1EwRkJReXh2UWtGQmIwSXNRMEZCUXl4RFFVRkRPMGRCUXpWRExFTkJRVU1zUTBGQlF6dERRVU5PT3p0QlFVVkVMRWxCUVUwc1pVRkJaU3hIUVVGSExFMUJRVTBzUTBGQlF5eEZRVUZGTEVWQlFVVXNXVUZCV1N4RFFVRkRMRk5CUVZNc1JVRkJSVHM3TzBGQlIzcEVMSGRDUVVGelFpeEZRVUZGTEdkRFFVRlRMRVZCUVVVc1JVRkJRenRCUVVOc1F5eFJRVUZKTEVOQlFVTXNSVUZCUlN4RFFVRkRMR3RDUVVGclFpeEZRVUZGTEVWQlFVVXNRMEZCUXl4RFFVRkRPMGRCUTJwRE96dEJRVVZFTERKQ1FVRjVRaXhGUVVGRkxHMURRVUZUTEVWQlFVVXNSVUZCUXp0QlFVTnlReXhSUVVGSkxFTkJRVU1zUlVGQlJTeERRVUZETEd0Q1FVRnJRaXhGUVVGRkxFVkJRVVVzUTBGQlF5eERRVUZETzBkQlEycERPenM3UVVGSFJDeDVRa0ZCZFVJc1JVRkJSU3hwUTBGQlV5eEZRVUZGTEVWQlFVTTdRVUZEYmtNc1VVRkJTU3hEUVVGRExFVkJRVVVzUTBGQlF5eHZRa0ZCYjBJc1JVRkJSU3hGUVVGRkxFTkJRVU1zUTBGQlF6dEhRVU51UXpzN1FVRkZSQ3cwUWtGQk1FSXNSVUZCUlN4dlEwRkJVeXhGUVVGRkxFVkJRVU03UVVGRGRFTXNVVUZCU1N4RFFVRkRMRVZCUVVVc1EwRkJReXh2UWtGQmIwSXNSVUZCUlN4RlFVRkZMRU5CUVVNc1EwRkJRenRIUVVOdVF6czdPMEZCUjBRc2RVSkJRWEZDTEVWQlFVVXNLMEpCUVZNc1JVRkJSU3hGUVVGRE8wRkJRMnBETEZGQlFVa3NRMEZCUXl4RlFVRkZMRU5CUVVNc2FVSkJRV2xDTEVWQlFVVXNSVUZCUlN4RFFVRkRMRU5CUVVNN1IwRkRhRU03TzBGQlJVUXNNRUpCUVhkQ0xFVkJRVVVzYTBOQlFWTXNSVUZCUlN4RlFVRkRPMEZCUTNCRExGRkJRVWtzUTBGQlF5eGpRVUZqTEVOQlFVTXNhVUpCUVdsQ0xFVkJRVVVzUlVGQlJTeERRVUZETEVOQlFVTTdSMEZETlVNN096dEJRVWRFTERCQ1FVRjNRaXhGUVVGRkxHdERRVUZUTEVWQlFVVXNSVUZCUXp0QlFVTndReXhSUVVGSkxFTkJRVU1zUlVGQlJTeERRVUZETEc5Q1FVRnZRaXhGUVVGRkxFVkJRVVVzUTBGQlF5eERRVUZETzBkQlEyNURPenRCUVVWRUxEWkNRVUV5UWl4RlFVRkZMSEZEUVVGVExFVkJRVVVzUlVGQlF6dEJRVU4yUXl4UlFVRkpMRU5CUVVNc1kwRkJZeXhEUVVGRExHOUNRVUZ2UWl4RlFVRkZMRVZCUVVVc1EwRkJReXhEUVVGRE8wZEJReTlET3pzN1FVRkhSQ3hUUVVGUExFVkJRVVVzYlVKQlFWVTdRVUZEYWtJc1YwRkJUeXhOUVVGTkxFTkJRVU1zU1VGQlNTeERRVUZETzBkQlEzQkNPenM3UVVGSFJDeFpRVUZWTEVWQlFVVXNjMEpCUVZVN1FVRkRjRUlzVjBGQlR6dEJRVU5NTEZWQlFVa3NSVUZCUlN4TlFVRk5MRU5CUVVNc1JVRkJSVHRCUVVObUxGZEJRVXNzUlVGQlJTeE5RVUZOTEVOQlFVTXNTMEZCU3p0TFFVTndRaXhEUVVGRE8wZEJRMGc3T3p0QlFVZEVMR05CUVZrc1JVRkJSU3gzUWtGQlZUdEJRVU4wUWl4WFFVRlBMRTFCUVUwc1EwRkJReXhUUVVGVExFTkJRVU03UjBGRGVrSTdPMEZCUlVRc1pVRkJZU3hGUVVGRkxIbENRVUZWTzBGQlEzWkNMRmRCUVU4c1RVRkJUU3hEUVVGRExGVkJRVlVzUTBGQlF6dEhRVU14UWpzN08wRkJSMFFzV1VGQlZTeEZRVUZGTEhOQ1FVRlZPMEZCUTNCQ0xGZEJRVThzVFVGQlRTeERRVUZETEU5QlFVOHNRMEZCUXp0SFFVTjJRanM3TzBGQlIwUXNWVUZCVVN4RlFVRkZMRzlDUVVGVk8wRkJRMnhDTEZkQlFVOHNUVUZCVFN4RFFVRkRPMGRCUTJZN096dEJRVWRFTEZGQlFVMHNSVUZCUlN4blFrRkJVeXhIUVVGSExFVkJRVU03UVVGRGJrSXNWVUZCVFN4RFFVRkRMRWRCUVVjc1IwRkJSeXhIUVVGSExFTkJRVU03UjBGRGJFSTdRMEZEUml4RFFVRkRMRU5CUVVNN096dEJRVWxJTEdGQlFXRXNRMEZCUXl4UlFVRlJMRU5CUVVNc1ZVRkJVeXhOUVVGTkxFVkJRVVU3UVVGRGRFTXNWVUZCVHl4TlFVRk5MRU5CUVVNc1ZVRkJWVHM3UVVGRmRFSXNVMEZCU3l4dFFrRkJiVUlzUTBGQlF5eGpRVUZqTzBGQlEzSkRMRmxCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzVFVGQlRTeERRVUZETEU5QlFVOHNRMEZCUXl4WFFVRlhMRVZCUVVVc1EwRkJReXhQUVVGUExFTkJRVU1zUjBGQlJ5eEZRVUZETEVWQlFVVXNRMEZCUXl4RFFVRkRPMEZCUXpsRUxIRkNRVUZsTEVOQlFVTXNTVUZCU1N4RFFVRkRMRzlDUVVGdlFpeERRVUZETEVOQlFVTTdRVUZETTBNc1owSkJRVlVzUlVGQlJTeERRVUZETzBGQlEySXNXVUZCVFR0QlFVRkJPMEZCUlZJc1UwRkJTeXh0UWtGQmJVSXNRMEZCUXl4WFFVRlhPMEZCUTJ4RExHZENRVUZWTEVWQlFVVXNRMEZCUXp0QlFVTmlMRmxCUVUwN1FVRkJRVHRCUVVWU0xGTkJRVXNzYlVKQlFXMUNMRU5CUVVNc2EwSkJRV3RDTzBGQlEzcERMRmxCUVUwc1EwRkJReXhGUVVGRkxFZEJRVWNzVFVGQlRTeERRVUZETEVsQlFVa3NRMEZCUXp0QlFVTjRRaXhuUWtGQlZTeEZRVUZGTEVOQlFVTTdRVUZEWWl4dFFrRkJZU3hGUVVGRkxFTkJRVU03UVVGRGFFSXNXVUZCVFR0QlFVRkJPMEZCUlZJc1UwRkJTeXh0UWtGQmJVSXNRMEZCUXl4cFFrRkJhVUk3UVVGRGVFTXNXVUZCVFN4RFFVRkRMRlZCUVZVc1IwRkJSeXhOUVVGTkxFTkJRVU1zUzBGQlN5eERRVUZETzBGQlEycERMRmxCUVUwc1EwRkJReXhUUVVGVExFZEJRVWNzVFVGQlRTeERRVUZETEVsQlFVa3NRMEZCUXp0QlFVTXZRaXh4UWtGQlpTeERRVUZETEVsQlFVa3NRMEZCUXl4clFrRkJhMElzUTBGQlF5eERRVUZETzBGQlEzcERMRmxCUVUwN1FVRkJRVHRCUVVWU0xGTkJRVXNzYlVKQlFXMUNMRU5CUVVNc1ZVRkJWVHRCUVVOcVF5eFpRVUZOTEVOQlFVTXNSMEZCUnl4SFFVRkhMRTFCUVUwc1EwRkJReXhIUVVGSExFTkJRVU03UVVGRGVFSXNXVUZCVFRzN1FVRkJRU3hCUVVkU0xGbEJRVkU3TzBkQlJWUTdRMEZEUml4RFFVRkRMRU5CUVVNN08wRkJSVWdzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4bFFVRmxMRU5CUVVNaUxDSm1hV3hsSWpvaUwxVnpaWEp6TDJkeVpXZHZjbmxmWm05emRHVnlMMlJoZEdFdFpXNW5MMmh2Ym1WNWNHOTBMMlJsZGk5elkzSnBjSFJ6TDNOMGIzSmxjeTlFWlhSaGFXeFdhV1YzVTNSdmNtVXVhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdkx5QkVaWFJoYVd4V2FXVjNVM1J2Y21VdWFuTmNiaTh2SUZSb1pTQm1iSFY0SUdSaGRHRnpkRzl5WlNCbWIzSWdkR2hsSUdWdWRHbHlaU0JrWlhSaGFXd2dkbWxsZDF4dUx5cHFjMmhwYm5RZ1pYTnVaWGgwT2lCMGNuVmxJQ292WEc1Y2JtTnZibk4wSUVGd2NFUnBjM0JoZEdOb1pYSWdQU0J5WlhGMWFYSmxLQ2N1TGk5a2FYTndZWFJqYUdWeUwwRndjRVJwYzNCaGRHTm9aWEluS1R0Y2JtTnZibk4wSUVWMlpXNTBSVzFwZEhSbGNpQTlJSEpsY1hWcGNtVW9KMlYyWlc1MGN5Y3BMa1YyWlc1MFJXMXBkSFJsY2p0Y2JtTnZibk4wSUVSbGRHRnBiRlpwWlhkRGIyNXpkR0Z1ZEhNZ1BTQnlaWEYxYVhKbEtDY3VMaTlqYjI1emRHRnVkSE12UkdWMFlXbHNWbWxsZDBOdmJuTjBZVzUwY3ljcE8xeHVZMjl1YzNRZ1lYTnphV2R1SUQwZ2NtVnhkV2x5WlNnbmIySnFaV04wTFdGemMybG5iaWNwTzF4dVhHNWpiMjV6ZENCTlJVRlRWVkpGWDBOSVFVNUhSVjlGVmtWT1ZDQTlJQ2R0WldGemRYSmxYMk5vWVc1blpTYzdYRzVqYjI1emRDQkVRVlJCWDFWUVJFRlVSVjlGVmtWT1ZDQTlJQ2RrWVhSaFgzVndaR0YwWlNjN1hHNWpiMjV6ZENCRVJWUkJTVXhUWDFWUVJFRlVSVjlGVmtWT1ZDQTlJQ2RrWlhSaGFXeHpYM1Z3WkdGMFpTYzdYRzVqYjI1emRDQkdUME5WVTE5VlVFUkJWRVZmUlZaRlRsUWdQU0FuWm05amRYTmZkWEJrWVhSbEp6dGNibHh1WTI5dWMzUWdYM04wYjNKbElEMGdlMXh1SUNCdFpXRnpkWEpsT2lBbmFXOG5MQ0F2THlCVWFHVWdZM1Z5Y21WdWRHeDVJSE5sYkdWamRHVmtJRzFsWVhOMWNtVWdabTl5SUhSb1pTQm5jbUZ3YUZ4dUlDQmtZV2M2SUc1MWJHd3NYRzRnSUc1aGJXVTZJQ2RUWld4bFkzUWdZU0JFUVVjZ2IzSWdWR0Z6YXljc0lDOHZJRlJvWlNCcFpDQW9ibUZ0WlNrZ2IyWWdkR2hsSUhSb2FXNW5JR0psYVc1bklIWnBaWGRsWkZ4dUlDQnZkMjVsY2pvZ0oyOTNibVZ5Snl3Z0x5OGdkR2hsSUc5M2JtVnlJRzltSUhSb1pTQjBhR2x1WnlCaVpXbHVaeUIyYVdWM1pXUmNiaUFnWm05amRYTldZV3gxWlRvZ01Dd2dMeThnVkdobElIWmhiSFZsSUc5bUlIZG9ZWFJsZG1WeUlHbHpJR0psYVc1bklHMXZkWE5sWkNCdmRtVnlJRzl1SUhSb1pTQm5jbUZ3YUZ4dUlDQm1iMk4xYzBSaGRHVTZJREFzSUM4dklGUm9aU0JrWVhSbElHOW1JSFJvWlNCd2IybHVkQ0JqZFhKeVpXNTBiSGtnYlc5MWMyVmtJRzkyWlhJZ2IyNGdkR2hsSUdkeVlYQm9YRzRnSUdSaGRHRTZJRnRkTENBdkx5QlVhR1VnY205M2N5QnlaWFJ5YVdWMlpXUWdabkp2YlNCMGFHVWdjMlZ5ZG1WeUlIZHBkR2dnZG1Gc2RXVnpJR0Z1WkNCa1lYUmxjMXh1ZlR0Y2JseHVMeThnUm1seVpYTWdiMllnWVc0Z1FXcGhlQ0JuWlhRZ2NtVnhkV1Z6ZENCMGJ5QjBhR1VnYzJWeWRtVnlJSFJ2SUdkbGRDQjJZV3gxWlhNZ1lXNWtJR1JoZEdWeklHWnZjaUJuY21Gd2FGeHVablZ1WTNScGIyNGdkWEJrWVhSbFJHRjBZU2dwSUh0Y2JpQWdKQzVuWlhSS1UwOU9LRnh1SUNBZ0lIZHBibVJ2ZHk1c2IyTmhkR2x2YmlBcklDZGtZWFJoSnl4Y2JpQWdJQ0I3WEc0Z0lDQWdJQ0J0WldGemRYSmxPbDl6ZEc5eVpTNXRaV0Z6ZFhKbExGeHVJQ0FnSUNBZ1pHRm5PaUJmYzNSdmNtVXVaR0ZuTEZ4dUlDQWdJQ0FnYVdRNklGOXpkRzl5WlM1cFpGeHVJQ0FnSUgwc1hHNGdJQ0FnWm5WdVkzUnBiMjRvWkdGMFlTa2dlMXh1SUNBZ0lDQWdZMjl1YzNRZ1lYSnlZWGtnUFNCYlhUdGNiaUFnSUNBZ0lHWnZjaUFvWTI5dWMzUWdhMlY1SUdsdUlHUmhkR0VwSUh0Y2JpQWdJQ0FnSUNBZ1lYSnlZWGt1Y0hWemFDaDdkbUZzZFdVNlpHRjBZVnRyWlhsZExuWmhiSFZsTENCa1lYUmxPaWh1WlhjZ1JHRjBaU2hrWVhSaFcydGxlVjB1WkhNcEtYMHBPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lDQWdYM04wYjNKbExtUmhkR0VnUFNCaGNuSmhlVHRjYmlBZ0lDQWdJRjl6ZEc5eVpTNTFjR1JoZEdsdVp5QTlJR1poYkhObE8xeHVJQ0FnSUNBZ1JHVjBZV2xzVm1sbGQxTjBiM0psTG1WdGFYUW9SRUZVUVY5VlVFUkJWRVZmUlZaRlRsUXBPMXh1SUNBZ0lIMHBPMXh1ZlNCY2JseHVMeThnUm1seVpYTWdiMllnWVc0Z1FXcGhlQ0JuWlhRZ2NtVnhkV1Z6ZENCMGJ5QjBhR1VnYzJWeWRtVnlJSFJ2SUdkbGRDQnRaWFJoWkdGMFlTQnZiaUJqZFhKeVpXNTBJSFJvYVc1blhHNW1kVzVqZEdsdmJpQjFjR1JoZEdWRVpYUmhhV3h6S0NrZ2UxeHVJQ0FrTG1kbGRFcFRUMDRvWEc0Z0lDQWdkMmx1Wkc5M0xteHZZMkYwYVc5dUlDc2dKMlJsZEdGcGJITW5MRnh1SUNBZ0lIdGNiaUFnSUNBZ0lHUmhaem9nWDNOMGIzSmxMbVJoWnl4Y2JpQWdJQ0FnSUdsa09pQmZjM1J2Y21VdWFXUXNYRzRnSUNBZ2ZTeGNiaUFnSUNCbWRXNWpkR2x2Ymloa1lYUmhLU0I3WEc0Z0lDQWdJQ0JwWmlBb1pHRjBZUzVzWlc1bmRHZ2dQaUF3S1NCN1hHNGdJQ0FnSUNBZ0lGOXpkRzl5WlM1dmQyNWxjaUE5SUdSaGRHRmJNRjB1YjNkdVpYSTdYRzRnSUNBZ0lDQjlYRzRnSUNBZ0lDQkVaWFJoYVd4V2FXVjNVM1J2Y21VdVpXMXBkQ2hFUlZSQlNVeFRYMVZRUkVGVVJWOUZWa1ZPVkNrN1hHNGdJQ0FnZlNrN1hHNTlJRnh1WEc1amIyNXpkQ0JFWlhSaGFXeFdhV1YzVTNSdmNtVWdQU0JoYzNOcFoyNG9lMzBzSUVWMlpXNTBSVzFwZEhSbGNpNXdjbTkwYjNSNWNHVXNJSHRjYmx4dUlDQXZMeUJNYVhOMFpXNWxjaUJtYjNJZ2QyaGxiaUJ0YjNWelpTQnRiM1psYzF4dUlDQmhaR1JHYjJOMWMxVndaR0YwWlV4cGMzUmxibVZ5T2lCbWRXNWpkR2x2YmloallpbDdYRzRnSUNBZ2RHaHBjeTV2YmloR1QwTlZVMTlWVUVSQlZFVmZSVlpGVGxRc0lHTmlLVHRjYmlBZ2ZTeGNibHh1SUNCeVpXMXZkbVZHYjJOMWMxVndaR0YwWlV4cGMzUmxibVZ5T2lCbWRXNWpkR2x2YmloallpbDdYRzRnSUNBZ2RHaHBjeTV2YmloR1QwTlZVMTlWVUVSQlZFVmZSVlpGVGxRc0lHTmlLVHRjYmlBZ2ZTeGNibHh1SUNBdkx5Qk1hWE4wWlc1bGNpQm1iM0lnZDJobGJpQjBhR2x1WnlCdFpYUmhaR0YwWVNCamFHRnVaMlZ6WEc0Z0lHRmtaRVJsZEdGcGJGVndaR0YwWlV4cGMzUmxibVZ5T2lCbWRXNWpkR2x2YmloallpbDdYRzRnSUNBZ2RHaHBjeTV2YmloRVJWUkJTVXhUWDFWUVJFRlVSVjlGVmtWT1ZDd2dZMklwTzF4dUlDQjlMRnh1WEc0Z0lISmxiVzkyWlVSbGRHRnBiRlZ3WkdGMFpVeHBjM1JsYm1WeU9pQm1kVzVqZEdsdmJpaGpZaWw3WEc0Z0lDQWdkR2hwY3k1dmJpaEVSVlJCU1V4VFgxVlFSRUZVUlY5RlZrVk9WQ3dnWTJJcE8xeHVJQ0I5TEZ4dVhHNGdJQzh2SUV4cGMzUmxibVZ5SUdadmNpQjNhR1Z1SUdSaGRHRWdkbUZzZFdWeklHRnVaQ0JrWVhSbGN5QmphR0Z1WjJWY2JpQWdZV1JrUkdGMFlWVndaR0YwWlV4cGMzUmxibVZ5T2lCbWRXNWpkR2x2YmloallpbDdYRzRnSUNBZ2RHaHBjeTV2YmloRVFWUkJYMVZRUkVGVVJWOUZWa1ZPVkN3Z1kySXBPMXh1SUNCOUxGeHVYRzRnSUhKbGJXOTJaVVJoZEdGVmNHUmhkR1ZNYVhOMFpXNWxjam9nWm5WdVkzUnBiMjRvWTJJcGUxeHVJQ0FnSUhSb2FYTXVjbVZ0YjNabFRHbHpkR1Z1WlhJb1JFRlVRVjlWVUVSQlZFVmZSVlpGVGxRc0lHTmlLVHRjYmlBZ2ZTeGNibHh1SUNBdkx5Qk1hWE4wWlc1bGNpQm1iM0lnZDJobGJpQjFjMlZ5SUhObGJHVmpkSE1nWVNCa2FXWm1aWEpsYm5RZ2JXVmhjM1Z5WlZ4dUlDQmhaR1JOWldGemRYSmxRMmhoYm1kbFRHbHpkR1Z1WlhJNklHWjFibU4wYVc5dUtHTmlLWHRjYmlBZ0lDQjBhR2x6TG05dUtFMUZRVk5WVWtWZlEwaEJUa2RGWDBWV1JVNVVMQ0JqWWlrN1hHNGdJSDBzWEc1Y2JpQWdjbVZ0YjNabFRXVmhjM1Z5WlVOb1lXNW5aVXhwYzNSbGJtVnlPaUJtZFc1amRHbHZiaWhqWWlsN1hHNGdJQ0FnZEdocGN5NXlaVzF2ZG1WTWFYTjBaVzVsY2loTlJVRlRWVkpGWDBOSVFVNUhSVjlGVmtWT1ZDd2dZMklwTzF4dUlDQjlMRnh1WEc0Z0lDOHZJRWRsZEhSbGNpQnRaWFJvYjJRZ1ptOXlJR1JoZEdFZ2RHaGhkQ0JqY21WaGRHVnpJR1psZEdOb0lHbG1JRzVsWldRZ1ltVmNiaUFnWjJWMFJHRjBZVG9nWm5WdVkzUnBiMjRvS1h0Y2JpQWdJQ0J5WlhSMWNtNGdYM04wYjNKbExtUmhkR0U3WEc0Z0lIMHNYRzVjYmlBZ0x5OGdSMlYwZEdWeUlHMWxkR2h2WkNCbWIzSWdaR1YwWVdsc2N5QjBhR0YwSUdOeVpXRjBaWE1nWm1WMFkyZ2dhV1lnYm1WbFpDQmlaVnh1SUNCblpYUkVaWFJoYVd4ek9pQm1kVzVqZEdsdmJpZ3BlMXh1SUNBZ0lISmxkSFZ5YmlCN1hHNGdJQ0FnSUNCdVlXMWxPaUJmYzNSdmNtVXVhV1FzWEc0Z0lDQWdJQ0J2ZDI1bGNqb2dYM04wYjNKbExtOTNibVZ5WEc0Z0lDQWdmVHRjYmlBZ2ZTeGNiaUFnWEc0Z0lDOHZJRWRsZEhSbGNpQnRaWFJvYjJRZ2RHOGdaMlYwSUdOMWNuSmxiblFnYlc5MWMyVnZkbVZ5SUhaaGJIVmxjMXh1SUNCblpYUkdiMk4xYzBSaGRHVTZJR1oxYm1OMGFXOXVLQ2w3WEc0Z0lDQWdjbVYwZFhKdUlGOXpkRzl5WlM1bWIyTjFjMFJoZEdVN1hHNGdJSDBzWEc1Y2JpQWdaMlYwUm05amRYTldZV3gxWlRvZ1puVnVZM1JwYjI0b0tYdGNiaUFnSUNCeVpYUjFjbTRnWDNOMGIzSmxMbVp2WTNWelZtRnNkV1U3WEc0Z0lIMHNYRzVjYmlBZ0x5OGdSMlYwZEdWeUlHMWxkR2h2WkNCMGJ5Qm5aWFFnWTNWeWNtVnVkR3g1SUhObGJHVmpkR1ZrSUcxbFlYTjFjbVZjYmlBZ1oyVjBUV1ZoYzNWeVpUb2dablZ1WTNScGIyNG9LWHRjYmlBZ0lDQnlaWFIxY200Z1gzTjBiM0psTG0xbFlYTjFjbVU3WEc0Z0lIMHNYRzVjYmlBZ0x5OGdSMlYwZEdWeUlHMWxkR2h2WkNCbWIzSWdkR2hsSUdWdWRHbHlaU0J6ZEc5eVpWeHVJQ0JuWlhSVGRHOXlaVG9nWm5WdVkzUnBiMjRvS1h0Y2JpQWdJQ0J5WlhSMWNtNGdYM04wYjNKbE8xeHVJQ0I5TEZ4dVhHNGdJQzh2SUZObGRITWdkR2hsSUdSaFp5QnZaaUIwYUdVZ2MzUnZjbVZjYmlBZ2MyVjBSR0ZuT2lCbWRXNWpkR2x2Ymloa1lXY3BlMXh1SUNBZ0lGOXpkRzl5WlM1a1lXY2dQU0JrWVdjN1hHNGdJSDBzWEc1OUtUdGNibHh1WEc0dkx5QlNaV2RwYzNSbGNpQmpZV3hzWW1GamF5QjBieUJvWVc1a2JHVWdZV3hzSUhWd1pHRjBaWE5jYmtGd2NFUnBjM0JoZEdOb1pYSXVjbVZuYVhOMFpYSW9ablZ1WTNScGIyNG9ZV04wYVc5dUtTQjdYRzRnSUhOM2FYUmphQ2hoWTNScGIyNHVZV04wYVc5dVZIbHdaU2tnZTF4dUlDQWdJQzh2SUZSb1pTQnRaV0Z6ZFhKbElHTm9ZVzVuWldRZ1lXNWtJSGRsSUc1bFpXUWdkRzhnWm1WMFkyZ2dibVYzSUdSaGRHRmNiaUFnSUNCallYTmxJRVJsZEdGcGJGWnBaWGREYjI1emRHRnVkSE11VlZCRVFWUkZYMDFGUVZOVlVrVTZYRzRnSUNBZ0lDQmZjM1J2Y21VdWJXVmhjM1Z5WlNBOUlHRmpkR2x2Ymk1dFpXRnpkWEpsTG5SdlRHOTNaWEpEWVhObEtDa3VjbVZ3YkdGalpTZ25MeWNzSnljcE8xeHVJQ0FnSUNBZ1JHVjBZV2xzVm1sbGQxTjBiM0psTG1WdGFYUW9UVVZCVTFWU1JWOURTRUZPUjBWZlJWWkZUbFFwTzF4dUlDQWdJQ0FnZFhCa1lYUmxSR0YwWVNncE8xeHVJQ0FnSUNBZ1luSmxZV3M3WEc0Z0lDQWdMeThnVjJVZ2JtVmxaQ0IwYnlCbVpYUmphQ0J1WlhjZ1pHRjBZVnh1SUNBZ0lHTmhjMlVnUkdWMFlXbHNWbWxsZDBOdmJuTjBZVzUwY3k1VlVFUkJWRVZmUkVGVVFUcGNiaUFnSUNBZ0lIVndaR0YwWlVSaGRHRW9LVHRjYmlBZ0lDQWdJR0p5WldGck8xeHVJQ0FnSUM4dklGZGxJRzVsWldRZ2RHOGdabVYwWTJnZ2JtVjNJR1JsZEdGcGJITWdiMjRnZEdobElHTjFjbkpsYm5RZ1pHRm5MM1JoYzJ0Y2JpQWdJQ0JqWVhObElFUmxkR0ZwYkZacFpYZERiMjV6ZEdGdWRITXVWVkJFUVZSRlgwUkZWRUZKVEY5V1NVVlhPbHh1SUNBZ0lDQWdYM04wYjNKbExtbGtJRDBnWVdOMGFXOXVMbTVoYldVN1hHNGdJQ0FnSUNCMWNHUmhkR1ZFWVhSaEtDazdYRzRnSUNBZ0lDQjFjR1JoZEdWRVpYUmhhV3h6S0NrN1hHNGdJQ0FnSUNCaWNtVmhhenRjYmlBZ0lDQXZMeUJYWlNCdVpXVmtJSFJ2SUhWd1pHRjBaU0J2ZFhJZ2NtVmpiM0prSUc5bUlHOTFjaUJqZFhKeVpXNTBJRzF2ZFhObGIzWmxjaUJ3YjJsdWRGeHVJQ0FnSUdOaGMyVWdSR1YwWVdsc1ZtbGxkME52Ym5OMFlXNTBjeTVWVUVSQlZFVmZSazlEVlZOZlJFRlVRVHBjYmlBZ0lDQWdJRjl6ZEc5eVpTNW1iMk4xYzFaaGJIVmxJRDBnWVdOMGFXOXVMblpoYkhWbE8xeHVJQ0FnSUNBZ1gzTjBiM0psTG1adlkzVnpSR0YwWlNBOUlHRmpkR2x2Ymk1a1lYUmxPMXh1SUNBZ0lDQWdSR1YwWVdsc1ZtbGxkMU4wYjNKbExtVnRhWFFvUms5RFZWTmZWVkJFUVZSRlgwVldSVTVVS1R0Y2JpQWdJQ0FnSUdKeVpXRnJPMXh1SUNBZ0lDOHZJRmRsSUc1bFpXUWdkRzhnZFhCa1lYUmxJRzkxY2lCeVpXTnZjbVFnYjJZZ2IzVnlJR04xY25KbGJuUWdiVzkxYzJWdmRtVnlJSEJ2YVc1MFhHNGdJQ0FnWTJGelpTQkVaWFJoYVd4V2FXVjNRMjl1YzNSaGJuUnpMbFZRUkVGVVJWOUVRVWM2WEc0Z0lDQWdJQ0JmYzNSdmNtVXVaR0ZuSUQwZ1lXTjBhVzl1TG1SaFp6dGNiaUFnSUNBZ0lHSnlaV0ZyTzF4dVhHNWNiaUFnSUNCa1pXWmhkV3gwT2x4dUlDQWdJQ0FnTHk4Z2JtOGdiM0JjYmlBZ2ZWeHVmU2s3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1JHVjBZV2xzVm1sbGQxTjBiM0psTzF4dUlsMTkiLCIvLyBGaWx0ZXJTdG9yZS5qc1xuLy8gVGhlIGZsdXggZGF0YXN0b3JlIGZvciB0aGUgbGVmdCBzaWRlYmFyXG4vKmpzaGludCBlc25leHQ6IHRydWUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgQXBwRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uL2Rpc3BhdGNoZXIvQXBwRGlzcGF0Y2hlcicpO1xudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcbnZhciBGaWx0ZXJDb25zdGFudHMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvRmlsdGVyQ29uc3RhbnRzJyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnb2JqZWN0LWFzc2lnbicpO1xudmFyIERldGFpbFZpZXdTdG9yZSA9IHJlcXVpcmUoJy4vRGV0YWlsVmlld1N0b3JlJyk7XG5cbnZhciBGSUxURVJfQ0hBTkdFX0VWRU5UID0gJ2ZpbHRlcl9jaGFuZ2UnO1xudmFyIERBR19TRVRfRVZFTlQgPSAnZGFnX2Nob3Nlbic7XG5cbnZhciBfc3RvcmUgPSB7XG4gIHJlc3VsdHM6IG51bGwsIC8vIFRoZSBjdXJyZW50IGRhZ3MvdGFza3MgbGlzdGVkIG9uIHRoZSBzaWRlYmFyIHcvIHZhbHVlc1xuICBtZWFzdXJlOiAnaW8nLCAvLyBUaGUgY3VycmVudCBmaWx0ZXIgbWVhc3VyZVxuICB0aW1lOiAnbW9udGgnLCAvLyBUaGUgY3VycmVudCBmaWx0ZXIgdGltZSByYW5nZVxuICBkYWc6IG51bGwsIC8vIFRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgdGFzayBvciBkYWdcbiAgY2hhbmdlOiAncGVyY2VudCcsIC8vIFdoZXRoZXIgdGhlIGZpbHRlciBzaG93cyBhYnNvbHV0ZSBvciByZWxhdGl2ZSBjaGFuZ2VcbiAgc2VhcmNoRmlsdGVyOiAnJyB9O1xuXG4vLyBGaXJlcyBvZiBhbiBBamF4IGdldCByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgdG8gZ2V0IGRhZ3MvdGFza3MgZm9yIHNpZGViYXJcbi8vIFRoZSBjb250ZW50cyBvZiB0aGUgc2VhcmNoIGJhciB0aGF0IGZpbHRlcnMgcmVzdWx0c1xuZnVuY3Rpb24gdXBkYXRlUmVzdWx0cygpIHtcbiAgJC5nZXRKU09OKHdpbmRvdy5sb2NhdGlvbiArICdmaWx0ZXInLCB7XG4gICAgbWVhc3VyZTogX3N0b3JlLm1lYXN1cmUsXG4gICAgdGltZTogX3N0b3JlLnRpbWUsXG4gICAgZGFnOiBfc3RvcmUuZGFnXG4gIH0sIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgLy8gY29udmVydCBkaWN0IHRvIGFycmF5XG4gICAgdmFyIGFycmF5ID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIGRhdGEpIHtcbiAgICAgIGFycmF5LnB1c2goZGF0YVtrZXldKTtcbiAgICB9XG4gICAgX3N0b3JlLnJlc3VsdHMgPSBhcnJheTtcbiAgICBfc3RvcmUudXBkYXRpbmcgPSBmYWxzZTtcbiAgICBGaWx0ZXJTdG9yZS5lbWl0KEZJTFRFUl9DSEFOR0VfRVZFTlQpO1xuICB9KTtcbn1cblxudmFyIEZpbHRlclN0b3JlID0gYXNzaWduKHt9LCBFdmVudEVtaXR0ZXIucHJvdG90eXBlLCB7XG4gIC8vIExpc3RlbmVyIGZvciB3aGVuIHJhZGlvIGJ1dHRvbiBjaGFuZ2VzIGFuZCByZXN1bHRzIG5lZWQgdG8gdXBkYXRlXG4gIGFkZEZpbHRlclJlc3VsdHNDaGFuZ2VMaXN0ZW5lcjogZnVuY3Rpb24gYWRkRmlsdGVyUmVzdWx0c0NoYW5nZUxpc3RlbmVyKGNiKSB7XG4gICAgdGhpcy5vbihGSUxURVJfQ0hBTkdFX0VWRU5ULCBjYik7XG4gIH0sXG4gIHJlbW92ZUZpbHRlclJlc3VsdHNDaGFuZ2VMaXN0ZW5lcjogZnVuY3Rpb24gcmVtb3ZlRmlsdGVyUmVzdWx0c0NoYW5nZUxpc3RlbmVyKGNiKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcihGSUxURVJfQ0hBTkdFX0VWRU5ULCBjYik7XG4gIH0sXG4gIC8vIExpc3RlbmVyIGZvciB3aGVuIGRhZyBpcyBzZXQgYW5kIGJ1dHRvbiBuZWVkcyB0byB1cGRhdGVcbiAgYWRkRGFnU2V0TGlzdGVuZXI6IGZ1bmN0aW9uIGFkZERhZ1NldExpc3RlbmVyKGNiKSB7XG4gICAgdGhpcy5vbihEQUdfU0VUX0VWRU5ULCBjYik7XG4gIH0sXG4gIHJlbW92ZURhZ1NldExpc3RlbmVyOiBmdW5jdGlvbiByZW1vdmVEYWdTZXRMaXN0ZW5lcihjYikge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoREFHX1NFVF9FVkVOVCwgY2IpO1xuICB9LFxuICAvLyBHZXR0ZXIgZm9yIHJlc3VsdHMgdGhhdCBmZXRjaGVzIHJlc3VsdHMgaWYgc3RvcmUgaXMgZW1wdHlcbiAgZ2V0UmVzdWx0czogZnVuY3Rpb24gZ2V0UmVzdWx0cygpIHtcbiAgICBpZiAoIV9zdG9yZS5yZXN1bHRzKSB7XG4gICAgICB1cGRhdGVSZXN1bHRzKCk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIF9zdG9yZS5yZXN1bHRzLmZpbHRlcihmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgcmV0dXJuIGVsZW1lbnQubmFtZS5pbmRleE9mKF9zdG9yZS5zZWFyY2hGaWx0ZXIpICE9PSAtMTtcbiAgICB9KTtcbiAgfSxcbiAgLy8gVHJhbnNpZW50IGdldHRlciB0aGF0IGNhbGN1bGF0ZXMgaGVhZGVycyBldmVyeSB0aW1lXG4gIGdldFJlc3VsdEhlYWRlcnM6IGZ1bmN0aW9uIGdldFJlc3VsdEhlYWRlcnMoKSB7XG4gICAgaWYgKF9zdG9yZS5kYWcgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiBbJ3Rhc2sgbmFtZScsIF9zdG9yZS5tZWFzdXJlXTtcbiAgICB9XG4gICAgcmV0dXJuIFsnZGFnIG5hbWUnLCBfc3RvcmUubWVhc3VyZV07XG4gIH0sXG4gIC8vIFRyYW5zaWVudCBnZXR0ZXIgdGhhdCBjYWxjdWxhdGVzIGZpbHRlciBkZXNjcmlwdGlvbiBzdHJpbmdcbiAgZ2V0RGVzY3JpcHRpb25TdHJpbmc6IGZ1bmN0aW9uIGdldERlc2NyaXB0aW9uU3RyaW5nKCkge1xuICAgIHZhciBtZWFzdXJlU3RyaW5nID0gdW5kZWZpbmVkO1xuICAgIHN3aXRjaCAoX3N0b3JlLm1lYXN1cmUpIHtcbiAgICAgIGNhc2UgJ2lvJzpcbiAgICAgICAgbWVhc3VyZVN0cmluZyA9ICdyZWFkIGFuZCB3cml0ZSBvcGVyYXRvcmlvbnMnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NwdSc6XG4gICAgICAgIG1lYXN1cmVTdHJpbmcgPSAndG90YWwgY3B1IHRpbWUgaW4gc2Vjb25kcyc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbWFwcGVycyc6XG4gICAgICAgIG1lYXN1cmVTdHJpbmcgPSAnbnVtYmVyIG9mIG1hcHBlcnMnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3JlZHVjZXJzJzpcbiAgICAgICAgbWVhc3VyZVN0cmluZyA9ICdudW1iZXIgb2YgcmVkdWNlcnMnO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuICdBdmVyYWdlICcgKyBtZWFzdXJlU3RyaW5nICsgJyBvdmVyIHRoZSBsYXN0ICcgKyBfc3RvcmUudGltZS50b0xvd2VyQ2FzZSgpICsgJy4nO1xuICB9LFxuXG4gIC8vIFJldHVybiBhIGJvb2wgYXMgdG8gd2hldGhlciBmaWx0ZXIgcmVzdWx0cyBhcmUgZGFncyBvciB0YXNrc1xuICBpc1Nob3dpbmdEYWdzOiBmdW5jdGlvbiBpc1Nob3dpbmdEYWdzKCkge1xuICAgIGlmIChfc3RvcmUuZGFnID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbn0pO1xuXG4vLyBSZWdpc3RlciBjYWxsYmFjayB0byBoYW5kbGUgYWxsIHVwZGF0ZXNcbkFwcERpc3BhdGNoZXIucmVnaXN0ZXIoZnVuY3Rpb24gKGFjdGlvbikge1xuICBzd2l0Y2ggKGFjdGlvbi5hY3Rpb25UeXBlKSB7XG4gICAgLy8gUmFkaW8gYnV0dG9ucyBjaGFuZ2VkLCBmZXRjaCBuZXcgZGFnL3Rhc2sgZGF0YVxuICAgIGNhc2UgRmlsdGVyQ29uc3RhbnRzLlVQREFURV9GSUxURVI6XG4gICAgICBpZiAoYWN0aW9uLmtleSBpbiBfc3RvcmUpIHtcbiAgICAgICAgX3N0b3JlW2FjdGlvbi5rZXldID0gYWN0aW9uLnZhbHVlLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnLycsICcnKTtcbiAgICAgICAgaWYgKGFjdGlvbi5rZXkgPT0gJ2RhZycpIHtcbiAgICAgICAgICBGaWx0ZXJTdG9yZS5lbWl0KERBR19TRVRfRVZFTlQpO1xuICAgICAgICB9XG4gICAgICAgIHVwZGF0ZVJlc3VsdHMoKTtcbiAgICAgIH0gZWxzZSBpZiAoYWN0aW9uLmtleSA9PSAnZ3JhaW4nKSB7XG4gICAgICAgIGlmIChhY3Rpb24udmFsdWUudG9Mb3dlckNhc2UoKSA9PSAnZGFnJykge1xuICAgICAgICAgIF9zdG9yZS5kYWcgPSBudWxsO1xuICAgICAgICAgIERldGFpbFZpZXdTdG9yZS5zZXREYWcobnVsbCk7XG4gICAgICAgICAgdXBkYXRlUmVzdWx0cygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICAvLyBUaGUgc2VhcmNoIGNoYW5nZWQsIHJlZnJlc2ggdGhlIGFjY2VwdGFibGUgZGFnL3Rhc2tzXG4gICAgY2FzZSBGaWx0ZXJDb25zdGFudHMuVVBEQVRFX1NFQVJDSDpcbiAgICAgIF9zdG9yZS5zZWFyY2hGaWx0ZXIgPSBhY3Rpb24uc2VhcmNoRmlsdGVyO1xuICAgICAgRmlsdGVyU3RvcmUuZW1pdChGSUxURVJfQ0hBTkdFX0VWRU5UKTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgLy8gbm8gb3BcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRmlsdGVyU3RvcmU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTluY21WbmIzSjVYMlp2YzNSbGNpOWtZWFJoTFdWdVp5OW9iMjVsZVhCdmRDOWtaWFl2YzJOeWFYQjBjeTl6ZEc5eVpYTXZSbWxzZEdWeVUzUnZjbVV1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWpzN096czdPMEZCU1VFc1NVRkJUU3hoUVVGaExFZEJRVWNzVDBGQlR5eERRVUZETERaQ1FVRTJRaXhEUVVGRExFTkJRVU03UVVGRE4wUXNTVUZCVFN4WlFVRlpMRWRCUVVjc1QwRkJUeXhEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETEZsQlFWa3NRMEZCUXp0QlFVTndSQ3hKUVVGTkxHVkJRV1VzUjBGQlJ5eFBRVUZQTEVOQlFVTXNPRUpCUVRoQ0xFTkJRVU1zUTBGQlF6dEJRVU5vUlN4SlFVRk5MRTFCUVUwc1IwRkJSeXhQUVVGUExFTkJRVU1zWlVGQlpTeERRVUZETEVOQlFVTTdRVUZEZUVNc1NVRkJUU3hsUVVGbExFZEJRVWNzVDBGQlR5eERRVUZETEcxQ1FVRnRRaXhEUVVGRExFTkJRVU03TzBGQlJYSkVMRWxCUVUwc2JVSkJRVzFDTEVkQlFVY3NaVUZCWlN4RFFVRkRPMEZCUXpWRExFbEJRVTBzWVVGQllTeEhRVUZITEZsQlFWa3NRMEZCUXpzN1FVRkZia01zU1VGQlRTeE5RVUZOTEVkQlFVYzdRVUZEWWl4VFFVRlBMRVZCUVVVc1NVRkJTVHRCUVVOaUxGTkJRVThzUlVGQlJTeEpRVUZKTzBGQlEySXNUVUZCU1N4RlFVRkZMRTlCUVU4N1FVRkRZaXhMUVVGSExFVkJRVVVzU1VGQlNUdEJRVU5VTEZGQlFVMHNSVUZCUlN4VFFVRlRPMEZCUTJwQ0xHTkJRVmtzUlVGQlJTeEZRVUZGTEVWQlEycENMRU5CUVVNN096czdRVUZIUml4VFFVRlRMR0ZCUVdFc1IwRkJSenRCUVVOMlFpeEhRVUZETEVOQlFVTXNUMEZCVHl4RFFVTlFMRTFCUVUwc1EwRkJReXhSUVVGUkxFZEJRVWNzVVVGQlVTeEZRVU14UWp0QlFVTkZMRmRCUVU4c1JVRkJSU3hOUVVGTkxFTkJRVU1zVDBGQlR6dEJRVU4yUWl4UlFVRkpMRVZCUVVVc1RVRkJUU3hEUVVGRExFbEJRVWs3UVVGRGFrSXNUMEZCUnl4RlFVRkZMRTFCUVUwc1EwRkJReXhIUVVGSE8wZEJRMmhDTEVWQlEwUXNWVUZCVXl4SlFVRkpMRVZCUVVVN08wRkJSV0lzVVVGQlRTeExRVUZMTEVkQlFVY3NSVUZCUlN4RFFVRkRPMEZCUTJwQ0xGTkJRVXNzU1VGQlRTeEhRVUZITEVsQlFVa3NTVUZCU1N4RlFVRkZPMEZCUTNSQ0xGZEJRVXNzUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU03UzBGRGRrSTdRVUZEUkN4VlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExFdEJRVXNzUTBGQlF6dEJRVU4yUWl4VlFVRk5MRU5CUVVNc1VVRkJVU3hIUVVGSExFdEJRVXNzUTBGQlF6dEJRVU40UWl4bFFVRlhMRU5CUVVNc1NVRkJTU3hEUVVGRExHMUNRVUZ0UWl4RFFVRkRMRU5CUVVNN1IwRkRka01zUTBGQlF5eERRVUZETzBOQlEwNDdPMEZCUjBRc1NVRkJUU3hYUVVGWExFZEJRVWNzVFVGQlRTeERRVUZETEVWQlFVVXNSVUZCUlN4WlFVRlpMRU5CUVVNc1UwRkJVeXhGUVVGRk96dEJRVVZ5UkN4blEwRkJPRUlzUlVGQlJTeDNRMEZCVXl4RlFVRkZMRVZCUVVNN1FVRkRNVU1zVVVGQlNTeERRVUZETEVWQlFVVXNRMEZCUXl4dFFrRkJiVUlzUlVGQlJTeEZRVUZGTEVOQlFVTXNRMEZCUXp0SFFVTnNRenRCUVVORUxHMURRVUZwUXl4RlFVRkZMREpEUVVGVExFVkJRVVVzUlVGQlF6dEJRVU0zUXl4UlFVRkpMRU5CUVVNc1kwRkJZeXhEUVVGRExHMUNRVUZ0UWl4RlFVRkZMRVZCUVVVc1EwRkJReXhEUVVGRE8wZEJRemxET3p0QlFVVkVMRzFDUVVGcFFpeEZRVUZGTERKQ1FVRlRMRVZCUVVVc1JVRkJRenRCUVVNM1FpeFJRVUZKTEVOQlFVTXNSVUZCUlN4RFFVRkRMR0ZCUVdFc1JVRkJSU3hGUVVGRkxFTkJRVU1zUTBGQlF6dEhRVU0xUWp0QlFVTkVMSE5DUVVGdlFpeEZRVUZGTERoQ1FVRlRMRVZCUVVVc1JVRkJRenRCUVVOb1F5eFJRVUZKTEVOQlFVTXNZMEZCWXl4RFFVRkRMR0ZCUVdFc1JVRkJSU3hGUVVGRkxFTkJRVU1zUTBGQlF6dEhRVU40UXpzN1FVRkZSQ3haUVVGVkxFVkJRVVVzYzBKQlFWVTdRVUZEY0VJc1VVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF5eFBRVUZQTEVWQlFVVTdRVUZEYmtJc2JVSkJRV0VzUlVGQlJTeERRVUZETzBGQlEyaENMR0ZCUVU4c1NVRkJTU3hEUVVGRE8wdEJRMkk3UVVGRFJDeFhRVUZQTEUxQlFVMHNRMEZCUXl4UFFVRlBMRU5CUVVNc1RVRkJUU3hEUVVGRExGVkJRVk1zVDBGQlR5eEZRVUZGTzBGQlF6ZERMR0ZCUVZFc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNUVUZCVFN4RFFVRkRMRmxCUVZrc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZGTzB0QlF6TkVMRU5CUVVNc1EwRkJRenRIUVVOS096dEJRVVZFTEd0Q1FVRm5RaXhGUVVGRkxEUkNRVUZWTzBGQlF6RkNMRkZCUVVrc1RVRkJUU3hEUVVGRExFZEJRVWNzUzBGQlN5eEpRVUZKTEVWQlFVVTdRVUZEZGtJc1lVRkJUeXhEUVVGRExGZEJRVmNzUlVGQlJTeE5RVUZOTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN1MwRkRkRU03UVVGRFJDeFhRVUZQTEVOQlFVTXNWVUZCVlN4RlFVRkZMRTFCUVUwc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEhRVVZ5UXpzN1FVRkZSQ3h6UWtGQmIwSXNSVUZCUlN4blEwRkJWVHRCUVVNNVFpeFJRVUZKTEdGQlFXRXNXVUZCUVN4RFFVRkRPMEZCUTJ4Q0xGbEJRVkVzVFVGQlRTeERRVUZETEU5QlFVODdRVUZEY0VJc1YwRkJTeXhKUVVGSk8wRkJRMUFzY1VKQlFXRXNSMEZCUnl3MlFrRkJOa0lzUTBGQlF6dEJRVU01UXl4alFVRk5PMEZCUVVFc1FVRkRVaXhYUVVGTExFdEJRVXM3UVVGRFVpeHhRa0ZCWVN4SFFVRkhMREpDUVVFeVFpeERRVUZETzBGQlF6VkRMR05CUVUwN1FVRkJRU3hCUVVOU0xGZEJRVXNzVTBGQlV6dEJRVU5hTEhGQ1FVRmhMRWRCUVVjc2JVSkJRVzFDTEVOQlFVTTdRVUZEY0VNc1kwRkJUVHRCUVVGQkxFRkJRMUlzVjBGQlN5eFZRVUZWTzBGQlEySXNjVUpCUVdFc1IwRkJSeXh2UWtGQmIwSXNRMEZCUXp0QlFVTnlReXhqUVVGTk8wRkJRVUVzUzBGRFZEdEJRVU5FTEZkQlFVOHNWVUZCVlN4SFFVTm1MR0ZCUVdFc1IwRkRZaXhwUWtGQmFVSXNSMEZEYWtJc1RVRkJUU3hEUVVGRExFbEJRVWtzUTBGQlF5eFhRVUZYTEVWQlFVVXNSMEZCUnl4SFFVRkhMRU5CUVVNN1IwRkRia003T3p0QlFVZEVMR1ZCUVdFc1JVRkJSU3g1UWtGQlZUdEJRVU4yUWl4UlFVRkpMRTFCUVUwc1EwRkJReXhIUVVGSExFdEJRVXNzU1VGQlNTeEZRVUZGTzBGQlFVTXNZVUZCVHl4SlFVRkpMRU5CUVVNN1MwRkJRenRCUVVOMlF5eFhRVUZQTEV0QlFVc3NRMEZCUXp0SFFVTmtPenREUVVWR0xFTkJRVU1zUTBGQlF6czdPMEZCU1Vnc1lVRkJZU3hEUVVGRExGRkJRVkVzUTBGQlF5eFZRVUZUTEUxQlFVMHNSVUZCUlR0QlFVTjBReXhWUVVGUExFMUJRVTBzUTBGQlF5eFZRVUZWT3p0QlFVVjBRaXhUUVVGTExHVkJRV1VzUTBGQlF5eGhRVUZoTzBGQlEyaERMRlZCUVVrc1RVRkJUU3hEUVVGRExFZEJRVWNzU1VGQlNTeE5RVUZOTEVWQlFVVTdRVUZEZUVJc1kwRkJUU3hEUVVGRExFMUJRVTBzUTBGQlF5eEhRVUZITEVOQlFVTXNSMEZCUnl4TlFVRk5MRU5CUVVNc1MwRkJTeXhEUVVGRExGZEJRVmNzUlVGQlJTeERRVUZETEU5QlFVOHNRMEZCUXl4SFFVRkhMRVZCUVVNc1JVRkJSU3hEUVVGRExFTkJRVU03UVVGRGFFVXNXVUZCU1N4TlFVRk5MRU5CUVVNc1IwRkJSeXhKUVVGSkxFdEJRVXNzUlVGQlJUdEJRVU4yUWl4eFFrRkJWeXhEUVVGRExFbEJRVWtzUTBGQlF5eGhRVUZoTEVOQlFVTXNRMEZCUXp0VFFVTnFRenRCUVVORUxIRkNRVUZoTEVWQlFVVXNRMEZCUXp0UFFVTnFRaXhOUVVOSkxFbEJRVWtzVFVGQlRTeERRVUZETEVkQlFVY3NTVUZCU1N4UFFVRlBMRVZCUVVVN1FVRkRPVUlzV1VGQlNTeE5RVUZOTEVOQlFVTXNTMEZCU3l4RFFVRkRMRmRCUVZjc1JVRkJSU3hKUVVGSkxFdEJRVXNzUlVGQlJUdEJRVU4yUXl4blFrRkJUU3hEUVVGRExFZEJRVWNzUjBGQlJ5eEpRVUZKTEVOQlFVTTdRVUZEYkVJc2VVSkJRV1VzUTBGQlF5eE5RVUZOTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1FVRkROMElzZFVKQlFXRXNSVUZCUlN4RFFVRkRPMU5CUTJwQ08wOUJRMFk3UVVGRFJDeFpRVUZOTzBGQlFVRTdRVUZGVWl4VFFVRkxMR1ZCUVdVc1EwRkJReXhoUVVGaE8wRkJRMmhETEZsQlFVMHNRMEZCUXl4WlFVRlpMRWRCUVVjc1RVRkJUU3hEUVVGRExGbEJRVmtzUTBGQlF6dEJRVU14UXl4cFFrRkJWeXhEUVVGRExFbEJRVWtzUTBGQlF5eHRRa0ZCYlVJc1EwRkJReXhEUVVGRE8wRkJRM1JETEZsQlFVMDdRVUZCUVN4QlFVTlNMRmxCUVZFN08wZEJSVlE3UTBGRFJpeERRVUZETEVOQlFVTTdPMEZCUlVnc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eFhRVUZYTEVOQlFVTWlMQ0ptYVd4bElqb2lMMVZ6WlhKekwyZHlaV2R2Y25sZlptOXpkR1Z5TDJSaGRHRXRaVzVuTDJodmJtVjVjRzkwTDJSbGRpOXpZM0pwY0hSekwzTjBiM0psY3k5R2FXeDBaWEpUZEc5eVpTNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWk4dklFWnBiSFJsY2xOMGIzSmxMbXB6WEc0dkx5QlVhR1VnWm14MWVDQmtZWFJoYzNSdmNtVWdabTl5SUhSb1pTQnNaV1owSUhOcFpHVmlZWEpjYmk4cWFuTm9hVzUwSUdWemJtVjRkRG9nZEhKMVpTQXFMMXh1WEc1amIyNXpkQ0JCY0hCRWFYTndZWFJqYUdWeUlEMGdjbVZ4ZFdseVpTZ25MaTR2WkdsemNHRjBZMmhsY2k5QmNIQkVhWE53WVhSamFHVnlKeWs3WEc1amIyNXpkQ0JGZG1WdWRFVnRhWFIwWlhJZ1BTQnlaWEYxYVhKbEtDZGxkbVZ1ZEhNbktTNUZkbVZ1ZEVWdGFYUjBaWEk3WEc1amIyNXpkQ0JHYVd4MFpYSkRiMjV6ZEdGdWRITWdQU0J5WlhGMWFYSmxLQ2N1TGk5amIyNXpkR0Z1ZEhNdlJtbHNkR1Z5UTI5dWMzUmhiblJ6SnlrN1hHNWpiMjV6ZENCaGMzTnBaMjRnUFNCeVpYRjFhWEpsS0NkdlltcGxZM1F0WVhOemFXZHVKeWs3WEc1amIyNXpkQ0JFWlhSaGFXeFdhV1YzVTNSdmNtVWdQU0J5WlhGMWFYSmxLQ2N1TDBSbGRHRnBiRlpwWlhkVGRHOXlaU2NwTzF4dVhHNWpiMjV6ZENCR1NVeFVSVkpmUTBoQlRrZEZYMFZXUlU1VUlEMGdKMlpwYkhSbGNsOWphR0Z1WjJVbk8xeHVZMjl1YzNRZ1JFRkhYMU5GVkY5RlZrVk9WQ0E5SUNka1lXZGZZMmh2YzJWdUp6dGNibHh1WTI5dWMzUWdYM04wYjNKbElEMGdlMXh1SUNCeVpYTjFiSFJ6T2lCdWRXeHNMQ0F2THlCVWFHVWdZM1Z5Y21WdWRDQmtZV2R6TDNSaGMydHpJR3hwYzNSbFpDQnZiaUIwYUdVZ2MybGtaV0poY2lCM0x5QjJZV3gxWlhOY2JpQWdiV1ZoYzNWeVpUb2dKMmx2Snl3Z0x5OGdWR2hsSUdOMWNuSmxiblFnWm1sc2RHVnlJRzFsWVhOMWNtVmNiaUFnZEdsdFpUb2dKMjF2Ym5Sb0p5d2dMeThnVkdobElHTjFjbkpsYm5RZ1ptbHNkR1Z5SUhScGJXVWdjbUZ1WjJWY2JpQWdaR0ZuT2lCdWRXeHNMQ0F2THlCVWFHVWdZM1Z5Y21WdWRHeDVJSE5sYkdWamRHVmtJSFJoYzJzZ2IzSWdaR0ZuWEc0Z0lHTm9ZVzVuWlRvZ0ozQmxjbU5sYm5RbkxDQXZMeUJYYUdWMGFHVnlJSFJvWlNCbWFXeDBaWElnYzJodmQzTWdZV0p6YjJ4MWRHVWdiM0lnY21Wc1lYUnBkbVVnWTJoaGJtZGxYRzRnSUhObFlYSmphRVpwYkhSbGNqb2dKeWNzSUM4dklGUm9aU0JqYjI1MFpXNTBjeUJ2WmlCMGFHVWdjMlZoY21Ob0lHSmhjaUIwYUdGMElHWnBiSFJsY25NZ2NtVnpkV3gwYzF4dWZUdGNibHh1THk4Z1JtbHlaWE1nYjJZZ1lXNGdRV3BoZUNCblpYUWdjbVZ4ZFdWemRDQjBieUIwYUdVZ2MyVnlkbVZ5SUhSdklHZGxkQ0JrWVdkekwzUmhjMnR6SUdadmNpQnphV1JsWW1GeVhHNW1kVzVqZEdsdmJpQjFjR1JoZEdWU1pYTjFiSFJ6S0NrZ2UxeHVJQ0FrTG1kbGRFcFRUMDRvWEc0Z0lDQWdkMmx1Wkc5M0xteHZZMkYwYVc5dUlDc2dKMlpwYkhSbGNpY3NYRzRnSUNBZ2UxeHVJQ0FnSUNBZ2JXVmhjM1Z5WlRvZ1gzTjBiM0psTG0xbFlYTjFjbVVzWEc0Z0lDQWdJQ0IwYVcxbE9pQmZjM1J2Y21VdWRHbHRaU3hjYmlBZ0lDQWdJR1JoWnpvZ1gzTjBiM0psTG1SaFp5eGNiaUFnSUNCOUxGeHVJQ0FnSUdaMWJtTjBhVzl1S0dSaGRHRXBJSHRjYmlBZ0lDQWdJQzh2SUdOdmJuWmxjblFnWkdsamRDQjBieUJoY25KaGVWeHVJQ0FnSUNBZ1kyOXVjM1FnWVhKeVlYa2dQU0JiWFR0Y2JpQWdJQ0FnSUdadmNpQW9ZMjl1YzNRZ2EyVjVJR2x1SUdSaGRHRXBJSHRjYmlBZ0lDQWdJQ0FnWVhKeVlYa3VjSFZ6YUNoa1lYUmhXMnRsZVYwcE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ1gzTjBiM0psTG5KbGMzVnNkSE1nUFNCaGNuSmhlVHRjYmlBZ0lDQWdJRjl6ZEc5eVpTNTFjR1JoZEdsdVp5QTlJR1poYkhObE8xeHVJQ0FnSUNBZ1JtbHNkR1Z5VTNSdmNtVXVaVzFwZENoR1NVeFVSVkpmUTBoQlRrZEZYMFZXUlU1VUtUdGNiaUFnSUNCOUtUdGNibjBnWEc1Y2JseHVZMjl1YzNRZ1JtbHNkR1Z5VTNSdmNtVWdQU0JoYzNOcFoyNG9lMzBzSUVWMlpXNTBSVzFwZEhSbGNpNXdjbTkwYjNSNWNHVXNJSHRjYmlBZ0x5OGdUR2x6ZEdWdVpYSWdabTl5SUhkb1pXNGdjbUZrYVc4Z1luVjBkRzl1SUdOb1lXNW5aWE1nWVc1a0lISmxjM1ZzZEhNZ2JtVmxaQ0IwYnlCMWNHUmhkR1ZjYmlBZ1lXUmtSbWxzZEdWeVVtVnpkV3gwYzBOb1lXNW5aVXhwYzNSbGJtVnlPaUJtZFc1amRHbHZiaWhqWWlsN1hHNGdJQ0FnZEdocGN5NXZiaWhHU1V4VVJWSmZRMGhCVGtkRlgwVldSVTVVTENCallpazdYRzRnSUgwc1hHNGdJSEpsYlc5MlpVWnBiSFJsY2xKbGMzVnNkSE5EYUdGdVoyVk1hWE4wWlc1bGNqb2dablZ1WTNScGIyNG9ZMklwZTF4dUlDQWdJSFJvYVhNdWNtVnRiM1psVEdsemRHVnVaWElvUmtsTVZFVlNYME5JUVU1SFJWOUZWa1ZPVkN3Z1kySXBPMXh1SUNCOUxGeHVJQ0F2THlCTWFYTjBaVzVsY2lCbWIzSWdkMmhsYmlCa1lXY2dhWE1nYzJWMElHRnVaQ0JpZFhSMGIyNGdibVZsWkhNZ2RHOGdkWEJrWVhSbFhHNGdJR0ZrWkVSaFoxTmxkRXhwYzNSbGJtVnlPaUJtZFc1amRHbHZiaWhqWWlsN1hHNGdJQ0FnZEdocGN5NXZiaWhFUVVkZlUwVlVYMFZXUlU1VUxDQmpZaWs3WEc0Z0lIMHNYRzRnSUhKbGJXOTJaVVJoWjFObGRFeHBjM1JsYm1WeU9pQm1kVzVqZEdsdmJpaGpZaWw3WEc0Z0lDQWdkR2hwY3k1eVpXMXZkbVZNYVhOMFpXNWxjaWhFUVVkZlUwVlVYMFZXUlU1VUxDQmpZaWs3WEc0Z0lIMHNYRzRnSUM4dklFZGxkSFJsY2lCbWIzSWdjbVZ6ZFd4MGN5QjBhR0YwSUdabGRHTm9aWE1nY21WemRXeDBjeUJwWmlCemRHOXlaU0JwY3lCbGJYQjBlVnh1SUNCblpYUlNaWE4xYkhSek9pQm1kVzVqZEdsdmJpZ3BlMXh1SUNBZ0lHbG1JQ2doWDNOMGIzSmxMbkpsYzNWc2RITXBJSHRjYmlBZ0lDQWdJSFZ3WkdGMFpWSmxjM1ZzZEhNb0tUdGNiaUFnSUNBZ0lISmxkSFZ5YmlCdWRXeHNPMXh1SUNBZ0lIMWNiaUFnSUNCeVpYUjFjbTRnWDNOMGIzSmxMbkpsYzNWc2RITXVabWxzZEdWeUtHWjFibU4wYVc5dUtHVnNaVzFsYm5RcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlBb1pXeGxiV1Z1ZEM1dVlXMWxMbWx1WkdWNFQyWW9YM04wYjNKbExuTmxZWEpqYUVacGJIUmxjaWtnSVQwOUlDMHhLVHRjYmlBZ0lDQjlLVHRjYmlBZ2ZTeGNiaUFnTHk4Z1ZISmhibk5wWlc1MElHZGxkSFJsY2lCMGFHRjBJR05oYkdOMWJHRjBaWE1nYUdWaFpHVnljeUJsZG1WeWVTQjBhVzFsWEc0Z0lHZGxkRkpsYzNWc2RFaGxZV1JsY25NNklHWjFibU4wYVc5dUtDbDdYRzRnSUNBZ2FXWWdLRjl6ZEc5eVpTNWtZV2NnSVQwOUlHNTFiR3dwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJiSjNSaGMyc2dibUZ0WlNjc0lGOXpkRzl5WlM1dFpXRnpkWEpsWFR0Y2JpQWdJQ0I5WEc0Z0lDQWdjbVYwZFhKdUlGc25aR0ZuSUc1aGJXVW5MQ0JmYzNSdmNtVXViV1ZoYzNWeVpWMDdYRzVjYmlBZ2ZTeGNiaUFnTHk4Z1ZISmhibk5wWlc1MElHZGxkSFJsY2lCMGFHRjBJR05oYkdOMWJHRjBaWE1nWm1sc2RHVnlJR1JsYzJOeWFYQjBhVzl1SUhOMGNtbHVaMXh1SUNCblpYUkVaWE5qY21sd2RHbHZibE4wY21sdVp6b2dablZ1WTNScGIyNG9LWHRjYmlBZ0lDQnNaWFFnYldWaGMzVnlaVk4wY21sdVp6dGNiaUFnSUNCemQybDBZMmdnS0Y5emRHOXlaUzV0WldGemRYSmxLU0I3WEc0Z0lDQWdJQ0JqWVhObElDZHBieWM2WEc0Z0lDQWdJQ0FnSUcxbFlYTjFjbVZUZEhKcGJtY2dQU0FuY21WaFpDQmhibVFnZDNKcGRHVWdiM0JsY21GMGIzSnBiMjV6Snp0Y2JpQWdJQ0FnSUNBZ1luSmxZV3M3WEc0Z0lDQWdJQ0JqWVhObElDZGpjSFVuT2x4dUlDQWdJQ0FnSUNCdFpXRnpkWEpsVTNSeWFXNW5JRDBnSjNSdmRHRnNJR053ZFNCMGFXMWxJR2x1SUhObFkyOXVaSE1uTzF4dUlDQWdJQ0FnSUNCaWNtVmhhenRjYmlBZ0lDQWdJR05oYzJVZ0oyMWhjSEJsY25Nbk9seHVJQ0FnSUNBZ0lDQnRaV0Z6ZFhKbFUzUnlhVzVuSUQwZ0oyNTFiV0psY2lCdlppQnRZWEJ3WlhKekp6dGNiaUFnSUNBZ0lDQWdZbkpsWVdzN1hHNGdJQ0FnSUNCallYTmxJQ2R5WldSMVkyVnljeWM2WEc0Z0lDQWdJQ0FnSUcxbFlYTjFjbVZUZEhKcGJtY2dQU0FuYm5WdFltVnlJRzltSUhKbFpIVmpaWEp6Snp0Y2JpQWdJQ0FnSUNBZ1luSmxZV3M3WEc0Z0lDQWdmVnh1SUNBZ0lISmxkSFZ5YmlBblFYWmxjbUZuWlNBbklDdGNiaUFnSUNBZ0lHMWxZWE4xY21WVGRISnBibWNnSzF4dUlDQWdJQ0FnSnlCdmRtVnlJSFJvWlNCc1lYTjBJQ2NnSzF4dUlDQWdJQ0FnWDNOMGIzSmxMblJwYldVdWRHOU1iM2RsY2tOaGMyVW9LU0FySUNjdUp6dGNiaUFnZlN4Y2JseHVJQ0F2THlCU1pYUjFjbTRnWVNCaWIyOXNJR0Z6SUhSdklIZG9aWFJvWlhJZ1ptbHNkR1Z5SUhKbGMzVnNkSE1nWVhKbElHUmhaM01nYjNJZ2RHRnphM05jYmlBZ2FYTlRhRzkzYVc1blJHRm5jem9nWm5WdVkzUnBiMjRvS1h0Y2JpQWdJQ0JwWmlBb1gzTjBiM0psTG1SaFp5QTlQVDBnYm5Wc2JDa2dlM0psZEhWeWJpQjBjblZsTzMxY2JpQWdJQ0J5WlhSMWNtNGdabUZzYzJVN1hHNGdJSDFjYmx4dWZTazdYRzVjYmx4dUx5OGdVbVZuYVhOMFpYSWdZMkZzYkdKaFkyc2dkRzhnYUdGdVpHeGxJR0ZzYkNCMWNHUmhkR1Z6WEc1QmNIQkVhWE53WVhSamFHVnlMbkpsWjJsemRHVnlLR1oxYm1OMGFXOXVLR0ZqZEdsdmJpa2dlMXh1SUNCemQybDBZMmdvWVdOMGFXOXVMbUZqZEdsdmJsUjVjR1VwSUh0Y2JpQWdJQ0F2THlCU1lXUnBieUJpZFhSMGIyNXpJR05vWVc1blpXUXNJR1psZEdOb0lHNWxkeUJrWVdjdmRHRnpheUJrWVhSaFhHNGdJQ0FnWTJGelpTQkdhV3gwWlhKRGIyNXpkR0Z1ZEhNdVZWQkVRVlJGWDBaSlRGUkZVanBjYmlBZ0lDQWdJR2xtSUNoaFkzUnBiMjR1YTJWNUlHbHVJRjl6ZEc5eVpTa2dlMXh1SUNBZ0lDQWdJQ0JmYzNSdmNtVmJZV04wYVc5dUxtdGxlVjBnUFNCaFkzUnBiMjR1ZG1Gc2RXVXVkRzlNYjNkbGNrTmhjMlVvS1M1eVpYQnNZV05sS0Njdkp5d25KeWs3WEc0Z0lDQWdJQ0FnSUdsbUlDaGhZM1JwYjI0dWEyVjVJRDA5SUNka1lXY25LU0I3WEc0Z0lDQWdJQ0FnSUNBZ1JtbHNkR1Z5VTNSdmNtVXVaVzFwZENoRVFVZGZVMFZVWDBWV1JVNVVLVHRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNCMWNHUmhkR1ZTWlhOMWJIUnpLQ2s3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdJQ0JsYkhObElHbG1JQ2hoWTNScGIyNHVhMlY1SUQwOUlDZG5jbUZwYmljcElIdGNiaUFnSUNBZ0lDQWdhV1lnS0dGamRHbHZiaTUyWVd4MVpTNTBiMHh2ZDJWeVEyRnpaU2dwSUQwOUlDZGtZV2NuS1NCN1hHNGdJQ0FnSUNBZ0lDQWdYM04wYjNKbExtUmhaeUE5SUc1MWJHdzdYRzRnSUNBZ0lDQWdJQ0FnUkdWMFlXbHNWbWxsZDFOMGIzSmxMbk5sZEVSaFp5aHVkV3hzS1R0Y2JpQWdJQ0FnSUNBZ0lDQjFjR1JoZEdWU1pYTjFiSFJ6S0NrN1hHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lIMWNiaUFnSUNBZ0lHSnlaV0ZyTzF4dUlDQWdJQzh2SUZSb1pTQnpaV0Z5WTJnZ1kyaGhibWRsWkN3Z2NtVm1jbVZ6YUNCMGFHVWdZV05qWlhCMFlXSnNaU0JrWVdjdmRHRnphM05jYmlBZ0lDQmpZWE5sSUVacGJIUmxja052Ym5OMFlXNTBjeTVWVUVSQlZFVmZVMFZCVWtOSU9seHVJQ0FnSUNBZ1gzTjBiM0psTG5ObFlYSmphRVpwYkhSbGNpQTlJR0ZqZEdsdmJpNXpaV0Z5WTJoR2FXeDBaWEk3WEc0Z0lDQWdJQ0JHYVd4MFpYSlRkRzl5WlM1bGJXbDBLRVpKVEZSRlVsOURTRUZPUjBWZlJWWkZUbFFwTzF4dUlDQWdJQ0FnWW5KbFlXczdYRzRnSUNBZ1pHVm1ZWFZzZERwY2JpQWdJQ0FnSUM4dklHNXZJRzl3WEc0Z0lIMWNibjBwTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlFWnBiSFJsY2xOMGIzSmxPMXh1SWwxOSIsIi8vIENoYXJ0LmpzXG4vLyBUaGUgYnJpZGdlIGJldHdlZW4gUmVhY3QgYW5kIEQzXG4vKmpzaGludCBlc25leHQ6IHRydWUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgRGV0YWlsVmlld1N0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL0RldGFpbFZpZXdTdG9yZScpO1xudmFyIGQzQ2hhcnQgPSByZXF1aXJlKCcuL2QzQ2hhcnQuanMnKTtcblxudmFyIENoYXJ0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ0NoYXJ0JyxcblxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4geyBkYXRhOiBEZXRhaWxWaWV3U3RvcmUuZ2V0RGF0YSgpIH07XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHZhciBlbCA9IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMpO1xuICAgIERldGFpbFZpZXdTdG9yZS5hZGREYXRhVXBkYXRlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICAgIGQzQ2hhcnQuY3JlYXRlKGVsKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZFVwZGF0ZSgpIHtcbiAgICBkM0NoYXJ0LnVwZGF0ZSh0aGlzLnN0YXRlLmRhdGEpO1xuICB9LFxuXG4gIF9vbkNoYW5nZTogZnVuY3Rpb24gX29uQ2hhbmdlKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZGF0YTogRGV0YWlsVmlld1N0b3JlLmdldERhdGEoKVxuICAgIH0pO1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICBEZXRhaWxWaWV3U3RvcmUucmVtb3ZlRGF0YVVwZGF0ZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBjbGFzc05hbWU6ICdjaGFydCcgfSk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENoYXJ0O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5bmNtVm5iM0o1WDJadmMzUmxjaTlrWVhSaExXVnVaeTlvYjI1bGVYQnZkQzlrWlhZdmMyTnlhWEIwY3k5MWFTOURhR0Z5ZEM1cWMzZ2lYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqczdPenM3TzBGQlNVRXNTVUZCVFN4bFFVRmxMRWRCUVVjc1QwRkJUeXhEUVVGRExESkNRVUV5UWl4RFFVRkRMRU5CUVVNN1FVRkROMFFzU1VGQlRTeFBRVUZQTEVkQlFVY3NUMEZCVHl4RFFVRkRMR05CUVdNc1EwRkJReXhEUVVGRE96dEJRVVY0UXl4SlFVRk5MRXRCUVVzc1IwRkJSeXhMUVVGTExFTkJRVU1zVjBGQlZ5eERRVUZET3pzN1FVRkZPVUlzYVVKQlFXVXNSVUZCUlN3eVFrRkJWenRCUVVNeFFpeFhRVUZQTEVWQlFVTXNTVUZCU1N4RlFVRkZMR1ZCUVdVc1EwRkJReXhQUVVGUExFVkJRVVVzUlVGQlF5eERRVUZETzBkQlF6RkRPenRCUVVWRUxHMUNRVUZwUWl4RlFVRkZMRFpDUVVGWE8wRkJRelZDTEZGQlFVMHNSVUZCUlN4SFFVRkhMRXRCUVVzc1EwRkJReXhYUVVGWExFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdRVUZEYmtNc2JVSkJRV1VzUTBGQlF5eHhRa0ZCY1VJc1EwRkJReXhKUVVGSkxFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTTdRVUZEZEVRc1YwRkJUeXhEUVVGRExFMUJRVTBzUTBGQlF5eEZRVUZGTEVOQlFVTXNRMEZCUXp0SFFVTndRanM3UVVGRlJDeHZRa0ZCYTBJc1JVRkJSU3c0UWtGQlZ6dEJRVU0zUWl4WFFVRlBMRU5CUVVNc1RVRkJUU3hEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1IwRkRha003TzBGQlJVUXNWMEZCVXl4RlFVRkZMSEZDUVVGWE8wRkJRM0JDTEZGQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNN1FVRkRXaXhWUVVGSkxFVkJRVVVzWlVGQlpTeERRVUZETEU5QlFVOHNSVUZCUlR0TFFVTm9ReXhEUVVGRExFTkJRVU03UjBGRFNqczdRVUZGUkN4elFrRkJiMElzUlVGQlJTeG5RMEZCVnp0QlFVTXZRaXh0UWtGQlpTeERRVUZETEhkQ1FVRjNRaXhEUVVGRExFbEJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXp0SFFVTXhSRHM3UVVGRlJDeFJRVUZOTEVWQlFVVXNhMEpCUVZjN1FVRkRha0lzVjBGRFJTdzJRa0ZCU3l4VFFVRlRMRVZCUVVNc1QwRkJUeXhIUVVGUExFTkJRemRDTzBkQlEwZzdRMEZEUml4RFFVRkRMRU5CUVVNN08wRkJSVWdzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4TFFVRkxMRU5CUVVNaUxDSm1hV3hsSWpvaUwxVnpaWEp6TDJkeVpXZHZjbmxmWm05emRHVnlMMlJoZEdFdFpXNW5MMmh2Ym1WNWNHOTBMMlJsZGk5elkzSnBjSFJ6TDNWcEwwTm9ZWEowTG1wemVDSXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaTh2SUVOb1lYSjBMbXB6WEc0dkx5QlVhR1VnWW5KcFpHZGxJR0psZEhkbFpXNGdVbVZoWTNRZ1lXNWtJRVF6WEc0dkttcHphR2x1ZENCbGMyNWxlSFE2SUhSeWRXVWdLaTljYmlCY2JtTnZibk4wSUVSbGRHRnBiRlpwWlhkVGRHOXlaU0E5SUhKbGNYVnBjbVVvSnk0dUwzTjBiM0psY3k5RVpYUmhhV3hXYVdWM1UzUnZjbVVuS1R0Y2JtTnZibk4wSUdRelEyaGhjblFnUFNCeVpYRjFhWEpsS0NjdUwyUXpRMmhoY25RdWFuTW5LVHRjYmx4dVkyOXVjM1FnUTJoaGNuUWdQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEc0Z0lGeHVJQ0JuWlhSSmJtbDBhV0ZzVTNSaGRHVTZJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQjdaR0YwWVRvZ1JHVjBZV2xzVm1sbGQxTjBiM0psTG1kbGRFUmhkR0VvS1gwN1hHNGdJSDBzWEc1Y2JpQWdZMjl0Y0c5dVpXNTBSR2xrVFc5MWJuUTZJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQWdJR052Ym5OMElHVnNJRDBnVW1WaFkzUXVabWx1WkVSUFRVNXZaR1VvZEdocGN5azdYRzRnSUNBZ1JHVjBZV2xzVm1sbGQxTjBiM0psTG1Ga1pFUmhkR0ZWY0dSaGRHVk1hWE4wWlc1bGNpaDBhR2x6TGw5dmJrTm9ZVzVuWlNrN1hHNGdJQ0FnWkRORGFHRnlkQzVqY21WaGRHVW9aV3dwTzF4dUlDQjlMRnh1WEc0Z0lHTnZiWEJ2Ym1WdWRFUnBaRlZ3WkdGMFpUb2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdaRE5EYUdGeWRDNTFjR1JoZEdVb2RHaHBjeTV6ZEdGMFpTNWtZWFJoS1R0Y2JpQWdmU3hjYmx4dUlDQmZiMjVEYUdGdVoyVTZJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQWdJSFJvYVhNdWMyVjBVM1JoZEdVb2UxeHVJQ0FnSUNBZ1pHRjBZVG9nUkdWMFlXbHNWbWxsZDFOMGIzSmxMbWRsZEVSaGRHRW9LVnh1SUNBZ0lIMHBPMXh1SUNCOUxGeHVYRzRnSUdOdmJYQnZibVZ1ZEZkcGJHeFZibTF2ZFc1ME9pQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQkVaWFJoYVd4V2FXVjNVM1J2Y21VdWNtVnRiM1psUkdGMFlWVndaR0YwWlV4cGMzUmxibVZ5S0hSb2FYTXVYMjl1UTJoaGJtZGxLVHRjYmlBZ2ZTeGNibHh1SUNCeVpXNWtaWEk2SUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMG5ZMmhoY25RblBqd3ZaR2wyUGx4dUlDQWdJQ2s3WEc0Z0lIMWNibjBwTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlFTm9ZWEowTzF4dUlsMTkiLCIvKmpzaGludCBlc25leHQ6IHRydWUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgRGV0YWlsVmlld1N0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL0RldGFpbFZpZXdTdG9yZScpO1xudmFyIERldGFpbFZpZXdBY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9EZXRhaWxWaWV3QWN0aW9ucycpO1xuXG52YXIgRGV0YWlsVGV4dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdEZXRhaWxUZXh0JyxcblxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4gRGV0YWlsVmlld1N0b3JlLmdldFN0b3JlKCk7XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIERldGFpbFZpZXdTdG9yZS5hZGREYXRhVXBkYXRlTGlzdGVuZXIodGhpcy5fb25NZXRhZGF0YUNoYW5nZSk7XG4gICAgRGV0YWlsVmlld1N0b3JlLmFkZEZvY3VzVXBkYXRlTGlzdGVuZXIodGhpcy5fb25Gb2N1c0NoYW5nZSk7XG4gICAgRGV0YWlsVmlld1N0b3JlLmFkZE1lYXN1cmVDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbk1lYXN1cmVDaGFuZ2UpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZFVubW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZFVubW91bnQoKSB7XG4gICAgRGV0YWlsVmlld1N0b3JlLnJlbW92ZURhdGFVcGRhdGVMaXN0ZW5lcih0aGlzLl9vbk1ldGFkYXRhQ2hhbmdlKTtcbiAgICBEZXRhaWxWaWV3U3RvcmUucmVtb3ZlRm9jdXNVcGRhdGVMaXN0ZW5lcih0aGlzLl9vbkZvY3VzQ2hhbmdlKTtcbiAgICBEZXRhaWxWaWV3U3RvcmUucmVtb3ZlTWVhc3VyZUNoYW5nZUxpc3RlbmVyKHRoaXMuX29uTWVhc3VyZUNoYW5nZSk7XG4gIH0sXG5cbiAgX29uRm9jdXNDaGFuZ2U6IGZ1bmN0aW9uIF9vbkZvY3VzQ2hhbmdlKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZm9jdXNWYWx1ZTogRGV0YWlsVmlld1N0b3JlLmdldEZvY3VzVmFsdWUoKSxcbiAgICAgIGZvY3VzRGF0ZTogRGV0YWlsVmlld1N0b3JlLmdldEZvY3VzRGF0ZSgpXG4gICAgfSk7XG4gIH0sXG5cbiAgX29uTWVhc3VyZUNoYW5nZTogZnVuY3Rpb24gX29uTWVhc3VyZUNoYW5nZSgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG1lYXN1cmU6IERldGFpbFZpZXdTdG9yZS5nZXRNZWFzdXJlKClcbiAgICB9KTtcbiAgfSxcblxuICBfb25NZXRhZGF0YUNoYW5nZTogZnVuY3Rpb24gX29uTWV0YWRhdGFDaGFuZ2UoKSB7XG4gICAgdmFyIGRldGFpbHMgPSBEZXRhaWxWaWV3U3RvcmUuZ2V0RGV0YWlscygpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbmFtZTogZGV0YWlscy5uYW1lLFxuICAgICAgb3duZXI6IGRldGFpbHMub3duZXJcbiAgICB9KTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgZm9jdXNEYXRlID0gRGV0YWlsVmlld1N0b3JlLmdldEZvY3VzRGF0ZSgpO1xuICAgIHZhciBmb3JtYXR0ZWRGb2N1c0RhdGUgPSBcIlwiO1xuICAgIGlmIChmb2N1c0RhdGUpIHtcbiAgICAgIGZvcm1hdHRlZEZvY3VzRGF0ZSA9IGZvY3VzRGF0ZS5nZXRNb250aCgpICsgMSArICcvJyArIGZvY3VzRGF0ZS5nZXREYXRlKCkgKyAnLycgKyBmb2N1c0RhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICB9XG4gICAgdmFyIG51bWJlckZvcm1hdHRlciA9IGQzLmZvcm1hdCgnLjNzJyk7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnZGl2JyxcbiAgICAgIHsgY2xhc3NOYW1lOiAnZGV0YWlsVGV4dCcgfSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdkaXYnLFxuICAgICAgICB7IGNsYXNzTmFtZTogJ3RpdGxlUm93JyB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdoMScsXG4gICAgICAgICAgeyBjbGFzc05hbWU6ICdjdXJJZCcgfSxcbiAgICAgICAgICB0aGlzLnN0YXRlLm5hbWVcbiAgICAgICAgKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnaDEnLFxuICAgICAgICAgIHsgY2xhc3NOYW1lOiAnbWVhc3VyZScgfSxcbiAgICAgICAgICB0aGlzLnN0YXRlLm1lYXN1cmVcbiAgICAgICAgKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnaDEnLFxuICAgICAgICAgIHsgY2xhc3NOYW1lOiAnZm9jdXNWYWwnIH0sXG4gICAgICAgICAgbnVtYmVyRm9ybWF0dGVyKHRoaXMuc3RhdGUuZm9jdXNWYWx1ZSlcbiAgICAgICAgKVxuICAgICAgKSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgY2xhc3NOYW1lOiAnZGl2aWRlcicgfSksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdpbmZvUm93JyB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdwJyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ293bmVyJyB9LFxuICAgICAgICAgIHRoaXMuc3RhdGUub3duZXJcbiAgICAgICAgKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAncCcsXG4gICAgICAgICAgeyBjbGFzc05hbWU6ICdmb2N1c0RhdGUnIH0sXG4gICAgICAgICAgZm9ybWF0dGVkRm9jdXNEYXRlXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBEZXRhaWxUZXh0O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5bmNtVm5iM0o1WDJadmMzUmxjaTlrWVhSaExXVnVaeTlvYjI1bGVYQnZkQzlrWlhZdmMyTnlhWEIwY3k5MWFTOUVaWFJoYVd4VVpYaDBMbXB6ZUNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN08wRkJSVUVzU1VGQlRTeGxRVUZsTEVkQlFVY3NUMEZCVHl4RFFVRkRMREpDUVVFeVFpeERRVUZETEVOQlFVTTdRVUZETjBRc1NVRkJUU3hwUWtGQmFVSXNSMEZCUnl4UFFVRlBMRU5CUVVNc09FSkJRVGhDTEVOQlFVTXNRMEZCUXpzN1FVRkZiRVVzU1VGQlRTeFZRVUZWTEVkQlFVY3NTMEZCU3l4RFFVRkRMRmRCUVZjc1EwRkJRenM3TzBGQlJXNURMR2xDUVVGbExFVkJRVVVzTWtKQlFWYzdRVUZETVVJc1YwRkJUeXhsUVVGbExFTkJRVU1zVVVGQlVTeEZRVUZGTEVOQlFVTTdSMEZEYmtNN08wRkJSVVFzYlVKQlFXbENMRVZCUVVVc05rSkJRVmM3UVVGRE5VSXNiVUpCUVdVc1EwRkRXaXh4UWtGQmNVSXNRMEZCUXl4SlFVRkpMRU5CUVVNc2FVSkJRV2xDTEVOQlFVTXNRMEZCUXp0QlFVTnFSQ3h0UWtGQlpTeERRVU5hTEhOQ1FVRnpRaXhEUVVGRExFbEJRVWtzUTBGQlF5eGpRVUZqTEVOQlFVTXNRMEZCUXp0QlFVTXZReXh0UWtGQlpTeERRVU5hTEhkQ1FVRjNRaXhEUVVGRExFbEJRVWtzUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhEUVVGRE8wZEJRM0JFT3p0QlFVVkVMSEZDUVVGdFFpeEZRVUZGTEN0Q1FVRlhPMEZCUXpsQ0xHMUNRVUZsTEVOQlExb3NkMEpCUVhkQ0xFTkJRVU1zU1VGQlNTeERRVUZETEdsQ1FVRnBRaXhEUVVGRExFTkJRVU03UVVGRGNFUXNiVUpCUVdVc1EwRkRXaXg1UWtGQmVVSXNRMEZCUXl4SlFVRkpMRU5CUVVNc1kwRkJZeXhEUVVGRExFTkJRVU03UVVGRGJFUXNiVUpCUVdVc1EwRkRXaXd5UWtGQk1rSXNRMEZCUXl4SlFVRkpMRU5CUVVNc1owSkJRV2RDTEVOQlFVTXNRMEZCUXp0SFFVTjJSRHM3UVVGRlJDeG5Ra0ZCWXl4RlFVRkZMREJDUVVGVk8wRkJRM2hDTEZGQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNN1FVRkRXaXhuUWtGQlZTeEZRVUZETEdWQlFXVXNRMEZCUXl4aFFVRmhMRVZCUVVVN1FVRkRNVU1zWlVGQlV5eEZRVUZETEdWQlFXVXNRMEZCUXl4WlFVRlpMRVZCUVVVN1MwRkRla01zUTBGQlF5eERRVUZETzBkQlEwbzdPMEZCUlVRc2EwSkJRV2RDTEVWQlFVVXNORUpCUVZVN1FVRkRNVUlzVVVGQlNTeERRVUZETEZGQlFWRXNRMEZCUXp0QlFVTmFMR0ZCUVU4c1JVRkJReXhsUVVGbExFTkJRVU1zVlVGQlZTeEZRVUZGTzB0QlEzSkRMRU5CUVVNc1EwRkJRenRIUVVOS096dEJRVVZFTEcxQ1FVRnBRaXhGUVVGRkxEWkNRVUZWTzBGQlF6TkNMRkZCUVUwc1QwRkJUeXhIUVVGSExHVkJRV1VzUTBGQlF5eFZRVUZWTEVWQlFVVXNRMEZCUXp0QlFVTTNReXhSUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETzBGQlExb3NWVUZCU1N4RlFVRkZMRTlCUVU4c1EwRkJReXhKUVVGSk8wRkJRMnhDTEZkQlFVc3NSVUZCUlN4UFFVRlBMRU5CUVVNc1MwRkJTenRMUVVOeVFpeERRVUZETEVOQlFVTTdSMEZEU2pzN1FVRkZSQ3hSUVVGTkxFVkJRVVVzYTBKQlFWYzdRVUZEYWtJc1VVRkJUU3hUUVVGVExFZEJRVWNzWlVGQlpTeERRVUZETEZsQlFWa3NSVUZCUlN4RFFVRkRPMEZCUTJwRUxGRkJRVWtzYTBKQlFXdENMRWRCUVVjc1JVRkJSU3hEUVVGRE8wRkJRelZDTEZGQlFVa3NVMEZCVXl4RlFVRkZPMEZCUTJJc2QwSkJRV3RDTEVkQlFVY3NRVUZCUXl4VFFVRlRMRU5CUVVNc1VVRkJVU3hGUVVGRkxFZEJRVWNzUTBGQlF5eEhRVU01UXl4SFFVRkhMRWRCUVVjc1UwRkJVeXhEUVVGRExFOUJRVThzUlVGQlJTeEhRVU42UWl4SFFVRkhMRWRCUVVjc1UwRkJVeXhEUVVGRExGZEJRVmNzUlVGQlJTeERRVUZETzB0QlF5OUNPMEZCUTBRc1VVRkJUU3hsUVVGbExFZEJRVWNzUlVGQlJTeERRVUZETEUxQlFVMHNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenRCUVVONlF5eFhRVU5GT3p0UlFVRkxMRk5CUVZNc1JVRkJReXhaUVVGWk8wMUJRM3BDT3p0VlFVRkxMRk5CUVZNc1JVRkJReXhWUVVGVk8xRkJRM1pDT3p0WlFVRkpMRk5CUVZNc1JVRkJReXhQUVVGUE8xVkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4SlFVRkpPMU5CUVUwN1VVRkROVU03TzFsQlFVa3NVMEZCVXl4RlFVRkRMRk5CUVZNN1ZVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVODdVMEZCVFR0UlFVTnFSRHM3V1VGQlNTeFRRVUZUTEVWQlFVTXNWVUZCVlR0VlFVRkZMR1ZCUVdVc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZWQlFWVXNRMEZCUXp0VFFVRk5PMDlCUTJ4Rk8wMUJRMDRzTmtKQlFVc3NVMEZCVXl4RlFVRkRMRk5CUVZNc1IwRkJUenROUVVNdlFqczdWVUZCU3l4VFFVRlRMRVZCUVVNc1UwRkJVenRSUVVOMFFqczdXVUZCUnl4VFFVRlRMRVZCUVVNc1QwRkJUenRWUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTMEZCU3p0VFFVRkxPMUZCUXpORE96dFpRVUZITEZOQlFWTXNSVUZCUXl4WFFVRlhPMVZCUTNKQ0xHdENRVUZyUWp0VFFVTnFRanRQUVVOQk8wdEJRMFlzUTBGRFRqdEhRVU5JTzBOQlEwWXNRMEZCUXl4RFFVRkRPenRCUVVkSUxFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NWVUZCVlN4RFFVRkRJaXdpWm1sc1pTSTZJaTlWYzJWeWN5OW5jbVZuYjNKNVgyWnZjM1JsY2k5a1lYUmhMV1Z1Wnk5b2IyNWxlWEJ2ZEM5a1pYWXZjMk55YVhCMGN5OTFhUzlFWlhSaGFXeFVaWGgwTG1wemVDSXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaThxYW5Ob2FXNTBJR1Z6Ym1WNGREb2dkSEoxWlNBcUwxeHVYRzVqYjI1emRDQkVaWFJoYVd4V2FXVjNVM1J2Y21VZ1BTQnlaWEYxYVhKbEtDY3VMaTl6ZEc5eVpYTXZSR1YwWVdsc1ZtbGxkMU4wYjNKbEp5azdYRzVqYjI1emRDQkVaWFJoYVd4V2FXVjNRV04wYVc5dWN5QTlJSEpsY1hWcGNtVW9KeTR1TDJGamRHbHZibk12UkdWMFlXbHNWbWxsZDBGamRHbHZibk1uS1R0Y2JseHVZMjl1YzNRZ1JHVjBZV2xzVkdWNGRDQTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjYmx4dUlDQm5aWFJKYm1sMGFXRnNVM1JoZEdVNklHWjFibU4wYVc5dUtDa2dlMXh1SUNBZ0lISmxkSFZ5YmlCRVpYUmhhV3hXYVdWM1UzUnZjbVV1WjJWMFUzUnZjbVVvS1RzZ1hHNGdJSDBzWEc1Y2JpQWdZMjl0Y0c5dVpXNTBSR2xrVFc5MWJuUTZJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQWdJRVJsZEdGcGJGWnBaWGRUZEc5eVpWeHVJQ0FnSUNBZ0xtRmtaRVJoZEdGVmNHUmhkR1ZNYVhOMFpXNWxjaWgwYUdsekxsOXZiazFsZEdGa1lYUmhRMmhoYm1kbEtUc2dYRzRnSUNBZ1JHVjBZV2xzVm1sbGQxTjBiM0psWEc0Z0lDQWdJQ0F1WVdSa1JtOWpkWE5WY0dSaGRHVk1hWE4wWlc1bGNpaDBhR2x6TGw5dmJrWnZZM1Z6UTJoaGJtZGxLVHNnWEc0Z0lDQWdSR1YwWVdsc1ZtbGxkMU4wYjNKbFhHNGdJQ0FnSUNBdVlXUmtUV1ZoYzNWeVpVTm9ZVzVuWlV4cGMzUmxibVZ5S0hSb2FYTXVYMjl1VFdWaGMzVnlaVU5vWVc1blpTazdJRnh1SUNCOUxGeHVYRzRnSUdOdmJYQnZibVZ1ZEVScFpGVnViVzkxYm5RNklHWjFibU4wYVc5dUtDa2dlMXh1SUNBZ0lFUmxkR0ZwYkZacFpYZFRkRzl5WlZ4dUlDQWdJQ0FnTG5KbGJXOTJaVVJoZEdGVmNHUmhkR1ZNYVhOMFpXNWxjaWgwYUdsekxsOXZiazFsZEdGa1lYUmhRMmhoYm1kbEtUc2dYRzRnSUNBZ1JHVjBZV2xzVm1sbGQxTjBiM0psWEc0Z0lDQWdJQ0F1Y21WdGIzWmxSbTlqZFhOVmNHUmhkR1ZNYVhOMFpXNWxjaWgwYUdsekxsOXZia1p2WTNWelEyaGhibWRsS1RzZ1hHNGdJQ0FnUkdWMFlXbHNWbWxsZDFOMGIzSmxYRzRnSUNBZ0lDQXVjbVZ0YjNabFRXVmhjM1Z5WlVOb1lXNW5aVXhwYzNSbGJtVnlLSFJvYVhNdVgyOXVUV1ZoYzNWeVpVTm9ZVzVuWlNrN0lGeHVJQ0I5TEZ4dVhHNGdJRjl2YmtadlkzVnpRMmhoYm1kbE9pQm1kVzVqZEdsdmJpZ3BlMXh1SUNBZ0lIUm9hWE11YzJWMFUzUmhkR1VvZTF4dUlDQWdJQ0FnWm05amRYTldZV3gxWlRwRVpYUmhhV3hXYVdWM1UzUnZjbVV1WjJWMFJtOWpkWE5XWVd4MVpTZ3BMRnh1SUNBZ0lDQWdabTlqZFhORVlYUmxPa1JsZEdGcGJGWnBaWGRUZEc5eVpTNW5aWFJHYjJOMWMwUmhkR1VvS1Z4dUlDQWdJSDBwTzF4dUlDQjlMRnh1WEc0Z0lGOXZiazFsWVhOMWNtVkRhR0Z1WjJVNklHWjFibU4wYVc5dUtDbDdYRzRnSUNBZ2RHaHBjeTV6WlhSVGRHRjBaU2g3WEc0Z0lDQWdJQ0J0WldGemRYSmxPa1JsZEdGcGJGWnBaWGRUZEc5eVpTNW5aWFJOWldGemRYSmxLQ2xjYmlBZ0lDQjlLVHRjYmlBZ2ZTeGNibHh1SUNCZmIyNU5aWFJoWkdGMFlVTm9ZVzVuWlRvZ1puVnVZM1JwYjI0b0tYdGNiaUFnSUNCamIyNXpkQ0JrWlhSaGFXeHpJRDBnUkdWMFlXbHNWbWxsZDFOMGIzSmxMbWRsZEVSbGRHRnBiSE1vS1R0Y2JpQWdJQ0IwYUdsekxuTmxkRk4wWVhSbEtIdGNiaUFnSUNBZ0lHNWhiV1U2SUdSbGRHRnBiSE11Ym1GdFpTeGNiaUFnSUNBZ0lHOTNibVZ5T2lCa1pYUmhhV3h6TG05M2JtVnlYRzRnSUNBZ2ZTazdYRzRnSUgwc1hHNWNiaUFnY21WdVpHVnlPaUJtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0JqYjI1emRDQm1iMk4xYzBSaGRHVWdQU0JFWlhSaGFXeFdhV1YzVTNSdmNtVXVaMlYwUm05amRYTkVZWFJsS0NrN1hHNGdJQ0FnYkdWMElHWnZjbTFoZEhSbFpFWnZZM1Z6UkdGMFpTQTlJRndpWENJN1hHNGdJQ0FnYVdZZ0tHWnZZM1Z6UkdGMFpTa2dlMXh1SUNBZ0lDQWdabTl5YldGMGRHVmtSbTlqZFhORVlYUmxJRDBnS0dadlkzVnpSR0YwWlM1blpYUk5iMjUwYUNncElDc2dNU2tnS3lCY2JpQWdJQ0FnSUNjdkp5QXJJR1p2WTNWelJHRjBaUzVuWlhSRVlYUmxLQ2tnS3lCY2JpQWdJQ0FnSUNjdkp5QXJJR1p2WTNWelJHRjBaUzVuWlhSR2RXeHNXV1ZoY2lncE8xeHVJQ0FnSUgxY2JpQWdJQ0JqYjI1emRDQnVkVzFpWlhKR2IzSnRZWFIwWlhJZ1BTQmtNeTVtYjNKdFlYUW9KeTR6Y3ljcE8xeHVJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMG5aR1YwWVdsc1ZHVjRkQ2MrWEc0Z0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQU2QwYVhSc1pWSnZkeWMrWEc0Z0lDQWdJQ0FnSUNBZ1BHZ3hJR05zWVhOelRtRnRaVDBuWTNWeVNXUW5QbnQwYUdsekxuTjBZWFJsTG01aGJXVjlQQzlvTVQ1Y2JpQWdJQ0FnSUNBZ0lDQThhREVnWTJ4aGMzTk9ZVzFsUFNkdFpXRnpkWEpsSno1N2RHaHBjeTV6ZEdGMFpTNXRaV0Z6ZFhKbGZUd3ZhREUrWEc0Z0lDQWdJQ0FnSUNBZ1BHZ3hJR05zWVhOelRtRnRaVDBuWm05amRYTldZV3duUG50dWRXMWlaWEpHYjNKdFlYUjBaWElvZEdocGN5NXpkR0YwWlM1bWIyTjFjMVpoYkhWbEtYMDhMMmd4UGx4dUlDQWdJQ0FnSUNBOEwyUnBkajVjYmlBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlKMlJwZG1sa1pYSW5Qand2WkdsMlBseHVJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQwbmFXNW1iMUp2ZHljK1hHNGdJQ0FnSUNBZ0lDQWdQSEFnWTJ4aGMzTk9ZVzFsUFNkdmQyNWxjaWMrZTNSb2FYTXVjM1JoZEdVdWIzZHVaWEo5UEM5d1BseHVJQ0FnSUNBZ0lDQWdJRHh3SUdOc1lYTnpUbUZ0WlQwblptOWpkWE5FWVhSbEp6NWNiaUFnSUNBZ0lDQWdJQ0FnSUh0bWIzSnRZWFIwWldSR2IyTjFjMFJoZEdWOVhHNGdJQ0FnSUNBZ0lDQWdQQzl3UGx4dUlDQWdJQ0FnSUNBOEwyUnBkajVjYmlBZ0lDQWdJRHd2WkdsMlBseHVJQ0FnSUNrN1hHNGdJSDFjYm4wcE8xeHVYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnUkdWMFlXbHNWR1Y0ZER0Y2JpSmRmUT09IiwiLypqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIENoYXJ0ID0gcmVxdWlyZSgnLi9DaGFydC5qc3gnKTtcbnZhciBNZWFzdXJlUm93ID0gcmVxdWlyZSgnLi9NZWFzdXJlUm93LmpzeCcpO1xuXG52YXIgRGV0YWlsVmlldyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdEZXRhaWxWaWV3JyxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICdkaXYnLFxuICAgICAgeyBjbGFzc05hbWU6ICdkZXRhaWxWaWV3JyB9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNZWFzdXJlUm93LCB7IG5hbWU6ICdtZWFzdXJlJywgbGFiZWxzOiBbJ0kvTycsICdDUFUnLCAnTWFwcGVycycsICdSZWR1Y2VycyddIH0pLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDaGFydCwgbnVsbClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBEZXRhaWxWaWV3O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5bmNtVm5iM0o1WDJadmMzUmxjaTlrWVhSaExXVnVaeTlvYjI1bGVYQnZkQzlrWlhZdmMyTnlhWEIwY3k5MWFTOUVaWFJoYVd4V2FXVjNMbXB6ZUNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pT3pzN08wRkJSVUVzU1VGQlRTeExRVUZMTEVkQlFVY3NUMEZCVHl4RFFVRkRMR0ZCUVdFc1EwRkJReXhEUVVGRE8wRkJRM0pETEVsQlFVMHNWVUZCVlN4SFFVRkhMRTlCUVU4c1EwRkJReXhyUWtGQmEwSXNRMEZCUXl4RFFVRkRPenRCUVVVdlF5eEpRVUZOTEZWQlFWVXNSMEZCUnl4TFFVRkxMRU5CUVVNc1YwRkJWeXhEUVVGRE96czdRVUZEYmtNc1VVRkJUU3hGUVVGRkxHdENRVUZYTzBGQlEycENMRmRCUTBVN08xRkJRVXNzVTBGQlV5eEZRVUZETEZsQlFWazdUVUZEZWtJc2IwSkJRVU1zVlVGQlZTeEpRVUZETEVsQlFVa3NSVUZCUXl4VFFVRlRMRVZCUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU1zUzBGQlN5eEZRVUZETEV0QlFVc3NSVUZCUXl4VFFVRlRMRVZCUVVNc1ZVRkJWU3hEUVVGRExFRkJRVU1zUjBGQlJ6dE5RVU42UlN4dlFrRkJReXhMUVVGTExFOUJRVWM3UzBGRFRDeERRVU5PTzBkQlEwZzdRMEZEUml4RFFVRkRMRU5CUVVNN08wRkJSVWdzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4VlFVRlZMRU5CUVVNaUxDSm1hV3hsSWpvaUwxVnpaWEp6TDJkeVpXZHZjbmxmWm05emRHVnlMMlJoZEdFdFpXNW5MMmh2Ym1WNWNHOTBMMlJsZGk5elkzSnBjSFJ6TDNWcEwwUmxkR0ZwYkZacFpYY3Vhbk40SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUx5cHFjMmhwYm5RZ1pYTnVaWGgwT2lCMGNuVmxJQ292WEc1Y2JtTnZibk4wSUVOb1lYSjBJRDBnY21WeGRXbHlaU2duTGk5RGFHRnlkQzVxYzNnbktUdGNibU52Ym5OMElFMWxZWE4xY21WU2IzY2dQU0J5WlhGMWFYSmxLQ2N1TDAxbFlYTjFjbVZTYjNjdWFuTjRKeWs3WEc1Y2JtTnZibk4wSUVSbGRHRnBiRlpwWlhjZ1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBTZGtaWFJoYVd4V2FXVjNKejVjYmlBZ0lDQWdJQ0FnUEUxbFlYTjFjbVZTYjNjZ2JtRnRaVDBuYldWaGMzVnlaU2NnYkdGaVpXeHpQWHRiSjBrdlR5Y3NKME5RVlNjc0owMWhjSEJsY25NbkxDZFNaV1IxWTJWeWN5ZGRmU0F2UGx4dUlDQWdJQ0FnSUNBOFEyaGhjblFnTHo1Y2JpQWdJQ0FnSUR3dlpHbDJQbHh1SUNBZ0lDazdYRzRnSUgxY2JuMHBPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUVSbGRHRnBiRlpwWlhjN1hHNGlYWDA9IiwiLypqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgRmlsdGVyQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogXCJGaWx0ZXJCdXR0b25cIixcblxuICBwcm9wVHlwZXM6IHtcbiAgICBsYWJlbDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGhhbmRsZXI6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgIFwiYnV0dG9uXCIsXG4gICAgICB7IG9uQ2xpY2s6IHRoaXMucHJvcHMuaGFuZGxlciwgY2xhc3NOYW1lOiB0aGlzLnByb3BzLmNsYXNzTmFtZSB9LFxuICAgICAgdGhpcy5wcm9wcy5sYWJlbFxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZpbHRlckJ1dHRvbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OW5jbVZuYjNKNVgyWnZjM1JsY2k5a1lYUmhMV1Z1Wnk5b2IyNWxlWEJ2ZEM5a1pYWXZjMk55YVhCMGN5OTFhUzlHYVd4MFpYSkNkWFIwYjI0dWFuTjRJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdPenM3UVVGRlFTeEpRVUZOTEZsQlFWa3NSMEZCUnl4TFFVRkxMRU5CUVVNc1YwRkJWeXhEUVVGRE96czdRVUZGY2tNc1YwRkJVeXhGUVVGRk8wRkJRMVFzVTBGQlN5eEZRVUZGTEV0QlFVc3NRMEZCUXl4VFFVRlRMRU5CUVVNc1RVRkJUU3hEUVVGRExGVkJRVlU3UVVGRGVFTXNWMEZCVHl4RlFVRkZMRXRCUVVzc1EwRkJReXhUUVVGVExFTkJRVU1zU1VGQlNTeERRVUZETEZWQlFWVTdSMEZEZWtNN08wRkJSVVFzVVVGQlRTeEZRVUZGTEd0Q1FVRlhPMEZCUTJwQ0xGZEJRMFU3TzFGQlFWRXNUMEZCVHl4RlFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVDBGQlR5eEJRVUZETEVWQlFVTXNVMEZCVXl4RlFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVTBGQlV5eEJRVUZETzAxQlEyeEZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUzBGQlN6dExRVU5XTEVOQlExUTdSMEZEU0R0RFFVTkdMRU5CUVVNc1EwRkJRenM3UVVGRlNDeE5RVUZOTEVOQlFVTXNUMEZCVHl4SFFVRkhMRmxCUVZrc1EwRkJReUlzSW1acGJHVWlPaUl2VlhObGNuTXZaM0psWjI5eWVWOW1iM04wWlhJdlpHRjBZUzFsYm1jdmFHOXVaWGx3YjNRdlpHVjJMM05qY21sd2RITXZkV2t2Um1sc2RHVnlRblYwZEc5dUxtcHplQ0lzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWk4cWFuTm9hVzUwSUdWemJtVjRkRG9nZEhKMVpTQXFMMXh1WEc1amIyNXpkQ0JHYVd4MFpYSkNkWFIwYjI0Z1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYRzVjYmlBZ2NISnZjRlI1Y0dWek9pQjdYRzRnSUNBZ2JHRmlaV3c2SUZKbFlXTjBMbEJ5YjNCVWVYQmxjeTV6ZEhKcGJtY3VhWE5TWlhGMWFYSmxaQ3hjYmlBZ0lDQm9ZVzVrYkdWeU9pQlNaV0ZqZEM1UWNtOXdWSGx3WlhNdVpuVnVZeTVwYzFKbGNYVnBjbVZrTEZ4dUlDQjlMRnh1WEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUNoY2JpQWdJQ0FnSUR4aWRYUjBiMjRnYjI1RGJHbGphejE3ZEdocGN5NXdjbTl3Y3k1b1lXNWtiR1Z5ZlNCamJHRnpjMDVoYldVOWUzUm9hWE11Y0hKdmNITXVZMnhoYzNOT1lXMWxmVDVjYmlBZ0lDQWdJQ0FnZTNSb2FYTXVjSEp2Y0hNdWJHRmlaV3g5WEc0Z0lDQWdJQ0E4TDJKMWRIUnZiajVjYmlBZ0lDQXBPMXh1SUNCOVhHNTlLVHRjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCR2FXeDBaWEpDZFhSMGIyNDdYRzRpWFgwPSIsIi8vIEZJTFRFUk9QVElPTlJPV1xuLypqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIEZpbHRlckFjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL0ZpbHRlckFjdGlvbnMnKTtcbnZhciBGaWx0ZXJCdXR0b24gPSByZXF1aXJlKCcuL0ZpbHRlckJ1dHRvbi5qc3gnKTtcblxudmFyIEZpbHRlck9wdGlvblJvdyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdGaWx0ZXJPcHRpb25Sb3cnLFxuXG4gIHByb3BUeXBlczoge1xuICAgIG5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBsYWJlbHM6IFJlYWN0LlByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkXG4gIH0sXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIHsgc2VsZWN0ZWQ6IDAgfTtcbiAgfSxcblxuICBoYW5kbGVDbGljazogZnVuY3Rpb24gaGFuZGxlQ2xpY2soaW5kZXgpIHtcbiAgICBpZiAoaW5kZXggIT0gdGhpcy5zdGF0ZS5zZWxlY3RlZCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNlbGVjdGVkOiBpbmRleCB9KTtcbiAgICAgIEZpbHRlckFjdGlvbnMudXBkYXRlRmlsdGVyKHRoaXMucHJvcHMubmFtZSwgdGhpcy5wcm9wcy5sYWJlbHNbaW5kZXhdKTtcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIHNwYW4gPSB1bmRlZmluZWQ7XG5cbiAgICBzd2l0Y2ggKHRoaXMucHJvcHMubGFiZWxzLmxlbmd0aCkge1xuICAgICAgY2FzZSAyOlxuICAgICAgICBzcGFuID0gJ2hhbGYnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgc3BhbiA9ICd0aGlyZCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA0OlxuICAgICAgICBzcGFuID0gJ3F1YXJ0ZXInO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAnZGl2JyxcbiAgICAgIHsgY2xhc3NOYW1lOiAnZmlsdGVyT3B0aW9uUm93JyB9LFxuICAgICAgdGhpcy5wcm9wcy5sYWJlbHMubWFwKGZ1bmN0aW9uIChjdXJMYWJlbCwgaSkge1xuICAgICAgICB2YXIgc2VsZWN0ZWQgPSBpID09IHRoaXMuc3RhdGUuc2VsZWN0ZWQgPyAnc2VsZWN0ZWQnIDogJ2Rlc2VsZWN0ZWQnO1xuXG4gICAgICAgIHZhciBwcm9wcyA9IHtcbiAgICAgICAgICBsYWJlbDogY3VyTGFiZWwsXG4gICAgICAgICAgaGFuZGxlcjogdGhpcy5oYW5kbGVDbGljay5iaW5kKHRoaXMsIGkpLFxuICAgICAgICAgIGNsYXNzTmFtZTogJ2ZpbHRlckJ1dHRvbicgKyAnICcgKyBzcGFuICsgJyAnICsgc2VsZWN0ZWRcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRmlsdGVyQnV0dG9uLCBwcm9wcyk7XG4gICAgICB9LCB0aGlzKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZpbHRlck9wdGlvblJvdztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OW5jbVZuYjNKNVgyWnZjM1JsY2k5a1lYUmhMV1Z1Wnk5b2IyNWxlWEJ2ZEM5a1pYWXZjMk55YVhCMGN5OTFhUzlHYVd4MFpYSlBjSFJwYjI1U2IzY3Vhbk40SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN08wRkJSMEVzU1VGQlRTeGhRVUZoTEVkQlFVY3NUMEZCVHl4RFFVRkRMREJDUVVFd1FpeERRVUZETEVOQlFVTTdRVUZETVVRc1NVRkJUU3haUVVGWkxFZEJRVWNzVDBGQlR5eERRVUZETEc5Q1FVRnZRaXhEUVVGRExFTkJRVU03TzBGQlJXNUVMRWxCUVUwc1pVRkJaU3hIUVVGSExFdEJRVXNzUTBGQlF5eFhRVUZYTEVOQlFVTTdPenRCUVVWNFF5eFhRVUZUTEVWQlFVVTdRVUZEVkN4UlFVRkpMRVZCUVVVc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eE5RVUZOTEVOQlFVTXNWVUZCVlR0QlFVTjJReXhWUVVGTkxFVkJRVVVzUzBGQlN5eERRVUZETEZOQlFWTXNRMEZCUXl4TFFVRkxMRU5CUVVNc1ZVRkJWVHRIUVVONlF6czdRVUZGUkN4cFFrRkJaU3hGUVVGRkxESkNRVUZYTzBGQlF6RkNMRmRCUVU4c1JVRkJReXhSUVVGUkxFVkJRVVVzUTBGQlF5eEZRVUZETEVOQlFVTTdSMEZEZEVJN08wRkJSVVFzWVVGQlZ5eEZRVUZGTEhGQ1FVRlRMRXRCUVVzc1JVRkJSVHRCUVVNelFpeFJRVUZKTEV0QlFVc3NTVUZCU1N4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGRkJRVkVzUlVGQlJUdEJRVU5vUXl4VlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFVkJRVU1zVVVGQlVTeEZRVUZGTEV0QlFVc3NSVUZCUXl4RFFVRkRMRU5CUVVNN1FVRkRha01zYlVKQlFXRXNRMEZCUXl4WlFVRlpMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eEpRVUZKTEVWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhOUVVGTkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXp0TFFVTjJSVHRIUVVOR096dEJRVVZFTEZGQlFVMHNSVUZCUlN4clFrRkJWenRCUVVOcVFpeFJRVUZKTEVsQlFVa3NXVUZCUVN4RFFVRkRPenRCUVVWVUxGbEJRVThzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4TlFVRk5MRU5CUVVNc1RVRkJUVHRCUVVNM1FpeFhRVUZMTEVOQlFVTTdRVUZEU2l4WlFVRkpMRWRCUVVjc1RVRkJUU3hEUVVGRE8wRkJRMlFzWTBGQlRUdEJRVUZCTEVGQlExSXNWMEZCU3l4RFFVRkRPMEZCUTBvc1dVRkJTU3hIUVVGSExFOUJRVThzUTBGQlF6dEJRVU5tTEdOQlFVMDdRVUZCUVN4QlFVTlNMRmRCUVVzc1EwRkJRenRCUVVOS0xGbEJRVWtzUjBGQlJ5eFRRVUZUTEVOQlFVTTdRVUZEYWtJc1kwRkJUVHRCUVVGQkxFdEJRMVE3UVVGRFJDeFhRVU5GT3p0UlFVRkxMRk5CUVZNc1JVRkJReXhwUWtGQmFVSTdUVUZETjBJc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eE5RVUZOTEVOQlFVTXNSMEZCUnl4RFFVRkRMRlZCUVZNc1VVRkJVU3hGUVVGRkxFTkJRVU1zUlVGQlJUdEJRVU16UXl4WlFVRk5MRkZCUVZFc1IwRkJSeXhCUVVGRExFTkJRVU1zU1VGQlNTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRkZCUVZFc1IwRkJTU3hWUVVGVkxFZEJRVWNzV1VGQldTeERRVUZCT3p0QlFVVjJSU3haUVVGTkxFdEJRVXNzUjBGQlJ6dEJRVU5hTEdWQlFVc3NSVUZCUXl4UlFVRlJPMEZCUTJRc2FVSkJRVThzUlVGQlF5eEpRVUZKTEVOQlFVTXNWMEZCVnl4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFVkJRVU1zUTBGQlF5eERRVUZETzBGQlEzSkRMRzFDUVVGVExFVkJRVU1zWTBGQll5eEhRVUZETEVkQlFVY3NSMEZCUXl4SlFVRkpMRWRCUVVNc1IwRkJSeXhIUVVGRExGRkJRVkU3VTBGREwwTXNRMEZCUVR0QlFVTkVMR1ZCUTBVc2IwSkJRVU1zV1VGQldTeEZRVUZMTEV0QlFVc3NRMEZCU1N4RFFVTXpRanRQUVVOSUxFVkJRVVVzU1VGQlNTeERRVUZETzB0QlEwb3NRMEZEVGp0SFFVTklPME5CUTBZc1EwRkJReXhEUVVGRE96dEJRVVZJTEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1pVRkJaU3hEUVVGRElpd2labWxzWlNJNklpOVZjMlZ5Y3k5bmNtVm5iM0o1WDJadmMzUmxjaTlrWVhSaExXVnVaeTlvYjI1bGVYQnZkQzlrWlhZdmMyTnlhWEIwY3k5MWFTOUdhV3gwWlhKUGNIUnBiMjVTYjNjdWFuTjRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpTHk4Z1JrbE1WRVZTVDFCVVNVOU9VazlYWEc0dkttcHphR2x1ZENCbGMyNWxlSFE2SUhSeWRXVWdLaTljYmx4dVkyOXVjM1FnUm1sc2RHVnlRV04wYVc5dWN5QTlJSEpsY1hWcGNtVW9KeTR1TDJGamRHbHZibk12Um1sc2RHVnlRV04wYVc5dWN5Y3BPMXh1WTI5dWMzUWdSbWxzZEdWeVFuVjBkRzl1SUQwZ2NtVnhkV2x5WlNnbkxpOUdhV3gwWlhKQ2RYUjBiMjR1YW5ONEp5azdYRzVjYm1OdmJuTjBJRVpwYkhSbGNrOXdkR2x2YmxKdmR5QTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjYmx4dUlDQndjbTl3Vkhsd1pYTTZJSHRjYmlBZ0lDQnVZVzFsT2lCU1pXRmpkQzVRY205d1ZIbHdaWE11YzNSeWFXNW5MbWx6VW1WeGRXbHlaV1FzWEc0Z0lDQWdiR0ZpWld4ek9pQlNaV0ZqZEM1UWNtOXdWSGx3WlhNdVlYSnlZWGt1YVhOU1pYRjFhWEpsWkNCY2JpQWdmU3hjYmx4dUlDQm5aWFJKYm1sMGFXRnNVM1JoZEdVNklHWjFibU4wYVc5dUtDa2dlMXh1SUNBZ0lISmxkSFZ5YmlCN2MyVnNaV04wWldRNklEQjlPMXh1SUNCOUxGeHVYRzRnSUdoaGJtUnNaVU5zYVdOck9pQm1kVzVqZEdsdmJpaHBibVJsZUNrZ2UxeHVJQ0FnSUdsbUlDaHBibVJsZUNBaFBTQjBhR2x6TG5OMFlYUmxMbk5sYkdWamRHVmtLU0I3WEc0Z0lDQWdJQ0IwYUdsekxuTmxkRk4wWVhSbEtIdHpaV3hsWTNSbFpEb2dhVzVrWlhoOUtUdGNiaUFnSUNBZ0lFWnBiSFJsY2tGamRHbHZibk11ZFhCa1lYUmxSbWxzZEdWeUtIUm9hWE11Y0hKdmNITXVibUZ0WlN3Z2RHaHBjeTV3Y205d2N5NXNZV0psYkhOYmFXNWtaWGhkS1R0Y2JpQWdJQ0I5WEc0Z0lIMHNYRzVjYmlBZ2NtVnVaR1Z5T2lCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNCc1pYUWdjM0JoYmp0Y2JseHVJQ0FnSUhOM2FYUmphQ2gwYUdsekxuQnliM0J6TG14aFltVnNjeTVzWlc1bmRHZ3BJSHRjYmlBZ0lDQWdJR05oYzJVZ01qcGNiaUFnSUNBZ0lDQWdjM0JoYmlBOUlDZG9ZV3htSnp0Y2JpQWdJQ0FnSUNBZ1luSmxZV3M3WEc0Z0lDQWdJQ0JqWVhObElETTZYRzRnSUNBZ0lDQWdJSE53WVc0Z1BTQW5kR2hwY21Rbk8xeHVJQ0FnSUNBZ0lDQmljbVZoYXp0Y2JpQWdJQ0FnSUdOaGMyVWdORHBjYmlBZ0lDQWdJQ0FnYzNCaGJpQTlJQ2R4ZFdGeWRHVnlKenRjYmlBZ0lDQWdJQ0FnWW5KbFlXczdYRzRnSUNBZ2ZWeHVJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMG5abWxzZEdWeVQzQjBhVzl1VW05M0p6NWNiaUFnSUNBZ0lDQWdlM1JvYVhNdWNISnZjSE11YkdGaVpXeHpMbTFoY0NobWRXNWpkR2x2YmloamRYSk1ZV0psYkN3Z2FTa2dlMXh1SUNBZ0lDQWdJQ0FnSUdOdmJuTjBJSE5sYkdWamRHVmtJRDBnS0drZ1BUMGdkR2hwY3k1emRHRjBaUzV6Wld4bFkzUmxaQ2tnUHlBbmMyVnNaV04wWldRbklEb2dKMlJsYzJWc1pXTjBaV1FuWEc1Y2JpQWdJQ0FnSUNBZ0lDQmpiMjV6ZENCd2NtOXdjeUE5SUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJR3hoWW1Wc09tTjFja3hoWW1Wc0xDQmNiaUFnSUNBZ0lDQWdJQ0FnSUdoaGJtUnNaWEk2ZEdocGN5NW9ZVzVrYkdWRGJHbGpheTVpYVc1a0tIUm9hWE1zYVNrc1hHNGdJQ0FnSUNBZ0lDQWdJQ0JqYkdGemMwNWhiV1U2SjJacGJIUmxja0oxZEhSdmJpY3JKeUFuSzNOd1lXNHJKeUFuSzNObGJHVmpkR1ZrWEc0Z0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQWdJQ0FnSUNBOFJtbHNkR1Z5UW5WMGRHOXVJSHN1TGk1d2NtOXdjMzBnTHo1Y2JpQWdJQ0FnSUNBZ0lDQXBPMXh1SUNBZ0lDQWdJQ0I5TENCMGFHbHpLWDFjYmlBZ0lDQWdJRHd2WkdsMlBseHVJQ0FnSUNrN1hHNGdJSDFjYm4wcE8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRVpwYkhSbGNrOXdkR2x2YmxKdmR6dGNiaUpkZlE9PSIsIi8vIEZJTFRFUlJFU1VMVFJPV1xuLypqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIEZpbHRlclJlc3VsdFJvdyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdGaWx0ZXJSZXN1bHRSb3cnLFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBjbGFzc05hbWUgPSAnZmlsdGVyUmVzdWx0Um93JztcbiAgICBpZiAodGhpcy5wcm9wcy5zZWxlY3RlZCkge1xuICAgICAgY2xhc3NOYW1lID0gY2xhc3NOYW1lICsgJyBzZWxlY3RlZCc7XG4gICAgfVxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ3RyJyxcbiAgICAgIHsgY2xhc3NOYW1lOiBjbGFzc05hbWUsIG9uQ2xpY2s6IHRoaXMucHJvcHMuaGFuZGxlciB9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ3RkJyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdmaWx0ZXJSZXN1bHRSb3dOYW1lJyB9LFxuICAgICAgICB0aGlzLnByb3BzLm5hbWVcbiAgICAgICksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAndGQnLFxuICAgICAgICB7IGNsYXNzTmFtZTogJ2ZpbHRlclJlc3VsdFJvd1ZhbHVlJyB9LFxuICAgICAgICB0aGlzLnByb3BzLnZhbHVlXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRmlsdGVyUmVzdWx0Um93O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5bmNtVm5iM0o1WDJadmMzUmxjaTlrWVhSaExXVnVaeTlvYjI1bGVYQnZkQzlrWlhZdmMyTnlhWEIwY3k5MWFTOUdhV3gwWlhKU1pYTjFiSFJTYjNjdWFuTjRJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdPenM3TzBGQlIwRXNTVUZCVFN4bFFVRmxMRWRCUVVjc1MwRkJTeXhEUVVGRExGZEJRVmNzUTBGQlF6czdPMEZCUTNoRExGRkJRVTBzUlVGQlJTeHJRa0ZCVnp0QlFVTnFRaXhSUVVGSkxGTkJRVk1zUjBGQlJ5eHBRa0ZCYVVJc1EwRkJRenRCUVVOc1F5eFJRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1VVRkJVU3hGUVVGRk8wRkJRVU1zWlVGQlV5eEhRVUZITEZOQlFWTXNSMEZCUnl4WFFVRlhMRU5CUVVNN1MwRkJRenRCUVVNdlJDeFhRVU5GT3p0UlFVRkpMRk5CUVZNc1JVRkJSU3hUUVVGVExFRkJRVU1zUlVGQlF5eFBRVUZQTEVWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhQUVVGUExFRkJRVU03VFVGRGNFUTdPMVZCUVVrc1UwRkJVeXhGUVVGRExIRkNRVUZ4UWp0UlFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNUdFBRVUZOTzAxQlF6RkVPenRWUVVGSkxGTkJRVk1zUlVGQlF5eHpRa0ZCYzBJN1VVRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEV0QlFVczdUMEZCVFR0TFFVTjZSQ3hEUVVOTU8wZEJRMGc3UTBGRFJpeERRVUZETEVOQlFVTTdPMEZCUlVnc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eGxRVUZsTEVOQlFVTWlMQ0ptYVd4bElqb2lMMVZ6WlhKekwyZHlaV2R2Y25sZlptOXpkR1Z5TDJSaGRHRXRaVzVuTDJodmJtVjVjRzkwTDJSbGRpOXpZM0pwY0hSekwzVnBMMFpwYkhSbGNsSmxjM1ZzZEZKdmR5NXFjM2dpTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdkx5QkdTVXhVUlZKU1JWTlZURlJTVDFkY2JpOHFhbk5vYVc1MElHVnpibVY0ZERvZ2RISjFaU0FxTDF4dVhHNWpiMjV6ZENCR2FXeDBaWEpTWlhOMWJIUlNiM2NnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdiR1YwSUdOc1lYTnpUbUZ0WlNBOUlDZG1hV3gwWlhKU1pYTjFiSFJTYjNjbk8xeHVJQ0FnSUdsbUlDaDBhR2x6TG5CeWIzQnpMbk5sYkdWamRHVmtLU0I3WTJ4aGMzTk9ZVzFsSUQwZ1kyeGhjM05PWVcxbElDc2dKeUJ6Wld4bFkzUmxaQ2M3ZlZ4dUlDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQThkSElnWTJ4aGMzTk9ZVzFsUFh0amJHRnpjMDVoYldWOUlHOXVRMnhwWTJzOWUzUm9hWE11Y0hKdmNITXVhR0Z1Wkd4bGNuMCtYRzRnSUNBZ0lDQWdJRHgwWkNCamJHRnpjMDVoYldVOUoyWnBiSFJsY2xKbGMzVnNkRkp2ZDA1aGJXVW5QbnQwYUdsekxuQnliM0J6TG01aGJXVjlQQzkwWkQ1Y2JpQWdJQ0FnSUNBZ1BIUmtJR05zWVhOelRtRnRaVDBuWm1sc2RHVnlVbVZ6ZFd4MFVtOTNWbUZzZFdVblBudDBhR2x6TG5CeWIzQnpMblpoYkhWbGZUd3ZkR1ErWEc0Z0lDQWdJQ0E4TDNSeVBseHVJQ0FnSUNrN1hHNGdJSDFjYm4wcE8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRVpwYkhSbGNsSmxjM1ZzZEZKdmR6dGNiaUpkZlE9PSIsIi8vIEZJTFRFUlJFU1VMVFNUQUJMRVxuLypqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIEZpbHRlclN0b3JlID0gcmVxdWlyZSgnLi4vc3RvcmVzL0ZpbHRlclN0b3JlJyk7XG52YXIgRmlsdGVyQWN0aW9ucyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvRmlsdGVyQWN0aW9ucycpO1xudmFyIERldGFpbFZpZXdBY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9EZXRhaWxWaWV3QWN0aW9ucy5qcycpO1xudmFyIEZpbHRlclJlc3VsdFJvdyA9IHJlcXVpcmUoJy4vRmlsdGVyUmVzdWx0Um93LmpzeCcpO1xuXG52YXIgRmlsdGVyUmVzdWx0c1RhYmxlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ0ZpbHRlclJlc3VsdHNUYWJsZScsXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3VsdHM6IEZpbHRlclN0b3JlLmdldFJlc3VsdHMoKSxcbiAgICAgIGhlYWRlcnM6IEZpbHRlclN0b3JlLmdldFJlc3VsdEhlYWRlcnMoKSxcbiAgICAgIGRlc2NyaXB0aW9uOiBGaWx0ZXJTdG9yZS5nZXREZXNjcmlwdGlvblN0cmluZygpXG4gICAgfTtcbiAgfSxcblxuICBoYW5kbGVDbGljazogZnVuY3Rpb24gaGFuZGxlQ2xpY2soaW5kZXgpIHtcbiAgICBEZXRhaWxWaWV3QWN0aW9ucy51cGRhdGVEZXRhaWxWaWV3KHRoaXMuc3RhdGUuaGVhZGVyc1swXS5yZXBsYWNlKCcgbmFtZScsICcnKSwgdGhpcy5zdGF0ZS5yZXN1bHRzW2luZGV4XS5uYW1lKTtcblxuICAgIGlmIChGaWx0ZXJTdG9yZS5pc1Nob3dpbmdEYWdzKCkpIHtcbiAgICAgIEZpbHRlckFjdGlvbnMudXBkYXRlRmlsdGVyKFwiZGFnXCIsIHRoaXMuc3RhdGUucmVzdWx0c1tpbmRleF0ubmFtZSk7XG4gICAgICBEZXRhaWxWaWV3QWN0aW9ucy51cGRhdGVEYWcodGhpcy5zdGF0ZS5yZXN1bHRzW2luZGV4XS5uYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlbGVjdGVkOiBpbmRleFxuICAgIH0pO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBGaWx0ZXJTdG9yZS5hZGRGaWx0ZXJSZXN1bHRzQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZFVubW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZFVubW91bnQoKSB7XG4gICAgRmlsdGVyU3RvcmUucmVtb3ZlRmlsdGVyUmVzdWx0c0NoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlKTtcbiAgfSxcblxuICBfb25DaGFuZ2U6IGZ1bmN0aW9uIF9vbkNoYW5nZSgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlc3VsdHM6IEZpbHRlclN0b3JlLmdldFJlc3VsdHMoKSxcbiAgICAgIGhlYWRlcnM6IEZpbHRlclN0b3JlLmdldFJlc3VsdEhlYWRlcnMoKSxcbiAgICAgIGRlc2NyaXB0aW9uOiBGaWx0ZXJTdG9yZS5nZXREZXNjcmlwdGlvblN0cmluZygpXG4gICAgfSk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUucmVzdWx0cykge1xuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICd0YWJsZScsXG4gICAgICAgIHsgY2xhc3NOYW1lOiAnZmlsdGVyUmVzdWx0cycgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAncCcsXG4gICAgICAgICAgeyBjbGFzc05hbWU6ICdmaWx0ZXJEZXNjcmlwdGlvbicgfSxcbiAgICAgICAgICB0aGlzLnN0YXRlLmRlc2NyaXB0aW9uXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ3RyJyxcbiAgICAgICAgICBudWxsLFxuICAgICAgICAgIHRoaXMuc3RhdGUuaGVhZGVycy5tYXAoZnVuY3Rpb24gKGhlYWRlciwgaSkge1xuICAgICAgICAgICAgdmFyIG5hbWUgPSAnZmlsdGVyUmVzdWx0Um93VmFsdWUnO1xuICAgICAgICAgICAgaWYgKGkgPT0gMCkgbmFtZSA9ICdmaWx0ZXJSZXN1bHRSb3dOYW1lJztcbiAgICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAndGgnLFxuICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogbmFtZSB9LFxuICAgICAgICAgICAgICBoZWFkZXJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSwgdGhpcylcbiAgICAgICAgKSxcbiAgICAgICAgdGhpcy5zdGF0ZS5yZXN1bHRzLm1hcChmdW5jdGlvbiAocmVzdWx0LCBpKSB7XG4gICAgICAgICAgLy8gQ3JlYXRlIGFsbCB0aGUgcmVzdWx0IHJvd3NcbiAgICAgICAgICB2YXIgcmVzdWx0c1Jvd1Byb3BzID0ge1xuICAgICAgICAgICAgbmFtZTogcmVzdWx0Lm5hbWUsXG4gICAgICAgICAgICBrZXk6IGksXG4gICAgICAgICAgICB2YWx1ZTogTnVtYmVyKHJlc3VsdC52YWx1ZS50b0ZpeGVkKDEpKSxcbiAgICAgICAgICAgIGhhbmRsZXI6IHRoaXMuaGFuZGxlQ2xpY2suYmluZCh0aGlzLCBpKSxcbiAgICAgICAgICAgIHNlbGVjdGVkOiBpID09IHRoaXMuc3RhdGUuc2VsZWN0ZWQgPyB0cnVlIDogZmFsc2VcbiAgICAgICAgICB9O1xuICAgICAgICAgIC8vIFNob3J0ZW4gbmFtZSB0byBwcmV2ZW50IG92ZXJmbG93XG4gICAgICAgICAgaWYgKG5hbWUubGVuZ3RoID4gMTUpIHByb3BzLm5hbWUgPSBwcm9wcy5uYW1lLnNsaWNlKDAsIDE1KSArICcuLi4nO1xuXG4gICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRmlsdGVyUmVzdWx0Um93LCByZXN1bHRzUm93UHJvcHMpO1xuICAgICAgICB9LCB0aGlzKVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3RhYmxlJywgeyBjbGFzc05hbWU6ICdmaWx0ZXJSZXN1bHRzJyB9KTtcbiAgICB9XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZpbHRlclJlc3VsdHNUYWJsZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OW5jbVZuYjNKNVgyWnZjM1JsY2k5a1lYUmhMV1Z1Wnk5b2IyNWxlWEJ2ZEM5a1pYWXZjMk55YVhCMGN5OTFhUzlHYVd4MFpYSlNaWE4xYkhSelZHRmliR1V1YW5ONElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN096czdPMEZCUjBFc1NVRkJUU3hYUVVGWExFZEJRVWNzVDBGQlR5eERRVUZETEhWQ1FVRjFRaXhEUVVGRExFTkJRVU03UVVGRGNrUXNTVUZCVFN4aFFVRmhMRWRCUVVjc1QwRkJUeXhEUVVGRExEQkNRVUV3UWl4RFFVRkRMRU5CUVVNN1FVRkRNVVFzU1VGQlRTeHBRa0ZCYVVJc1IwRkJSeXhQUVVGUExFTkJRVU1zYVVOQlFXbERMRU5CUVVNc1EwRkJRenRCUVVOeVJTeEpRVUZOTEdWQlFXVXNSMEZCUnl4UFFVRlBMRU5CUVVNc2RVSkJRWFZDTEVOQlFVTXNRMEZCUXpzN1FVRkZla1FzU1VGQlRTeHJRa0ZCYTBJc1IwRkJSeXhMUVVGTExFTkJRVU1zVjBGQlZ5eERRVUZET3pzN1FVRkRNME1zYVVKQlFXVXNSVUZCUlN3eVFrRkJWenRCUVVNeFFpeFhRVUZQTzBGQlEwd3NZVUZCVHl4RlFVRkZMRmRCUVZjc1EwRkJReXhWUVVGVkxFVkJRVVU3UVVGRGFrTXNZVUZCVHl4RlFVRkZMRmRCUVZjc1EwRkJReXhuUWtGQlowSXNSVUZCUlR0QlFVTjJReXhwUWtGQlZ5eEZRVUZGTEZkQlFWY3NRMEZCUXl4dlFrRkJiMElzUlVGQlJUdExRVU5vUkN4RFFVRkRPMGRCUTBnN08wRkJSVVFzWVVGQlZ5eEZRVUZGTEhGQ1FVRlRMRXRCUVVzc1JVRkJSVHRCUVVNelFpeHhRa0ZCYVVJc1EwRkJReXhuUWtGQlowSXNRMEZEYUVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1QwRkJUeXhEUVVGRExFOUJRVThzUlVGQlJTeEZRVUZGTEVOQlFVTXNSVUZETVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFBRVUZQTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNc1NVRkJTU3hEUVVNdlFpeERRVUZET3p0QlFVVkdMRkZCUVVrc1YwRkJWeXhEUVVGRExHRkJRV0VzUlVGQlJTeEZRVUZGTzBGQlF5OUNMRzFDUVVGaExFTkJRVU1zV1VGQldTeERRVUZETEV0QlFVc3NSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFOUJRVThzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRCUVVOc1JTeDFRa0ZCYVVJc1EwRkJReXhUUVVGVExFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdTMEZETjBRN08wRkJSVVFzVVVGQlNTeERRVUZETEZGQlFWRXNRMEZCUXp0QlFVTmFMR05CUVZFc1JVRkJSU3hMUVVGTE8wdEJRMmhDTEVOQlFVTXNRMEZCUXp0SFFVTktPenRCUVVWRUxHMUNRVUZwUWl4RlFVRkZMRFpDUVVGWE8wRkJRelZDTEdWQlFWY3NRMEZCUXl3NFFrRkJPRUlzUTBGQlF5eEpRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN1IwRkROVVE3TzBGQlJVUXNjVUpCUVcxQ0xFVkJRVVVzSzBKQlFWYzdRVUZET1VJc1pVRkJWeXhEUVVGRExHbERRVUZwUXl4RFFVRkRMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dEhRVU12UkRzN1FVRkZSQ3hYUVVGVExFVkJRVVVzY1VKQlFWVTdRVUZEYmtJc1VVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF6dEJRVU5hTEdGQlFVOHNSVUZCUlN4WFFVRlhMRU5CUVVNc1ZVRkJWU3hGUVVGRk8wRkJRMnBETEdGQlFVOHNSVUZCUlN4WFFVRlhMRU5CUVVNc1owSkJRV2RDTEVWQlFVVTdRVUZEZGtNc2FVSkJRVmNzUlVGQlJTeFhRVUZYTEVOQlFVTXNiMEpCUVc5Q0xFVkJRVVU3UzBGRGFFUXNRMEZCUXl4RFFVRkRPMGRCUTBvN08wRkJSVVFzVVVGQlRTeEZRVUZGTEd0Q1FVRlhPMEZCUTJwQ0xGRkJRVWtzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRVZCUVVVN1FVRkRkRUlzWVVGRFJUczdWVUZCVHl4VFFVRlRMRVZCUVVNc1pVRkJaVHRSUVVNNVFqczdXVUZCUnl4VFFVRlRMRVZCUVVNc2JVSkJRVzFDTzFWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhYUVVGWE8xTkJRVXM3VVVGRE4wUTdPenRWUVVOSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWRCUVVjc1EwRkJReXhWUVVGVExFMUJRVTBzUlVGQlJTeERRVUZETEVWQlFVTTdRVUZEZWtNc1owSkJRVWtzU1VGQlNTeEhRVUZITEhOQ1FVRnpRaXhEUVVGRE8wRkJRMnhETEdkQ1FVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFVkJRVVVzU1VGQlNTeEhRVUZITEhGQ1FVRnhRaXhEUVVGRE8wRkJRM3BETEcxQ1FVTkZPenRuUWtGQlNTeFRRVUZUTEVWQlFVVXNTVUZCU1N4QlFVRkRPMk5CUVVVc1RVRkJUVHRoUVVGTkxFTkJRMnhETzFkQlEwZ3NSVUZCUlN4SlFVRkpMRU5CUVVNN1UwRkRURHRSUVVOS0xFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWRCUVVjc1EwRkJReXhWUVVGVExFMUJRVTBzUlVGQlJTeERRVUZETEVWQlFVTTdPMEZCUlhwRExHTkJRVTBzWlVGQlpTeEhRVUZITzBGQlEzUkNMR2RDUVVGSkxFVkJRVVVzVFVGQlRTeERRVUZETEVsQlFVazdRVUZEYWtJc1pVRkJSeXhGUVVGRkxFTkJRVU03UVVGRFRpeHBRa0ZCU3l4RlFVRkZMRTFCUVUwc1EwRkJReXhOUVVGTkxFTkJRVU1zUzBGQlN5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRCUVVOMFF5eHRRa0ZCVHl4RlFVRkRMRWxCUVVrc1EwRkJReXhYUVVGWExFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NSVUZCUXl4RFFVRkRMRU5CUVVNN1FVRkRja01zYjBKQlFWRXNSVUZCUXl4QlFVRkRMRU5CUVVNc1NVRkJTU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZGQlFWRXNSMEZCU1N4SlFVRkpMRWRCUVVjc1MwRkJTenRYUVVOdVJDeERRVUZCT3p0QlFVVkVMR05CUVVrc1NVRkJTU3hEUVVGRExFMUJRVTBzUjBGQlJ5eEZRVUZGTEVWQlFVVXNTMEZCU3l4RFFVRkRMRWxCUVVrc1IwRkJSeXhMUVVGTExFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRVZCUVVNc1JVRkJSU3hEUVVGRExFZEJRVWNzUzBGQlN5eERRVUZET3p0QlFVVnNSU3hwUWtGQlV5eHZRa0ZCUXl4bFFVRmxMRVZCUVUwc1pVRkJaU3hEUVVGSkxFTkJRVWM3VTBGRGRFUXNSVUZCUlN4SlFVRkpMRU5CUVVNN1QwRkRSaXhEUVVOU08wdEJRMGdzVFVGRFNUdEJRVU5JTEdGQlEwVXNLMEpCUVU4c1UwRkJVeXhGUVVGRExHVkJRV1VzUjBGQlV5eERRVU42UXp0TFFVTklPMGRCUTBZN1EwRkRSaXhEUVVGRExFTkJRVU03TzBGQlJVZ3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhyUWtGQmEwSXNRMEZCUXlJc0ltWnBiR1VpT2lJdlZYTmxjbk12WjNKbFoyOXllVjltYjNOMFpYSXZaR0YwWVMxbGJtY3ZhRzl1Wlhsd2IzUXZaR1YyTDNOamNtbHdkSE12ZFdrdlJtbHNkR1Z5VW1WemRXeDBjMVJoWW14bExtcHplQ0lzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWk4dklFWkpURlJGVWxKRlUxVk1WRk5VUVVKTVJWeHVMeXBxYzJocGJuUWdaWE51WlhoME9pQjBjblZsSUNvdlhHNWNibU52Ym5OMElFWnBiSFJsY2xOMGIzSmxJRDBnY21WeGRXbHlaU2duTGk0dmMzUnZjbVZ6TDBacGJIUmxjbE4wYjNKbEp5azdYRzVqYjI1emRDQkdhV3gwWlhKQlkzUnBiMjV6SUQwZ2NtVnhkV2x5WlNnbkxpNHZZV04wYVc5dWN5OUdhV3gwWlhKQlkzUnBiMjV6SnlrN1hHNWpiMjV6ZENCRVpYUmhhV3hXYVdWM1FXTjBhVzl1Y3lBOUlISmxjWFZwY21Vb0p5NHVMMkZqZEdsdmJuTXZSR1YwWVdsc1ZtbGxkMEZqZEdsdmJuTXVhbk1uS1R0Y2JtTnZibk4wSUVacGJIUmxjbEpsYzNWc2RGSnZkeUE5SUhKbGNYVnBjbVVvSnk0dlJtbHNkR1Z5VW1WemRXeDBVbTkzTG1wemVDY3BPMXh1WEc1amIyNXpkQ0JHYVd4MFpYSlNaWE4xYkhSelZHRmliR1VnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hHNGdJR2RsZEVsdWFYUnBZV3hUZEdGMFpUb2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlIdGNiaUFnSUNBZ0lISmxjM1ZzZEhNNklFWnBiSFJsY2xOMGIzSmxMbWRsZEZKbGMzVnNkSE1vS1N3Z1hHNGdJQ0FnSUNCb1pXRmtaWEp6T2lCR2FXeDBaWEpUZEc5eVpTNW5aWFJTWlhOMWJIUklaV0ZrWlhKektDa3NYRzRnSUNBZ0lDQmtaWE5qY21sd2RHbHZiam9nUm1sc2RHVnlVM1J2Y21VdVoyVjBSR1Z6WTNKcGNIUnBiMjVUZEhKcGJtY29LVnh1SUNBZ0lIMDdYRzRnSUgwc1hHNWNiaUFnYUdGdVpHeGxRMnhwWTJzNklHWjFibU4wYVc5dUtHbHVaR1Y0S1NCN1hHNGdJQ0FnUkdWMFlXbHNWbWxsZDBGamRHbHZibk11ZFhCa1lYUmxSR1YwWVdsc1ZtbGxkeWhjYmlBZ0lDQWdJSFJvYVhNdWMzUmhkR1V1YUdWaFpHVnljMXN3WFM1eVpYQnNZV05sS0NjZ2JtRnRaU2NzSUNjbktTeGNiaUFnSUNBZ0lIUm9hWE11YzNSaGRHVXVjbVZ6ZFd4MGMxdHBibVJsZUYwdWJtRnRaVnh1SUNBZ0lDazdYRzVjYmlBZ0lDQnBaaUFvUm1sc2RHVnlVM1J2Y21VdWFYTlRhRzkzYVc1blJHRm5jeWdwS1NCN1hHNGdJQ0FnSUNCR2FXeDBaWEpCWTNScGIyNXpMblZ3WkdGMFpVWnBiSFJsY2loY0ltUmhaMXdpTENCMGFHbHpMbk4wWVhSbExuSmxjM1ZzZEhOYmFXNWtaWGhkTG01aGJXVXBPMXh1SUNBZ0lDQWdSR1YwWVdsc1ZtbGxkMEZqZEdsdmJuTXVkWEJrWVhSbFJHRm5LSFJvYVhNdWMzUmhkR1V1Y21WemRXeDBjMXRwYm1SbGVGMHVibUZ0WlNrN1hHNGdJQ0FnZlZ4dUlDQWdJRnh1SUNBZ0lIUm9hWE11YzJWMFUzUmhkR1VvZTF4dUlDQWdJQ0FnYzJWc1pXTjBaV1E2SUdsdVpHVjRYRzRnSUNBZ2ZTazdYRzRnSUgwc1hHNWNiaUFnWTI5dGNHOXVaVzUwUkdsa1RXOTFiblE2SUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0FnSUVacGJIUmxjbE4wYjNKbExtRmtaRVpwYkhSbGNsSmxjM1ZzZEhORGFHRnVaMlZNYVhOMFpXNWxjaWgwYUdsekxsOXZia05vWVc1blpTazdJRnh1SUNCOUxGeHVYRzRnSUdOdmJYQnZibVZ1ZEVScFpGVnViVzkxYm5RNklHWjFibU4wYVc5dUtDa2dlMXh1SUNBZ0lFWnBiSFJsY2xOMGIzSmxMbkpsYlc5MlpVWnBiSFJsY2xKbGMzVnNkSE5EYUdGdVoyVk1hWE4wWlc1bGNpaDBhR2x6TGw5dmJrTm9ZVzVuWlNrN0lGeHVJQ0I5TEZ4dVhHNGdJRjl2YmtOb1lXNW5aVG9nWm5WdVkzUnBiMjRvS1h0Y2JpQWdJQ0IwYUdsekxuTmxkRk4wWVhSbEtIdGNiaUFnSUNBZ0lISmxjM1ZzZEhNNklFWnBiSFJsY2xOMGIzSmxMbWRsZEZKbGMzVnNkSE1vS1N4Y2JpQWdJQ0FnSUdobFlXUmxjbk02SUVacGJIUmxjbE4wYjNKbExtZGxkRkpsYzNWc2RFaGxZV1JsY25Nb0tTeGNiaUFnSUNBZ0lHUmxjMk55YVhCMGFXOXVPaUJHYVd4MFpYSlRkRzl5WlM1blpYUkVaWE5qY21sd2RHbHZibE4wY21sdVp5Z3BYRzRnSUNBZ2ZTazdYRzRnSUgwc1hHNWNiaUFnY21WdVpHVnlPaUJtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0JwWmlBb2RHaHBjeTV6ZEdGMFpTNXlaWE4xYkhSektTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ0lDQThkR0ZpYkdVZ1kyeGhjM05PWVcxbFBTZG1hV3gwWlhKU1pYTjFiSFJ6Sno1Y2JpQWdJQ0FnSUNBZ0lDQThjQ0JqYkdGemMwNWhiV1U5SjJacGJIUmxja1JsYzJOeWFYQjBhVzl1Sno1N2RHaHBjeTV6ZEdGMFpTNWtaWE5qY21sd2RHbHZibjA4TDNBK1hHNGdJQ0FnSUNBZ0lDQWdQSFJ5UGx4dUlDQWdJQ0FnSUNBZ0lDQWdlM1JvYVhNdWMzUmhkR1V1YUdWaFpHVnljeTV0WVhBb1puVnVZM1JwYjI0b2FHVmhaR1Z5TENCcEtYdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ2JHVjBJRzVoYldVZ1BTQW5abWxzZEdWeVVtVnpkV3gwVW05M1ZtRnNkV1VuTzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0JwWmlBb2FTQTlQU0F3S1NCdVlXMWxJRDBnSjJacGJIUmxjbEpsYzNWc2RGSnZkMDVoYldVbk8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4MGFDQmpiR0Z6YzA1aGJXVTllMjVoYldWOVBudG9aV0ZrWlhKOVBDOTBhRDVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIMHNJSFJvYVhNcGZWeHVJQ0FnSUNBZ0lDQWdJRHd2ZEhJK1hHNGdJQ0FnSUNBZ0lDQWdlM1JvYVhNdWMzUmhkR1V1Y21WemRXeDBjeTV0WVhBb1puVnVZM1JwYjI0b2NtVnpkV3gwTENCcEtYdGNiaUFnSUNBZ0lDQWdJQ0FnSUM4dklFTnlaV0YwWlNCaGJHd2dkR2hsSUhKbGMzVnNkQ0J5YjNkelhHNGdJQ0FnSUNBZ0lDQWdJQ0JqYjI1emRDQnlaWE4xYkhSelVtOTNVSEp2Y0hNZ1BTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lHNWhiV1U2SUhKbGMzVnNkQzV1WVcxbExGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCclpYazZJR2tzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJSFpoYkhWbE9pQk9kVzFpWlhJb2NtVnpkV3gwTG5aaGJIVmxMblJ2Um1sNFpXUW9NU2twTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0JvWVc1a2JHVnlPblJvYVhNdWFHRnVaR3hsUTJ4cFkyc3VZbWx1WkNoMGFHbHpMR2twTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0J6Wld4bFkzUmxaRG9vYVNBOVBTQjBhR2x6TG5OMFlYUmxMbk5sYkdWamRHVmtLU0EvSUhSeWRXVWdPaUJtWVd4elpWeHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNBZ0lDQWdMeThnVTJodmNuUmxiaUJ1WVcxbElIUnZJSEJ5WlhabGJuUWdiM1psY21ac2IzZGNiaUFnSUNBZ0lDQWdJQ0FnSUdsbUlDaHVZVzFsTG14bGJtZDBhQ0ErSURFMUtTQndjbTl3Y3k1dVlXMWxJRDBnY0hKdmNITXVibUZ0WlM1emJHbGpaU2d3TERFMUtTQXJJQ2N1TGk0bk8xeHVYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnS0NBOFJtbHNkR1Z5VW1WemRXeDBVbTkzSUNCN0xpNHVjbVZ6ZFd4MGMxSnZkMUJ5YjNCemZTQXZQaUFwTzF4dUlDQWdJQ0FnSUNBZ0lIMHNJSFJvYVhNcGZWeHVJQ0FnSUNBZ0lDQThMM1JoWW14bFBpQmNiaUFnSUNBZ0lDazdYRzRnSUNBZ2ZWeHVJQ0FnSUdWc2MyVWdlMXh1SUNBZ0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lDQWdQSFJoWW14bElHTnNZWE56VG1GdFpUMG5abWxzZEdWeVVtVnpkV3gwY3ljK1BDOTBZV0pzWlQ1Y2JpQWdJQ0FnSUNrN1hHNGdJQ0FnZlZ4dUlDQjlYRzU5S1R0Y2JseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQkdhV3gwWlhKU1pYTjFiSFJ6VkdGaWJHVTdYRzRpWFgwPSIsIi8qanNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBEZXRhaWxWaWV3U3RvcmUgPSByZXF1aXJlKCcuLi9zdG9yZXMvRGV0YWlsVmlld1N0b3JlJyk7XG52YXIgRGV0YWlsVmlld0FjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL0RldGFpbFZpZXdBY3Rpb25zJyk7XG52YXIgRmlsdGVyQnV0dG9uID0gcmVxdWlyZSgnLi9GaWx0ZXJCdXR0b24uanN4Jyk7XG5cbnZhciBNZWFzdXJlUm93ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ01lYXN1cmVSb3cnLFxuXG4gIHByb3BUeXBlczoge1xuICAgIGxhYmVsczogUmVhY3QuUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWRcbiAgfSxcblxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4geyBzZWxlY3RlZDogMCB9O1xuICB9LFxuXG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbiBoYW5kbGVDbGljayhpbmRleCkge1xuICAgIGlmIChpbmRleCAhPSB0aGlzLnN0YXRlLnNlbGVjdGVkKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgc2VsZWN0ZWQ6IGluZGV4IH0pO1xuICAgICAgRGV0YWlsVmlld0FjdGlvbnMudXBkYXRlTWVhc3VyZSh0aGlzLnByb3BzLmxhYmVsc1tpbmRleF0pO1xuICAgIH1cbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICByZXR1cm4oXG4gICAgICAvLyBDcmVhdGUgYSByYWRpbyBidXR0b24gZm9yIGVhY2ggbGFiZWwgcGFzc2VkIGluIHRvIHRoZSBwcm9wc1xuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHsgY2xhc3NOYW1lOiAnbWVhc3VyZVJvdycgfSxcbiAgICAgICAgdGhpcy5wcm9wcy5sYWJlbHMubWFwKGZ1bmN0aW9uIChjdXJMYWJlbCwgaSkge1xuICAgICAgICAgIHZhciBzZWxlY3RlZCA9IGkgPT0gdGhpcy5zdGF0ZS5zZWxlY3RlZCA/ICdzZWxlY3RlZCcgOiAnZGVzZWxlY3RlZCc7XG5cbiAgICAgICAgICB2YXIgZmlsdGVyQnV0dG9uUHJvcHMgPSB7XG4gICAgICAgICAgICBsYWJlbDogY3VyTGFiZWwsXG4gICAgICAgICAgICBoYW5kbGVyOiB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcywgaSksXG4gICAgICAgICAgICBjbGFzc05hbWU6ICdmaWx0ZXJCdXR0b24nICsgJyAnICsgc2VsZWN0ZWRcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRmlsdGVyQnV0dG9uLCBmaWx0ZXJCdXR0b25Qcm9wcyk7XG4gICAgICAgIH0sIHRoaXMpXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTWVhc3VyZVJvdztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OW5jbVZuYjNKNVgyWnZjM1JsY2k5a1lYUmhMV1Z1Wnk5b2IyNWxlWEJ2ZEM5a1pYWXZjMk55YVhCMGN5OTFhUzlOWldGemRYSmxVbTkzTG1wemVDSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPMEZCUlVFc1NVRkJUU3hsUVVGbExFZEJRVWNzVDBGQlR5eERRVUZETERKQ1FVRXlRaXhEUVVGRExFTkJRVU03UVVGRE4wUXNTVUZCVFN4cFFrRkJhVUlzUjBGQlJ5eFBRVUZQTEVOQlFVTXNPRUpCUVRoQ0xFTkJRVU1zUTBGQlF6dEJRVU5zUlN4SlFVRk5MRmxCUVZrc1IwRkJSeXhQUVVGUExFTkJRVU1zYjBKQlFXOUNMRU5CUVVNc1EwRkJRenM3UVVGRmJrUXNTVUZCVFN4VlFVRlZMRWRCUVVjc1MwRkJTeXhEUVVGRExGZEJRVmNzUTBGQlF6czdPMEZCUlc1RExGZEJRVk1zUlVGQlJUdEJRVU5VTEZWQlFVMHNSVUZCUlN4TFFVRkxMRU5CUVVNc1UwRkJVeXhEUVVGRExFdEJRVXNzUTBGQlF5eFZRVUZWTzBkQlEzcERPenRCUVVWRUxHbENRVUZsTEVWQlFVVXNNa0pCUVZjN1FVRkRNVUlzVjBGQlR5eEZRVUZETEZGQlFWRXNSVUZCUlN4RFFVRkRMRVZCUVVNc1EwRkJRenRIUVVOMFFqczdRVUZGUkN4aFFVRlhMRVZCUVVVc2NVSkJRVk1zUzBGQlN5eEZRVUZGTzBGQlF6TkNMRkZCUVVrc1MwRkJTeXhKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVVUZCVVN4RlFVRkZPMEZCUTJoRExGVkJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNSVUZCUXl4UlFVRlJMRVZCUVVVc1MwRkJTeXhGUVVGRExFTkJRVU1zUTBGQlF6dEJRVU5xUXl4MVFrRkJhVUlzUTBGQlF5eGhRVUZoTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhOUVVGTkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXp0TFFVTXpSRHRIUVVOR096dEJRVVZFTEZGQlFVMHNSVUZCUlN4clFrRkJWenRCUVVOcVFqczdRVUZGUlRzN1ZVRkJTeXhUUVVGVExFVkJRVU1zV1VGQldUdFJRVU40UWl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFMUJRVTBzUTBGQlF5eEhRVUZITEVOQlFVTXNWVUZCVXl4UlFVRlJMRVZCUVVVc1EwRkJReXhGUVVGRk8wRkJRek5ETEdOQlFVMHNVVUZCVVN4SFFVRkhMRUZCUVVNc1EwRkJReXhKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVVUZCVVN4SFFVRkpMRlZCUVZVc1IwRkJSeXhaUVVGWkxFTkJRVUU3TzBGQlJYWkZMR05CUVUwc2FVSkJRV2xDTEVkQlFVYzdRVUZEZUVJc2FVSkJRVXNzUlVGQlF5eFJRVUZSTzBGQlEyUXNiVUpCUVU4c1JVRkJReXhKUVVGSkxFTkJRVU1zVjBGQlZ5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRVZCUVVNc1EwRkJReXhEUVVGRE8wRkJRM0pETEhGQ1FVRlRMRVZCUVVNc1kwRkJZeXhIUVVGRExFZEJRVWNzUjBGQlF5eFJRVUZSTzFkQlEzUkRMRU5CUVVFN08wRkJSVVFzYVVKQlEwVXNiMEpCUVVNc1dVRkJXU3hGUVVGTExHbENRVUZwUWl4RFFVRkpMRU5CUTNaRE8xTkJRMGdzUlVGQlJTeEpRVUZKTEVOQlFVTTdUMEZEU2p0TlFVTk9PMGRCUTBnN1EwRkRSaXhEUVVGRExFTkJRVU03TzBGQlJVZ3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhWUVVGVkxFTkJRVU1pTENKbWFXeGxJam9pTDFWelpYSnpMMmR5WldkdmNubGZabTl6ZEdWeUwyUmhkR0V0Wlc1bkwyaHZibVY1Y0c5MEwyUmxkaTl6WTNKcGNIUnpMM1ZwTDAxbFlYTjFjbVZTYjNjdWFuTjRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpTHlwcWMyaHBiblFnWlhOdVpYaDBPaUIwY25WbElDb3ZYRzVjYm1OdmJuTjBJRVJsZEdGcGJGWnBaWGRUZEc5eVpTQTlJSEpsY1hWcGNtVW9KeTR1TDNOMGIzSmxjeTlFWlhSaGFXeFdhV1YzVTNSdmNtVW5LVHRjYm1OdmJuTjBJRVJsZEdGcGJGWnBaWGRCWTNScGIyNXpJRDBnY21WeGRXbHlaU2duTGk0dllXTjBhVzl1Y3k5RVpYUmhhV3hXYVdWM1FXTjBhVzl1Y3ljcE8xeHVZMjl1YzNRZ1JtbHNkR1Z5UW5WMGRHOXVJRDBnY21WeGRXbHlaU2duTGk5R2FXeDBaWEpDZFhSMGIyNHVhbk40SnlrN1hHNWNibU52Ym5OMElFMWxZWE4xY21WU2IzY2dQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEc1Y2JpQWdjSEp2Y0ZSNWNHVnpPaUI3WEc0Z0lDQWdiR0ZpWld4ek9pQlNaV0ZqZEM1UWNtOXdWSGx3WlhNdVlYSnlZWGt1YVhOU1pYRjFhWEpsWkNCY2JpQWdmU3hjYmx4dUlDQm5aWFJKYm1sMGFXRnNVM1JoZEdVNklHWjFibU4wYVc5dUtDa2dlMXh1SUNBZ0lISmxkSFZ5YmlCN2MyVnNaV04wWldRNklEQjlPMXh1SUNCOUxGeHVYRzRnSUdoaGJtUnNaVU5zYVdOck9pQm1kVzVqZEdsdmJpaHBibVJsZUNrZ2UxeHVJQ0FnSUdsbUlDaHBibVJsZUNBaFBTQjBhR2x6TG5OMFlYUmxMbk5sYkdWamRHVmtLU0I3WEc0Z0lDQWdJQ0IwYUdsekxuTmxkRk4wWVhSbEtIdHpaV3hsWTNSbFpEb2dhVzVrWlhoOUtUdGNiaUFnSUNBZ0lFUmxkR0ZwYkZacFpYZEJZM1JwYjI1ekxuVndaR0YwWlUxbFlYTjFjbVVvZEdocGN5NXdjbTl3Y3k1c1lXSmxiSE5iYVc1a1pYaGRLVHRjYmlBZ0lDQjlYRzRnSUgwc1hHNWNiaUFnY21WdVpHVnlPaUJtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdLRnh1SUNBZ0lDQWdMeThnUTNKbFlYUmxJR0VnY21Ga2FXOGdZblYwZEc5dUlHWnZjaUJsWVdOb0lHeGhZbVZzSUhCaGMzTmxaQ0JwYmlCMGJ5QjBhR1VnY0hKdmNITmNiaUFnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFNkdFpXRnpkWEpsVW05M0p6NWNiaUFnSUNBZ0lDQWdlM1JvYVhNdWNISnZjSE11YkdGaVpXeHpMbTFoY0NobWRXNWpkR2x2YmloamRYSk1ZV0psYkN3Z2FTa2dlMXh1SUNBZ0lDQWdJQ0FnSUdOdmJuTjBJSE5sYkdWamRHVmtJRDBnS0drZ1BUMGdkR2hwY3k1emRHRjBaUzV6Wld4bFkzUmxaQ2tnUHlBbmMyVnNaV04wWldRbklEb2dKMlJsYzJWc1pXTjBaV1FuWEc1Y2JpQWdJQ0FnSUNBZ0lDQmpiMjV6ZENCbWFXeDBaWEpDZFhSMGIyNVFjbTl3Y3lBOUlIdGNiaUFnSUNBZ0lDQWdJQ0FnSUd4aFltVnNPbU4xY2t4aFltVnNMQ0JjYmlBZ0lDQWdJQ0FnSUNBZ0lHaGhibVJzWlhJNmRHaHBjeTVvWVc1a2JHVkRiR2xqYXk1aWFXNWtLSFJvYVhNc2FTa3NYRzRnSUNBZ0lDQWdJQ0FnSUNCamJHRnpjMDVoYldVNkoyWnBiSFJsY2tKMWRIUnZiaWNySnlBbkszTmxiR1ZqZEdWa1hHNGdJQ0FnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUNoY2JpQWdJQ0FnSUNBZ0lDQWdJRHhHYVd4MFpYSkNkWFIwYjI0Z2V5NHVMbVpwYkhSbGNrSjFkSFJ2YmxCeWIzQnpmU0F2UGx4dUlDQWdJQ0FnSUNBZ0lDazdYRzRnSUNBZ0lDQWdJSDBzSUhSb2FYTXBmVnh1SUNBZ0lDQWdQQzlrYVhZK1hHNGdJQ0FnS1R0Y2JpQWdmVnh1ZlNrN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdUV1ZoYzNWeVpWSnZkenRjYmlKZGZRPT0iLCIvLyBTRUFSQ0hCT1hcbi8qanNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBGaWx0ZXJBY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9GaWx0ZXJBY3Rpb25zJyk7XG5cbnZhciBTZWFyY2hCb3ggPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnU2VhcmNoQm94JyxcblxuICBoYW5kbGVDaGFuZ2U6IGZ1bmN0aW9uIGhhbmRsZUNoYW5nZShlKSB7XG4gICAgRmlsdGVyQWN0aW9ucy51cGRhdGVTZWFyY2goZS50YXJnZXQudmFsdWUpO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ2Zvcm0nLFxuICAgICAgeyBjbGFzc05hbWU6ICdzZWFyY2hCb3gnLFxuICAgICAgICBvbkNoYW5nZTogdGhpcy5oYW5kbGVDaGFuZ2UsXG4gICAgICAgIG9uU3VibWl0OiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSB9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCgnaW5wdXQnLCB7IHR5cGU6ICd0ZXh0JywgcGxhY2Vob2xkZXI6ICdmaWx0ZXInLCByZWY6ICdzZWFyY2hUZXh0JyB9KVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNlYXJjaEJveDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OW5jbVZuYjNKNVgyWnZjM1JsY2k5a1lYUmhMV1Z1Wnk5b2IyNWxlWEJ2ZEM5a1pYWXZjMk55YVhCMGN5OTFhUzlUWldGeVkyaENiM2d1YW5ONElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN096czdPMEZCUjBFc1NVRkJUU3hoUVVGaExFZEJRVWNzVDBGQlR5eERRVUZETERCQ1FVRXdRaXhEUVVGRExFTkJRVU03TzBGQlJURkVMRWxCUVUwc1UwRkJVeXhIUVVGSExFdEJRVXNzUTBGQlF5eFhRVUZYTEVOQlFVTTdPenRCUVVOc1F5eGpRVUZaTEVWQlFVVXNjMEpCUVZNc1EwRkJReXhGUVVGRk8wRkJRM2hDTEdsQ1FVRmhMRU5CUVVNc1dVRkJXU3hEUVVGRExFTkJRVU1zUTBGQlF5eE5RVUZOTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNN1IwRkROVU03TzBGQlJVUXNVVUZCVFN4RlFVRkZMR3RDUVVGWE8wRkJRMnBDTEZkQlEwVTdPMUZCUVUwc1UwRkJVeXhGUVVGRExGZEJRVmM3UVVGRGVrSXNaMEpCUVZFc1JVRkJSU3hKUVVGSkxFTkJRVU1zV1VGQldTeEJRVUZETzBGQlF6VkNMR2RDUVVGUkxFVkJRVVVzVlVGQlV5eERRVUZETEVWQlFVTTdRVUZCUXl4cFFrRkJUeXhMUVVGTExFTkJRVU03VTBGQlF5eEJRVUZETzAxQlEzSkRMQ3RDUVVGUExFbEJRVWtzUlVGQlF5eE5RVUZOTEVWQlFVTXNWMEZCVnl4RlFVRkRMRkZCUVZFc1JVRkJReXhIUVVGSExFVkJRVU1zV1VGQldTeEhRVUZITzB0QlEzUkVMRU5CUTFBN1IwRkRTRHREUVVOR0xFTkJRVU1zUTBGQlF6czdRVUZGU0N4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExGTkJRVk1zUTBGQlF5SXNJbVpwYkdVaU9pSXZWWE5sY25NdlozSmxaMjl5ZVY5bWIzTjBaWEl2WkdGMFlTMWxibWN2YUc5dVpYbHdiM1F2WkdWMkwzTmpjbWx3ZEhNdmRXa3ZVMlZoY21Ob1FtOTRMbXB6ZUNJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHZJRk5GUVZKRFNFSlBXRnh1THlwcWMyaHBiblFnWlhOdVpYaDBPaUIwY25WbElDb3ZYRzVjYm1OdmJuTjBJRVpwYkhSbGNrRmpkR2x2Ym5NZ1BTQnlaWEYxYVhKbEtDY3VMaTloWTNScGIyNXpMMFpwYkhSbGNrRmpkR2x2Ym5NbktUdGNibHh1WTI5dWMzUWdVMlZoY21Ob1FtOTRJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4dUlDQm9ZVzVrYkdWRGFHRnVaMlU2SUdaMWJtTjBhVzl1S0dVcElIdGNiaUFnSUNCR2FXeDBaWEpCWTNScGIyNXpMblZ3WkdGMFpWTmxZWEpqYUNobExuUmhjbWRsZEM1MllXeDFaU2s3WEc0Z0lIMHNYRzVjYmlBZ2NtVnVaR1Z5T2lCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnUEdadmNtMGdZMnhoYzNOT1lXMWxQU2R6WldGeVkyaENiM2duWEc0Z0lDQWdJQ0FnSUc5dVEyaGhibWRsUFh0MGFHbHpMbWhoYm1Sc1pVTm9ZVzVuWlgwZ1hHNGdJQ0FnSUNBZ0lHOXVVM1ZpYldsMFBYdG1kVzVqZEdsdmJpaGxLWHR5WlhSMWNtNGdabUZzYzJVN2ZYMCtYRzRnSUNBZ0lDQWdJRHhwYm5CMWRDQjBlWEJsUFNkMFpYaDBKeUJ3YkdGalpXaHZiR1JsY2owblptbHNkR1Z5SnlCeVpXWTlKM05sWVhKamFGUmxlSFFuSUM4K0lGeHVJQ0FnSUNBZ1BDOW1iM0p0UGx4dUlDQWdJQ2s3WEc0Z0lIMWNibjBwTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlGTmxZWEpqYUVKdmVEdGNiaUpkZlE9PSIsIi8vIFNJREVCQVJcbi8qanNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBTZWFyY2hCb3ggPSByZXF1aXJlKCcuL1NlYXJjaEJveC5qc3gnKTtcbnZhciBGaWx0ZXJPcHRpb25Sb3cgPSByZXF1aXJlKCcuL0ZpbHRlck9wdGlvblJvdy5qc3gnKTtcbnZhciBGaWx0ZXJSZXN1bHRzVGFibGUgPSByZXF1aXJlKCcuL0ZpbHRlclJlc3VsdHNUYWJsZS5qc3gnKTtcbnZhciBGaWx0ZXJTdG9yZSA9IHJlcXVpcmUoJy4uL3N0b3Jlcy9GaWx0ZXJTdG9yZScpO1xuXG52YXIgU2lkZWJhciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdTaWRlYmFyJyxcblxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgRmlsdGVyU3RvcmUuYWRkRGFnU2V0TGlzdGVuZXIodGhpcy5fb25EYWdTZXQpO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZFVubW91bnQ6IGZ1bmN0aW9uIGNvbXBvbmVudERpZFVubW91bnQoKSB7XG4gICAgRmlsdGVyU3RvcmUucmVtb3ZlRGFnU2V0TGlzdGVuZXIodGhpcy5fb25EYWdTZXQpO1xuICB9LFxuXG4gIF9vbkRhZ1NldDogZnVuY3Rpb24gX29uRGFnU2V0KCkge1xuICAgIHRoaXMucmVmcy5ncmFpblJvdy5zZXRTdGF0ZSh7IHNlbGVjdGVkOiAxIH0pO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgJ2RpdicsXG4gICAgICB7IGNsYXNzTmFtZTogJ3NpZGViYXInIH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFNlYXJjaEJveCwgbnVsbCksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAgeyBjbGFzc05hbWU6ICdmaWx0ZXJPcHRpb25zJyB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZpbHRlck9wdGlvblJvdywgeyBuYW1lOiAnbWVhc3VyZScsIGxhYmVsczogWydJL08nLCAnQ1BVJywgJ01hcHBlcnMnLCAnUmVkdWNlcnMnXSB9KSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGaWx0ZXJPcHRpb25Sb3csIHsgbmFtZTogJ3RpbWUnLCBsYWJlbHM6IFsnRGF5JywgJ1dlZWsnLCAnTW9udGgnXSB9KSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGaWx0ZXJPcHRpb25Sb3csIHsgcmVmOiAnZ3JhaW5Sb3cnLCBuYW1lOiAnZ3JhaW4nLCBsYWJlbHM6IFsnREFHJywgJ1Rhc2snXSB9KVxuICAgICAgKSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRmlsdGVyUmVzdWx0c1RhYmxlLCBudWxsKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNpZGViYXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTluY21WbmIzSjVYMlp2YzNSbGNpOWtZWFJoTFdWdVp5OW9iMjVsZVhCdmRDOWtaWFl2YzJOeWFYQjBjeTkxYVM5VGFXUmxZbUZ5TG1wemVDSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPenRCUVVkQkxFbEJRVTBzVTBGQlV5eEhRVUZITEU5QlFVOHNRMEZCUXl4cFFrRkJhVUlzUTBGQlF5eERRVUZETzBGQlF6ZERMRWxCUVUwc1pVRkJaU3hIUVVGSExFOUJRVThzUTBGQlF5eDFRa0ZCZFVJc1EwRkJReXhEUVVGRE8wRkJRM3BFTEVsQlFVMHNhMEpCUVd0Q0xFZEJRVWNzVDBGQlR5eERRVUZETERCQ1FVRXdRaXhEUVVGRExFTkJRVU03UVVGREwwUXNTVUZCVFN4WFFVRlhMRWRCUVVjc1QwRkJUeXhEUVVGRExIVkNRVUYxUWl4RFFVRkRMRU5CUVVNN08wRkJSWEpFTEVsQlFVMHNUMEZCVHl4SFFVRkhMRXRCUVVzc1EwRkJReXhYUVVGWExFTkJRVU03T3p0QlFVVm9ReXh0UWtGQmFVSXNSVUZCUlN3MlFrRkJWenRCUVVNMVFpeGxRVUZYTEVOQlFVTXNhVUpCUVdsQ0xFTkJRVU1zU1VGQlNTeERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRPMGRCUXk5RE96dEJRVVZFTEhGQ1FVRnRRaXhGUVVGRkxDdENRVUZYTzBGQlF6bENMR1ZCUVZjc1EwRkJReXh2UWtGQmIwSXNRMEZCUXl4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03UjBGRGJFUTdPMEZCUlVRc1YwRkJVeXhGUVVGRkxIRkNRVUZWTzBGQlEyNUNMRkZCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEZGQlFWRXNRMEZCUXl4RlFVRkRMRkZCUVZFc1JVRkJSU3hEUVVGRExFVkJRVU1zUTBGQlF5eERRVUZETzBkQlF6VkRPenRCUVVWRUxGRkJRVTBzUlVGQlJTeHJRa0ZCVnp0QlFVTnFRaXhYUVVORk96dFJRVUZMTEZOQlFWTXNSVUZCUXl4VFFVRlRPMDFCUTNSQ0xHOUNRVUZETEZOQlFWTXNUMEZCUnp0TlFVTmlPenRWUVVGTExGTkJRVk1zUlVGQlF5eGxRVUZsTzFGQlF6VkNMRzlDUVVGRExHVkJRV1VzU1VGQlF5eEpRVUZKTEVWQlFVVXNVMEZCVXl4QlFVRkRMRVZCUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU1zUzBGQlN5eEZRVUZETEV0QlFVc3NSVUZCUXl4VFFVRlRMRVZCUVVNc1ZVRkJWU3hEUVVGRExFRkJRVU1zUjBGQlJ6dFJRVU5vUml4dlFrRkJReXhsUVVGbExFbEJRVU1zU1VGQlNTeEZRVUZGTEUxQlFVMHNRVUZCUXl4RlFVRkRMRTFCUVUwc1JVRkJSU3hEUVVGRExFdEJRVXNzUlVGQlF5eE5RVUZOTEVWQlFVTXNUMEZCVHl4RFFVRkRMRUZCUVVNc1IwRkJSenRSUVVOcVJTeHZRa0ZCUXl4bFFVRmxMRWxCUVVNc1IwRkJSeXhGUVVGRExGVkJRVlVzUlVGQlF5eEpRVUZKTEVWQlFVVXNUMEZCVHl4QlFVRkRMRVZCUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU1zUzBGQlN5eEZRVUZETEUxQlFVMHNRMEZCUXl4QlFVRkRMRWRCUVVjN1QwRkRja1U3VFVGRFRpeHZRa0ZCUXl4clFrRkJhMElzVDBGQlJ6dExRVU5zUWl4RFFVTk9PMGRCUTBnN1EwRkRSaXhEUVVGRExFTkJRVU03TzBGQlJVZ3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhQUVVGUExFTkJRVU1pTENKbWFXeGxJam9pTDFWelpYSnpMMmR5WldkdmNubGZabTl6ZEdWeUwyUmhkR0V0Wlc1bkwyaHZibVY1Y0c5MEwyUmxkaTl6WTNKcGNIUnpMM1ZwTDFOcFpHVmlZWEl1YW5ONElpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lMeThnVTBsRVJVSkJVbHh1THlwcWMyaHBiblFnWlhOdVpYaDBPaUIwY25WbElDb3ZYRzVjYm1OdmJuTjBJRk5sWVhKamFFSnZlQ0E5SUhKbGNYVnBjbVVvSnk0dlUyVmhjbU5vUW05NExtcHplQ2NwTzF4dVkyOXVjM1FnUm1sc2RHVnlUM0IwYVc5dVVtOTNJRDBnY21WeGRXbHlaU2duTGk5R2FXeDBaWEpQY0hScGIyNVNiM2N1YW5ONEp5azdYRzVqYjI1emRDQkdhV3gwWlhKU1pYTjFiSFJ6VkdGaWJHVWdQU0J5WlhGMWFYSmxLQ2N1TDBacGJIUmxjbEpsYzNWc2RITlVZV0pzWlM1cWMzZ25LVHRjYm1OdmJuTjBJRVpwYkhSbGNsTjBiM0psSUQwZ2NtVnhkV2x5WlNnbkxpNHZjM1J2Y21WekwwWnBiSFJsY2xOMGIzSmxKeWs3WEc1Y2JtTnZibk4wSUZOcFpHVmlZWElnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hHNWNiaUFnWTI5dGNHOXVaVzUwUkdsa1RXOTFiblE2SUdaMWJtTjBhVzl1S0NrZ2UxeHVJQ0FnSUVacGJIUmxjbE4wYjNKbExtRmtaRVJoWjFObGRFeHBjM1JsYm1WeUtIUm9hWE11WDI5dVJHRm5VMlYwS1RzZ1hHNGdJSDBzWEc1Y2JpQWdZMjl0Y0c5dVpXNTBSR2xrVlc1dGIzVnVkRG9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnUm1sc2RHVnlVM1J2Y21VdWNtVnRiM1psUkdGblUyVjBUR2x6ZEdWdVpYSW9kR2hwY3k1ZmIyNUVZV2RUWlhRcE95QmNiaUFnZlN4Y2JseHVJQ0JmYjI1RVlXZFRaWFE2SUdaMWJtTjBhVzl1S0NsN1hHNGdJQ0FnZEdocGN5NXlaV1p6TG1keVlXbHVVbTkzTG5ObGRGTjBZWFJsS0h0elpXeGxZM1JsWkRvZ01YMHBPMXh1SUNCOUxGeHVYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBTZHphV1JsWW1GeUp6NWNiaUFnSUNBZ0lDQWdQRk5sWVhKamFFSnZlQ0F2UGx4dUlDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDBuWm1sc2RHVnlUM0IwYVc5dWN5YytYRzRnSUNBZ0lDQWdJQ0FnUEVacGJIUmxjazl3ZEdsdmJsSnZkeUJ1WVcxbFBYc25iV1ZoYzNWeVpTZDlJR3hoWW1Wc2N6MTdXeWRKTDA4bkxDZERVRlVuTENkTllYQndaWEp6Snl3blVtVmtkV05sY25NblhYMGdMejVjYmlBZ0lDQWdJQ0FnSUNBOFJtbHNkR1Z5VDNCMGFXOXVVbTkzSUc1aGJXVTlleWQwYVcxbEozMGdiR0ZpWld4elBYdGJKMFJoZVNjc0oxZGxaV3NuTENkTmIyNTBhQ2RkZlNBdlBseHVJQ0FnSUNBZ0lDQWdJRHhHYVd4MFpYSlBjSFJwYjI1U2IzY2djbVZtUFNkbmNtRnBibEp2ZHljZ2JtRnRaVDE3SjJkeVlXbHVKMzBnYkdGaVpXeHpQWHRiSjBSQlJ5Y3NKMVJoYzJzblhYMGdMejVjYmlBZ0lDQWdJQ0FnUEM5a2FYWStYRzRnSUNBZ0lDQWdJRHhHYVd4MFpYSlNaWE4xYkhSelZHRmliR1VnTHo1Y2JpQWdJQ0FnSUR3dlpHbDJQbHh1SUNBZ0lDazdYRzRnSUgxY2JuMHBPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUZOcFpHVmlZWEk3WEc0aVhYMD0iLCIvLyBkM0NoYXJ0LmpzXG4vKmpzaGludCBlc25leHQ6IHRydWUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZDNDaGFydCA9IHt9O1xudmFyIERldGFpbFZpZXdBY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9EZXRhaWxWaWV3QWN0aW9ucycpO1xuXG5kM0NoYXJ0LmNyZWF0ZSA9IGZ1bmN0aW9uIChlbCkge1xuXG4gIHZhciBjaGFydCA9IGQzLnNlbGVjdChlbCkuYXBwZW5kKCdzdmcnKS5hdHRyKCdjbGFzcycsICdtYWluQ2hhcnQnKS5vbignbW91c2Vtb3ZlJywgZDNDaGFydC5tb3VzZW1vdmUpO1xuXG4gIGNoYXJ0LmFwcGVuZCgnY2xpcFBhdGgnKS5hdHRyKCdpZCcsICdwbG90QXJlYUNsaXAnKS5hcHBlbmQoJ3JlY3QnKS5hdHRyKCdpZCcsICdwbG90QXJlYUNsaXBSZWN0Jyk7XG5cbiAgdmFyIHBsb3RBcmVhID0gY2hhcnQuYXBwZW5kKCdnJyk7XG5cbiAgcGxvdEFyZWEuYXBwZW5kKCdzdmc6cGF0aCcpLmF0dHIoJ2NsYXNzJywgJ2xpbmUnKTtcblxuICBwbG90QXJlYS5hcHBlbmQoJ3N2ZzpsaW5lJykuYXR0cignY2xhc3MnLCAnZm9jdXNMaW5lJyk7XG5cbiAgY2hhcnQuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAneEF4aXMnKTtcblxuICBjaGFydC5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd5QXhpcycpO1xuXG4gIHZhciBuYXZDaGFydCA9IGQzLnNlbGVjdChlbCkuYXBwZW5kKCdzdmcnKS5jbGFzc2VkKCduYXZpZ2F0b3InLCB0cnVlKTtcblxuICBuYXZDaGFydC5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd4QXhpcycpO1xuXG4gIG5hdkNoYXJ0LmFwcGVuZCgncGF0aCcpLmF0dHIoJ2NsYXNzJywgJ2ZpbGwnKTtcblxuICBuYXZDaGFydC5hcHBlbmQoJ3BhdGgnKS5hdHRyKCdjbGFzcycsICdsaW5lJykuYXR0cignc3Ryb2tlJywgJ2JsdWUnKS5hdHRyKCdzdHJva2Utd2lkdGgnLCAyKS5hdHRyKCdmaWxsJywgJ25vbmUnKTtcblxuICBuYXZDaGFydC5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICd2aWV3cG9ydCcpO1xufTtcblxuZDNDaGFydC5saW5lRnVuY3Rpb24gPSBmdW5jdGlvbiAoc2NhbGVzKSB7XG4gIHJldHVybiBkMy5zdmcubGluZSgpLngoZnVuY3Rpb24gKGQpIHtcbiAgICByZXR1cm4gc2NhbGVzLngoZC5kYXRlKTtcbiAgfSkueShmdW5jdGlvbiAoZCkge1xuICAgIHJldHVybiBzY2FsZXMueShkLnZhbHVlKTtcbiAgfSkuaW50ZXJwb2xhdGUoJ2xpbmVhcicpO1xufTtcblxuLy8gU0laSU5HIElORk9STUFUSU9OXG5cbmQzQ2hhcnQubWFyZ2lucyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHsgYm90dG9tOiA1MCwgbGVmdDogNzUgfTtcbn07XG5cbmQzQ2hhcnQubWFpblNpemUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBjaGFydCA9IGQzLnNlbGVjdCgnc3ZnJylbMF1bMF07XG4gIHZhciB3aWR0aCA9IGNoYXJ0Lm9mZnNldFdpZHRoO1xuICB2YXIgaGVpZ2h0ID0gY2hhcnQub2Zmc2V0SGVpZ2h0O1xuICByZXR1cm4geyB3aWR0aDogd2lkdGgsIGhlaWdodDogaGVpZ2h0IH07XG59O1xuXG5kM0NoYXJ0Lm5hdlNpemUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBjaGFydCA9IGQzLnNlbGVjdCgnc3ZnJylbMF1bMF07XG4gIHZhciB3aWR0aCA9IGNoYXJ0Lm9mZnNldFdpZHRoO1xuICB2YXIgaGVpZ2h0ID0gY2hhcnQub2Zmc2V0SGVpZ2h0ICogKDEgLyA2KTtcbiAgcmV0dXJuIHsgd2lkdGg6IHdpZHRoLCBoZWlnaHQ6IGhlaWdodCB9O1xufTtcblxuZDNDaGFydC51cGRhdGUgPSBmdW5jdGlvbiAoZGF0YSkge1xuXG4gIC8vIE1BSU4gQ0hBUlRcbiAgZDNDaGFydC5kYXRhID0gZGF0YTtcbiAgdmFyIG1haW5TaXplID0gdGhpcy5tYWluU2l6ZSgpO1xuICB2YXIgbWFyZ2lucyA9IHRoaXMubWFyZ2lucygpO1xuICBkM0NoYXJ0Lm1haW5TY2FsZXMgPSB0aGlzLl9zY2FsZXMoe1xuICAgIHg6IG1hcmdpbnMubGVmdCxcbiAgICB5OiAwLFxuICAgIHdpZHRoOiBtYWluU2l6ZS53aWR0aCxcbiAgICBoZWlnaHQ6IG1haW5TaXplLmhlaWdodCAtIG1hcmdpbnMuYm90dG9tXG4gIH0pO1xuXG4gIHZhciBsaW5lRnVuYyA9IHRoaXMubGluZUZ1bmN0aW9uKGQzQ2hhcnQubWFpblNjYWxlcyk7XG5cbiAgdmFyIHhBeGlzID0gZDMuc3ZnLmF4aXMoKS5zY2FsZShkM0NoYXJ0Lm1haW5TY2FsZXMueCkub3JpZW50KCdib3R0b20nKS50aWNrcyg2KTtcblxuICB2YXIgeUF4aXMgPSBkMy5zdmcuYXhpcygpLnNjYWxlKGQzQ2hhcnQubWFpblNjYWxlcy55KS5vcmllbnQoJ2xlZnQnKS50aWNrRm9ybWF0KGQzLmZvcm1hdChcIi4zc1wiKSkudGlja3MoNSk7XG5cbiAgdmFyIG1haW5DaGFydCA9IGQzLnNlbGVjdCgnLm1haW5DaGFydCcpO1xuICBtYWluQ2hhcnQuc2VsZWN0KCcueEF4aXMnKS5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsICcgKyAobWFpblNpemUuaGVpZ2h0IC0gbWFyZ2lucy5ib3R0b20pICsgJyknKS50cmFuc2l0aW9uKCkuY2FsbCh4QXhpcyk7XG4gIG1haW5DaGFydC5zZWxlY3QoJy55QXhpcycpLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIG1hcmdpbnMubGVmdCArICcsIDApJykudHJhbnNpdGlvbigpLmNhbGwoeUF4aXMpO1xuICBtYWluQ2hhcnQuc2VsZWN0KCcubGluZScpLnRyYW5zaXRpb24oKS5hdHRyKCdkJywgbGluZUZ1bmMoZDNDaGFydC5kYXRhKSk7XG5cbiAgLy8gTkFWIENIQVJUXG4gIHZhciBuYXZTaXplID0gdGhpcy5uYXZTaXplKCk7XG4gIGQzQ2hhcnQubmF2U2NhbGVzID0gdGhpcy5fc2NhbGVzKHtcbiAgICB4OiBtYXJnaW5zLmxlZnQsXG4gICAgeTogMCxcbiAgICB3aWR0aDogbmF2U2l6ZS53aWR0aCxcbiAgICBoZWlnaHQ6IG5hdlNpemUuaGVpZ2h0XG4gIH0pO1xuXG4gIHZhciBuYXZDaGFydCA9IGQzLnNlbGVjdCgnLm5hdmlnYXRvcicpLmF0dHIoJ3dpZHRoJywgbmF2U2l6ZS53aWR0aCArIG1hcmdpbnMubGVmdCkuYXR0cignaGVpZ2h0JywgbmF2U2l6ZS5oZWlnaHQgKyBtYXJnaW5zLmJvdHRvbSkuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgbWFyZ2lucy5sZWZ0ICsgJywnICsgbWFyZ2lucy5ib3R0b20gKyAnKScpO1xuXG4gIHZhciBuYXZYQXhpcyA9IGQzLnN2Zy5heGlzKCkuc2NhbGUoZDNDaGFydC5uYXZTY2FsZXMueCkub3JpZW50KCdib3R0b20nKS50aWNrcyg1KTtcblxuICBuYXZDaGFydC5zZWxlY3QoJy54QXhpcycpLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwnICsgbmF2U2l6ZS5oZWlnaHQgKyAnKScpLmNhbGwobmF2WEF4aXMpO1xuXG4gIC8vIE5hdiBHcmFwaCBGdW5jdGlvbiBmb3IgYXJlYVxuICB2YXIgbmF2RmlsbCA9IGQzLnN2Zy5hcmVhKCkueChmdW5jdGlvbiAoZCkge1xuICAgIHJldHVybiBkM0NoYXJ0Lm5hdlNjYWxlcy54KGQuZGF0ZSk7XG4gIH0pLnkwKG5hdlNpemUuaGVpZ2h0KS55MShmdW5jdGlvbiAoZCkge1xuICAgIHJldHVybiBkM0NoYXJ0Lm5hdlNjYWxlcy55KGQudmFsdWUpO1xuICB9KTtcblxuICAvLyBOYXYgR3JhcGggRnVuY3Rpb24gZm9yIGxpbmVcbiAgdmFyIG5hdkxpbmUgPSBkMy5zdmcubGluZSgpLngoZnVuY3Rpb24gKGQpIHtcbiAgICByZXR1cm4gZDNDaGFydC5uYXZTY2FsZXMueChkLmRhdGUpO1xuICB9KS55KGZ1bmN0aW9uIChkKSB7XG4gICAgcmV0dXJuIGQzQ2hhcnQubmF2U2NhbGVzLnkoZC52YWx1ZSk7XG4gIH0pO1xuXG4gIG5hdkNoYXJ0LnNlbGVjdCgnLmZpbGwnKS50cmFuc2l0aW9uKCkuYXR0cignZCcsIG5hdkZpbGwoZDNDaGFydC5kYXRhKSk7XG5cbiAgbmF2Q2hhcnQuc2VsZWN0KCcubGluZScpLnRyYW5zaXRpb24oKS5hdHRyKCdkJywgbmF2TGluZShkM0NoYXJ0LmRhdGEpKTtcblxuICB2YXIgdmlld3BvcnQgPSBkMy5zdmcuYnJ1c2goKS54KGQzQ2hhcnQubmF2U2NhbGVzLngpLm9uKCdicnVzaCcsIGZ1bmN0aW9uICgpIHtcbiAgICBkM0NoYXJ0Lm1haW5TY2FsZXMueC5kb21haW4odmlld3BvcnQuZW1wdHkoKSA/IGQzQ2hhcnQubmF2U2NhbGVzLnguZG9tYWluKCkgOiB2aWV3cG9ydC5leHRlbnQoKSk7XG4gICAgZDNDaGFydC5yZWRyYXdDaGFydChkM0NoYXJ0Lm1haW5TY2FsZXMsIHhBeGlzLCBkM0NoYXJ0LmRhdGEpO1xuICB9KTtcblxuICBuYXZDaGFydC5zZWxlY3QoJy52aWV3cG9ydCcpLmNhbGwodmlld3BvcnQpLnNlbGVjdEFsbCgncmVjdCcpLmF0dHIoJ2hlaWdodCcsIG5hdlNpemUuaGVpZ2h0KTtcbn07XG5cbmQzQ2hhcnQucmVkcmF3Q2hhcnQgPSBmdW5jdGlvbiAoc2NhbGVzLCB4QXhpcywgZGF0YSkge1xuICB2YXIgbGluZUZ1bmMgPSB0aGlzLmxpbmVGdW5jdGlvbihzY2FsZXMpO1xuICB4QXhpcy5zY2FsZShzY2FsZXMueCk7XG4gIGQzLnNlbGVjdCgnLm1haW5DaGFydCcpLnNlbGVjdCgnLnhBeGlzJykuY2FsbCh4QXhpcyk7XG4gIGQzLnNlbGVjdCgnLm1haW5DaGFydCcpLnNlbGVjdCgnLmxpbmUnKS5hdHRyKCdkJywgbGluZUZ1bmMoZDNDaGFydC5kYXRhKSk7XG59O1xuXG5kM0NoYXJ0Ll9zY2FsZXMgPSBmdW5jdGlvbiAocmVjdCkge1xuXG4gIHZhciBkYXRlcyA9IGQzQ2hhcnQuZGF0YS5tYXAoZnVuY3Rpb24gKGN1cikge1xuICAgIHJldHVybiBjdXIuZGF0ZTtcbiAgfSk7XG4gIHZhciB2YWx1ZXMgPSBkM0NoYXJ0LmRhdGEubWFwKGZ1bmN0aW9uIChjdXIpIHtcbiAgICByZXR1cm4gY3VyLnZhbHVlO1xuICB9KTtcblxuICB2YXIgbWF4RGF0ZSA9IG5ldyBEYXRlKE1hdGgubWF4LmFwcGx5KG51bGwsIGRhdGVzKSk7XG4gIHZhciBtaW5EYXRlID0gbmV3IERhdGUoTWF0aC5taW4uYXBwbHkobnVsbCwgZGF0ZXMpKTtcbiAgdmFyIG1heFZhbHVlID0gTWF0aC5tYXguYXBwbHkobnVsbCwgdmFsdWVzKTtcbiAgdmFyIG1pblZhbHVlID0gTWF0aC5taW4uYXBwbHkobnVsbCwgdmFsdWVzKTtcblxuICB2YXIgeFNjYWxlID0gZDMudGltZS5zY2FsZSgpLmRvbWFpbihbbWluRGF0ZSwgbWF4RGF0ZV0pLnJhbmdlKFtyZWN0LngsIHJlY3Qud2lkdGhdKTtcblxuICB2YXIgeVNjYWxlID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFttaW5WYWx1ZSAqIDAuOCwgbWF4VmFsdWUgKiAxLjFdKS5yYW5nZShbcmVjdC5oZWlnaHQsIHJlY3QueV0pO1xuXG4gIHJldHVybiB7IHg6IHhTY2FsZSwgeTogeVNjYWxlIH07XG59O1xuXG5kM0NoYXJ0LmJpc2VjdERhdGUgPSBkMy5iaXNlY3RvcihmdW5jdGlvbiAoZCkge1xuICByZXR1cm4gZC5kYXRlO1xufSkubGVmdDtcblxuLy8gRHJhdyBhIHZlcnRpY2FsIGxpbmUgYW5kIHVwZGF0ZSB0aGUgZm9jdXMgZGF0ZSAvIHZhbHVlXG5kM0NoYXJ0Lm1vdXNlbW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gU25hcCB0byBvbmUgbW91c2UgcG9pbnQgYmVjYXVzZSB3aWxsIG5ldmVyIG1vdXNlIG92ZXIgYSBkYXRlIGV4YWN0bHlcbiAgdmFyIG1vdXNlb3ZlckRhdGUgPSBkM0NoYXJ0Lm1haW5TY2FsZXMueC5pbnZlcnQoZDMubW91c2UodGhpcylbMF0pLFxuICAgICAgaW5kZXggPSBkM0NoYXJ0LmJpc2VjdERhdGUoZDNDaGFydC5kYXRhLCBtb3VzZW92ZXJEYXRlLCAxKSxcbiAgICAgIHBvaW50QmVmb3JlRGF0ZSA9IGQzQ2hhcnQuZGF0YVtpbmRleCAtIDFdLFxuICAgICAgcG9pbnRPbkRhdGUgPSBkM0NoYXJ0LmRhdGFbaW5kZXhdLFxuICAgICAgcG9pbnQgPSBtb3VzZW92ZXJEYXRlIC0gcG9pbnRCZWZvcmVEYXRlLmRhdGUgPiBwb2ludE9uRGF0ZS5kYXRlIC0gbW91c2VvdmVyRGF0ZSA/IHBvaW50T25EYXRlIDogcG9pbnRCZWZvcmVEYXRlO1xuICBEZXRhaWxWaWV3QWN0aW9ucy51cGRhdGVGb2N1c0RhdGEocG9pbnQuZGF0ZSwgcG9pbnQudmFsdWUpO1xuICAvLyBEcmF3IHRoZSBsaW5lXG4gIHZhciBtYXJnaW5zID0gZDNDaGFydC5tYXJnaW5zKCk7XG4gIHZhciB4ID0gZDMubW91c2UodGhpcylbMF0gPCBtYXJnaW5zLmxlZnQgPyBtYXJnaW5zLmxlZnQgOiBkMy5tb3VzZSh0aGlzKVswXTtcbiAgdmFyIGZvY3VzTGluZSA9IGQzLnNlbGVjdCgnLmZvY3VzTGluZScpLmF0dHIoJ3gxJywgeCkuYXR0cigneDInLCB4KS5hdHRyKCd5MScsIDApLmF0dHIoJ3kxJywgZDNDaGFydC5tYWluU2l6ZSgpLmhlaWdodCAtIG1hcmdpbnMuYm90dG9tKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZDNDaGFydDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OW5jbVZuYjNKNVgyWnZjM1JsY2k5a1lYUmhMV1Z1Wnk5b2IyNWxlWEJ2ZEM5a1pYWXZjMk55YVhCMGN5OTFhUzlrTTBOb1lYSjBMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN08wRkJSMEVzU1VGQlRTeFBRVUZQTEVkQlFVY3NSVUZCUlN4RFFVRkRPMEZCUTI1Q0xFbEJRVTBzYVVKQlFXbENMRWRCUVVjc1QwRkJUeXhEUVVGRExEaENRVUU0UWl4RFFVRkRMRU5CUVVNN08wRkJSV3hGTEU5QlFVOHNRMEZCUXl4TlFVRk5MRWRCUVVjc1ZVRkJVeXhGUVVGRkxFVkJRVVU3TzBGQlJUVkNMRTFCUVUwc1MwRkJTeXhIUVVGSExFVkJRVVVzUTBGQlF5eE5RVUZOTEVOQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNc1RVRkJUU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVU4wUXl4SlFVRkpMRU5CUVVNc1QwRkJUeXhGUVVGRkxGZEJRVmNzUTBGQlF5eERRVU14UWl4RlFVRkZMRU5CUVVNc1YwRkJWeXhGUVVGRkxFOUJRVThzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXpzN1FVRkZkRU1zVDBGQlN5eERRVUZETEUxQlFVMHNRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkRja0lzU1VGQlNTeERRVUZETEVsQlFVa3NSVUZCUlN4alFVRmpMRU5CUVVNc1EwRkRNVUlzVFVGQlRTeERRVUZETEUxQlFVMHNRMEZCUXl4RFFVTmtMRWxCUVVrc1EwRkJReXhKUVVGSkxFVkJRVVVzYTBKQlFXdENMRU5CUVVNc1EwRkJRenM3UVVGRmJFTXNUVUZCVFN4UlFVRlJMRWRCUVVjc1MwRkJTeXhEUVVGRExFMUJRVTBzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXpzN1FVRkZia01zVlVGQlVTeERRVU5NTEUxQlFVMHNRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkRiRUlzU1VGQlNTeERRVUZETEU5QlFVOHNSVUZCUlN4TlFVRk5MRU5CUVVNc1EwRkJRenM3UVVGRmVrSXNWVUZCVVN4RFFVTk1MRTFCUVUwc1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGRGJFSXNTVUZCU1N4RFFVRkRMRTlCUVU4c1JVRkJSU3hYUVVGWExFTkJRVU1zUTBGQlF6czdRVUZGT1VJc1QwRkJTeXhEUVVGRExFMUJRVTBzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZEWkN4SlFVRkpMRU5CUVVNc1QwRkJUeXhGUVVGRkxFOUJRVThzUTBGQlF5eERRVUZET3p0QlFVVXhRaXhQUVVGTExFTkJRVU1zVFVGQlRTeERRVUZETEVkQlFVY3NRMEZCUXl4RFFVTmtMRWxCUVVrc1EwRkJReXhQUVVGUExFVkJRVVVzVDBGQlR5eERRVUZETEVOQlFVTTdPMEZCUlRGQ0xFMUJRVTBzVVVGQlVTeEhRVUZITEVWQlFVVXNRMEZCUXl4TlFVRk5MRU5CUVVNc1JVRkJSU3hEUVVGRExFTkJRVU1zVFVGQlRTeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVTjZReXhQUVVGUExFTkJRVU1zVjBGQlZ5eEZRVUZGTEVsQlFVa3NRMEZCUXl4RFFVRkRPenRCUVVVNVFpeFZRVUZSTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVOcVFpeEpRVUZKTEVOQlFVTXNUMEZCVHl4RlFVRkZMRTlCUVU4c1EwRkJReXhEUVVGRE96dEJRVVV4UWl4VlFVRlJMRU5CUVVNc1RVRkJUU3hEUVVGRExFMUJRVTBzUTBGQlF5eERRVU53UWl4SlFVRkpMRU5CUVVNc1QwRkJUeXhGUVVGRkxFMUJRVTBzUTBGQlF5eERRVUZET3p0QlFVVjZRaXhWUVVGUkxFTkJRVU1zVFVGQlRTeERRVUZETEUxQlFVMHNRMEZCUXl4RFFVTndRaXhKUVVGSkxFTkJRVU1zVDBGQlR5eEZRVUZGTEUxQlFVMHNRMEZCUXl4RFFVTnlRaXhKUVVGSkxFTkJRVU1zVVVGQlVTeEZRVUZGTEUxQlFVMHNRMEZCUXl4RFFVTjBRaXhKUVVGSkxFTkJRVU1zWTBGQll5eEZRVUZGTEVOQlFVTXNRMEZCUXl4RFFVTjJRaXhKUVVGSkxFTkJRVU1zVFVGQlRTeEZRVUZGTEUxQlFVMHNRMEZCUXl4RFFVRkRPenRCUVVWNFFpeFZRVUZSTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVOcVFpeEpRVUZKTEVOQlFVTXNUMEZCVHl4RlFVRkZMRlZCUVZVc1EwRkJReXhEUVVGRE8wTkJRemxDTEVOQlFVTTdPMEZCUlVZc1QwRkJUeXhEUVVGRExGbEJRVmtzUjBGQlJ5eFZRVUZUTEUxQlFVMHNSVUZCUlR0QlFVTjBReXhUUVVGUExFVkJRVVVzUTBGQlF5eEhRVUZITEVOQlFVTXNTVUZCU1N4RlFVRkZMRU5CUTJwQ0xFTkJRVU1zUTBGQlF5eFZRVUZUTEVOQlFVTXNSVUZCUlR0QlFVTmlMRmRCUVU4c1RVRkJUU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1IwRkRla0lzUTBGQlF5eERRVU5FTEVOQlFVTXNRMEZCUXl4VlFVRlRMRU5CUVVNc1JVRkJSVHRCUVVOaUxGZEJRVThzVFVGQlRTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU03UjBGRE1VSXNRMEZCUXl4RFFVTkVMRmRCUVZjc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dERRVU14UWl4RFFVRkRPenM3TzBGQlNVWXNUMEZCVHl4RFFVRkRMRTlCUVU4c1IwRkJSeXhaUVVGWE8wRkJRek5DTEZOQlFVOHNSVUZCUXl4TlFVRk5MRVZCUVVNc1JVRkJSU3hGUVVGRExFbEJRVWtzUlVGQlF5eEZRVUZGTEVWQlFVTXNRMEZCUXp0RFFVTTFRaXhEUVVGRE96dEJRVVZHTEU5QlFVOHNRMEZCUXl4UlFVRlJMRWRCUVVjc1dVRkJWenRCUVVNMVFpeE5RVUZOTEV0QlFVc3NSMEZCUnl4RlFVRkZMRU5CUVVNc1RVRkJUU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRM0pETEUxQlFVMHNTMEZCU3l4SFFVRkhMRXRCUVVzc1EwRkJReXhYUVVGWExFTkJRVU03UVVGRGFFTXNUVUZCVFN4TlFVRk5MRWRCUVVjc1MwRkJTeXhEUVVGRExGbEJRVmtzUTBGQlF6dEJRVU5zUXl4VFFVRlBMRVZCUVVNc1MwRkJTeXhGUVVGRExFdEJRVXNzUlVGQlJTeE5RVUZOTEVWQlFVTXNUVUZCVFN4RlFVRkRMRU5CUVVNN1EwRkRja01zUTBGQlF6czdRVUZGUml4UFFVRlBMRU5CUVVNc1QwRkJUeXhIUVVGSExGbEJRVmM3UVVGRE0wSXNUVUZCVFN4TFFVRkxMRWRCUVVjc1JVRkJSU3hEUVVGRExFMUJRVTBzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU55UXl4TlFVRk5MRXRCUVVzc1IwRkJSeXhMUVVGTExFTkJRVU1zVjBGQlZ5eERRVUZETzBGQlEyaERMRTFCUVUwc1RVRkJUU3hIUVVGSExFdEJRVXNzUTBGQlF5eFpRVUZaTEVsQlFVa3NRMEZCUXl4SFFVRkRMRU5CUVVNc1EwRkJRU3hCUVVGRExFTkJRVU03UVVGRE1VTXNVMEZCVHl4RlFVRkRMRXRCUVVzc1JVRkJReXhMUVVGTExFVkJRVVVzVFVGQlRTeEZRVUZETEUxQlFVMHNSVUZCUXl4RFFVRkRPME5CUTNKRExFTkJRVU03TzBGQlJVWXNUMEZCVHl4RFFVRkRMRTFCUVUwc1IwRkJSeXhWUVVGVExFbEJRVWtzUlVGQlJUczdPMEZCUnpsQ0xGTkJRVThzUTBGQlF5eEpRVUZKTEVkQlFVY3NTVUZCU1N4RFFVRkRPMEZCUTNCQ0xFMUJRVTBzVVVGQlVTeEhRVUZITEVsQlFVa3NRMEZCUXl4UlFVRlJMRVZCUVVVc1EwRkJRenRCUVVOcVF5eE5RVUZOTEU5QlFVOHNSMEZCUnl4SlFVRkpMRU5CUVVNc1QwRkJUeXhGUVVGRkxFTkJRVU03UVVGREwwSXNVMEZCVHl4RFFVRkRMRlZCUVZVc1IwRkJSeXhKUVVGSkxFTkJRVU1zVDBGQlR5eERRVUZETzBGQlF6bENMRXRCUVVNc1JVRkJReXhQUVVGUExFTkJRVU1zU1VGQlNUdEJRVU5rTEV0QlFVTXNSVUZCUXl4RFFVRkRPMEZCUTBnc1UwRkJTeXhGUVVGRExGRkJRVkVzUTBGQlF5eExRVUZMTzBGQlEzQkNMRlZCUVUwc1JVRkJReXhSUVVGUkxFTkJRVU1zVFVGQlRTeEhRVUZITEU5QlFVOHNRMEZCUXl4TlFVRk5PMGRCUTNoRExFTkJRVU1zUTBGQlF6czdRVUZGVEN4TlFVRk5MRkZCUVZFc1IwRkJSeXhKUVVGSkxFTkJRVU1zV1VGQldTeERRVUZETEU5QlFVOHNRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkJRenM3UVVGRmRrUXNUVUZCVFN4TFFVRkxMRWRCUVVjc1JVRkJSU3hEUVVGRExFZEJRVWNzUTBGQlF5eEpRVUZKTEVWQlFVVXNRMEZEZUVJc1MwRkJTeXhEUVVGRExFOUJRVThzUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUXpOQ0xFMUJRVTBzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZEYUVJc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZET3p0QlFVVmFMRTFCUVUwc1MwRkJTeXhIUVVGSExFVkJRVVVzUTBGQlF5eEhRVUZITEVOQlFVTXNTVUZCU1N4RlFVRkZMRU5CUTNoQ0xFdEJRVXNzUTBGQlF5eFBRVUZQTEVOQlFVTXNWVUZCVlN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVNelFpeE5RVUZOTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUTJRc1ZVRkJWU3hEUVVGRExFVkJRVVVzUTBGQlF5eE5RVUZOTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkROVUlzUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVWYUxFMUJRVTBzVTBGQlV5eEhRVUZITEVWQlFVVXNRMEZCUXl4TlFVRk5MRU5CUVVNc1dVRkJXU3hEUVVGRExFTkJRVU03UVVGRE1VTXNWMEZCVXl4RFFVRkRMRTFCUVUwc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGRGRrSXNTVUZCU1N4RFFVRkRMRmRCUVZjc1JVRkJSU3hsUVVGbExFbEJRVVVzVVVGQlVTeERRVUZETEUxQlFVMHNSMEZCUXl4UFFVRlBMRU5CUVVNc1RVRkJUU3hEUVVGQkxFRkJRVU1zUjBGQlF5eEhRVUZITEVOQlFVTXNRMEZEZGtVc1ZVRkJWU3hGUVVGRkxFTkJRMW9zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRPMEZCUTJZc1YwRkJVeXhEUVVGRExFMUJRVTBzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZEZGtJc1NVRkJTU3hEUVVGRExGZEJRVmNzUlVGQlJTeFpRVUZaTEVkQlFVTXNUMEZCVHl4RFFVRkRMRWxCUVVrc1IwRkJReXhOUVVGTkxFTkJRVU1zUTBGRGJrUXNWVUZCVlN4RlFVRkZMRU5CUTFvc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETzBGQlEyWXNWMEZCVXl4RFFVRkRMRTFCUVUwc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGRGRFSXNWVUZCVlN4RlFVRkZMRU5CUTFvc1NVRkJTU3hEUVVGRExFZEJRVWNzUlVGQlJTeFJRVUZSTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU03T3p0QlFVZHlReXhOUVVGTkxFOUJRVThzUjBGQlJ5eEpRVUZKTEVOQlFVTXNUMEZCVHl4RlFVRkZMRU5CUVVNN1FVRkRMMElzVTBGQlR5eERRVUZETEZOQlFWTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1QwRkJUeXhEUVVGRE8wRkJReTlDTEV0QlFVTXNSVUZCUXl4UFFVRlBMRU5CUVVNc1NVRkJTVHRCUVVOa0xFdEJRVU1zUlVGQlF5eERRVUZETzBGQlEwZ3NVMEZCU3l4RlFVRkRMRTlCUVU4c1EwRkJReXhMUVVGTE8wRkJRMjVDTEZWQlFVMHNSVUZCUXl4UFFVRlBMRU5CUVVNc1RVRkJUVHRIUVVOMFFpeERRVUZETEVOQlFVTTdPMEZCUlVnc1RVRkJUU3hSUVVGUkxFZEJRVWNzUlVGQlJTeERRVUZETEUxQlFVMHNRMEZCUXl4WlFVRlpMRU5CUVVNc1EwRkRja01zU1VGQlNTeERRVUZETEU5QlFVOHNSVUZCUlN4UFFVRlBMRU5CUVVNc1MwRkJTeXhIUVVGSExFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZETTBNc1NVRkJTU3hEUVVGRExGRkJRVkVzUlVGQlJTeFBRVUZQTEVOQlFVTXNUVUZCVFN4SFFVRkhMRTlCUVU4c1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGREwwTXNTVUZCU1N4RFFVRkRMRmRCUVZjc1JVRkJSU3haUVVGWkxFZEJRVU1zVDBGQlR5eERRVUZETEVsQlFVa3NSMEZCUXl4SFFVRkhMRWRCUVVNc1QwRkJUeXhEUVVGRExFMUJRVTBzUjBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXpzN1FVRkZka1VzVFVGQlRTeFJRVUZSTEVkQlFVY3NSVUZCUlN4RFFVRkRMRWRCUVVjc1EwRkJReXhKUVVGSkxFVkJRVVVzUTBGRE0wSXNTMEZCU3l4RFFVRkRMRTlCUVU4c1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlF6RkNMRTFCUVUwc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGRGFFSXNTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE96dEJRVVZhTEZWQlFWRXNRMEZCUXl4TlFVRk5MRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRM1JDTEVsQlFVa3NRMEZCUXl4WFFVRlhMRVZCUVVVc1kwRkJZeXhIUVVGSExFOUJRVThzUTBGQlF5eE5RVUZOTEVkQlFVY3NSMEZCUnl4RFFVRkRMRU5CUTNoRUxFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXpzN08wRkJSMnhDTEUxQlFVMHNUMEZCVHl4SFFVRkhMRVZCUVVVc1EwRkJReXhIUVVGSExFTkJRVU1zU1VGQlNTeEZRVUZGTEVOQlF6RkNMRU5CUVVNc1EwRkJReXhWUVVGVkxFTkJRVU1zUlVGQlJUdEJRVUZGTEZkQlFVOHNUMEZCVHl4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMGRCUVVVc1EwRkJReXhEUVVOMlJDeEZRVUZGTEVOQlFVTXNUMEZCVHl4RFFVRkRMRTFCUVUwc1EwRkJReXhEUVVOc1FpeEZRVUZGTEVOQlFVTXNWVUZCVlN4RFFVRkRMRVZCUVVVN1FVRkJSU3hYUVVGUExFOUJRVThzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF6dEhRVUZGTEVOQlFVTXNRMEZCUXpzN08wRkJSemRFTEUxQlFVMHNUMEZCVHl4SFFVRkhMRVZCUVVVc1EwRkJReXhIUVVGSExFTkJRVU1zU1VGQlNTeEZRVUZGTEVOQlF6RkNMRU5CUVVNc1EwRkJReXhWUVVGVkxFTkJRVU1zUlVGQlJUdEJRVUZGTEZkQlFVOHNUMEZCVHl4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMGRCUVVVc1EwRkJReXhEUVVOMlJDeERRVUZETEVOQlFVTXNWVUZCVlN4RFFVRkRMRVZCUVVVN1FVRkJSU3hYUVVGUExFOUJRVThzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF6dEhRVUZGTEVOQlFVTXNRMEZCUXpzN1FVRkZOVVFzVlVGQlVTeERRVUZETEUxQlFVMHNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkRja0lzVlVGQlZTeEZRVUZGTEVOQlExb3NTVUZCU1N4RFFVRkRMRWRCUVVjc1JVRkJSU3hQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSWEJETEZWQlFWRXNRMEZCUXl4TlFVRk5MRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRM0pDTEZWQlFWVXNSVUZCUlN4RFFVTmFMRWxCUVVrc1EwRkJReXhIUVVGSExFVkJRVVVzVDBGQlR5eERRVUZETEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRE96dEJRVVZ3UXl4TlFVRk5MRkZCUVZFc1IwRkJSeXhGUVVGRkxFTkJRVU1zUjBGQlJ5eERRVUZETEV0QlFVc3NSVUZCUlN4RFFVTTFRaXhEUVVGRExFTkJRVU1zVDBGQlR5eERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkRkRUlzUlVGQlJTeERRVUZETEU5QlFVOHNSVUZCUlN4WlFVRlpPMEZCUTNaQ0xGZEJRVThzUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXl4RFFVRkRMRTFCUVUwc1EwRkJReXhSUVVGUkxFTkJRVU1zUzBGQlN5eEZRVUZGTEVkQlFVY3NUMEZCVHl4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRExFTkJRVU1zVFVGQlRTeEZRVUZGTEVkQlFVY3NVVUZCVVN4RFFVRkRMRTFCUVUwc1JVRkJSU3hEUVVGRExFTkJRVU03UVVGRGFrY3NWMEZCVHl4RFFVRkRMRmRCUVZjc1EwRkJReXhQUVVGUExFTkJRVU1zVlVGQlZTeEZRVUZGTEV0QlFVc3NSVUZCUlN4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UjBGRE9VUXNRMEZCUXl4RFFVRkRPenRCUVVWTUxGVkJRVkVzUTBGQlF5eE5RVUZOTEVOQlFVTXNWMEZCVnl4RFFVRkRMRU5CUTNwQ0xFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZEWkN4VFFVRlRMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRMnBDTEVsQlFVa3NRMEZCUXl4UlFVRlJMRVZCUVVVc1QwRkJUeXhEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZETzBOQlEyNURMRU5CUVVNN08wRkJSVVlzVDBGQlR5eERRVUZETEZkQlFWY3NSMEZCUnl4VlFVRlRMRTFCUVUwc1JVRkJSU3hMUVVGTExFVkJRVVVzU1VGQlNTeEZRVUZGTzBGQlEyeEVMRTFCUVUwc1VVRkJVU3hIUVVGSExFbEJRVWtzUTBGQlF5eFpRVUZaTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1FVRkRNME1zVDBGQlN5eERRVUZETEV0QlFVc3NRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03UVVGRGRFSXNTVUZCUlN4RFFVRkRMRTFCUVUwc1EwRkJReXhaUVVGWkxFTkJRVU1zUTBGQlF5eE5RVUZOTEVOQlFVTXNVVUZCVVN4RFFVRkRMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETzBGQlEzSkVMRWxCUVVVc1EwRkJReXhOUVVGTkxFTkJRVU1zV1VGQldTeERRVUZETEVOQlFVTXNUVUZCVFN4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRExFbEJRVWtzUTBGQlF5eEhRVUZITEVWQlFVVXNVVUZCVVN4RFFVRkRMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF5eERRVUZETzBOQlF6TkZMRU5CUVVNN08wRkJSVVlzVDBGQlR5eERRVUZETEU5QlFVOHNSMEZCUnl4VlFVRlRMRWxCUVVrc1JVRkJSVHM3UVVGRkwwSXNUVUZCVFN4TFFVRkxMRWRCUVVjc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNWVUZCVXl4SFFVRkhMRVZCUVVNN1FVRkJReXhYUVVGUExFZEJRVWNzUTBGQlF5eEpRVUZKTEVOQlFVTTdSMEZCUXl4RFFVRkRMRU5CUVVNN1FVRkRhRVVzVFVGQlRTeE5RVUZOTEVkQlFVY3NUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zVlVGQlV5eEhRVUZITEVWQlFVTTdRVUZCUXl4WFFVRlBMRWRCUVVjc1EwRkJReXhMUVVGTExFTkJRVU03UjBGQlF5eERRVUZETEVOQlFVTTdPMEZCUld4RkxFMUJRVTBzVDBGQlR5eEhRVUZITEVsQlFVa3NTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVa3NSVUZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRM0pFTEUxQlFVMHNUMEZCVHl4SFFVRkhMRWxCUVVrc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNTMEZCU3l4RFFVRkRMRWxCUVVrc1JVRkJReXhMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETzBGQlEzSkVMRTFCUVUwc1VVRkJVU3hIUVVGSExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNTMEZCU3l4RFFVRkRMRWxCUVVrc1JVRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6dEJRVU0zUXl4TlFVRk5MRkZCUVZFc1IwRkJSeXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEV0QlFVc3NRMEZCUXl4SlFVRkpMRVZCUVVNc1RVRkJUU3hEUVVGRExFTkJRVU03TzBGQlJUZERMRTFCUVUwc1RVRkJUU3hIUVVGSExFVkJRVVVzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RlFVRkZMRU5CUXpOQ0xFMUJRVTBzUTBGQlF5eERRVUZETEU5QlFVOHNSVUZCUXl4UFFVRlBMRU5CUVVNc1EwRkJReXhEUVVONlFpeExRVUZMTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhGUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVVdlFpeE5RVUZOTEUxQlFVMHNSMEZCUnl4RlFVRkZMRU5CUVVNc1MwRkJTeXhEUVVGRExFMUJRVTBzUlVGQlJTeERRVU0zUWl4TlFVRk5MRU5CUVVNc1EwRkJReXhSUVVGUkxFZEJRVWNzUjBGQlJ5eEZRVUZGTEZGQlFWRXNSMEZCUnl4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVONFF5eExRVUZMTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1RVRkJUU3hGUVVGRkxFbEJRVWtzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVWb1F5eFRRVUZQTEVWQlFVTXNRMEZCUXl4RlFVRkZMRTFCUVUwc1JVRkJSU3hEUVVGRExFVkJRVVVzVFVGQlRTeEZRVUZETEVOQlFVTTdRMEZETDBJc1EwRkJRenM3UVVGRlJpeFBRVUZQTEVOQlFVTXNWVUZCVlN4SFFVRkhMRVZCUVVVc1EwRkJReXhSUVVGUkxFTkJRVU1zVlVGQlV5eERRVUZETEVWQlFVVTdRVUZCUlN4VFFVRlBMRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU03UTBGQlJTeERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRPenM3UVVGSGRFVXNUMEZCVHl4RFFVRkRMRk5CUVZNc1IwRkJSeXhaUVVGWE96dEJRVVUzUWl4TlFVRk5MR0ZCUVdFc1IwRkJSeXhQUVVGUExFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1JVRkJSU3hEUVVGRExFdEJRVXNzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenROUVVOc1JTeExRVUZMTEVkQlFVY3NUMEZCVHl4RFFVRkRMRlZCUVZVc1EwRkJReXhQUVVGUExFTkJRVU1zU1VGQlNTeEZRVUZGTEdGQlFXRXNSVUZCUlN4RFFVRkRMRU5CUVVNN1RVRkRNVVFzWlVGQlpTeEhRVUZITEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhIUVVGSExFTkJRVU1zUTBGQlF6dE5RVU42UXl4WFFVRlhMRWRCUVVjc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTTdUVUZEYWtNc1MwRkJTeXhIUVVGSExFRkJRVU1zWVVGQllTeEhRVUZITEdWQlFXVXNRMEZCUXl4SlFVRkpMRWRCUVVzc1YwRkJWeXhEUVVGRExFbEJRVWtzUjBGQlJ5eGhRVUZoTEVGQlFVTXNSMEZEYWtZc1YwRkJWeXhIUVVGSExHVkJRV1VzUTBGQlF6dEJRVU5zUXl4dFFrRkJhVUlzUTBGQlF5eGxRVUZsTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWxCUVVrc1JVRkJSU3hMUVVGTExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdPMEZCUlRORUxFMUJRVTBzVDBGQlR5eEhRVUZITEU5QlFVOHNRMEZCUXl4UFFVRlBMRVZCUVVVc1EwRkJRenRCUVVOc1F5eE5RVUZOTEVOQlFVTXNSMEZCUnl4RlFVRkZMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4SFFVRkhMRTlCUVU4c1EwRkJReXhKUVVGSkxFZEJRVWNzVDBGQlR5eERRVUZETEVsQlFVa3NSMEZCUnl4RlFVRkZMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRPMEZCUXpsRkxFMUJRVTBzVTBGQlV5eEhRVUZITEVWQlFVVXNRMEZCUXl4TlFVRk5MRU5CUVVNc1dVRkJXU3hEUVVGRExFTkJRM1JETEVsQlFVa3NRMEZCUXl4SlFVRkpMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRMklzU1VGQlNTeERRVUZETEVsQlFVa3NSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkRZaXhKUVVGSkxFTkJRVU1zU1VGQlNTeEZRVUZGTEVOQlFVTXNRMEZCUXl4RFFVTmlMRWxCUVVrc1EwRkJReXhKUVVGSkxFVkJRVVVzVDBGQlR5eERRVUZETEZGQlFWRXNSVUZCUlN4RFFVRkRMRTFCUVUwc1IwRkJSeXhQUVVGUExFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdRMEZETTBRc1EwRkJRenM3UVVGRlJpeE5RVUZOTEVOQlFVTXNUMEZCVHl4SFFVRkhMRTlCUVU4c1EwRkJReUlzSW1acGJHVWlPaUl2VlhObGNuTXZaM0psWjI5eWVWOW1iM04wWlhJdlpHRjBZUzFsYm1jdmFHOXVaWGx3YjNRdlpHVjJMM05qY21sd2RITXZkV2t2WkRORGFHRnlkQzVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHZJR1F6UTJoaGNuUXVhbk5jYmk4cWFuTm9hVzUwSUdWemJtVjRkRG9nZEhKMVpTQXFMMXh1WEc1amIyNXpkQ0JrTTBOb1lYSjBJRDBnZTMwN1hHNWpiMjV6ZENCRVpYUmhhV3hXYVdWM1FXTjBhVzl1Y3lBOUlISmxjWFZwY21Vb0p5NHVMMkZqZEdsdmJuTXZSR1YwWVdsc1ZtbGxkMEZqZEdsdmJuTW5LVHRjYmx4dVpETkRhR0Z5ZEM1amNtVmhkR1VnUFNCbWRXNWpkR2x2YmlobGJDa2dlMXh1WEc0Z0lHTnZibk4wSUdOb1lYSjBJRDBnWkRNdWMyVnNaV04wS0dWc0tTNWhjSEJsYm1Rb0ozTjJaeWNwWEc0Z0lDQWdMbUYwZEhJb0oyTnNZWE56Snl3Z0oyMWhhVzVEYUdGeWRDY3BYRzRnSUNBZ0xtOXVLQ2R0YjNWelpXMXZkbVVuTENCa00wTm9ZWEowTG0xdmRYTmxiVzkyWlNrN1hHNWNiaUFnWTJoaGNuUXVZWEJ3Wlc1a0tDZGpiR2x3VUdGMGFDY3BYRzRnSUNBZ0xtRjBkSElvSjJsa0p5d2dKM0JzYjNSQmNtVmhRMnhwY0NjcFhHNGdJQ0FnTG1Gd2NHVnVaQ2duY21WamRDY3BYRzRnSUNBZ0xtRjBkSElvSjJsa0p5d2dKM0JzYjNSQmNtVmhRMnhwY0ZKbFkzUW5LVHRjYmlBZ0lDQmNiaUFnWTI5dWMzUWdjR3h2ZEVGeVpXRWdQU0JqYUdGeWRDNWhjSEJsYm1Rb0oyY25LVHRjYmx4dUlDQndiRzkwUVhKbFlWeHVJQ0FnSUM1aGNIQmxibVFvSjNOMlp6cHdZWFJvSnlsY2JpQWdJQ0F1WVhSMGNpZ25ZMnhoYzNNbkxDQW5iR2x1WlNjcE8xeHVYRzRnSUhCc2IzUkJjbVZoWEc0Z0lDQWdMbUZ3Y0dWdVpDZ25jM1puT214cGJtVW5LVnh1SUNBZ0lDNWhkSFJ5S0NkamJHRnpjeWNzSUNkbWIyTjFjMHhwYm1VbktUdGNibHh1SUNCamFHRnlkQzVoY0hCbGJtUW9KMmNuS1Z4dUlDQWdJQzVoZEhSeUtDZGpiR0Z6Y3ljc0lDZDRRWGhwY3ljcE8xeHVYRzRnSUdOb1lYSjBMbUZ3Y0dWdVpDZ25aeWNwWEc0Z0lDQWdMbUYwZEhJb0oyTnNZWE56Snl3Z0ozbEJlR2x6SnlrN1hHNWNiaUFnWTI5dWMzUWdibUYyUTJoaGNuUWdQU0JrTXk1elpXeGxZM1FvWld3cExtRndjR1Z1WkNnbmMzWm5KeWxjYmlBZ0lDQXVZMnhoYzNObFpDZ25ibUYyYVdkaGRHOXlKeXdnZEhKMVpTazdYRzVjYmlBZ2JtRjJRMmhoY25RdVlYQndaVzVrS0Nkbkp5bGNiaUFnSUNBdVlYUjBjaWduWTJ4aGMzTW5MQ0FuZUVGNGFYTW5LVHRjYmx4dUlDQnVZWFpEYUdGeWRDNWhjSEJsYm1Rb0ozQmhkR2duS1Z4dUlDQWdJQzVoZEhSeUtDZGpiR0Z6Y3ljc0lDZG1hV3hzSnlrN1hHNWNiaUFnYm1GMlEyaGhjblF1WVhCd1pXNWtLQ2R3WVhSb0p5bGNiaUFnSUNBdVlYUjBjaWduWTJ4aGMzTW5MQ0FuYkdsdVpTY3BYRzRnSUNBZ0xtRjBkSElvSjNOMGNtOXJaU2NzSUNkaWJIVmxKeWxjYmlBZ0lDQXVZWFIwY2lnbmMzUnliMnRsTFhkcFpIUm9KeXdnTWlsY2JpQWdJQ0F1WVhSMGNpZ25abWxzYkNjc0lDZHViMjVsSnlrN1hHNWNiaUFnYm1GMlEyaGhjblF1WVhCd1pXNWtLQ2RuSnlsY2JpQWdJQ0F1WVhSMGNpZ25ZMnhoYzNNbkxDQW5kbWxsZDNCdmNuUW5LVHRjYm4wN1hHNWNibVF6UTJoaGNuUXViR2x1WlVaMWJtTjBhVzl1SUQwZ1puVnVZM1JwYjI0b2MyTmhiR1Z6S1NCN1hHNGdJSEpsZEhWeWJpQmtNeTV6ZG1jdWJHbHVaU2dwWEc0Z0lDQWdMbmdvWm5WdVkzUnBiMjRvWkNrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhOallXeGxjeTU0S0dRdVpHRjBaU2s3WEc0Z0lDQWdmU2xjYmlBZ0lDQXVlU2htZFc1amRHbHZiaWhrS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnYzJOaGJHVnpMbmtvWkM1MllXeDFaU2s3WEc0Z0lDQWdmU2xjYmlBZ0lDQXVhVzUwWlhKd2IyeGhkR1VvSjJ4cGJtVmhjaWNwTzF4dWZUdGNibHh1THk4Z1UwbGFTVTVISUVsT1JrOVNUVUZVU1U5T1hHNWNibVF6UTJoaGNuUXViV0Z5WjJsdWN5QTlJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQnlaWFIxY200Z2UySnZkSFJ2YlRvMU1DeHNaV1owT2pjMWZUdGNibjA3WEc1Y2JtUXpRMmhoY25RdWJXRnBibE5wZW1VZ1BTQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ1kyOXVjM1FnWTJoaGNuUWdQU0JrTXk1elpXeGxZM1FvSjNOMlp5Y3BXekJkV3pCZE8xeHVJQ0JqYjI1emRDQjNhV1IwYUNBOUlHTm9ZWEowTG05bVpuTmxkRmRwWkhSb08xeHVJQ0JqYjI1emRDQm9aV2xuYUhRZ1BTQmphR0Z5ZEM1dlptWnpaWFJJWldsbmFIUTdYRzRnSUhKbGRIVnliaUI3ZDJsa2RHZzZkMmxrZEdnc0lHaGxhV2RvZERwb1pXbG5hSFI5TzF4dWZUdGNibHh1WkRORGFHRnlkQzV1WVhaVGFYcGxJRDBnWm5WdVkzUnBiMjRvS1NCN1hHNGdJR052Ym5OMElHTm9ZWEowSUQwZ1pETXVjMlZzWldOMEtDZHpkbWNuS1Zzd1hWc3dYVHRjYmlBZ1kyOXVjM1FnZDJsa2RHZ2dQU0JqYUdGeWRDNXZabVp6WlhSWGFXUjBhRHRjYmlBZ1kyOXVjM1FnYUdWcFoyaDBJRDBnWTJoaGNuUXViMlptYzJWMFNHVnBaMmgwSUNvZ0tERXZOaWs3WEc0Z0lISmxkSFZ5YmlCN2QybGtkR2c2ZDJsa2RHZ3NJR2hsYVdkb2REcG9aV2xuYUhSOU8xeHVmVHRjYmx4dVpETkRhR0Z5ZEM1MWNHUmhkR1VnUFNCbWRXNWpkR2x2Ymloa1lYUmhLU0I3WEc1Y2JpQWdMeThnVFVGSlRpQkRTRUZTVkZ4dUlDQmtNME5vWVhKMExtUmhkR0VnUFNCa1lYUmhPMXh1SUNCamIyNXpkQ0J0WVdsdVUybDZaU0E5SUhSb2FYTXViV0ZwYmxOcGVtVW9LVHRjYmlBZ1kyOXVjM1FnYldGeVoybHVjeUE5SUhSb2FYTXViV0Z5WjJsdWN5Z3BPMXh1SUNCa00wTm9ZWEowTG0xaGFXNVRZMkZzWlhNZ1BTQjBhR2x6TGw5elkyRnNaWE1vZTF4dUlDQWdJQ0FnZURwdFlYSm5hVzV6TG14bFpuUXNYRzRnSUNBZ0lDQjVPakFzWEc0Z0lDQWdJQ0IzYVdSMGFEcHRZV2x1VTJsNlpTNTNhV1IwYUN4Y2JpQWdJQ0FnSUdobGFXZG9kRHB0WVdsdVUybDZaUzVvWldsbmFIUWdMU0J0WVhKbmFXNXpMbUp2ZEhSdmJTeGNiaUFnSUNCOUtUdGNibHh1SUNCamIyNXpkQ0JzYVc1bFJuVnVZeUE5SUhSb2FYTXViR2x1WlVaMWJtTjBhVzl1S0dRelEyaGhjblF1YldGcGJsTmpZV3hsY3lrN1hHNWNiaUFnWTI5dWMzUWdlRUY0YVhNZ1BTQmtNeTV6ZG1jdVlYaHBjeWdwWEc0Z0lDQWdMbk5qWVd4bEtHUXpRMmhoY25RdWJXRnBibE5qWVd4bGN5NTRLVnh1SUNBZ0lDNXZjbWxsYm5Rb0oySnZkSFJ2YlNjcFhHNGdJQ0FnTG5ScFkydHpLRFlwTzF4dVhHNGdJR052Ym5OMElIbEJlR2x6SUQwZ1pETXVjM1puTG1GNGFYTW9LVnh1SUNBZ0lDNXpZMkZzWlNoa00wTm9ZWEowTG0xaGFXNVRZMkZzWlhNdWVTbGNiaUFnSUNBdWIzSnBaVzUwS0Nkc1pXWjBKeWxjYmlBZ0lDQXVkR2xqYTBadmNtMWhkQ2hrTXk1bWIzSnRZWFFvWENJdU0zTmNJaWtwWEc0Z0lDQWdMblJwWTJ0ektEVXBPMXh1WEc0Z0lHTnZibk4wSUcxaGFXNURhR0Z5ZENBOUlHUXpMbk5sYkdWamRDZ25MbTFoYVc1RGFHRnlkQ2NwT3lCY2JpQWdiV0ZwYmtOb1lYSjBMbk5sYkdWamRDZ25MbmhCZUdsekp5bGNiaUFnSUNBdVlYUjBjaWduZEhKaGJuTm1iM0p0Snl3Z0ozUnlZVzV6YkdGMFpTZ3dMQ0FuS3lodFlXbHVVMmw2WlM1b1pXbG5hSFF0YldGeVoybHVjeTVpYjNSMGIyMHBLeWNwSnlrZ0lGeHVJQ0FnSUM1MGNtRnVjMmwwYVc5dUtDbGNiaUFnSUNBdVkyRnNiQ2g0UVhocGN5azdYRzRnSUcxaGFXNURhR0Z5ZEM1elpXeGxZM1FvSnk1NVFYaHBjeWNwWEc0Z0lDQWdMbUYwZEhJb0ozUnlZVzV6Wm05eWJTY3NJQ2QwY21GdWMyeGhkR1VvSnl0dFlYSm5hVzV6TG14bFpuUXJKeXdnTUNrbktTQWdYRzRnSUNBZ0xuUnlZVzV6YVhScGIyNG9LVnh1SUNBZ0lDNWpZV3hzS0hsQmVHbHpLVHRjYmlBZ2JXRnBia05vWVhKMExuTmxiR1ZqZENnbkxteHBibVVuS1Z4dUlDQWdJQzUwY21GdWMybDBhVzl1S0NsY2JpQWdJQ0F1WVhSMGNpZ25aQ2NzSUd4cGJtVkdkVzVqS0dRelEyaGhjblF1WkdGMFlTa3BPMXh1WEc0Z0lDOHZJRTVCVmlCRFNFRlNWRnh1SUNCamIyNXpkQ0J1WVhaVGFYcGxJRDBnZEdocGN5NXVZWFpUYVhwbEtDazdYRzRnSUdRelEyaGhjblF1Ym1GMlUyTmhiR1Z6SUQwZ2RHaHBjeTVmYzJOaGJHVnpLSHRjYmlBZ0lDQjRPbTFoY21kcGJuTXViR1ZtZEN4Y2JpQWdJQ0I1T2pBc1hHNGdJQ0FnZDJsa2RHZzZibUYyVTJsNlpTNTNhV1IwYUN4Y2JpQWdJQ0JvWldsbmFIUTZibUYyVTJsNlpTNW9aV2xuYUhRc1hHNGdJSDBwTzF4dVhHNGdJR052Ym5OMElHNWhka05vWVhKMElEMGdaRE11YzJWc1pXTjBLQ2N1Ym1GMmFXZGhkRzl5SnlsY2JpQWdJQ0F1WVhSMGNpZ25kMmxrZEdnbkxDQnVZWFpUYVhwbExuZHBaSFJvSUNzZ2JXRnlaMmx1Y3k1c1pXWjBLVnh1SUNBZ0lDNWhkSFJ5S0Nkb1pXbG5hSFFuTENCdVlYWlRhWHBsTG1obGFXZG9kQ0FySUcxaGNtZHBibk11WW05MGRHOXRLVnh1SUNBZ0lDNWhkSFJ5S0NkMGNtRnVjMlp2Y20wbkxDQW5kSEpoYm5Oc1lYUmxLQ2NyYldGeVoybHVjeTVzWldaMEt5Y3NKeXR0WVhKbmFXNXpMbUp2ZEhSdmJTc25LU2NwTzF4dVhHNGdJR052Ym5OMElHNWhkbGhCZUdseklEMGdaRE11YzNabkxtRjRhWE1vS1Z4dUlDQWdJQzV6WTJGc1pTaGtNME5vWVhKMExtNWhkbE5qWVd4bGN5NTRLVnh1SUNBZ0lDNXZjbWxsYm5Rb0oySnZkSFJ2YlNjcFhHNGdJQ0FnTG5ScFkydHpLRFVwTzF4dVhHNGdJRzVoZGtOb1lYSjBMbk5sYkdWamRDZ25MbmhCZUdsekp5bGNiaUFnSUNBdVlYUjBjaWduZEhKaGJuTm1iM0p0Snl3Z0ozUnlZVzV6YkdGMFpTZ3dMQ2NnS3lCdVlYWlRhWHBsTG1obGFXZG9kQ0FySUNjcEp5bGNiaUFnSUNBdVkyRnNiQ2h1WVhaWVFYaHBjeWs3WEc1Y2JpQWdMeThnVG1GMklFZHlZWEJvSUVaMWJtTjBhVzl1SUdadmNpQmhjbVZoWEc0Z0lHTnZibk4wSUc1aGRrWnBiR3dnUFNCa015NXpkbWN1WVhKbFlTZ3BYRzRnSUNBZ0xuZ29ablZ1WTNScGIyNGdLR1FwSUhzZ2NtVjBkWEp1SUdRelEyaGhjblF1Ym1GMlUyTmhiR1Z6TG5nb1pDNWtZWFJsS1RzZ2ZTbGNiaUFnSUNBdWVUQW9ibUYyVTJsNlpTNW9aV2xuYUhRcFhHNGdJQ0FnTG5reEtHWjFibU4wYVc5dUlDaGtLU0I3SUhKbGRIVnliaUJrTTBOb1lYSjBMbTVoZGxOallXeGxjeTU1S0dRdWRtRnNkV1VwT3lCOUtUdGNibHh1SUNBdkx5Qk9ZWFlnUjNKaGNHZ2dSblZ1WTNScGIyNGdabTl5SUd4cGJtVmNiaUFnWTI5dWMzUWdibUYyVEdsdVpTQTlJR1F6TG5OMlp5NXNhVzVsS0NsY2JpQWdJQ0F1ZUNobWRXNWpkR2x2YmlBb1pDa2dleUJ5WlhSMWNtNGdaRE5EYUdGeWRDNXVZWFpUWTJGc1pYTXVlQ2hrTG1SaGRHVXBPeUI5S1Z4dUlDQWdJQzU1S0daMWJtTjBhVzl1SUNoa0tTQjdJSEpsZEhWeWJpQmtNME5vWVhKMExtNWhkbE5qWVd4bGN5NTVLR1F1ZG1Gc2RXVXBPeUI5S1R0Y2JseHVJQ0J1WVhaRGFHRnlkQzV6Wld4bFkzUW9KeTVtYVd4c0p5bGNiaUFnSUNBdWRISmhibk5wZEdsdmJpZ3BYRzRnSUNBZ0xtRjBkSElvSjJRbkxDQnVZWFpHYVd4c0tHUXpRMmhoY25RdVpHRjBZU2twTzF4dVhHNGdJRzVoZGtOb1lYSjBMbk5sYkdWamRDZ25MbXhwYm1VbktWeHVJQ0FnSUM1MGNtRnVjMmwwYVc5dUtDbGNiaUFnSUNBdVlYUjBjaWduWkNjc0lHNWhka3hwYm1Vb1pETkRhR0Z5ZEM1a1lYUmhLU2s3WEc1Y2JpQWdZMjl1YzNRZ2RtbGxkM0J2Y25RZ1BTQmtNeTV6ZG1jdVluSjFjMmdvS1Z4dUlDQWdJQzU0S0dRelEyaGhjblF1Ym1GMlUyTmhiR1Z6TG5ncFhHNGdJQ0FnTG05dUtDZGljblZ6YUNjc0lHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQWdJR1F6UTJoaGNuUXViV0ZwYmxOallXeGxjeTU0TG1SdmJXRnBiaWgyYVdWM2NHOXlkQzVsYlhCMGVTZ3BJRDhnWkRORGFHRnlkQzV1WVhaVFkyRnNaWE11ZUM1a2IyMWhhVzRvS1NBNklIWnBaWGR3YjNKMExtVjRkR1Z1ZENncEtUdGNiaUFnSUNBZ0lHUXpRMmhoY25RdWNtVmtjbUYzUTJoaGNuUW9aRE5EYUdGeWRDNXRZV2x1VTJOaGJHVnpMQ0I0UVhocGN5d2daRE5EYUdGeWRDNWtZWFJoS1R0Y2JpQWdJQ0I5S1RzZ1hHNWNiaUFnYm1GMlEyaGhjblF1YzJWc1pXTjBLQ2N1ZG1sbGQzQnZjblFuS1Z4dUlDQWdJQzVqWVd4c0tIWnBaWGR3YjNKMEtWeHVJQ0FnSUM1elpXeGxZM1JCYkd3b0ozSmxZM1FuS1Z4dUlDQWdJQzVoZEhSeUtDZG9aV2xuYUhRbkxDQnVZWFpUYVhwbExtaGxhV2RvZENrN1hHNTlPMXh1WEc1a00wTm9ZWEowTG5KbFpISmhkME5vWVhKMElEMGdablZ1WTNScGIyNG9jMk5oYkdWekxDQjRRWGhwY3l3Z1pHRjBZU2tnZTF4dUlDQmpiMjV6ZENCc2FXNWxSblZ1WXlBOUlIUm9hWE11YkdsdVpVWjFibU4wYVc5dUtITmpZV3hsY3lrN1hHNGdJSGhCZUdsekxuTmpZV3hsS0hOallXeGxjeTU0S1R0Y2JpQWdaRE11YzJWc1pXTjBLQ2N1YldGcGJrTm9ZWEowSnlrdWMyVnNaV04wS0NjdWVFRjRhWE1uS1M1allXeHNLSGhCZUdsektUdGNiaUFnWkRNdWMyVnNaV04wS0NjdWJXRnBia05vWVhKMEp5a3VjMlZzWldOMEtDY3ViR2x1WlNjcExtRjBkSElvSjJRbkxDQnNhVzVsUm5WdVl5aGtNME5vWVhKMExtUmhkR0VwS1R0Y2JuMDdYRzVjYm1RelEyaGhjblF1WDNOallXeGxjeUE5SUdaMWJtTjBhVzl1S0hKbFkzUXBJSHRjYmx4dUlDQmpiMjV6ZENCa1lYUmxjeUE5SUdRelEyaGhjblF1WkdGMFlTNXRZWEFvWm5WdVkzUnBiMjRvWTNWeUtYdHlaWFIxY200Z1kzVnlMbVJoZEdVN2ZTazdYRzRnSUdOdmJuTjBJSFpoYkhWbGN5QTlJR1F6UTJoaGNuUXVaR0YwWVM1dFlYQW9ablZ1WTNScGIyNG9ZM1Z5S1h0eVpYUjFjbTRnWTNWeUxuWmhiSFZsTzMwcE8xeHVJQ0JjYmlBZ1kyOXVjM1FnYldGNFJHRjBaU0E5SUc1bGR5QkVZWFJsS0UxaGRHZ3ViV0Y0TG1Gd2NHeDVLRzUxYkd3c1pHRjBaWE1wS1R0Y2JpQWdZMjl1YzNRZ2JXbHVSR0YwWlNBOUlHNWxkeUJFWVhSbEtFMWhkR2d1YldsdUxtRndjR3g1S0c1MWJHd3NaR0YwWlhNcEtUdGNiaUFnWTI5dWMzUWdiV0Y0Vm1Gc2RXVWdQU0JOWVhSb0xtMWhlQzVoY0hCc2VTaHVkV3hzTEhaaGJIVmxjeWs3WEc0Z0lHTnZibk4wSUcxcGJsWmhiSFZsSUQwZ1RXRjBhQzV0YVc0dVlYQndiSGtvYm5Wc2JDeDJZV3gxWlhNcE8xeHVJQ0JjYmlBZ1kyOXVjM1FnZUZOallXeGxJRDBnWkRNdWRHbHRaUzV6WTJGc1pTZ3BYRzRnSUNBZ0xtUnZiV0ZwYmloYmJXbHVSR0YwWlN4dFlYaEVZWFJsWFNsY2JpQWdJQ0F1Y21GdVoyVW9XM0psWTNRdWVDd2djbVZqZEM1M2FXUjBhRjBwTzF4dUlDQWdJRnh1SUNCamIyNXpkQ0I1VTJOaGJHVWdQU0JrTXk1elkyRnNaUzVzYVc1bFlYSW9LVnh1SUNBZ0lDNWtiMjFoYVc0b1cyMXBibFpoYkhWbElDb2dNQzQ0TENCdFlYaFdZV3gxWlNBcUlERXVNVjBwWEc0Z0lDQWdMbkpoYm1kbEtGdHlaV04wTG1obGFXZG9kQ3dnY21WamRDNTVYU2s3WEc1Y2JpQWdjbVYwZFhKdUlIdDRPaUI0VTJOaGJHVXNJSGs2SUhsVFkyRnNaWDA3WEc1OU8xeHVYRzVrTTBOb1lYSjBMbUpwYzJWamRFUmhkR1VnUFNCa015NWlhWE5sWTNSdmNpaG1kVzVqZEdsdmJpaGtLU0I3SUhKbGRIVnliaUJrTG1SaGRHVTdJSDBwTG14bFpuUTdYRzVjYmk4dklFUnlZWGNnWVNCMlpYSjBhV05oYkNCc2FXNWxJR0Z1WkNCMWNHUmhkR1VnZEdobElHWnZZM1Z6SUdSaGRHVWdMeUIyWVd4MVpWeHVaRE5EYUdGeWRDNXRiM1Z6WlcxdmRtVWdQU0JtZFc1amRHbHZiaWdwSUh0Y2JpQWdMeThnVTI1aGNDQjBieUJ2Ym1VZ2JXOTFjMlVnY0c5cGJuUWdZbVZqWVhWelpTQjNhV3hzSUc1bGRtVnlJRzF2ZFhObElHOTJaWElnWVNCa1lYUmxJR1Y0WVdOMGJIbGNiaUFnWTI5dWMzUWdiVzkxYzJWdmRtVnlSR0YwWlNBOUlHUXpRMmhoY25RdWJXRnBibE5qWVd4bGN5NTRMbWx1ZG1WeWRDaGtNeTV0YjNWelpTaDBhR2x6S1Zzd1hTa3NYRzRnSUNBZ2FXNWtaWGdnUFNCa00wTm9ZWEowTG1KcGMyVmpkRVJoZEdVb1pETkRhR0Z5ZEM1a1lYUmhMQ0J0YjNWelpXOTJaWEpFWVhSbExDQXhLU3hjYmlBZ0lDQndiMmx1ZEVKbFptOXlaVVJoZEdVZ1BTQmtNME5vWVhKMExtUmhkR0ZiYVc1a1pYZ2dMU0F4WFN4Y2JpQWdJQ0J3YjJsdWRFOXVSR0YwWlNBOUlHUXpRMmhoY25RdVpHRjBZVnRwYm1SbGVGMHNYRzRnSUNBZ2NHOXBiblFnUFNBb2JXOTFjMlZ2ZG1WeVJHRjBaU0F0SUhCdmFXNTBRbVZtYjNKbFJHRjBaUzVrWVhSbEtTQStJQ2h3YjJsdWRFOXVSR0YwWlM1a1lYUmxJQzBnYlc5MWMyVnZkbVZ5UkdGMFpTa2dQMXh1SUNBZ0lDQWdjRzlwYm5SUGJrUmhkR1VnT2lCd2IybHVkRUpsWm05eVpVUmhkR1U3WEc0Z0lFUmxkR0ZwYkZacFpYZEJZM1JwYjI1ekxuVndaR0YwWlVadlkzVnpSR0YwWVNod2IybHVkQzVrWVhSbExDQndiMmx1ZEM1MllXeDFaU2s3WEc0Z0lDOHZJRVJ5WVhjZ2RHaGxJR3hwYm1WY2JpQWdZMjl1YzNRZ2JXRnlaMmx1Y3lBOUlHUXpRMmhoY25RdWJXRnlaMmx1Y3lncE8xeHVJQ0JqYjI1emRDQjRJRDBnWkRNdWJXOTFjMlVvZEdocGN5bGJNRjBnUENCdFlYSm5hVzV6TG14bFpuUWdQeUJ0WVhKbmFXNXpMbXhsWm5RZ09pQmtNeTV0YjNWelpTaDBhR2x6S1Zzd1hUdGNiaUFnWTI5dWMzUWdabTlqZFhOTWFXNWxJRDBnWkRNdWMyVnNaV04wS0NjdVptOWpkWE5NYVc1bEp5bGNiaUFnSUNBdVlYUjBjaWduZURFbkxDQjRLVnh1SUNBZ0lDNWhkSFJ5S0NkNE1pY3NJSGdwWEc0Z0lDQWdMbUYwZEhJb0oza3hKeXdnTUNsY2JpQWdJQ0F1WVhSMGNpZ25lVEVuTENCa00wTm9ZWEowTG0xaGFXNVRhWHBsS0NrdWFHVnBaMmgwSUMwZ2JXRnlaMmx1Y3k1aWIzUjBiMjBwTzF4dWZUdGNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JrTTBOb1lYSjBPMXh1SWwxOSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuJyk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG5cbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICB2YXIgbTtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2Uge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIWVtaXR0ZXIuX2V2ZW50cyB8fCAhZW1pdHRlci5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IDA7XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24oZW1pdHRlci5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSAxO1xuICBlbHNlXG4gICAgcmV0ID0gZW1pdHRlci5fZXZlbnRzW3R5cGVdLmxlbmd0aDtcbiAgcmV0dXJuIHJldDtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cy5EaXNwYXRjaGVyID0gcmVxdWlyZSgnLi9saWIvRGlzcGF0Y2hlcicpXG4iLCIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIERpc3BhdGNoZXJcbiAqIEB0eXBlY2hlY2tzXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCcuL2ludmFyaWFudCcpO1xuXG52YXIgX2xhc3RJRCA9IDE7XG52YXIgX3ByZWZpeCA9ICdJRF8nO1xuXG4vKipcbiAqIERpc3BhdGNoZXIgaXMgdXNlZCB0byBicm9hZGNhc3QgcGF5bG9hZHMgdG8gcmVnaXN0ZXJlZCBjYWxsYmFja3MuIFRoaXMgaXNcbiAqIGRpZmZlcmVudCBmcm9tIGdlbmVyaWMgcHViLXN1YiBzeXN0ZW1zIGluIHR3byB3YXlzOlxuICpcbiAqICAgMSkgQ2FsbGJhY2tzIGFyZSBub3Qgc3Vic2NyaWJlZCB0byBwYXJ0aWN1bGFyIGV2ZW50cy4gRXZlcnkgcGF5bG9hZCBpc1xuICogICAgICBkaXNwYXRjaGVkIHRvIGV2ZXJ5IHJlZ2lzdGVyZWQgY2FsbGJhY2suXG4gKiAgIDIpIENhbGxiYWNrcyBjYW4gYmUgZGVmZXJyZWQgaW4gd2hvbGUgb3IgcGFydCB1bnRpbCBvdGhlciBjYWxsYmFja3MgaGF2ZVxuICogICAgICBiZWVuIGV4ZWN1dGVkLlxuICpcbiAqIEZvciBleGFtcGxlLCBjb25zaWRlciB0aGlzIGh5cG90aGV0aWNhbCBmbGlnaHQgZGVzdGluYXRpb24gZm9ybSwgd2hpY2hcbiAqIHNlbGVjdHMgYSBkZWZhdWx0IGNpdHkgd2hlbiBhIGNvdW50cnkgaXMgc2VsZWN0ZWQ6XG4gKlxuICogICB2YXIgZmxpZ2h0RGlzcGF0Y2hlciA9IG5ldyBEaXNwYXRjaGVyKCk7XG4gKlxuICogICAvLyBLZWVwcyB0cmFjayBvZiB3aGljaCBjb3VudHJ5IGlzIHNlbGVjdGVkXG4gKiAgIHZhciBDb3VudHJ5U3RvcmUgPSB7Y291bnRyeTogbnVsbH07XG4gKlxuICogICAvLyBLZWVwcyB0cmFjayBvZiB3aGljaCBjaXR5IGlzIHNlbGVjdGVkXG4gKiAgIHZhciBDaXR5U3RvcmUgPSB7Y2l0eTogbnVsbH07XG4gKlxuICogICAvLyBLZWVwcyB0cmFjayBvZiB0aGUgYmFzZSBmbGlnaHQgcHJpY2Ugb2YgdGhlIHNlbGVjdGVkIGNpdHlcbiAqICAgdmFyIEZsaWdodFByaWNlU3RvcmUgPSB7cHJpY2U6IG51bGx9XG4gKlxuICogV2hlbiBhIHVzZXIgY2hhbmdlcyB0aGUgc2VsZWN0ZWQgY2l0eSwgd2UgZGlzcGF0Y2ggdGhlIHBheWxvYWQ6XG4gKlxuICogICBmbGlnaHREaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAqICAgICBhY3Rpb25UeXBlOiAnY2l0eS11cGRhdGUnLFxuICogICAgIHNlbGVjdGVkQ2l0eTogJ3BhcmlzJ1xuICogICB9KTtcbiAqXG4gKiBUaGlzIHBheWxvYWQgaXMgZGlnZXN0ZWQgYnkgYENpdHlTdG9yZWA6XG4gKlxuICogICBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAqICAgICBpZiAocGF5bG9hZC5hY3Rpb25UeXBlID09PSAnY2l0eS11cGRhdGUnKSB7XG4gKiAgICAgICBDaXR5U3RvcmUuY2l0eSA9IHBheWxvYWQuc2VsZWN0ZWRDaXR5O1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogV2hlbiB0aGUgdXNlciBzZWxlY3RzIGEgY291bnRyeSwgd2UgZGlzcGF0Y2ggdGhlIHBheWxvYWQ6XG4gKlxuICogICBmbGlnaHREaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAqICAgICBhY3Rpb25UeXBlOiAnY291bnRyeS11cGRhdGUnLFxuICogICAgIHNlbGVjdGVkQ291bnRyeTogJ2F1c3RyYWxpYSdcbiAqICAgfSk7XG4gKlxuICogVGhpcyBwYXlsb2FkIGlzIGRpZ2VzdGVkIGJ5IGJvdGggc3RvcmVzOlxuICpcbiAqICAgIENvdW50cnlTdG9yZS5kaXNwYXRjaFRva2VuID0gZmxpZ2h0RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihwYXlsb2FkKSB7XG4gKiAgICAgaWYgKHBheWxvYWQuYWN0aW9uVHlwZSA9PT0gJ2NvdW50cnktdXBkYXRlJykge1xuICogICAgICAgQ291bnRyeVN0b3JlLmNvdW50cnkgPSBwYXlsb2FkLnNlbGVjdGVkQ291bnRyeTtcbiAqICAgICB9XG4gKiAgIH0pO1xuICpcbiAqIFdoZW4gdGhlIGNhbGxiYWNrIHRvIHVwZGF0ZSBgQ291bnRyeVN0b3JlYCBpcyByZWdpc3RlcmVkLCB3ZSBzYXZlIGEgcmVmZXJlbmNlXG4gKiB0byB0aGUgcmV0dXJuZWQgdG9rZW4uIFVzaW5nIHRoaXMgdG9rZW4gd2l0aCBgd2FpdEZvcigpYCwgd2UgY2FuIGd1YXJhbnRlZVxuICogdGhhdCBgQ291bnRyeVN0b3JlYCBpcyB1cGRhdGVkIGJlZm9yZSB0aGUgY2FsbGJhY2sgdGhhdCB1cGRhdGVzIGBDaXR5U3RvcmVgXG4gKiBuZWVkcyB0byBxdWVyeSBpdHMgZGF0YS5cbiAqXG4gKiAgIENpdHlTdG9yZS5kaXNwYXRjaFRva2VuID0gZmxpZ2h0RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihwYXlsb2FkKSB7XG4gKiAgICAgaWYgKHBheWxvYWQuYWN0aW9uVHlwZSA9PT0gJ2NvdW50cnktdXBkYXRlJykge1xuICogICAgICAgLy8gYENvdW50cnlTdG9yZS5jb3VudHJ5YCBtYXkgbm90IGJlIHVwZGF0ZWQuXG4gKiAgICAgICBmbGlnaHREaXNwYXRjaGVyLndhaXRGb3IoW0NvdW50cnlTdG9yZS5kaXNwYXRjaFRva2VuXSk7XG4gKiAgICAgICAvLyBgQ291bnRyeVN0b3JlLmNvdW50cnlgIGlzIG5vdyBndWFyYW50ZWVkIHRvIGJlIHVwZGF0ZWQuXG4gKlxuICogICAgICAgLy8gU2VsZWN0IHRoZSBkZWZhdWx0IGNpdHkgZm9yIHRoZSBuZXcgY291bnRyeVxuICogICAgICAgQ2l0eVN0b3JlLmNpdHkgPSBnZXREZWZhdWx0Q2l0eUZvckNvdW50cnkoQ291bnRyeVN0b3JlLmNvdW50cnkpO1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogVGhlIHVzYWdlIG9mIGB3YWl0Rm9yKClgIGNhbiBiZSBjaGFpbmVkLCBmb3IgZXhhbXBsZTpcbiAqXG4gKiAgIEZsaWdodFByaWNlU3RvcmUuZGlzcGF0Y2hUb2tlbiA9XG4gKiAgICAgZmxpZ2h0RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihwYXlsb2FkKSB7XG4gKiAgICAgICBzd2l0Y2ggKHBheWxvYWQuYWN0aW9uVHlwZSkge1xuICogICAgICAgICBjYXNlICdjb3VudHJ5LXVwZGF0ZSc6XG4gKiAgICAgICAgICAgZmxpZ2h0RGlzcGF0Y2hlci53YWl0Rm9yKFtDaXR5U3RvcmUuZGlzcGF0Y2hUb2tlbl0pO1xuICogICAgICAgICAgIEZsaWdodFByaWNlU3RvcmUucHJpY2UgPVxuICogICAgICAgICAgICAgZ2V0RmxpZ2h0UHJpY2VTdG9yZShDb3VudHJ5U3RvcmUuY291bnRyeSwgQ2l0eVN0b3JlLmNpdHkpO1xuICogICAgICAgICAgIGJyZWFrO1xuICpcbiAqICAgICAgICAgY2FzZSAnY2l0eS11cGRhdGUnOlxuICogICAgICAgICAgIEZsaWdodFByaWNlU3RvcmUucHJpY2UgPVxuICogICAgICAgICAgICAgRmxpZ2h0UHJpY2VTdG9yZShDb3VudHJ5U3RvcmUuY291bnRyeSwgQ2l0eVN0b3JlLmNpdHkpO1xuICogICAgICAgICAgIGJyZWFrO1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogVGhlIGBjb3VudHJ5LXVwZGF0ZWAgcGF5bG9hZCB3aWxsIGJlIGd1YXJhbnRlZWQgdG8gaW52b2tlIHRoZSBzdG9yZXMnXG4gKiByZWdpc3RlcmVkIGNhbGxiYWNrcyBpbiBvcmRlcjogYENvdW50cnlTdG9yZWAsIGBDaXR5U3RvcmVgLCB0aGVuXG4gKiBgRmxpZ2h0UHJpY2VTdG9yZWAuXG4gKi9cblxuICBmdW5jdGlvbiBEaXNwYXRjaGVyKCkge1xuICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzID0ge307XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmcgPSB7fTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzSGFuZGxlZCA9IHt9O1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyA9IGZhbHNlO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfcGVuZGluZ1BheWxvYWQgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGJlIGludm9rZWQgd2l0aCBldmVyeSBkaXNwYXRjaGVkIHBheWxvYWQuIFJldHVybnNcbiAgICogYSB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHdpdGggYHdhaXRGb3IoKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLnJlZ2lzdGVyPWZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgdmFyIGlkID0gX3ByZWZpeCArIF9sYXN0SUQrKztcbiAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF0gPSBjYWxsYmFjaztcbiAgICByZXR1cm4gaWQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBjYWxsYmFjayBiYXNlZCBvbiBpdHMgdG9rZW4uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUudW5yZWdpc3Rlcj1mdW5jdGlvbihpZCkge1xuICAgIGludmFyaWFudChcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXSxcbiAgICAgICdEaXNwYXRjaGVyLnVucmVnaXN0ZXIoLi4uKTogYCVzYCBkb2VzIG5vdCBtYXAgdG8gYSByZWdpc3RlcmVkIGNhbGxiYWNrLicsXG4gICAgICBpZFxuICAgICk7XG4gICAgZGVsZXRlIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXTtcbiAgfTtcblxuICAvKipcbiAgICogV2FpdHMgZm9yIHRoZSBjYWxsYmFja3Mgc3BlY2lmaWVkIHRvIGJlIGludm9rZWQgYmVmb3JlIGNvbnRpbnVpbmcgZXhlY3V0aW9uXG4gICAqIG9mIHRoZSBjdXJyZW50IGNhbGxiYWNrLiBUaGlzIG1ldGhvZCBzaG91bGQgb25seSBiZSB1c2VkIGJ5IGEgY2FsbGJhY2sgaW5cbiAgICogcmVzcG9uc2UgdG8gYSBkaXNwYXRjaGVkIHBheWxvYWQuXG4gICAqXG4gICAqIEBwYXJhbSB7YXJyYXk8c3RyaW5nPn0gaWRzXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS53YWl0Rm9yPWZ1bmN0aW9uKGlkcykge1xuICAgIGludmFyaWFudChcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyxcbiAgICAgICdEaXNwYXRjaGVyLndhaXRGb3IoLi4uKTogTXVzdCBiZSBpbnZva2VkIHdoaWxlIGRpc3BhdGNoaW5nLidcbiAgICApO1xuICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCBpZHMubGVuZ3RoOyBpaSsrKSB7XG4gICAgICB2YXIgaWQgPSBpZHNbaWldO1xuICAgICAgaWYgKHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nW2lkXSkge1xuICAgICAgICBpbnZhcmlhbnQoXG4gICAgICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0hhbmRsZWRbaWRdLFxuICAgICAgICAgICdEaXNwYXRjaGVyLndhaXRGb3IoLi4uKTogQ2lyY3VsYXIgZGVwZW5kZW5jeSBkZXRlY3RlZCB3aGlsZSAnICtcbiAgICAgICAgICAnd2FpdGluZyBmb3IgYCVzYC4nLFxuICAgICAgICAgIGlkXG4gICAgICAgICk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaW52YXJpYW50KFxuICAgICAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF0sXG4gICAgICAgICdEaXNwYXRjaGVyLndhaXRGb3IoLi4uKTogYCVzYCBkb2VzIG5vdCBtYXAgdG8gYSByZWdpc3RlcmVkIGNhbGxiYWNrLicsXG4gICAgICAgIGlkXG4gICAgICApO1xuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pbnZva2VDYWxsYmFjayhpZCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBEaXNwYXRjaGVzIGEgcGF5bG9hZCB0byBhbGwgcmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXlsb2FkXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS5kaXNwYXRjaD1mdW5jdGlvbihwYXlsb2FkKSB7XG4gICAgaW52YXJpYW50KFxuICAgICAgIXRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyxcbiAgICAgICdEaXNwYXRjaC5kaXNwYXRjaCguLi4pOiBDYW5ub3QgZGlzcGF0Y2ggaW4gdGhlIG1pZGRsZSBvZiBhIGRpc3BhdGNoLidcbiAgICApO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfc3RhcnREaXNwYXRjaGluZyhwYXlsb2FkKTtcbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgaWQgaW4gdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3MpIHtcbiAgICAgICAgaWYgKHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nW2lkXSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuJERpc3BhdGNoZXJfaW52b2tlQ2FsbGJhY2soaWQpO1xuICAgICAgfVxuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLiREaXNwYXRjaGVyX3N0b3BEaXNwYXRjaGluZygpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogSXMgdGhpcyBEaXNwYXRjaGVyIGN1cnJlbnRseSBkaXNwYXRjaGluZy5cbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLmlzRGlzcGF0Y2hpbmc9ZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZztcbiAgfTtcblxuICAvKipcbiAgICogQ2FsbCB0aGUgY2FsbGJhY2sgc3RvcmVkIHdpdGggdGhlIGdpdmVuIGlkLiBBbHNvIGRvIHNvbWUgaW50ZXJuYWxcbiAgICogYm9va2tlZXBpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLiREaXNwYXRjaGVyX2ludm9rZUNhbGxiYWNrPWZ1bmN0aW9uKGlkKSB7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmdbaWRdID0gdHJ1ZTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF0odGhpcy4kRGlzcGF0Y2hlcl9wZW5kaW5nUGF5bG9hZCk7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0hhbmRsZWRbaWRdID0gdHJ1ZTtcbiAgfTtcblxuICAvKipcbiAgICogU2V0IHVwIGJvb2trZWVwaW5nIG5lZWRlZCB3aGVuIGRpc3BhdGNoaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gcGF5bG9hZFxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLiREaXNwYXRjaGVyX3N0YXJ0RGlzcGF0Y2hpbmc9ZnVuY3Rpb24ocGF5bG9hZCkge1xuICAgIGZvciAodmFyIGlkIGluIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzKSB7XG4gICAgICB0aGlzLiREaXNwYXRjaGVyX2lzUGVuZGluZ1tpZF0gPSBmYWxzZTtcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfaXNIYW5kbGVkW2lkXSA9IGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLiREaXNwYXRjaGVyX3BlbmRpbmdQYXlsb2FkID0gcGF5bG9hZDtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmcgPSB0cnVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDbGVhciBib29ra2VlcGluZyB1c2VkIGZvciBkaXNwYXRjaGluZy5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS4kRGlzcGF0Y2hlcl9zdG9wRGlzcGF0Y2hpbmc9ZnVuY3Rpb24oKSB7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9wZW5kaW5nUGF5bG9hZCA9IG51bGw7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nID0gZmFsc2U7XG4gIH07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBEaXNwYXRjaGVyO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgaW52YXJpYW50XG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogVXNlIGludmFyaWFudCgpIHRvIGFzc2VydCBzdGF0ZSB3aGljaCB5b3VyIHByb2dyYW0gYXNzdW1lcyB0byBiZSB0cnVlLlxuICpcbiAqIFByb3ZpZGUgc3ByaW50Zi1zdHlsZSBmb3JtYXQgKG9ubHkgJXMgaXMgc3VwcG9ydGVkKSBhbmQgYXJndW1lbnRzXG4gKiB0byBwcm92aWRlIGluZm9ybWF0aW9uIGFib3V0IHdoYXQgYnJva2UgYW5kIHdoYXQgeW91IHdlcmVcbiAqIGV4cGVjdGluZy5cbiAqXG4gKiBUaGUgaW52YXJpYW50IG1lc3NhZ2Ugd2lsbCBiZSBzdHJpcHBlZCBpbiBwcm9kdWN0aW9uLCBidXQgdGhlIGludmFyaWFudFxuICogd2lsbCByZW1haW4gdG8gZW5zdXJlIGxvZ2ljIGRvZXMgbm90IGRpZmZlciBpbiBwcm9kdWN0aW9uLlxuICovXG5cbnZhciBpbnZhcmlhbnQgPSBmdW5jdGlvbihjb25kaXRpb24sIGZvcm1hdCwgYSwgYiwgYywgZCwgZSwgZikge1xuICBpZiAoZmFsc2UpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YXJpYW50IHJlcXVpcmVzIGFuIGVycm9yIG1lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHZhciBlcnJvcjtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAnTWluaWZpZWQgZXhjZXB0aW9uIG9jY3VycmVkOyB1c2UgdGhlIG5vbi1taW5pZmllZCBkZXYgZW52aXJvbm1lbnQgJyArXG4gICAgICAgICdmb3IgdGhlIGZ1bGwgZXJyb3IgbWVzc2FnZSBhbmQgYWRkaXRpb25hbCBoZWxwZnVsIHdhcm5pbmdzLidcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBhcmdzID0gW2EsIGIsIGMsIGQsIGUsIGZdO1xuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAnSW52YXJpYW50IFZpb2xhdGlvbjogJyArXG4gICAgICAgIGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107IH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIGVycm9yLmZyYW1lc1RvUG9wID0gMTsgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCBpbnZhcmlhbnQncyBvd24gZnJhbWVcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbnZhcmlhbnQ7XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTQgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogQ29uc3RydWN0cyBhbiBlbnVtZXJhdGlvbiB3aXRoIGtleXMgZXF1YWwgdG8gdGhlaXIgdmFsdWUuXG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKlxuICogICB2YXIgQ09MT1JTID0ga2V5TWlycm9yKHtibHVlOiBudWxsLCByZWQ6IG51bGx9KTtcbiAqICAgdmFyIG15Q29sb3IgPSBDT0xPUlMuYmx1ZTtcbiAqICAgdmFyIGlzQ29sb3JWYWxpZCA9ICEhQ09MT1JTW215Q29sb3JdO1xuICpcbiAqIFRoZSBsYXN0IGxpbmUgY291bGQgbm90IGJlIHBlcmZvcm1lZCBpZiB0aGUgdmFsdWVzIG9mIHRoZSBnZW5lcmF0ZWQgZW51bSB3ZXJlXG4gKiBub3QgZXF1YWwgdG8gdGhlaXIga2V5cy5cbiAqXG4gKiAgIElucHV0OiAge2tleTE6IHZhbDEsIGtleTI6IHZhbDJ9XG4gKiAgIE91dHB1dDoge2tleTE6IGtleTEsIGtleTI6IGtleTJ9XG4gKlxuICogQHBhcmFtIHtvYmplY3R9IG9ialxuICogQHJldHVybiB7b2JqZWN0fVxuICovXG52YXIga2V5TWlycm9yID0gZnVuY3Rpb24ob2JqKSB7XG4gIHZhciByZXQgPSB7fTtcbiAgdmFyIGtleTtcbiAgaWYgKCEob2JqIGluc3RhbmNlb2YgT2JqZWN0ICYmICFBcnJheS5pc0FycmF5KG9iaikpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdrZXlNaXJyb3IoLi4uKTogQXJndW1lbnQgbXVzdCBiZSBhbiBvYmplY3QuJyk7XG4gIH1cbiAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgaWYgKCFvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIHJldFtrZXldID0ga2V5O1xuICB9XG4gIHJldHVybiByZXQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtleU1pcnJvcjtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBwcm9wSXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuZnVuY3Rpb24gVG9PYmplY3QodmFsKSB7XG5cdGlmICh2YWwgPT0gbnVsbCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIG93bkVudW1lcmFibGVLZXlzKG9iaikge1xuXHR2YXIga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaik7XG5cblx0aWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRrZXlzID0ga2V5cy5jb25jYXQoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhvYmopKTtcblx0fVxuXG5cdHJldHVybiBrZXlzLmZpbHRlcihmdW5jdGlvbiAoa2V5KSB7XG5cdFx0cmV0dXJuIHByb3BJc0VudW1lcmFibGUuY2FsbChvYmosIGtleSk7XG5cdH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIga2V5cztcblx0dmFyIHRvID0gVG9PYmplY3QodGFyZ2V0KTtcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBhcmd1bWVudHNbc107XG5cdFx0a2V5cyA9IG93bkVudW1lcmFibGVLZXlzKE9iamVjdChmcm9tKSk7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHRvW2tleXNbaV1dID0gZnJvbVtrZXlzW2ldXTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIl19
