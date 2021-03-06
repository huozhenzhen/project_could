var console = require("../io/console");
var sizzle = require("./sizzle");
module.exports = function() {
    //类数组的转化
    var list = Array.prototype.slice.call(sizzle("[id]"), 0);
    var reg = /^m(\-[a-z][a-z0-9]+)+$/i;
    var nodeList = {};

    list.forEach(function(el) {
        if (!reg.test(el.id)) {
            console.warn("节点#" + el.id + "的id值不符合规范，被忽略!");
            return;
        }

        var id = el.id.substr(2).toLowerCase().replace(/\-([a-z])/g, function(m, n) {
            return n.toUpperCase();
        });

        nodeList[id] = el;
    });

    return nodeList;
}