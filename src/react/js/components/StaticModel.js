import React from 'react';

import Viewport3DComponent from './Viewport3DComponent';

import THREE from 'three';

import MeshLoader from '../commons/MeshLoader';

import MaterialManager from '../commons/MaterialManager';

import Util from '../commons/Util';

class StaticModel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            width: props.width,
            height: props.height,
            cameraMatrix: new THREE.Matrix4().fromArray(props.cameraMatrix)
        };
        this.parent = new THREE.Group();

        this.materialManager = new MaterialManager(props.reflectionURLs);
    }

    getGeo(url) {
        return function(onLoad) {
            let meshLoader = new MeshLoader();
            meshLoader.parse(url, onLoad);
        };
    }

    render() {
        let self = this;
        let props = this.props;
        let getGeo = this.getGeo;
        Util.runGenerator(function *() {
            let geos = [];
            for(let i = 0, l = props.meshURLs.length; i < l; i ++) {
                let geo = yield getGeo(props.meshURLs[i]);
                geos.push(geo);
            }

            let box3 = new THREE.Box3();
            geos.forEach((g) => {
                g.computeBoundingBox();
                box3.union(g.boundingBox);
                self.parent.add(new THREE.Mesh(g, self.materialManager.material));
            });

            let width = box3.max.x - box3.min.x,
                height = box3.max.y - box3.min.y,
                depth = box3.max.z - box3.min.z;
            let fov = self.props.fov;
            let aspect = self.props.width / self.props.height;

            self.refs.viewport3d.updateCameraMatrix(
                new THREE.Matrix4().setPosition(
                    Util.autoCalculationCameraPositiion(fov, aspect, box3)
                )
            );
        });
        return (
            <div>
                <Viewport3DComponent 
                    width={this.state.width} 
                    height={this.state.height} 
                    inObject={this.parent} 
                    inCameraMatrix={this.state.cameraMatrix} 
                    fov={this.props.fov}
                    ref= 'viewport3d'
                />
            </div>
        );
    }
}

StaticModel.propTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    fov: React.PropTypes.number,
    meshURLs: React.PropTypes.array.isRequired,
    reflectionURLs: React.PropTypes.array.isRequired,
    cameraMatrix: React.PropTypes.array
};

StaticModel.defaultProps = {
    width: 300,
    height: 300,
    fov: 53,
    cameraMatrix: [1,0,0,0,0,1,0,0,0,0,1,0,0,0,40,1]
};

export default StaticModel;



