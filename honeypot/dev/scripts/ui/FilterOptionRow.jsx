// FILTEROPTIONROW
/*jshint esnext: true */

const FilterActions = require('../actions/FilterActions');
const FilterButton = require('./FilterButton.jsx');

const FilterOptionRow = React.createClass({

  propTypes: {
    name: React.PropTypes.string.isRequired,
    labels: React.PropTypes.array.isRequired 
  },

  getInitialState: function() {
    return {selected: 0};
  },

  handleClick: function(index) {
    if (index != this.state.selected) {
      this.setState({selected: index});
      FilterActions.updateFilter(this.props.name, this.props.labels[index]);
    }
  },

  render: function() {
    let span;

    switch(this.props.labels.length) {
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
    return (
      <div className='filterOptionRow'>
        {this.props.labels.map(function(curLabel, i) {
          const selected = (i == this.state.selected) ? 'selected' : 'deselected'

          const props = {
            label:curLabel, 
            handler:this.handleClick.bind(this,i),
            className:'filterButton'+' '+span+' '+selected
          }
          return (
            <FilterButton {...props} />
          );
        }, this)}
      </div>
    );
  }
});

module.exports = FilterOptionRow;
