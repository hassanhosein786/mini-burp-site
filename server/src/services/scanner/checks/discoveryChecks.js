import { upsertFinding } from "../findingService.js";
import { httpClient } from "../httpClient.js";

const files = [
  {
    path: "/robots.txt",
    type: "robots_txt_discovered",
    title: "robots.txt discovered",
    description: "The target exposes a robots.txt file."
  },
  {
    path: "/sitemap.xml",
    type: "sitemap_xml_discovered",
    title: "sitemap.xml discovered",
    description: "The target exposes a sitemap.xml file."
  }
];

export const runDiscoveryChecks = async ({ scanId, baseUrl }) => {
  await Promise.all(
    files.map(async (file) => {
      const url = new URL(file.path, baseUrl).toString();
      const response = await httpClient.get(url);

      if (response.status >= 200 && response.status < 300) {
        await upsertFinding({
          scanId,
          pageUrl: url,
          affectedPages: [url],
          groupKey: file.type,
          targetScope: "host",
          type: file.type,
          severity: "info",
          title: file.title,
          description: file.description,
          evidence: { statusCode: response.status },
          remediation: "Review whether this file reveals operational details that should stay private."
        });
      }
    })
  );
};
