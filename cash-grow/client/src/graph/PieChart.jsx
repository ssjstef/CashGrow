

import { useRef, useEffect } from 'react';
import * as d3 from "d3"; 

function PieChart({ userData, userBudget }) {
    const svgRef = useRef();

    useEffect(() => {
        if (!Array.isArray(userData) || typeof userBudget !== "number") {
            console.warn("Invalid data for PieChart");
            return;
        }

        const width = 400;
        const height = 400;
        const outerRadius = Math.min(width, height) / 2;
        const innerRadius = outerRadius * 0.6;
        const color = d3.scaleOrdinal(d3.schemeCategory10);
        const keys = ["Amount spent", "Amount remaining"];

        const weeklySpending = getWeeklySpending(userData);

        const spendingData = [
            { label: "Spent", value: weeklySpending },
            { label: "Remaining", value: Math.max(userBudget - weeklySpending, 0) }
        ];

        const arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        const pie = d3.pie()
            .sort(null)
            .value(d => d.value);

        const svg = d3.select(svgRef.current)
            .attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`)
            .attr("width", width)
            .attr("height", height);

        svg.selectAll("*").remove(); // clear before redraw

        const arcs = pie(spendingData);

        svg.selectAll("path")
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

    }, [userData, userBudget]);

    return (
        <svg ref={svgRef}></svg>
    );   
}

// Helper to calculate weekly spending
function getWeeklySpending(userData) {
    if (!Array.isArray(userData)) return 0;

    const today = new Date();
    const dayOfWeek = today.getDay();
    const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);

    let totalSpent = 0;

    userData.forEach(transaction => {
        const transactionDate = new Date(transaction.Date);
        if (
            transactionDate >= monday &&
            transactionDate <= today
            //transaction.InOut?.toLowerCase() === "out" // optional chaining now safe
        ) {
            totalSpent += parseFloat(transaction.Amount) || 0;
        }
    });

    return totalSpent;
}

export default PieChart;
