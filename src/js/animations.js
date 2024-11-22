// animations.js
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
                const currentX = progress * (xScale.range()[1] - xScale.range()[0]) + xScale.range()[0];
                
                svg.selectAll(".dot").style("opacity", function(d) {
                    return xScale(d.year) <= currentX ? 1 : 0;
                });

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
        },
        strokeDashoffset: 0,
        duration: 1
    });
}

document.addEventListener('DOMContentLoaded', initAnimations);
