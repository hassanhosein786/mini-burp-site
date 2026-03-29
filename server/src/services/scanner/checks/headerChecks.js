import { upsertFinding } from "../findingService.js";

const headerChecks = [
  {
    header: "strict-transport-security",
    type: "missing_hsts",
    severity: "medium",
    title: "Missing HSTS header",
    description: "The response does not include Strict-Transport-Security.",
    remediation: "Add a Strict-Transport-Security header after confirming the app is ready for HTTPS-only access."
  },
  {
    header: "content-security-policy",
    type: "missing_csp",
    severity: "medium",
    title: "Missing Content-Security-Policy header",
    description: "The response does not define a Content-Security-Policy.",
    remediation: "Define a restrictive Content-Security-Policy aligned with the application’s trusted sources."
  },
  {
    header: "x-frame-options",
    type: "missing_x_frame_options",
    severity: "low",
    title: "Missing X-Frame-Options header",
    description: "The response can be embedded in a frame because X-Frame-Options is absent.",
    remediation: "Add X-Frame-Options: DENY or SAMEORIGIN, or use frame-ancestors in CSP."
  },
  {
    header: "x-content-type-options",
    type: "missing_x_content_type_options",
    severity: "low",
    title: "Missing X-Content-Type-Options header",
    description: "Browsers may MIME-sniff responses because X-Content-Type-Options is absent.",
    remediation: "Add X-Content-Type-Options: nosniff."
  },
  {
    header: "referrer-policy",
    type: "missing_referrer_policy",
    severity: "low",
    title: "Missing Referrer-Policy header",
    description: "The response does not define referrer handling behavior.",
    remediation: "Add a Referrer-Policy header such as strict-origin-when-cross-origin."
  }
];

export const runHeaderChecks = async ({ scanId, pageUrl, headers, baseUrl }) => {
  const normalized = Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [key.toLowerCase(), String(value)])
  );

  const tasks = headerChecks
    .filter((item) => !normalized[item.header])
    .map((item) =>
      upsertFinding({
        scanId,
        pageUrl: baseUrl,
        affectedPages: [pageUrl],
        groupKey: item.type,
        targetScope: "host",
        type: item.type,
        severity: item.severity,
        title: item.title,
        description: item.description,
        evidence: { missingHeader: item.header },
        remediation: item.remediation
      })
    );

  if (normalized.server) {
    tasks.push(
      upsertFinding({
        scanId,
        pageUrl: baseUrl,
        affectedPages: [pageUrl],
        groupKey: "exposed_server_header",
        targetScope: "host",
        type: "exposed_server_header",
        severity: "info",
        title: "Exposed Server header",
        description: "The response exposes a Server header.",
        evidence: { server: normalized.server },
        remediation: "Suppress or generalize the Server header if feasible."
      })
    );
  }

  await Promise.all(tasks);
};
