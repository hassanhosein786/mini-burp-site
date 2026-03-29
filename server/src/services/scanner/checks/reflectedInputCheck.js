import { upsertFinding } from "../findingService.js";
import { httpClient } from "../httpClient.js";

const MARKER_PARAM = "mini_burp_marker";

export const runReflectedInputCheck = async ({ scanId, pageUrl, forms }) => {
  const marker = `mini-burp-${Date.now()}`;
  const candidates = new Set([pageUrl]);
  const tasks = [];

  for (const form of forms) {
    if (form.method === "GET" && form.action) {
      candidates.add(form.action);
    }
  }

  for (const candidate of candidates) {
    try {
      const target = new URL(candidate);
      target.searchParams.set(MARKER_PARAM, marker);
      const response = await httpClient.get(target.toString(), {
        headers: {
          Accept: "text/html,application/xhtml+xml"
        }
      });

      if (typeof response.data === "string" && response.data.includes(marker)) {
        tasks.push(
          upsertFinding({
            scanId,
            pageUrl: candidate,
            type: `reflected_input_${candidate}`,
            severity: "medium",
            title: "Reflected input detected",
            description: "A harmless marker string supplied as input was reflected in the response.",
            evidence: {
              marker,
              requestUrl: target.toString(),
              parameter: MARKER_PARAM
            },
            remediation: "Review output encoding and request reflection patterns on this route."
          })
        );
      }
    } catch {
      continue;
    }
  }

  await Promise.all(tasks);
};

