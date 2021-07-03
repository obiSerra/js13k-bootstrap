export function qSel(sel, queryAll = false, root = document) {
  return queryAll ? root.querySelectorAll(sel) : root.querySelector(sel);
}
export function on(eventName, cb, root = document) {
  root.addEventListener(eventName, cb)
}