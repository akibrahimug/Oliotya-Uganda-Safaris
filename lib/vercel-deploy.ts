/**
 * Helper function to trigger Vercel deployment via deploy hook
 * This is called after publishing CMS content to rebuild the static pages
 */
export async function triggerVercelDeploy() {
  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;

  console.log("====== VERCEL DEPLOY HOOK DEBUG ======");
  console.log(`   Environment: ${process.env.NODE_ENV}`);
  console.log(`   Vercel Env: ${process.env.VERCEL_ENV || "not set"}`);
  console.log(`   Hook URL exists: ${!!deployHookUrl}`);

  if (!deployHookUrl) {
    console.warn(
      "⚠️  VERCEL_DEPLOY_HOOK_URL is not set. Deployment will not be triggered automatically."
    );
    console.warn(
      "   Set this environment variable in Vercel to enable automatic deployments."
    );
    console.warn(
      "   After setting it, you MUST redeploy your application for changes to take effect."
    );
    return { triggered: false, reason: "No deploy hook configured" };
  }

  try {
    console.log("🚀 Triggering Vercel deployment...");
    console.log(`   Hook URL prefix: ${deployHookUrl.substring(0, 60)}...`);
    console.log(`   Hook URL length: ${deployHookUrl.length} characters`);
    console.log(`   Hook URL valid: ${deployHookUrl.startsWith("https://api.vercel.com")}`);

    const startTime = Date.now();
    const response = await fetch(deployHookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const duration = Date.now() - startTime;

    console.log(`   Request completed in ${duration}ms`);
    console.log(`   Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Failed to trigger Vercel deployment");
      console.error(`   Status: ${response.status} ${response.statusText}`);
      console.error(`   Response body: ${errorText.substring(0, 500)}`);
      console.error(`   Headers:`, Object.fromEntries(response.headers.entries()));
      return {
        triggered: false,
        reason: `HTTP ${response.status}: ${errorText}`,
        status: response.status,
        statusText: response.statusText,
      };
    }

    const data = await response.json();
    console.log("✅ Vercel deployment triggered successfully");
    console.log(`   Job ID: ${data.job?.id || "N/A"}`);
    console.log(`   Job State: ${data.job?.state || "queued"}`);
    console.log(`   Created At: ${data.job?.createdAt || "N/A"}`);
    console.log("======================================");

    return { triggered: true, data };
  } catch (error) {
    console.error("❌ Error triggering Vercel deployment");
    console.error(`   Error type: ${error instanceof Error ? error.constructor.name : typeof error}`);
    console.error(`   Error message: ${error instanceof Error ? error.message : String(error)}`);
    console.error(`   Error stack:`, error instanceof Error ? error.stack : "N/A");
    console.log("======================================");
    return {
      triggered: false,
      reason: error instanceof Error ? error.message : "Unknown error",
      errorType: error instanceof Error ? error.constructor.name : typeof error,
    };
  }
}

/**
 * Fire-and-forget version - doesn't wait for response
 * Use this when you don't want to delay the API response
 */
export function triggerVercelDeployAsync() {
  // Don't await - fire and forget
  triggerVercelDeploy().catch((err) => {
    console.error("Background deployment trigger failed:", err);
  });
}
