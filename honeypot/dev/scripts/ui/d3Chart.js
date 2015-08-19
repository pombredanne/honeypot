// d3Chart.js
/*jshint esnext: true */

const d3Chart = {};
const DetailViewActions = require('../actions/DetailViewActions');

d3Chart.create = function(el) {

  const chart = d3.select(el).append('svg')
    .attr('class', 'mainChart')
    .on('mousemove', d3Chart.mousemove);

  chart.append('clipPath')
    .attr('id', 'plotAreaClip')
    .append('rect')
    .attr('id', 'plotAreaClipRect');
    
  const plotArea = chart.append('g');

  plotArea
    .append('svg:path')
    .attr('class', 'line');

  plotArea
    .append('svg:line')
    .attr('class', 'focusLine');

  chart.append('g')
    .attr('class', 'xAxis');

  chart.append('g')
    .attr('class', 'yAxis');

  const navChart = d3.select(el).append('svg')
    .classed('navigator', true);

  navChart.append('g')
    .attr('class', 'xAxis');

  navChart.append('path')
    .attr('class', 'fill');

  navChart.append('path')
    .attr('class', 'line')
    .attr('stroke', 'blue')
    .attr('stroke-width', 2)
    .attr('fill', 'none');

  navChart.append('g')
    .attr('class', 'viewport');
};

d3Chart.lineFunction = function(scales) {
  return d3.svg.line()
    .x(function(d) {
      return scales.x(d.date);
    })
    .y(function(d) {
      return scales.y(d.value);
    })
    .interpolate('linear');
};

// SIZING INFORMATION

d3Chart.margins = function() {
  return {bottom:50,left:75};
};

d3Chart.mainSize = function() {
  const chart = d3.select('svg')[0][0];
  const width = chart.offsetWidth;
  const height = chart.offsetHeight;
  return {width:width, height:height};
};

d3Chart.navSize = function() {
  const chart = d3.select('svg')[0][0];
  const width = chart.offsetWidth;
  const height = chart.offsetHeight * (1/6);
  return {width:width, height:height};
};

d3Chart.update = function(data) {

  // MAIN CHART
  d3Chart.data = data;
  const mainSize = this.mainSize();
  const margins = this.margins();
  d3Chart.mainScales = this._scales({
      x:margins.left,
      y:0,
      width:mainSize.width,
      height:mainSize.height - margins.bottom,
    });

  const lineFunc = this.lineFunction(d3Chart.mainScales);

  const xAxis = d3.svg.axis()
    .scale(d3Chart.mainScales.x)
    .orient('bottom')
    .ticks(6);

  const yAxis = d3.svg.axis()
    .scale(d3Chart.mainScales.y)
    .orient('left')
    .tickFormat(d3.format(".3s"))
    .ticks(5);

  const mainChart = d3.select('.mainChart'); 
  mainChart.select('.xAxis')
    .attr('transform', 'translate(0, '+(mainSize.height-margins.bottom)+')')  
    .transition()
    .call(xAxis);
  mainChart.select('.yAxis')
    .attr('transform', 'translate('+margins.left+', 0)')  
    .transition()
    .call(yAxis);
  mainChart.select('.line')
    .transition()
    .attr('d', lineFunc(d3Chart.data));

  // NAV CHART
  const navSize = this.navSize();
  d3Chart.navScales = this._scales({
    x:margins.left,
    y:0,
    width:navSize.width,
    height:navSize.height,
  });

  const navChart = d3.select('.navigator')
    .attr('width', navSize.width + margins.left)
    .attr('height', navSize.height + margins.bottom)
    .attr('transform', 'translate('+margins.left+','+margins.bottom+')');

  const navXAxis = d3.svg.axis()
    .scale(d3Chart.navScales.x)
    .orient('bottom')
    .ticks(5);

  navChart.select('.xAxis')
    .attr('transform', 'translate(0,' + navSize.height + ')')
    .call(navXAxis);

  // Nav Graph Function for area
  const navFill = d3.svg.area()
    .x(function (d) { return d3Chart.navScales.x(d.date); })
    .y0(navSize.height)
    .y1(function (d) { return d3Chart.navScales.y(d.value); });

  // Nav Graph Function for line
  const navLine = d3.svg.line()
    .x(function (d) { return d3Chart.navScales.x(d.date); })
    .y(function (d) { return d3Chart.navScales.y(d.value); });

  navChart.select('.fill')
    .transition()
    .attr('d', navFill(d3Chart.data));

  navChart.select('.line')
    .transition()
    .attr('d', navLine(d3Chart.data));

  const viewport = d3.svg.brush()
    .x(d3Chart.navScales.x)
    .on('brush', function () {
      d3Chart.mainScales.x.domain(viewport.empty() ? d3Chart.navScales.x.domain() : viewport.extent());
      d3Chart.redrawChart(d3Chart.mainScales, xAxis, d3Chart.data);
    }); 

  navChart.select('.viewport')
    .call(viewport)
    .selectAll('rect')
    .attr('height', navSize.height);
};

d3Chart.redrawChart = function(scales, xAxis, data) {
  const lineFunc = this.lineFunction(scales);
  xAxis.scale(scales.x);
  d3.select('.mainChart').select('.xAxis').call(xAxis);
  d3.select('.mainChart').select('.line').attr('d', lineFunc(d3Chart.data));
};

d3Chart._scales = function(rect) {

  const dates = d3Chart.data.map(function(cur){return cur.date;});
  const values = d3Chart.data.map(function(cur){return cur.value;});
  
  const maxDate = new Date(Math.max.apply(null,dates));
  const minDate = new Date(Math.min.apply(null,dates));
  const maxValue = Math.max.apply(null,values);
  const minValue = Math.min.apply(null,values);
  
  const xScale = d3.time.scale()
    .domain([minDate,maxDate])
    .range([rect.x, rect.width]);
    
  const yScale = d3.scale.linear()
    .domain([minValue * 0.8, maxValue * 1.1])
    .range([rect.height, rect.y]);

  return {x: xScale, y: yScale};
};

d3Chart.bisectDate = d3.bisector(function(d) { return d.date; }).left;

// Draw a vertical line and update the focus date / value
d3Chart.mousemove = function() {
  // Snap to one mouse point because will never mouse over a date exactly
  if (d3Chart.data) {
    const mouseoverDate = d3Chart.mainScales.x.invert(d3.mouse(this)[0]),
      index = d3Chart.bisectDate(d3Chart.data, mouseoverDate, 1),
      pointBeforeDate = d3Chart.data[index - 1],
      pointOnDate = d3Chart.data[index],
      point = (mouseoverDate - pointBeforeDate.date) > (pointOnDate.date - mouseoverDate) ?
        pointOnDate : pointBeforeDate;
    DetailViewActions.updateFocusData(point.date, point.value);
    // Draw the line
    const margins = d3Chart.margins();
    const x = d3.mouse(this)[0] < margins.left ? margins.left : d3.mouse(this)[0];
    const focusLine = d3.select('.focusLine')
      .attr('x1', x)
      .attr('x2', x)
      .attr('y1', 0)
      .attr('y1', d3Chart.mainSize().height - margins.bottom);
  }
};

module.exports = d3Chart;
