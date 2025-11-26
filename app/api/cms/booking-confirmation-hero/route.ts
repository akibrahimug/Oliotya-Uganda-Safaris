import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

// GET - Fetch hero section
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode');

    // In CMS mode, return draft content for editing
    // In public mode, return only published content
    const section = await prisma.bookingConfirmationHero.findFirst({
      where: mode === 'cms' ? {} : { status: 'PUBLISHED' },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ section });
  } catch (error) {
    console.error('Error fetching booking confirmation hero:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero section' },
      { status: 500 }
    );
  }
}

// PATCH - Update hero section
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, description, badge, importantNotice, paymentDeadline, publish } = body;

    if (!id) {
      return NextResponse.json({ error: 'Section ID is required' }, { status: 400 });
    }

    const updateData: any = {
      title,
      description,
      badge,
      importantNotice,
      paymentDeadline,
      updatedAt: new Date(),
    };

    if (publish) {
      updateData.status = 'PUBLISHED';
      updateData.publishedAt = new Date();
    } else {
      updateData.status = 'DRAFT';
    }

    const section = await prisma.bookingConfirmationHero.update({
      where: { id },
      data: updateData,
    });

    // Trigger Vercel rebuild if publishing
    if (publish && process.env.VERCEL_DEPLOY_HOOK_URL) {
      fetch(process.env.VERCEL_DEPLOY_HOOK_URL, { method: 'POST' }).catch(console.error);
    }

    return NextResponse.json({ section });
  } catch (error) {
    console.error('Error updating booking confirmation hero:', error);
    return NextResponse.json(
      { error: 'Failed to update hero section' },
      { status: 500 }
    );
  }
}
