(async () => {
  "use strict";

  const SvgParser = require("./parser.js");
  const SvgReader = require("./reader.js");
  const fs = require("fs");

  const img = "./images/rocket.svg";
  const imgOut = "./images/rocket-out.svg";
  const structureOut = "./images/rocket-out.js";

  const data = await new Promise((resolve, reject) =>
    fs.readFile(img, "utf8", (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    })
  );
  
  const parser = new SvgParser(data);

  const dataStructure = parser.parse();

  const mini = parser.minify();
  await new Promise((resolve, reject) =>
    fs.writeFile(structureOut, JSON.stringify(mini), err => {
      if (err) return reject(err);
      return resolve();
    })
  );

  const miniRead = await new Promise((resolve, reject) =>
    fs.readFile(structureOut, "utf8", (err, data) => {
      if (err) return reject(err);
      return resolve(JSON.parse(data));
    })
  );

  const reader = new SvgReader();
  reader.readMinified(miniRead);

  const svg = reader.toSvg();

  fs.writeFile(imgOut, svg, () => console.log("DOOONE"));
})();
