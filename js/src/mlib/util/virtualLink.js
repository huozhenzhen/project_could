/**
 * 虚拟链接，含有指定属性的节点可代替a链接
 * 需重写!
 *
 * var virtualLink = require("../util/virtualLink");
 * var link = virtualLink("data-href", container);
 * 含有data-href的即为a链接;
 * container可不传，默认为body节点，container也可传选择器，默认选择第一个含有该选择器的节点.
 *
 * 注：拨打电话的链接和a链接一样，写法是"data-href='tel:xxxx'"
 */
var touch = require("../evt/touch");
var closest = require("../dom/closest");
var getType = require("../util/getType");
var isElement = require("../dom/isElement");
var queryToJson = require("../json/queryToJson");

module.exports = function(callback, opts) {
    opts = opts || {};
    var attr = opts["attr"] || "data-href";
    var queryAttr = opts["queryAttr"] || "data-query";
    var container = opts["container"] || document.body;
    var selector = '[' + attr + "]";
    container = getType(container) == "string" ? document.querySelector(container) : container;
    container = !isElement(container) ? document.body : container;
    if (getType(callback) != "function") return;

    touch.on(container, "tap", selector, function(ev) {
        var target = closest(ev.target, selector, container);
        if (!isElement(target)) return;
        var query = target.hasAttribute("data-query");
        query = query && query.length > 0 ? queryToJson(query) : {};

        try {
            callback({
                target: target,
                event: ev.originEvent,
                touchEvent: ev,
                query: query
            });
        }catch(ex) {
            console.error(ex);
        }
    });
}