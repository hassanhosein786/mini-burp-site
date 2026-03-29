import { Finding } from "../../models/Finding.js";

export const upsertFinding = async (payload) => {
  const groupKey = payload.groupKey || payload.pageUrl;
  const affectedPages = [...new Set([payload.pageUrl, ...(payload.affectedPages || [])])];
  const {
    affectedPages: _ignoredAffectedPages,
    groupKey: _ignoredGroupKey,
    targetScope: _ignoredTargetScope,
    ...rest
  } = payload;

  await Finding.findOneAndUpdate(
    { scanId: payload.scanId, type: payload.type, groupKey },
    {
      $set: {
        ...rest,
        groupKey,
        targetScope: payload.targetScope || "page"
      },
      $addToSet: {
        affectedPages: { $each: affectedPages }
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};
