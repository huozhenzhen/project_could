webpackHotUpdate(4,{

/***/ 104:
/***/ function(module, exports, __webpack_require__) {



/**
 * @author benny.zheng
 * @data 2016-06-06
 * @description 本文件用于方便复制粘贴入口文件之用，请更新这里的说明
 *              另外，考虑到一般是放在js/src/pages/page-name/main.js，因此使用../../
 *              如果不是这个目录，请更改成正确的相对路径
 */
//----------------require--------------

var base = __webpack_require__(3);
var parsePage = __webpack_require__(8);
var ajax = __webpack_require__(68);
var scss = __webpack_require__(52);
var when = __webpack_require__(32);
var moduleListData = __webpack_require__(66);
var pathManager = __webpack_require__(75);
var frames = __webpack_require__(111);

var render = __webpack_require__(59);

// 模板

//-----------声明模块全局变量-------------
var nodeList = null; // 存储所有id符合m-xxx的节点
var moduleId = null;
var moduleList = null;
var moduleName = null;
var path = null;
var hash = null;
var opts = {};
var m_frames = null;

//-------------事件响应声明---------------
var evtFuncs = {
	hasChange: function (evt) {
		path = evt.data[0];
		hash = evt.data[1];
		custFuncs.updateView();
	}
};

//-------------子模块实例化---------------
var initMod = function () {
	m_frames = frames(nodeList.frames);
	m_frames.init();
};

//-------------绑定事件------------------
var bindEvents = function () {};

//-------------自定义函数----------------
var custFuncs = {

	initPage: function () {
		document.body.insertAdjacentHTML('AfterBegin', render({ 'moduleList': moduleList }));
		nodeList = parsePage();
		initMod();
	},
	updateView: function () {
		var moduleArray = path.split("/");
		var newModuleName = moduleArray[1];

		if (moduleList == null) {
			moduleList = moduleListData.data;
			moduleName = newModuleName;
			custFuncs.checkModule();
			custFuncs.initPage();
			custFuncs.openPage();
		}
	},
	getModuleList: function () {
		var defer = when.defer();

		ajax({
			'url': 'js/src/pages/frame/arr.json',
			'onSuccess': function (res) {},
			on
		});
	},
	openPage: function () {
		var url = null;
		url = "/proxy.html#" + path;
		m_frames.addFrame(url, moduleId);
	}
};

//-------------一切从这开始--------------
!function () {
	// 先将HTML插入body

	pathManager.bind('change', evtFuncs.hasChange);
	pathManager.start();

	// 找到所有带有id的节点，并将m-xxx-xxx转化成xxxXxx格式存储到nodeList中
	// nodeList = parsePage();
	// 子模块实例化
	// initMod();
	// 绑定事件
	// bindEvents();
}();

/***/ },

/***/ 111:
/***/ function(module, exports, __webpack_require__) {

/**
 * @author benny.zheng
 * @data 2016-07-20
 * @description 管理各iframe
 */

module.exports = function (node, opts) {
    //----------------require--------------
    var base = __webpack_require__(3); // 基础对象
    var parseModule = __webpack_require__(9); // 页面模块自动解析
    // var runtime = require("pages/common/runtime"); // 运行时相关代码
    var render = __webpack_require__(112);
    var nodeOpera = __webpack_require__(21);
    var appendQuery = __webpack_require__(90);
    var each = __webpack_require__(0);
    //-----------声明模块全局变量-------------
    var nodeList = null; // 存储所有关键节点
    var that = base();
    var data = null;
    var frames = {};
    var current = null;
    var timer = null;
    var load_modules = {};
    var exist_modules = {};

    //-------------事件响应声明---------------
    var evtFuncs = {};

    //-------------子模块实例化---------------
    var initMod = function () {};

    //-------------绑定事件------------------
    var bindEvents = function () {};

    //-------------自定义函数----------------
    var custFuncs = {
        timerDetection: function () {
            timer = setInterval(function () {
                each(exist_modules, function (val, key) {
                    if (window[val]) {
                        load_modules[key].loadJs = true;
                        each(load_modules[key].frame, function (item) {
                            custFuncs.addFrameURL(item.url, item.moduleId);
                        });
                        delete exist_modules[key];
                    }
                });
            }, 50);
        },
        addFrameURL: function (url, moduleId) {
            var html = null;

            if (current != null && current.getAttribute("data-url") == url) {
                return;
            } else if (current != null) {
                current.style.display = "none";
            }

            if (url in frames) {
                current = frames[url];
            } else {
                html = render({
                    url: appendQuery(url, {
                        appid: moduleId,
                        ver: new Date().getTime()
                    }),
                    path: url
                });
                node.insertAdjacentHTML('BeforeEnd', html);
                current = nodeOpera.last(node);
                frames[url] = current;
            }

            current.style.display = "block";
        },
        addFrame: function (url, moduleId) {
            if (/#\/(\w+)\//.test(url)) {
                var mod = RegExp.$1;
                if (load_modules[mod] && load_modules[mod].loadJs) {
                    custFuncs.addFrameURL(url, moduleId);
                } else {
                    if (!load_modules[mod]) {
                        load_modules[mod] = { frame: [] };
                        exist_modules[mod] = mod + "_modules";
                        // var script = document.createElement("script");
                        // script.type = "text/javascript";
                        // script.src = "./js/dist/" + mod + "/common.js?ver=" + new Date().getTime();
                        // document.getElementsByTagName("head")[0].appendChild(script);
                    }
                    load_modules[mod].frame.push({ url: url, moduleId: moduleId });
                }
            } else {
                custFuncs.addFrameURL(url, moduleId);
            }
        },
        removeFrame: function (url) {
            if (url in frames) {
                frames[url].parentNode.removeChild(frames[url]);
                delete frames[url];
            }
        },
        hasFrame: function (url) {
            return url in frames;
        },
        reloadFrame: function (url) {
            if (!(url in frames)) {
                return;
            }

            frames[url].contentWindow.location.reload(true);
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

        custFuncs.timerDetection();
    };

    //---------------暴露API----------------
    that.init = init;
    that.addFrame = custFuncs.addFrame;
    that.hasFrame = custFuncs.hasFrame;
    that.removeFrame = custFuncs.removeFrame;
    that.reloadFrame = custFuncs.reloadFrame;

    return that;
};

/***/ },

/***/ 112:
/***/ function(module, exports) {

module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '';
with (obj) {
__p += '<iframe src="' +
((__t = (url)) == null ? '' : __t) +
'" class="frame" data-url="' +
((__t = (path)) == null ? '' : __t) +
'" frameborder="0"></iframe>';

}
return __p
}

/***/ },

/***/ 35:
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)();
// imports


// module
exports.push([module.i, "@charset \"UTF-8\";\n/* 图片版本号 在image-path函数中调用 */\n/* 非标注中的序号的颜色，以00开始编号，保证数字编号与设计图标注的标号一致。*/\n/* 背景颜色 */\n/*frame顶部的透明色*/\n/* 字体颜色 */\n/* 字体大小 */\n/* 字体序号数字为rem值的小数，即1.8rem则为$font_size_8 */\n/* 边框颜色 */\n/* 图片地址统一使用本函数生成，同时支持版本号 */\n/**\n * 注意：\n *       关于单位，pcweb使用px，移动端使用rem，使用时注意修改body中的font-size（或者其它位置的相应单位）\n */\n/**\n * Eric Meyer's Reset CSS v2.0 (http://meyerweb.com/eric/tools/css/reset/)\n * http://cssreset.com\n */\nhtml,\nbody,\ndiv,\nspan,\napplet,\nobject,\niframe,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\np,\nblockquote,\npre,\na,\nabbr,\nacronym,\naddress,\nbig,\ncite,\ncode,\ndel,\ndfn,\nem,\nimg,\nins,\nkbd,\nq,\ns,\nsamp,\nsmall,\nstrike,\nstrong,\nsub,\nsup,\ntt,\nvar,\nb,\nu,\ni,\ncenter,\ndl,\ndt,\ndd,\nol,\nul,\nli,\nfieldset,\nform,\nlabel,\nlegend,\ntable,\ncaption,\ntbody,\ntfoot,\nthead,\ntr,\nth,\ntd,\narticle,\naside,\ncanvas,\ndetails,\nembed,\nfigure,\nfigcaption,\nfooter,\nheader,\nhgroup,\nmenu,\nnav,\noutput,\nruby,\nsection,\nsummary,\ntime,\nmark,\naudio,\nvideo {\n  margin: 0;\n  padding: 0;\n  border: 0;\n  font: inherit;\n  font-size: 100%;\n  vertical-align: middle; }\n\n/*去除安卓高亮边框*/\n* {\n  -webkit-tap-highlight-color: transparent; }\n\ndiv:focus,\na:focus,\ninput:focus {\n  -webkit-tap-highlight-color: transparent; }\n\ndiv:active,\na:active,\ninput:active {\n  -webkit-tap-highlight-color: transparent; }\n\n/* HTML5 display-role reset for older browsers */\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmenu,\nnav,\nsection {\n  display: block; }\n\nhtml {\n  color: #333;\n  height: 100%;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n   -ms-user-select: none;\n       user-select: none; }\n\n/*防止在webkit下出现font boosting*/\n* {\n  max-height: 999999px; }\n\n/*@media only screen and (-webkit-min-device-pixel-ratio: 3) {\n    html { font-size: 15px; }\n}*/\nbody {\n  font-size: 12px;\n  line-height: 1.5;\n  font-family: \"-apple-system\", \"Heiti SC\", \"Helvetica\", \"Helvetica Neue\", \"Droid Sans Fallback\", \"Droid Sans\";\n  height: auto;\n  min-height: 100%; }\n\nol,\nul {\n  list-style: none; }\n\nblockquote,\nq {\n  quotes: none; }\n\nblockquote:before,\nblockquote:after,\nq:before,\nq:after {\n  content: ''; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n\na {\n  text-decoration: none; }\n\na:focus {\n  outline: none; }\n\ninput,\ntextarea,\nbutton,\na {\n  -webkit-tap-highlight-color: rgba(255, 255, 255, 0); }\n\nbody {\n  -webkit-text-size-adjust: none;\n  /*-webkit-user-select:none;*/ }\n\na,\nimg {\n  /*-webkit-touch-callout: none;*/\n  -webkit-tap-highlight-color: rgba(255, 255, 255, 0); }\n\ninput:focus {\n  outline: none; }\n\n/* ------------- reset end --------------- */\n/* 单行加省略号 */\n.single-line-clamp {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  word-break: break-all; }\n\n.show {\n  display: block !important; }\n\n.hide {\n  display: none !important; }\n\n.clearfix:after, .m-dialog-common > .box:after, .m-grid-page:after {\n  content: \".\";\n  display: block;\n  height: 0;\n  clear: both;\n  visibility: hidden;\n  overflow: hidden; }\n\n.clearfix, .m-dialog-common > .box, .m-grid-page {\n  display: inline-block; }\n\n.clearfix, .m-dialog-common > .box, .m-grid-page {\n  display: block; }\n\n/* .clearfix:before, \n.clearfix:after {\n    display: table;\n    line-height:  0;\n    content: \"\";\n}   \n.clearfix:after {\n    clear: both;\n} */\n/* 图片版本号 在image-path函数中调用 */\n/* 非标注中的序号的颜色，以00开始编号，保证数字编号与设计图标注的标号一致。*/\n/* 背景颜色 */\n/*frame顶部的透明色*/\n/* 字体颜色 */\n/* 字体大小 */\n/* 字体序号数字为rem值的小数，即1.8rem则为$font_size_8 */\n/* 边框颜色 */\n@font-face {\n  font-family: \"iconfont\";\n  src: url(\"/font/iconfont.eot?t=1505787898067\");\n  /* IE9*/\n  src: url(\"/font/iconfont.eot?t=1505787898067#iefix\") format(\"embedded-opentype\"), url(\"/font/iconfont.ttf?t=1505787898067\") format(\"truetype\"), url(\"/font/iconfont.svg?t=1505787898067#iconfont\") format(\"svg\");\n  /* iOS 4.1- */ }\n\n.iconfont {\n  font-family: \"iconfont\" !important;\n  font-size: 16px;\n  font-style: normal;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n\n.icon-all:before {\n  content: \"\\E696\"; }\n\n.icon-back:before {\n  content: \"\\E697\"; }\n\n.icon-category:before {\n  content: \"\\E699\"; }\n\n.icon-close:before {\n  content: \"\\E69A\"; }\n\n.icon-comments:before {\n  content: \"\\E69B\"; }\n\n.icon-cry:before {\n  content: \"\\E69C\"; }\n\n.icon-delete:before {\n  content: \"\\E69D\"; }\n\n.icon-edit:before {\n  content: \"\\E69E\"; }\n\n.icon-email:before {\n  content: \"\\E69F\"; }\n\n.icon-favorite:before {\n  content: \"\\E6A0\"; }\n\n.icon-form:before {\n  content: \"\\E6A2\"; }\n\n.icon-help:before {\n  content: \"\\E6A3\"; }\n\n.icon-information:before {\n  content: \"\\E6A4\"; }\n\n.icon-less:before {\n  content: \"\\E6A5\"; }\n\n.icon-moreunfold:before {\n  content: \"\\E6A6\"; }\n\n.icon-more:before {\n  content: \"\\E6A7\"; }\n\n.icon-pic:before {\n  content: \"\\E6A8\"; }\n\n.icon-qrcode:before {\n  content: \"\\E6A9\"; }\n\n.icon-rfq:before {\n  content: \"\\E6AB\"; }\n\n.icon-search:before {\n  content: \"\\E6AC\"; }\n\n.icon-selected:before {\n  content: \"\\E6AD\"; }\n\n.icon-set:before {\n  content: \"\\E6AE\"; }\n\n.icon-smile:before {\n  content: \"\\E6AF\"; }\n\n.icon-success:before {\n  content: \"\\E6B1\"; }\n\n.icon-survey:before {\n  content: \"\\E6B2\"; }\n\n.icon-viewgallery:before {\n  content: \"\\E6B4\"; }\n\n.icon-viewlist:before {\n  content: \"\\E6B5\"; }\n\n.icon-warning:before {\n  content: \"\\E6B6\"; }\n\n.icon-wrong:before {\n  content: \"\\E6B7\"; }\n\n.icon-add:before {\n  content: \"\\E6B9\"; }\n\n.icon-remind:before {\n  content: \"\\E6BC\"; }\n\n.icon-box:before {\n  content: \"\\E6CB\"; }\n\n.icon-process:before {\n  content: \"\\E6CE\"; }\n\n.icon-electrical:before {\n  content: \"\\E6D4\"; }\n\n.icon-electronics:before {\n  content: \"\\E6DA\"; }\n\n.icon-gifts:before {\n  content: \"\\E6DB\"; }\n\n.icon-lights:before {\n  content: \"\\E6DE\"; }\n\n.icon-atmaway:before {\n  content: \"\\E6E9\"; }\n\n.icon-pin:before {\n  content: \"\\E6F2\"; }\n\n.icon-text:before {\n  content: \"\\E6FC\"; }\n\n.icon-move:before {\n  content: \"\\E6FD\"; }\n\n.icon-gerenzhongxin:before {\n  content: \"\\E70B\"; }\n\n.icon-operation:before {\n  content: \"\\E70E\"; }\n\n.icon-remind1:before {\n  content: \"\\E713\"; }\n\n.icon-map:before {\n  content: \"\\E715\"; }\n\n.icon-accountfilling:before {\n  content: \"\\E732\"; }\n\n.icon-libra:before {\n  content: \"\\E74C\"; }\n\n.icon-color:before {\n  content: \"\\E760\"; }\n\n.icon-favorites:before {\n  content: \"\\E7CE\"; }\n\n.icon-Calculator:before {\n  content: \"\\E812\"; }\n\n.icon-earth:before {\n  content: \"\\E828\"; }\n\n.m-blue-bg-button, .m-white-bg-button {\n  box-sizing: border-box;\n  display: inline-block;\n  border: 1px solid #e3e4e9;\n  border-radius: 3px;\n  height: 38px;\n  line-height: 36px;\n  font-size: 14px;\n  text-align: center;\n  padding: 0 25px;\n  cursor: pointer;\n  -moz-user-select: none;\n  -webkit-user-select: none;\n  -ms-user-select: none; }\n\n/* 默认按钮，蓝色白字 */\n.m-blue-bg-button {\n  color: #ffffff;\n  background: #2ba0ff;\n  border-color: #2ba0ff; }\n  .m-blue-bg-button:hover {\n    background: #4eaaff; }\n  .m-blue-bg-button:active {\n    background: #2ba0ff; }\n  .m-blue-bg-button.gray {\n    cursor: default; }\n    .m-blue-bg-button.gray:hover {\n      color: #666666;\n      border-color: #e3e4e9; }\n    .m-blue-bg-button.gray:active {\n      background: #ffffff;\n      border-color: #e3e4e9;\n      color: #666666; }\n\n/* 白底 */\n.m-white-bg-button {\n  color: #666666;\n  background: #ffffff; }\n  .m-white-bg-button:hover {\n    color: #2ba0ff;\n    border-color: #2ba0ff; }\n  .m-white-bg-button:active {\n    background: #ffffff;\n    border-color: #e3e4e9;\n    color: #666666; }\n\n.m-dialog-common {\n  position: absolute;\n  border: solid 1px #e3e4e9;\n  border-radius: 3px;\n  background-color: #ffffff; }\n  .m-dialog-common > .header {\n    color: #333333;\n    font-size: 16px;\n    position: relative;\n    background-color: #f4f5f9;\n    padding: 14px 20px 11px 20px; }\n    .m-dialog-common > .header > .close {\n      width: 24px;\n      height: 24px;\n      position: absolute;\n      top: 10px;\n      right: 16px; }\n    .m-dialog-common > .header > .iconfont {\n      font-size: 20px; }\n  .m-dialog-common > .box {\n    border: 1px solid transparent; }\n  .m-dialog-common .footer {\n    text-align: center;\n    padding: 10px 0;\n    background-color: #f4f5f9; }\n    .m-dialog-common .footer a {\n      margin: 0 10px; }\n\n.m-dialog-alert {\n  margin: 60px 40px 90px 40px;\n  font-size: 14px;\n  color: #333333;\n  text-align: center;\n  min-width: 450px; }\n  .m-dialog-alert .iconfont {\n    font-size: 34px; }\n\n.mg-win-toast {\n  padding: 0 20px;\n  height: 50px;\n  background: black;\n  opacity: 0;\n  text-align: center;\n  font-size: 20px;\n  line-height: 50px;\n  color: #ffffff;\n  border-radius: 8px; }\n\n.m-loading {\n  position: fixed;\n  width: 100%;\n  height: 100%;\n  background: #ffffff; }\n  .m-loading .loading {\n    width: 100px;\n    height: 100px;\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    margin-top: -80px;\n    margin-left: -50px; }\n    .m-loading .loading span {\n      display: inline-block;\n      width: 16px;\n      height: 16px;\n      background: #2ba0ff;\n      position: absolute;\n      opacity: 0.2;\n      border-radius: 50%;\n      -webkit-animation: pageLoading 1s ease infinite;\n              animation: pageLoading 1s ease infinite; }\n    .m-loading .loading span:nth-child(1) {\n      left: 0;\n      top: 50%;\n      margin-top: -8px; }\n    .m-loading .loading span:nth-child(2) {\n      left: 14px;\n      top: 14px;\n      -webkit-animation-delay: 0.125s;\n              animation-delay: 0.125s; }\n    .m-loading .loading span:nth-child(3) {\n      left: 50%;\n      top: 0;\n      margin-left: -8px;\n      -webkit-animation-delay: 0.25s;\n              animation-delay: 0.25s; }\n    .m-loading .loading span:nth-child(4) {\n      right: 14px;\n      top: 14px;\n      -webkit-animation-delay: 0.375s;\n              animation-delay: 0.375s; }\n    .m-loading .loading span:nth-child(5) {\n      right: 0;\n      top: 50%;\n      margin-top: -8px;\n      -webkit-animation-delay: 0.5s;\n              animation-delay: 0.5s; }\n    .m-loading .loading span:nth-child(6) {\n      right: 14px;\n      bottom: 14px;\n      -webkit-animation-delay: 0.625s;\n              animation-delay: 0.625s; }\n    .m-loading .loading span:nth-child(7) {\n      left: 50%;\n      bottom: 0;\n      margin-left: -8px;\n      -webkit-animation-delay: 0.875s;\n              animation-delay: 0.875s; }\n    .m-loading .loading span:nth-child(8) {\n      left: 14px;\n      bottom: 14px;\n      -webkit-animation-delay: s;\n              animation-delay: s; }\n\n@-webkit-keyframes pageLoading {\n  0% {\n    opacity: 0.2;\n    -webkit-transform: scale(0.3);\n            transform: scale(0.3); }\n  100% {\n    opacity: 1;\n    -webkit-transform: scale(1.2);\n            transform: scale(1.2); } }\n\n@keyframes pageLoading {\n  0% {\n    opacity: 0.2;\n    -webkit-transform: scale(0.3);\n            transform: scale(0.3); }\n  100% {\n    opacity: 1;\n    -webkit-transform: scale(1.2);\n            transform: scale(1.2); } }\n\n.m-bottom-scroll {\n  width: 100%;\n  height: 17px;\n  position: absolute;\n  bottom: 54px;\n  left: 0;\n  background-color: #ffffff; }\n  .m-bottom-scroll .scroll-bg {\n    height: 7px;\n    background-color: #efefef;\n    margin: 5px 17px;\n    position: relative; }\n  .m-bottom-scroll .scroll-tool {\n    position: absolute;\n    height: 7px;\n    width: 200px;\n    left: 0;\n    top: 0;\n    background-color: rgba(199, 199, 199, 0.6);\n    cursor: pointer;\n    border-radius: 3px; }\n    .m-bottom-scroll .scroll-tool:hover {\n      background-color: #c7c7c7; }\n    .m-bottom-scroll .scroll-tool:active {\n      background-color: #b5b5b5; }\n\n.m-right-scroll {\n  width: 17px;\n  height: 80px;\n  position: absolute;\n  top: 40px;\n  right: 0;\n  background-color: #ffffff; }\n  .m-right-scroll .scroll-bg {\n    height: 50px;\n    width: 7px;\n    background-color: #efefef;\n    margin: 17px 5px;\n    position: relative; }\n  .m-right-scroll .scroll-tool {\n    position: absolute;\n    height: 30px;\n    width: 7px;\n    top: 0;\n    right: 0;\n    background-color: rgba(199, 199, 199, 0.6);\n    cursor: pointer;\n    border-radius: 3px; }\n    .m-right-scroll .scroll-tool:hover {\n      background-color: #c7c7c7; }\n    .m-right-scroll .scroll-tool:active {\n      background-color: #b5b5b5; }\n\n.m-grid-page {\n  line-height: 22px;\n  font-size: 14px;\n  min-width: 950px; }\n  .m-grid-page span,\n  .m-grid-page div,\n  .m-grid-page a {\n    float: left;\n    margin: 0 4px;\n    font-size: 14px;\n    color: #666666; }\n  .m-grid-page .select {\n    border: 1px solid #e3e4e9;\n    max-width: 30px;\n    border-radius: 3px; }\n  .m-grid-page .select-group {\n    position: relative; }\n    .m-grid-page .select-group .select {\n      text-indent: 4px;\n      line-height: 20px; }\n    .m-grid-page .select-group .icon {\n      background-position: -44.1rem -33.45rem;\n      width: 0.5rem;\n      height: 0.25rem;\n      background-image: url(\"/images/sprite.png?v=1496632378037\");\n      background-repeat: no-repeat;\n      background-size: 50.85rem 50.65rem;\n      display: inline-block;\n      position: absolute;\n      top: 10px;\n      right: 2px; }\n    .m-grid-page .select-group .items {\n      position: absolute;\n      border: 1px solid #e3e4e9;\n      border-bottom: none;\n      width: 100%;\n      z-index: 5;\n      max-height: 160px;\n      overflow: auto;\n      position: absolute;\n      top: -120px;\n      left: 0; }\n      .m-grid-page .select-group .items li {\n        cursor: pointer;\n        text-align: center; }\n        .m-grid-page .select-group .items li:hover {\n          background: #e2effa; }\n  .m-grid-page .first,\n  .m-grid-page .prev,\n  .m-grid-page .next,\n  .m-grid-page .last,\n  .m-grid-page .goTo {\n    border: 1px solid #e3e4e9;\n    border-radius: 3px;\n    padding: 0 10px; }\n    .m-grid-page .first:hover,\n    .m-grid-page .prev:hover,\n    .m-grid-page .next:hover,\n    .m-grid-page .last:hover,\n    .m-grid-page .goTo:hover {\n      border: 1px solid #2ba0ff;\n      color: #2ba0ff; }\n    .m-grid-page .first.gray,\n    .m-grid-page .prev.gray,\n    .m-grid-page .next.gray,\n    .m-grid-page .last.gray,\n    .m-grid-page .goTo.gray {\n      cursor: not-allowed; }\n      .m-grid-page .first.gray:hover,\n      .m-grid-page .prev.gray:hover,\n      .m-grid-page .next.gray:hover,\n      .m-grid-page .last.gray:hover,\n      .m-grid-page .goTo.gray:hover {\n        color: #666666;\n        border: 1px solid #e3e4e9; }\n  .m-grid-page .page input {\n    border: 1px solid #e3e4e9;\n    text-align: center;\n    margin: 0 4px;\n    line-height: 20px; }\n    .m-grid-page .page input:focus {\n      border: 1px solid #2e96ea; }\n  .m-grid-page .first i {\n    background-position: -44.1rem -25.7rem;\n    width: 0.4rem;\n    height: 0.5rem;\n    background-image: url(\"/images/sprite.png?v=1496632378037\");\n    background-repeat: no-repeat;\n    background-size: 50.85rem 50.65rem;\n    display: inline-block; }\n  .m-grid-page .first.gray:hover i {\n    background-position: -44.1rem -25.7rem;\n    width: 0.4rem;\n    height: 0.5rem;\n    background-image: url(\"/images/sprite.png?v=1496632378037\");\n    background-repeat: no-repeat;\n    background-size: 50.85rem 50.65rem;\n    display: inline-block; }\n  .m-grid-page .first:hover i {\n    background-position: -44.1rem -28.05rem;\n    width: 0.4rem;\n    height: 0.5rem;\n    background-image: url(\"/images/sprite.png?v=1496632378037\");\n    background-repeat: no-repeat;\n    background-size: 50.85rem 50.65rem;\n    display: inline-block; }\n  .m-grid-page .prev i {\n    background-position: -27.95rem -16.15rem;\n    width: 0.25rem;\n    height: 0.5rem;\n    background-image: url(\"/images/sprite.png?v=1496632378037\");\n    background-repeat: no-repeat;\n    background-size: 50.85rem 50.65rem;\n    display: inline-block; }\n  .m-grid-page .prev.gray:hover i {\n    background-position: -27.95rem -16.15rem;\n    width: 0.25rem;\n    height: 0.5rem;\n    background-image: url(\"/images/sprite.png?v=1496632378037\");\n    background-repeat: no-repeat;\n    background-size: 50.85rem 50.65rem;\n    display: inline-block; }\n  .m-grid-page .prev:hover i {\n    background-position: -27.95rem -14.05rem;\n    width: 0.25rem;\n    height: 0.5rem;\n    background-image: url(\"/images/sprite.png?v=1496632378037\");\n    background-repeat: no-repeat;\n    background-size: 50.85rem 50.65rem;\n    display: inline-block; }\n  .m-grid-page .next i {\n    background-position: -27.95rem -18.2rem;\n    width: 0.25rem;\n    height: 0.5rem;\n    background-image: url(\"/images/sprite.png?v=1496632378037\");\n    background-repeat: no-repeat;\n    background-size: 50.85rem 50.65rem;\n    display: inline-block; }\n  .m-grid-page .next.gray:hover i {\n    background-position: -27.95rem -18.2rem;\n    width: 0.25rem;\n    height: 0.5rem;\n    background-image: url(\"/images/sprite.png?v=1496632378037\");\n    background-repeat: no-repeat;\n    background-size: 50.85rem 50.65rem;\n    display: inline-block; }\n  .m-grid-page .next:hover i {\n    background-position: -44.15rem -35.1rem;\n    width: 0.25rem;\n    height: 0.5rem;\n    background-image: url(\"/images/sprite.png?v=1496632378037\");\n    background-repeat: no-repeat;\n    background-size: 50.85rem 50.65rem;\n    display: inline-block; }\n  .m-grid-page .last i {\n    background-position: -44.1rem -24.25rem;\n    width: 0.4rem;\n    height: 0.5rem;\n    background-image: url(\"/images/sprite.png?v=1496632378037\");\n    background-repeat: no-repeat;\n    background-size: 50.85rem 50.65rem;\n    display: inline-block; }\n  .m-grid-page .last.gray:hover i {\n    background-position: -44.1rem -24.25rem;\n    width: 0.4rem;\n    height: 0.5rem;\n    background-image: url(\"/images/sprite.png?v=1496632378037\");\n    background-repeat: no-repeat;\n    background-size: 50.85rem 50.65rem;\n    display: inline-block; }\n  .m-grid-page .last:hover i {\n    background-position: -44.1rem -23.35rem;\n    width: 0.4rem;\n    height: 0.5rem;\n    background-image: url(\"/images/sprite.png?v=1496632378037\");\n    background-repeat: no-repeat;\n    background-size: 50.85rem 50.65rem;\n    display: inline-block; }\n  .m-grid-page .goTo.gray:hover i {\n    background-position: -25.15rem -43.8rem;\n    width: 0.9rem;\n    height: 0.7rem;\n    background-image: url(\"/images/sprite.png?v=1496632378037\");\n    background-repeat: no-repeat;\n    background-size: 50.85rem 50.65rem;\n    display: inline-block; }\n  .m-grid-page .goTo i {\n    background-position: -25.15rem -43.8rem;\n    width: 0.9rem;\n    height: 0.7rem;\n    background-image: url(\"/images/sprite.png?v=1496632378037\");\n    background-repeat: no-repeat;\n    background-size: 50.85rem 50.65rem;\n    display: inline-block;\n    padding-right: 5px; }\n  .m-grid-page .goTo:hover i {\n    background-position: -26.45rem -43.8rem;\n    width: 0.9rem;\n    height: 0.7rem;\n    background-image: url(\"/images/sprite.png?v=1496632378037\");\n    background-repeat: no-repeat;\n    background-size: 50.85rem 50.65rem;\n    display: inline-block; }\n\n.m-calendar-year {\n  width: 289px;\n  border: 1px solid #e1e1e1;\n  color: #666666; }\n  .m-calendar-year .change {\n    width: 100%;\n    display: table;\n    background: #f3f6f8;\n    line-height: 30px;\n    height: 30px;\n    font-weight: 600; }\n    .m-calendar-year .change span {\n      display: table-cell;\n      text-align: center; }\n      .m-calendar-year .change span i {\n        border: 6px  solid transparent;\n        display: inline-block; }\n      .m-calendar-year .change span .arrow-left {\n        border-right: 6px solid #666666; }\n      .m-calendar-year .change span .arrow-right {\n        border-left: 6px solid #666666; }\n  .m-calendar-year .list ul {\n    width: 100%;\n    display: table;\n    text-align: center;\n    font-size: 14px;\n    font-weight: 600; }\n    .m-calendar-year .list ul li {\n      display: table-cell;\n      height: 73px; }\n      .m-calendar-year .list ul li span {\n        box-sizing: border-box;\n        border-radius: 6px;\n        position: relative;\n        display: inline-block;\n        line-height: 72px;\n        height: 72px;\n        width: 72px; }\n        .m-calendar-year .list ul li span.active {\n          color: #2f95ea;\n          border: 1px solid #2f95ea; }\n          .m-calendar-year .list ul li span.active:after {\n            content: \"\";\n            width: 8px;\n            height: 8px;\n            background: #2f95ea;\n            position: absolute;\n            border-radius: 50%;\n            top: 50px;\n            right: 32px; }\n        .m-calendar-year .list ul li span.gray {\n          color: #999999; }\n        .m-calendar-year .list ul li span:hover {\n          background: #e2effa;\n          cursor: pointer; }\n\n@font-face {\n  font-family: \"iconfont\";\n  src: url(\"/font/iconfont.eot?t=1505787898067\");\n  /* IE9*/\n  src: url(\"/font/iconfont.eot?t=1505787898067#iefix\") format(\"embedded-opentype\"), url(\"/font/iconfont.ttf?t=1505787898067\") format(\"truetype\"), url(\"/font/iconfont.svg?t=1505787898067#iconfont\") format(\"svg\");\n  /* iOS 4.1- */ }\n\n.iconfont {\n  font-family: \"iconfont\" !important;\n  font-size: 16px;\n  font-style: normal;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n\n.icon-all:before {\n  content: \"\\E696\"; }\n\n.icon-back:before {\n  content: \"\\E697\"; }\n\n.icon-category:before {\n  content: \"\\E699\"; }\n\n.icon-close:before {\n  content: \"\\E69A\"; }\n\n.icon-comments:before {\n  content: \"\\E69B\"; }\n\n.icon-cry:before {\n  content: \"\\E69C\"; }\n\n.icon-delete:before {\n  content: \"\\E69D\"; }\n\n.icon-edit:before {\n  content: \"\\E69E\"; }\n\n.icon-email:before {\n  content: \"\\E69F\"; }\n\n.icon-favorite:before {\n  content: \"\\E6A0\"; }\n\n.icon-form:before {\n  content: \"\\E6A2\"; }\n\n.icon-help:before {\n  content: \"\\E6A3\"; }\n\n.icon-information:before {\n  content: \"\\E6A4\"; }\n\n.icon-less:before {\n  content: \"\\E6A5\"; }\n\n.icon-moreunfold:before {\n  content: \"\\E6A6\"; }\n\n.icon-more:before {\n  content: \"\\E6A7\"; }\n\n.icon-pic:before {\n  content: \"\\E6A8\"; }\n\n.icon-qrcode:before {\n  content: \"\\E6A9\"; }\n\n.icon-rfq:before {\n  content: \"\\E6AB\"; }\n\n.icon-search:before {\n  content: \"\\E6AC\"; }\n\n.icon-selected:before {\n  content: \"\\E6AD\"; }\n\n.icon-set:before {\n  content: \"\\E6AE\"; }\n\n.icon-smile:before {\n  content: \"\\E6AF\"; }\n\n.icon-success:before {\n  content: \"\\E6B1\"; }\n\n.icon-survey:before {\n  content: \"\\E6B2\"; }\n\n.icon-viewgallery:before {\n  content: \"\\E6B4\"; }\n\n.icon-viewlist:before {\n  content: \"\\E6B5\"; }\n\n.icon-warning:before {\n  content: \"\\E6B6\"; }\n\n.icon-wrong:before {\n  content: \"\\E6B7\"; }\n\n.icon-add:before {\n  content: \"\\E6B9\"; }\n\n.icon-remind:before {\n  content: \"\\E6BC\"; }\n\n.icon-box:before {\n  content: \"\\E6CB\"; }\n\n.icon-process:before {\n  content: \"\\E6CE\"; }\n\n.icon-electrical:before {\n  content: \"\\E6D4\"; }\n\n.icon-electronics:before {\n  content: \"\\E6DA\"; }\n\n.icon-gifts:before {\n  content: \"\\E6DB\"; }\n\n.icon-lights:before {\n  content: \"\\E6DE\"; }\n\n.icon-atmaway:before {\n  content: \"\\E6E9\"; }\n\n.icon-pin:before {\n  content: \"\\E6F2\"; }\n\n.icon-text:before {\n  content: \"\\E6FC\"; }\n\n.icon-move:before {\n  content: \"\\E6FD\"; }\n\n.icon-gerenzhongxin:before {\n  content: \"\\E70B\"; }\n\n.icon-operation:before {\n  content: \"\\E70E\"; }\n\n.icon-remind1:before {\n  content: \"\\E713\"; }\n\n.icon-map:before {\n  content: \"\\E715\"; }\n\n.icon-accountfilling:before {\n  content: \"\\E732\"; }\n\n.icon-libra:before {\n  content: \"\\E74C\"; }\n\n.icon-color:before {\n  content: \"\\E760\"; }\n\n.icon-favorites:before {\n  content: \"\\E7CE\"; }\n\n.icon-Calculator:before {\n  content: \"\\E812\"; }\n\n.icon-earth:before {\n  content: \"\\E828\"; }\n\n.mg-header {\n  height: 73px;\n  background-color: #6777fc;\n  color: #ffffff;\n  padding-left: 233px; }\n  .mg-header .logo {\n    width: 233px;\n    height: 73px;\n    display: inline-block;\n    text-align: center;\n    position: absolute;\n    left: 0; }\n    .mg-header .logo > .iconfont {\n      font-size: 46px;\n      color: #ffffff; }\n  .mg-header .opera {\n    height: 73px;\n    line-height: 73px;\n    overflow: hidden; }\n    .mg-header .opera > a {\n      width: auto;\n      padding: 0 20px;\n      height: 100%;\n      display: inline-block;\n      color: #ffffff;\n      font-size: 16px;\n      text-align: center;\n      float: left; }\n      .mg-header .opera > a:hover {\n        background-color: #2d3bb2; }\n      .mg-header .opera > a.selected {\n        background-color: #2d3bb2; }\n      .mg-header .opera > a .iconfont {\n        font-size: 24px;\n        padding-right: 8px; }\n\n.mg-main {\n  position: fixed;\n  top: 73px;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  padding-left: 243px; }\n  .mg-main > [class^=layout-] {\n    box-sizing: border-box;\n    height: 100%; }\n  .mg-main .layout-nav {\n    width: 233px;\n    position: absolute;\n    left: 0;\n    top: 0;\n    overflow: auto;\n    background-color: #3b4966; }\n  .mg-main .layout-content {\n    position: relative;\n    top: 10px; }\n", ""]);

// exports


/***/ },

