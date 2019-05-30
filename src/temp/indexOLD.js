import * as d3 from 'd3';
import { vecCreationAnim} from './arrow.js';

const toPath = require('element-to-path');


var width = 900,
    height = 900,
    margin = 10,
    vecData1 = [],
    vecData2 = [];



var svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)


// debugger;
for (let i = 0; i < 1; i++) {
    vecData1.push({
        x1: width / 2,
        y1: height / 2,
        x2: margin + Math.random() * (width - margin * 2),
        y2: margin + Math.random() * (height - margin * 2)
    })
}
for (let i = 0; i < 1; i++) {
    vecData2.push({
        x1: width / 2,
        y1: height / 2,
        x2: margin + Math.random() * (width - margin * 2),
        y2: margin + Math.random() * (height - margin * 2)
    })
}

vecCreationAnim(svg, vecData1);


// svg.selectAll('mylines')
//     .data(vecData2)
//     .enter()
//     .append('line')
//     .attr('x1', (d)=>{return d.x1;})
//     .attr('x2', (d)=>{return d.x2;})
//     .attr('y1', (d)=>{return d.y1;})
//     .attr('y2', (d)=>{return d.y2;})
//     .attr('stroke-width', 1.5)
//     .attr('stroke', 'black');

// let myLine = svg.append('line')
//     .attr('x1', vecData2[0].x1)
//     .attr('x2', vecData2[0].x2)
//     .attr('y1', vecData2[0].y1)
//     .attr('y2', vecData2[0].y2)
//     .attr('stroke-width', 1.5)
//     .attr('stroke', 'black')
//     .transition()
//     .ease(d3.easeLinear)
//     .on('start', function transformation(){
//         d3.active(this)
//         .transition()
//         .duration(1000)
//         .attrTween('x2', x2Tweenfunc)
//         .attrTween('y2', y2Tweenfunc)
//     });



// function x2Tweenfunc(){
//     return d3.interpolateNumber(vecData2[0].x2, vecData1[0].x2);

// };

// function y2Tweenfunc(){
//     return d3.interpolateNumber(vecData2[0].y2, vecData1[0].y2);

// }


let myLine = svg.append('line')
    .attr('x1', vecData2[0].x1)
    .attr('x2', vecData2[0].x2)
    .attr('y1', vecData2[0].y1)
    .attr('y2', vecData2[0].y2)
    .attr('stroke-width', 1.5)
    .attr('stroke', 'black')
    .transition()
    .duration(500)
    .ease(d3.easeLinear)
    .on('start', function transformation(){
        d3.active(this)
        .attr('x2', vecData2[0].x2)
        .attr('y2', vecData2[0].y2)
        .transition()
        .attr('x2', vecData1[0].x2)
        .attr('y2', vecData1[0].y2)
        
    });


