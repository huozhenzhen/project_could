webpackHotUpdate(0,{

/***/ 71:
/***/ function(module, exports) {

module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<header class="mg-header" id=\'m-header\'>\r\n	<a href="#/test1/defaultPage/index" class="logo"><i class="iconfont  icon-libra"></i></a>\r\n	<nav class="opera" nodo-name=\'opera\'>\r\n		';
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
__p += '\r\n	</nav>\r\n</header>\r\n<main class=\'mg-main\'>\r\n	<div class=\'layout-nav\'>\r\n		<menu class="mg-left-nav" id="m-left-nav"></menu>\r\n	</div>\r\n    <div class="layout-content">\r\n        <section class="mg-tab"></section>\r\n        <section class="mg-frames" id=\'m-frames\'></section>\r\n    </div>\r\n</main>';

}
return __p
}

/***/ }

})