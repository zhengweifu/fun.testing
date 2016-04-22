require('./scss/basic.scss');

import React from 'react';

import ReactDOM from 'react-dom';

import Viewport3DComponent from './js/components/Viewport3DComponent';

import THREE from 'three';

import MeshLoader from './js/commons/MeshLoader';

import MaterialManager from './js/commons/MaterialManager';

let materialManager = new MaterialManager('/fun.testing/textures/', '.jpg');

class APP extends React.Component {
    getMesh() {
        let parent = new THREE.Group();

        let meshLoader = new MeshLoader();
        meshLoader.parse('/fun.testing/belief_09.mesh', (geo) => {
            console.log(geo);
            parent.add(new THREE.Mesh(geo, materialManager.material));
        });

        return parent;
    }

    getMatrix() {
        var m4 = new THREE.Matrix4();
        console.log(m4);
        m4.elements[14] = 30;
        return m4;
    }

    render() {
        return (
            <div>
                <Viewport3DComponent width={500} height={600} inObject={this.getMesh()} inCameraMatrix={this.getMatrix()}/>
            </div>
        );
    }
}

ReactDOM.render(<APP />, document.getElementById('app'));

