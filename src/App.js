require('./scss/fun.scss');

import React from 'react';

import ReactDOM from 'react-dom';

import THREE from 'three';

import StaticModel from './js/components/StaticModel';

ReactDOM.render(<StaticModel 
    width={600} 
    height={600} 
    meshURLs={[
    	'/fun.testing/belief_09.mesh',
    	'/fun.testing/xingkong.mesh'
	]}
    cameraMatrix={[1,0,0,0,0,1,0,0,0,0,1,0,0,0,50,1]}
    reflectionURLs={[
        '/fun.testing/textures/cubemaps/common/05/px.jpg',
        '/fun.testing/textures/cubemaps/common/05/nx.jpg',
        '/fun.testing/textures/cubemaps/common/05/py.jpg',
        '/fun.testing/textures/cubemaps/common/05/ny.jpg',
        '/fun.testing/textures/cubemaps/common/05/pz.jpg',
        '/fun.testing/textures/cubemaps/common/05/nz.jpg'
    ]} 
    />, 
    document.getElementById('app')
);

//
// import Grid from './js/components/Grid';
// import Col from './js/components/Col';


// ReactDOM.render(
//     <Grid className="grid">
//         <Col sm={3} md={4}>
//         	<button>aaaa</button>
//         </Col>

//         <Col sm={3} md={4}>
// 			<button>aaaa</button>
//         </Col>

//         <Col sm={3} md={4}>
//         	<button>aaaa</button>
//         </Col>
//     </Grid>, 
//     document.getElementById('app'));