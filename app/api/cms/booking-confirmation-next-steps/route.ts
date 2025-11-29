import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

// GET - Fetch next steps section
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode');

    // In CMS mode, return draft content for editing
    // In public mode, return only published content
    const section = await prisma.bookingConfirmationNextSteps.findFirst({
      where: mode === 'cms' ? {} : { status: 'PUBLISHED' },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ section });
  } catch (error) {
    console.error('Error fetching booking confirmation next steps:', error);
    return NextResponse.json(
      { error: 'Failed to fetch next steps section' },
      { status: 500 }
    );
  }
}

// PATCH - Update next steps section
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      title,
      description,
      emailStep,
      paymentStep,
      contactStep,
      confirmStep,
      publish
    } = body;

    // Find existing section or create new one
    const existingSection = await prisma.bookingConfirmationNextSteps.findFirst();

    let section;
    if (existingSection) {
      const updateData: any = {
        title,
        description,
        emailStep,
        paymentStep,
        contactStep,
        confirmStep,
        updatedAt: new Date(),
      };

      if (publish) {
        updateData.status = 'PUBLISHED';
        updateData.publishedAt = new Date();
      } else {
        updateData.status = 'DRAFT';
      }

      section = await prisma.bookingConfirmationNextSteps.update({
        where: { id: existingSection.id },
        data: updateData,
      });
    } else {
      section = await prisma.bookingConfirmationNextSteps.create({
        data: {
          title,
          description,
          emailStep,
          paymentStep,
          contactStep,
          confirmStep,
          status: publish ? 'PUBLISHED' : 'DRAFT',
          publishedAt: publish ? new Date() : undefined,
        },
      });
    }

    // Trigger Vercel rebuild if publishing
    if (publish && process.env.VERCEL_DEPLOY_HOOK_URL) {
      fetch(process.env.VERCEL_DEPLOY_HOOK_URL, { method: 'POST' }).catch(console.error);
    }

    return NextResponse.json({ section });
  } catch (error) {
    console.error('Error updating booking confirmation next steps:', error);
    return NextResponse.json(
      { error: 'Failed to update next steps section' },
      { status: 500 }
    );
  }
}
