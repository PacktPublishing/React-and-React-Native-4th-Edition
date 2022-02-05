import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import express from "express";

import App from "./App";

const app = express();

app.get("/*", (req, res) => {
  const html = renderToString(
    <StaticRouter location={req.url}>
      <App />
    </StaticRouter>
  );
  res.write(`
      <!doctype html>
      <div id="app">${html}</div>
    `);
  res.end();
});

app.listen(8080, () => {
  console.log("Listening on 127.0.0.1:8080");
});
