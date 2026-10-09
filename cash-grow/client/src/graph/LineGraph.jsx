import * as d3 from "d3";
import React, { useRef, useEffect } from "react";
import { getWeeklySpendingData } from "./Data";

function LineGraph({ userData, userBudget }) {

  const svgRef = useRef(); 

  const weeklyData = getWeeklySpendingData(userData);

  const width = 600;
  const height = 400;
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };


  const weekLabels = weeklyData.map(d => new Date(d.weekStart)); 
  const amountSpentWeekly = weeklyData.map(d => parseFloat(d.spent)); 

  const keys = ["Amount Spent", "Budget Goal"];
  const color = d3.scaleOrdinal().domain(keys).range(["steelblue", "orange"]);

  const xScale = d3.scaleTime() 
    .domain(d3.extent(weekLabels)) 
    .range([margin.left, width - margin.right]);

  const yScale = d3.scaleLinear() 
    .domain([0, d3.max(amountSpentWeekly)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const line = d3.line()
    .x((_, i) => xScale(weekLabels[i])) 
    .y(d => yScale(d)); 

  const budgetLineY = yScale(Number(userBudget)); 

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    svg.select(".x-axis")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(6).tickFormat(d3.timeFormat("%b %d")));

    svg.select(".y-axis")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale));

      const legend = svg.selectAll(".legend")
      .data(keys)
      .enter()
      .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(50, ${i * 20})`);
    
    legend.append("rect")
      .attr("x", width - 270)
      .attr("width", 12)
      .attr("height", 12)
      .style("fill", d => color(d));
    
    legend.append("text")
      .attr("x", width - 250)
      .attr("y", 6)  
      .attr("dy", "0.35em")
      .style("text-anchor", "start")
      .text(d => d);


  }, [xScale, yScale, weekLabels]); 

  return (
    <svg ref={svgRef} width={width} height={height}>

      {/* Line Path */}
      <path
        fill="none"
        stroke="steelblue"
        strokeWidth="2"
        d={line(amountSpentWeekly)}
      />

      {/* Data Points */}
      <g fill="white" stroke="steelblue" strokeWidth="1.5">
        {amountSpentWeekly.map((d, i) => (
          <circle key={i} cx={xScale(weekLabels[i])} cy={yScale(d)} r="3" />
        ))}
      </g>

      {/* Budget Line */}
      <line
        x1={margin.left}
        x2={width - margin.right}
        y1={budgetLineY}
        y2={budgetLineY}
        stroke="orange"
        strokeDasharray="4"
        strokeWidth="2"
      />

      <g className="x-axis" />
      <g className="y-axis" />
    </svg>
  );
}



export default LineGraph; 