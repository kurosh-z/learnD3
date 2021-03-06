import * as d3 from 'd3'
import defaults from './defaults';
var dflt_vec_conf = defaults.dflt_vec_conf;

import {
  dirname
} from 'path';



var _animate_grid_creation = function (svgContainer, xScale, yScale, svg_config, h_grids_conf, v_grids_conf) {

  // remove existing grids
  // TODO: do you need animation for removing?

  // remove old grids
  var old_grids_remove_func = _remove_path_grid();


  // creatte new ones :
  var width = svg_config.width,
    height = svg_config.height,
    margin = svg_config.svg_margin,
    hGroupId= h_grids_conf.groupId,
    vGroupId= v_grids_conf.groupId,
    xData = yScale.ticks(10),
    yData = xScale.ticks(10);



  // create horizontal grids    
  var xGrid_promise_list = [];

  let xGridGroup = svgContainer.select('.xGrids')
    .append('g').attr('id', hGroupId);

  for (let i = 0; i < xData.length; i++) {

    // set new data
    let xdata = [
      [margin.x, yScale(xData[i])],
      [width - margin.x, yScale(xData[i])]
    ];
    // animate line

    xGrid_promise_list.push(_line_path_creation_animation(xGridGroup, xdata, h_grids_conf));

  }

  //vertical grids
  var yGrid_promise_list = [];
  var yGridGroup = svgContainer.select('.yGrids')
    .append('g').attr('id', vGroupId);

  for (let i = 0; i < yData.length; i++) {
    // set new data:
    let ydata = [
      [xScale(yData[i]), margin.y],
      [xScale(yData[i]), height - margin.y]
    ];

    yGrid_promise_list.push(_line_path_creation_animation(yGridGroup, ydata, v_grids_conf));



  }


  // async run functions

  var all_Xpromises = [],
    all_Ypromises = [];


  async function run_xGrids() {
    xGrid_promise_list.forEach((item) => {
      all_Xpromises.push(item())
    })

    await Promise.all(all_Xpromises)
  }

  async function run_yGrids() {
    yGrid_promise_list.forEach((item) => {
      all_Ypromises.push(item())
    })
    await Promise.all(all_Ypromises)
  }



  let animate_grids_funcs = {
    old_grids_remove_func: old_grids_remove_func,
    xGrid_func: run_xGrids,
    yGrid_func: run_yGrids,
  };

  return animate_grids_funcs
} //_animate_grid_creation




// a method to remove the grids
var _remove_path_grid = function (xGidsCl, yGridsCl) {

  xGidsCl = xGidsCl || '.originalxGrids';
  yGridsCl = yGridsCl || '.originalyGrids'


  var xGrids = d3.select('.xGrids')
    .selectAll(xGidsCl);


  var yGrids = d3.select('.yGrids')
    .selectAll(yGridsCl);


  var remove_grids_promise = () => {
    return new Promise((resolve, reject) => {

      xGrids.transition()
        .duration(100)
        .remove();

      yGrids.transition()
        .duration(100)
        .remove()
        .on('end', resolve)
    })
  }

  // async run function 
  var run_remove_grids = async function () {
    await remove_grids_promise()
  }

  return run_remove_grids

}



// a method to change properties of the existing grids:
// TODO: changing multiple properties with selectAll couse noticable delay! maybe do it in for loop!
var _change_grid_properties = function (svgContainer, h_grids_conf, v_grids_conf) {

    var xGridsId = h_grids_conf.groupId,
      yGridsId = v_grids_conf.groupId;

    var xGrids = svgContainer.select('.xGrids')
      .select('g#' + xGridsId)
      .selectAll('path');


    var yGrids = svgContainer.select('.yGrids')
        .select('g#' + yGridsId)
        .selectAll('path');


    var change_hGrids = () => {
      return new Promise((resolve, reject) => {
        let opacity = h_grids_conf.opacity,
          stroke_color = h_grids_conf.stroke_color,
          stroke_width = h_grids_conf.stroke_width,
          duration = h_grids_conf.duration,
          pre_delay = h_grids_conf.pre_delay,
          post_delay = h_grids_conf.post_delay;

        xGrids.transition()
          .duration(duration)
          .delay(pre_delay)
          .ease(d3.easeLinear)
          .attr('stroke', stroke_color)
          .attr('stroke-width', stroke_width)
          .style('opacity', opacity)
          .transition()
          .duration(100)
          .delay(post_delay)
          .on('end', resolve);

      });
    }

    var change_vGrids = () => {
      return new Promise((resolve, reject) => {
        let opacity = v_grids_conf.opacity,
          stroke_color = v_grids_conf.stroke_color,
          stroke_width = v_grids_conf.stroke_width,
          duration = v_grids_conf.duration,
          pre_delay = v_grids_conf.pre_delay,
          post_delay = v_grids_conf.post_delay;

      
        yGrids.transition()
          .duration(duration)
          .delay(pre_delay)
          .ease(d3.easeLinear)
          .attr('stroke', stroke_color)
          .attr('stroke-width', stroke_width)
          .style('opacity', opacity)
          .transition()
          .duration(100)
          .delay(post_delay)
          .on('end', resolve);

      });
    }
    
    let change_grids= {h:change_hGrids, 
                       v: change_vGrids}

return change_grids

}






/*
 * @param{obj}: {lineGroup,
 *               data  ,
 *               opacity ,
 *               stroke_color,
 *               stroke_width,
 *               duration,
 *               delay,
 *               className }
 * className--> is important for the time if you want to change attributes of this grids or 
 *              remove them without changing other girids!
 * // TODO: merge all these line making promises togheter in just one promise!
 */
