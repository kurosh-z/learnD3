
/* 
* utility functions used in plot
*
*/


// imports:
import * as d3 from 'd3';

import defaults from './defaults';

var  dflt_vector_colorId = (defaults.dflt_vec_conf.stroke_color).split('#')[1]; 


// deep copy of an object
function _deepObjectCopy(obj) {
  var clone = {};
  for(var i in obj) {
      if(typeof(obj[i])=="object" && obj[i] != null)
          clone[i] = _deepObjectCopy(obj[i]);
      else
          clone[i] = obj[i];
  }
  return clone;
}

// digest new  configs: 
var _digest_configs = function (dflt_config, new_config) {
  
  // make a deep copy of dflt_config so that it dosent affect the default 
  var config = _deepObjectCopy(dflt_config);
  for (let key in new_config) {

    if (!(dflt_config.hasOwnProperty(key))) {
      throw new Error(`Invalid key: ${key} `)
    } else {
      Object.defineProperty(config, key, {
        value: new_config[key]
      });
    }
  }
  return config
}


var _digest_config_list = function(dflt_config, config_list){
  

  var new_config_list=[];
  if (!(config_list)) {return [dflt_config]}
  config_list.forEach((config)=>{
    new_config_list.push(_digest_configs(dflt_config, config))
  })
  return new_config_list;

}

// configuration method for svg_containers

var _configure_svg_container =function (svg_conf) {
 
    let svgContainerId = svg_conf.svgContainerId;
    let selected = d3.select(`#${svgContainerId}`);
    var svgContainer;
  
    // see if there is any container with the same id already exist
    // if not create one
    if (selected._groups[0][0] == null) {
  
      svgContainer = d3.select('body').append('svg')
        .attr('width', svg_conf.width)
        .attr('height', svg_conf.height)
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
      .attr('class', 'xGrids');
    svgContainer.append('g')
      .attr('class', 'yGrids');

    // create default def for arrow 
    _configure_defs(svgContainer, dflt_vector_colorId)
  
  
  
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


var _digest_vec_config_list= function(dflt_vec_conf, vec_config_list, svgContainer ){

  vec_config_list =_digest_config_list(dflt_vec_conf, vec_config_list )

  vec_config_list.
  forEach((config)=>{
    let colorId = (config.stroke_color).split('#')[1];
    _configure_defs(svgContainer, colorId)
  })

  return vec_config_list
}



  var util = {
    _digest_configs: _digest_configs,
    _configure_svg_container:_configure_svg_container,
    _configure_defs:_configure_defs,
    _digest_vec_config_list:_digest_vec_config_list,
    _deepObjectCopy: _deepObjectCopy,
  };

  export default util;