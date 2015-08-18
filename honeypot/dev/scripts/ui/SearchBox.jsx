// SEARCHBOX
/*jshint esnext: true */

const FilterActions = require('../actions/FilterActions');

const SearchBox = React.createClass({
  handleChange: function(e) {
    FilterActions.updateSearch(e.target.value);
  },

  render: function() {
    return (
      <form className='searchBox'
        onChange={this.handleChange} 
        onSubmit={function(e){return false;}}>
        <input type='text' placeholder='filter' ref='searchText' /> 
      </form>
    );
  }
});

module.exports = SearchBox;
