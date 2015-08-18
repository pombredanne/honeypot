// FILTERRESULTROW
/*jshint esnext: true */

const FilterResultRow = React.createClass({
  render: function() {
    let className = 'filterResultRow';
    if (this.props.selected) {className = className + ' selected';}
    return (
      <tr className={className} onClick={this.props.handler}>
        <td className='filterResultRowName'>{this.props.name}</td>
        <td className='filterResultRowValue'>{this.props.value}</td>
      </tr>
    );
  }
});

module.exports = FilterResultRow;
