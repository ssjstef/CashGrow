import * as d3 from "d3";
import React, { useRef, useEffect } from "react";
import { getWeeklySpendingData } from "./Data";

//Function that creates the Line Graph, data is provided by the Graph component
function LineGraph({ userData, userBudget }) {

  const svgRef = useRef(); // This is used as a reference to the svg DOM element

  // Group data by the week start date and the amount spent in that week
  const weeklyData = getWeeklySpendingData(userData);

  //svg dimentions
  const width = 600;
  const height = 400;
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };

  // Parse data into arrays to be used to built graph

  const weekLabels = weeklyData.map(d => new Date(d.weekStart)); //x axis labels (week starting on)
  const amountSpentWeekly = weeklyData.map(d => parseFloat(d.spent)); //amount spent each week

  //Values to be used in legend
  const keys = ["Amount Spent", "Budget Goal"];
  const color = d3.scaleOrdinal().domain(keys).range(["steelblue", "orange"]);

  // Scale for x axis
  const xScale = d3.scaleTime() // Dealing with dates so this is more appropriate
    .domain(d3.extent(weekLabels)) // Axis goes from earliest to latest date
    .range([margin.left, width - margin.right]);

  // Scale for y axis
  const yScale = d3.scaleLinear() // Deals with numbers, so linear is appropriate
    .domain([0, d3.max(amountSpentWeekly)]) // Axis goes from 0 to largest value
    .nice()
    .range([height - margin.bottom, margin.top]);

  //Creates the line that represent the actual amount spent
  const line = d3.line()
    .x((_, i) => xScale(weekLabels[i])) // x coordinate given by the dates
    .y(d => yScale(d)); // y coordinate fiven by the spending

  // Creates line that represents user's budgeting goal
  const budgetLineY = yScale(Number(userBudget)); //Simple straight line that goes across y axis

  // Add axes only after the component is mounted
  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // X-axis
    svg.select(".x-axis")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(6).tickFormat(d3.timeFormat("%b %d")));

    // Y-axis
    svg.select(".y-axis")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale));

    //draws in the legend
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


  }, [xScale, yScale, weekLabels]); //If any of these chage the code is ran again.

  return (
    //Returns the svg element
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

      {/* Axes Groups */}
      <g className="x-axis" />
      <g className="y-axis" />
    </svg>
  );
}



export default LineGraph; 