/** @format */

import express from "express";
import { callChain } from "./chat.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static("gpt-web"));
app.post("/docs", async (req, res) => {
  console.log(req.body);
  // res.send(req.body);
  try {
    const result = await callChain(req.body.content, req.body.history);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "服务器错误", data: error });
  }
});

app.listen(5555, () => {
  console.log("http://127.0.0.1:5555");
});
