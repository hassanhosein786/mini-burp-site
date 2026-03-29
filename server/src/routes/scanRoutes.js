import { Router } from "express";
import {
  getFindingDetail,
  getScan,
  getScanFindings,
  getScanPages,
  getScanSummary,
  startScan
} from "../controllers/scanController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.post("/start", asyncHandler(startScan));
router.get("/:id", asyncHandler(getScan));
router.get("/:id/pages", asyncHandler(getScanPages));
router.get("/:id/findings", asyncHandler(getScanFindings));
router.get("/:id/findings/:findingId", asyncHandler(getFindingDetail));
router.get("/:id/summary", asyncHandler(getScanSummary));

export const scanRoutes = router;
