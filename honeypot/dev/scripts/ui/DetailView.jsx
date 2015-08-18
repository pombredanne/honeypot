/*jshint esnext: true */

const Chart = require('./Chart.jsx');
const MeasureRow = require('./MeasureRow.jsx');

const DetailView = React.createClass({
  render: function() {
    return (
      <div className='detailView'>
        <MeasureRow name='measure' labels={['I/O','CPU','Mappers','Reducers']} />
        <Chart />
      </div>
    );
  }
});

module.exports = DetailView;
