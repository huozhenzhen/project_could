webpackHotUpdate(2,{

/***/ 27:
/***/ function(module, exports, __webpack_require__) {

/**
 * @author benny.zheng
 * @data 2016-07-15
 * @description 自动更新登录页面背景区域
 */

module.exports = function (node, opts) {
    //----------------require--------------
    var base = __webpack_require__(3); // 基础对象
    var parseModule = __webpack_require__(14); // 页面模块自动解析
    var render = __webpack_require__(29);
    var popup = !(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())();
    //-----------声明模块全局变量-------------
    var nodeList = null; // 存储所有关键节点
    var that = base();
    var data = null;
    //-------------事件响应声明---------------
    var evtFuncs = {};

    //-------------子模块实例化---------------
    var initMod = function () {
        node.insertAdjacentHTML('afterbegin', render());
    };

    //-------------绑定事件------------------
    var bindEvents = function () {};

    //-------------自定义函数----------------
    var custFuncs = {};

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

/***/ },

/***/ 41:
/***/ function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 41;


/***/ }

})