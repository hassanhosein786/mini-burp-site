import * as cheerio from "cheerio";
import { Page } from "../../models/Page.js";
import { parseSetCookieHeaders } from "../../utils/cookies.js";
import { extractForms } from "../../utils/forms.js";
import { isAllowedUrl, normalizeUrl, shouldSkipUrl } from "../../utils/url.js";
import { httpClient } from "./httpClient.js";
import { runCookieChecks } from "./checks/cookieChecks.js";
import { runFormChecks } from "./checks/formChecks.js";
import { runHeaderChecks } from "./checks/headerChecks.js";
import { runReflectedInputCheck } from "./checks/reflectedInputCheck.js";

const extractLinks = ($, pageUrl, allowedHost) => {
  const links = $("a[href]")
    .map((_, anchor) => normalizeUrl($(anchor).attr("href"), pageUrl))
    .get()
    .filter(Boolean)
    .filter((url) => isAllowedUrl(url, allowedHost))
    .filter((url) => !shouldSkipUrl(url));

  return [...new Set(links)];
};

export const crawlSite = async ({ scan }) => {
  const queue = [{ url: scan.baseUrl, depth: 0 }];
  const visited = new Set();
  const pages = [];

  while (queue.length && pages.length < scan.config.maxPages) {
    const current = queue.shift();

    if (!current || visited.has(current.url) || current.depth > scan.config.maxDepth) {
      continue;
    }

    visited.add(current.url);

    try {
      const response = await httpClient.get(current.url);
      const contentType = String(response.headers["content-type"] || "");
      const isHtml = contentType.includes("text/html");
      let links = [];
      let forms = [];

      if (isHtml && typeof response.data === "string") {
        const $ = cheerio.load(response.data);
        links = extractLinks($, current.url, scan.allowedHost);
        forms = extractForms($, current.url).filter(
          (form) => isAllowedUrl(form.action, scan.allowedHost) && !shouldSkipUrl(form.action)
        );
      }

      const cookies = parseSetCookieHeaders(response.headers["set-cookie"]);

      const page = await Page.findOneAndUpdate(
        { scanId: scan._id, url: current.url },
        {
          scanId: scan._id,
          url: current.url,
          statusCode: response.status,
          headers: Object.fromEntries(
            Object.entries(response.headers).map(([key, value]) => [key, Array.isArray(value) ? value.join(", ") : String(value)])
          ),
          links,
          forms,
          cookies
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      pages.push(page);

      await runHeaderChecks({
        scanId: scan._id,
        pageUrl: current.url,
        headers: response.headers,
        baseUrl: scan.baseUrl
      });
      await runCookieChecks({ scanId: scan._id, pageUrl: current.url, cookies });
      await runFormChecks({ scanId: scan._id, pageUrl: current.url, forms });

      if (scan.config.activeChecks) {
        await runReflectedInputCheck({ scanId: scan._id, pageUrl: current.url, forms });
      }

      for (const link of links) {
        if (!visited.has(link) && queue.length < scan.config.maxPages * 3) {
          queue.push({ url: link, depth: current.depth + 1 });
        }
      }
    } catch {
      await Page.findOneAndUpdate(
        { scanId: scan._id, url: current.url },
        {
          scanId: scan._id,
          url: current.url,
          statusCode: 0,
          headers: {},
          links: [],
          forms: [],
          cookies: []
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
  }

  return pages;
};
