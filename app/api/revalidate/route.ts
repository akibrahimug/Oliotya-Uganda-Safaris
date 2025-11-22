import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path") || "/";
    const triggerBuild = searchParams.get("build") === "true";

    // Revalidate the specified path
    revalidatePath(path);

    // Trigger Vercel deployment if deploy hook is configured
    let buildTriggered = false;
    if (triggerBuild && process.env.VERCEL_DEPLOY_HOOK_URL) {
      try {
        const deployResponse = await fetch(process.env.VERCEL_DEPLOY_HOOK_URL, {
          method: "POST",
        });

        if (deployResponse.ok) {
          buildTriggered = true;
          console.log("Vercel deployment triggered successfully");
        } else {
          console.error("Failed to trigger Vercel deployment:", deployResponse.status);
        }
      } catch (deployError) {
        console.error("Error triggering Vercel deployment:", deployError);
      }
    }

    return NextResponse.json({
      revalidated: true,
      buildTriggered,
      path,
      now: Date.now()
    });
  } catch (error) {
    console.error("Error revalidating:", error);
    return NextResponse.json(
      { error: "Failed to revalidate" },
      { status: 500 }
    );
  }
}
