const { series, src, dest, watch } = require("gulp");
const concat = require("gulp-concat");
const clean = require("gulp-clean");
const eslint = require("gulp-eslint");
const minify = require("gulp-minify");
const through = require("through2");
const Vinyl = require("vinyl");
var svgmin = require("gulp-svgmin");

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

function compressSVG(cb) {
  const images = {};
  src("./assets/**/*.svg")
    .pipe(svgmin())
    .pipe(
      through.obj((file, enc, cb) => {
        const key = file.path.replace(/^.*\/assets\//, "").replace(/\.svg$/, "");

        const content = file.contents.toString(enc);
        if (!images[key]) {
          images[key] = "";
        }
        images[key] += content;
        cb(null, file);
      })
    )
    .pipe(
      through.obj((chunk, enc, cb) => {
        const jsFile = new Vinyl({
          cwd: chunk.cwd,
          base: chunk.cwd + "/src",
          path: chunk.cwd + "/src/svg_map.js",
          contents: Buffer.from(`export default function svg_images(){\n return ${JSON.stringify(images)} \n}`),
        });
        cb(null, jsFile);
      })
    )
    .pipe(dest("./src/"));
  // return Promise.all()
  // new Promise((resolve, reject) => {
  //   fs.readFile("./assets/maple-syrup.svg", "utf8", (err, data) => {
  //     if (err) {
  //       console.error(err);
  //       return;
  //     }
  //     console.log(data)
  //     resolve()
  //   });
  // })
  cb();
}

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

const build = series(cleanBuildTask, concatTask, removeModules, /*lintConcat,*/ copyIndex);

function watchAndBuild(cb) {
  watch([codeSrc, indexFile], build);
}

const dist = series(build, cleanDistTask, compress);
exports.build = build;
exports.dist = dist;
exports.watchAndBuild = watchAndBuild;
exports.compressSVG = compressSVG;
exports.default = series(clean, build);
