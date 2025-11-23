/**
 * Helper function to trigger Vercel deployment via deploy hook
 * This is called after publishing CMS content to rebuild the static pages
 */
export async function triggerVercelDeploy() {
  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;

  if (!deployHookUrl) {
    console.warn(
      "⚠️  VERCEL_DEPLOY_HOOK_URL is not set. Deployment will not be triggered automatically."
    );
    console.warn(
      "   Set this environment variable in Vercel to enable automatic deployments."
    );
    return { triggered: false, reason: "No deploy hook configured" };
  }

  try {
    console.log("🚀 Triggering Vercel deployment...");
    console.log(`   Hook URL: ${deployHookUrl.substring(0, 50)}...`);

    const response = await fetch(deployHookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Failed to trigger Vercel deployment");
      console.error(`   Status: ${response.status} ${response.statusText}`);
      console.error(`   Response: ${errorText}`);
      return {
        triggered: false,
        reason: `HTTP ${response.status}: ${errorText}`,
      };
    }

    const data = await response.json();
    console.log("✅ Vercel deployment triggered successfully");
    console.log(`   Job: ${data.job?.id || "N/A"}`);
    console.log(`   Status: ${data.job?.state || "queued"}`);

    return { triggered: true, data };
  } catch (error) {
    console.error("❌ Error triggering Vercel deployment:", error);
    return {
      triggered: false,
      reason: error instanceof Error ? error.message : "Unknown error",
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
