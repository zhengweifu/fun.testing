import React from 'react';

import Viewport3DComponent from './Viewport3DComponent';

import THREE from 'three';

import MeshLoader from '../commons/MeshLoader';

import MaterialManager from '../commons/MaterialManager';



class StaticModel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            width: props.width,
            height: props.height
        };
        this.parent = new THREE.Group();

        this.materialManager = new MaterialManager(props.reflectionURLs);
    }

    updateMesh() {
        let meshLoader = new MeshLoader();
        meshLoader.parse(this.props.meshURL, (geo) => {
            this.parent.add(new THREE.Mesh(geo, this.materialManager.material));
        });
    }

    getMatrix() {
        var m4 = new THREE.Matrix4();
        if(this.props.cameraMatrix) {
            m4.fromArray(this.props.cameraMatrix);
        } else {
            m4.elements[14] = 30;
        }
        
        return m4;
    }

    render() {
        this.updateMesh();
        return (
            <div>
                <Viewport3DComponent width={this.state.width} height={this.state.height} inObject={this.parent} inCameraMatrix={this.getMatrix()}/>
            </div>
        );
    }
}

StaticModel.propTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    meshURL: React.PropTypes.string,
    reflectionURLs: React.PropTypes.array,
    cameraMatrix: React.PropTypes.array
};

StaticModel.defaultProps = {
    width: 300,
    height: 300,
    cameraMatrix: [1,0,0,0,0,1,0,0,0,0,1,0,0,0,40,1]
};

export default StaticModel;



