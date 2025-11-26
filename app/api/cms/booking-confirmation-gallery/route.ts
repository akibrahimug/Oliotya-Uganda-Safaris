import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

// GET - Fetch all gallery entries
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode');

    const galleries = await prisma.bookingConfirmationGallery.findMany({
      where: mode === 'cms' ? {} : { active: true },
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({ galleries });
  } catch (error) {
    console.error('Error fetching booking confirmation gallery:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery' },
      { status: 500 }
    );
  }
}

// POST - Create new gallery entry
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, images, displayOrder } = body;

    if (!title || !images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'Title and images array are required' },
        { status: 400 }
      );
    }

    const gallery = await prisma.bookingConfirmationGallery.create({
      data: {
        title,
        description: description || null,
        images,
        displayOrder: displayOrder || 0,
        active: true,
      },
    });

    return NextResponse.json({ gallery });
  } catch (error) {
    console.error('Error creating booking confirmation gallery:', error);
    return NextResponse.json(
      { error: 'Failed to create gallery' },
      { status: 500 }
    );
  }
}
