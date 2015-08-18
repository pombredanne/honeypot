// Chart.js
// The bridge between React and D3
/*jshint esnext: true */
 
const DetailViewStore = require('../stores/DetailViewStore');
const d3Chart = require('./d3Chart.js');

const Chart = React.createClass({
  
  getInitialState: function() {
    return {data: DetailViewStore.getData()};
  },

  componentDidMount: function() {
    const el = React.findDOMNode(this);
    DetailViewStore.addDataUpdateListener(this._onChange);
    d3Chart.create(el);
  },

  componentDidUpdate: function() {
    d3Chart.update(this.state.data);
  },

  _onChange: function() {
    this.setState({
      data: DetailViewStore.getData()
    });
  },

  componentWillUnmount: function() {
    DetailViewStore.removeDataUpdateListener(this._onChange);
  },

  render: function() {
    return (
      <div className='chart'></div>
    );
  }
});

module.exports = Chart;
