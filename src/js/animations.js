async function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    const graphData = await createGraph();
    if (!graphData) {
        console.error('Failed to initialize graph');
        return;
    }

    const { path, pathLength, svg, xScale, data } = graphData;

    // Get the min and max years for proper scaling
    const minYear = d3.min(data, d => d.year);
    const maxYear = d3.max(data, d => d.year);
    const yearRange = maxYear - minYear;

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

                // Calculate current year based on progress
                const currentYear = minYear + (yearRange * progress);

                // Update dots visibility
                svg.selectAll(".dot")
                    .style("opacity", function(d) {
                        return d.year <= currentYear ? 1 : 0;
                    });

                // Show boxes at specific years
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
