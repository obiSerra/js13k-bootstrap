const { series, src, dest } = require("gulp");
const concat = require("gulp-concat");
const clean = require("gulp-clean");
const eslint = require("gulp-eslint");
const minify = require("gulp-minify");

const fs = require("fs");

const codeSrc = "./src/**/*.js";
const indexFile = "./src/index.html";
const outBuild = "./build";
const outDist = "./dist";
const outBuildIndex = `${outBuild}/index.html`;
const buildJsFiles = `${outBuild}/*.js`;
const buildClean = `${outBuild}/*`;
const distJsFiles = `${outDist}/*.js`;
const distClean = `${outDist}/*`;
const outFile = "main.js";
const concatFile = `${outBuild}/${outFile}`;

function cleanBuildTask() {
  return src(buildClean).pipe(clean({ read: false, force: true }));
}

function cleanDistTask() {
  return src(distClean).pipe(clean({ read: false, force: true }));
}

function lintConcat() {
  return src([buildJsFiles])
    .pipe(eslint({ rules: {} }))
    .pipe(eslint.formatEach())
    .pipe(eslint.failAfterError());
}

function compress() {
  return src([buildJsFiles])
    .pipe(
      minify({
        ext: {
          min: ".min.js",
        },
      })
    )
    .pipe(dest(outDist));
}

function copyIndex(cb) {
  fs.readFile(indexFile, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    fs.writeFile(outBuildIndex, data, err => {
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
    const cleaned = data
      .replace(/^export (default )?/gm, "")
      .replace(/^import .*/gm, "")
      .split("\n")
      .filter(l => !!l)
      .join("\n");
    fs.writeFile(concatFile, cleaned, err => {
      if (err) return console.log(err);
      cb();
    });
  });
}

function concatTask() {
  return src(codeSrc).pipe(concat(outFile)).pipe(dest(outBuild));
}

const build = series(cleanBuildTask, concatTask, removeModules, lintConcat, copyIndex);
const dist = series(build, cleanDistTask, compress);
exports.build = build;
exports.dist = dist;
exports.default = series(clean, build);
