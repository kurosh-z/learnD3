// svg Vector class
import * as d3 from 'd3';

export default class SVector {

    // cosntructor method:         
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.value = [x, y];

    }

    //add method
    add(vec) {
        if (!(vec instanceof SVector)) {
            throw new TypeError("both vectors should be an instance of SVector!");
        } else {
            var x = this.x + vec.x;
            var y = this.y + vec.y;
        }
        
        return new SVector(x, y)
    }


    

}
