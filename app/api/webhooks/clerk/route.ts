import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

// Handle GET requests (for health checks or verification)
export async function GET() {
  return new Response(
    JSON.stringify({
      status: 'ok',
      message: 'Clerk webhook endpoint is ready',
      endpoint: '/api/webhooks/clerk',
      methods: ['POST'],
      events: ['user.created', 'user.updated', 'user.deleted']
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

export async function POST(req: Request) {
  // Get the Svix headers for verification
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env.local');
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the webhook signature
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return new Response('Error: Verification failed', {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    // Create user in database
    try {
      await prisma.user.upsert({
        where: { id },
        create: {
          id,
          email: email_addresses[0].email_address,
          firstName: first_name || null,
          lastName: last_name || null,
          profileImageUrl: image_url || null,
        },
        update: {
          email: email_addresses[0].email_address,
          firstName: first_name || null,
          lastName: last_name || null,
          profileImageUrl: image_url || null,
        },
      });

      console.log(`✅ User created in database: ${id}`);
    } catch (error) {
      console.error('Error creating user in database:', error);
      return new Response('Error: Database operation failed', {
        status: 500,
      });
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    // Update user in database
    try {
      await prisma.user.update({
        where: { id },
        data: {
          email: email_addresses[0].email_address,
          firstName: first_name || null,
          lastName: last_name || null,
          profileImageUrl: image_url || null,
        },
      });

      console.log(`✅ User updated in database: ${id}`);
    } catch (error) {
      console.error('Error updating user in database:', error);
      // If user doesn't exist, create them
      try {
        await prisma.user.create({
          data: {
            id,
            email: email_addresses[0].email_address,
            firstName: first_name || null,
            lastName: last_name || null,
            profileImageUrl: image_url || null,
          },
        });
        console.log(`✅ User created in database (from update): ${id}`);
      } catch (createError) {
        console.error('Error creating user in database:', createError);
        return new Response('Error: Database operation failed', {
          status: 500,
        });
      }
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    // Delete user from database (will cascade to favorites)
    try {
      await prisma.user.delete({
        where: { id },
      });

      console.log(`✅ User deleted from database: ${id}`);
    } catch (error) {
      console.error('Error deleting user from database:', error);
      // User might not exist in database, that's okay
      console.log(`ℹ️  User ${id} not found in database (already deleted or never synced)`);
    }
  }

  return new Response('Webhook processed successfully', { status: 200 });
}
