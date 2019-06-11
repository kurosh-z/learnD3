import * as mathjs from 'mathjs';




const math = mathjs.create(mathjs.all);

math.import({
  vector: function(arr) {

    if (arr.length < 2)
      throw new Error('vector should have at least two components!');
    else if (arr.length > 3)
      throw new Error('vector could not have more than 3 components!');
    else if (arr.length == 2)
      arr.push(0); // make the thirs components zero for 2d vectors
    let vec= mathjs.matrix(arr);
    vec.x = arr[0];
    vec.y = arr[1];
    vec.z = arr[2];
    
    return vec;
    },
})



    
export default math




