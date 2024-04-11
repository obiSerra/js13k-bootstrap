(() => {
  "use strict";

  class SvgReader {
    _parse(nodes) {
      if (!nodes.length) return this.structure;
      const n = nodes.splice(0, 1)[0];
      this.structure[n["id"]] = n;
      return this._parse(nodes)
    }

    readMinified(mini) {
      
      const nodes = mini.split(">").map(n => {
        const [id, parent, tag, attrs] = n.split("|");
        return { id, parent, tag, attrs, children: [] };
      });
      this.structure = {};

      this._parse(nodes);

      Object.values(this.structure).forEach(n => this.structure[n['parent']]?.children?.push(n['id']))

      return this.structure;
    }

    _dumpLevel() {

      if (!this?.currentNode?.visited) {
        this.currentNode.visited = true;
        this.currentNode.selfClosing = !this.currentNode.children
        const tag = `<${this?.currentNode?.tag ?? ""} ${this?.currentNode?.attrs}${this.currentNode.selfClosing ? " /" : ""}>`;
        this.svg += tag
      }
      
      if (!this.currentNode.children.length) {

        if (!this.currentNode.selfClosing) {
          this.svg += `</${this.currentNode.tag}>`;
        }

        this.currentNode = this.structure[this.currentNode.parent] ?? null;

        if (!this.currentNode) {
          return this.svg;
        } else {
          return this._dumpLevel();
        }
      }

      this.currentNode = this.structure[this.currentNode.children.splice(0, 1)]

      return this._dumpLevel();
    }

    toSvg() {
      this._unDumpedStructure = this.structure;
      

      this.currentNode = Object.values(this._unDumpedStructure)[0];
      this.svg = "";
      return this._dumpLevel();
    }
  }
  module.exports = SvgReader;
})();
