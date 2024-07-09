//Names: Sinem Bilge Güler, Reshma Sudarsan

/**
 * IMPORTANT NOTICE:
 * 
 * The data is provided by the data.js file which you need to add in the index.html file. 
 * Make sure the data.js file is loaded before the index.js file, so that you can acces it here!
 * The data is provided in an array called: data
 * const data = [
        {
            "tas": 1.96318,
            "pr": 37.2661,
            "Year": 1991,
            "Month": 1,
            "Country": "DEU"
        }
        ....
 */
/* TASK: Retrieve (select) the visualization container node of the div element declared within the index.html by its identifier. */
var visContainer = d3.select("#vis-container");

// Specify margins such that the visualization is clearly visible and no elements are invisible due to the svg border
var margins = {
    top: 20,
    right: 20,
    bottom: 50,
    left: 50
};
// Specify the width and height of the svg as well as the width height of the viewport of the visualization.
var width = 800;
var height = 400;
var visWidth = width - margins.left - margins.right;
var visHeight = height - margins.top - margins.bottom;

/* TASK: Append an svg element to the vis-container, set its width and height (in pixels), add it to the vis-container, and save the element to variable called 'svg' */
var svg = visContainer.append("svg").attr("width", width).attr("height", height);

/* TASK: Add a group element to the svg to realize the margin by translating the group, and save the element to variable called 'viewport'. */
var viewport = svg.append("g").attr("transform", "translate(" + margins.left + "," + margins.top + ")");

// Data Preparation: For each year we want the average rain and temperature
// TASK: Use d3.group() to group the data entries by year (see https://github.com/d3/d3-array#group)
//var dataByYears = d3.group(data, d => d.Year);

var dataByYears = d3.group(data, d => {
    // Remove commas from the "Year" values
    return typeof d.Year === 'string' ? d.Year.replace(",", "") : d.Year;
});
// TASK: convert the Map dataByYears from d3.group() to an array to iterate over it. Read the documentation (https://github.com/d3/d3-array#group) to see how 
var dataByYearsArray = Array.from(dataByYears);

// We intialize an empty array 'avgData' which will hold the average values and the respective years
var avgData = [];


// TASK: iterate through the data by years and use the d3.mean() function to calculate the mean values of temperature and rainfall for each year
// Similarly to Ex. 1: Push one object for each year onto the 'avgData' array
dataByYearsArray.forEach(yearData => {
    const temps = d3.mean(yearData[1].map(yearData => yearData["tas"]))
    const rains = d3.mean(yearData[1].map(yearData => yearData["pr"]))
    avgData.push({
        year: yearData[0],
        tempM: temps,
        rainM: rains
    });
});

// TASK: Initialize Scales using d3.linearScale function (see https://github.com/d3/d3-scale/blob/master/README.md#continuous-scales)
// You can make use of the d3.extent and d3.max function to calculate the domains. (see https://github.com/d3/d3-array/blob/master/README.md#statistics)
const max_temp = d3.max(avgData.map(yearData => yearData.tempM));
const max_rain = d3.max(avgData.map(yearData => yearData.rainM));
const x_year = d3.extent(avgData.map(yearData => yearData.year));

const xScale = d3.scaleLinear().domain([x_year[0], x_year[1]])
    .range([0, visWidth]);

let temperatureScale = d3.scaleLinear().domain([1, max_temp])
    .range([visHeight, 0]);

let rainScale = d3.scaleLinear().domain([1, max_rain])
    .range([visHeight, 0]);
    
// In order to organize our code, we add another group which will hold all elements (circles and paths) of the visualization
var visualization = viewport.append("g");
var circles = visualization.selectAll("circle")
    .data(avgData).enter();

// TASK: Append one blue circle for each rain data point. Make use of the previously initialized scales and anonymous functions.
// Make them classed c-rain and set the cx and cy attributes accordingly.
circles.append("circle")
    .attr("class", "c-rain")
    .attr("cx", d => xScale(d.year))
    .attr("cy", d => rainScale(d.rainM))
    .attr("fill", "blue")
    .attr("r", 2);

// TASK: Append one red circle for each temperature data point. Make use of the previously initialized scales and anonymous functions.
// Make them classed c-temp and set the cx and cy attributes accordingly.
circles.append("circle")
    .attr("class", "c-temp")
    .attr("cx", d => xScale(d["year"]))
    .attr("cy", d => temperatureScale(d["tempM"]))
    .attr("fill", "red")
    .attr("r", 2);
   
