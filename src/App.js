require('./scss/basic.scss');

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
//     <Grid>
//         <Col sm={3} md={4}>

//         </Col>

//         <Col>

//         </Col>

//         <Col>

//         </Col>
//     </Grid>, 
//     document.getElementById('app'));

// import Util from './js/commons/Util';



// // Thunk
// let get = function (url) {

//   // return a function, passing in our callback
//   return function (callback) {
//     let xhr = new XMLHttpRequest();
//     xhr.open('GET', url);
//     xhr.onreadystatechange = function() {
//       let response = xhr.responseText;
//       if(xhr.readyState != 4) {
//       	return;
//       }
//       if (xhr.status === 200) {
//         callback(null, response);
//       } else {
//         callback(response, null);
//       }
//     };
//     xhr.send();
//   };
// };

// import MeshLoader from './js/commons/MeshLoader';

// let get2 = function (url) {
//     return function(onLoad) {
//     	let meshLoader = new MeshLoader();
//     	meshLoader.parse(url, onLoad);
//     };
// };

// let li = ['/fun.testing/belief_09.mesh', '/fun.testing/xingkong.mesh'];

// Util.runGenerator(function *() {
// 	let ress = [];
// 	for(let i = 0; i < li.length; i ++) {
// 		let res = yield get2(li[i]);
// 		ress.push(res);
// 	};

// 	// let res = yield get('/fun.testing/index.html');

// 	console.log(ress);

// });

// new Promise();