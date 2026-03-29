import { normalizeUrl } from "./url.js";

export const extractForms = ($, pageUrl) =>
  $("form")
    .map((_, form) => {
      const element = $(form);
      const action = normalizeUrl(element.attr("action") || pageUrl, pageUrl) || pageUrl;
      const method = (element.attr("method") || "GET").toUpperCase();
      const inputs = element
        .find("input, textarea, select")
        .map((__, input) => {
          const field = $(input);
          return {
            name: field.attr("name") || "",
            type: field.attr("type") || input.tagName.toLowerCase()
          };
        })
        .get();

      return { action, method, inputs };
    })
    .get();

