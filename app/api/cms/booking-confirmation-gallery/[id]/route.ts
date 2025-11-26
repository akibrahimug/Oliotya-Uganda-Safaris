import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

// PATCH - Update gallery entry
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
    const { title, description, images, displayOrder, active } = body;

    const gallery = await prisma.bookingConfirmationGallery.update({
      where: { id: params.id },
      data: {
        title,
        description: description || null,
        images,
        displayOrder: displayOrder || 0,
        active: active !== undefined ? active : true,
        updatedAt: new Date(),
      },
    });

    // Trigger Vercel rebuild if activating/deactivating
    if (process.env.VERCEL_DEPLOY_HOOK_URL) {
      fetch(process.env.VERCEL_DEPLOY_HOOK_URL, { method: 'POST' }).catch(console.error);
    }

    return NextResponse.json({ gallery });
  } catch (error) {
    console.error('Error updating booking confirmation gallery:', error);
    return NextResponse.json(
      { error: 'Failed to update gallery' },
      { status: 500 }
    );
  }
}

// DELETE - Delete gallery entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.bookingConfirmationGallery.delete({
      where: { id: params.id },
    });

    // Trigger Vercel rebuild
    if (process.env.VERCEL_DEPLOY_HOOK_URL) {
      fetch(process.env.VERCEL_DEPLOY_HOOK_URL, { method: 'POST' }).catch(console.error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting booking confirmation gallery:', error);
    return NextResponse.json(
      { error: 'Failed to delete gallery' },
      { status: 500 }
    );
  }
}
