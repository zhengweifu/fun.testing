/**
 * three.js website Viewport3DComponent by fun.zheng
 */

import React from 'react';

import THREE from 'three';

import Configure from '../commons/Configure';

import LightManager from '../commons/LightManager';

export default class Viewport3DComponent extends React.Component {

    constructor(props) {
        super(props);

        this.scene = new THREE.Scene();
    
        this.camera = null;
    
        this.renderer = null;
    
        this.width = 0;
    
        this.height = 0;

        this.clock = new THREE.Clock();

        this.target = new THREE.Object3D();
    }

    _init() {
        this.width = parseInt(this.props.width);
        this.height = parseInt(this.props.height);


        this.center = new THREE.Object3D();

        this.scene.add(this.center);

        this.center.add(this.props.inObject);


        this.camera = new THREE.PerspectiveCamera(53,  this.width / this.height, 0.01, 1000);
        this.camera.applyMatrix(this.props.inCameraMatrix);

        this.renderer = new THREE.WebGLRenderer({canvas : this.refs.viewport3d, alpha: true, antialias: true, premultipliedAlpha: true, preserveDrawingBuffer: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.autoClear = false;


        // 相机控制
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.minDistance = Configure.CAMERAMINDISTANCE;
        this.controls.maxDistance = Configure.CAMERAMAXDISTANCE;
        this.controls.noPan = Configure.FORBIDDENMOVEMENT;

        // 加入灯光
        this.LightManager = new LightManager();

        this.LightManager.setTarget(this.target);

        this.scene.add(this.LightManager.keyLight);
        this.scene.add(this.LightManager.auxLight);
        this.scene.add(this.LightManager.ambientLight);
    }

    /**
     *渲染
     * @private
     */
    _render() {
        this.scene.updateMatrixWorld();
        this.camera.updateProjectionMatrix();

        this.renderer.clear();


        // 控制动画
        if(this.controls.getState() == -1) {
            if(this.clock.getElapsedTime() > Configure.SPINTIMEOUT) {
                if(!this.controls.autoRotate) {
                    this.controls.autoRotate = true;
                }
            }
        } else {
            if(this.controls.autoRotate) {
                this.controls.autoRotate = false;
            }
            this.clock.elapsedTime = 0;
            this.clock.stop();

        }

        this.controls.update(); // update controls


        this.LightManager.update(this.camera, this.controls.center);
        this.target.position.copy(this.controls.center);

        this.renderer.render(this.scene, this.camera);
    }

    /**
     * 渲染循环
     * @private
     */
    _renderLoop() {
        if(window.requestAnimationFrame) {
            window.requestAnimationFrame(this._renderLoop.bind(this));
            this._render();
        } else {
            setInterval(this._render, 1000 / 60);
        }
    }

    componentWillMount() {
    }

    componentDidMount() {
    	this._init();
    	this._renderLoop();
    }

	render() {
        return (
            <div style={{width: this.props.width + 'px', height: this.props.height + 'px'}}>
                <canvas width={this.props.width} height={this.props.height} ref="viewport3d"></canvas>
            </div>
        );
    }
}

