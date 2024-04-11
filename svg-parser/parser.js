(() => {
  "use strict";

  class SvgParser {
    constructor(svg) {
      this.originalSvg = this.svg = svg;
      this.currentNode = null;
      this.steps = 0;
      this.structure = [{ parent: null, children: [], id: 0 }];
    }

    _parseAttributes(node) {
      const attributeStr = node.match(/<\/?[a-z]*\s?(.*)\s?\/?>/)[1] ?? "";
      const attributes = attributeStr.match(/([A-z_-]*\=('|")[A-z-. 0-9:\/#]*('|"))/gi);
      if (!attributes) return null;

      return attributes.reduce((acc, row) => {
        const [k, v] = row.split("=");
        acc[k] = v.replace(/('|")/g, "");
        return acc;
      }, {});
    }

    _parseLevel() {
      const openTagPos = this.svg.search(/</);
      const closeTagPos = this.svg.search(/>/) + 1;
      const fullTag = this.svg.slice(openTagPos, closeTagPos);
      this.svg = this.svg.slice(closeTagPos);

      if (!this.currentNode) this.currentNode = this.structure[0];
      this.steps++;

      const tagMatch = fullTag.match(/<\/?([a-z]*)\s?.*/) ?? [];
      const tag = tagMatch[1] ?? null;
      if (!tag) console.log("Tag not parsed!!!!", fullTag);

      const n = {
        id: this.steps,
        fullTag,
        tag,
        children: [],
        attributes: [],
        parent: this.currentNode,
      };

      if (fullTag.match(/<\/.*/)) {
        //closing
        this.currentNode.closing = true;
        this.currentNode = this.currentNode.parent;
      } else if (fullTag.match(/<.*\/>/)) {
        // self closing
        n.selfClosing = true;
        n.attributes = this._parseAttributes(fullTag);
        this.currentNode.children.push(n);

        this.structure.push(n);
      } else {
        // opening

        n.attributes = this._parseAttributes(fullTag);

        //if (n.tag !== "g" || Object.values(n.attributes ?? []).length) {
          this.structure.push(n);
          this.currentNode.children.push(n);
          this.currentNode = n;
        //}
      }

      if (this.svg.length === 0) {
        this.structure = this.structure.splice(1);
        return this._serializableStructure();
      } else {
        return this._parseLevel();
      }
    }

    _serializableStructure() {
      return this.structure.map(n => ({
        ...n,
        parent: !!n?.parent?.id ? n.parent.id : null,
        children: n.children.map(c => c.id),
      }));
    }

    parse() {
      return this._parseLevel();
    }

    minify() {
      if (!this.structure) return "";
      return this.structure
        .map(n => {
          const attributes = Object.keys(n?.attributes ?? {})
            .map(k => `${k}="${n.attributes[k]}"`)
            .join(" ");
          return `${n.id}|${n.parent.id ?? ""}|${n.tag}|${attributes}`;
        })
        .join(">");
    }
  }

  module.exports = SvgParser;
})();
