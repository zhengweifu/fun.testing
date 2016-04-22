/**
 * three.js website LightManager by fun.zheng
 */

import THREE from 'three';
import Util from './Util';

export default class LightComponment {
	constructor() {
        this.keyLight = new THREE.DirectionalLight(0xffffe6, 0.95);
        this.auxLight = new THREE.DirectionalLight(0xd9d9ff, 0.75);
        this.ambientLight = new THREE.HemisphereLight(0xcbf1fe, 0xfff2d6, 0.4);
    }

    setTarget(target) {
        this.keyLight.target = target;
        this.auxLight.target = target;
    }

    setKeyValues(parameters) {
        if(parameters.color !== undefined) {
            this.keyLight.color.setHex(parameters.color);
        } else {
            this.keyLight.color.setHex(16777215);
        }

        if(parameters.intensity !== undefined) {
            this.keyLight.intensity = parameters.intensity;
        } else {
            this.keyLight.intensity = 1;
        }
    }

    setAuxValues(parameters) {
        if(parameters.color !== undefined) {
            this.auxLight.color.setHex(parameters.color);
        } else {
            this.auxLight.color.setHex(16777215);
        }

        if(parameters.intensity !== undefined) {
            this.auxLight.intensity = parameters.intensity;
        } else {
            this.auxLight.intensity = 1;
        }
    }

    update(camera, target) {
        var _cp = camera.position.clone();

        var _cup = camera.up.clone();
        var _cparent = camera.parent;

        if(_cparent) {
            _cp.applyMatrix4(_cparent.matrixWorld);
            _cup.applyMatrix4(_cparent.matrixWorld);
        }

        this.keyLight.position.copy(
            Util.getPosition(Math.PI / -4, _cup, _cp, target)
        );

        this.auxLight.position.copy(
            Util.getPosition(Math.PI / 4, _cup, _cp, target)
        );
    }
}