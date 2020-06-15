// the idea is to generate the entire svg html via javascript.
// Hence just get the canvass and append svg via d3

const svg = d3.select(".canvas")
                .append('svg')
                .attr("width", 600)
                .attr("height", 600);


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