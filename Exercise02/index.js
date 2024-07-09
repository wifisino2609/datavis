/**
 * IMPORTANT NOTICE:
 * 
 * The data is provided by the data.js file.
 * Make sure the data.js file is loaded before the index.js file, so that you can access it here!
 * The data is provided in an array called: data
 * const data = [
    { id: 1001, state: "Alabama", county: "Autauga County", rate: 5.1 },
        ....
 ];**/

// Constants
const width = 700;
const height = 500;
const margin = { left: 50, right: 20, bottom: 50 };

// Task 1.1: Data Preprocessing
/*Considering that the number of values falling outside the valid range is minimal( there are four  “-1” s and one “120") , deleting tuples with outlier values is the most suitable approach. 
This method is particularly effective when dealing with sporadic errors, 
as it minimizes the risk of bias without compromising the overall analysis.*/

// This task ensures that all data values are within a logical range.
function preprocessData(data) {
    // Filter out tuples with missing or outlier values
    const processedData = data.filter(entry => entry.rate >= 0 && entry.rate <= 100);

    return processedData;
}

// Setting up the histogram visualization using the processed data.

    // Task 1.2: Create equal-width bins for the histogram
    /* I would choose 10 bins as it divides the total number of the entries for the unemployment rate with enough detail.
    ((max numb)-(min numb))/number of bins = bin width => 24.4 - 1.6 = 22.8 if we tke the number of bins as 10 
    we get 2.8 as the band width which is good for the represention. On the other hand to have a different approch, 
    since we have 3213 entries we can use Sturge's formula, (log2 (3213) + 1) = 13 bins.*/

    // This subtask groups the data into a specified number of bins based on the unemployment rate.
    // Hint: look at the binning function of d3.bin https://observablehq.com/@d3/d3-bin
    // Your code here
function createHistogram(processedData, numbins) {
    const min = d3.min(processedData, d => d.rate);
    const max = d3.max(processedData, d => d.rate);
    const binWidth = (max - min) / numbins;
    const thresholds = d3.range(min, max, binWidth);

    const binGenerator = d3.bin()
        .domain([min, max])
        .thresholds(thresholds);

    const buckets = binGenerator(processedData.map(d => d.rate));

    return buckets;
}
    console.log("fmdsfklmls");

    // Task 2.1: Create Histogram with Equal Width Binning
    // Create a linear x- and y-scale
    // The x-scale maps unemployment rates to pixel values for the width of the histogram.
    // Your code here
    // The y-scale maps the count of entries in each bin to pixel values for the height of the bars.
    // Your code here

    // Bind the bins data to rectangles in the SVG
    // This subtask manages the rectangles that represent the bars of the histogram.
    // Your code here

    // Enter and update phase for rectangles
    // Rectangles are added or updated based on the data. This subtask also defines the bar dimensions.
    // Your code here

    // Add axes to the histogram
    // This subtask adds horizontal and vertical axes to the chart, with appropriate labels and scaling.
    // Your code here


// Execute the preprocessing and create the histogram
const processedData = preprocessData(data);
createHistogram(processedData, 10);
