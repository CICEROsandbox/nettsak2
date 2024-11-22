async function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    const graphData = await createGraph();
    if (!graphData) {
        console.error('Failed to initialize graph');
        return;
    }

    const { path, pathLength, svg, xScale } = graphData;

    gsap.to(path.node(), {
        scrollTrigger: {
            trigger: ".scroll-container",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            onUpdate: function(self) {
                const progress = self.progress;
                
                // Update line drawing
                const currentDash = pathLength * (1 - progress);
                path.attr("stroke-dashoffset", currentDash);

                // Get current x position from the line's progress
                const currentPoint = path.node().getPointAtLength(pathLength * progress);
                const currentYear = xScale.invert(currentPoint.x);

                // Update dots after the current point
                svg.selectAll(".dot").style("opacity", function(d) {
                    return d.year <= currentYear ? 1 : 0;
                });

                // Show boxes based on line position
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
