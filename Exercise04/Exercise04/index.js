/**
 * IMPORTANT NOTICE:
 * 
 * The data is provided by the data.js file.
 * Make sure the data.js file is loaded before the index.js file, so that you can acces it here!
 * The data is provided in an array called: data
 * const data = [
  {
    "species": "Adelie",
    "island": "Torgersen",
    "culmen_length_mm": 39.1,
    "culmen_depth_mm": 18.7,
    "flipper_length_mm": 181,
    "body_mass_g": 3750,
    "sex": "MALE"
  } ....
 */

//Names: Sinem Bilge Güler, Reshma Sudarsan

console.log("Initial Data", data);

// constants
const width = 600;
const height = 600;
const margin = {
  left: 50,
  right: 50,
  top: 50,
  bottom: 50,
};

d3.select('svg#chart').attr('width', width).attr('height', height);
d3.select('g#vis-g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

const visHeight = height - margin.top - margin.bottom;
const visWidth = width - margin.left - margin.right;

//TASK: get all dimensions in the dataset
var allDimensions = Object.keys(data[0]);
console.log("Dimensions of the dataset: ", allDimensions);

//TASK: Data cleaning
// filter out any datapoints where a value is undefined
// 334 datapoints should remain
var cleanData = data.filter(d => Object.values(d).every(value => value !== undefined));
console.log("cleaned Data:", cleanData);

//TASK: seperate numeric and categorical dimensions
var numerics = allDimensions.filter(dim => typeof cleanData[0][dim] === 'number');
var categoricals = allDimensions.filter(dim => typeof cleanData[0][dim] !== 'number');
console.log("numerical dimensions", numerics);
console.log("categorical dimensions", categoricals);


//append a circle for each datapoint
// for cx, cy, fill and r we set dummy values for now 
var selection = d3.select('g#scatter-points').selectAll('circle').data(cleanData)
  .enter().append('circle')
  .attr('cx', 0)
  .attr('cy', 0)
  .attr('r', 3)
  .attr('fill', 'black');


//add labels for x and y axis
var yLabel = d3.select('g#vis-g').append('text').attr('class', 'axis-label').text(' ');
var xLabel = d3.select('g#vis-g').append('text').attr('class', 'axis-label')
  .attr('transform', 'translate(' + visWidth + ', ' + visHeight + ')')
  .text(' ');

var xAxis = d3.select('g#vis-g')
.append('g')
.attr('class', 'x-axis')
.attr('transform', 'translate(0, ' + visHeight + ')')

var yAxis = d3.select('g#vis-g')
.append('g')
.attr('class', 'y-axis');



//TASK: add options to the select tags:
// for all <select>'s we have to add <options> for each data dimension
// the select for the x-axis, y-axis and size should only have numeric dimensions as options
// the select for the color should only have categorical dimensions as options
// add an event listener to the <select> tag
//    call the appropriate change function (xAxisChange(newDim), yAxisChange(newDim), colorChange(newDim) or sizeChange(newDim))
// For numeric dimensions
d3.select('#x-axis-select').selectAll('option')
  .data(numerics)
  .enter()
  .append('option')
  .text(d => d);
  

d3.select('#y-axis-select').selectAll('option')
  .data(numerics)
  .enter()
  .append('option')
  .text(d => d);


d3.select('#size-select').selectAll('option')
  .data(numerics)
  .enter()
  .append('option')
  .text(d => d);


d3.select('#color-select').selectAll('option')
  .data(categoricals)
  .enter()
  .append('option')
  .text(d => d);

var selectedOption = d3.select(this).property('value');
xLabel.text(numerics[0]);

var selectedOptiony = d3.select(this).property('value');
yLabel.text(numerics[0]);

d3.select('#x-axis-select').on('change', function() {
  var newDim = d3.select(this).property('value');
  xAxisChange(newDim); 
  var selectedOption = d3.select(this).property('value');
  if (selectedOption == numerics[3]) {
    xLabel.text(numerics[3]);
  } else if (selectedOption == numerics[2]) {
    xLabel.text(numerics[2]);
  }
  else if (selectedOption == numerics[1]) {
    xLabel.text(numerics[1]);
  }
  else if (selectedOption == numerics[0]) {
    xLabel.text(numerics[0]);
  }
  selectedOption = "";
});


d3.select('#y-axis-select').on('change', function() {
  var newDim = d3.select(this).property('value');
  yAxisChange(newDim);
  var selectedOption = d3.select(this).property('value');

  if (selectedOption == numerics[3]) {
    yLabel.text(numerics[3]);
  } else if (selectedOption == numerics[2]) {
    yLabel.text(numerics[2]);
  }
  else if (selectedOption == numerics[1]) {
    yLabel.text(numerics[1]);
  }
  else if (selectedOption == numerics[0]) {
    yLabel.text(numerics[0]);
  }
  
  selectedOption = "";
});

d3.select('#color-select').on('change', function() {
  var newDim = d3.select(this).property('value');
  colorChange(newDim);
});

d3.select('#size-select').on('change', function() {
  var newDim = d3.select(this).property('value');
  sizeChange(newDim);
});

// TASK: x axis update:
// Change the x Axis according to the passed dimension
// update the cx value of all circles  
// update the x Axis label 
xAxisChange = (newDim) => {

  var xScale = d3.scaleLinear()
    .domain([d3.min(cleanData, d => d[newDim]), d3.max(cleanData, d => d[newDim])])
    .range([0, visWidth]);

  var xAxisGenerator = d3.axisBottom(xScale);
  xAxis.call(xAxisGenerator);
  
  d3.select('g#scatter-points').selectAll('circle')
    .attr('cx', d => xScale(d[newDim]));

  //d3.select('.x-axis-label').text(newDim);

};


// TASK: y axis update:
// Change the y Axis according to the passed dimension
// update the cy value of all circles  
// update the y Axis label 
yAxisChange = (newDim) => {

  var yScale = d3.scaleLinear()
    .domain([d3.min(cleanData, d => d[newDim]), d3.max(cleanData, d => d[newDim])])
    .range([visHeight, 0]);

  var yAxisGenerator = d3.axisLeft(yScale);
  yAxis.call(yAxisGenerator);

  d3.select('g#scatter-points').selectAll('circle')
    .attr('cy', d => yScale(d[newDim]));


  //d3.select('.y-axis-label').text(newDim);
  
};

// TASK: color update:
// Change the color (fill) according to the passed dimension
// update the fill value of all circles  
//
// add a <span> for each categorical value to the legend div 
// (see #color-select-legend in the html file)
// the value text should be colored according to the color scale 
colorChange = (newDim) => {

  var colorScale = d3.scaleOrdinal(d3.schemeCategory10)
    .domain(cleanData.map(d => d[newDim]));


  d3.select('g#scatter-points').selectAll('circle')
    .attr('fill', d => colorScale(d[newDim]));


  var legend = d3.select('#color-select-legend');
  legend.selectAll('span').remove(); 

  legend.selectAll('span')
    .data([...new Set(cleanData.map(d => d[newDim]))]) 
    .enter()
    .append('span')
    .style('color', d => colorScale(d))
    .text(d => d);
};


// TASK: size update:
// Change the size according to the passed dimension
// update the r value of all circles  
sizeChange = (newDim) => {

  var sizeScale = d3.scaleLinear()
    .domain([d3.min(cleanData, d => d[newDim]), d3.max(cleanData, d => d[newDim])])
    .range([3, 10]); 


  d3.select('g#scatter-points').selectAll('circle')
    .attr('r', d => sizeScale(d[newDim]));
};

// Initialize the scales
xAxisChange('culmen_length_mm');
yAxisChange('culmen_length_mm');
colorChange('species');
sizeChange('culmen_length_mm');