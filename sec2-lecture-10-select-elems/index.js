const canvas = d3.select(".canvas")

const svg = canvas.append("svg")
    .attr("height", 600)
    .attr("width", 600)

// instead of keeping the shapes directly in svg
// we prefer to use groups, so that they can be moved easily later

// we can move all the shapes to diff location in the canvas by adding
// a translate to group
const groups = svg.append('g')
.attr('transform', 'translate(200,200)');

// append shapes to the container
groups.append("rect")
.attr("width", 200)
.attr("height", 100)
.attr("x", 20)
.attr("y", 20)
.attr("fill", "blue");

groups.append("circle")
.attr("r", 50)
.attr("cx", 300)
.attr("cy", 65)
.attr("fill",  "pink")
.attr("stroke", "black")

svg.append("text")
.attr("x", 20)
.attr("y", 200)
.attr("fill", "black")
.text("hello shapes")
.style("font-family", "impact");