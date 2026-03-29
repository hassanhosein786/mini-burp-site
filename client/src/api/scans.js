import { api } from "./client";

export const startScan = async (payload) => {
  const { data } = await api.post("/scans/start", payload);
  return data;
};

export const getScan = async (scanId) => {
  const { data } = await api.get(`/scans/${scanId}`);
  return data;
};

export const getScanSummary = async (scanId) => {
  const { data } = await api.get(`/scans/${scanId}/summary`);
  return data;
};

export const getScanFindings = async (scanId) => {
  const { data } = await api.get(`/scans/${scanId}/findings`);
  return data;
};

export const getFindingDetail = async (scanId, findingId) => {
  const { data } = await api.get(`/scans/${scanId}/findings/${findingId}`);
  return data;
};

export const getScanPages = async (scanId) => {
  const { data } = await api.get(`/scans/${scanId}/pages`);
  return data;
};
