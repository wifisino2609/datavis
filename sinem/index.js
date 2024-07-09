document.addEventListener("DOMContentLoaded", function() {
    createScatterPlotMatrix(data);
});

function createScatterPlotMatrix(data) {
    const dimensions = ["engine_size", "horsepower", "peak_rpm", "city_mpg", "highway_mpg", "price"];
    const size = 150;
    const padding = 20;

    data.forEach(d => {
        dimensions.forEach(dim => {
            d[dim] = +d[dim] || 0; 
            if (isNaN(d[dim])) {
                console.log(`NaN found in ${dim} with value ${d[dim]}`);
            }
        });
    });

    const x = d3.scaleLinear().range([padding / 2, size - padding / 2]);
    const y = d3.scaleLinear().range([size - padding / 2, padding / 2]);

    const xAxis = d3.axisBottom().scale(x).ticks(5);
    const yAxis = d3.axisLeft().scale(y).ticks(5);

    const svg = d3.select("#chart").append("svg")
        .attr("width", size * dimensions.length + padding)
        .attr("height", size * dimensions.length + padding)
        .append("g")
        .attr("transform", `translate(${padding},${padding / 2})`);

    const domainByDimension = {};
    dimensions.forEach(d => {
        domainByDimension[d] = d3.extent(data, p => p[d]);
    });

    const cell = svg.selectAll(".cell")
        .data(cross(dimensions, dimensions))
        .enter().append("g")
        .attr("class", "cell")
        .attr("transform", d => `translate(${dimensions.indexOf(d.x) * size},${dimensions.indexOf(d.y) * size})`)
        .each(plot);

    // Add axis labels for columns
    svg.selectAll(".x.axis-label")
        .data(dimensions)
        .enter().append("text")
        .attr("class", "axis-label")
        .attr("x", (d, i) => i * size + size / 2)
        .attr("y", padding / 2 - 10)
        .attr("text-anchor", "middle")
        .text(d => d);

    // Add axis labels for rows
    svg.selectAll(".y.axis-label")
        .data(dimensions)
        .enter().append("text")
        .attr("class", "axis-label")
        .attr("x", -padding / 2 - 10)
        .attr("y", (d, i) => i * size + size / 2)
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .attr("transform", (d, i) => `rotate(-90, -${padding / 2 - 10}, ${i * size + size / 2}) translate(30,0)`)
        .text(d => d);

    function plot(p) {
        const cell = d3.select(this);

        x.domain(domainByDimension[p.x]);
        y.domain(domainByDimension[p.y]);

        cell.append("rect")
            .attr("class", "frame")
            .attr("x", padding / 2)
            .attr("y", padding / 2)
            .attr("width", size - padding)
            .attr("height", size - padding);

        if (p.x === p.y) {
            const histogram = d3.histogram()
                .domain(x.domain())
                .thresholds(x.ticks(20));

            const bins = histogram(data.map(d => d[p.x]));

            const yHist = d3.scaleLinear()
                .domain([0, d3.max(bins, d => d.length)])
                .range([size - padding / 2, padding / 2]);

            const bar = cell.selectAll(".bar")
                .data(bins)
                .enter().append("g")
                .attr("class", "bar")
                .attr("transform", d => `translate(${x(d.x0)},${yHist(d.length)})`);

            bar.append("rect")
                .attr("x", 1)
                .attr("width", d => x(d.x1) - x(d.x0) - 1)
                .attr("height", d => size - padding / 2 - yHist(d.length))
                .attr("class", "histogram");
        } else if (dimensions.indexOf(p.x) > dimensions.indexOf(p.y)) {
            const corr = pearsonCorrelation(data.map(d => d[p.x]), data.map(d => d[p.y]));
            cell.append("text")
                .attr("x", size / 2)
                .attr("y", size / 2)
                .attr("dy", ".35em")
                .style("text-anchor", "middle")
                .text(corr.toFixed(2));
        } else {
            cell.selectAll("circle")
                .data(data)
                .enter().append("circle")
                .attr("cx", d => x(d[p.x]))
                .attr("cy", d => y(d[p.y]))
                .attr("r", 3);
        }

        // Add X-axis
        if (dimensions.indexOf(p.y) === dimensions.length - 1) {
            cell.append("g")
                .attr("class", "axis")
                .attr("transform", `translate(0,${size - padding / 2})`)
                .call(xAxis);
        }

        // Add Y-axis
        if (dimensions.indexOf(p.x) === 0) {
            cell.append("g")
                .attr("class", "axis")
                .attr("transform", `translate(${padding / 2},0)`)
                .call(yAxis);
        }
    }

    cell.selectAll(".axis")
        .filter(d => dimensions.indexOf(d.y) !== dimensions.length - 1)
        .selectAll(".tick text")
        .style("display", "none");

    cell.selectAll(".axis")
        .filter(d => dimensions.indexOf(d.x) !== 0)
        .selectAll(".tick text")
        .style("display", "none");
}

function cross(a, b) {
    const c = [], n = a.length, m = b.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            c.push({ x: a[i], y: b[j] });
        }
    }
    return c;
}

function pearsonCorrelation(x, y) {
    const n = x.length;
    const meanX = d3.mean(x);
    const meanY = d3.mean(y);
    const diffX = x.map(val => val - meanX);
    const diffY = y.map(val => val - meanY);
    const numerator = d3.sum(diffX.map((val, i) => val * diffY[i]));
    const denominator = Math.sqrt(d3.sum(diffX.map(val => val * val)) * d3.sum(diffY.map(val => val * val)));
    return numerator / denominator;
}
