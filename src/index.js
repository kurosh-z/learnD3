import Svec from './svgVector'
import plot from './plot';
import * as d3 from 'd3';
import './index.scss' 
//import Promise from 'es6-promise'



let vec1 = new Svec(-16, -20);
let vec2 = new Svec(80, -10);
let vec3 = new Svec(-60, 90);

var color_pool = d3.scaleOrdinal(d3.schemeCategory10);
var vecs =[],
    colors=[];
for(let i=0; i<1; i++){
  vecs.push(new Svec(-20*Math.random(), 80*Math.random()));
  vecs.push(new Svec(50*Math.random(), -100*Math.random()));
  vecs.push(new Svec(-50*Math.random(), -80*Math.random()));
  colors.push('#000000');
  colors.push(color_pool(10+i));
  colors.push(color_pool(Math.random()*100));
  
}

var data = {'vecs1': vecs};
var vec_config_list =[];
var i=0;
vecs.forEach(()=>{
  let vec_config = {'stroke_color': colors[i],
                    'stroke_width': 1.6,
                    'opacity':1}
  vec_config_list.push(vec_config)
  i+=1;
})

vecs.push(new Svec(60*Math.random(), 60*Math.random()))




var plt = plot();

plt
.set_svg_configs()
.add_data(data)
.draw('vecs1', true, true, vec_config_list)

var queue= plt.methodQueue;


 (async function () {
        await Promise.all([queue.xAxis(), queue.yAxis()]);
        await Promise.all([queue.xGrids(), queue.yGrids()]);
        // await queue.xGrids();
        // await queue.yGrids();
        await queue.vecs_creation();

      })();




