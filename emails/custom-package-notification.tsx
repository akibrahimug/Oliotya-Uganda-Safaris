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

interface CustomPackageNotificationEmailProps {
  packageId: number;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  destinations: Array<{
    name: string;
    category: string;
    days: number;
  }>;
  duration: string;
  numberOfPeople: number;
  travelDate?: string | null;
  budget?: number | null;
  specialRequests?: string | null;
  companyName?: string;
  contactEmail?: string;
  primaryColor?: string;
  accentColor?: string;
}

export default function CustomPackageNotificationEmail({
  packageId,
  name,
  contactName,
  email,
  phone,
  destinations,
  duration,
  numberOfPeople,
  travelDate,
  budget,
  specialRequests,
  companyName = 'Nambi Uganda Safaris',
  contactEmail = 'info@nambiugandasafaris.com',
  primaryColor = '#059669',
  accentColor = '#8b5cf6',
}: CustomPackageNotificationEmailProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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
          <Heading style={h1Style}>🎯 New Custom Package Request!</Heading>

          <Section style={alertBoxStyle}>
            <Text style={alertText}>
              Package ID: <strong>#{packageId}</strong>
            </Text>
          </Section>

          <Heading style={h2}>Customer Information</Heading>
          <Section style={section}>
            <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
              <tr>
                <td>
                  <Text style={label}>Name:</Text>
                  <Text style={value}>{contactName}</Text>
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
                  <Text style={label}>Phone:</Text>
                  <Text style={value}>
                    <a href={`tel:${phone}`} style={link}>{phone}</a>
                  </Text>
                </td>
              </tr>
            </table>
          </Section>

          <Heading style={h2}>Package Details</Heading>
          <Section style={section}>
            <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
              <tr>
                <td>
                  <Text style={label}>Package Name:</Text>
                  <Text style={value}>{name}</Text>
                </td>
              </tr>
              <tr>
                <td style={{ paddingTop: '8px' }}>
                  <Text style={label}>Duration:</Text>
                  <Text style={value}>{duration}</Text>
                </td>
              </tr>
              <tr>
                <td style={{ paddingTop: '8px' }}>
                  <Text style={label}>Number of People:</Text>
                  <Text style={value}>{numberOfPeople} {numberOfPeople === 1 ? 'person' : 'people'}</Text>
                </td>
              </tr>
              {travelDate && (
                <tr>
                  <td style={{ paddingTop: '8px' }}>
                    <Text style={label}>Preferred Travel Date:</Text>
                    <Text style={value}>{formatDate(travelDate)}</Text>
                  </td>
                </tr>
              )}
              {budget && budget > 0 && (
                <tr>
                  <td style={{ paddingTop: '8px' }}>
                    <Text style={label}>Budget:</Text>
                    <Text style={value}>${budget.toLocaleString()} USD</Text>
                  </td>
                </tr>
              )}
            </table>
          </Section>

          <Heading style={h2}>Itinerary</Heading>
          <Section style={section}>
            <div style={itineraryBox}>
              <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
                {destinations.map((destination, index) => (
                  <tr key={index}>
                    <td style={{ paddingBottom: index < destinations.length - 1 ? '12px' : '0' }}>
                      <Text style={destinationName}>
                        Day {destinations.slice(0, index).reduce((sum, d) => sum + d.days, 1)}-
                        {destinations.slice(0, index + 1).reduce((sum, d) => sum + d.days, 0)}: {destination.name}
                      </Text>
                      <Text style={destinationDetails}>
                        {destination.category} • {destination.days} {destination.days === 1 ? 'day' : 'days'}
                      </Text>
                    </td>
                  </tr>
                ))}
              </table>
            </div>
          </Section>

          {specialRequests && (
            <>
              <Heading style={h2}>Special Requests</Heading>
              <Section style={section}>
                <div style={messageBox}>
                  <Text style={messageText}>{specialRequests}</Text>
                </div>
              </Section>
            </>
          )}

          <Hr style={divider} />

          <Section style={footer}>
            <Text style={footerText}>
              <strong>Action Required:</strong> Please respond to the customer at{' '}
              <a href={`mailto:${email}`} style={link}>{email}</a> or{' '}
              <a href={`tel:${phone}`} style={link}>{phone}</a>
            </Text>
            <Text style={footerText}>
              This notification was sent from {companyName} custom package builder.
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
  backgroundColor: '#f3e8ff',
  border: '2px solid #8b5cf6',
  borderRadius: '8px',
  padding: '16px',
  margin: '0 40px 24px',
  textAlign: 'center' as const,
};

const alertText = {
  color: '#6b21a8',
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

const itineraryBox = {
  backgroundColor: '#f9fafb',
  padding: '16px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
};

const destinationName = {
  color: '#1a1a1a',
  fontSize: '15px',
  fontWeight: '600' as const,
  margin: '0 0 4px 0',
};

const destinationDetails = {
  color: '#6b7280',
  fontSize: '13px',
  margin: '0',
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
