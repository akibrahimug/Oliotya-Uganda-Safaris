import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

/**
 * Debug endpoint to check environment variables in production
 * This helps diagnose why the deploy hook isn't working
 */
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
    const nodeEnv = process.env.NODE_ENV;
    const vercelEnv = process.env.VERCEL_ENV;

    // Get all env vars that start with VERCEL_
    const vercelVars = Object.keys(process.env)
      .filter(key => key.startsWith('VERCEL_'))
      .reduce((obj, key) => {
        obj[key] = process.env[key]?.substring(0, 50) + '...';
        return obj;
      }, {} as Record<string, string>);

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: nodeEnv,
        VERCEL_ENV: vercelEnv,
      },
      deployHook: {
        configured: !!deployHookUrl,
        urlPrefix: deployHookUrl?.substring(0, 70) + '...',
        urlLength: deployHookUrl?.length || 0,
        startsWithHttps: deployHookUrl?.startsWith('https://'),
        containsVercel: deployHookUrl?.includes('vercel.com'),
      },
      vercelEnvVars: vercelVars,
      recommendation: !deployHookUrl
        ? "❌ VERCEL_DEPLOY_HOOK_URL is NOT available. Did you redeploy after setting it in Vercel?"
        : "✅ Environment variable is available. Try triggering a deployment manually.",
    });
  } catch (error) {
    console.error("Error in debug endpoint:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
