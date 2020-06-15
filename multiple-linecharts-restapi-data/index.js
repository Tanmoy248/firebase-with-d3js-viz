const svg = d3.select(".canvas")
            .append("svg")
            .attr('width', 600)
            .attr('height', 600)

d3.json("http://localhost:9000/").then(data => {
    data.forEach( d => {
        d.available = +d.available
        d.time = new Date(d.time)
    });

    const circs = svg.selectAll('circle')
    .data(data)

    //console.log(circs)
    
    // create margins and dimensions
    const margin = {top:20, right:20, bottom:100, left:100}
    const graphWidth = 600 - margin.left - margin.right
    const graphHeight = 600 - margin.top - margin.bottom

    const graph = svg.append('g')
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const xValue = d => d.time
    const xAxisLabel = "Time"

    const yValue = d => d.available
    const yAxisLabel = "Count"

    const radius = 5

    // define the scale const

    //const xAxisTickFormat = number => d3.format('.3s')(number).replace('G', 'B')
    const xAxisTickFormat = d3.timeFormat('%H:%M:%S %L')
    // "2018-01-01 04:00:00"
    

    const xScale = d3.scaleTime()
    .domain(d3.extent(data,xValue))
    //.domain([0, d3.max(data,xValue)])
    .range([0, graphWidth])
    .nice()

    const yScale = d3.scaleLinear()
    .domain(d3.extent(data,yValue))
    .range([graphHeight, 0])
    .nice()

    console.log(xScale.domain())

    console.log(yScale.domain())

    // add a title
    graph.append('text')
    .attr('class', 'title')
    .attr('y', -(margin.top - 15) )
    .attr('x', graphWidth / 2 )
    .text('Time-series for Drivers Online')

    // gridlines in x axis function
    function make_x_gridlines() {		
    return d3.axisBottom(xScale)
        .ticks(5)
}

    // gridlines in y axis function
    function make_y_gridlines() {		
    return d3.axisLeft(y)
        .ticks(5)
    }

    // add the scale information, push x-axis from y=0 to y=graphHeight
    const xAxisGroup = graph.append('g')
    .attr('transform', `translate(0, ${graphHeight})`)

    //xAxisGroup.select('.domain').remove()

    const yAxisGroup = graph.append('g')
    //yAxisGroup.select('.domain').remove()

    const y = d3.scalePoint()
    .domain(d3.extent(data, yValue))
    //.domain([0,d3.max(data, d=> d.available)])
    .range([graphHeight, 0])

    const x = d3.scaleTime()
    .domain(d3.extent(data,xValue))
    .range([0,graphWidth])
    .nice()


    // add attributes for already existing circles in dom
    // circs.attr("cy", )
    // .attr("cx", d => d.distance)
    // .attr("r", d => d.radius)
    // .attr("fill", d => d.fill);

    // add the enter selection and append to dom. Update their attributes
    circs.enter()
    .append('circle')
    .attr("cy", d => yScale(yValue(d)))
    .attr("cx", d => xScale(xValue(d)))
    .attr("r", radius)
    .attr("fill", d => d.fill)

    // create and call the axes
    const xAxis = d3.axisBottom(xScale)
    .ticks(5)
    .tickFormat(d3.timeFormat('%H:%M:%S %L')).tickSize(-graphHeight)
    
    const yAxis = d3.axisLeft(yScale)
    //.ticks(5)
    .tickSize(-graphWidth)

    // add the x gridlines
    xAxisGroup.attr('class','grid').call(xAxis)
    // .call(make_x_gridlines()
    // .tickSize(-graphHeight)
    // .tickFormat("")
    // )
    
    // add the y gridlines
    yAxisGroup.attr('class','grid').call(yAxis)
    // .call(make_y_gridlines()
    // .tickSize(-graphWidth)
    // .tickFormat("")
    // )

    // add the x axis
    //xAxisGroup.call(d3.axisBottom(x))    

    // add the Y axis
    //yAxisGroup.call(d3.axisLeft(y))


    //add tilt to the x-axis
    xAxisGroup.selectAll('text')
    .attr('transform', 'rotate(-40)')
    .attr('text-anchor','end')

        // add labels to the axes
        xAxisGroup.append('text')
        .attr('class', 'axis-label')
        .attr('y', margin.bottom - 10)
        .attr('x', graphWidth/2)
        .attr('fill', 'black')
        .text(xAxisLabel)
    
        yAxisGroup.append('text')
        .attr('class', 'axis-label')
        .attr('y', -50)
        .attr('x', -graphHeight/2)
        .attr('text-anchor', 'middle')
        .attr('transform', `rotate(-90)`)
        .attr('fill', 'black')
        .text(yAxisLabel)
}
)

d3.select("body").transition()
    //.style("background-color", "black")