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

    // Create animation timeline
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".scroll-container",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            
    // Define x positions for target years
    const yearPositions = {
        1991: xScale(1991),
        2008: xScale(2008),
        2020: xScale(2020),
    };

    // Keep track of displayed boxes
    const displayedBoxes = { 1991: false, 2008: false, 2020: false };

    // Create or select boxes for the years
    
    // Append radial highlights for each year
    const radialFilter = svg.append("defs")
        .append("filter")
        .attr("id", "radial-glow")
        .append("feGaussianBlur")
        .attr("stdDeviation", 10)
        .attr("result", "coloredBlur");

    // Append highlight circles for target years
    const highlightGroup = svg.append("g").attr("class", "highlights");
    Object.keys(yearPositions).forEach(year => {
        highlightGroup.append("circle")
            .attr("cx", yearPositions[year]) // Set x-position dynamically
            .attr("cy", height / 2)         // Adjust Y position based on your graph's layout
            .attr("r", 50)                  // Radius of the highlight
            .style("fill", "orange")
            .style("opacity", 0)           // Initially invisible
            .style("filter", "url(#radial-glow)")
            .attr("class", `highlight-${year}`);
    });

    // Show highlight when the box is displayed
    Object.keys(yearPositions).forEach(year => {
        if (!displayedBoxes[year] && currentX >= yearPositions[year]) {
            d3.select(`.highlight-${year}`).style("opacity", 1); // Show highlight
        }
    });
const boxes = {
        1991: d3.select('#box1991'),
        2008: d3.select('#box2008'),
        2020: d3.select('#box2020'),
    };

    onUpdate: function(self) {
        const progress = self.progress;
        const currentX = startX + (totalWidth * progress);

        // Update line and dots
        path.attr("stroke-dashoffset", pathLength * (1 - progress));

        // Check and display boxes at appropriate positions
        Object.keys(yearPositions).forEach(year => {
            if (!displayedBoxes[year] && currentX >= yearPositions[year]) {
                boxes[year].style('opacity', 1);  // Show box (assuming opacity is initially 0)
                displayedBoxes[year] = true;
            }
        });
    }
onUpdate: function(self) {
                const progress = self.progress;
                
                // Calculate current x position
                const currentX = startX + (totalWidth * progress);
                
                // Update line and dots
                path.attr("stroke-dashoffset", pathLength * (1 - progress));
                svg.selectAll(".dot")
                    .style("opacity", function(d) {
                        return xScale(d.year) <= currentX ? 1 : 0;
                    });

                // Trigger boxes based on x-position relative to years
                if (currentX >= xScale(1991)) {
                    gsap.to("#box1", { opacity: 1, y: 0, duration: 0.3 });
                } else {
                    gsap.to("#box1", { opacity: 0, y: 20, duration: 0.3 });
                }

                if (currentX >= xScale(2008)) {
                    gsap.to("#box2", { opacity: 1, y: 0, duration: 0.3 });
                } else {
                    gsap.to("#box2", { opacity: 0, y: 20, duration: 0.3 });
                }

                if (currentX >= xScale(2020)) {
                    gsap.to("#box3", { opacity: 1, y: 0, duration: 0.3 });
                } else {
                    gsap.to("#box3", { opacity: 0, y: 20, duration: 0.3 });
                }

                // Debug log
                console.log('Current position:', {
                    progress,
                    currentX,
                    year: xScale.invert(currentX),
                    box1Should: xScale(1991),
                    box2Should: xScale(2008),
                    box3Should: xScale(2020)
                });
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', initAnimations);
