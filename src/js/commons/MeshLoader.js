/**
 * three.js website MeshLoader by fun.zheng
 */

import THREE from 'three';

import Util from './Util';

import Loader from './Loader';

export default class MeshLoader {
    constructor(dom = null) {
        this.geometry = new THREE.Geometry();
        this.dom = dom;
        this.otherpara = null; // 其他参数
    }
    
    parse(url, onLoad) {
        let loader = new Loader();

        loader.setResponseType('arraybuffer');

        var recodeProcess = 0;

        loader.load(url, (response) => {
            if(response) {
                this.read(response, true, url);
                onLoad(this.geometry, url, this.otherpara);
            }

            Util.PROGRESS_USED_COUNT += 1;

            if(this.dom) {
                console.log('GEOMETRY_COUNT: ', Util.GEOMETRY_COUNT, ' PROGRESS_USED_COUNT: ', Util.PROGRESS_USED_COUNT);
                if(Util.GEOMETRY_COUNT === 0 || Util.PROGRESS_USED_COUNT === Util.GEOMETRY_COUNT) {
                    Util.PROGRESS_USED = 0;
                    Util.PROGRESS_USED_COUNT = 0;
                    setTimeout(function () {
                        //Util.progressHide();
                    }, 0);
                }
            }
        }, (event) => {
            if(event.lengthComputable && this.dom) {
                if(Util.GEOMETRY_COUNT > 0) {
                    recodeProcess = (Util.PROGRESS_USED_COUNT + event.loaded / event.total) / Util.GEOMETRY_COUNT;
                    if(recodeProcess <= Util.PROGRESS_USED) {
                        recodeProcess = Util.PROGRESS_USED;
                    } else {
                        Util.PROGRESS_USED = recodeProcess;
                    }
                } else {
                    recodeProcess = event.loaded / event.total;
                }


                if(recodeProcess > 1) {
                    recodeProcess = 1;
                }

                if(recodeProcess < 0) {
                    recodeProcess = 0;
                }

                Util.reportProgressSample(this.dom, recodeProcess);
            }
        });
    }

