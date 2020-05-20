const data = [
        {width: 50, height: 100, fill: "purple", x: 20, y:20 },
        {width: 50, height: 60, fill:"blue" , x: 120, y:60},
        {width: 50, height:30, fill:'red', x: 220, y:90}
    ]
    
    const svg = d3.select('svg')
    
    const rects = svg.selectAll('rect')
    .data(data)
    .attr("width", (d,i,n) => d.width)
    .attr("height", d=> d.height)
    .attr("fill", d=>d.fill)
    .attr("x", d=> d.x)
    .attr("y", d=> d.y);
    
    rects.enter()
    .append('rect')
    .attr("width", (d,i,n) => d.width)
    .attr("height", d=> d.height)
    .attr("fill", d=>d.fill)
    .attr("x", d=> d.x)
    .attr("y", d=> d.y);
    
    console.log(rect)
