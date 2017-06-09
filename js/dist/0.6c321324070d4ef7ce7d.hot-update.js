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

        if (!contains(box, result)) {
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

/***/ }

})