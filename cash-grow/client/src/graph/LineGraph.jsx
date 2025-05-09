import * as d3 from "d3";
import React, { useRef, useEffect } from "react";

function LineGraph({ userData, userBudget }) {
  const svgRef = useRef();

  const weeklyData = getWeeklySpendingData(userData);
  const width = 600;
  const height = 400;
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };

  // Parse data
  const weekLabels = weeklyData.map(d => new Date(d.weekStart));
  const amountSpentWeekly = weeklyData.map(d => parseFloat(d.spent));
  const keys = ["Amount Spent", "Budget Goal"];
  const color = d3.scaleOrdinal().domain(keys).range(["steelblue", "orange"]);

  // Scales
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

  // Budget line position
  const budgetLineY = yScale(Number(userBudget));

  // Add axes after render
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

      {/* Axes Groups */}
      <g className="x-axis" />
      <g className="y-axis" />
    </svg>
  );
}

// Group transactions by week
export function getWeeklySpendingData(transactions) {
  const weekMap = new Map();

  transactions.forEach(tx => {
    console.log(tx)
    const txDate = new Date(tx.Date);
    const monday = getWeekStartDate(txDate);
    const key = monday.toISOString().split("T")[0];
    const amount = parseFloat(tx.Amount) || 0;

    weekMap.set(key, (weekMap.get(key) || 0) + amount);
  });

  return Array.from(weekMap.entries())
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .map(([weekStart, spent]) => ({ weekStart, spent }));
}

// Get Monday of the week
export function getWeekStartDate(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diffToMonday);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default LineGraph;







// import * as d3 from "d3";
// import React from "react";

// function LineGraph({ userData, userBudget }) {


//   const weeklyData = getWeeklySpendingData(userData);
//   console.log(typeof weeklyData[0].weekStart);
//   console.log(userBudget);
//   const weekLabels = weeklyData.map(d => d.weekStart);
//   const amountSpentWeekly = weeklyData.map(d => parseFloat(d.spent));

//   const data = amountSpentWeekly;
//   const width = 640;
//   const height = 400;
//   const marginTop = 20;
//   const marginRight = 20;
//   const marginBottom = 20;
//   const marginLeft = 20;

//   const x = d3.scaleLinear()
//     .domain([0, data.length - 1])
//     .range([marginLeft, width - marginRight]);

//   const y = d3.scaleLinear()
//     .domain([0, d3.max(data)])
//     .range([height - marginBottom, marginTop]);

//   const line = d3.line()
//     .x((d, i) => x(i))
//     .y(d => y(d));

//   const scale = scaleTime().domain([d3.min(weekLabels), d3.max(weekLabels)]);

//   const xAxis = d3.axisBottom()

//   const yAxis = d3.axisLeft()

//   const budgetLine = y(Number(userBudget));


//   return (
//     <svg width={width} height={height}>
//       <path
//         fill="none"
//         stroke="steelblue"
//         strokeWidth="2"
//         d={line(data)}
//       />
//       <g fill="white" stroke="steelblue" strokeWidth="1.5">
//         {data.map((d, i) => (
//           <circle key={i} cx={x(i)} cy={y(d)} r="3" />
//         ))}
//       </g>
//       <g>
//         <line
//         x1={marginLeft}
//         x2={width - marginRight}
//         y1={budgetLine}
//         y2={budgetLine}
//         stroke="orange"
//         strokeWidth="2"
//         />
//       </g>
//     </svg>
//   );
// }

// function getWeeklySpendingData(transactions) {
//   const weekMap = new Map();

//   transactions.forEach(tx => {
//     const txDate = new Date(tx.Date);
//     const monday = getWeekStartDate(txDate); // Get the start of the week

//     const key = monday.toISOString().split('T')[0]; // YYYY-MM-DD, this is better as what is returned otherwise sucks
//     const amount = parseFloat(tx.Amount) || 0;

//     if (weekMap.has(key)) {
//       weekMap.set(key, weekMap.get(key) + amount);
//     } else {
//       weekMap.set(key, amount);
//     }
//   });

//   // Convert Map to sorted array
//   return Array.from(weekMap.entries())
//     .sort((a, b) => new Date(a[0]) - new Date(b[0]))
//     .map(([weekStart, spent]) => ({ weekStart, spent }));
// }

// // Helper: Get the Monday of the week for a given date
// function getWeekStartDate(date) {
//   const d = new Date(date);
//   const day = d.getDay();
//   const diffToMonday = (day === 0 ? -6 : 1) - day;
//   d.setDate(d.getDate() + diffToMonday);
//   d.setHours(0, 0, 0, 0);
//   return d;
// }

// export default LineGraph;



