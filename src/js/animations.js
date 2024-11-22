async function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    const graphData = await createGraph();
    if (!graphData) {
        console.error('Failed to initialize graph');
        return;
    }

    const { path, pathLength, svg, xScale, data } = graphData;

    // Animation timeline
    gsap.to(path.node(), {
        scrollTrigger: {
            trigger: ".scroll-container",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            onUpdate: function(self) {
                // Calculate how much of the line has been drawn
                const progress = self.progress;
                const drawLength = pathLength * progress;
                
                // Get the point where the line is currently drawn to
                const currentPoint = path.node().getPointAtLength(drawLength);
                
                // Find the current year based on the line's x position
                const currentYear = xScale.invert(currentPoint.x);
                
                // Update line drawing
                path.attr("stroke-dashoffset", pathLength * (1 - progress));

                console.log('Current Year:', currentYear); // Debug log

                // Update both dots and boxes based on the line position
                svg.selectAll(".dot")
                    .style("opacity", function(d) {
                        return d.year <= currentYear ? 1 : 0;
                    });

                // Trigger boxes based on exact years
                if (currentYear >= 1991) {
                    gsap.to("#box1", { opacity: 1, y: 0, duration: 0.3 });
                } else {
                    gsap.to("#box1", { opacity: 0, y: 20, duration: 0.3 });
                }

                if (currentYear >= 2008) {
                    gsap.to("#box2", { opacity: 1, y: 0, duration: 0.3 });
                } else {
                    gsap.to("#box2", { opacity: 0, y: 20, duration: 0.3 });
                }

                if (currentYear >= 2020) {
                    gsap.to("#box3", { opacity: 1, y: 0, duration: 0.3 });
                } else {
                    gsap.to("#box3", { opacity: 0, y: 20, duration: 0.3 });
                }
            }
        },
        strokeDashoffset: 0,
        duration: 1
    });
}

document.addEventListener('DOMContentLoaded', initAnimations);
