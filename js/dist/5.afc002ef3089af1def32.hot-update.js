webpackHotUpdate(5,{

/***/ 90:
/***/ function(module, exports, __webpack_require__) {

/**
 * @author benny.zheng
 * @data 2016-07-19
 * @description 代理各个页面的加载
 */
//----------------require--------------
var runtime = __webpack_require__(74);
// var theme = require("pages/common/theme/main");
var URL = __webpack_require__(36);
var url = URL.parse(location.href);

var script = document.createElement("script");
script.charset = "utf-8";
script.type = "text/javascript";

script.src = "./js/dist/" + runtime.getModuleName() + runtime.getPath() + ".js?ver=201611171603"; // + new Date().getTime();
document.body.appendChild(script);

/***/ }

})