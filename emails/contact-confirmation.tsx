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

interface ContactConfirmationEmailProps {
  name: string;
  subject: string;
  companyName?: string;
  contactEmail?: string;
  primaryColor?: string;
  accentColor?: string;
}

export default function ContactConfirmationEmail({
  name,
  subject,
  companyName = 'Nambi Uganda Safaris',
  contactEmail = 'info@nambiugandasafaris.com',
  primaryColor = '#059669',
  accentColor = '#86efac',
}: ContactConfirmationEmailProps) {
  // Create color-based styles
  const h1Style = { ...h1, color: primaryColor };
  const infoBoxStyle = {
    ...infoBox,
    backgroundColor: `${primaryColor}10`,
    borderColor: accentColor,
  };
  const infoTitleStyle = { ...infoTitle, color: primaryColor };
  const infoTextStyle = { ...infoText, color: primaryColor };

  return (
    <Html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
      </Head>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1Style}>Thank You for Contacting {companyName}</Heading>

          <Text style={greeting}>Dear {name},</Text>

          <Text style={paragraph}>
            Thank you for reaching out to us regarding "<strong>{subject}</strong>".
            We've received your message and our team will get back to you within 24 hours.
          </Text>

          <Text style={paragraph}>
            At {companyName}, we're passionate about creating unforgettable safari
            experiences. Whether you're dreaming of gorilla trekking in Bwindi,
            witnessing the Big Five, or exploring Uganda's pristine landscapes,
            we're here to make it happen.
          </Text>

          <Section style={infoBoxStyle}>
            <Text style={infoTitleStyle}>What's Next?</Text>
            <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
              <tr>
                <td style={infoTextStyle}>
                  • Our team will review your inquiry
                </td>
              </tr>
              <tr>
                <td style={{ ...infoTextStyle, paddingTop: '6px' }}>
                  • We'll respond with personalized recommendations
                </td>
              </tr>
              <tr>
                <td style={{ ...infoTextStyle, paddingTop: '6px' }}>
                  • You'll receive a detailed quote tailored to your needs
                </td>
              </tr>
            </table>
          </Section>

          <Text style={paragraph}>
            In the meantime, feel free to explore our safari packages and
            destinations on our website, or contact us directly at {contactEmail}.
          </Text>

          <Text style={signature}>
            Best regards,
          </Text>
          <Text style={signature}>
            <strong>The {companyName} Team</strong>
          </Text>

          <Hr style={divider} />

          <Section style={footer}>
            <Text style={footerText}>
              {companyName} - Unforgettable Safari Experiences
            </Text>
            <Text style={footerText}>
              Email: {contactEmail}
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
  margin: '40px 0 24px',
  padding: '0 40px',
  textAlign: 'center' as const,
};

const greeting = {
  color: '#1a1a1a',
  fontSize: '16px',
  margin: '0 0 16px 0',
  padding: '0 40px',
};

const paragraph = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px 0',
  padding: '0 40px',
};

const infoBox = {
  backgroundColor: '#f0fdf4',
  border: '2px solid #86efac',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 40px',
};

const infoTitle = {
  color: '#065f46',
  fontSize: '18px',
  fontWeight: 'bold' as const,
  margin: '0 0 12px 0',
};

const infoText = {
  color: '#065f46',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};

const signature = {
  color: '#1a1a1a',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0 0 0',
  padding: '0 40px',
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
