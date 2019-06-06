
/* 
* animates vectors and vectorfields 
*
*/

// imports:
import * as d3 from 'd3';

import defaults from './defaults.js';
var dflt_svg_conf= defaults.dflt_svg_conf;
var dflt_h_grid_conf=defaults.dflt_h_grid_conf;
var dflt_v_grid_conf=defaults.dflt_v_grid_conf;

import util from './util';

var _digest_configs=  util._digest_configs;
var _configure_svg_container= util._configure_svg_container;
//var _configure_defs= util._configure_defs;
var _digest_data= util._digest_data;

import axis from './axis.js';
var _configure_axis = axis._configure_axis;
//var _calculate_domain=axis._calculate_domain;

import path from './path.js';
var _create_path_grid = path._create_path_grid,
    _animate_grid_creation = path._animate_grid_creation,
   // _line_path_creation_animation = path._line_path_creation_animation,
    _draw_vectors = path._draw_vectors,
    _vec_creation_animation = path._vec_creation_animation;


// initializing config with default configs, if no config is given  :  
var self={};
self.config = dflt_svg_conf;
self.horizontal_grids_config = dflt_h_grid_conf;
self.vertical_grids_cofnig = dflt_v_grid_conf;
self.methodQueue=[];
self.data;
self.axis_scale;
self.data_count= 0;
self.svgContainer;
self.added_data;



  /*
   * Default function to be exportet :
   * can be used with method chainging 
   */
  const plot = () => {
  
    //configure svg configs 
    var set_svg_configs = function (svg_conf) {
  
      _digest_configs(self.config, svg_conf);
      self.svgContainer = _configure_svg_container(self);
  
      return this;
    }
  
    // set data and colors
    var set_data = function (vec_data) {
  
      if (self.data) {
        throw new Error('to add data you should use add_data method!');
      }
      self.data = _digest_data(vec_data, self.svgContainer)
      return this;
  
    }
  
    /* 
     * add_data : can be used to add vectors to current svgContainer 
     *             if auto_scale_axis is false it dosen't change 
     *             axis scale so there is no need to redraw all
     *             the vectors again.
     * //TODO: you should add grids here too!
     */
    var add_data=(vec_data, anim = false, auto_scale_axis = false, pre_delay, post_delay, onEndObj=null) =>{
  
      // digest new data:
      var newData = _digest_data(vec_data, self.svgContainer);
      var vecs,
          colorIds,
          xScale,
          yScale;
  
      // if update axis new data will be added to data and draw everything again
      // else the new data will be added to added_data and draw without axis scaling
      /* 
       *   TODO: maybe use change draw function a little bit to be able to call it here!
       *         should I remove them here or somewhere esle?
       */
      if (auto_scale_axis) {
  
        // remove everything in svgContainer before redraw
        self.svgContainer.selectAll('.vector')
          .transition()
          .duration(1000)
          .ease(d3.easeLinear)
          .remove();
  
  
        // self.svgContainer.selectAll('arrow')
        let newVecs = newData.vecs;
        let newColorIds = newData.colorIds;
  
        for (let i = 0; i < newVecs.length; i++) {
          self.data.vecs.push(newVecs[i]);
          self.data.colorIds.push(newColorIds[i]);
        }
        vecs = self.data.vecs;
        colorIds = self.data.colorIds;
        self.axis_scale = _configure_axis( self.svgContainer, self.config, vecs);
        xScale = self.axis_scale.x;
        yScale = self.axis_scale.y;
  
      } else {
        self.data_count += 1;
        self.added_data = {};
  
        vecs = newData.vecs,
          colorIds = newData.colorIds,
          xScale = self.axis_scale.x,
          yScale = self.axis_scale.y;
  
        self.added_data[`d${self.data_count}`] = newData;
      }
  
      // use new data to draw vectors
      if (anim) {
        for (let i = 0; i < vecs.length; i++) {
          // check if its the last one to be done --> evoke next action 
          // by setting onEndObj
          if (i == vecs.length-1){
            _vec_creation_animation(vecs[i], xScale, yScale, self.svgContainer, colorIds[i],pre_delay, post_delay, onEndObj);
          }
          else{
            _vec_creation_animation(vecs[i], xScale, yScale, self.svgContainer, colorIds[i], pre_delay, 0);
          }
        }
        // if no animation is requried simply do it!
        // TODO: correct this by adding onEndObj here : what happens if you need to do something after _draw_vectors without animation?
      } else {
        for (let i = 0; i < vecs.length; i++) {
          _draw_vectors(vecs[i], xScale, yScale, self.svgContainer, colorIds[i]);
        }
      }
  
  
      return this
    }
  
  
  
    // draw vectors
    //TODO: give grid_configs (strokes, color, opacity etc) from user?
    var draw = (anim = false, grids = true, pre_delay=200, post_delay=1000, onEndObj=null)=> {
  
      // configure axis, makes things ready for draw 
      self.axis_scale = _configure_axis( self.svgContainer, self.config, self.data.vecs);
      let vecs = self.data.vecs;
      let colorIds = self.data.colorIds;
      let xScale = self.axis_scale.x;
      let yScale = self.axis_scale.y;
  
      if (grids) {
        _create_path_grid(self.svgContainer, xScale, yScale, self.config);
      }
      
      // if animation required:
      if (anim) {
        for (let i = 0; i < vecs.length; i++) {
  
          // check if it is the last thing to be done then 
          // give next step inside onEndObj
          if (i== vecs.length-1){
          _vec_creation_animation(vecs[i], xScale, yScale, self.svgContainer, colorIds[i], pre_delay, post_delay, onEndObj);
          }
          else{
            _vec_creation_animation(vecs[i], xScale, yScale, self.svgContainer, colorIds[i], pre_delay, 0);
          }
        }
  
      // if no animation required: 
      } else {
        for (let i = 0; i < vecs.length; i++) {
          _draw_vectors(vecs[i], xScale, yScale, self.svgContainer, colorIds[i]);
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
    var draw_grids = function (paramObj=null,onEndObj=null) {
  
      // grid_domain={x:100, y:100}, h_grids_conf = {}, v_grids_conf = {}, post_delay=1000, 
      // TODO: think about other way to manage your deflaut parameters
  
      var dflt_paramObj= {grid_domain:{x:100, y:100},
                          h_grids_conf:{},
                          v_grids_conf:{},
                          post_delay:4000}
                          
      _digest_configs(dflt_paramObj,paramObj)
  
      var grid_domain = dflt_paramObj.grid_domain
      var h_grids_conf=dflt_paramObj.h_grids_conf
      var v_grids_conf=dflt_paramObj.v_grids_conf
      var post_delay= dflt_paramObj.post_delay
      
      // digesting user config:
      _digest_configs(self.horizontal_grids_config, h_grids_conf);
      _digest_configs(self.vertical_grids_cofnig, v_grids_conf);
  
      let scales = _configure_axis(self.svgContainer, self.config, null, grid_domain);
  
  
      _animate_grid_creation(self.svgContainer, scales.x, scales.y, self.config, self.horizontal_grids_config, self.vertical_grids_cofnig, post_delay, onEndObj)
  
      return this
  
    }
  
    /*
    * use this function to add next animation to the plot
    * @param{method: a plot method
    *        param: parameter you want to call the method with
    *        }
    * 
    */
    var next= function(obj){
  
     self.methodQueue.push(obj)
  
     return this
    }
  
    /* 
     * use this function to run all the methods you added with obj in the order you put in !
     * 
     */
    var run = function () {
      // first function and parameter in the methodQueue
      var firstFunc = self.methodQueue[0].method;
      var firstParam = self.methodQueue[0].param;
  
  
      var end = self.methodQueue.length - 1;
      var queLength = self.methodQueue.length;
  
  
      // var onNextObj to be used as onEndobj for the next onEndFunc;
      var onNextObj;
  
      if (queLength > 2) {
  
        // onNextObj will be used in onEndFunc to evoke another function after it!(look at for
        // example anim1 to see where onNextObj will be used!)
  
        // the first onNextObj is the last function we have to run and because it is the last one
        // it has no onNextObj in it!
        onNextObj = {
          onEndFunc: self.methodQueue[end].method,
          param: self.methodQueue[end].param
        };
  
        // to chain functions after another we use onNextObj: 
        // each onNextObj have another onNextObj inside it! 
        // thats will be used in first function to evoke next function, because the next functin 
        // will be given onNextObj as input, it will evoke a chain of functions  after another! 
        for (let i = 0; i < queLength - 3; i++) {
          let nextObj = {
            onEndFunc: self.methodQueue[end - (i + 1)].method,
            param: self.methodQueue[end - (i + 1)].param, // ?self.methodQueue[end - (i + 1)].param : null ,
            onNextObj: onNextObj
          };
  
          // nextObj will be onNextObj for the next function:
          onNextObj = nextObj;
  
        }
      }
  
      // notice onNextObj now has all the onNextObjs for all function callings 
      var onEndObj = {
        onEndFunc: self.methodQueue[1].method,
        param: self.methodQueue[1].param,
        onNextObj: onNextObj
      }
      firstFunc(...firstParam, onEndObj)
  
  
      return this
  
    }
  
  
    // return methods for method chaining 
    return {
      config: self.config,
      set_svg_configs: set_svg_configs,
      set_data: set_data,
      add_data: add_data,
      draw: draw,
      draw_grids: draw_grids,
      next: next,
      run: run,
  
    };
  };
  
  export {
    plot as
    default
  };