import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

// GET /api/cms/email-templates - List all email templates
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const templates = await prisma.emailTemplate.findMany({
      orderBy: { type: 'asc' },
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email templates' },
      { status: 500 }
    );
  }
}

// POST /api/cms/email-templates - Create new email template
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'type',
      'subject',
      'companyName',
      'heading',
      'greeting',
      'introText',
      'signatureText',
      'footerText',
      'contactEmail',
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if template with this type already exists
    const existing = await prisma.emailTemplate.findUnique({
      where: { type: body.type },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Template with type "${body.type}" already exists` },
        { status: 400 }
      );
    }

    const template = await prisma.emailTemplate.create({
      data: {
        type: body.type,
        subject: body.subject,
        companyName: body.companyName,
        heading: body.heading,
        greeting: body.greeting,
        introText: body.introText,
        nextStepsTitle: body.nextStepsTitle || null,
        nextStepsText: body.nextStepsText || null,
        signatureText: body.signatureText,
        footerText: body.footerText,
        contactEmail: body.contactEmail,
        primaryColor: body.primaryColor || '#059669',
        accentColor: body.accentColor || '#3b82f6',
        active: body.active !== undefined ? body.active : true,
      },
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    console.error('Error creating email template:', error);
    return NextResponse.json(
      { error: 'Failed to create email template' },
      { status: 500 }
    );
  }
}
