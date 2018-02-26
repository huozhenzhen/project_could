webpackHotUpdate(2,{

/***/ 36:
/***/ function(module, exports, __webpack_require__) {


var merge = __webpack_require__(4);
var loading = __webpack_require__(30);
var toast = __webpack_require__(47);
var alert = __webpack_require__(45);
var confirm = __webpack_require__(46);
var dialog = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \".dialog\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

var manager = {
	wait: function () {
		loading.show();
	},
	closeWait: function () {
		loading.hide();
	},
	toast: function (msg, opts) {
		var m_toast = toast(msg, opts);
		m_toast.show();
	},
	success: function (text, onOkOrOpts) {
		var opts = { 'icon': 'suc' };

		if (typeof onOkOrOpts == 'function') {
			opts = merge(opts, { 'ok': onOkOrOpts });
		} else {
			opts = merge(opts, onOkOrOpts);
		}
		var dialog = alert(text, opts);
		dialog.show();
	},
	error: function (text, onOkOrOpts) {
		var opts = { 'icon': 'err' };

		if (typeof onOkOrOpts == 'function') {
			opts = merge(opts, { 'ok': onOkOrOpts });
		} else {
			opts = merge(opts, onOkOrOpts);
		}
		var dialog = alert(text, opts);
		dialog.show();
	},
	confirm: function (text, onOkOrOpts, onCancel) {
		var opts = null;

		if (typeof onOkOrOpts == 'function' && typeof onCancel == 'function') {
			opts = { 'ok': onOkOrOpts, 'cancel': onCancel };
		}
		if (typeof onOkOrOpts == 'function') {
			opts = { 'ok': onOkOrOpts };
		} else {
			opts = onOkOrOpts;
		}
		var dialog = confirm('text', opts);
		dialog.show();
	},
	dialog: function (opts) {
		var dialog = dialog(opts);
		return dialog;
	}
};

module.exports = manager;
window.dialogManager = manager;

/***/ },

/***/ 38:
/***/ function(module, exports) {

module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<div class=\'m-dialog-alert\'>\r\n	<div class="main">\r\n			<span class="iconfont ' +
((__t = (icon == 'suc' ? 'icon-selected' : 'icon-close')) == null ? '' : __t) +
'"></span>\r\n			<span>' +
((__t = (text)) == null ? '' : __t) +
'</span>\r\n	</div>\r\n</div>';

}
return __p
}

/***/ },

/***/ 39:
/***/ function(module, exports) {

module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<div class=\'m-dialog-alert\'>\r\n	<div class="main">\r\n		<span class="iconfont  icon-help"></span>\r\n		<span>' +
((__t = (text)) == null ? '' : __t) +
'</span>\r\n	</div>\r\n</div>';

}
return __p
}

/***/ },

