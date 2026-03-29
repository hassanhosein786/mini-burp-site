import mongoose from "mongoose";
import { Finding } from "../models/Finding.js";
import { Page } from "../models/Page.js";
import { Scan } from "../models/Scan.js";
import { runScan } from "../services/scanner/scanOrchestrator.js";
import { AppError } from "../utils/errors.js";
import { getAllowedHost, normalizeUrl } from "../utils/url.js";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const allowedSeverities = new Set(["info", "low", "medium", "high"]);

const parseRequest = (body) => {
  if (!body || typeof body !== "object") {
    throw new AppError("Request body is required.", 400);
  }

  const baseUrl = normalizeUrl(body.baseUrl);
  if (!baseUrl) {
    throw new AppError("A valid http or https target URL is required.", 400);
  }

  const parsedBase = new URL(baseUrl);
  if (parsedBase.username || parsedBase.password) {
    throw new AppError("Credentials in the target URL are not allowed.", 400);
  }

  const activeChecks =
    typeof body.activeChecks === "boolean"
      ? body.activeChecks
      : String(body.activeChecks).toLowerCase() !== "false";

  return {
    baseUrl,
    allowedHost: getAllowedHost(baseUrl),
    config: {
      maxDepth: clamp(Number.parseInt(body.maxDepth, 10) || 2, 0, 5),
      maxPages: clamp(Number.parseInt(body.maxPages, 10) || 25, 1, 100),
      activeChecks
    }
  };
};

const ensureObjectId = (value) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new AppError("Invalid scan id.", 400);
  }
};

export const startScan = async (req, res) => {
  const scan = await Scan.create(parseRequest(req.body));

  runScan(scan._id).catch(async (error) => {
    await Scan.findByIdAndUpdate(scan._id, {
      status: "failed",
      completedAt: new Date(),
      errorMessage: error.message || "Scan failed unexpectedly."
    });
  });

  res.status(202).json(scan);
};

export const getScan = async (req, res) => {
  ensureObjectId(req.params.id);
  const scan = await Scan.findById(req.params.id);
  if (!scan) {
    throw new AppError("Scan not found.", 404);
  }
  res.json(scan);
};

export const getScanPages = async (req, res) => {
  ensureObjectId(req.params.id);
  const pages = await Page.find({ scanId: req.params.id }).sort({ createdAt: 1 });
  res.json(pages);
};

export const getScanFindings = async (req, res) => {
  ensureObjectId(req.params.id);
  const query = { scanId: req.params.id };
  if (req.query.severity) {
    if (!allowedSeverities.has(req.query.severity)) {
      throw new AppError("Invalid severity filter.", 400);
    }
    query.severity = req.query.severity;
  }
  if (req.query.type) {
    query.type = req.query.type;
  }
  const findings = await Finding.find(query).sort({ createdAt: -1 });
  res.json(findings);
};

export const getFindingDetail = async (req, res) => {
  ensureObjectId(req.params.id);
  ensureObjectId(req.params.findingId);

  const finding = await Finding.findOne({
    _id: req.params.findingId,
    scanId: req.params.id
  });

  if (!finding) {
    throw new AppError("Finding not found.", 404);
  }

  res.json(finding);
};

export const getScanSummary = async (req, res) => {
  ensureObjectId(req.params.id);
  const scan = await Scan.findById(req.params.id);
  if (!scan) {
    throw new AppError("Scan not found.", 404);
  }

  const [severityBreakdown, topTypes, pagesCount] = await Promise.all([
    Finding.aggregate([
      { $match: { scanId: new mongoose.Types.ObjectId(req.params.id) } },
      { $group: { _id: "$severity", count: { $sum: 1 } } }
    ]),
    Finding.aggregate([
      { $match: { scanId: new mongoose.Types.ObjectId(req.params.id) } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]),
    Page.countDocuments({ scanId: req.params.id })
  ]);

  res.json({
    scan,
    pagesCount,
    severityBreakdown,
    topTypes
  });
};
