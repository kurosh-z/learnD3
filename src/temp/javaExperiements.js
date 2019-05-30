// import SVGVector from './svgVector';
// import defaults from 'underscore';
// import * as _ from 'underscore'
// import * as d3 from 'd3';
// import * as _ from 'lodash'

// var a= new SVGVector(1,5);
// var b= new SVGVector(2,3);
// var c = a.add(b)
// console.log(a.value);
// console.log(a.value)



// function myFun(a, b, ...manyMoreArgs) {
//     console.log(a);
//     console.log(b);
//     let d= manyMoreArgs.p;
//     console.log(d)
// }

// myFun(2,3, {p:5, c:6})

// let Box = function (opt) {
//         this.opt = {
//             width: 32,
//             height: 32,
//             x: 0,
//             y: 0
//         }

//         if (!(opt)) {
//             opt = {}
//         }
//     // handle defaults
//     _.defaults(this.opt, opt);
 
//     // merge in opt
//     // _.merge(this, opt);
//     console.log(this)
// };
 
// // // works as expected
// // let bx = new Box();
// // console.log(bx.width); // 32;
 
// let bx2 = new Box({width:64,x:37});
// console.log(bx2); // 64
// console.log(bx2.x); // 37
// console.log(bx2.y); // 0
// var svg = d3.select('body')
//     .append('svg')
//     .attr('width', 300)
//     .attr('height', 300)
//     .attr('id', 'svgVecContainer');

// let selected= d3.select('#svgVecContainer')
// console.log(selected)


// class Rectangle {
//     _height = 0;
//     _width = 10;
//     constructor(height, width) {    
//       this.height = _height;
//       this.width = _width;
//     }
//   }


// class MyClass{
//     constructor(config=null){

//         this.config = {x: 12 , y:15};
//         console.log('default cofig',this.config);
//         Object.assign(this.config, config);
//         console.log('new config', this.config);


//     }

// }

// let myObj= new MyClass({})
// console.log(myObj.config)