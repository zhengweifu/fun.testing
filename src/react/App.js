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

fabric.Image.fromURL('/textures/004.jpg', (image) => {

    image.set({ left: 0, top: 0, angle: 0 }).scale(0.2);
    canvas.add(image);

    // canvas.add(image).renderAll();
    // canvas.setActiveObject(image);
});



let gMatrix = new THREE.Matrix4();


document.getElementById('button-test').onclick = function() {
    let currentObject = canvas.getActiveObject();
    console.log(currentObject);
    currentObject.filters.push(new fabric.Image.filters.Sepia());
    currentObject.applyFilters(canvas.renderAll.bind(canvas));
    
};

