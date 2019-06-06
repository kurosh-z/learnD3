
/* 
* utility functions used in plot
*
*/


// imports:
import * as d3 from 'd3';



// digest new  configs: 
var _digest_configs = function (dflt_config, new_config) {

  for (let key in new_config) {

    if (!(dflt_config.hasOwnProperty(key))) {
      throw new Error(`Invalid key: ${key} `)
    } else {
      Object.defineProperty(dflt_config, key, {
        value: new_config[key]
      });
    }

  }
}

// configuration method for svg_containers

var _configure_svg_container =function (self) {

    let svgContainerId = self.config.svgContainerId;
    let selected = d3.select(`#${svgContainerId}`);
    var svgContainer;
  
    // see if there is any container with the same id already exist
    // if not create one
    if (selected._groups[0][0] == null) {
  
      svgContainer = d3.select('body').append('svg')
        .attr('width', self.config.svg_container_width)
        .attr('height', self.config.svg_container_height)
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


  /* 
  *  configuring defs :
  *  @param{d3.selection} svgContainer
  *  @param{string}  arrowId: currently we use hex color without # for this!
  *                           they can be produced automatically in digest_data
  *
  
  */
  var _configure_defs = function (svgContainer, arrowId) {

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
 * @param{obj} : data: a object consist of :
 *               data = {vecs:[ vec1, vec2, ...],
 *                       colors: [color1, color2, ...],}    
 * //TODO: change this to become vector datas seperatly from colors?
 * //TODO: also use defualt colors instead of hex numbers! 
 */
var _digest_data = function (data, svgContainer) {

    // set vecs and default colors
    var colors;
    var vecs;
  
    if (data.hasOwnProperty('vecs')) {
      vecs = data['vecs'];
    } else {
      throw new Error('data has no vecs!')
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

  var util = {
    _digest_configs: _digest_configs,
    _configure_svg_container:_configure_svg_container,
    _configure_defs:_configure_defs,
    _digest_data:_digest_data
  };

  export default util;