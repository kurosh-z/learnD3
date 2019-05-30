import * as d3 from 'd3';

/*
 *  varaibale and functions needed instide the plot function
 *  TODO: 
 */

// default svg config
const dflt_svg_conf = {
  svgContainerId: 'svgVecContainer',
  svg_container_width: 900,
  svg_container_height: 900,
  svg_margin: {
    x: 50,
    y: 50
  },
}


const dflt_h_grid_conf = {
  opacity: 0.5,
  stroke_color: '#bbbbbb',
  stroke_width: '1.5px',
  duration: 1000,
  delay: 10,
  className: 'originalxGrids'
};


const dflt_v_grid_conf = {
  opacity: 0.5,
  stroke_color: '#808080',
  stroke_width: '1.5px',
  duration: 1000,
  delay: 10, 
  className: 'originalyGrids'
};



// initializing config with default configs, if no config is given  :  
var config = dflt_svg_conf;
var horizontal_grids_config = dflt_h_grid_conf;
var vertical_grids_cofnig = dflt_v_grid_conf;

// digest new  configs: 
// TODO: what happens if user want to set a unvalid config?
function _digest_configs(old_config, new_conf) {

  for (let key in new_conf) {
    Object.defineProperty(old_config, key, {
      value: new_conf[key]
    });
  }
}

function _configure_svg_container() {

  let svgContainerId = config.svgContainerId;
  let selected = d3.select(`#${svgContainerId}`);
  var svgContainer;

  // see if there is any container with the same id already exist
  // if not create one
  if (selected._groups[0][0] == null) {

    svgContainer = d3.select('body').append('svg')
      .attr('width', config.svg_container_width)
      .attr('height', config.svg_container_height)
      .attr('id', `${svgContainerId}`);



  } else {
    svgContainer = selected;

  }


  // create a blue print for axis so that it can be configured later using select!
  svgContainer.append("g")
    .attr("class", "xAxis");
  svgContainer.append('g')
    .attr('class', 'yAxis');
  svgContainer.append('g')
    .attr('class', 'xGrids')
    .append('line');
  svgContainer.append('g')
    .attr('class', 'yGrids')
    .append('line');



  return svgContainer;
}


function _configure_defs(svgContainer, arrowId) {

  if (d3.select(`#arrowhead${arrowId}`)._groups[0][0] == null) {

    var defs = svgContainer.append('svg:defs');
    defs
      .append('svg:marker')
      .attr('id', `arrowhead${arrowId}`)
      .attr('viewBox', '0 0 12 12')
      .attr('refX', 11.5)
      .attr('refY', 6)
      .attr('markerWidth', 10)
      .attr('markerHeight', 10)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0 0 12 6 0 12 3 6')
      .style('fill', `#${arrowId}`);
  }

  return defs
}

/* 
 * @param{data} : a object consist of :
 *               data = {vecs:[ vec1, vec2, ...],
 *                       colors: [color1, color2, ...],}    
 */
function _digest_data(data, svgContainer) {

  // set vecs and default colors
  var colors;
  var vecs;

  if (data.hasOwnProperty('vecs')) {
    vecs = data['vecs'];
  } else {
    throw new Error('data has no vecsXD!')
  }
  if (data.hasOwnProperty('colors')) {
    colors = data['colors']
  } else {
    colors = []
    for (let i = 0; i < vecs.length; i++) {
      colors.push('#1DA1F2')
    }
  }


  var dif;
  dif = vecs.length - colors.length;
  if (dif > 0) {
    for (let i = 0; i < dif; i++) {
      colors.push('#1DA1F2')
    }
  }

  // configure colorIds for defs
  var colorIds = [];
  colors.forEach(color => {
    let colorId = color.split('#')[1];
    colorIds.push(colorId);
    _configure_defs(svgContainer, colorId)
  });

  return {
    vecs: vecs,
    colors: colors,
    colorIds: colorIds
  };
}


// configure axis: 
//TODO: see if you can do better!
// if vecs given it gonna calculate domain based on vecs otherwise 
// it use grid_domain as domain 
var _configure_axis = function (svgContainer, svg_config, vecs=null , grid_domain =null) {

  let svg_width = svg_config.svg_container_width;
  let svg_height = svg_config.svg_container_height;
  let margin = svg_config.svg_margin;
  var domain={}

  vecs ?  domain = _calculate_domain(vecs) : domain = grid_domain;

 
  let xScale = d3.scaleLinear()
    .domain([-domain.x, domain.x])
    .range([0 + margin.x, svg_width - margin.x]);


  let yScale = d3.scaleLinear()
    .domain([domain.y, -domain.y])
    .range([0 + margin.y, svg_height - margin.y]);

  // add x Axis
  svgContainer.select('.xAxis')
    .attr("transform", "translate(" + 0 + "," + yScale(0) + ")")
    .transition()
    .duration(500)
    .ease(d3.easeLinear)
    .call(d3.axisBottom(xScale))

  // Add the y Axis
  svgContainer.select('.yAxis')
    .attr("transform", "translate(" + xScale(0) + "," + 0 + ")")
    .transition()
    .duration(500)
    .ease(d3.easeLinear)
    .call(d3.axisLeft(yScale));

  let axis_scale = {
    x: xScale,
    y: yScale
  };


  // _createGrid(svgContainer, xScale, yScale, svg_config);
  // _update_grid(svgContainer, xScale, yScale, config)
  // _animate_grid_creation(svgContainer, xScale, yScale, config)

  return axis_scale;
}



