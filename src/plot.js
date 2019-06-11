/* 
 * animates vectors and vectorfields 
 *
 */

// imports:
import * as d3 from 'd3';

import defaults from './defaults';
var dflt_svg_conf = defaults.dflt_svg_conf,
  dflt_h_grids_conf = defaults.dflt_h_grids_conf,
  dflt_v_grids_conf = defaults.dflt_v_grids_conf,
  dflt_vec_conf = defaults.dflt_vec_conf;

import util from './util';

var _digest_configs = util._digest_configs,
  _configure_svg_container = util._configure_svg_container,
  _digest_vec_config_list = util._digest_vec_config_list,
  _deepObjectCopy = util._deepObjectCopy;


import axis from './axis.js';
var _configure_axis_scales = axis._configure_axis_scales,
  _axisTransitions = axis._axisTransitions;

//var _calculate_domain=axis._calculate_domain;

import path from './path.js';
import {
  async
} from 'q';
var
  _animate_grid_creation = path._animate_grid_creation,
  _vecs_creation_animation = path._vecs_creation_animation,
  _change_grid_properties = path._change_grid_properties;


// initializing config with default configs, if no config is given  :  
var self = {};

self.data = {};
self.vec_config_list = [];
self.methodQueue = {};
self.axis_scale;
self.svgContainer;




/*
 * Default function to be exportet :
 * can be used with method chaining 
 */
const plot = () => {

  //configure svg configs 
  var set_svg_configs = function (svg_conf = null) {

    self.svg_conf = _digest_configs(dflt_svg_conf, svg_conf);
    self.svgContainer = _configure_svg_container(self.svg_conf);

    return this;
  }

  // set data and colors
  var add_data = function (vec_data) {

    for (let key in vec_data) {
      Object.defineProperty(self.data, key, {
        value: vec_data[key]
      })
    }

    return this;

  }

  // draw / redraw vectors axis or grids
  var draw = function (vecId = null, axisRescale = false, axis = true, grids = true, vec_config_list = null, h_grids_conf = null, v_grids_conf = null) {

    var svgContainer = self.svgContainer,
      svg_conf = self.svg_conf,
      xScale,
      yScale;


    self.h_grids_conf = _digest_configs(dflt_h_grids_conf, h_grids_conf);
    self.v_grids_conf = _digest_configs(dflt_v_grids_conf, v_grids_conf);


    if (vecId) {
      // configure axis, makes things ready for draw 
      var vecs = self.data[vecId];
      
      vec_config_list = _digest_vec_config_list(dflt_vec_conf, vec_config_list, svgContainer)
      self.vec_config_list = vec_config_list;

      if (axisRescale || !(self.axis_scale)) {
        self.axis_scale = _configure_axis_scales(svg_conf, vecs);

      }
      xScale = self.axis_scale.x;
      yScale = self.axis_scale.y;

      var vecs_creation_func = _vecs_creation_animation(svgContainer, vecs, xScale, yScale, vecId, vec_config_list);

      Object.defineProperty(self.methodQueue, 'vecs_creation', {
        value: vecs_creation_func
      });

    } else if (!(vecId)) {
      if (!(vecId) && (grids)) {
        let grids_domain = {
          x: [self.h_grids_conf.domain[0], self.h_grids_conf.domain[1]],
          y: [self.v_grids_conf.domain[0], self.h_grids_conf.domain[1]]
        }
        self.axis_scale = _configure_axis_scales(svgContainer, svg_conf, null, grids_domain)
        xScale = self.axis_scale.x;
        yScale = self.axis_scale.y;
      }
    }









    if (axis) {
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

    if (grids) {
      let grids_async_funcs = _animate_grid_creation(svgContainer, xScale, yScale, self.svg_conf, self.h_grids_conf, self.v_grids_conf);

      // var old_grids_remove_func = grids_async_funcs.old_grids_remove_func,
      let xGrid_creation_func = grids_async_funcs.xGrid_func,
        yGrid_creation_func = grids_async_funcs.yGrid_func;

      Object.defineProperty(self.methodQueue, 'xGrids', {
        value: xGrid_creation_func
      });
      Object.defineProperty(self.methodQueue, 'yGrids', {
        value: yGrid_creation_func
      });


    }


    return this;
  }

  var grid_porperties_transition = function (h_grids_conf, v_grids_conf) {

    h_grids_conf= _digest_configs(dflt_h_grids_conf, h_grids_conf);
    v_grids_conf= _digest_configs(dflt_v_grids_conf, v_grids_conf);

    var grids_transition_promises = _change_grid_properties(self.svgContainer, h_grids_conf, v_grids_conf)

    Object.defineProperty(self.methodQueue, 'hGrids_transition', {
      value: grids_transition_promises.h
    });

    Object.defineProperty(self.methodQueue, 'vGrids_transition', {
      value: grids_transition_promises.v
    });
    
    return this
  }



  // return methods for method chaining 
  return {
    svg_config: self.svg_conf,
    methodQueue: self.methodQueue,
    set_svg_configs: set_svg_configs,
    add_data: add_data,
    draw: draw,
    grid_porperties_transition: grid_porperties_transition,

  };
};

export {
  plot as
  default
};