/***/ 50:
/***/ function(module, exports, __webpack_require__) {

/**
 * 来自STK.js
 * 将json转化成查询字符串，第二个参数如果设置为true，则对值做encodeURIComponent编码
 * 例子：
 *
 * var jsonToQuery = require("../json/jsonToQuery");
 * var json = { id: 1, name: "benny" };
 * var query = jsonToQuery(json, true); // 生成一个字符串"id=1&name=benny"
 *
 */

var trim = __webpack_require__(6);
var format = function (val) {
    val = val == null ? "" : trim(val.toString());
    return encodeURIComponent(val);
};

module.exports = function (json) {
    var query = [];

    if (typeof json == "object") {
        for (var k in json) {
            if (k === '$nullName') {
                query = query.concat(json[k]);
                continue;
            }
            if (json[k] instanceof Array) {
                for (var i = 0, len = json[k].length; i < len; i++) {
                    query.push(k + "=" + format(json[k][i]));
                }
            } else {
                if (typeof json[k] != 'function') {
                    query.push(k + "=" + format(json[k]));
                }
            }
        }
    }

    if (query.length) {
        return query.join("&");
    } else {
        return "";
    }
};

/***/ },

/***/ 52:
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(35);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(10)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(35, function() {
			var newContent = __webpack_require__(35);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },

/***/ 59:
/***/ function(module, exports) {

module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<header class="mg-header">\r\n	<a href="#/pc.html" class="logo"><i class="iconfont  icon-libra"></i></a>\r\n	<nav class="opera">\r\n		';
 moduleList.forEach(function(item) { ;
__p += '\r\n		    <a node-name="item" data-id="' +
((__t = (item.id)) == null ? '' : __t) +
'" title=\'' +
((__t = (item.description)) == null ? '' : __t) +
'\' data-query="id=' +
((__t = (item.id)) == null ? '' : __t) +
'&text=' +
((__t = (item.text)) == null ? '' : __t) +
'&code=' +
((__t = (item.code)) == null ? '' : __t) +
'&home=' +
((__t = (item.home)) == null ? '' : __t) +
'" href="#/' +
((__t = (item.code)) == null ? '' : __t) +
'' +
((__t = (item.home)) == null ? '' : __t) +
'"><i class="iconfont icon-' +
((__t = (item.flag)) == null ? '' : __t) +
'"></i>' +
((__t = (item.text)) == null ? '' : __t) +
'</a>\r\n		    ';
 }) ;
__p += '\r\n	</nav>\r\n</header>\r\n<main class=\'mg-main\'>\r\n	<div class=\'layout-nav\'>\r\n	</div>\r\n    <div class="layout-content">\r\n        <section class="mg-tab"></section>\r\n        <section class="mg-frames" id=\'m-frames\'></section>\r\n    </div>\r\n</main>';

}
return __p
}

