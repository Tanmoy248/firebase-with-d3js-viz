const svg = d3.select(".canvas")
            .append("svg")
            .attr('width', 600)
            .attr('height', 600)

const data = [{"time" : "2018-01-01 03:00:00", "available" : 128 , "online" : 156},
{"time" : "2018-01-01 03:01:00", "available" : 162 , "online" : 193},
{"time" : "2018-01-01 03:02:00", "available" : 142 , "online" : 168},
{"time" : "2018-01-01 03:03:00", "available" : 211 , "online" : 259},
{"time" : "2018-01-01 03:04:00", "available" : 131 , "online" : 160},
{"time" : "2018-01-01 03:05:00", "available" : 48 , "online" : 64}]

// data.forEach( d => {
//             d.available = +d.available
//             d.online = +d.online
//             d.time = new Date(d.time)
//         });

d3.json("http://localhost:9000/reports?from=2018-01-01%2003:00:00&to=2018-01-01%2003:50:00").then(data => {
    data.forEach( d => {
        d.available = +d.available
        d.online = +d.online
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
    const yValueOnline = d => d.online
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

    //cusotm y-min and y-max as we have 2 lines to fit
    const yMin = d3.min(data,yValue)
    const yMax = d3.max(data,yValueOnline)

    const yScale = d3.scaleLinear()
    .domain([yMin, yMax])
    .range([graphHeight, 0])
    .nice()

    console.log(xScale.domain())

    console.log(yScale.domain())

    // add a title
    graph.append('text')
    .attr('class', 'title')
    .attr('y', -(margin.top - 15) )
    .attr('x', graphWidth / 2 )


    // add the scale information, push x-axis from y=0 to y=graphHeight
    const xAxisGroup = graph.append('g')
    .attr('transform', `translate(0, ${graphHeight})`)

    //xAxisGroup.select('.domain').remove()

    const yAxisGroup = graph.append('g')
    //yAxisGroup.select('.domain').remove()

    const y = d3.scalePoint()
    .domain(d3.extent(data, yValue))
    // since y = 0, is the top left corner of screen, 
    //min(data) corresponds to graphheight and max(data) = 0 in the graph
    .range([graphHeight, 0])

    const x = d3.scaleTime()
    .domain(d3.extent(data,xValue))
    .range([0,graphWidth])
    .nice()

    // create the line Gens
    const lineGenerator = d3.line().x(d => xScale(xValue(d))).y(d => yScale(yValue(d)))
    const lineGenerator2 = d3.line().x(d => xScale(xValue(d))).y(d => yScale(yValueOnline(d)))

    graph.append('path').attr('class','line-path').attr('d', lineGenerator(data))
    graph.append('path').attr('class','line-path-online').attr('d', lineGenerator2(data))


    // add the enter selection and append to dom. Update their attributes
    // update as per the margin
    circs.enter()
    .append('circle')
    .attr("cy", d => yScale(yValue(d)) + margin.top)
    .attr("cx", d => xScale(xValue(d)) + margin.left)
    .attr("r", radius)
    .attr("fill", d => d.fill)

    circs.enter()
    .append('circle')
    .attr("cy", d => yScale(yValueOnline(d)) + margin.top)
    .attr("cx", d => xScale(xValue(d)) + margin.left)
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

    // legend boxes
    var legend_keys = ["Available", "Online"]
    function color_scale (d){ 
        if (d == "Available") return "maroon"
        else return "blueviolet"
    };

var lineLegend = svg.selectAll(".lineLegend").data(legend_keys)
    .enter().append("g")
    .attr("class","lineLegend")
    .attr("transform", function (d,i) {
            return "translate(" + (graphWidth + 10) + "," + ((i+1)*20)+")";
        });

lineLegend.append("text").text(function (d) {return d;})
    .attr("transform", "translate(15,9)"); //align texts with boxes

lineLegend.append("rect")
    .attr("fill", function (d, i) {return color_scale(d); })
    .attr("width", 10).attr("height", 10);
}
)


d3.select("body").transition()
    //.style("background-color", "black")