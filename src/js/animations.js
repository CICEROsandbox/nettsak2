
async function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    const graphData = await createGraph();
    if (!graphData) {
        console.error('Failed to initialize graph');
        return;
    }

    const { path, pathLength, svg, xScale, data } = graphData;

    // Get actual x-positions for years on the graph
    const startX = xScale(1990);
    const endX = xScale(2024);
    const totalWidth = endX - startX;

    // Define x positions for target years
    const yearPositions = {
        1991: xScale(1991),
        2008: xScale(2008),
        2020: xScale(2020),
    };

    // Keep track of displayed boxes
    const displayedBoxes = { 1991: false, 2008: false, 2020: false };

    // Append radial highlights for each year
    const radialFilter = svg.append("defs")
        .append("filter")
        .attr("id", "radial-glow")
        .append("feGaussianBlur")
        .attr("stdDeviation", 10)
        .attr("result", "coloredBlur");

    const highlightGroup = svg.append("g").attr("class", "highlights");
    Object.keys(yearPositions).forEach(year => {
        highlightGroup.append("circle")
            .attr("cx", yearPositions[year])
            .attr("cy", height / 2) // Adjust Y position based on graph layout
            .attr("r", 50) // Radius of the highlight
            .style("fill", "orange")
            .style("opacity", 0) // Initially invisible
            .style("filter", "url(#radial-glow)")
            .attr("class", `highlight-${year}`);
    });

    // Create or select boxes for the years
    const boxes = {
        1991: d3.select('#box1991'),
        2008: d3.select('#box2008'),
        2020: d3.select('#box2020'),
    };

    // Create animation timeline
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".scroll-container",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            onUpdate: function(self) {
                const progress = self.progress;
                const currentX = startX + (totalWidth * progress);

                // Update line and dots
                path.attr("stroke-dashoffset", pathLength * (1 - progress));

                // Check and display boxes at appropriate positions
                Object.keys(yearPositions).forEach(year => {
                    if (!displayedBoxes[year] && currentX >= yearPositions[year]) {
                        boxes[year].style('opacity', 1); // Show box (assuming opacity is initially 0)
                        displayedBoxes[year] = true;
                        d3.select(`.highlight-${year}`).style("opacity", 1); // Show highlight
                    }
                });
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', initAnimations);
