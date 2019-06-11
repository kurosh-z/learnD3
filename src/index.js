import plot from './plot';
import * as d3 from 'd3';
import math from './math'
import './index.scss';








var color_pool = d3.scaleOrdinal(d3.schemeCategory10);
var vecs = [],
  colors = [];
for (let i = 0; i < 1; i++) {
  vecs.push(math.vector([-20 * Math.random(), 80 * Math.random()]));
  vecs.push(math.vector([50 * Math.random(), -100 * Math.random()]));
  vecs.push(math.vector([-50 * Math.random(), -80 * Math.random()]));
  colors.push('#000000');
  colors.push(color_pool(10 + i));
  colors.push(color_pool(Math.random() * 100));

}

var data = {
  'vecs1': vecs
};
var vec_config_list = [];
var i = 0;
vecs.forEach(() => {
  let vec_config = {
    'stroke_color': colors[i],
    'stroke_width': 1.6,
    'opacity': 1
  }
  vec_config_list.push(vec_config)
  i += 1;
})



var h_grids_conf={'opacity': .2, 'stroke_color':'#0000ff' };
var v_grids_conf={'opacity': .2, 'stroke_color':'#0000ff'};




var plt = plot();
//draw: vecId = null, axisRescale = false, axis = true, grids = true, vec_config_list = null, h_grids_conf = null, v_grids_conf = null) {

plt
  .set_svg_configs()
  .add_data(data)
  .draw('vecs1', false, true, true)
  .grid_porperties_transition(h_grids_conf, v_grids_conf)


var queue = plt.methodQueue;



(async function () {
      await Promise.all([queue.xAxis(), queue.yAxis()]);
      await Promise.all([queue.xGrids(), queue.yGrids()]);
      // await queue.xGrids();
      // await queue.yGrids();
      await queue.vecs_creation();

      await Promise.all([queue.vGrids_transition(), queue.hGrids_transition()]);


            })();

      //setTimeout(()=>{plt.grid_porperties_transition(h_grids_conf, v_grids_conf);}, 1000)


    