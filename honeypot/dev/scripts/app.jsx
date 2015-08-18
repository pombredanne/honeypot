/*jshint esnext: true */

const Sidebar = require('./ui/Sidebar.jsx');
const DetailView = require('./ui/DetailView.jsx');
const DetailText = require('./ui/DetailText.jsx');

React.render(
  <div>
    <Sidebar />
    <div className='detailColumn'>
      <DetailText />
      <DetailView />
    </div>
  </div>,
  document.getElementById('wrap')
);
