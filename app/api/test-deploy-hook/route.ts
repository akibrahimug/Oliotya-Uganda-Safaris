import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { triggerVercelDeploy } from "@/lib/vercel-deploy";

/**
 * Test endpoint to verify Vercel deploy hook configuration
 * Access this in production to test if the env var is available
 *
 * GET /api/test-deploy-hook - Check if deploy hook is configured
 * POST /api/test-deploy-hook - Trigger a test deployment (requires auth)
 */
export async function GET() {
  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;

  return NextResponse.json({
    configured: !!deployHookUrl,
    hookUrlPrefix: deployHookUrl?.substring(0, 60) + "...",
    message: deployHookUrl
      ? "✅ Deploy hook is configured correctly"
      : "❌ VERCEL_DEPLOY_HOOK_URL environment variable is not set",
    instructions: deployHookUrl
      ? "You can test triggering a deployment by making a POST request to this endpoint"
      : "Please set VERCEL_DEPLOY_HOOK_URL in Vercel environment variables and redeploy",
  });
}

/**
 * POST - Test trigger a deployment
 * Requires authentication
 */
export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await triggerVercelDeploy();

    return NextResponse.json({
      success: result.triggered,
      result,
      message: result.triggered
        ? "✅ Deployment triggered successfully! Check Vercel dashboard for the new deployment."
        : `❌ Failed to trigger deployment: ${result.reason}`,
    });
  } catch (error) {
    console.error("Error in test deploy hook:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