var _line_path_creation_animation = function (lineGroup, data, grids_conf) {


  var opacity = grids_conf.opacity,
    stroke_color = grids_conf.stroke_color,
    stroke_width = grids_conf.stroke_width,
    duration = grids_conf.duration,
    pre_delay = grids_conf.pre_delay,
    post_delay= grids_conf.post_delay;

  // create line generator 
  var lineGenerator = d3.line()
    .x(function (d) {
      return d[0];
    })
    .y(function (d) {
      return d[1];
    });


  var linePath = lineGroup.append('path')
    .attr('stroke', stroke_color)
    .attr('stroke-width', stroke_width)
    .style('fill', 'none')
    .style('opacity', opacity);



  var line_path_creation_promis = () => {
    return new Promise((resolve, reject) => {
      linePath
        .attr('d', lineGenerator(data))
        .style('shape-rendering', 'crispEdges')
        .attr('stroke-dasharray', function () {
          let pathLength = this.getTotalLength()
          return pathLength;
        })
        .attr('stroke-dashoffset', function () {
          let pathLength = this.getTotalLength()
          return pathLength;
        })
        .transition()
        .delay(pre_delay)
        .duration(duration)
        .attrTween('stroke-dashoffset', line_tweenfunc)
        .ease(d3.easeLinear)
        .transition()
        .delay(post_delay)
        .on('end', resolve);

      function line_tweenfunc() {
        let pathLength = this.getTotalLength();
        return d3.interpolateNumber(pathLength, 0)
      }

    })
  }

  return line_path_creation_promis
}






// draw vectors:
var _draw_vectors = function (vec, xScale, yScale, svgContainer, colorId) {
  // animate drawing 

  // draw without animating 
  svgContainer
    .append('line')
    .attr('x1', xScale(0))
    .attr('y1', yScale(0))
    .attr('x2', xScale(vec.x))
    .attr('y2', yScale(vec.y))
    .attr('stroke-width', 1.5)
    .attr('class', 'vector')
    .attr("stroke", `#${colorId}`)
    .attr('marker-end', `url(#arrowhead${colorId})`);

}

var _vecs_creation_animation = function (svgContainer, vecs, xScale, yScale, vecGroupName, vec_conf_list) {

  svgContainer.append('g').attr('class', vecGroupName);
  var vecGroup = svgContainer.select('.' + vecGroupName)

  var vec_draw_promises = [];
  var vec_conf;
  var i = 0;

  // create a async function for all vectors to be drawn simultaneously
  async function vec_draw_promises_func() {

    vecs.forEach((item) => {

      vec_conf = vec_conf_list[i] || dflt_vec_conf;
      i += 1;



      vec_draw_promises.push((_single_vec_creation_animation(item, xScale, yScale, vecGroup, vec_conf))())
    })

    await Promise.all(vec_draw_promises)
  }


  return vec_draw_promises_func


}

var _single_vec_creation_animation = function (vec, xScale, yScale, vecGroup, vec_conf) {

  var stroke_color = vec_conf.stroke_color,
    colorId = stroke_color.split('#')[1],
    stroke_width = vec_conf.stroke_width,
    opacity = vec_conf.opacity,
    duration = vec_conf.duration,
    post_delay = vec_conf.post_delay,
    pre_delay = vec_conf.pre_delay,
    className = vec_conf.className;


  var data = [
    [xScale(0), yScale(0)],
    [xScale(vec.x), yScale(vec.y)]
  ];

  // create line generator 
  var lineGenerator = d3.line()
    .x(function (d) {
      return d[0];
    })
    .y(function (d) {
      return d[1];
    })
    .curve(d3.curveLinear);


  var vecPath = vecGroup.append('path')
    .attr('class', className)
    .attr('stroke', stroke_color)
    .attr('stroke-width', stroke_width)
    .style('fill', 'none')
    .style('opacity', opacity);




  var vec_creation_promis = () => {
    return new Promise((resolve, reject) => {
      vecPath
        .attr('d', lineGenerator(data))
        .style('shape-rendering', 'crispEdges')
        .attr('stroke-dasharray', function () {
          let pathLength = this.getTotalLength()
          return pathLength;
        })
        .attr('stroke-dashoffset', function () {
          let pathLength = this.getTotalLength()
          return pathLength;
        })
        .transition()
        .duration(duration)
        .delay(pre_delay)
        .ease(d3.easeLinear)
        .attrTween('stroke-dashoffset', line_tweenfunc)
        .transition()
        .duration(duration)
        .attrTween('marker-end', arrow_tweenfunc)
        .transition()
        .delay(post_delay)
        .on('end', resolve);

    })

  };

  // tween functions for animation:
  function line_tweenfunc() {
    let pathLength = this.getTotalLength();
    return d3.interpolateNumber(pathLength, 0)
  }

  function arrow_tweenfunc() {
    let a = d3.interpolateNumber(0, 12);

    return function (t) {
      let b = a(t);
      let triangleData = `M 0 0 ${b} 6 0 ${b} 3 6`;
      d3.select(`#arrowhead${colorId}`)
        .attr('d', triangleData)
      return `url(#arrowhead${colorId})`
    };
  }

  return vec_creation_promis;

}




var path = {
  _animate_grid_creation: _animate_grid_creation,
  _line_path_creation_animation: _line_path_creation_animation,
  _draw_vectors: _draw_vectors,
  _vecs_creation_animation: _vecs_creation_animation,
  _single_vec_creation_animation: _single_vec_creation_animation,
  _change_grid_properties:_change_grid_properties,
};

export default path;