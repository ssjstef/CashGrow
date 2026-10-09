import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { createBubbles } from "./Data";


function BubbleGraph({ userData }) {
  const svgRef = useRef();  
  const width = 400;
  const height = 400;

  //The colour gets darker the further into the graph you go
  const color = d3.scaleLinear() 
    .domain([0, 5]) 
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"]) 
    .interpolate(d3.interpolateHcl);

  const pack = data => d3.pack()
    .size([width, height])
    .padding(3)(

      //The items are arranged in the same hierarcy as how the data is passed through
      //This means entries inside an element will be rendered within the bounds of its circle
      d3.hierarchy(data)
        .sum(d => +d.value) 
        .sort((a, b) => b.value - a.value)
    );

  useEffect(() => {
    const svg = d3.select(svgRef.current).attr("viewBox", [0, 0, width, height]); 

    const data = createBubbles(userData); //returns nested structure: { name, children: [{name, value}] }
    console.log(data);
    const root = pack(data); 
    let focus = root; 
    let view;

    const nodes = svg.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .style("background", "f8f8f8")
      .data(root.descendants()) 
      .join("g")
        .attr("transform", d => `translate(${d.x},${d.y})`); //Think this needs to be changed, the radius is starting from the wrong place

    const circle = nodes.append("circle")
      .attr("r", d => d.r)
      .attr("fill", d => d.children ? color(d.depth) : "white")
      .attr("stroke", "#000")
      .on("click", (event, d) => {
        if (focus !== d) {
          zoom(event, d);
          event.stopPropagation();
        }
      });

    const label = nodes.append("text")
      .style("text-anchor", "middle")
      .style("font", "10px sans-serif")
      .style("pointer-events", "none")
      .style("fill-opacity", d => d.parent === root ? 1 : 0)
      .style("display", d => d.parent === root ? "inline" : "none")
      .text(d => d.data.name);

    svg.on("click", event => zoom(event, root));

    zoomTo([root.x, root.y, root.r * 2]);

    function zoomTo(v) {
      const k = width / v[2];
      view = v;

      nodes.attr("transform", d =>
      `translate(${(d.x - v[0]) * k + width / 2}, ${(d.y - v[1]) * k + height / 2})`
    );
      circle.attr("r", d => d.r * k); 
    }

    function zoom(event, d) {
      focus = d;
      const transition = svg.transition()
        .duration(event.altKey ? 7500 : 750)
        .tween("zoom", () => {
          const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
          return t => zoomTo(i(t));
        });

      label
        .filter(function (d) {
          return d.parent === focus || this.style.display === "inline";
        })
        .transition(transition)
        .style("fill-opacity", d => d.parent === focus ? 1 : 0)
        .on("start", function (d) {
          if (d.parent === focus) this.style.display = "inline";
        })
        .on("end", function (d) {
          if (d.parent !== focus) this.style.display = "none";
        });
    }
  }, [userData]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
}

export default BubbleGraph;