/***/ 42:
/***/ function(module, exports, __webpack_require__) {

/**
 * 传统动画实现 From STK
 *  @node     {Node}     动画节点
 *  @prop     {Object}   结束状态列表 {height:50px, left: 50px}
 *  @duration {Number}   动画过度效果的过程时长，单位毫秒 可缺损 默认 1000
 *  @easing   {String}   动画过度效果名词  可缺损 默认 'linaer'
 *  @callback {Function} 动画结束回调函数
 *  @example
 *  var ani  = animate(node, { height: '500px', width: '+60px' });
	var ani  = animate.chain(node)
	.animate({ height:           '+40px' }, 'ease-in')
	.animate({ width:            '+60px' })
	.animate({ backgroundColor:  'blue'  })
	.animate({ transform:  'rotate(60deg) scale(1,1.5) ', top: '100px', 'left':'100px' }, 'ease-out')
	;
 */

var console = __webpack_require__(3);
var when = __webpack_require__(35);
var color = __webpack_require__(44);
var getStyle = __webpack_require__(10);
var setStyle = __webpack_require__(29);
var arrayMap = __webpack_require__(43);
var getType = __webpack_require__(1);

var defaultEasing = 'linear';
var defaultDuration = 1000;

var rnum = /(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/;
var rfxnum = new RegExp("^([+-]?)(" + rnum.source + ")([a-z%]*)$", "i");
var rmatrix = /([0-9\.\-]+)/ig;

//用于临时节点
var testNode = document.createElement("DIV");
var hideCss = ';height:0;width:0;visibility:hidden;position:absolute;top:-1000px;left:-1000px;';

//动画过度算法
//提供四种简单的方式可以扩展
var AniEsasing = {
    'linear': function (pst) {
        return pst;
    },
    'ease-in': function (pst) {
        return 1 - Math.cos(pst * Math.PI / 2);
    },
    'ease-out': function (pst) {
        return 1 - AniEsasing['ease-in'](1 - pst);
    },
    'ease-in-out': function (pst) {
        return pst < 0.5 ? AniEsasing['ease-in'](pst * 2) / 2 : 1 - AniEsasing['ease-out'](pst * -2 + 2) / 2;
    }
};

/*
 *  添加动画过度效果
 *  @method addEasomg
 *  @public
 */
function addEasing(name, fx) {
    if (name in AniEsasing) {
        console.error('ani.animate: 该效果名已经存在');
    }

    return AniEsasing[name] = fx;
}

//兼容帧频动画
var _requestAnimationFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
}();

/*
 *  转化css transform 值为矩阵值（matrix）
 *  @method _formatMatrix
 *  @private
 *  @param  {String}
 */
function _formatMatrix(value) {
    testNode.style.cssText = '-webkit-transform:' + value + ';-moz-transform:' + value + ';-o-transform:' + value + ';transform:' + value + hideCss;
    document.body.appendChild(testNode);
    value = getStyle(testNode, 'transform');
    testNode.parentNode.removeNode(testNode);
    testNode.style.cssText = '';
    return value;
}

/*
 *  转化css color 值 如果是rgba的是rgba(x,x,x,x) 不然是#xxxxxx
 *  @method _formatColor
 *  @private
 *  @param  {String}
 */
function _formatColor(value) {
    //backgroundColor 在不插入dom流中的情况下是获取不到的
    //ie6 下设置background-color rbg(x,x,x) 是有问题的
    testNode.style.cssText = 'background-color:' + value + ';_background:' + value + hideCss;
    document.body.appendChild(testNode);
    value = getStyle(testNode, 'background-color');
    testNode.parentNode.removeNode(testNode);
    testNode.style.cssText = '';
    return value;
}

/*
 *  计算反计算 matrix 到 rotate, scale, skew
 *  turns a matrix into its rotate, scale and skew components
 *  http://hg.mozilla.org/mozilla-central/file/7cb3e9795d04/layout/style/nsStyleAnimation.cpp
 *  @method _unmatrix
 *  @private
 *  @param  {Array} [x,x,x,x,x,x] matrix的六个值
 *  @return [
 *            [ type, [value], unit ]
 *            ...
 *          ]
 */
function _unmatrix(matrix) {
    var scaleX,
        scaleY,
        skew,
        A = matrix[0],
        B = matrix[1],
        C = matrix[2],
        D = matrix[3];

    // Make sure matrix is not singular
    if (A * D - B * C) {
        // step (3)
        scaleX = Math.sqrt(A * A + B * B);
        A /= scaleX;
        B /= scaleX;
        // step (4)
        skew = A * C + B * D;
        C -= A * skew;
        D -= B * skew;
        // step (5)
        scaleY = Math.sqrt(C * C + D * D);
        C /= scaleY;
        D /= scaleY;
        skew /= scaleY;
        // step (6)
        if (A * D < B * C) {
            A = -A;
            B = -B;
            skew = -skew;
            scaleX = -scaleX;
        }

        // matrix is singular and cannot be interpolated
    } else {
        // In this case the elem shouldn't be rendered, hence scale == 0
        scaleX = scaleY = skew = 0;
    }

    // The recomposition order is very important
    // see http://hg.mozilla.org/mozilla-central/file/7cb3e9795d04/layout/style/nsStyleAnimation.cpp#l971
    return [['translate', [+matrix[4], +matrix[5]], 'px'], ['rotate', [Math.atan2(B, A)], 'rad'], ['skew' + "X", [Math.atan(skew)], 'rad'], ['scale', [scaleX, scaleY], '']];
}

/*
 *  转换16进制
 *  @method _tohex
 *  @private
 *  @param {String}
 */
function _tohex(x) {
    var hexDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
    return isNaN(x) ? '00' : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
}

/*
 *  设置元素每一帧的位置
 *  根据当前的过程的百分比设置当前的值
 *  @method _tween
 *  @private
 */
function _tween(node, easing, timeFramePst, start, end, unit) {
    var value;
    var i;
    var rs = {};
    for (i in start) {
        value = undefined;
        //特殊处理颜色
        if (/color/i.test(i)) {
            var rgba = arrayMap(['R', 'G', 'B', 'A'], function (value) {
                value = 'get' + value;
                var _start = start[i][1][value]() ? start[i][1][value]() : 0 | 0;
                var _end = end[i][1][value]() ? end[i][1][value]() : 0 | 0;
                return _start + (_end - _start) * AniEsasing[easing](timeFramePst);
            });
            //如果支持RGBa的使用RGBa
            //不然的话用#xxxxxx的方式
            if (start[i][1] === 'rgba') {
                value = 'rbga(' + rbga.join(',') + ')';
            } else {
                //rgba[0]要转化成init
                value = "#" + _tohex(rgba[0] | 0) + _tohex(rgba[1] | 0) + _tohex(rgba[2] | 0);
            }
        } else if (/transform/i.test(i)) {
            var transform;
            value = arrayMap(start[i], function (v, index) {
                var name = start[i][index][0];
                var value = arrayMap(start[i][index][1], function (v, _index) {
                    var _start = start[i][index][1][_index];
                    var _end = end[i][index][1][_index];
                    return (_start + (_end - _start) * AniEsasing[easing](timeFramePst)).toFixed(5) + start[i][index][2];
                }).join(',');
                return name + '(' + value + ')';
            });
            value = value.join(' ');
        } else {
            value = start[i] + (end[i] - start[i]) * AniEsasing[easing](timeFramePst) + unit[i];
        }
        rs[i] = value;
    }
    setStyle(node, rs);
}

/*
 *  时钟
 *  @method _tick
 *  @private
 */
function _tick(duration, progressCallback) {
    var pst = 0;
    var startTime = +new Date();
    var endTime = +new Date() + duration;
    var stopTime;
    var isStoped = false;

    _step();
    progressCallback(pst);

    return { stop: _stop, goOn: _goOn };

    //时钟步进
    function _step() {
        if (isStoped === true) {
            return;
        }
        var nowTime = +new Date();
        pst = (nowTime - startTime) / duration;
        if (nowTime >= endTime) {
            isStoped = true;
            return progressCallback(1);
        }
        progressCallback(pst);
        _requestAnimationFrame(_step);
    }

    //时钟暂停
    function _stop() {
        if (isStoped === false) {
            isStoped = true;
            stopTime = +new Date();
        }
    }

    //时钟继续
    function _goOn() {
        var nowTime = +new Date();
        if (isStoped === true) {
            startTime += nowTime - stopTime;
            endTime += nowTime - stopTime;
            isStoped = false;
            _step();
        }
    }
}

/*
 *  对于动画属性值的过滤
 *  @method _formateProp
 *  @private
 */
function _formateProp(node, prop, endValue) {
    var target;
    var start;
    var end;
    var unit;
    var tween = {};
    //特殊处理颜色
    if (/color/i.test(prop)) {
        start = getStyle(node, prop);
        end = _formatColor(endValue);
        unit = /rgba/.test(end) || /rgba/.test(start) ? 'rgba' : '#';
        tween.start = [unit, color(start)];
        tween.end = [unit, color(end)];
        return tween;
    }

    //特殊transform
    if (/transform/i.test(prop)) {
        start = getStyle(node, prop);
        end = _formatMatrix(endValue);
        start = start === 'none' ? 'matrix(1,0,0,1,0,0)' : start;
        end = end === 'none' ? 'matrix(1,0,0,1,0,0)' : end;
        tween.start = _unmatrix(start.match(rmatrix));
        tween.end = _unmatrix(end.match(rmatrix));
        return tween;
    }

    //标准处理
    //处理样式。[,+/-,值,单位]
    target = parseFloat(getStyle(node, prop));
    start = rfxnum.exec(getStyle(node, prop));
    end = rfxnum.exec(endValue);
    unit = end && end[3];

    var scale = 1;
    //下面代码用于转化单位
    //参考jquery操作
    var maxIterations = 20;
    if (start && start[3] !== unit) {
        unit = unit || start[3];
        end = end || [];
        start = +target || 1;

        do {
            // If previous iteration zeroed out, double until we get *something*
            // Use a string for doubling factor so we don't accidentally see scale as unchanged below
            scale = scale || ".5";

            // Adjust and apply
            start = start / scale;
            setStyle(node, prop, start + unit);

            // Update scale, tolerating zero or NaN from tween.cur()
            // And breaking the loop if scale is unchanged or perfect, or if we've just had enough
        } while (scale !== (scale = getStyle(node, prop) / target) && scale !== 1 && --maxIterations);
    }
    if (end) {
        start = tween.start = +start || +target || 0;
        tween.unit = unit;
        //处理 +/- 开头
        tween.end = end[1] ? start + (end[1] + 1) * end[2] : +end[2];
    }
    return tween;
}

/*
 *  对于动画过程监听实现。使用when的notify做过程监听
 *  @method _animate
 *  @private
 */
function _animate(duration) {
    var deferred = when.defer();
    var control = _tick(duration, function (pst) {
        deferred.notify(pst);
        if (pst == 1) {
            deferred.resolve(pst);
        }
    });
    return {
        promise: deferred.promise,
        stop: control.stop,
        goOn: control.goOn
    };
}

/*
 *  @method animate
 *  @public
 *  @node     {Node}     动画节点
 *  @prop     {Object}   结束状态列表 {height:50px, left: 50px}
 *  @duration {Number}   动画过度效果的过程时长，单位毫秒 可缺损 默认 1000
 *  @easing   {String}   动画过度效果名词  可缺损 默认 'linaer'
 *  @callback {Function} 动画结束回调函数
 */
function animate(node, prop, duration, easing, callback) {
    var start = {};
    var end = {};
    var unit = {};
    var i;
    var formatedProp;

    //参数适配
    callback = arguments[arguments.length - 1];
    callback = getType(callback) == "function" ? callback : function () {};
    if (getType(duration) != "number") {
        easing = duration;
        duration = defaultDuration;
    }
    easing = easing in AniEsasing ? easing : defaultEasing;

    for (i in prop) {
        formatedProp = _formateProp(node, i, prop[i]);
        start[i] = formatedProp.start;
        end[i] = formatedProp.end;
        unit[i] = formatedProp.unit;
    }
    var _ani = _animate(duration);
    _ani.promise.then(callback, function () {}, function (pst) {
        _tween(node, easing, pst, start, end, unit);
    });
    return _ani;
}

/*
 *  语法糖。 链式实现动画集合
 */
// chainAniControl需要是个队列
var chainAniControl = {};

function Chain(promise, key) {
    this.promise = promise;
    this.key = key;
}

Chain.prototype.animate = Chain.prototype.then = function (prop, duration, easing, callback) {
    var thisKey = this.key;
    var _deferred = when.defer();
    this.promise.then(function (node) {
        chainAniControl[thisKey] = animate(node, prop, duration, easing, function () {
            callback && callback();
            _deferred.resolve(node);
        });
    });
    return new Chain(_deferred.promise, thisKey);
};
Chain.prototype.stop = function () {
    chainAniControl && chainAniControl[this.key] && chainAniControl[this.key].stop();
};
Chain.prototype.goOn = function () {
    chainAniControl && chainAniControl[this.key] && chainAniControl[this.key].goOn();
};
Chain.prototype.destory = function () {
    delete chainAniControl[this.key];
};
Chain.init = function (node) {
    var deferred = when.defer();
    deferred.resolve(node);
    return new Chain(deferred.promise, new Date().getTime().toString() + Math.floor(Math.random() * 10000));
};

animate.chain = Chain.init;
animate.addEasing = addEasing;
module.exports = animate;

/***/ },

