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

interface CustomPackageConfirmationEmailProps {
  packageId: number;
  contactName: string;
  name: string;
  email: string;
  phone: string;
  destinations: Array<{
    name: string;
    category: string;
    days: number;
  }>;
  numberOfPeople: number;
  duration: string;
  travelDate?: string | null;
  budget?: number | null;
  specialRequests?: string | null;
  companyName?: string;
  contactEmail?: string;
  primaryColor?: string;
  accentColor?: string;
}

export default function CustomPackageConfirmationEmail({
  packageId,
  contactName,
  name,
  email,
  phone,
  destinations,
  numberOfPeople,
  duration,
  travelDate,
  budget,
  specialRequests,
  companyName = 'Oliotya Uganda Safaris',
  contactEmail = 'Info@oliotyaugandasafaris.com',
  primaryColor = '#059669',
  accentColor = '#3b82f6',
}: CustomPackageConfirmationEmailProps) {
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
  const h2Style = { ...h2, color: primaryColor };
  const summaryBoxStyle = {
    ...summaryBox,
    backgroundColor: `${primaryColor}10`,
    borderColor: primaryColor,
  };
  const infoBoxStyle = {
    ...infoBox,
    backgroundColor: `${accentColor}15`,
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
          <Heading style={h1Style}>Custom Package Request Received!</Heading>

          <Text style={greeting}>Dear {contactName},</Text>

          <Text style={paragraph}>
            Thank you for choosing {companyName} to create your dream safari experience!
            We've received your custom package request for "<strong>{name}</strong>".
          </Text>

          <Section style={summaryBoxStyle}>
            <Text style={summaryTitle}>Your Request Summary</Text>
            <table width="100%" cellPadding="0" cellSpacing="0" role="presentation" style={{ marginTop: '12px' }}>
              <tr>
                <td style={{ paddingBottom: '8px' }}>
                  <Text style={label}>Request ID:</Text>
                  <Text style={value}>#{packageId}</Text>
                </td>
              </tr>
              <tr>
                <td style={{ paddingBottom: '8px' }}>
                  <Text style={label}>Package:</Text>
                  <Text style={value}>{name}</Text>
                </td>
              </tr>
              <tr>
                <td style={{ paddingBottom: '8px' }}>
                  <Text style={label}>Travelers:</Text>
                  <Text style={value}>{numberOfPeople} {numberOfPeople === 1 ? 'person' : 'people'}</Text>
                </td>
              </tr>
              <tr>
                <td style={{ paddingBottom: travelDate || (budget && budget > 0) ? '8px' : '0' }}>
                  <Text style={label}>Duration:</Text>
                  <Text style={value}>{duration}</Text>
                </td>
              </tr>
              {travelDate && (
                <tr>
                  <td style={{ paddingBottom: budget && budget > 0 ? '8px' : '0' }}>
                    <Text style={label}>Preferred Travel Date:</Text>
                    <Text style={value}>{formatDate(travelDate)}</Text>
                  </td>
                </tr>
              )}
              {budget && budget > 0 && (
                <tr>
                  <td>
                    <Text style={label}>Budget per Person:</Text>
                    <Text style={value}>${budget.toLocaleString()} USD</Text>
                  </td>
                </tr>
              )}
            </table>
          </Section>

          <Heading style={h2Style}>Submitted Contact Information</Heading>
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

          <Heading style={h2Style}>Your Selected Destinations</Heading>
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
              <Heading style={h2Style}>Your Special Requests</Heading>
              <Section style={section}>
                <div style={messageBox}>
                  <Text style={messageText}>{specialRequests}</Text>
                </div>
              </Section>
            </>
          )}

          <Section style={infoBoxStyle}>
            <Text style={infoTitle}>What Happens Next?</Text>
            <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
              <tr>
                <td style={infoText}>
                  1. Our safari experts will review your custom itinerary
                </td>
              </tr>
              <tr>
                <td style={{ ...infoText, paddingTop: '8px' }}>
                  2. We'll create a personalized quote based on your preferences
                </td>
              </tr>
              <tr>
                <td style={{ ...infoText, paddingTop: '8px' }}>
                  3. You'll receive a detailed proposal within 24-48 hours
                </td>
              </tr>
              <tr>
                <td style={{ ...infoText, paddingTop: '8px' }}>
                  4. We'll work with you to perfect every detail of your adventure
                </td>
              </tr>
            </table>
          </Section>

          <Text style={paragraph}>
            We specialize in creating unique, unforgettable safari experiences tailored
            to your interests and budget. Whether you're tracking mountain gorillas,
            seeking the Big Five, or exploring hidden gems, we'll craft the perfect
            journey for you.
          </Text>

          <Text style={paragraph}>
            If you have any questions or would like to discuss your request,
            please don't hesitate to contact us at {contactEmail}.
          </Text>

          <Text style={signature}>
            We're excited to start planning your adventure!
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
  fontSize: '26px',
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

const summaryBox = {
  backgroundColor: '#ecfdf5',
  border: '2px solid #059669',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 40px',
};

const summaryTitle = {
  color: '#065f46',
  fontSize: '18px',
  fontWeight: 'bold' as const,
  margin: '0',
};

const h2 = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: 'bold' as const,
  margin: '24px 0 12px',
  padding: '0 40px',
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

const infoBox = {
  backgroundColor: '#eff6ff',
  border: '2px solid #3b82f6',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 40px',
};

const infoTitle = {
  color: '#1e40af',
  fontSize: '18px',
  fontWeight: 'bold' as const,
  margin: '0 0 12px 0',
};

const infoText = {
  color: '#1e3a8a',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};

const link = {
  color: '#2563eb',
  textDecoration: 'underline' as const,
  fontWeight: '500' as const,
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
