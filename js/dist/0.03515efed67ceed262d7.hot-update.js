webpackHotUpdate(0,{

/***/ 34:
/***/ function(module, exports, __webpack_require__) {

/**
 * @author benny.zheng
 * @data 2016-07-15
 * @description 自动更新登录页面背景区域
 */

module.exports = function (node, opts) {
    //----------------require--------------
    var base = __webpack_require__(3); // 基础对象
    var parseModule = __webpack_require__(11); // 页面模块自动解析
    var render = __webpack_require__(36);
    var popup = __webpack_require__(47);
    var each = __webpack_require__(0);
    var merge = __webpack_require__(6);

    //-----------声明模块全局变量-------------
    var nodeList = null; // 存储所有关键节点
    var that = base();
    var m_popup = null;
    var data = null;
    opts = merge({
        fisrtYear: 2009
    }, opts || {});
    //-------------事件响应声明---------------
    var evtFuncs = {};

    //-------------子模块实例化---------------
    var initMod = function () {
        m_popup = popup(render());
        m_popup.show();
    };

    //-------------绑定事件------------------
    var bindEvents = function () {};

    //-------------自定义函数----------------
    var custFuncs = {
        getYearData: function () {
            var arr = [];
            for (var i = 0; i < 12; i++) {
                arr.push(opts.firstYear);
            }
        }
    };

    //-------------一切从这开始--------------
    var init = function (_data) {
        data = _data;
        // 找到所有带有node-name的节点
        nodeList = parseModule(node);
        // 子模块实例化
        initMod();
        // 绑定事件
        bindEvents();
    };

    //---------------暴露API----------------
    that.init = init;

    return that;
};

/***/ }

})