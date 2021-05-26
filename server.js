const express = require("express");
const app = express();
const modes = {
  dev: { name: "development", port: 3001, root: "./src" },
  stg: { name: "staging", port: 3002, root: "./build" },
  prod: { name: "production", port: 3003, root: "./dist" },
};

const mode = modes[`${process.argv[2]}`.replace(/^--/, "")] ?? modes.dev;

app.use(express.static(mode.root));

app.listen(mode.port, () => {
  console.log(`App mode: ${mode.name} listening at http://localhost:${mode.port}`);
});
