async function initAnimations() {
    const { path, pathLength, svg, xScale, yScale, data } = await createGraph();
    
    gsap.registerPlugin(ScrollTrigger);

    // Create main timeline
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".scroll-container",
            start: "top top",
            end: "bottom bottom",
            scrub: 1
        }
    });

    // Animate line drawing
    tl.to(path.node(), {
        strokeDashoffset: 0,
        duration: 1,
        onUpdate: function() {
            const progress = 1 - (path.node().style.strokeDashoffset.replace("px", "") / pathLength);
            const currentX = progress * (xScale.range()[1] - xScale.range()[0]) + xScale.range()[0];
            
            // Update dots visibility based on line progress
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

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', initAnimations);
