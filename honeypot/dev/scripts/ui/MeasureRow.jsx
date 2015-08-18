/*jshint esnext: true */

const DetailViewStore = require('../stores/DetailViewStore');
const DetailViewActions = require('../actions/DetailViewActions');
const FilterButton = require('./FilterButton.jsx');

const MeasureRow = React.createClass({

  propTypes: {
    labels: React.PropTypes.array.isRequired 
  },

  getInitialState: function() {
    return {selected: 0};
  },

  handleClick: function(index) {
    if (index != this.state.selected) {
      this.setState({selected: index});
      DetailViewActions.updateMeasure(this.props.labels[index]);
    }
  },

  render: function() {
    return (
      // Create a radio button for each label passed in to the props
      <div className='measureRow'>
        {this.props.labels.map(function(curLabel, i) {
          const selected = (i == this.state.selected) ? 'selected' : 'deselected'

          const filterButtonProps = {
            label:curLabel, 
            handler:this.handleClick.bind(this,i),
            className:'filterButton'+' '+selected
          }

          return (
            <FilterButton {...filterButtonProps} />
          );
        }, this)}
      </div>
    );
  }
});

module.exports = MeasureRow;
