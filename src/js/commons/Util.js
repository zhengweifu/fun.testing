/**
 * Util tools by fun.zheng
 */

import THREE from 'three';

var Util = {
    PROCESSPERCENT : 1,

    GEOMETRY_COUNT : 0,
    PROGRESS_USED_COUNT: 0,
    PROGRESS_USED : 0,

    progressFrame : null,
    progressRectangle : null,
    messagePanel : null,

    tipMessagePanel : null,

    loadingPanel : null
};

/**
 * @type {{Android: Function, BlackBerry: Function, iOS: Function, Opera: Function, Windows: Function, Any: Function}}
 */
Util.IsMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    Any: function() {
        return (Util.IsMobile.Android() || Util.IsMobile.BlackBerry() || Util.IsMobile.iOS() || Util.IsMobile.Opera() || Util.IsMobile.Windows());
    }
};

/**
 * [isSupportH5WebGLOrNot 查看浏览器是否支持]
 * @return {Boolean} [1 ：html5, 2 : webgl, 3 : all not]
 */
Util.isSupportH5WebGLOrNot = function() { // 1 : html5, 2 : webgl, 3 : all not
    var canvas = document.createElement('canvas');
    if(canvas.getContext) {
        try {
            var webgl = !! window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
            if(webgl) {
                return 2;
            } else {
                return 1;
            }
        } catch(e) {
            return 1;
        }
    } else {
        return 0;
    }
};

/**
 * 判断类型
 * @param obj
 * @param type
 * @returns {boolean}
 */
Util.is = function (obj, type) {
    return (type === 'Null' && obj === null) ||
        (type === 'Undefined' && obj === void 0 ) ||
        (type === 'Number' && isFinite(obj)) ||
        Object.prototype.toString.call(obj).slice(8,-1) === type;
};

/**
 * [indexOf 数组中元素的位置]
 * @param  {[type]} list    [description]
 * @param  {[type]} element [description]
 * @return {[type]}         [description]
 */
Util.indexOf = function(list, element) {
    for (let i = 0; i < list.length; i++) {
        if (list[i] === element) {
            return i;
        }
    }
    return -1;
};

/**
* 创建XMLHttpRequest (兼容ie 6、7)
* @returns {*}
*/
Util.createHttpRequest = function() {
    var request;
    if (window.XMLHttpRequest) {// code for all new browsers

        request = new XMLHttpRequest();

    } else if (window.ActiveXObject) {// code for IE5 and IE6

        request = new window.ActiveXObject('Microsoft.XMLHTTP');

        try {
            request = new window.ctiveXObject('Msxml2.XMLHTTP');
        } catch (e) {

            try {

                request = new window.ActiveXObject('Microsoft.XMLHTTP');

            } catch (e) {
                console.log(e.message);
            }
        }
    }

    return request;
};

/**
 * httpRequest 回调
 * @param request
 * @param onLoad
 */
Util.httpRequestOnLoad = function(request, onLoad) {
    if(request.onload !== undefined) {
        request.onload = function() {
            if (request.responseText) {
                if(onLoad) {
                    onLoad(request.responseText);
                }
            }
        };
    } else if(request.onreadystatechange !== undefined) {
        request.onreadystatechange = function () {
            if (request.readyState == 4) {// 4 = 'loaded'
                if (request.status == 200) {// 200 = OK
                    if (request.responseText) {
                        if(onLoad) {
                            onLoad(request.responseText);
                        }
                    }
                } else {
                    alert('status: ' + request.status);
                }
            }
        };
    } else {
        alert('request error');
    }
};

/**
 * 缩放图片
 * @param data
 * @param width => input width
 * @param height => input height
 * @param owidth => output width
 * @param oheight => output height
 * @returns {*}
 */
Util.resizePictrue = function(data, width, height, owidth, oheight) {
    if(!data.length || width <= 0 || height <= 0 || owidth <= 0 || oheight <= 0) {
        return null;
    }
    var format = data.length / (width * height);

    var w, h, ow, oh, s,
        odata = new Uint8ClampedArray(owidth * oheight * format);
    for(oh = 0; oh < oheight; oh++) {
        h = oh * height / oheight;
        for(ow = 0; ow < owidth; ow++) {
            w = ow * width / owidth;
            for(s = 0; s < format; s++) {
                odata[(ow + oh * owidth) * format + s] = data[(Math.floor(w) + Math.floor(h) * width) * format + s];
            }
        }
    }
    return [odata, format];
};

/**
 * 将相对路径转成绝对路径
 * @param url
 * @param sRelative
 * @returns {*}
 */
