async function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    const graphData = await createGraph();
    if (!graphData) {
        console.error('Failed to initialize graph');
        return;
    }

    const { path, pathLength, svg, xScale, data } = graphData;

    // Calculate actual position for each year on the SVG
    const year1991Pos = xScale(1991);
    const year2008Pos = xScale(2008);
    const year2020Pos = xScale(2020);

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

                // Get current x position of the line end
                const currentX = xScale.range()[0] + (xScale.range()[1] - xScale.range()[0]) * progress;

                // Show dots based on line progress
                svg.selectAll(".dot")
                    .style("opacity", function(d) {
                        return xScale(d.year) <= currentX ? 1 : 0;
                    });

                // Show boxes based on current line position
                if (currentX >= year1991Pos) {
                    gsap.to("#box1", { opacity: 1, y: 0, duration: 0.3 });
                } else {
                    gsap.to("#box1", { opacity: 0, y: 20, duration: 0.3 });
                }

                if (currentX >= year2008Pos) {
                    gsap.to("#box2", { opacity: 1, y: 0, duration: 0.3 });
                } else {
                    gsap.to("#box2", { opacity: 0, y: 20, duration: 0.3 });
                }

                if (currentX >= year2020Pos) {
                    gsap.to("#box3", { opacity: 1, y: 0, duration: 0.3 });
                } else {
                    gsap.to("#box3", { opacity: 0, y: 20, duration: 0.3 });
                }
            }
        },
        strokeDashoffset: 0,
        duration: 1
    });

    // Debug helper - log positions to verify
    console.log('Year positions:', {
        '1991': year1991Pos,
        '2008': year2008Pos,
        '2020': year2020Pos
    });
}

document.addEventListener('DOMContentLoaded', initAnimations);
