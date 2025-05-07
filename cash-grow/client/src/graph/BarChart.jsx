
import { useState, useRef, useEffect, useContext} from 'react';
import  AuthContext from "../context/AuthProvider";
import * as d3 from "d3"; 

//It is showing but just need to get the data that I want
const BarChart = () => {
  const svgRef = useRef();
  const width = 500;
  const height = 500;

    const data = [
      { group: "A", apples: 10, oranges: 20, bananas: 5 },
      { group: "B", apples: 20, oranges: 15, bananas: 10 },
      { group: "C", apples: 15, oranges: 25, bananas: 20 }
    ];

    const keys = ["apples", "oranges", "bananas"];


  useEffect(() => {
    // Set margins and dimensions
    const margin = { top: 30, right: 30, bottom: 50, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear existing

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(data.map(d => d.group))
      .range([0, innerWidth])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d3.sum(keys, key => d[key]))])
      .range([innerHeight, 0]);

    const color = d3
      .scaleOrdinal()
      .domain(keys)
      .range(d3.schemeCategory10);

    const stackedData = d3.stack().keys(keys)(data);

    g.selectAll("g.layer")
      .data(stackedData)
      .join("g")
      .attr("class", "layer")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      .data(d => d)
      .join("rect")
      .attr("x", d => x(d.data.group))
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth());

    // X axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));

    // Y axis
    g.append("g").call(d3.axisLeft(y));

    // Legend
    const legend = svg.append("g").attr("transform", `translate(${width - 120}, 20)`);

    keys.forEach((key, i) => {
      const row = legend.append("g").attr("transform", `translate(0, ${i * 20})`);

      row.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", color(key));

      row.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .text(key);
    });

  }, [data, keys, width, height]);

  return <svg ref={svgRef} />;
};

export default BarChart;

// function GraphCreator({userData}) {

//     console.log("Data received by Graph Creator: ", userData);

//     const {auth} = useContext(AuthContext);
//     const svgRef = useRef();

//     //Try and grab only some of the data from in here
//     //Try and grab the categories and the amount spent

//     const spentInCategory = () => {
//         const categories = [];
//         const amount = [];

//         for(let i = 0; i < userData.length; i++){
//             categories.push(userData[i].Category);
//             amount.push(Number(userData[i].Amount));
//         }
//         return {categories, amount};
//     }

//     useEffect(() => {
//         const { categories, amount } = spentInCategory();
//         // Anything in here will be relevant to D3 code
//         // setting up svg container
//         const w = 400;
//         const h = 300;
//         const svg = d3.select(svgRef.current)
//             .attr('width', w)
//             .attr('height', h)
//             .style('overflow', 'visible')
//             .style('margin-top', '75px')
//         // setting up svg scaling
//         const xScale = d3.scaleBand()
//             .domain(amount.map((val, i) => i))
//             .range([0, w])
//             .padding(0.5);

//         const yScale = d3.scaleLinear()
//             .domain([0, h])
//             .range([h, 0]);
//         // setting up the axes

//         const xAxis = d3.axisBottom(xScale)
//             .ticks(data.length);
//         const yAxis = d3.axisLeft(yScale)
//             .ticks(5);
//         svg.append('g')
//             .call(xAxis)
//             .attr('transform', `translate(0, ${h})`)
//         svg.append('g')
//             .call(yAxis);
//         // set up the svg data

//         svg.selectAll('.bar')
//             .data(amount)
//             .join('rect')
//                 .attr('x', (v, i) => xScale(i))
//                 .attr('y', d => yScale(d))
//                 .attr('width', xScale.bandwidth())
//                 .attr('height', val => h - yScale(val));


//     },[userData]);
//     //Now i should have the data

//     const data = () => {

//     }

//     return(
//         <div className="d3Graph">
//             <svg ref={svgRef}></svg>
//         </div>


//     )

// }

// export default GraphCreator;
