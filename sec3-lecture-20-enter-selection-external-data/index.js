const svg = d3.select("svg")

d3.json('planets.json').then(data => {
    const circs = svg.selectAll('circle')
    .data(data)

    console.log(circs)
    
    // add attributes for already existing circles in dom
    circs.attr("cy", 150)
    .attr("cx", d => d.distance)
    .attr("r", d => d.radius)
    .attr("fill", d => d.fill);

    // add the enter selection and append to dom. Update their attributes
    circs.enter()
    .append('circle')
    .attr("cy", 150)
    .attr("cx", d => d.distance)
    .attr("r", d => d.radius)
    .attr("fill", d => d.fill)
}
)

d3.select("body").transition()
    .style("background-color", "black")