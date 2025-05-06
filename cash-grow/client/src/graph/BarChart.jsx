
import { useState, useRef, useEffect, useContext} from 'react';
import  AuthContext from "../context/AuthProvider";
import * as d3 from "d3"; 

function GraphCreator({userData}) {

    console.log("Data received by Graph Creator: ", userData);

    const {auth} = useContext(AuthContext);
    const svgRef = useRef();

    //Try and grab only some of the data from in here
    //Try and grab the categories and the amount spent

    const spentInCategory = () => {
        const categories = [];
        const amount = [];

        for(let i = 0; i < userData.length; i++){
            categories.push(userData[i].Category);
            amount.push(Number(userData[i].Amount));
        }
        return {categories, amount};
    }

    useEffect(() => {
        const { categories, amount } = spentInCategory();
        // Anything in here will be relevant to D3 code
        // setting up svg container
        const w = 400;
        const h = 300;
        const svg = d3.select(svgRef.current)
            .attr('width', w)
            .attr('height', h)
            .style('overflow', 'visible')
            .style('margin-top', '75px')
        // setting up svg scaling
        const xScale = d3.scaleBand()
            .domain(amount.map((val, i) => i))
            .range([0, w])
            .padding(0.5);

        const yScale = d3.scaleLinear()
            .domain([0, h])
            .range([h, 0]);
        // setting up the axes

        const xAxis = d3.axisBottom(xScale)
            .ticks(data.length);
        const yAxis = d3.axisLeft(yScale)
            .ticks(5);
        svg.append('g')
            .call(xAxis)
            .attr('transform', `translate(0, ${h})`)
        svg.append('g')
            .call(yAxis);
        // set up the svg data

        svg.selectAll('.bar')
            .data(amount)
            .join('rect')
                .attr('x', (v, i) => xScale(i))
                .attr('y', d => yScale(d))
                .attr('width', xScale.bandwidth())
                .attr('height', val => h - yScale(val));


    },[userData]);
    //Now i should have the data

    const data = () => {

    }

    return(
        <div className="d3Graph">
            <svg ref={svgRef}></svg>
        </div>


    )

}

export default GraphCreator;
