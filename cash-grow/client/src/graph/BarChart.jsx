import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

// 🎯 Main Chart Component
function BarChart({userData}){

  const svgRef = useRef();
  const width = 600;
  const height = 400;

  //Only shows the last 10 weeks (in the future should be able to choose which ten weeks)
  const data = getWeeklySpendingDataPerCategory(userData).slice(0,10);

  // Dynamically extract all category keys
  const keys = Array.from(
    new Set(
      data.flatMap(d => Object.keys(d).filter(k => k !== "weekStart"))
    )
  );

  useEffect(() => {
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(data.map(d => d.weekStart))
      .range([0, innerWidth])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, d => d3.sum(keys, key => d[key] || 0))
      ])
      .nice()
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
      .attr("x", d => x(d.data.weekStart))
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth());

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickFormat(d => d.slice(5))); // Show MM-DD

    g.append("g").call(d3.axisLeft(y));

    // Legend
    const legend = svg.append("g").attr("transform", `translate(${width - 500}, 20)`);

    keys.forEach((key, i) => {
      const row = legend.append("g").attr("transform", `translate(0, ${i * 20})`);
      row.append("rect").attr("width", 15).attr("height", 15).attr("fill", color(key));
      row.append("text").attr("x", 20).attr("y", 12).text(key);
    });
  }, [data, keys]);

  return <svg ref={svgRef}></svg>;
};

//HELPERS

// Get start of week (Monday)
export function getWeekStartDate(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diffToMonday);
  d.setHours(0, 0, 0, 0);
  return d;
}


export function getWeeklySpendingDataPerCategory( transactions ) {
  const weekMap = new Map();

  transactions.forEach(tx => {
    console.log(transactions);
    const txDate = new Date(tx.Date);
    const monday = getWeekStartDate(txDate);
    const weekKey = monday.toISOString().split("T")[0];
    const category = tx.Category || "Uncategorized";
    const amount = parseFloat(tx.Amount) || 0;

    if (!weekMap.has(weekKey)) {
      weekMap.set(weekKey, {});
    }

    const categoryTotals = weekMap.get(weekKey);
    categoryTotals[category] = (categoryTotals[category] || 0) + amount;
  });

  // Convert to array format for charting
  return Array.from(weekMap.entries())
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .map(([weekStart, categoryData]) => ({
      weekStart,
      ...categoryData
    }));
}

export default BarChart;