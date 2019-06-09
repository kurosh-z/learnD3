
/* 
* animates vectors and vectorfields 
*
*/

// imports:
import * as d3 from 'd3';

import defaults from './defaults';
var dflt_svg_conf= defaults.dflt_svg_conf,
    dflt_h_grids_conf=defaults.dflt_h_grids_conf,
    dflt_v_grids_conf=defaults.dflt_v_grids_conf,
    dflt_vec_conf= defaults.dflt_vec_conf;

import util from './util';

var _digest_configs=  util._digest_configs,
    _configure_svg_container= util._configure_svg_container,
    _digest_vec_config_list =util._digest_vec_config_list,
    _deepObjectCopy = util._deepObjectCopy;


import axis from './axis.js';
var _configure_axis_scales = axis._configure_axis_scales,
    _axisTransitions = axis._axisTransitions;

//var _calculate_domain=axis._calculate_domain;

import path from './path.js';
import { async } from 'q';
var 
    _animate_grid_creation = path._animate_grid_creation,
    _vecs_creation_animation = path._vecs_creation_animation;


// initializing config with default configs, if no config is given  :  
var self={};

self.h_grids_conf = dflt_h_grids_conf;
self.v_grids_conf = dflt_v_grids_conf;
self.data={};
self.vec_config_list=[];
self.methodQueue={};
self.axis_scale;
self.svgContainer;




  /*
   * Default function to be exportet :
   * can be used with method chaining 
   */
  const plot = () => {
  
    //configure svg configs 
    var set_svg_configs = function (svg_conf=null) {
  
      self.svg_conf = _digest_configs(dflt_svg_conf, svg_conf);
      self.svgContainer = _configure_svg_container(self.svg_conf);
  
      return this;
    }
  
    // set data and colors
    var add_data = function (vec_data) {
  
      for (let key in vec_data){
     Object.defineProperty(self.data, key,{
       value: vec_data[key]
     })
    }
      
      return this;
  
    }
  
    // draw vectors
    //TODO: give grid_configs (strokes, color, opacity etc) from user?
    var draw = (vecId, axis= true, grids = true, vec_config_list=[])=> {
  
      // configure axis, makes things ready for draw 
      let vecs = self.data[vecId],
          svgContainer= self.svgContainer;

      self.axis_scale = _configure_axis_scales(svgContainer, self.svg_conf, vecs);
  

      var    
          xScale = self.axis_scale.x,
          yScale = self.axis_scale.y,
          h_grids_conf= self.h_grids_conf,
          v_grids_conf= self.v_grids_conf;
        
      if (vec_config_list){
        vec_config_list= _digest_vec_config_list(dflt_vec_conf, vec_config_list, svgContainer)
      }
      self.vec_config_list = vec_config_list;
      

      
      if (axis){
      // axixTrans is just a Promise we use all this promises to manage the sequence of drawing components at the end of the function
      let axis_async_funcs = _axisTransitions(svgContainer, xScale, yScale),
        xAxis_creation_func = axis_async_funcs.x,
        yAxis_creation_func = axis_async_funcs.y;

       // add this promises to methodQueue to be used by user
       Object.defineProperty(self.methodQueue, 'xAxis', {
        value: xAxis_creation_func
      });
      Object.defineProperty(self.methodQueue, 'yAxis', {
        value: yAxis_creation_func
      });
      }

      if (grids){     
      let grids_async_funcs = _animate_grid_creation(svgContainer, xScale, yScale, self.svg_conf, h_grids_conf, v_grids_conf );

      // var old_grids_remove_func = grids_async_funcs.old_grids_remove_func,
      let xGrid_creation_func= grids_async_funcs.xGrid_func,
          yGrid_creation_func = grids_async_funcs.yGrid_func;

      Object.defineProperty(self.methodQueue, 'xGrids', {
        value: xGrid_creation_func
      });
      Object.defineProperty(self.methodQueue, 'yGrids', {
        value: yGrid_creation_func
      });
    
      
        }
        
      var vecs_creation_func =_vecs_creation_animation(svgContainer, vecs , xScale, yScale, vecId , vec_config_list ); 
      
      Object.defineProperty(self.methodQueue, 'vecs_creation', {
        value: vecs_creation_func
      });
  
      
     
      

    return this;
  }

      
    
  
    /*
     * use draw_grids if you dont want to draw vectors
     * ( can be used to animate transformation without 
     *   showing vectors)
     * //TODO: Maybe you can add grid points too?!
     */
    var draw_grids = function (paramObj=null,onEndObj=null) {
  
      // grid_domain={x:100, y:100}, h_grids_conf = {}, v_grids_conf = {}, post_delay=1000, 
      // TODO: think about other way to manage your deflaut parameters
  
      var dflt_paramObj= {grid_domain:{x:100, y:100},
                          h_grids_conf:{},
                          v_grids_conf:{},
                          post_delay:4000}
                          
      _digest_configs(dflt_paramObj,paramObj)
  
      var grid_domain = dflt_paramObj.grid_domain
      var h_grids_conf = dflt_paramObj.h_grids_conf
      var v_grids_conf = dflt_paramObj.v_grids_conf
      var post_delay = dflt_paramObj.post_delay
      
      // digesting user config:
      _digest_configs(self.horizontal_grids_config, h_grids_conf);
      _digest_configs(self.vertical_grids_cofnig, v_grids_conf);
  
      let scales = _configure_axis_scales(self.svgContainer, self.svg_conf, null, grid_domain);
  
  
      _animate_grid_creation(self.svgContainer, scales.x, scales.y, self.svg_conf, self.horizontal_grids_config, self.vertical_grids_cofnig, post_delay, onEndObj)
  
      return this
  
    }
  
    
  
  
    // return methods for method chaining 
    return {
      svg_config: self.svg_conf,
      methodQueue: self.methodQueue,
      set_svg_configs: set_svg_configs,
      add_data: add_data,
      draw: draw,
      draw_grids: draw_grids,
  
    };
  };
  
  export {
    plot as
    default
  };