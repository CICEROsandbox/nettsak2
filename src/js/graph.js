async function createGraph() {
    try {
        // Log data loading attempt
        console.log('Loading data...');
        
        // Load emissions data from CSV with exact column names from your file
        const data = await d3.csv('data/emissions.csv', d => ({
            year: +d.Year,
            value: +d.Emissions,  // Changed from 'Value' to 'Emissions'
            plus: +d.Plus1SD,
            minus: +d.Minus1SD
        }));
        
        console.log('Data loaded:', data); // Debug log
        
        // Continue with graph creation...
        const width = window.innerWidth * 0.9;
        const height = window.innerHeight * 0.7;
        const margin = {top: 60, right: 40, bottom: 40, left: 60};

        const svg = d3.select("#emissionsGraph")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // Rest of the graph code...

    } catch (error) {
        console.error('Error loading or processing data:', error);
    }
}

// Export for animations.js
window.createGraph = createGraph;

// Call the function when document is ready
document.addEventListener('DOMContentLoaded', createGraph);
