import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
} from '@react-email/components';

interface ContactNotificationEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
  inquiryId: number;
  companyName?: string;
  contactEmail?: string;
  primaryColor?: string;
  accentColor?: string;
}

export default function ContactNotificationEmail({
  name,
  email,
  subject,
  message,
  inquiryId,
  companyName = 'Oliotya Uganda Safaris',
  contactEmail = 'Info@oliotyaugandasafaris.com',
  primaryColor = '#059669',
  accentColor = '#f59e0b',
}: ContactNotificationEmailProps) {
  // Create color-based styles
  const h1Style = { ...h1, color: primaryColor };
  const alertBoxStyle = {
    ...alertBox,
    backgroundColor: `${accentColor}20`,
    borderColor: accentColor,
  };

  return (
    <Html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
      </Head>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1Style}>📧 New Contact Form Submission</Heading>

          <Section style={alertBoxStyle}>
            <Text style={alertText}>
              Inquiry ID: <strong>#{inquiryId}</strong>
            </Text>
          </Section>

          <Heading style={h2}>Contact Information</Heading>
          <Section style={section}>
            <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
              <tr>
                <td>
                  <Text style={label}>From:</Text>
                  <Text style={value}>{name}</Text>
                </td>
              </tr>
              <tr>
                <td style={{ paddingTop: '8px' }}>
                  <Text style={label}>Email:</Text>
                  <Text style={value}>
                    <a href={`mailto:${email}`} style={link}>{email}</a>
                  </Text>
                </td>
              </tr>
              <tr>
                <td style={{ paddingTop: '8px' }}>
                  <Text style={label}>Subject:</Text>
                  <Text style={value}>{subject}</Text>
                </td>
              </tr>
            </table>
          </Section>

          <Heading style={h2}>Message</Heading>
          <Section style={section}>
            <div style={messageBox}>
              <Text style={messageText}>{message}</Text>
            </div>
          </Section>

          <Hr style={divider} />

          <Section style={footer}>
            <Text style={footerText}>
              <strong>Action Required:</strong> Please respond to this inquiry at{' '}
              <a href={`mailto:${email}`} style={link}>{email}</a>
            </Text>
            <Text style={footerText}>
              This notification was sent from {companyName} contact form.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Inline styles optimized for email clients
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  WebkitFontSmoothing: 'antialiased' as const,
  MozOsxFontSmoothing: 'grayscale' as const,
  padding: '0',
  margin: '0',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
  width: '100%',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
};

const h1 = {
  color: '#059669',
  fontSize: '24px',
  fontWeight: 'bold' as const,
  margin: '40px 0 20px',
  padding: '0 40px',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: 'bold' as const,
  margin: '24px 0 12px',
  padding: '0 40px',
};

const alertBox = {
  backgroundColor: '#fef3c7',
  border: '2px solid #f59e0b',
  borderRadius: '8px',
  padding: '16px',
  margin: '0 40px 24px',
  textAlign: 'center' as const,
};

const alertText = {
  color: '#92400e',
  fontSize: '16px',
  margin: '0',
  fontWeight: '600' as const,
};

const section = {
  padding: '0 40px',
  marginBottom: '16px',
};

const label = {
  color: '#6b7280',
  fontSize: '12px',
  fontWeight: '600' as const,
  textTransform: 'uppercase' as const,
  margin: '0 0 4px 0',
  letterSpacing: '0.5px',
};

const value = {
  color: '#1a1a1a',
  fontSize: '16px',
  margin: '0 0 4px 0',
  lineHeight: '22px',
};

const messageBox = {
  backgroundColor: '#f9fafb',
  padding: '16px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
};

const messageText = {
  color: '#1a1a1a',
  fontSize: '15px',
  lineHeight: '24px',
  whiteSpace: 'pre-wrap' as const,
  margin: '0',
};

const link = {
  color: '#2563eb',
  textDecoration: 'underline' as const,
  fontWeight: '500' as const,
};

const divider = {
  borderTop: '2px solid #e5e7eb',
  margin: '32px 40px',
  width: 'auto',
};

const footer = {
  padding: '24px 40px 0px',
  marginTop: '0px',
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '4px 0',
  textAlign: 'center' as const,
};
