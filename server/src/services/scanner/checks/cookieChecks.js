import { upsertFinding } from "../findingService.js";

export const runCookieChecks = async ({ scanId, pageUrl, cookies }) => {
  const tasks = [];

  for (const cookie of cookies) {
    if (!cookie.httpOnly) {
      tasks.push(
        upsertFinding({
          scanId,
          pageUrl,
          type: `cookie_missing_httponly_${cookie.name}`,
          severity: "medium",
          title: `Cookie ${cookie.name} missing HttpOnly`,
          description: "A returned cookie is missing the HttpOnly flag.",
          evidence: { cookie: cookie.raw },
          remediation: "Mark sensitive cookies as HttpOnly."
        })
      );
    }

    if (!cookie.secure) {
      tasks.push(
        upsertFinding({
          scanId,
          pageUrl,
          type: `cookie_missing_secure_${cookie.name}`,
          severity: "medium",
          title: `Cookie ${cookie.name} missing Secure`,
          description: "A returned cookie is missing the Secure flag.",
          evidence: { cookie: cookie.raw },
          remediation: "Set Secure on cookies intended for HTTPS transport only."
        })
      );
    }

    if (!cookie.sameSite) {
      tasks.push(
        upsertFinding({
          scanId,
          pageUrl,
          type: `cookie_missing_samesite_${cookie.name}`,
          severity: "low",
          title: `Cookie ${cookie.name} missing SameSite`,
          description: "A returned cookie is missing a SameSite attribute.",
          evidence: { cookie: cookie.raw },
          remediation: "Set SameSite to Lax, Strict, or None as appropriate."
        })
      );
    }
  }

  await Promise.all(tasks);
};