    read(data, binary, url) { //geometry json

        function isBitSet(value, position) {
            return value & (1 << position);
        }
        var vertices = [],
            normals = [],
            uvs = [],
            faces = [],
            colors = [],
            uvLayers = 0;

        if(binary) {
            function parseString(data, offset, length) {
                let  charArray = new Uint8Array( data, offset, length);
                let  text = '';
                for (let i = 0; i < length; i ++ ) {
                    text += String.fromCharCode( charArray[ offset + i ]);
                }
                return text;
            }

            function parseUChar8(data, offset) {
                let  charArray = new Uint8Array(data, offset, 1);
                return charArray[0];
            }

            function parseUInt32(data, offset) {
                let  intArray = new Uint32Array(data.slice(offset, offset + 4), 0, 1);
                return intArray[0];
            }

            function parseFloat32(data, offset) {
                let  floatArray = new Float32Array(data.slice(offset, offset + 4), 0, 1);
                return floatArray[0];
            }

            var point = 0;

            uvLayers = parseUChar8(data, point);

            point += 1;

            var uv_counts = [];

            for(let i = 0; i < uvLayers; i++) {
                uv_counts.push(parseUInt32(data, point));
                point += 4;
            }

            var normal_count = parseUInt32(data, point);
            point += 4;

            var vertex_count = parseUInt32(data, point);
            point += 4;

            var face_infos = parseUInt32(data, point);
            point += 4;

            // uvs
            var uv;
            for(let i = 0; i < uv_counts.length; i++) {
                uv = [];

                for(let j=0; j < uv_counts[i] * 2; j++) {
                    uv.push(parseFloat32(data, point));
                    point += 4;
                }
                if(uv.length > 0) {
                    uvs.push(uv);
                }
            }

            // normals
            for(let i = 0; i < normal_count * 3; i++) {
                normals.push(parseFloat32(data, point));
                point += 4;
            }

            // vertices
            for(let i = 0; i < vertex_count * 3; i++) {
                vertices.push(parseFloat32(data, point));
                point += 4;
            }

            // faces
            for(let i = 0; i < face_infos; i++) {
                faces.push(parseUInt32(data, point));
                point += 4;
            }

        } else {
            var json = data;
            vertices = json.data.vertices;
            normals = json.data.normals;
            uvs = json.data.uvs;
            faces = json.data.faces;
            colors = json.data.colors;
            // uv layers
            if(uvs !== undefined) {
                if (uvs.length > 0) {
                    // disregard empty arrays
                    for(let i = 0; i < uvs.length; i++) {
                        if(uvs[i].length) {
                            uvLayers++;
                        }
                    }
                }
            }
        }

        //var geometry = new THREE.Geometry();

        // uuid
        //this.geometry.uuid = url;


        // vertices
        if(vertices.length > 0) {
            for(let i = 0; i < vertices.length; i += 3) {
                var vertex = new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
                this.geometry.vertices.push(vertex);
            }
        }


        // faces
        var facesSize = faces.length;
        if(facesSize > 0) {
            var offset = 0;
            var type, face, materialIndex, uvIndex, u, v, normalIndex, colorIndex, faceNumber;

            var isTriangle,
                hasMaterial,
                hasFaceVertexUv,
                hasFaceNormal,
                hasFaceVertexNormal,
                hasFaceColor,
                hasFaceVertexColor;

            while(offset < facesSize) {
                // 
                type = faces[offset++];
                isTriangle          = !isBitSet(type, 0);
                hasMaterial         = isBitSet(type, 1);
                hasFaceVertexUv     = isBitSet(type, 3);
                hasFaceNormal       = isBitSet(type, 4);
                hasFaceVertexNormal = isBitSet(type, 5);
                hasFaceColor        = isBitSet(type, 6);
                hasFaceVertexColor  = isBitSet(type, 7);

                //
                if(isTriangle) {
                    // new a face
                    face = new THREE.Face3();
                    face.a = faces[offset++];
                    face.b = faces[offset++];
                    face.c = faces[offset++];

                    // material is true
                    if(hasMaterial) {
                        materialIndex = faces[offset++];
                        face.materialIndex = materialIndex;
                    }

                    // face vertex uv is true
                    faceNumber = this.geometry.faces.length;
                    if(uvs !== undefined) {
                        if(hasFaceVertexUv) {
                            if(uvLayers > 0) {
                                for(let i = 0; i < uvLayers; i++) {
                                    if(this.geometry.faceVertexUvs[i] === undefined) {
                                        this.geometry.faceVertexUvs.push([]);
                                    }

                                    this.geometry.faceVertexUvs[i][faceNumber] = [];
                                    for(let j = 0; j < 3; j++) {
                                        uvIndex = faces[offset++];
                                        u = uvs[i][uvIndex * 2];
                                        v = uvs[i][uvIndex * 2 + 1];
                                        this.geometry.faceVertexUvs[i][faceNumber].push(new THREE.Vector2(u, v));
                                    }
                                }
                            }
                        }
                    }

                    // if have not uv2, copy uv1 to uv2, beacuse light map is uv2
                    if(this.geometry.faceVertexUvs.length === 1) {
                        this.geometry.faceVertexUvs.push(this.geometry.faceVertexUvs[0]);
                    }


                    // face normal is true
                    if(hasFaceNormal) {
                        normalIndex = faces[offset++] * 3;
                        face.normal.set(
                            normals[normalIndex],
                            normals[normalIndex + 1],
                            normals[normalIndex + 2]
                        );
                    }

                    // face vertex normal is true
                    if(hasFaceVertexNormal) {
                        for(let i = 0; i < 3; i++) {
                            normalIndex = faces[offset++] * 3;
                            face.vertexNormals.push(
                                new THREE.Vector3(
                                    normals[normalIndex],
                                    normals[normalIndex + 1],
                                    normals[normalIndex + 2]
                                )
                            );
                        }
                    }

                    // face color is true
                    if(hasFaceColor) {
                        colorIndex = faces[offset++];
                        face.color.setHex(colors[colorIndex]);
                    }

                    // face vertex color is true
                    if(hasFaceVertexColor) {
                        for(let i = 0; i < 3; i++) {
                            colorIndex = faces[offset++];
                            face.vertexColors.push(new THREE.Color(colors[colorIndex]));
                        }
                    }

                    this.geometry.faces.push(face);
                }
            }
        }

        // compute face normals
        this.geometry.computeFaceNormals();

        return this.geometry;
    }

