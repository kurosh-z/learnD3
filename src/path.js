
import * as d3 from 'd3'


// update function with path instead of line ( it can be usefull if you want to transform path to another!)
// TODO: add animation creation 
var _create_path_grid= function(svgContainer, xScale, yScale, config) {

    _remove_path_grid()
    var width = config.svg_container_width,
      height = config.svg_container_height,
      margin = config.svg_margin,
      xData = yScale.ticks(10),
      yData = xScale.ticks(10);
  
  
  
    // create line generator 
    var lineGenerator = d3.line()
      .x(function (d) {
        return d[0];
      })
      .y(function (d) {
        return d[1];
      });
  
  
    // create horizontal grids                 
    var originalxGrids = svgContainer.select('.xGrids')
      .append('g');
    // createa a path data for eatch line and draw it        
    var xPathData = [];
    for (let i = 0; i < xData.length; i++) {
      xPathData = [
        [margin.x, yScale(xData[i])],
        [width - margin.x, yScale(xData[i])]
      ];
  
      originalxGrids
        .append('path')
        .attr('class', 'originalxGrids')
        .attr('d', lineGenerator(xPathData))
        .attr('stroke', '#bbbbbb')
        .attr('stroke-width', '0px')
        .style('fill', 'none')
        .style('opacity', .5)
        .style('shape-rendering', 'crispEdges')
        .transition()
        .duration(500)
        .ease(d3.easeCircle)
        .attr('stroke-width', '1.5px');
    }
  
    // vertical grids
    var originalyGrids = svgContainer.select('.yGrids')
      .append('g');
  
    // createa a path data for eatch line and draw it        
    var yPathData = [];
    for (let i = 0; i < yData.length; i++) {
      yPathData = [
        [xScale(yData[i]), margin.y],
        [xScale(yData[i]), height - margin.y]
      ];
  
      originalyGrids
        .append('path')
        .attr('class', 'originalyGrids')
        .attr('d', lineGenerator(yPathData))
        .attr('stroke', '#808080')
        .attr('stroke-width', '0px')
        .style('fill', 'none')
        .style('opacity', .5)
        .style('shape-rendering', 'crispEdges')
        .transition()
        .duration(500)
        .ease(d3.easeCircle)
        .attr('stroke-width', '1.5px');
    }
  }
  
  var _animate_grid_creation = function(svgContainer, xScale, yScale, config, h_grids_conf, v_grids_conf, post_delay=0, onEndObj=null ) {
  
    // remove existing grids
    // TODO: do you need animation for removing?
    _remove_path_grid()
    
  
    // creatte new ones :
    var width = config.svg_container_width,
      height = config.svg_container_height,
      margin = config.svg_margin,
      xData = yScale.ticks(10),
      yData = xScale.ticks(10);
  
  
  
    // create horizontal grids                 
    let xGrids = svgContainer.select('.xGrids')
      .append('g');
  
    for (let i = 0; i < xData.length; i++) {
  
      // set new data
      let xdata = [
        [margin.x, yScale(xData[i])],
        [width - margin.x, yScale(xData[i])]
      ];
      // animate line
      _line_path_creation_animation(xGrids, xdata, h_grids_conf);
  
    }
  
    //vertical grids
    // TODO: change orignalxGrids to xGrids and yGrids the class will be changed automatically!
    var yGrids = svgContainer.select('.yGrids')
      .append('g');
  
    for (let i = 0; i < yData.length; i++) {
      // set new data:
      let ydata = [
        [xScale(yData[i]), margin.y],
        [xScale(yData[i]), height - margin.y]
      ];
      if (i==yData.length-1){
      _line_path_creation_animation(yGrids, ydata, v_grids_conf, post_delay, onEndObj);
      }else{
        _line_path_creation_animation(yGrids, ydata, v_grids_conf);
      }
    }
  
  
  } //_animate_grid_creation
  
  
  
  
  // a method to remove the grids
  var _remove_path_grid = function () {
  
    d3.select('.xGrids')
      .selectAll('path.originalxGrids')
      .remove();
  
    d3.select('.yGrids')
      .selectAll('path.originalyGrids')
      .remove();
  
  }
  

  
  /*
   * @param{obj}: {lineHolder,
   *               data  ,
   *               opacity ,
   *               stroke_color,
   *               stroke_width,
   *               duration,
   *               delay,
   *               className }
   * className--> is important for the time if you want to change attributes of this grids or 
   *              remove them without changing other girids!
   * 
   */
  var _line_path_creation_animation = function (lineHolder, data, grids_conf,post_delay=0, onEndObj=null) {
  
    if (onEndObj){
      var onEndFunc=onEndObj.onEndFunc,
          param = onEndObj.param,
          onNextObj = onEndObj.onNextObj;
    }
  
    var opacity = grids_conf.opacity,
      stroke_color = grids_conf.stroke_color,
      stroke_width = grids_conf.stroke_width,
      duration = grids_conf.duration,
      delay = grids_conf.delay,
      className = grids_conf.className;
  
    lineHolder.append('path')
      .attr('class', className)
      .attr('d', lineGenerator(data))
      .attr('stroke', stroke_color)
      .attr('stroke-width', stroke_width)
      .style('fill', 'none')
      .style('opacity', opacity)
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
      .delay(delay)
      .duration(duration)
      .attrTween('stroke-dashoffset', line_tweenfunc)
      .ease(d3.easeLinear)
      .transition()
      .delay(post_delay)
      .on('end', () =>{
        if(onEndObj){
          onEndFunc(...param, onNextObj)
        }
  
      });
   
    function line_tweenfunc() {
      let pathLength = this.getTotalLength();
      return d3.interpolateNumber(pathLength, 0)
    }
  }
  
  
  // create line generator 
  var lineGenerator = d3.line()
    .x(function (d) {
      return d[0];
    })
    .y(function (d) {
      return d[1];
    });
  

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
  
  var _vec_creation_animation = function (vec, xScale, yScale, svgContainer, colorId,pre_delay=100, post_delay=500, onEndObj=null) {
  
    if (onEndObj){
      var onEndFunc=onEndObj.onEndFunc,
          param = onEndObj.param,
          onNextObj = onEndObj.onNextObj;
    }
  
    svgContainer
      .append('line')
      .attr('x1', xScale(0))
      .attr('y1', yScale(0))
      .attr('x2', xScale(vec.x))
      .attr('y2', yScale(vec.y))
      .attr('class', 'vector')
      .attr("stroke", `#${colorId}`)
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', function () {
        let pathLength = this.getTotalLength()
        return pathLength;
      })
      .attr('stroke-dashoffset', function () {
        let pathLength = this.getTotalLength()
        return pathLength;
      })
      .transition()
      .duration(500)
      .delay(pre_delay)
      .ease(d3.easeLinear)
      .attrTween('stroke-dashoffset', line_tweenfunc)
      .transition()
      .duration(500)
      .attrTween('marker-end', arrow_tweenfunc)
      .transition()
      .delay(post_delay)
      .on('end', function (){    
              if(onEndObj){
                param ? onEndFunc(...param, onNextObj):onEndFunc(null, onNextObj);
              }
            })
  
  
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
  
  }

var path={
    _create_path_grid: _create_path_grid,
    _animate_grid_creation: _animate_grid_creation,
    _line_path_creation_animation: _line_path_creation_animation,
    _draw_vectors: _draw_vectors,
    _vec_creation_animation: _vec_creation_animation
  };

export default path;