import { Finding } from "../../models/Finding.js";
import { Scan } from "../../models/Scan.js";
import { runDiscoveryChecks } from "./checks/discoveryChecks.js";
import { crawlSite } from "./crawler.js";

export const runScan = async (scanId) => {
  const scan = await Scan.findById(scanId);
  if (!scan) {
    return;
  }

  scan.status = "running";
  scan.startedAt = new Date();
  scan.errorMessage = "";
  await scan.save();

  try {
    await runDiscoveryChecks({ scanId: scan._id, baseUrl: scan.baseUrl });
    const pages = await crawlSite({ scan });
    const findingsCount = await Finding.countDocuments({ scanId: scan._id });

    scan.status = "completed";
    scan.completedAt = new Date();
    scan.stats = {
      pagesVisited: pages.length,
      findingsCount
    };
    await scan.save();
  } catch (error) {
    scan.status = "failed";
    scan.completedAt = new Date();
    scan.errorMessage = error.message || "Scan failed unexpectedly.";
    await scan.save();
  }
};

