import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

// GET - Fetch all security points
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode');

    const securityPoints = await prisma.bookingConfirmationSecurity.findMany({
      where: mode === 'cms' ? {} : { active: true },
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({ securityPoints });
  } catch (error) {
    console.error('Error fetching booking confirmation security:', error);
    return NextResponse.json(
      { error: 'Failed to fetch security points' },
      { status: 500 }
    );
  }
}

// POST - Create new security point
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, points, displayOrder } = body;

    if (!title || !points || !Array.isArray(points) || points.length === 0) {
      return NextResponse.json(
        { error: 'Title and points array are required' },
        { status: 400 }
      );
    }

    const securityPoint = await prisma.bookingConfirmationSecurity.create({
      data: {
        title,
        points,
        displayOrder: displayOrder || 0,
        active: true,
      },
    });

    return NextResponse.json({ securityPoint });
  } catch (error) {
    console.error('Error creating booking confirmation security:', error);
    return NextResponse.json(
      { error: 'Failed to create security point' },
      { status: 500 }
    );
  }
}
