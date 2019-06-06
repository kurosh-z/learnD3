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
  vecs.push(new Svec(-50*Math.random(), 80*Math.random()));
  vecs.push(new Svec(50*Math.random(), -100*Math.random()));
  vecs.push(new Svec(-50*Math.random(), -80*Math.random()));
  colors.push(color_pool(i));
  colors.push(color_pool(i*4));
  colors.push(color_pool(i*10));

}
let data={colors: colors, vecs: vecs};
var data3={vecs: [vec1, vec2, vec3], 
           colors:['#FF0000', '#FF0000', '#FF0000']}


var plt = plot();
plt
.set_svg_configs({
  svg_container_width: window.innerWidth,
  svg_container_height: window.innerHeight
});

plt
.set_data(data)
// .draw(true, true, 3000, 0)
.next({method: plt.draw, param:[true, true, 1000, 2000]})
.next({method: plt.draw_grids, param: null})
.next({method: plt.add_data, param:[data3, true, true, 2000, 3000]})
.run()