    write() {
        let result = [];
        function _write(geometry) {
            let data = {};

            data.uid = geometry.uuid;

            if ( geometry.name !== '' ) {
                data.name = geometry.name;
            }

            if ( geometry instanceof THREE.PlaneGeometry ) {

                data.type = 'PlaneGeometry';
                data.width = geometry.width;
                data.height = geometry.height;
                data.widthSegments = geometry.widthSegments;
                data.heightSegments = geometry.heightSegments;

            } else if ( geometry instanceof THREE.CubeGeometry ) {

                data.type = 'CubeGeometry';
                data.width = geometry.width;
                data.height = geometry.height;
                data.depth = geometry.depth;
                data.widthSegments = geometry.widthSegments;
                data.heightSegments = geometry.heightSegments;
                data.depthSegments = geometry.depthSegments;

            } else if ( geometry instanceof THREE.CircleGeometry ) {

                data.type = 'CircleGeometry';
                data.radius = geometry.radius;
                data.segments = geometry.segments;

            } else if ( geometry instanceof THREE.CylinderGeometry ) {

                data.type = 'CylinderGeometry';
                data.radiusTop = geometry.radiusTop;
                data.radiusBottom = geometry.radiusBottom;
                data.height = geometry.height;
                data.radialSegments = geometry.radialSegments;
                data.heightSegments = geometry.heightSegments;
                data.openEnded = geometry.openEnded;

            } else if ( geometry instanceof THREE.SphereGeometry ) {

                data.type = 'SphereGeometry';
                data.radius = geometry.radius;
                data.widthSegments = geometry.widthSegments;
                data.heightSegments = geometry.heightSegments;
                data.phiStart = geometry.phiStart;
                data.phiLength = geometry.phiLength;
                data.thetaStart = geometry.thetaStart;
                data.thetaLength = geometry.thetaLength;

            } else if ( geometry instanceof THREE.IcosahedronGeometry ) {

                data.type = 'IcosahedronGeometry';
                data.radius = geometry.radius;
                data.detail = geometry.detail;

            } else if ( geometry instanceof THREE.TorusGeometry ) {

                data.type = 'TorusGeometry';
                data.radius = geometry.radius;
                data.tube = geometry.tube;
                data.radialSegments = geometry.radialSegments;
                data.tubularSegments = geometry.tubularSegments;
                data.arc = geometry.arc;

            } else if ( geometry instanceof THREE.TorusKnotGeometry ) {

                data.type = 'TorusKnotGeometry';
                data.radius = geometry.radius;
                data.tube = geometry.tube;
                data.radialSegments = geometry.radialSegments;
                data.tubularSegments = geometry.tubularSegments;
                data.p = geometry.p;
                data.q = geometry.q;
                data.heightScale = geometry.heightScale;

            } else if ( geometry instanceof THREE.BufferGeometry ) {

                data.type = 'BufferGeometry';
                var bufferGeometryExporter = new THREE.BufferGeometryExporter();
                data.data = bufferGeometryExporter.parse( geometry );

                delete data.data.metadata;

            } else if ( geometry instanceof THREE.Geometry ) {

                data.type = 'Geometry';
                var geometryExporter = new THREE.GeometryExporter();
                data.data = geometryExporter.parse( geometry );

                delete data.data.metadata;

            }

            return data;
        }

        this.geometries.map((geo, index) => {
            return _write(geo);
        });

        return result;
    }
}