// testing animation chaining 
var plot = function () {
  var svg = d3.select('body').append('svg')
  .attr('width', window.innerWidth)
  .attr('height', window.innerHeight)
  var lineGenerator = d3.line()
  .x(function (d) {
    return d[0];
  })
  .y(function (d) {
    return d[1];
  });

  // have all the methods and parameters 
var methodQueue=[];


// run functions stored in methodQueue, wait for each to finished and run next
var run = function(){
  
  // first function and parameter in the methodQueue
  var firstFunc = methodQueue[0].method;
  var firstParam= methodQueue[0].param;


  var end = methodQueue.length-1;
  var queLength= methodQueue.length;

  
  // var onNextObjList;
  var onNextObj;

  if (queLength > 2){

  // onNextObjList=[{onEndFunc: methodQueue[end].method, param:methodQueue[end].param}];

  // onNextObj will be used in onEndFunc to evoke another function after it!(look at for
  // example anim1 to see where onNextObj will be used!)

  // the first onNextObj is the last function we have to run and because it is the last one
  // it has no onNextObj in it!
  onNextObj ={onEndFunc: methodQueue[end].method, param:methodQueue[end].param};
  
  // to chain functions after another we use onNextObj: 
  // each onNextObj have another onNextObj inside it! 
  // thats will be used in first function to evoke next function, because the next functin 
  // will be given onNextObj as input, it will envoke a chain of functions called after another! 
  for (let i=0; i< queLength-3; i++){
    let nextObj= {onEndFunc: methodQueue[end-(i+1)].method,
                  param: methodQueue[end-(i+1)].param,
                  onNextObj: onNextObj};
    
    // nextObj will be onNextObj for the next function:
    onNextObj = nextObj;

  }
  }

  // notice onNextObj has all the onNextObjs for all function callings 
  var onEndObj = {onEndFunc: methodQueue[1].method,
                  param: methodQueue[1].param,
                  onNextObj: onNextObj}
  firstFunc(...firstParam, onEndObj)                




  // firstFunc(firstParam, onEndObj)

  return this
  
}

// next: store methods and parameters in methodQueue to be used later 
var next= function(obj){
  methodQueue.push(obj)

  return this
}

var anim1 = function (x , onEndObj=null) {
  var onEndFunc = null
  if (onEndObj){
      onEndFunc=onEndObj.onEndFunc;
      var param = onEndObj.param;
      var onNextObj = onEndObj.onNextObj;
  }
  console.log('x', x)

  var data = [
      [x, 100],
      [800, 100]
  ]
  var data2 = [
      [100, 100],
      [200, 800]
  ]
  svg.append('path')
      .attr('d', lineGenerator(data))
      .attr('stroke', '#bbbbbb')
      .attr('stroke-width', '0px')
      .style('fill', 'none')
      .style('opacity', .5)
      .style('shape-rendering', 'crispEdges')
      .transition()
      .duration(500)
      .ease(d3.easeCircle)
      .attr('stroke-width', '2.5px')
      .attr('stroke', 'blue')
      .delay(500)
      .transition()
      .duration(1000)
      .attr('stroke-width', '6px')
      .attr('stroke', 'red')
      .transition()
      .duration(1000)
      .attr('d', lineGenerator(data2))
      .on('end', function () {
          if(onEndFunc){
              // onEndFunc.call(this,param);
              onEndFunc(param, onNextObj)
            
            }
          
      });

return this       

}


var anim2 = function (x,y, onEndObj=null){
  var onEndFunc = null
  if (onEndObj){
      onEndFunc=onEndObj.onEndFunc;
      var param = onEndObj.param;
      var onNextObj= onEndObj.onNextObj

  }
 
  
  console.log('anim2 y:', y)
  svg.append('rect')
  .transition()
  .delay(1000)
  .attr('x', x)
  .attr('y', y) 
  .attr('width', 100)
  .attr('height', 100)
  .attr('fill', 'red')
  .transition()
  .on('start', function () {
      d3.select(this).attr('fill', 'green' );
  })
  .delay(3000)
  .duration(1500)
  .attr('x', 240)
  .attr('y', 80) 
  .attr('width', 60)
  .attr("height", 60)
  .attr('fill', 'purple')
  .on('end', function () {
      if(onEndFunc){
          // onEndFunc.call(this,param);
        onEndFunc(...param, onNextObj);
        }
  });
  
  return this
}

return {anim1: anim1,
      anim2: anim2,
      next: next,
      run: run}
}





var plt =plot()

plt
.anim2(100, 200)
.anim2(300,400)
// .next({method:plt.anim2, param:[100, 200]})
// .next({method:plt.anim2, param:[200, 300]})
// .next({method:plt.anim2, param:300})
// .next({method:plt.anim1, param:400})
// .next({method:plt.anim1, param:500})
// .run()

