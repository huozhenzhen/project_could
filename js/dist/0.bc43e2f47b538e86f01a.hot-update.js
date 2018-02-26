webpackHotUpdate(0,{

/***/ 87:
/***/ function(module, exports, __webpack_require__) {

/**
 * @author 璩
 * @data 2016-07-15
 * @description 自动更新登录页面背景区域
 */
module.exports = function (node, opts) {
    //----------------require--------------
    var base = __webpack_require__(2); // 基础对象
    var parseModule = __webpack_require__(5); // 页面模块自动解析
    var sizzle = __webpack_require__(6);
    // var closest = require("lib/dom/closest");
    var leftNavRender = __webpack_require__(94); // 模板
    var className = __webpack_require__(19);
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
        setData: function (menu, uri) {
            node.innerHTML = leftNavRender({ menu: menu });
            custFuncs.selectByUri(uri);
        },
        selectByUri: function (uri) {
            try {
                var linkNode = sizzle('[data-path=' + uri + ']', node)[0];
            } catch (ex) {
                console.log(ex);
            }
            if (linkNode == null) return;

            var selectedLink = sizzle(".selected", node)[0];

            if (selectedLink) {
                className.remove(selectedLink, "selected");
            }

            className.add(linkNode, '.selected');
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

/***/ }

})