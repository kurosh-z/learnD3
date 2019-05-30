
import * as d3 from 'd3';

const arrowCreationAnim=() =>{
var colors = d3.scaleOrdinal(d3.schemeCategory10);

var width = 900,
    height = 900,
    margin = 10,
    vecData0 = [],
    vecData1 = [];


var svg = d3.select('body').append('svg')
.attr('width', width)
.attr('height', height)

    

// debugger;
for (let i = 0; i < 10; i++) {
    vecData0.push({
        x1: width / 2,
        y1: height / 2,
        x2: margin + Math.random() * (width - margin * 2),
        y2: margin + Math.random() * (height - margin * 2)
    })
    vecData1.push({
        x1: width / 2,
        y1: height / 2,
        x2: margin + Math.random() * (width - margin * 2),
        y2: margin + Math.random() * (height - margin * 2)
    });
}

var defs = svg.append("svg:defs");

function createVecs(vecData, color, colorID) {
    let pathLength


    // arrowheads:
    defs
        .append("svg:marker")
        .attr("id", `arrowhead${colorID}`)
        .attr("refX", 6)
        .attr("refY", 6)
        .attr("markerWidth", 30)
        .attr("markerHeight", 30)
        .attr("orient", "auto")
        .append("path")
        // .attr('class', `vec${colorID}`)
        // .attr('id', '#arrowPath')
        .attr("d", "M 0 0 12 6 0 12 3 6")
        .style('fill', `${colors(colorID)}`);

    //defining vectors:    
    svg.selectAll('.vecs')
        .data(vecData)
        .enter()
        .append("line")
        .attr("x1", function (d, i) {
            return d.x1
        })
        .attr("y1", function (d, i) {
            return d.y1
        })
        .attr("x2", function (d, i) {
            return d.x2
        })
        .attr("y2", function (d, i) {
            return d.y2
        })
        .attr('id', 'vector')
        .attr('class', `vec${colorID}`)
        .attr("stroke", `${color}`)
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', function () {
            return pathLength = this.getTotalLength();
        })
        .attr('stroke-dashoffset', pathLength)
        .transition()
        .ease(d3.easeLinear)
        .on('start', function Linecreation() {
            d3.active(this)
                .transition()
                .duration(100)
                .attrTween('stroke-dashoffset', tweenfunc)
                .delay(10)
                .attr('marker-end', '')
                .transition()
                .ease(d3.easeLinear)
                .on('start', function arrowCreateion() {
                    d3.active(this)
                        .transition()
                        .duration(1000)
                        .attrTween('marker-end', triangleTween)
                });


            function tweenfunc() {
                return d3.interpolateNumber(pathLength, 0)
            }


            function triangleTween() {
                let a = d3.interpolateNumber(0, 12);

                return function (t) {
                    let b = a(t);
                    let triangleData = `M 0 0 ${b} 6 0 ${b} 3 6`;
                    // console.log(`#arrowhead${colorID}`)
                    d3.select(`#arrowhead${colorID}`)
                        .attr('d', triangleData)
                    return `url(#arrowhead${colorID})`
                };
            }
        });
}


// createVecs([vecData0[1]],0)        
for (let i = 0; i < vecData0.length; i++) {
    let color = colors(i);
    createVecs([vecData0[i]], color, i)
}

// d3.select('#arrowhead0')
//     .style('fill', 'black')
}

export {arrowCreationAnim}