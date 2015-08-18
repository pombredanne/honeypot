/*jshint esnext: true */

const DetailViewStore = require('../stores/DetailViewStore');
const DetailViewActions = require('../actions/DetailViewActions');

const DetailText = React.createClass({

  getInitialState: function() {
    return DetailViewStore.getStore(); 
  },

  componentDidMount: function() {
    DetailViewStore
      .addDataUpdateListener(this._onMetadataChange); 
    DetailViewStore
      .addFocusUpdateListener(this._onFocusChange); 
    DetailViewStore
      .addMeasureChangeListener(this._onMeasureChange); 
  },

  componentDidUnmount: function() {
    DetailViewStore
      .removeDataUpdateListener(this._onMetadataChange); 
    DetailViewStore
      .removeFocusUpdateListener(this._onFocusChange); 
    DetailViewStore
      .removeMeasureChangeListener(this._onMeasureChange); 
  },

  _onFocusChange: function(){
    this.setState({
      focusValue:DetailViewStore.getFocusValue(),
      focusDate:DetailViewStore.getFocusDate()
    });
  },

  _onMeasureChange: function(){
    this.setState({
      measure:DetailViewStore.getMeasure()
    });
  },

  _onMetadataChange: function(){
    const details = DetailViewStore.getDetails();
    this.setState({
      name: details.name,
      owner: details.owner
    });
  },

  render: function() {
    const focusDate = DetailViewStore.getFocusDate();
    let formattedFocusDate = "";
    if (focusDate) {
      formattedFocusDate = (focusDate.getMonth() + 1) + 
      '/' + focusDate.getDate() + 
      '/' + focusDate.getFullYear();
    }
    const numberFormatter = d3.format('.3s');
    return (
      <div className='detailText'>
        <div className='titleRow'>
          <h1 className='curId'>{this.state.name}</h1>
          <h1 className='measure'>{this.state.measure}</h1>
          <h1 className='focusVal'>{numberFormatter(this.state.focusValue)}</h1>
        </div>
        <div className='divider'></div>
        <div className='infoRow'>
          <p className='owner'>{this.state.owner}</p>
          <p className='focusDate'>
            {formattedFocusDate}
          </p>
        </div>
      </div>
    );
  }
});


module.exports = DetailText;
