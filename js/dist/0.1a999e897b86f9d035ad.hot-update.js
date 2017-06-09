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
    // var renderItem = require("pages/common/tmpl/calendarYearItem.ejs");
    var popup = __webpack_require__(48);
    var each = __webpack_require__(0);
    var merge = __webpack_require__(6);

    //-----------声明模块全局变量-------------
    var nodeList = null; // 存储所有关键节点
    var that = base();
    var m_popup = null;
    var data = null;
    opts = merge({
        firstYear: 2009
    }, opts || {});
    //-------------事件响应声明---------------
    var evtFuncs = {};

    //-------------子模块实例化---------------
    var initMod = function () {
        m_popup = popup(render());
        m_popup.show();

        nodeList = parseModule(m_popup.getOuter());
    };

    //-------------绑定事件------------------
    var bindEvents = function () {};

    //-------------自定义函数----------------
    var custFuncs = {
        getYearData: function () {
            var arr = [];
            for (var i = 0; i < 12; i++) {
                opts.firstYear += 1;
                arr.push(opts.firstYear);
            }
            return arr;
        },
        intiView: function () {
            var list = custFuncs.getYearData();
            var html = "";
            each(list, function (item, index) {
                if (index % 4 == 0) {
                    html = +html + "<ul>";
                }
                html = html + "<li>" + item + "</html>";
                if (index % 4 == 3) {
                    html = +html + "</ul>";
                }
            });

            console.log(html);
        }

    };

    //-------------一切从这开始--------------
    var init = function (_data) {
        data = _data;
        // 找到所有带有node-name的节点
        custFuncs.intiView();
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

/***/ 36:
/***/ function(module, exports) {

module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<div class="m-calendar-year">\r\n	<div class="change">\r\n		<span class="left"><i class="arrow-left"></i></span>\r\n		<span class="center">2000-2019</span>\r\n		<span class="right"><i class="arrow-right"></i></span>\r\n	</div>\r\n	<section class="list" node-name="list">\r\n		<ul>\r\n			<li>2009</li>\r\n			<li>2010</li>\r\n			<li>2009</li>\r\n			<li>2009</li>\r\n		</ul> -->\r\n	</section>\r\n</div>';

}
return __p
}

/***/ }

})