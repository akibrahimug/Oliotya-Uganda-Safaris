import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

// GET - Fetch contact section
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode');

    const section = await prisma.bookingConfirmationContact.findFirst({
      where: mode === 'cms' ? {} : { status: 'PUBLISHED' },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ section });
  } catch (error) {
    console.error('Error fetching booking confirmation contact:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact section' },
      { status: 500 }
    );
  }
}

// PATCH - Update contact section
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, sectionTitle, description, email, phone, whatsapp, responseTime, publish } = body;

    if (!id) {
      return NextResponse.json({ error: 'Section ID is required' }, { status: 400 });
    }

    const updateData: any = {
      sectionTitle,
      description,
      email,
      phone,
      whatsapp: whatsapp || null,
      responseTime,
      updatedAt: new Date(),
    };

    if (publish) {
      updateData.status = 'PUBLISHED';
      updateData.publishedAt = new Date();
    } else {
      updateData.status = 'DRAFT';
    }

    const section = await prisma.bookingConfirmationContact.update({
      where: { id },
      data: updateData,
    });

    // Trigger Vercel rebuild if publishing
    if (publish && process.env.VERCEL_DEPLOY_HOOK_URL) {
      fetch(process.env.VERCEL_DEPLOY_HOOK_URL, { method: 'POST' }).catch(console.error);
    }

    return NextResponse.json({ section });
  } catch (error) {
    console.error('Error updating booking confirmation contact:', error);
    return NextResponse.json(
      { error: 'Failed to update contact section' },
      { status: 500 }
    );
  }
}
