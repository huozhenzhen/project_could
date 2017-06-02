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
    var dataset = __webpack_require__(25);

    //-----------声明模块全局变量-------------
    var nodeList = node; // 存储所有关键节点
    var that = base();
    var data = null;

    opts = merge({
        totalPages: 1, //总页数
        pageSize: 10, //每页显示几条
        curPage: 6, //当前页
        totalRows: 70, //总条数
        pageList: [10, 20, 30, 40, 50] //每页数列表
    }, opts || {});

    //-------------事件响应声明---------------
    var evtFuncs = {
        pageTurn: function (e) {
            var elem = e.target || e.relatedTarget || e.srcElement || e.currentTarget;
        },
        selectPageSize: function (e) {
            var elem = e.target || e.relatedTarget || e.srcElement || e.currentTarget;
            nodeList.pageSize.value = elem.innerHTML;
            className.add(nodeList.select, "hide");
            nodeList.page.value = Math.floor(dataset.get(nodeList.text, "curNum") / nodeList.pageSize.value) || 1;

            custFuncs.pageChange();
        },
        selectShow: function (e) {
            if (className.has(nodeList.select, "hide")) {
                className.remove(nodeList.select, "hide");
            } else {
                className.add(nodeList.select, "hide");
            }
        },
        next: function () {
            nodeList.page.value = parseInt(nodeList.page.value, 10) + 1;
            custFuncs.pageChange();
        },
        prev: function () {
            nodeList.page.value = parseInt(nodeList.page.value, 10) - 1;
            custFuncs.pageChange();
        },
        goTo: function () {
            custFuncs.pageChange();
        }
    };

    //-------------子模块实例化---------------
    var initMod = function () {};

    //-------------绑定事件------------------
    var bindEvents = function () {
        eventProxy(node).add("select", "click", evtFuncs.selectPageSize);
        addEvent(nodeList.pageSize, "click", evtFuncs.selectShow);
        addEvent(nodeList.next, "click", evtFuncs.next);
        addEvent(nodeList.prev, "click", evtFuncs.prev);
        addEvent(nodeList.btn, "click", evtFuncs.goTo);
    };

    //-------------自定义函数----------------
    var custFuncs = {
        pageChange: function () {

            nodeList.total.innerHTML = nodeList.page.value + "&nbsp;/&nbsp;" + Math.ceil(opts.totalRows / nodeList.pageSize.value);

            var curNum = Math.ceil(opts.totalRows / nodeList.pageSize.value) != nodeList.page.value ? nodeList.pageSize.value * nodeList.page.value : nodeList.pageSize.value * (nodeList.page.value - 1) + opts.totalRows % nodeList.pageSize.value;

            dataset.set(nodeList.text, "curNum", curNum);

            nodeList.text.innerHTML = "当前" + nodeList.pageSize.value * (nodeList.page.value - 1) + "到" + curNum + "条，总共" + opts.totalRows + "条";
        },
        initView: function () {
            custFuncs.pageChange();
        }
    };

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

        custFuncs.initView();
    };

    //---------------暴露API----------------
    that.init = init;

    return that;
};

/***/ }

})