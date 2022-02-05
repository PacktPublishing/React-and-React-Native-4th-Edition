import * as React from "react";
import ReactDOM from "react-dom/server";
import express from "express";
import App from "./App";

const doc = (content) =>
  `
  <!doctype html>
  <html>
    <head>
      <title>Rendering to strings</title>
    </head>
    <body>
      <div id="app">${content}</div>
    </body>
  </html>
  `;

const app = express();

app.get("/", (req, res) => {
  const props = { items: ["One", "Two", "Three"] };
  const rendered = ReactDOM.renderToString(<App {...props} />);

  res.send(doc(rendered));
});

app.listen(8080, () => {
  console.log("Listening on 127.0.0.1:8080");
});
