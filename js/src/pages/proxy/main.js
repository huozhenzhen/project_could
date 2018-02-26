/**
 * @author benny.zheng
 * @data 2016-07-19
 * @description 代理各个页面的加载
 */
//----------------require--------------
var runtime = require("pages/common/runtime");
// var theme = require("pages/common/theme/main");
var URL = require("lib/util/URL");
var url = URL.parse(location.href);


var script = document.createElement("script");
script.charset = "utf-8";
script.type = "text/javascript";


script.src = "./js/dist/" + runtime.getModuleName() + runtime.getPath() + ".js?ver=201611171603"// + new Date().getTime();
document.body.appendChild(script);