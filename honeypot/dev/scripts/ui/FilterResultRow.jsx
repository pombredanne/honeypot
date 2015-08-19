// FILTERRESULTROW
/*jshint esnext: true */

const FilterResultRow = React.createClass({
  render: function() {
    let className = 'filterResultRow';
    if (this.props.selected) {className = className + ' selected';}
    const formatter = d3.format('.3s');
    return (
      <tr className={className} onClick={this.props.handler}>
        <td className='filterResultRowName'>{this.props.name}</td>
        <td className='filterResultRowValue'>{formatter(this.props.value)}</td>
      </tr>
    );
  }
});

module.exports = FilterResultRow;
