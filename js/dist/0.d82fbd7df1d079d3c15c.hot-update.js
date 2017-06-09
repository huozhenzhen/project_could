webpackHotUpdate(0,{

/***/ 23:
/***/ function(module, exports, __webpack_require__) {

module.exports = function (node, opts) {
    //----------------require--------------
    var base = __webpack_require__(4); // 基础对象
    var parseModule = __webpack_require__(28); // 页面模块自动解析
    var merge = __webpack_require__(12);
    var render = __webpack_require__(24);
    var addEvent = __webpack_require__(17);
    var className = __webpack_require__(25);
    var opra = __webpack_require__(27);
    var eventProxy = __webpack_require__(30);
    var dataset = __webpack_require__(15);

    //-----------声明模块全局变量-------------
    var nodeList = node; // 存储所有关键节点
    var that = base();
    var data = null;
    var maxPageSize = 0;

    opts = merge({
        pageSize: 10, //每页显示几条
        curPage: 6, //当前页
        totalRows: 72, //总条数
        pageList: [10, 20, 30, 40, 50] //每页数列表
    }, opts || {});

    //-------------事件响应声明---------------
    var evtFuncs = {

        selectPageSize: function (e) {
            var elem = e.target || e.relatedTarget || e.srcElement || e.currentTarget;
            var val = elem.innerHTML;
            nodeList.pageSize.value = val;
            className.add(nodeList.select, "hide");
            nodeList.page.value = Math.floor(dataset.get(nodeList.text, "curNum") / nodeList.pageSize.value) || 1;
            custFuncs.pageChange();
            that.fire("page", {
                pageSize: val,
                curpage: nodeList.page.value
            });
        },
        selectShow: function (e) {
            e.stopPropagation();
            if (className.has(nodeList.select, "hide")) {
                className.remove(nodeList.select, "hide");
            } else {
                className.add(nodeList.select, "hide");
            }
        },
        next: function () {
            if (custFuncs.isNext()) return;
            nodeList.page.value = parseInt(nodeList.page.value, 10) + 1;
            custFuncs.pageChange();
        },
        last: function () {
            if (custFuncs.isNext()) return;
            nodeList.page.value = maxPageSize;
            custFuncs.pageChange();
        },
        prev: function () {
            if (custFuncs.isPrev()) return;
            nodeList.page.value = parseInt(nodeList.page.value, 10) - 1;
            custFuncs.pageChange();
        },
        first: function () {
            if (custFuncs.isPrev()) return;
            nodeList.page.value = 1;
            custFuncs.pageChange();
        },
        goTo: function () {
            custFuncs.pageChange();
        },
        page: function () {
            this.value = this.value.replace(/\D/g, "");
            var val = this.value;
            if (val > maxPageSize) {
                this.value = maxPageSize;
            }
            if (val < 1 && val != "") {
                this.value = 1;
            }
        }
    };

    //-------------子模块实例化---------------
    var initMod = function () {};

    //-------------绑定事件------------------
    var bindEvents = function () {
        eventProxy(node).add("select", "click", evtFuncs.selectPageSize);
        addEvent(nodeList.pageSize, "click", evtFuncs.selectShow);
        addEvent(nodeList.first, "click", evtFuncs.first);
        addEvent(nodeList.next, "click", evtFuncs.next);
        addEvent(nodeList.prev, "click", evtFuncs.prev);
        addEvent(nodeList.last, "click", evtFuncs.last);
        addEvent(nodeList.btn, "click", evtFuncs.goTo);
        addEvent(nodeList.page, "keyup", evtFuncs.page);
        addEvent(document, "click", evtFuncs.selectShow);
    };

    //-------------自定义函数----------------
    var custFuncs = {
        pageChange: function () {
            var curpage = nodeList.page.value;
            maxPageSize = Math.ceil(opts.totalRows / nodeList.pageSize.value);
            nodeList.total.innerHTML = curpage + "&nbsp;/&nbsp;" + maxPageSize;
            //当前页码结束
            var curNum = maxPageSize != curpage ? nodeList.pageSize.value * curpage : nodeList.pageSize.value * (curpage - 1) + opts.totalRows % nodeList.pageSize.value;

            dataset.set(nodeList.text, "curNum", curNum);

            nodeList.text.innerHTML = "当前" + (1 + nodeList.pageSize.value * (curpage - 1)) + "到" + curNum + "条，总共" + opts.totalRows + "条";

            custFuncs.removeGray();
            if (custFuncs.isPrev()) {
                className.add(nodeList.prev, "gray");
                className.add(nodeList.first, "gray");
            }

            if (custFuncs.isNext()) {
                className.add(nodeList.next, "gray");
                className.add(nodeList.last, "gray");
            }

            that.fire("page", {
                pageSize: nodeList.pageSize.value,
                curpage: curpage
            });
        },
        initView: function () {
            custFuncs.pageChange();
        },
        removeGray: function () {
            className.remove(nodeList.next, "gray");
            className.remove(nodeList.last, "gray");
            className.remove(nodeList.prev, "gray");
            className.remove(nodeList.first, "gray");
        },
        isNext: function () {
            return dataset.get(nodeList.text, "curNum") == opts.totalRows;
        },
        isPrev: function () {
            return nodeList.page.value == "1";
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