/***/ },

/***/ 66:
/***/ function(module, exports) {

module.exports = {"code":0,"msg":"","data":[{"code":"test1","description":"排期接入、影院、影片、影厅管理、渠道管理、日志管理、短信模板","flag":"box","home":"/defaultPage/index","id":"756310746060554240","related":0,"text":"基础模块"},{"code":"test2","description":"排期接入、影院、影片、影厅管理、渠道管理、日志管理、短信模板","flag":"search","home":"/defaultPage/index","id":"756310746060554240","related":0,"text":"基础影厅管理模块"}]}

/***/ },

/***/ 68:
/***/ function(module, exports, __webpack_require__) {

/**
 * 实现ajax功能，注意主动调用abort跟断网时请求被中断是完全一样的。
 *
 * 例子：
 *
 * var ajax = require("../io/ajax");
 * ajax({
 *     url: "/api/api.jsp",
 *     timeout: 30000, // 缺少值3秒,
 *     data: { id: 1 }, // 仅method=post时生效，如果传入json对象会被转换成queryString，如果传入字符串则会原样发送
 *     method: "post", // 默认是get
 *     type: "json", // 默认是json
 *     onSuccess: function(jsonObject) { console.log(jsonObject); },
 *     onError: function(xmlHttp) { }, // 当访问出错，比如网络连接不上、解析内容失败时触发，超时也会触发
 *     onTimeout: function(xmlHttp) { }, // 超时触发
 *     onAbort: function() { } // 网络中断时触发
 * });
 *
 */

var getXMLHttpRequest = __webpack_require__(89);
var merge = __webpack_require__(4);
var jsonToQuery = __webpack_require__(50);
var appendQuery = __webpack_require__(90);
var console = __webpack_require__(2);

module.exports = function (opts) {
    var xmlHttp = getXMLHttpRequest();
    var tid = 0;

    opts = merge({
        "url": "",
        "timeout": 30 * 1000,
        "data": {},
        "onSuccess": function () {},
        "onError": function () {},
        "onTimeout": function () {},
        "onAbort": function () {},
        "method": "get",
        "type": "json" // "text/json/xml"
    }, opts);

    opts.method = opts.method.toLocaleLowerCase() == "get" ? "get" : "post";

    if (opts["method"] == "get" && opts["data"]) {
        opts["url"] = appendQuery(opts["url"], opts["data"]);
    }

    var callback = function () {
        if (xmlHttp.readyState == 4) {
            clearTimeout(tid);
            var data = "";
            tid = 0;

            if (opts["type"] == "xml") {
                data = xmlHttp.responseXML;
            } else if (opts["type"] == "text") {
                data = xmlHttp.responseText;
            } else {
                if (xmlHttp.responseText != null && typeof xmlHttp.responseText == "string") {
                    try {
                        data = JSON.parse(xmlHttp.responseText);
                    } catch (ex) {
                        data = {};
                        console.error(ex);
                    }
                } else {
                    data = {};
                }
            }

            if (xmlHttp.status == 200) {
                try {
                    opts.onSuccess(data);
                } catch (ex) {
                    console.error(ex);
                }
            } else if (xmlHttp.status == 0) {
                try {
                    opts.onAbort(xmlHttp); // 中断或断网
                } catch (ex) {
                    console.error(ex);
                }

                try {
                    opts.onError(xmlHttp);
                } catch (ex) {
                    console.error(ex);
                }
            } else {
                try {
                    console.error("请求[" + opts["url"] + "]失败，状态码为" + xmlHttp.status);
                    opts.onError(xmlHttp);
                } catch (ex) {
                    console.error(ex);
                }
            }
        }
    };

    xmlHttp.onreadystatechange = callback;
    // xmlHttp.timeout = opts["timeout"]; //IE不支持！
    xmlHttp.open(opts.method, opts.url, true);

    try {
        xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlHttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    } catch (ex) {}

    xmlHttp.send(opts.method == "get" ? null : typeof opts["data"] == "string" ? opts["data"] : jsonToQuery(opts["data"]));

    tid = setTimeout(function () {
        tid = 0;
        xmlHttp.abort();

        try {
            opts.onError(xmlHttp);
            opts.onTimeout(xmlHttp);
        } catch (ex) {
            console.error(ex);
        }
    }, opts.timeout);

    return xmlHttp;
};

/***/ },

