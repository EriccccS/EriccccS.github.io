const margin = { top: 40, right: 36, bottom: 58, left: 66 };
const width = 700 - margin.left - margin.right;
const height = 430 - margin.top - margin.bottom;

const svg = d3.select("#myChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const tooltip = d3.select("#myTooltip");

d3.csv("https://data1500.github.io/test-project/providenceTemp.csv", d => ({
    year: +d.year,
    avgHigh: +d.avgHigh
})).then(data => {
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([55, d3.max(data, d => d.avgHigh) + 1])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")))
        .call(g => g.select(".domain").attr("stroke", "#7b8fa8"));

    svg.append("g")
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").attr("stroke", "#7b8fa8"));

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -12)
        .attr("text-anchor", "middle")
        .style("font-family", "Inter, Arial, sans-serif")
        .style("font-size", "16px")
        .style("font-weight", "700")
        .style("fill", "#10233d")
        .text("Providence Average High Temperature by Year");

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 42)
        .attr("text-anchor", "middle")
        .style("font-family", "Inter, Arial, sans-serif")
        .style("font-size", "12px")
        .style("fill", "#39597c")
        .text("Year");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -45)
        .attr("text-anchor", "middle")
        .style("font-family", "Inter, Arial, sans-serif")
        .style("font-size", "12px")
        .style("fill", "#39597c")
        .text("Average High Temperature (°F)");

    const sortedData = [...data].sort((a, b) => a.year - b.year);
    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.avgHigh));

    svg.append("path")
        .datum(sortedData)
        .attr("fill", "none")
        .attr("stroke", "#90b5df")
        .attr("stroke-width", 2)
        .attr("opacity", 0.9)
        .attr("d", line);

    svg.append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.year))
        .attr("cy", d => y(d.avgHigh))
        .attr("r", 4.8)
        .style("fill", "#2b68ad")
        .style("opacity", 0.88)
        .on("mousemove", (event, d) => {
            tooltip
                .classed("hidden", false)
                .style("left", `${event.pageX + 12}px`)
                .style("top", `${event.pageY - 32}px`)
                .html(`Year: ${d.year}<br>Avg High: ${d.avgHigh.toFixed(1)}°F`);
        })
        .on("mouseleave", () => {
            tooltip.classed("hidden", true);
        });
});