import { useRef, useEffect } from 'react';
import * as d3 from "d3"; 
import { getWeeklySpending } from "./Data";

function PieChart({ userData, userBudget }) {
    const svgRef = useRef();

    useEffect(() => {
        if (!Array.isArray(userData) || typeof userBudget !== "number") {
            console.warn("Invalid data for PieChart");
            return;
        }

        const width = 550;
        const height = 400;
        const outerRadius = Math.min(width, height) / 2;
        const innerRadius = outerRadius * 0.6;
        const color = d3.scaleOrdinal(d3.schemeCategory10);
        const keys = ["Amount spent", "Amount remaining"];

        const weeklySpending = getWeeklySpending(userData);
        
        const spendingData = [
            { label: "Spent", value: weeklySpending },
            { label: "Remaining", value: Math.max(userBudget - weeklySpending, 0) } 

        const arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        // Turns values into start and end angle
        const pie = d3.pie()
            .sort(null)
            .value(d => d.value);

        const svg = d3.select(svgRef.current)
            .attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`)
            .attr("width", width)
            .attr("height", height);

        svg.selectAll("*").remove();

        const g = svg.append("g")
            .attr("transform", "translate(60, 0)");

        const arcs = pie(spendingData);

        g.selectAll("path")
            .data(arcs)
            .enter()
            .append("path")
            .attr("fill", (d, i) => color(i))
            .attr("d", arc)
            .append("title")
            .text(d => `${d.data.label}: ${d.data.value.toFixed(2)}`);

        const legend = svg.selectAll(".legend")
            .data(spendingData)
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(${ -width / 2 + 10 }, ${ -height / 2 + i * 20 + 10 })`);
        
        legend.append("rect")
            .attr("width", 12)
            .attr("height", 12)
            .style("fill", (d, i) => color(i));
        
        legend.append("text")
            .attr("x", 18)
            .attr("y", 6)
            .attr("dy", "0.35em")
            .style("text-anchor", "start")
            .text(d => d.label);     

    }, [userData, userBudget]); // Code runs every time data is updated

    return (
        <svg ref={svgRef}></svg> // svg elemnt is returned
    );   
}

export default PieChart;
