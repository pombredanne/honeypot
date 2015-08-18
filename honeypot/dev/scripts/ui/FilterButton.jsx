/*jshint esnext: true */

const FilterButton = React.createClass({

  propTypes: {
    label: React.PropTypes.string.isRequired,
    handler: React.PropTypes.func.isRequired,
  },

  render: function() {
    return (
      <button onClick={this.props.handler} className={this.props.className}>
        {this.props.label}
      </button>
    );
  }
});

module.exports = FilterButton;
