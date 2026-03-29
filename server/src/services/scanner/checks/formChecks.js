import { upsertFinding } from "../findingService.js";

export const runFormChecks = async ({ scanId, pageUrl, forms }) => {
  const tasks = forms
    .filter(
      (form) =>
        pageUrl.startsWith("http://") &&
        form.inputs.some((input) => (input.type || "").toLowerCase() === "password")
    )
    .map((form) =>
      upsertFinding({
        scanId,
        pageUrl,
        type: `insecure_login_form_${form.action}`,
        severity: "high",
        title: "Password form on non-HTTPS page",
        description: "A form containing a password field was found on an HTTP page.",
        evidence: {
          action: form.action,
          method: form.method
        },
        remediation: "Serve authentication pages and submissions exclusively over HTTPS."
      })
    );

  await Promise.all(tasks);
};

