const SvgParser = require("../parser");

describe("Parser reader", () => {
  describe("parse", () => {
    it("should return a serializable structure", () => {
      const data = "<svg><path /></svg>";
      const parser = new SvgParser(data);

      const act = parser.parse();

      expect(act[0].tag).toBe("svg");
      expect(act[0].parent).toBe(null);
      expect(act[1].tag).toBe("path");
      expect(act[1].parent).toBe(act[0].id);
      expect(act.length).toBe(2);
    });

    it("should extract elements attributes", () => {
      const data =
        '<svg id="Capa_1" enable-background="new 0 0 511.73 511.73" height="512" viewBox="0 0 511.73 511.73" width="512" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="m309.291 504.23h-106.553c-4.418 0-8-3.582-8-8v-41.447c0-4.418 3.582-8 8-8h106.553c4.418 0 8 3.582 8 8v41.447c0 4.419-3.581 8-8 8z" fill="#8d9ca8" />' +
        "</svg>";
      const parser = new SvgParser(data);

      const act = parser.parse();

      expect(act.length).toBe(2);
      expect(act[0].attributes.id).toBe("Capa_1");
      expect(act[0].attributes["enable-background"]).toBe("new 0 0 511.73 511.73");
      expect(act[1].attributes.d).toBe(
        "m309.291 504.23h-106.553c-4.418 0-8-3.582-8-8v-41.447c0-4.418 3.582-8 8-8h106.553c4.418 0 8 3.582 8 8v41.447c0 4.419-3.581 8-8 8z"
      );
      expect(act[1].attributes["fill"]).toBe("#8d9ca8");
    });
  });

  describe("minify", () => {

  });
});
