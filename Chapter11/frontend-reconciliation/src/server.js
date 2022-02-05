import fs from "fs";
import React from "react";
import { renderToString } from "react-dom/server";
import express from "express";
import App from "./App";

const app = express();
const doc = fs.readFileSync("./build/index.html");

app.use(express.static("./build", { index: false }));

app.get("/*", (req, res) => {
  const context = {};
  const html = renderToString(<App />);

  if (context.url) {
    res.writeHead(301, {
      Location: context.url
    });
    res.end();
  } else {
    res.write(
      doc.toString().replace('<div id="root">', `<div id="root">${html}`)
    );
    res.end();
  }
});

app.listen(8080, () => {
  console.log("Listening on 127.0.0.1:8080");
});
