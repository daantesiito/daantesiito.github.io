"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  getData: () => getData
});
module.exports = __toCommonJS(src_exports);

// src/functions.ts
var import_playwright = require("playwright");
async function getMatches(browser) {
  const page = await browser.newPage();
  await page.goto("https://www.pelotalibretv.com/agenda.html");
  await page.waitForSelector('div[id="wraper"]');
  const results = await page.evaluate(() => {
    const matches = [];
    const links = [];
    document.querySelectorAll('ul[class="menu"] li ul li a').forEach((a, index) => {
      links.push(a.href);
    });
    document.querySelectorAll('ul[class="menu"] li').forEach((li, index) => {
      if (!li.innerText.includes("0p")) {
        matches.push({
          id: index,
          title: li.innerText,
          url: links[index]
        });
      }
    });
    return matches;
  });
  return results;
}
async function getLink(url, browser) {
  const page = await browser.newPage();
  if (url.url === void 0) {
    return "no link yet";
  } else {
    await page.goto(url.url);
  }
  await page.waitForSelector('div[class="container"]');
  const results = await page.evaluate(() => {
    const iframeElement = document.querySelector('div[class="embed-responsive embed-responsive-16by9"] iframe');
    return iframeElement ? iframeElement.outerHTML : "";
  });
  return results;
}
async function getData() {
  const browser = await import_playwright.chromium.launch();
  const matches = await getMatches(browser);
  let links = [];
  for await (const match of matches) {
    const contenido = await getLink(match, browser);
    links.push({
      id: match.id,
      title: match.title,
      iframe: contenido
    });
  }
  await browser.close();
  return links;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getData
});