/***/ 75:
/***/ function(module, exports, __webpack_require__) {

var addEvent = __webpack_require__(7);
var base = __webpack_require__(3);
var that = module.exports = base();
var defaultUrl = '/pc.html';

var parseHash = function () {
	var hash = location.hash.substr(1);

	// if(hash == '') {
	// 	location.href = defaultUrl;
	// 	return
	// }

	var array = hash.split('?');
	that.fire('change', array);
	// body...
};

that.start = function () {
	parseHash();
	addEvent(window, 'hashchange', parseHash);
};

/***/ },

/***/ 89:
/***/ function(module, exports, __webpack_require__) {

/**
 * 获取AJAX请求对象，本文件是提供给ajax.js使用，一般不需要使用它
 */

var console = __webpack_require__(2);

module.exports = function () {
    var xmlhttp = null;

    if ("XMLHttpRequest" in window) {
        xmlhttp = new XMLHttpRequest();
    } else {
        try {
            xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (ex) {
            try {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (ex) {
                console.error("无法创建XMLHttpRequest对象");
            }
        }
    }

    return xmlhttp;
};

/***/ },

/***/ 90:
/***/ function(module, exports, __webpack_require__) {

/**
 * 将一组查询字符串智能拼到url中去
 * 增加传入一个对象的功能
 * 例子：
 *
 * var appendQuery = require("../str/appendQuery");
 * var url = appendQuery("a.html?abc=1", "a=1&b=2"); // a.html?abc=1&a=1&b=2
 * url = appendQuery("a.html", "a=1&b=2"); // a.html?a=1&b=2
 * url = appendQuery("a.html", { "a": 1, "b": 2 }); // a.html?a=1&b=2
 *
 **/
var getType = __webpack_require__(1);
var jsonToQuery = __webpack_require__(50);

module.exports = function (url, queryString) {
  queryString = getType(queryString) == "string" ? queryString : jsonToQuery(queryString);
  return url + (url.indexOf("?") == -1 ? "?" : "&") + queryString;
};

/***/ }

})