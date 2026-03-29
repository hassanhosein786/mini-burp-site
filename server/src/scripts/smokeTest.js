const baseUrl = process.env.API_BASE_URL || "http://localhost:5000";

const run = async () => {
  const response = await fetch(`${baseUrl}/api/health`);

  if (!response.ok) {
    throw new Error(`Health check failed with status ${response.status}`);
  }

  const payload = await response.json();
  if (payload.status !== "ok") {
    throw new Error("Unexpected health response payload.");
  }

  console.log(`Smoke test passed for ${baseUrl}/api/health`);
};

run().catch((error) => {
  console.error("Smoke test failed:", error.message);
  process.exit(1);
});
