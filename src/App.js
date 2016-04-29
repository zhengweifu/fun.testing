// require('./scss/fun.scss');

// import React from 'react';

// import ReactDOM from 'react-dom';

// import THREE from 'three';

// import StaticModel from './js/components/StaticModel';

// ReactDOM.render(<StaticModel 
//     width={600} 
//     height={600} 
//     meshURLs={[
//     	'/fun.testing/xingkong.mesh'
// 	]}
//     cameraMatrix={[1,0,0,0,0,1,0,0,0,0,1,0,0,0,50,1]}
//     reflectionURLs={[
//         '/fun.testing/textures/cubemaps/common/05/px.jpg',
//         '/fun.testing/textures/cubemaps/common/05/nx.jpg',
//         '/fun.testing/textures/cubemaps/common/05/py.jpg',
//         '/fun.testing/textures/cubemaps/common/05/ny.jpg',
//         '/fun.testing/textures/cubemaps/common/05/pz.jpg',
//         '/fun.testing/textures/cubemaps/common/05/nz.jpg'
//     ]} 
//     />, 
//     document.getElementById('app')
// );

import {fabric} from 'fabric';

import THREE from 'three';

let canvas = new fabric.Canvas('c');

let l = 100, t = 100, w = 100, h = 100, r = 20;

let rect1 = new fabric.Rect({
    left: l,
    top: t,
    width: w,
    height: h,
    fill: 'red',
    originX: 'center',
    originY: 'center'
});

let c = new fabric.Circle({
    radius: r, 
    fill: 'green', 
    left: l, 
    top: t + h / 2,
    originX: 'center',
    originY: 'center'
});

let g = new fabric.Group([rect1, c], {
    angle: -30,
    originX: 'center',
    originY: 'center'
});

canvas.add(g);

let gMatrix = new THREE.Matrix4();


document.getElementById('button-test').onclick = function() {

    let radian = g.getAngle() * Math.PI / 180;
    let c = Math.cos(radian), s = Math.sin(radian);
    console.log(g.getLeft() - g.item(1).getTop() * s, g.getTop() + g.item(1).getTop() * c);
};

