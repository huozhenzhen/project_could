webpackHotUpdate(0,{

/***/ 36:
/***/ function(module, exports, __webpack_require__) {

/**
 * @author benny.zheng
 * @data 2016-07-15
 * @description 自动更新登录页面背景区域
 */

module.exports = function (node, opts) {
    //----------------require--------------
    var base = __webpack_require__(3); // 基础对象
    var parseModule = __webpack_require__(13); // 页面模块自动解析
    var render = __webpack_require__(38);
    var className = __webpack_require__(20);
    var popup = __webpack_require__(50);
    var each = __webpack_require__(0);
    var merge = __webpack_require__(7);
    var addEvent = __webpack_require__(9);
    var closest = __webpack_require__(40);

    //-----------声明模块全局变量-------------
    var nodeList = null; // 存储所有关键节点
    var that = base();
    var m_popup = null;
    var data = null;
    opts = merge({
        beginYear: 2009
    }, opts || {});
    //-------------事件响应声明---------------
    var evtFuncs = {
        showCalendar: function (evt) {
            if (evt != undefined) {
                var node = closest(evt.target, "span");

                if (className.has(node, "left")) {
                    opts.beginYear = opts.beginYear - 10;
                }
                if (className.has(node, "right")) {
                    opts.beginYear = opts.beginYear + 10;
                }
            }

            nodeList.interval.innerHTML = opts.beginYear + 1 + "&nbsp;-&nbsp;" + (opts.beginYear + 10);

            var list = custFuncs.getYearData();
            var html = "";
            each(list, function (item, index) {
                if (index % 4 == 0) {
                    html = html + "<ul>";
                }
                if (index == 0 || index == 11) {
                    html = html + "<li><span  class='gray'>" + item + "</span></li>";
                } else if (index == 7) {
                    html = html + "<li><span  class = 'active'>" + item + "</span></li>";
                } else {
                    html = html + "<li><span>" + item + "</span></li>";
                }

                if (index % 4 == 3) {
                    html = html + "</ul>";
                }
            });

            nodeList.list.innerHTML = html;
        }
    };

    //-------------子模块实例化---------------
    var initMod = function () {
        m_popup = popup(render());
        nodeList = parseModule(m_popup.getOuter());
    };

    //-------------绑定事件------------------
    var bindEvents = function () {
        addEvent(nodeList.prev, "click", custFuncs.intiView);
        addEvent(nodeList.next, "click", custFuncs.intiView);
    };

    //-------------自定义函数----------------
    var custFuncs = {
        getYearData: function () {
            var arr = [];
            var start = opts.beginYear;
            for (var i = 0; i < 12; i++) {
                arr.push(start);
                start += 1;
            }
            return arr;
        },

        intiView: function (evt) {
            each([].concat());
        }

    };

    //-------------一切从这开始--------------
    var init = function (_data) {
        data = _data;
        // 找到所有带有node-name的节点
        // 子模块实例化
        initMod();
        // 绑定事件
        bindEvents();
        custFuncs.intiView();
    };

    //---------------暴露API----------------
    that.init = init;

    return that;
};

/***/ }

})