// // create horizontal grid 
// function _update_grid(svgContainer, xScale, yScale, config) {


//   var width = config.svg_container_width,
//       height = config.svg_container_height,
//       margin = config.svg_margin,
//       xData = yScale.ticks(10),
//       yData = xScale.ticks(10);

//   // remove previous Grids 
//   // TODO: see if you can find a better way ( why it cant be done like axis updates!)
//   svgContainer.select('.xGrids')
//       .selectAll('line')
//       .transition()
//       .duration(200)
//       .ease(d3.easeLinear)
//       .remove()

//     svgContainer.select('.yGrids')
//       .selectAll('line')
//       .transition()
//       .duration(200)
//       .ease(d3.easeLinear)
//       .remove()    

//   // create new grids    
//   for (let i= 0 ; i < xData.length; i++){
//   svgContainer.select('.xGrids')
//     .append('line')
//     .attr('x1', margin.x)
//     .attr('y1',  yScale(xData[i]))
//     .attr('x2', width - margin.x)
//     .attr('y2', yScale(xData[i]))
//     .attr('stroke', '#bbbbbb')
//     .style('opacity', .5)
//     .attr('stroke-width', '0px')
//     .transition()
//     .duration(500)
//     .ease(d3.easeCircle)
//     .attr('stroke-width', '1.5px')
//     .style('fill', 'none')
//     .style('shape-rendering', 'crispEdges');
//   }


//   for (let i= 0 ; i < yData.length; i++){
//     svgContainer.select('.yGrids')
//       .append('line')
//       .attr('x1', xScale(yData[i]))
//       .attr('y1',  margin.y)
//       .attr('x2', xScale(yData[i]))
//       .attr('y2', height-margin.y)
//       .attr('stroke', '#808080')
//       .attr('stroke-width', '0px')
//       .style('opacity', .5)   
//       .transition()
//       .duration(500)
//       .ease(d3.easeCircle)
//       .attr('stroke-width', '1.5px')
//       .style('fill', 'none')
//       .style('shape-rendering', 'crispEdges');
//     }


// }