/***/ 43:
/***/ function(module, exports, __webpack_require__) {

/**
 * 映射数组
 * 遍历数组中所有元素，将每一个元素应用方法进行转换，并返回转换后的新数组
 * 注意：原数组不会做任何变化
 *
 * 例子：
 *
 * var arrayMap = require("../util/arrayMap");
 * var array = [1, 2, 3];
 * var newArray = arrayMap(array, function(item) {
 *     return item + 1;
 * })
 *
 * console.log(array); // [1, 2, 3]
 * console.log(newArray); // [2, 3, 4]
 *
 */

var each = __webpack_require__(0);

function map(o, callbackfn) {
    var a = [];
    each(o, function (value, index, source) {
        a[index] = callbackfn(value, index, source);
    });
    return a;
}

module.exports = function () {
    var arrMap = [].map;
    return arrMap ? function (o, callbackfn) {
        return arrMap.call(o, callbackfn);
    } : map;
}();

/***/ },

/***/ 44:
/***/ function(module, exports, __webpack_require__) {

/**
 * color 管理对象，来自STK
 * 例子：
 *
 * var color = require("../util/color");
 * var black = color("#000000")
 *
 */

var forEach = __webpack_require__(0);
var analysisHash = /^#([a-fA-F0-9]{3,8})$/;
var testRGBorRGBA = /^rgb[a]?\s*\(/;
var analysisRGBorRGBA = /([0-9\.]+)/ig;
var splitRGBorRGBA = /([a-fA-F0-9]{2})/ig;

var analysis = function (str) {
    var ret = [];
    var list = [];
    if (analysisHash.test(str)) {
        list = str.match(analysisHash);
        if (list[1].length <= 4) {
            ret = [];

            forEach(list[1].split(''), function (value, index) {
                ret.push(parseInt(value + value, 16));
            });
        } else if (list[1].length <= 8) {
            ret = [];

            forEach(list[1].match(splitRGBorRGBA), function (value, index) {
                ret.push(parseInt(value, 16));
            });
        }
        return ret;
    }
    if (testRGBorRGBA.test(str)) {
        list = str.match(analysisRGBorRGBA);
        ret = [];
        forEach(list, function (value, index) {
            ret.push(parseInt(value, 10));
        });
        return ret;
    }
    return false;
};

module.exports = function (colorStr) {
    var ret = analysis(colorStr);
    if (!ret) {
        return false;
    }
    var that = {};
    /**
     * Describe 获取red
     * @method getR
     * @return {Number}
     * @example
     */
    that.getR = function () {
        return ret[0];
    };
    /**
     * Describe 获取green
     * @method getG
     * @return {Number}
     * @example
     */
    that.getG = function () {
        return ret[1];
    };
    /**
     * Describe 获取blue
     * @method getB
     * @return {Number}
     * @example
     */
    that.getB = function () {
        return ret[2];
    };
    /**
     * Describe 获取alpha
     * @method getA
     * @return {Number}
     * @example
     */
    that.getA = function () {
        return ret[3];
    };
    return that;
};

/***/ },

/***/ 45:
/***/ function(module, exports, __webpack_require__) {

/**
 * @author benny.zheng
 * @data 2016-07-15
 * @description 自动更新登录页面背景区域
 */

module.exports = function (text, opts) {
    //----------------require--------------
    var parseModule = __webpack_require__(5); // 页面模块自动解析
    var merge = __webpack_require__(4);
    var render = __webpack_require__(38);
    var dialog = __webpack_require__(26);
    //-----------声明模块全局变量-------------
    //
    opts = merge({
        icon: "err", //"suc"
        ok: function () {}
    }, opts || {});

    opts["buttons"] = [{ 'id': 'ok', 'text': opts['okText'] || '确定', type: 'blue' }];

    var boxHTML = render({
        'text': text,
        'icon': opts.icon
    });
    opts.boxHTML = boxHTML;

    var that = dialog(opts);

    //-------------事件响应声明---------------
    var evtFuncs = {
        buttonclick: function (ev) {
            if (ev.data.type == 'ok') {
                try {
                    opts[ev.data.type]();
                    that.hide(ev.data.type);
                } catch (ex) {
                    console.err(ex);
                }
            }
        }
    };

    //-------------子模块实例化---------------
    var initMod = function () {};

    //-------------绑定事件------------------
    var bindEvents = function () {
        that.bind('buttonClick', evtFuncs.buttonclick);
    };

    //-------------自定义函数----------------
    var custFuncs = {};

    //-------------一切从这开始--------------

    // 找到所有带有node-name的节点
    // 子模块实例化
    initMod();
    // 绑定事件
    bindEvents();

    //---------------暴露API----------------

    return that;
};

/***/ },

/***/ 46:
/***/ function(module, exports, __webpack_require__) {

/**
 * @author benny.zheng
 * @data 2016-07-15
 * @description 自动更新登录页面背景区域
 */

module.exports = function (text, opts) {
    //----------------require--------------
    var parseModule = __webpack_require__(5); // 页面模块自动解析
    var merge = __webpack_require__(4);
    var render = __webpack_require__(39);
    var dialog = __webpack_require__(26);
    //-----------声明模块全局变量-------------
    //
    opts = merge({
        icon: "suc", //"suc"
        ok: function () {},
        cancel: function () {}
    }, opts || {});

    opts["buttons"] = [{ 'id': 'ok', 'text': opts['okText'] || '确定', type: 'blue' }, { 'id': 'cancel', 'text': opts['cancelText'] || '取消' }];

    var boxHTML = render({
        'text': text
    });
    opts.boxHTML = boxHTML;

    var that = dialog(opts);

    //-------------事件响应声明---------------
    var evtFuncs = {
        buttonclick: function (ev) {
            if (ev.data.type == 'ok' || ev.data.type == 'cancel') {
                try {
                    opts[ev.data.type]();
                    that.hide(ev.data.type);
                } catch (ex) {
                    console.err(ex);
                }
            }
        }
    };

    //-------------子模块实例化---------------
    var initMod = function () {};

    //-------------绑定事件------------------
    var bindEvents = function () {
        that.bind('buttonClick', evtFuncs.buttonclick);
    };

    //-------------自定义函数----------------
    var custFuncs = {};

    //-------------一切从这开始--------------

    // 找到所有带有node-name的节点
    // 子模块实例化
    initMod();
    // 绑定事件
    bindEvents();

    //---------------暴露API----------------

    return that;
};

/***/ },

/***/ 47:
/***/ function(module, exports, __webpack_require__) {

/**
 * @author benny.zheng
 * @data 2016-07-15
 * @description 自动更新登录页面背景区域
 */

module.exports = function (msg, opts) {
    //----------------require--------------
    var popup = __webpack_require__(34); // 基础对象
    var animate = __webpack_require__(42); // 基础对象
    var merge = __webpack_require__(4);

    opts = merge({
        bottom: 60
    }, opts || {});

    //-----------声明模块全局变量-------------
    var that = popup('<div class="mg-win-toast">' + msg + '</div>', {
        mask: false,
        keepMiddle: true
    });

    //-------------事件响应声明---------------
    var evtFuncs = {
        show: function () {
            that.setPosition(null, "auto", null, opts.bottom + "px");
            custFuncs.animate();
        }
    };

    //-------------子模块实例化---------------
    var initMod = function () {};

    //-------------绑定事件------------------
    var bindEvents = function () {
        that.bind("show", evtFuncs.show);
    };

    //-------------自定义函数----------------
    var custFuncs = {
        animate: function () {
            var node = that.getOuter();
            var ani = animate.chain(node).animate({ opacity: 0.6 }, 500, 'ease-in').animate({ opacity: 0 }, 1000, 'ease-in', function () {
                node.parentNode.removeChild(node);
            });
        }
    };

    //-------------一切从这开始--------------

    // 找到所有带有node-name的节点
    // 子模块实例化
    initMod();
    // 绑定事件
    bindEvents();

    //---------------暴露API----------------

    return that;
};

/***/ }

})