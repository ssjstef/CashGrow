import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { createBubbles } from "./Data";

// Creates the Bubble Graph to be used in Graph, data provided by Graph element
function BubbleGraph({ userData }) {
  const svgRef = useRef();  // This is used as a reference to the svg DOM element
  const width = 400;
  const height = 400;

  //The colour gets darker the further into the graph you go
  const color = d3.scaleLinear() 
    .domain([0, 5]) //Maximum depth range
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"]) 
    .interpolate(d3.interpolateHcl); // returns a colour space in the range of the above given values

  //Creates a pack layout
  const pack = data => d3.pack()
    .size([width, height])
    .padding(3)(

      //The items are arranged in the same hierarcy as how the data is passed through
      //This means entries inside an element will be rendered within the bounds of its circle
      d3.hierarchy(data)
        .sum(d => +d.value) //Ensures that only the values are control the size of the bubble
        .sort((a, b) => b.value - a.value)
    );

  useEffect(() => {
    const svg = d3.select(svgRef.current).attr("viewBox", [0, 0, width, height]); //sets up svg to the desired size 


    const data = createBubbles(userData); // should return a nested structure: { name, children: [{name, value}] }
    console.log(data);
    const root = pack(data); 
    let focus = root; //The root node is the one to be focused on
    let view;

    // Creates a group element for each bubble
    const nodes = svg.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .style("background", "f8f8f8")
      .data(root.descendants()) 
      .join("g")
        .attr("transform", d => `translate(${d.x},${d.y})`); //Think this needs to be changed, the radius is starting from the wronf place

    //Draws the circles corresponding to the nodes 
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

    //Drows the lables on the bubbles
    const label = nodes.append("text")
      .style("text-anchor", "middle")
      .style("font", "10px sans-serif")
      .style("pointer-events", "none")
      .style("fill-opacity", d => d.parent === root ? 1 : 0)
      .style("display", d => d.parent === root ? "inline" : "none")
      .text(d => d.data.name);

    //Zooms out when the background is clicked
    svg.on("click", event => zoom(event, root));

    // Zooms back to root
    zoomTo([root.x, root.y, root.r * 2]);

  // Zooms and moves the displat box when a click is made
    function zoomTo(v) {
      const k = width / v[2];
      view = v;

      nodes.attr("transform", d =>
      `translate(${(d.x - v[0]) * k + width / 2}, ${(d.y - v[1]) * k + height / 2})`
    );
      circle.attr("r", d => d.r * k); 
    }

    //Creates a smooth transition for the zoom
    function zoom(event, d) {
      focus = d;
      const transition = svg.transition()
        .duration(event.altKey ? 7500 : 750)
        .tween("zoom", () => {
          const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
          return t => zoomTo(i(t));
        });

      //Add or removes label depending on the state of the zoom
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
  }, [userData]); //Code runs everytime userData is updated

  return <svg ref={svgRef} width={width} height={height}></svg>; //returned as svg component
}

export default BubbleGraph;