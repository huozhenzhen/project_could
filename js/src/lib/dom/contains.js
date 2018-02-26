/**
 * 判断节点是否为另一个节点的父元素（如果两者是同一个元素，返回假）
 * 例子：
 * var contains = require("../dom/contains");
 * console.log(contains(parentNode, node));
 **/
module.exports = function(parent, node) {
    if (parent === node) {
        return false;
    } else if (parent.compareDocumentPosition) {
        return ((parent.compareDocumentPosition(node) & 16) === 16);
    } else if (parent.contains && node.nodeType === 1) {
        return parent.contains(node);
    } else {
        while (node = node.parentNode) {
            if (parent === node) {
                return true;
            }
        }
    }

    return false;
};
/*
   compareDocumentPosition 与 contains 这里主要为了做兼容


   compareDocumentPosition 比较强大 如下：
    
   Bits Number  Meaning
   000000   0   元素一致
   000001   1   节点在不同的文档（或者一个在文档之外）
   000010   2   节点 B 在节点 A 之前
   000100   4   节点 A 在节点 B 之前
   001000   8   节点 B 包含节点 A
   010000   16  节点 A 包含节点 B
   100000   32  浏览器的私有使用 


 */