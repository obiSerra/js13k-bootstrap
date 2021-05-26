const { series, src, dest } = require("gulp");
const concat = require("gulp-concat");
const clean = require("gulp-clean");

const fs = require("fs");

const codeSrc = "./src/**/*.js";
const indexFile = "./src/index.html";
const outDir = "./build";
const outIndex = `${outDir}/index.html`;
const cleanDest = `${outDir}/*.js`;
const outFile = "main.js";
const concatFile = `${outDir}/${outFile}`;

function cleanTask() {
  return src(cleanDest).pipe(clean({ read: false, force: true }));
}

function copyIndex(cb) {
    fs.readFile(indexFile, "utf8", (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        
        fs.writeFile(outIndex, data, (err) => {
          if (err) return console.log(err);
          cb();
        });
      });
}

function removeModules(cb) {
  fs.readFile(concatFile, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const cleaned = data.replace(/^export (default )?/mg, "").replace(/^import .*/mg, "").split('\n').filter(l => !!l).join('\n')
    fs.writeFile(concatFile, cleaned, (err) => {
      if (err) return console.log(err);
      cb();
    });
  });
}

function concatTask() {
  return src(codeSrc).pipe(concat(outFile)).pipe(dest(outDir));
}

const build = series(cleanTask, concatTask, removeModules, copyIndex);
exports.build = build;
exports.default = series(clean, build);
