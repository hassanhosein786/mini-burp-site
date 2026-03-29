const FILE_LIKE_PATH = /\.(pdf|zip|exe|dmg|tar|gz|rar|docx?|xlsx?|pptx?|jpg|jpeg|png|gif|svg|mp4|mp3)$/i;
const SKIP_PATTERNS = [/logout/i, /signout/i, /delete/i, /destroy/i, /remove/i, /download/i, /export/i];

export const normalizeUrl = (input, baseUrl) => {
  try {
    const parsed = baseUrl ? new URL(input, baseUrl) : new URL(input);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }
    parsed.hash = "";
    if ((parsed.protocol === "http:" && parsed.port === "80") || (parsed.protocol === "https:" && parsed.port === "443")) {
      parsed.port = "";
    }
    if (parsed.pathname !== "/" && parsed.pathname.endsWith("/")) {
      parsed.pathname = parsed.pathname.slice(0, -1);
    }
    parsed.searchParams.sort();
    return parsed.toString();
  } catch {
    return null;
  }
};

export const getAllowedHost = (baseUrl) => new URL(baseUrl).host.toLowerCase();

export const isAllowedUrl = (candidateUrl, allowedHost) => {
  try {
    const parsed = new URL(candidateUrl);
    return parsed.host.toLowerCase() === allowedHost && ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
};

export const shouldSkipUrl = (urlString) => {
  try {
    const parsed = new URL(urlString);
    return FILE_LIKE_PATH.test(parsed.pathname) || SKIP_PATTERNS.some((pattern) => pattern.test(parsed.pathname));
  } catch {
    return true;
  }
};

