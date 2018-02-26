webpackHotUpdate(1,{

/***/ 93:
/***/ function(module, exports, __webpack_require__) {

/**
 * @author benny.zheng
 * @data 2016-07-15
 * @description 自动更新登录页面背景区域
 */

module.exports = function (node, opts) {
    //----------------require--------------
    var parseModule = __webpack_require__(5); // 页面模块自动解析
    // var dialog = require('pages/common/dialog/dialog');
    var dialogManager = __webpack_require__(86);
    var render = __webpack_require__(99);

    var config = {
        boxHTML: render(),
        buttons: [{ 'id': 'ok', 'text': '保存', 'type': 'blue' }, { 'id': 'cancel', 'text': '关闭' }]
    };
    var that = dialog(config);
    //-----------声明模块全局变量-------------
    var nodeList = null; // 存储所有关键节点
    var data = null;
    //-------------事件响应声明---------------
    var evtFuncs = {
        buttonClick: function (evt) {
            if (evt.data.type == 'cancel') {
                that.hide('close');
            }
        }
    };

    //-------------子模块实例化---------------
    var initMod = function () {
        that.bind('buttonClick', evtFuncs.buttonClick);
    };

    //-------------绑定事件------------------
    var bindEvents = function () {};

    //-------------自定义函数----------------
    var custFuncs = {};

    // 找到所有带有node-name的节点
    nodeList = parseModule(node);
    // 子模块实例化
    initMod();
    // 绑定事件
    bindEvents();

    //---------------暴露API----------------

    return that;
};

/***/ }

})