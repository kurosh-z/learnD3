// default svg config
const dflt_svg_conf = {
    svgContainerId: 'svgVecContainer',
    width: window.innerWidth,
    height: window.innerHeight,
    svg_margin: {
        x: 50,
        y: 50
    },
}



const dflt_h_grids_conf = {
    opacity: 0.5,
    stroke_color: '#bbbbbb',
    stroke_width: '1.5',
    duration: 1000,
    pre_delay: 100,
    post_delay:100,
    groupId: 'originalxGrids',
    domain: [-10, 10],
};



const dflt_v_grids_conf = {
    opacity: 0.5,
    stroke_color: '#808080',
    stroke_width: '1.5',
    duration: 1000,
    pre_delay: 100,
    post_delay:100,
    groupId: 'originalyGrids',
    domain: [-10, 10],
};


const dflt_vec_conf ={
    opacity: 1,
    stroke_color:'#1DA1F2',
    stroke_width : '1.8',
    duration :500,
    pre_delay: 100,
    post_delay:300
    
}


// export defaults object

const defaults = {
    dflt_svg_conf: dflt_svg_conf,
    dflt_h_grids_conf: dflt_h_grids_conf,
    dflt_v_grids_conf: dflt_v_grids_conf,
    dflt_vec_conf : dflt_vec_conf,
    className: 'dflt_vector'
};




export default defaults;

