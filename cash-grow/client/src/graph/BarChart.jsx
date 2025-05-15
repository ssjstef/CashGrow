import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { getWeeklySpendingDataPerCategory } from "./Data";

// Renders the barchart graph
// Data is passed through by the Graph component, removes the need for another fetch request
function BarChart({userData}){

  const svgRef = useRef(); //Creates state where the graph is saved
  //dimentions of svg element
  const width = 600;
  const height = 400;

  //Returns the amount spent weekly in different categories
  //Only shows the last 10 weeks 
  const data = getWeeklySpendingDataPerCategory(userData).slice(0,10);

  // Extracts all categories from each week,
  // This is going to be used for the stacks
  const keys = Array.from(
    new Set(
      data.flatMap(d => Object.keys(d).filter(k => k !== "weekStart")) 
    )
  );

  //Renders only when the component is mounted
  useEffect(() => { 
    //Dimensions of graph
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current); // This is used as a reference to the svg DOM element
    svg.selectAll("*").remove();

    //Area that is going to be used to draw the graph
    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    //X axis, used for the bars, which represnet a week.
    const x = d3
      .scaleBand()
      .domain(data.map(d => d.weekStart)) 
      .range([0, innerWidth])
      .padding(0.2);

    // Scale for the amount spent
    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, d => d3.sum(keys, key => d[key] || 0)) //The domain goes from b to the largest amount spent in data
      ])
      .nice()
      .range([innerHeight, 0]);

    const color = d3
      .scaleOrdinal() 
      .domain(keys)
      .range(d3.schemePaired);// A scheme of 12 colours provided by D3

    const stackedData = d3.stack().keys(keys)(data); //Stacks the data, with smallest at the bottom for each week

    //Draws the rectangles for each layer for every week
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

    // Adds x-axis (dates)
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickFormat(d => d.slice(5))); // Show MM-DD
    
    //Adds the y-axis (amount)
    g.append("g").call(d3.axisLeft(y));

    // Legend for what each colour reprents 
    const legend = svg.append("g").attr("transform", `translate(${width - 500}, 20)`);

    keys.forEach((key, i) => {
      const row = legend.append("g").attr("transform", `translate(0, ${i * 20})`);
      row.append("rect").attr("width", 15).attr("height", 15).attr("fill", color(key)); // Adds the colour in the form of a rect to the legend
      row.append("text").attr("x", 20).attr("y", 12).text(key); //Adds the category to the legend
    });
  }, [data, keys]); // Updated if there is a change in data

  return <svg ref={svgRef}></svg>; //JSX component which is returned
};


export default BarChart;