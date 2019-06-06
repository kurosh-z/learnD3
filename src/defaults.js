// default svg config
const dflt_svg_conf = {
    svgContainerId: 'svgVecContainer',
    svg_container_width: 900,
    svg_container_height: 900,
    svg_margin: {
        x: 50,
        y: 50
    },
}


const dflt_h_grid_conf = {
    opacity: 0.5,
    stroke_color: '#bbbbbb',
    stroke_width: '1.5px',
    duration: 1000,
    delay: 10,
    className: 'originalxGrids'
};


const dflt_v_grid_conf = {
    opacity: 0.5,
    stroke_color: '#808080',
    stroke_width: '1.5px',
    duration: 1000,
    delay: 10,
    className: 'originalyGrids'
};


// export defaults object

var defaults = {
    dflt_svg_conf: dflt_svg_conf,
    dflt_h_grid_conf: dflt_h_grid_conf,
    dflt_v_grid_conf: dflt_v_grid_conf
};

export default defaults;

