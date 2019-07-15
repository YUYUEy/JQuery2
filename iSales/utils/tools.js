/*
 * @Author: tim
 * @LastEditors: tim
 * @Description: 常用操作
 * @Date: 2019-03-12 20:53:38
 * @LastEditTime: 2019-06-28 10:37:30
 */

/**
 * 查找最近的祖先元素
 * @param {*} el         相对元素
 * @param {*} selector  要查找的祖先元素选择器
 */ 
export function closest(el, selector) {
  let matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
  let isFind = false

  while (el) {
    el = el.parentElement;
    if (matchesSelector.call(el, selector)) {
      isFind = true
      break;
    }
  }
  return isFind ? el : null;
}

/**
 * 简单复制对象
 * @param obj 原对象
 * @returns {any} 新对象
 */
export function copyObject(obj) {
  return JSON.parse(JSON.stringify(obj))
}
