import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

// PATCH - Update security point
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, points, displayOrder, active } = body;

    const securityPoint = await prisma.bookingConfirmationSecurity.update({
      where: { id: params.id },
      data: {
        title,
        points,
        displayOrder: displayOrder || 0,
        active: active !== undefined ? active : true,
        updatedAt: new Date(),
      },
    });

    // Trigger Vercel rebuild if activating/deactivating
    if (process.env.VERCEL_DEPLOY_HOOK_URL) {
      fetch(process.env.VERCEL_DEPLOY_HOOK_URL, { method: 'POST' }).catch(console.error);
    }

    return NextResponse.json({ securityPoint });
  } catch (error) {
    console.error('Error updating booking confirmation security:', error);
    return NextResponse.json(
      { error: 'Failed to update security point' },
      { status: 500 }
    );
  }
}

// DELETE - Delete security point
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.bookingConfirmationSecurity.delete({
      where: { id: params.id },
    });

    // Trigger Vercel rebuild
    if (process.env.VERCEL_DEPLOY_HOOK_URL) {
      fetch(process.env.VERCEL_DEPLOY_HOOK_URL, { method: 'POST' }).catch(console.error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting booking confirmation security:', error);
    return NextResponse.json(
      { error: 'Failed to delete security point' },
      { status: 500 }
    );
  }
}
