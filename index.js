// SVG and margin 
let data;
let isSorted = false;
const margin = ({top: 20, right: 20, bottom: 20, left: 50})
const width = 650 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
const svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Scaling
const xScale = d3
    .scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);
const yScale = d3
    .scaleLinear()
    .range([height, 0]);

// Axis 
svg.append('g')
  .attr('class', 'axis x-axis')
  .attr("transform", "translate(0," + height + ")");

svg.append('g')
  .attr('class', 'axis y-axis');

svg.append('text')
    .attr('class', 'axis-title')
    .attr('height', 20)
    .attr('x', 0)
    .attr('y', -7)
    .text(d => d)
    .attr('font-size', 15)

function updateData(data, type) {
    let sortedData;
    if (isSorted) {
         sortedData = data.sort((x,y) => x[type] - y[type])
    } else {
        sortedData = data.sort((x,y) => x[type] - y[type]).reverse()
    }
    
    xScale.domain(sortedData.map(d => d.company));
    yScale.domain([0, d3.max(sortedData.map(
        d => {
            console.log(d[type])
            return d[type]}
        ))]);

    const bars = svg.selectAll('.bar')
        .data(sortedData, d=>d.company);
  
    bars.enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('fill', '#21B0DE')
        .attr('x', d => xScale(d.company))
        .attr("y",height)
        .attr('width', _ => xScale.bandwidth())
        .attr("height",0)
        .merge(bars)
        .transition()
        .delay((_,i) => i*100)
        .duration(1000)
        .attr('x', d => xScale(d.company))
        .attr('y', d => yScale(d[type]))
        .attr('height', d => height - yScale(d[type]))

    // Axis
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)

    svg.select('.x-axis')
        .transition()
        .duration(1000)
        .call(xAxis)
    svg.select('.y-axis')
        .transition()
        .duration(1000)
        .call(yAxis)

    // Axis Labels
    svg.select('.axis-title')
       .text(_ => type === 'revenue' ? 'Billion USD' : 'Stores')
        
}

d3.csv("coffee-house-chains.csv", d3.autoType).then(res => {
    data = res
    updateData(data, 'stores')
})

d3.select('#group-by').on('change', ()=> {
    type = d3.select('#group-by').node().value;
    updateData(data, type);
})

d3.select('#sort-btn').on('click', () => {
    type = d3.select('#group-by').node().value;
    isSorted = !isSorted; 
    updateData(data, type);
})