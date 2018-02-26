webpackHotUpdate(0,{

/***/ 103:
/***/ function(module, exports) {

module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

menu.forEach(function(item){;
__p += '\r\n	<div>\r\n		<a href="#' +
((__t = (item.uri)) == null ? '' : __t) +
'">' +
((__t = (item.text)) == null ? '' : __t) +
'</a>\r\n	</div>\r\n';
});
__p += '\r\n';

}
return __p
}

/***/ }

})