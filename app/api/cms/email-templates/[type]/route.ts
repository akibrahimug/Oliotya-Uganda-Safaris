import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

interface RouteParams {
  params: Promise<{
    type: string;
  }>;
}

// GET /api/cms/email-templates/[type] - Get single template
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type } = await params;

    const template = await prisma.emailTemplate.findUnique({
      where: { type },
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ template });
  } catch (error) {
    console.error('Error fetching email template:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email template' },
      { status: 500 }
    );
  }
}

// PUT /api/cms/email-templates/[type] - Update template
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type } = await params;
    const body = await request.json();

    // Check if template exists
    const existing = await prisma.emailTemplate.findUnique({
      where: { type },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Update template
    const template = await prisma.emailTemplate.update({
      where: { type },
      data: {
        subject: body.subject ?? existing.subject,
        companyName: body.companyName ?? existing.companyName,
        heading: body.heading ?? existing.heading,
        greeting: body.greeting ?? existing.greeting,
        introText: body.introText ?? existing.introText,
        nextStepsTitle: body.nextStepsTitle !== undefined ? body.nextStepsTitle : existing.nextStepsTitle,
        nextStepsText: body.nextStepsText !== undefined ? body.nextStepsText : existing.nextStepsText,
        signatureText: body.signatureText ?? existing.signatureText,
        footerText: body.footerText ?? existing.footerText,
        contactEmail: body.contactEmail ?? existing.contactEmail,
        primaryColor: body.primaryColor ?? existing.primaryColor,
        accentColor: body.accentColor ?? existing.accentColor,
        active: body.active !== undefined ? body.active : existing.active,
      },
    });

    return NextResponse.json({ template });
  } catch (error) {
    console.error('Error updating email template:', error);
    return NextResponse.json(
      { error: 'Failed to update email template' },
      { status: 500 }
    );
  }
}

// DELETE /api/cms/email-templates/[type] - Delete template
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type } = await params;

    // Check if template exists
    const existing = await prisma.emailTemplate.findUnique({
      where: { type },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    await prisma.emailTemplate.delete({
      where: { type },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting email template:', error);
    return NextResponse.json(
      { error: 'Failed to delete email template' },
      { status: 500 }
    );
  }
}
