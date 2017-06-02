webpackHotUpdate(0,{

/***/ 22:
/***/ function(module, exports, __webpack_require__) {

module.exports = function (node, opts) {
    //----------------require--------------
    var base = __webpack_require__(4); // 基础对象
    var parseModule = __webpack_require__(28); // 页面模块自动解析
    var merge = __webpack_require__(12);
    var render = __webpack_require__(23);
    var addEvent = __webpack_require__(16);
    var className = __webpack_require__(24);
    var opra = __webpack_require__(27);
    var eventProxy = __webpack_require__(30);

    //-----------声明模块全局变量-------------
    var nodeList = node; // 存储所有关键节点
    var that = base();
    var data = null;

    opts = merge({
        totalPages: 1, //总页数
        pageSize: 10, //每页显示几条
        curPage: 1, //当前页
        totalRows: 0, //总条数
        pageList: [10, 20, 30, 40, 50] //每页数列表
    }, opts || {});

    //-------------事件响应声明---------------
    var evtFuncs = {
        pageTurn: function (e) {
            var elem = e.target || e.relatedTarget || e.srcElement || e.currentTarget;
        },
        selectPageSize: function (e) {
            var elem = e.target || e.relatedTarget || e.srcElement || e.currentTarget;
            console.log(elem);
        }

    };

    //-------------子模块实例化---------------
    var initMod = function () {};

    //-------------绑定事件------------------
    var bindEvents = function () {
        eventProxy(node).add("select", "click", evtFuncs.selectPageSize);
    };

    //-------------自定义函数----------------
    var custFuncs = {};

    //-------------一切从这开始--------------
    var init = function (_data) {
        data = _data;

        node.innerHTML = render(opts);
        // 找到所有带有node-name的节点
        nodeList = parseModule(node);
        // 子模块实例化
        initMod();
        // 绑定事件
        bindEvents();

        // custFuncs.initView();
    };

    //---------------暴露API----------------
    that.init = init;

    return that;
};

/***/ },

/***/ 23:
/***/ function(module, exports) {

module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="m-grid-page" node-name="gridPage">\r\n    <span class="text">每页显示</span>\r\n    \r\n    <div class="select-group" >\r\n        <input type="text" value="' +
((__t = (pageSize)) == null ? '' : __t) +
'" node-name="pageSize" readonly="readonly" class="select"/>\r\n        <ul class="items up" node-name="select">\r\n            ';
pageList.forEach(function(item){;
__p += '\r\n            <li data-action="select">' +
((__t = (item)) == null ? '' : __t) +
'</li>\r\n            ';
});
__p += '\r\n        </ul>\r\n    </div>\r\n\r\n\r\n    <a href="javascript:void(0)" class="first" node-name="first">第一页</a>\r\n    <a href="javascript:void(0)" class="prev" node-name="prev">向前</a>\r\n    <span class="total" node-name="total">1&nbsp;/&nbsp;1</span>\r\n    <a href="javascript:void(0)" class="next" node-name="next">向后</a>\r\n    <a href="javascript:void(0)" class="last" node-name="last">最后一页</a>\r\n\r\n    <div class="page">\r\n        第<input class="select" type="text" value="' +
((__t = (curPage)) == null ? '' : __t) +
'" node-name="page"/>页\r\n    </div>\r\n    <a href="javascript:void(0)" class="goTo" node-name="btn">跳转</a>\r\n\r\n    <span class="total-text" node-name="text">当前0到0条，总共0条</span>\r\n</div>';

}
return __p
}

/***/ }

})