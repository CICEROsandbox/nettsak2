let graphState = null;

async function createGraph() {
    try {
        const data = await d3.csv('data/emissions.csv', d => ({
            year: +d.Year,
            value: +d.Emissions,
            plus: +d.Plus1SD,
            minus: +d.Minus1SD
        }));

        const width = window.innerWidth * 0.95;  // Adjusted to match CSS
        const height = window.innerHeight * 0.7;
        const margin = {top: 60, right: 40, bottom: 40, left: 60};

        // Clear existing SVG if any
        d3.select("#emissionsGraph").selectAll("*").remove();

        const svg = d3.select("#emissionsGraph")
            .append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet");

        // Rest of your graph creation code...
        const xScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.year))
            .range([margin.left, width - margin.right]);

        const yScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.minus) * 0.95, d3.max(data, d => d.plus) * 1.05])
            .range([height - margin.bottom, margin.top]);

        const line = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.value))
            .curve(d3.curveMonotoneX);

        const areaGenerator = d3.area()
            .x(d => xScale(d.year))
            .y0(d => yScale(d.minus))
            .y1(d => yScale(d.plus))
            .curve(d3.curveMonotoneX);

        svg.append("path")
            .datum(data)
            .attr("class", "confidence-area")
            .attr("d", areaGenerator);

        const path = svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale));

        const dots = svg.selectAll(".dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", d => xScale(d.year))
            .attr("cy", d => yScale(d.value))
            .attr("r", 4);

        const pathLength = path.node().getTotalLength();
        path.attr("stroke-dasharray", pathLength)
            .attr("stroke-dashoffset", pathLength);

        graphState = { path, pathLength, svg, xScale, yScale, data };
        return graphState;
    } catch (error) {
        console.error('Error creating graph:', error);
        return null;
    }
}

// Add resize handler
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        createGraph();
    }, 250); // Debounce resize events
});

async function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    const graphData = await createGraph();
    if (!graphData) {
        console.error('Failed to initialize graph');
        return;
    }

    const { path, pathLength, svg, xScale } = graphData;

    // Line animation
    gsap.to(path.node(), {
        scrollTrigger: {
            trigger: ".scroll-container",
            start: "top top",
            end: "bottom bottom",
            scrub: 1
        },
        strokeDashoffset: 0,
        duration: 1,
        onUpdate: function() {
            const progress = 1 - (path.node().style.strokeDashoffset.replace("px", "") / pathLength);
            const currentX = progress * (xScale.range()[1] - xScale.range()[0]) + xScale.range()[0];
            
            svg.selectAll(".dot").style("opacity", function(d) {
                return xScale(d.year) <= currentX ? 1 : 0;
            });
        }
    });

    // Text box animations
    gsap.to("#box1", {
        scrollTrigger: {
            trigger: ".scroll-container",
            start: "33% top",
            end: "66% top",
            scrub: true,
        },
        opacity: 1,
        y: 0,
    });

    gsap.to("#box2", {
        scrollTrigger: {
            trigger: ".scroll-container",
            start: "66% top",
            end: "100% top",
            scrub: true,
        },
        opacity: 1,
        y: 0,
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', initAnimations);
