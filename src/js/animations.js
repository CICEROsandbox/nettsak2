async function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    const graphData = await createGraph();
    if (!graphData) {
        console.error('Failed to initialize graph');
        return;
    }

    const { path, pathLength, svg, xScale, data } = graphData;
    const height = window.innerHeight * 0.7; // Match the height from graph creation

    // Rest of your code...
    const startX = xScale(1990);
    const endX = xScale(2024);
    const totalWidth = endX - startX;

    const yearPositions = {
        1991: xScale(1991),
        2008: xScale(2008),
        2020: xScale(2020),
    };

    const displayedBoxes = { 1991: false, 2008: false, 2020: false };

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
            .attr("cy", height / 2)
            .attr("r", 50)
            .style("fill", "orange")
            .style("opacity", 0)
            .style("filter", "url(#radial-glow)")
            .attr("class", `highlight-${year}`);
    });

    // Create animation timeline...
    // Rest of the code remains the same
}
