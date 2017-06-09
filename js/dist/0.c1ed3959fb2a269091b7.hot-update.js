webpackHotUpdate(0,{

/***/ 40:
/***/ function(module, exports, __webpack_require__) {

var matches = __webpack_require__(44);
var contains = __webpack_require__(25);

module.exports = function (node, selector, box) {
    var result = null;
    box = box || document.body;

    if (node.closest) {
        result = node.closest(selector);

        if (result) if (!contains(box, result)) {
            return null;
        }
    }

    while (node && node != box && node.nodeType == 1) {
        if (matches(node, selector)) {
            return node;
        }

        node = node.parentNode;
    }

    return null;
};

/***/ },

/***/ 42:
/***/ function(module, exports, __webpack_require__) {

/**
 * 获取节点在父节点中的位置（仅限于element）
 */
var isElement = __webpack_require__(8);

module.exports = function (element, nodeList) {
    var at = 0;
    var childNodes = nodeList || element.parentNode.childNodes;

    for (var i = 0; i < childNodes.length; i++) {
        if (element == childNodes[i]) {
            return at;
        }

        if (isElement(childNodes[i])) {
            at++;
        }
    }

    return -1;
};

/***/ },

/***/ 44:
/***/ function(module, exports, __webpack_require__) {

/**
 * 判断当前节点是否匹配查询规则
 */
var sizzle = __webpack_require__(4);
var index = __webpack_require__(42);

module.exports = function (node, selector) {
    if (node.nodeType != 1) {
        return false;
    }

    var p = HTMLElement.prototype;
    var f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function (s) {
        return index(this, sizzle(s)) != -1;
    };

    return f.call(node, selector);
};

/***/ }

})