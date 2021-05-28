export function qSel(sel, queryAll = false, root = document) {
  return queryAll ? root.querySelectorAll(sel) : root.querySelector(sel);
}
