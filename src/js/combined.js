async function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    const graphData = await createGraph();
    if (!graphData) {
        console.error('Failed to initialize graph');
        return;
    }

    const { path, pathLength, svg, xScale, yScale, data } = graphData;

    // Calculate normalized positions (0-1) for each year
    const yearPositions = {
        1991: (xScale(1991) - xScale.range()[0]) / (xScale.range()[1] - xScale.range()[0]),
        2008: (xScale(2008) - xScale.range()[0]) / (xScale.range()[1] - xScale.range()[0]),
        2020: (xScale(2020) - xScale.range()[0]) / (xScale.range()[1] - xScale.range()[0])
    };

    // Create timeline for line animation
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".scroll-container",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            onUpdate: function(self) {
                const progress = self.progress;
                
                // Update line drawing
                const dashOffset = pathLength * (1 - progress);
                path.node().style.strokeDashoffset = dashOffset;

                // Calculate current x position
                const currentX = progress * (xScale.range()[1] - xScale.range()[0]) + xScale.range()[0];

                // Update dots
                svg.selectAll(".dot").style("opacity", function(d) {
                    return xScale(d.year) <= currentX ? 1 : 0;
                });

                // Update boxes based on line position
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
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', initAnimations);
