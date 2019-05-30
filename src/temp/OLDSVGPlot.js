// svg Vector class
import * as d3 from 'd3';

export default class SVGPlot {
    constructor(vecs, config=null){

        //TODO: see lynda.com for responsive images and change the size of svg here
        this.vecs= vecs;
        this.config = {
            svgContainerId: 'svgVecContainer',
            svg_container_width: 900,
            svg_container_height: 900,
            svg_margin : {x: 50, y:50},
            arrowID: '000000',
        }
        /*
        TODO: read this: 
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
        and check if the keys are valid
        */
        Object.assign(this.config, config);
        
        this._configure_svg_container();
        this._configure_defs();
        this._configure_axis();

    }

    // utility methods:

    _configure_axis(){

        let svg_width= this.config.svg_container_width ;
        let svg_height= this.config.svg_container_height;
        let margin = this.config.svg_margin;

        // this.ORIGIN = {x: xOrigin, y: yOrigin};
        let domain = this._calculate_domain()
        
        this.xScale = d3.scaleLinear()
            .domain([-domain.x, domain.x])
            .range([0 + margin.x, svg_width - margin.x]);
           

        this.yScale = d3.scaleLinear()
            .domain([domain.y, -domain.y])
            .range([0 + margin.y, svg_height - margin.y]);
 

        this.svgContainer.append("g")
            .attr("transform", "translate(" + 0 + "," + this.yScale(0) + ")")
            .call(d3.axisBottom(this.xScale));

        // Add the y Axis
        this.svgContainer.append("g")
            .attr("transform", "translate(" + this.xScale(0) + "," + 0 + ")")
            .call(d3.axisLeft(this.yScale));

        }

    _calculate_domain(){
        /*
        * calculates domain to be used by d3.scale 
        * TODO: see if you can do better paddings
        */
        let vecs= this.vecs;
        var xComponents = [];
        var yComponents = [];
        vecs.forEach((element) => {  
            xComponents.push(element.x);
            yComponents.push(element.y);
        });
        let maxX = d3.max(xComponents);
        let minX = d3.min(xComponents);
        let domainX = d3.max([maxX, Math.abs(minX)]);
        domainX+= domainX * .2;


        let maxY = d3.max(yComponents);
        let minY = d3.min(yComponents);
        let domainY = d3.max([maxY, Math.abs(minY)]);
        domainY+= domainY * .2;
        // let domain = d3.max([d3.max(xComponents), d3.max(xComponents)]);
        
        let domain = {x: domainX,
                       y: domainY};  
        return domain               

    }

    _configure_svg_container() {

        let svgContainerId = this.config.svgContainerId;

        let selected = d3.select(`#${svgContainerId}`);
        if (selected._groups[0][0] == null) {
            this.svgContainer = d3.select('body').append('svg')
                                       .attr('width', this.config.svg_container_width)
                                       .attr('height', this.config.svg_container_height)
                                       .attr('id',`${svgContainerId}` );
        } 
        else {
            this.svgContainer = selected;
            console.log(selected.node())
        }
    }

    _configure_defs() {

        this.defs = this.svgContainer.append("svg:defs");
        this.defs
            .append("svg:marker")
            .attr('id', `arrowhead${this.config.arrowID}`)
            .attr("viewBox","0 0 12 12")
            .attr("refX", 11.5)
            .attr("refY", 6)
            .attr("markerWidth", 10)
            .attr("markerHeight", 10)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M 0 0 12 6 0 12 3 6");
    }

    // draw method
    draw(color = 'black') {

        this.defs.node().style.fill = color;
        var xScale = this.xScale;
        var yScale = this.yScale;
        
        this.svgContainer.selectAll('#vector')
            .data(this.vecs)
            .enter()
            .append("line")
            .attr('x1', xScale(0))
            .attr('y1', yScale(0))
            .attr('x2', (d) => {
                return xScale(d.x);
             
            })
            .attr('y2', (d) => {
                return yScale(d.y);
      
            })
            .attr('class', 'arrowShaft')
            .attr("stroke", `${color}`)
            .attr('stroke-width', 2)
            .attr('marker-end', `url(#arrowhead${this.config.arrowID})`);

    }    
    
}