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
    // var sizzle = require("lib/dom/sizzle");
    // var closest = require("lib/dom/closest");
    var leftNavRender = __webpack_require__(103); // 模板
    // var className = require("lib/dom/className");
    // var nodeOpera = require("lib/dom/node");
    // var each = require("lib/util/each");
    // var addEvent = require('lib/evt/add');

    //-----------声明模块全局变量-------------
    var nodeList = null; // 存储所有关键节点
    var that = base();
    var data = null;

    //-------------事件响应声明---------------
    var evtFuncs = {};

    //-------------子模块实例化---------------
    var initMod = function () {};

    //-------------绑定事件------------------
    var bindEvents = function () {};

    //-------------自定义函数----------------
    var custFuncs = {
        setData: function (menu) {
            node.innerHTML = leftNavRender(menu);
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
    that.setData = custFuncs.setData;

    return that;
};

/***/ },

/***/ 103:
/***/ function(module, exports) {

module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<div>test</div>';

}
return __p
}

/***/ }

})