// update function with path instead of line ( it can be usefull if you want to transform path to another!)
// TODO: add animation creation 
function _create_path_grid(svgContainer, xScale, yScale, config) {

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

function _animate_grid_creation(svgContainer, xScale, yScale, config, h_grids_conf, v_grids_conf) {

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
  let originalxGrids = svgContainer.select('.xGrids')
    .append('g');

  for (let i = 0; i < xData.length; i++) {

    // set new data
    let xdata = [
      [margin.x, yScale(xData[i])],
      [width - margin.x, yScale(xData[i])]
    ];
    // animate line
    _line_path_creation_animation(originalxGrids, xdata, h_grids_conf);

  }

  //vertical grids
  var originalyGrids = svgContainer.select('.yGrids')
    .append('g');

  for (let i = 0; i < yData.length; i++) {
    // set new data:
    let ydata = [
      [xScale(yData[i]), margin.y],
      [xScale(yData[i]), height - margin.y]
    ];
    _line_path_creation_animation(originalyGrids, ydata, v_grids_conf);
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

/* !!!: 
 * Utility functions to be used in another functions 
 * //TODO: consider moving thease functions to util.js !
 *
 */

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
var _line_path_creation_animation = function (lineHolder, data, grids_conf) {


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
    .ease(d3.easeLinear)
    .on('start', function Linecreation() {
      d3.active(this)
        .transition()
        .duration(duration)
        .attrTween('stroke-dashoffset', line_tweenfunc)
        .delay(delay)
    });

  // tween functions for animation:
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



// method to animate the transformation of original grids to new grids 
// var _transform_path_grid = function(){

// }




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
    .attr('class', 'vector')
    .attr("stroke", `#${colorId}`)
    .attr('marker-end', `url(#arrowhead${colorId})`);

}

var _vec_creation_animation = function (vec, xScale, yScale, svgContainer, colorId) {

  svgContainer
    .append('line')
    .attr('x1', xScale(0))
    .attr('y1', yScale(0))
    .attr('x2', xScale(vec.x))
    .attr('y2', yScale(vec.y))
    .attr('class', 'vector')
    .attr("stroke", `#${colorId}`)
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', function () {
      let pathLength = this.getTotalLength()
      return pathLength;
    })
    .attr('stroke-dashoffset', function () {
      let pathLength = this.getTotalLength()
      return pathLength;
    })
    .transition()
    .ease(d3.easeLinear)
    .on('start', function Linecreation() {
      d3.active(this)
        .transition()
        .duration(100)
        .attrTween('stroke-dashoffset', line_tweenfunc)
        .delay(10)
        .attr('marker-end', '')
        .transition()
        .ease(d3.easeLinear)
        .on('start', function arrowCreateion() {
          d3.active(this)
            .transition()
            .duration(1000)
            .attrTween('marker-end', arrow_tweenfunc)
        });
    });

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

/*
 * Default function to be exportet :
 *       can be used with method chainging 
 *       list of methods :
 *       
 * 
 */
const svec_plot = () => {

  //configure svg configs 
  var set_svg_configs = function (svg_conf) {

    _digest_configs(config, svg_conf);
    this.svgContainer = _configure_svg_container();

    return this;
  }

  // set data and colors
  var set_data = function (vec_data) {

    if (this.data) {
      throw new Error('to add data you should use add_data method!');
    }

    this.data_count = 0;
    this.data = _digest_data(vec_data, this.svgContainer)
    return this;

  }

  /* 
   * add_data : can be used to add vectors to current svgContainer 
   *            it dosen't change axis scale so there is no need 
   *            to redraw all vectors again.
   * //TODO: you should add grids here too!
   */
  var add_data = function (vec_data, anim = false, auto_scale_axis = false) {

    // digest new data:
    var newData = _digest_data(vec_data, this.svgContainer);
    var vecs,
      colorIds,
      xScale,
      yScale;

    // if update axis new data will be added to data and draw everything again
    // else the new data will be added to this.added_data and draw without axis scaling
    /* 
     *   TODO: maybe use change draw function a little bit to be able to call it here!
     *         should I remve hier or somewhere esle?
     */
    if (auto_scale_axis) {

      // remove everything in svgContainer before redraw
      this.svgContainer.selectAll('.vector')
        .transition()
        .duration(500)
        .ease(d3.easeExp)
        .remove();


      this.svgContainer.selectAll('arrow')
      let newVecs = newData.vecs;
      let newColorIds = newData.colorIds;

      for (let i = 0; i < newVecs.length; i++) {
        this.data.vecs.push(newVecs[i]);
        this.data.colorIds.push(newColorIds[i]);
      }
      vecs = this.data.vecs;
      colorIds = this.data.colorIds;
      this.axis_scale = _configure_axis( this.svgContainer, this.config, vecs);
      xScale = this.axis_scale.x;
      yScale = this.axis_scale.y;

    } else {
      this.data_count += 1;
      this.added_data = {};

      vecs = newData.vecs,
        colorIds = newData.colorIds,
        xScale = this.axis_scale.x,
        yScale = this.axis_scale.y;

      this.added_data[`d${this.data_count}`] = newData;
    }

    // use new data to draw vectors
    if (anim) {
      for (let i = 0; i < vecs.length; i++) {
        _vec_creation_animation(vecs[i], xScale, yScale, this.svgContainer, colorIds[i]);
      }
    } else {
      for (let i = 0; i < vecs.length; i++) {
        _draw_vectors(vecs[i], xScale, yScale, this.svgContainer, colorIds[i]);
      }
    }


    return this
  }



  // draw vectors
  //TODO: give grid_configs (strokes, color, opacity etc) from user?
  var draw = function (anim = false, grids = true) {

    // configure axis, makes things ready for draw 
    this.axis_scale = _configure_axis( this.svgContainer, this.config, this.data.vecs);
    let vecs = this.data.vecs;
    let colorIds = this.data.colorIds;
    let xScale = this.axis_scale.x;
    let yScale = this.axis_scale.y;
    let svgContainer = this.svgContainer;

    if (grids) {
      _create_path_grid(svgContainer, xScale, yScale, config);
    }

    if (anim) {
      for (let i = 0; i < vecs.length; i++) {
        _vec_creation_animation(vecs[i], xScale, yScale, this.svgContainer, colorIds[i]);
      }
    } else {
      for (let i = 0; i < vecs.length; i++) {
        _draw_vectors(vecs[i], xScale, yScale, this.svgContainer, colorIds[i]);
      }
    }
    return this
  }

  /*
   * use draw_grids if you dont want to draw vectors
   * ( can be used to animate transformation without 
   *   showing vectors)
   * //TODO: Maybe you can add grid points too?!
   */
  var draw_grids = function (grid_domain={x:100, y:100}, h_grids_conf = {}, v_grids_conf = {}) {

    

    // digestign user config:
    _digest_configs(horizontal_grids_config, h_grids_conf);
    _digest_configs(vertical_grids_cofnig, v_grids_conf);
   let svgContainer = this.svgContainer ; 

   let scales = _configure_axis(svgContainer, config, null, grid_domain );
  

    _animate_grid_creation(svgContainer, scales.x, scales.y, config, horizontal_grids_config, vertical_grids_cofnig)

  return this
  }



  // return methods for method chaining 
  return {
    config: config,
    set_svg_configs: set_svg_configs,
    set_data: set_data,
    add_data: add_data,
    draw: draw,
    draw_grids: draw_grids,

  };
};

export {
  svec_plot as
  default
};
