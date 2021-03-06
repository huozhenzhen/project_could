webpackHotUpdate(0,{

/***/ 102:
/***/ function(module, exports, __webpack_require__) {

/**
 * @author 璩
 * @data 2016-07-15
 * @description 自动更新登录页面背景区域
 */
module.exports = function (node, opts) {
    //----------------require--------------
    var base = __webpack_require__(3); // 基础对象
    var parseModule = __webpack_require__(5); // 页面模块自动解析
    var sizzle = __webpack_require__(7);
    var closest = __webpack_require__(89);
    var proxy = __webpack_require__(92);
    var runtime = __webpack_require__(80); // 运行时相关代码
    var leftNavRender = __webpack_require__(103); // 模板
    var className = __webpack_require__(22);
    var nodeOpera = __webpack_require__(20);
    var each = __webpack_require__(0);
    var addEvent = __webpack_require__(6);

    //-----------声明模块全局变量-------------
    var nodeList = null; // 存储所有关键节点
    var that = base();
    var data = null;

    //-------------事件响应声明---------------
    var evtFuncs = {};

    //-------------子模块实例化---------------
    var initMod = function () {};

    //-------------绑定事件------------------
    var bindEvents = function () {
        m_proxy.add("menu", "click", evtFuncs.menu);
    };

    //-------------自定义函数----------------
    var custFuncs = {
        setData: function (menu, uri) {}

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
    that.setData = custFuncs.setData;
    that.hideMenu = custFuncs.hideMenu;
    that.showMenu = custFuncs.showMenu;
    // that.switchMenuByUri = custFuncs.switchMenuByUri;

    return that;
};

/***/ },

/***/ 103:
/***/ function(module, exports) {

module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<%%>';

}
return __p
}

/***/ }

})