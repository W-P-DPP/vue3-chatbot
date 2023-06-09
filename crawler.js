/** @format */

const axios = require("axios");
const cheerio = require("cheerio");
const turndown = require("turndown");
const fs = require("fs");
const axiosInstance = axios.create();
const turndownService = new turndown();

async function getDocs() {
  const res = await axiosInstance.get("https://cn.vuejs.org/guide/introduction.html");
  const $ = cheerio.load(res.data);
  const alist = Array.prototype.map.call($(".VPSidebar #VPSidebarNav .group a"), (item) => {
    return {
      url: encodeURI("https://cn.vuejs.org" + $(item).attr("href")),
      name: $(item).text(),
    };
  });
  const docHtml = await getHtml(alist);
  //   console.log(docHtml);
  write2file(docHtml);
}

function write2file(html) {
  const markdown = turndownService.turndown(html);
  fs.writeFileSync(`markdown.md`, markdown, "utf-8", (err) => {
    err && console.log(err);
  });
}

async function getHtml(alist) {
  let docHtml = "";
  await Promise.resolve().then(async () => {
    for (const element of alist) {
      const docRes = await axiosInstance.get(element.url);
      const $doc = cheerio.load(docRes.data);
      docHtml += $doc(".container .content .guide").html();
    }
  });
  return docHtml;
}

getDocs();
