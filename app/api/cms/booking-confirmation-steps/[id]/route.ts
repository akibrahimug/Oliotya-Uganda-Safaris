import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

// PATCH - Update step
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
    const { stepNumber, title, description, icon, extraInfo, displayOrder, active } = body;

    const step = await prisma.bookingConfirmationStep.update({
      where: { id: params.id },
      data: {
        stepNumber,
        title,
        description,
        icon,
        extraInfo: extraInfo || null,
        displayOrder: displayOrder || 0,
        active: active !== undefined ? active : true,
        updatedAt: new Date(),
      },
    });

    // Trigger Vercel rebuild if activating/deactivating
    if (process.env.VERCEL_DEPLOY_HOOK_URL) {
      fetch(process.env.VERCEL_DEPLOY_HOOK_URL, { method: 'POST' }).catch(console.error);
    }

    return NextResponse.json({ step });
  } catch (error) {
    console.error('Error updating booking confirmation step:', error);
    return NextResponse.json(
      { error: 'Failed to update step' },
      { status: 500 }
    );
  }
}

// DELETE - Delete step
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.bookingConfirmationStep.delete({
      where: { id: params.id },
    });

    // Trigger Vercel rebuild
    if (process.env.VERCEL_DEPLOY_HOOK_URL) {
      fetch(process.env.VERCEL_DEPLOY_HOOK_URL, { method: 'POST' }).catch(console.error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting booking confirmation step:', error);
    return NextResponse.json(
      { error: 'Failed to delete step' },
      { status: 500 }
    );
  }
}
