async function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    const graphData = await createGraph();
    if (!graphData) {
        console.error('Failed to initialize graph');
        return;
    }

    const { path, pathLength, svg, xScale, data } = graphData;

    // Create separate animations for line and boxes
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".scroll-container",
            start: "top top",
            end: "bottom bottom",
            scrub: 1
        }
    });

    // Line drawing animation
    tl.to(path.node(), {
        strokeDashoffset: 0,
        duration: 1,
        onUpdate: function() {
            // Update dots based on line progress
            const lineProgress = 1 - (path.node().style.strokeDashoffset.replace("px", "") / pathLength);
            const currentX = xScale.range()[0] + (xScale.range()[1] - xScale.range()[0]) * lineProgress;
            
            svg.selectAll(".dot")
                .style("opacity", function(d) {
                    return xScale(d.year) <= currentX ? 1 : 0;
                });
        }
    });

    // Separate triggers for each box
    ScrollTrigger.create({
        trigger: ".scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: function(self) {
            const totalProgress = self.progress;
            const totalYears = data[data.length - 1].year - data[0].year;
            const currentYear = data[0].year + (totalYears * totalProgress);

            // Using specific scroll points for box triggers
            const scrollPoints = {
                box1: (1991 - data[0].year) / totalYears,
                box2: (2008 - data[0].year) / totalYears,
                box3: (2020 - data[0].year) / totalYears
            };

            // Trigger boxes based on scroll progress
            if (totalProgress >= scrollPoints.box1) {
                gsap.to("#box1", { opacity: 1, y: 0, duration: 0.3 });
            } else {
                gsap.to("#box1", { opacity: 0, y: 20, duration: 0.3 });
            }

            if (totalProgress >= scrollPoints.box2) {
                gsap.to("#box2", { opacity: 1, y: 0, duration: 0.3 });
            } else {
                gsap.to("#box2", { opacity: 0, y: 20, duration: 0.3 });
            }

            if (totalProgress >= scrollPoints.box3) {
                gsap.to("#box3", { opacity: 1, y: 0, duration: 0.3 });
            } else {
                gsap.to("#box3", { opacity: 0, y: 20, duration: 0.3 });
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', initAnimations);
