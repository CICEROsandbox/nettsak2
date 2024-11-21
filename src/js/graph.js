async function createGraph() {
    // Load data
    const [data, annotations] = await Promise.all([
        d3.csv('data/emissions.csv', d => ({
            year: +d.Year,
            value: +d.Value,
            plus: +d.Plus1SD,
            minus: +d.Minus1SD
        })),
        d3.json('data/annotations.json').then(d => d.events)
    ]);

    const width = window.innerWidth * 0.9;
    const height = window.innerHeight * 0.7;
    const margin = {top: 60, right: 40, bottom: 40, left: 60};

    // Create SVG
    const svg = d3.select("#emissionsGraph")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Set up scales
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.minus) * 0.95, d3.max(data, d => d.plus) * 1.05])
        .range([height - margin.bottom, margin.top]);

    // Create line and area generators
    const line = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.value))
        .curve(d3.curveMonotoneX);

    const areaGenerator = d3.area()
        .x(d => xScale(d.year))
        .y0(d => yScale(d.minus))
        .y1(d => yScale(d.plus))
        .curve(d3.curveMonotoneX);

    // Add confidence interval area
    svg.append("path")
        .datum(data)
        .attr("class", "confidence-area")
        .attr("d", areaGenerator);

    // Add axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxis);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(yAxis);

    // Add the main line
    const path = svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    // Set up for line animation
    const pathLength = path.node().getTotalLength();
    path.attr("stroke-dasharray", pathLength)
        .attr("stroke-dashoffset", pathLength);

    return { path, pathLength, svg, xScale, yScale, data };
}

// Export for animations.js
window.createGraph = createGraph;
