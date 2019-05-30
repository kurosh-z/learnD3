
import * as d3 from 'd3';

const vecCreationAnim=(svg, vecData) =>{
var colors = d3.scaleOrdinal(d3.schemeCategory10);



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
                    d3.select(`#arrowhead${colorID}`)
                        .attr('d', triangleData)
                    return `url(#arrowhead${colorID})`
                };
            }
        });
}


// createVecs([vecData0[1]],0)        
for (let i = 0; i < vecData.length; i++) {
    let color = colors(i);
    createVecs([vecData[i]], color, i)
}

// d3.select('#arrowhead0')
//     .style('fill', 'black')
}

export {vecCreationAnim}