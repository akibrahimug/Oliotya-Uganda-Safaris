"use client";

import { EmailTemplate } from "@/prisma/app/generated/prisma-client";

interface EmailTemplatePreviewProps {
  template: EmailTemplate;
}

/**
 * Visual preview of an email template showing how it will look when sent
 */
export function EmailTemplatePreview({ template }: EmailTemplatePreviewProps) {
  return (
    <div className="max-w-2xl mx-auto bg-white">
      {/* Email Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="text-sm text-gray-600 mb-2">
          <strong>Subject:</strong> {template.subject}
        </div>
        <div className="text-sm text-gray-600">
          <strong>From:</strong> {template.contactEmail}
        </div>
      </div>

      {/* Email Body Preview */}
      <div className="p-8" style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* Header with Company Name */}
        <div
          className="text-center mb-8 pb-6"
          style={{ borderBottom: `3px solid ${template.primaryColor}` }}
        >
          <h1
            className="text-2xl font-bold"
            style={{ color: template.primaryColor }}
          >
            {template.companyName}
          </h1>
        </div>

        {/* Main Heading */}
        <h2
          className="text-3xl font-bold mb-4"
          style={{ color: template.primaryColor }}
        >
          {template.heading}
        </h2>

        {/* Greeting */}
        {template.greeting && (
          <p className="text-base mb-4" style={{ color: '#333' }}>
            {template.greeting}
          </p>
        )}

        {/* Introduction Text */}
        <div className="text-base mb-6" style={{ color: '#666', lineHeight: '1.6' }}>
          {template.introText.split('\n').map((line: string, i: number) => (
            <p key={i} className="mb-2">{line}</p>
          ))}
        </div>

        {/* Sample Details Box (for demonstration) */}
        {(template.type === 'booking_confirmation' || template.type === 'booking_notification') && (
          <div
            className="my-6 p-6 rounded-lg"
            style={{
              backgroundColor: `${template.primaryColor}15`,
              border: `2px solid ${template.primaryColor}`
            }}
          >
            <div className="mb-3">
              <strong style={{ color: '#333' }}>Confirmation Number:</strong>
              <span className="ml-2" style={{ color: '#666' }}>BOOKING-12345</span>
            </div>
            <div className="mb-3">
              <strong style={{ color: '#333' }}>Safari Package:</strong>
              <span className="ml-2" style={{ color: '#666' }}>Sample Safari Package</span>
            </div>
            <div>
              <strong style={{ color: '#333' }}>Travel Dates:</strong>
              <span className="ml-2" style={{ color: '#666' }}>Jan 15, 2025 - Jan 20, 2025</span>
            </div>
          </div>
        )}

        {/* Next Steps Section */}
        {template.nextStepsTitle && template.nextStepsText && (
          <div className="my-6">
            <h3
              className="text-xl font-bold mb-3"
              style={{ color: template.accentColor }}
            >
              {template.nextStepsTitle}
            </h3>
            <div className="text-base" style={{ color: '#666', lineHeight: '1.6' }}>
              {template.nextStepsText.split('\n').map((line: string, i: number) => (
                <p key={i} className="mb-2">{line}</p>
              ))}
            </div>
          </div>
        )}

        {/* Signature */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-base" style={{ color: '#666', lineHeight: '1.6' }}>
            {template.signatureText.split('\n').map((line: string, i: number) => (
              <p key={i} className="mb-2">{line}</p>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className="mt-8 pt-6 text-center text-sm"
          style={{
            borderTop: `2px solid ${template.primaryColor}`,
            color: '#999'
          }}
        >
          {template.footerText.split('\n').map((line: string, i: number) => (
            <p key={i} className="mb-1">{line}</p>
          ))}
          <p className="mt-2">
            Email: <a href={`mailto:${template.contactEmail}`} style={{ color: template.primaryColor }}>{template.contactEmail}</a>
          </p>
        </div>
      </div>
    </div>
  );
}
