// imports:
import * as d3 from 'd3';

// configure axis: 
/* //TODO: add presets here for different types of transition 
*  // TODO: add axisId for multiple axis support?
  
*/




var _configure_axis_scales = function (svgContainer, svg_config, vecs = null, grid_domain = null) {

  let svg_width = svg_config.svg_container_width;
  let svg_height = svg_config.svg_container_height;
  let margin = svg_config.svg_margin;
  var domain = {}

  vecs ? domain = _calculate_domain(vecs) : domain = grid_domain;


  let xScale = d3.scaleLinear()
    .domain([-domain.x, domain.x])
    .range([0 + margin.x, svg_width - margin.x]);


  let yScale = d3.scaleLinear()
    .domain([domain.y, -domain.y])
    .range([0 + margin.y, svg_height - margin.y]);

  

  let axis_scale = {
    x: xScale,
    y: yScale
  };
  
  
  return axis_scale;
}

var _axisTransitions= function(svgContainer, xScale, yScale){
  // add x and y Axis
  const xAxis = svgContainer.select('.xAxis'),
    yAxis = svgContainer.select('.yAxis');

  // axis transitions      
  const xAxisTransition = () => {
    new Promise((resolve, reject) => {
        xAxis.attr("transform", "translate(" + 0 + "," + yScale(0) + ")")
          .transition()
          .duration(2000)
          .delay(200)
          .ease(d3.easeLinear)
          .call(d3.axisBottom(xScale))
          .on('end', resolve)
      }

    )
  }



  // Add the y Axis
  const yAxisTransition = () => {
    return new Promise((resolve, reject) => {
      yAxis.attr("transform", "translate(" + xScale(0) + "," + 0 + ")")
        .transition()
        .duration(2000)
        .delay(200)
        .ease(d3.easeLinear)
        .call(d3.axisLeft(yScale))
        .on('end', resolve);
    })

  }



  // make async functions for transitions to return
  var x_axis_creation_func= async function (){
        await xAxisTransition();
        await yAxisTransition();

  }
  
  var y_axis_createion_func = async function (){
    await yAxisTransition();
  }

  let axis_trans_funcs ={x: x_axis_creation_func, 
    y: y_axis_createion_func};


  return axis_trans_funcs


}


// calculate domain:
var _calculate_domain = function (vecs) {
  /*
   * calculates domain to be used by d3.scale 
   * //TODO: see if you can do better paddings
   *       add a method to update axis if the user 
   *       give manually ticks and domain etc
   */

  var xComponents = [];
  var yComponents = [];
  vecs.forEach((element) => {
    xComponents.push(element.x);
    yComponents.push(element.y);
  });
  let maxX = d3.max(xComponents);
  let minX = d3.min(xComponents);
  let domainX = d3.max([maxX, Math.abs(minX)]);
  domainX += domainX * .2;


  let maxY = d3.max(yComponents);
  let minY = d3.min(yComponents);
  let domainY = d3.max([maxY, Math.abs(minY)]);
  domainY += domainY * .2;
  // let domain = d3.max([d3.max(xComponents), d3.max(xComponents)]);

  let domain = {
    x: domainX,
    y: domainY
  };
  return domain

}


var axis = {
  _configure_axis_scales: _configure_axis_scales,
  _axisTransitions: _axisTransitions,
  _calculate_domain: _calculate_domain
}

export default axis;