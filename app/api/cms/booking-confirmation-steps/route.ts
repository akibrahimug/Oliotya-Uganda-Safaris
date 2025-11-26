import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

// GET - Fetch all steps
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode');

    const steps = await prisma.bookingConfirmationStep.findMany({
      where: mode === 'cms' ? {} : { active: true },
      orderBy: [{ stepNumber: 'asc' }, { displayOrder: 'asc' }],
    });

    return NextResponse.json({ steps });
  } catch (error) {
    console.error('Error fetching booking confirmation steps:', error);
    return NextResponse.json(
      { error: 'Failed to fetch steps' },
      { status: 500 }
    );
  }
}

// POST - Create new step
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { stepNumber, title, description, icon, extraInfo, displayOrder } = body;

    if (!stepNumber || !title || !description || !icon) {
      return NextResponse.json(
        { error: 'Step number, title, description, and icon are required' },
        { status: 400 }
      );
    }

    const step = await prisma.bookingConfirmationStep.create({
      data: {
        stepNumber,
        title,
        description,
        icon,
        extraInfo: extraInfo || null,
        displayOrder: displayOrder || 0,
        active: true,
      },
    });

    return NextResponse.json({ step });
  } catch (error) {
    console.error('Error creating booking confirmation step:', error);
    return NextResponse.json(
      { error: 'Failed to create step' },
      { status: 500 }
    );
  }
}
