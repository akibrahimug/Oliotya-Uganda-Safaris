#!/usr/bin/env ts-node
/**
 * Backfill existing newsletter subscribers into a Resend Segment.
 * Run once after creating the Segment in the Resend dashboard and setting
 * RESEND_SEGMENT_ID. New subscribers are synced automatically going forward
 * by app/api/newsletter/route.ts, so this only needs to catch up existing rows.
 */
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import { prisma } from "../lib/db";
import { resend, SEGMENT_ID } from "../lib/email";

async function syncSubscribersToResend(): Promise<void> {
  if (!SEGMENT_ID) {
    throw new Error("RESEND_SEGMENT_ID is not set. Add it to .env.local before running this script.");
  }

  console.log("\n🔄 Syncing active newsletter subscribers to Resend segment...\n");

  const subscribers = await prisma.newsletterSubscription.findMany({
    where: { status: "ACTIVE" },
    select: { email: true },
  });

  console.log(`Found ${subscribers.length} active subscribers in the database\n`);

  let synced = 0;
  let failed = 0;

  for (const { email } of subscribers) {
    try {
      const { error } = await resend.contacts.create({
        email,
        audienceId: SEGMENT_ID,
        unsubscribed: false,
      });

      if (error) {
        console.error(`❌ Failed to sync ${email}:`, error);
        failed++;
        continue;
      }

      console.log(`✅ Synced: ${email}`);
      synced++;
    } catch (error) {
      console.error(`❌ Failed to sync ${email}:`, error);
      failed++;
    }
  }

  console.log("\n" + "=".repeat(70));
  console.log("Sync Summary");
  console.log("=".repeat(70));
  console.log(`Total active subscribers: ${subscribers.length}`);
  console.log(`Synced: ${synced}`);
  console.log(`Failed: ${failed}`);
  console.log("=".repeat(70));
}

async function main() {
  try {
    await syncSubscribersToResend();
    console.log("\n✅ Sync complete!");
  } catch (error) {
    console.error("\n❌ Sync failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
