// FILTERRESULTSTABLE
/*jshint esnext: true */

const FilterStore = require('../stores/FilterStore');
const FilterActions = require('../actions/FilterActions');
const DetailViewActions = require('../actions/DetailViewActions.js');
const FilterResultRow = require('./FilterResultRow.jsx');

const FilterResultsTable = React.createClass({
  getInitialState: function() {
    return {
      results: FilterStore.getResults(), 
      headers: FilterStore.getResultHeaders(),
      description: FilterStore.getDescriptionString()
    };
  },

  handleClick: function(index) {
    DetailViewActions.updateDetailView(
      this.state.headers[0].replace(' name', ''),
      this.state.results[index].name
    );

    if (FilterStore.isShowingDags()) {
      FilterActions.updateFilter("dag", this.state.results[index].name);
      DetailViewActions.updateDag(this.state.results[index].name);
    }
    
    this.setState({
      selected: index
    });
  },

  componentDidMount: function() {
    FilterStore.addFilterResultsChangeListener(this._onChange); 
  },

  componentDidUnmount: function() {
    FilterStore.removeFilterResultsChangeListener(this._onChange); 
  },

  _onChange: function(){
    this.setState({
      results: FilterStore.getResults(),
      headers: FilterStore.getResultHeaders(),
      description: FilterStore.getDescriptionString()
    });
  },

  render: function() {
    if (this.state.results) {
      return (
        <table className='filterResults'>
          <p className='filterDescription'>{this.state.description}</p>
          <tr>
            {this.state.headers.map(function(header, i){
              let name = 'filterResultRowValue';
              if (i == 0) name = 'filterResultRowName';
              return (
                <th className={name}>{header}</th>
              );
            }, this)}
          </tr>
          {this.state.results.map(function(result, i){
            // Create all the result rows
            let resultsRowProps = {
              name: result.name,
              key: i,
              value: Number(result.value.toFixed(1)),
              handler:this.handleClick.bind(this,i),
              selected:(i == this.state.selected) ? true : false
            }
            // Shorten name to prevent overflow
            if (resultsRowProps.name.length > 25){ 
              resultsRowProps.name = resultsRowProps.name.slice(0,25) + '...';
            }

            return ( <FilterResultRow  {...resultsRowProps} /> );
          }, this)}
        </table> 
      );
    }
    else {
      return (
        <table className='filterResults'></table>
      );
    }
  }
});

module.exports = FilterResultsTable;
