var matches = require("./matches");

module.exports = function(node, selector, box) {
    var result = null;
    box = box || document.body;

    if (node.closest) {
        return node.closest(selector);
    }

    while(node && node != box && node.nodeType == 1) {
        if (matches(node, selector)) {
            return node;
        }

        node = node.parentNode;
    }

    return null;
}