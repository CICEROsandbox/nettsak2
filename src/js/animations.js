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
