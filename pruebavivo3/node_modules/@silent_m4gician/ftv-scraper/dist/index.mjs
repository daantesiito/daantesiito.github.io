// src/functions.ts
import { chromium } from "playwright";
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
  const browser = await chromium.launch();
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
export {
  getData
};