Util.getAbsPath = function(url, sRelative) {
    if(url.replace('\\', '/').split('/')[0] == sRelative.replace('\\', '/').split('/')[0]) {
        return sRelative;
    }

    let sUrl = url.replace(/^.*?\:\/\/[^\/]+/, ').replace(/[^\/]+$/, ');

    if (!sRelative) { 
        return sUrl; 
    }
    if (!/\/$/.test(sUrl)) { 
        sUrl += '/'; 
    }
    if (/^\.\.\//.test(sRelative)) {
        let Re = new RegExp('^\\.\\.\\/'), iCount = 0;
        while (Re.exec(sRelative) != null) {
            sRelative = sRelative.replace(Re, '');
            iCount++;
        }
        for (let i = 0; i < iCount; i++) { 
            sUrl = sUrl.replace(/[^\/]+\/$/, ''); 
        }
        if (sUrl == '') {
            return '/';
        }
        return sUrl + sRelative;
    }
    sRelative = sRelative.replace(/^\.\//, '');
    return sUrl + sRelative;
};


/**
 * 将绝对路径转成相对路径
 * @param url
 * @param sAbs
 * @returns {*}
 */
Util.getRelativePath = function(url, sAbs) {
    var urlN = url.replace('\\', '/');
    var urlNL = urlN.split('/');

    var sAbsN = sAbs.replace('\\', '/');
    var sAbsNL = sAbsN.split('/');

    var lenUrl = urlNL.length;
    var lenSAbs = sAbsNL.length;


    var ref = null;

    for(let i = 0; i < lenUrl - 1 && i < lenSAbs; i++) {
        if(urlNL[i] !== sAbsNL[i]) {
            ref = i;
            break;
        } else {
            if(i === lenUrl - 2) {
                ref = i + 1;
            }
        }
    }

    if(ref === null || ref < 0) {
        return sAbs;
    }

    var split = [];

    for(let i = ref; i < lenUrl - 1; i++) {
        split.push('..');
    }

    for(let i = ref; i < lenSAbs; i++) {
        split.push(sAbsNL[i]);
    }

    return split.join('/');
};

/**
 * 得到指定范围内的随机整数
 * @param min
 * @param max
 * @returns {*}
 */
Util.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * 根据自定义轴旋转点
 * @param radian
 * @param pivotStart
 * @param pivotEnd
 * @returns {THREE.Vector3}
 */
Util.getRotationMatrix4FromCustomAsix = function (radian, pivotStart, pivotEnd) {
    let c = Math.cos(radian);
    let s = Math.sin(radian);

    let p = new THREE.Vector3();
    p.subVectors(pivotEnd, pivotStart).normalize();

    let u = p.x, v = p.y, w = p.z;

    let x =  pivotStart.x, y = pivotStart.y, z = pivotStart.z;

    let uu = u * u,
        uv = u * v,
        uw = u * w,
        vv = v * v,
        vw = v * w,
        ww = w * w,

        xu = x * u,
        xv = x * v,
        xw = x * w,
        yu = y * u,
        yv = y * v,
        yw = y * w,
        zu = z * u,
        zv = z * v,
        zw = z * w;



    let m11 = uu + (vv + ww) * c,
        m12 = uv * (1 - c) - w * s,
        m13 = uw * (1 - c) + v * s,
        m14 = (x * (vv + ww) - u * (yv + zw)) * (1 - c) + (yw - zv) * s,

        m21 = uv * (1 - c) + w * s,
        m22 = vv + (uu + ww) * c,
        m23 = vw * (1 - c) - u * s,
        m24 = (y * (uu + ww) - v * (xu + zw)) * (1 - c) + (zu - xw) * s,

        m31 = uw * (1 - c) - v * s,
        m32 = vw * (1 - c) + u * s,
        m33 = ww + (uu + vv) * c,
        m34 = (z * (uu + vv) - w * (xu + yv)) * (1 - c) + (xv - yu) * s;

    let outputMatrix4 = new THREE.Matrix4();

    outputMatrix4.set(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, 0, 0, 0, 1);

    return outputMatrix4;
};

/**
 * 得到点新的坐标
 * @param radian
 * @param up
 * @param eye
 * @param target
 * @param axis
 * @returns {THREE.Vector3}
 */
Util.getPosition = function(radian, up, eye, target, axis) {
    let x = new THREE.Vector3(),
        y = new THREE.Vector3(),
        z = new THREE.Vector3();

    z.subVectors(eye, target).normalize();
    x.crossVectors(up, z).normalize();
    y.crossVectors(z, x).normalize();

    //rotate_y = new THREE.Vector3();
    let end;
    if (axis === undefined) {
        axis = 'y';
    }
    if(axis === 'y') {
        end = y.add(target);
    } else if(axis === 'x') {
        end = x.add(target);
    } else if(axis === 'z') {
        end = z.add(target);
    } else {
        return new THREE.Vector3();
    }

    let newPoint = eye.clone();

    newPoint.applyMatrix4(Util.getRotationMatrix4FromCustomAsix(radian, target, end));

    return newPoint;
};

Util.parseString = function(data, offset, length) {
    let  charArray = new Uint8Array( data, offset, length);
    let  text = '';
    for (let i = 0; i < length; i ++ ) {
        text += String.fromCharCode( charArray[ offset + i ]);
    }
    return text;
};

Util.parseUChar8 = function(data, offset) {
    let  charArray = new Uint8Array(data, offset, 1);
    return charArray[0];
};

Util.parseUInt32 = function(data, offset) {
    let  intArray = new Uint32Array(data.slice(offset, offset + 4), 0, 1);
    return intArray[0];
};

Util.parseFloat32 = function(data, offset) {
    let  floatArray = new Float32Array(data.slice(offset, offset + 4), 0, 1);
    return floatArray[0];
};

export default Util;