// TASK: Initialize a line generator for each line (rain and temperature) and define the generators x and y value.
// Save the line-generator to a variable
const tempLineGen = d3.line()
    .x(d => xScale(d.year))
    .y(d => temperatureScale(d.tempM));

const rainLineGen = d3.line()
    .x(d => xScale(d.year))
    .y(d => rainScale(d.rainM));


// TASK: Append two path elements to the 'visualization' group. Set its 'd' attribute respectively using the linegenerators from above
// Do not forget to set the correct class attributes in order to have the stylesheet applied (.line-temp, .line-rain, .line)
visualization.append("path")
    .attr("d", tempLineGen(avgData))
    .attr("class", "line-temp line");

visualization.append("path")
    .attr("d", rainLineGen(avgData))
    .attr("class", "line-rain line");

// At this point we have similar state as in Exercise 1

// Lets add some axis (check https://github.com/d3/d3-axis for an example)
var axisG = viewport.append("g");

// Add X Axis for years
axisG.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + visHeight + ")")
    .call(d3.axisBottom(xScale).tickFormat(d3.format(""))); //to remove the comma from the years

// TASK: append a group for the axis of the temperature on the left side (d3.axisLeft)
// Make it classed "y-temp" and translate it to the left side of the visualization (0, 0)
axisG.append("g")
    .attr("class", "y-temp")
    .call(d3.axisLeft(temperatureScale));

// TASK: append a group for the axis of the rain on the right side (d3.axisRight).
// Make it classed "y-rain" and translate it to the right side of the visualization (visWidth, 0)  
axisG.append("g")
    .attr("class", "y-rain")
    .attr("transform", "translate(" + visWidth + ",0)")
    .call(d3.axisRight(rainScale));

// TASK: append three text elements to the axisG group and label the axes respectively
// Append three text elements to the axisG group and label the axes respectively
axisG.append("text")
    .text("Temp")
    .attr("text-anchor", "middle")
    .attr("x", 0)
    .attr("y", -5)
    .attr("class", "axis-label axis-label-temp");


axisG.append("text")
    .text("Rain")
    .attr("text-anchor", "middle")
    .attr("x", visWidth)
    .attr("y", -5)
    .attr("class", "axis-label axis-label-rain");


axisG.append("text")
    .text("Year")
    .attr("text-anchor", "middle")
    .attr("x", visWidth / 2)
    .attr("y", visHeight + 50)
    .attr("class", "axis-label axis-label-year");

// TASK: Update the scales to Logarithmic scales (d3.scaleLog) if they are linear scales (d3.scaleLinear) and vice versa
    let tempScaleType = 'linear Scale';
    let rainScaleType = 'linear Scale';

    function updateAxis() {
        if (tempScaleType === 'linear Scale') {
            temperatureScale = d3.scaleLog().domain([1, max_temp]).range([visHeight, 0]);
            rainScale = d3.scaleLog().domain([1, max_rain]).range([visHeight, 0]);
            tempScaleType = 'logarithmic Scale';
            rainScaleType = 'logarithmic Scale';
        } 
        else if (tempScaleType === 'logarithmic Scale') {
            temperatureScale = d3.scaleLinear().domain([0, max_temp]).range([visHeight, 0]);
            rainScale = d3.scaleLinear().domain([0, max_rain]).range([visHeight, 0]);
            tempScaleType = 'linear Scale';
            rainScaleType = 'linear Scale';
        }

// The following code updates the axis and the circles according to the new scales
        visualization.selectAll('.c-temp').transition().duration(1000)
            .attr('cy', d => temperatureScale(d.tempM))

        visualization.selectAll('.c-rain').transition().duration(1000)
            .attr('cy', d => rainScale(d.rainM))
    
        visualization.select('.line-temp').transition().duration(1000)
            .attr('d', tempLineGen(avgData));
    
        visualization.select('.line-rain').transition().duration(1000)
            .attr('d', rainLineGen(avgData));

        axisG.select('.y-temp').transition().duration(1000)
            .call(d3.axisLeft(temperatureScale));
    
        axisG.select('.y-rain').transition().duration(1000)
            .attr("transform", "translate(" + visWidth + ",0)")
            .call(d3.axisRight(rainScale));
    }
