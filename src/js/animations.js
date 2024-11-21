async function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    const graphData = await createGraph();
    if (!graphData) return;

    const { path, pathLength, svg, xScale, yScale } = graphData;

    // Animate line drawing
    gsap.to(path.node(), {
        scrollTrigger: {
            trigger: ".scroll-container",
            start: "top top",
            end: "bottom bottom",
            scrub: 1
        },
        strokeDashoffset: 0,
        duration: 1,
        onUpdate: function() {
            const progress = 1 - (path.node().style.strokeDashoffset.replace("px", "") / pathLength);
            const currentX = progress * (xScale.range()[1] - xScale.range()[0]) + xScale.range()[0];
            
            svg.selectAll(".dot").style("opacity", function(d) {
                return xScale(d.year) <= currentX ? 1 : 0;
            });
        }
    });

    // Animate text boxes
    gsap.to("#box1", {
        scrollTrigger: {
            trigger: ".scroll-container",
            start: "33% top",
            end: "66% top",
            scrub: true,
        },
        opacity: 1,
        y: 0,
    });

    gsap.to("#box2", {
        scrollTrigger: {
            trigger: ".scroll-container",
            start: "66% top",
            end: "100% top",
            scrub: true,
        },
        opacity: 1,
        y: 0,
    });
}

document.addEventListener('DOMContentLoaded', initAnimations);
