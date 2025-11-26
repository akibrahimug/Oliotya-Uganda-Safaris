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

interface BookingConfirmationEmailProps {
  firstName: string;
  confirmationNumber: string;
  itemName: string;
  numberOfTravelers: number;
  travelDateFrom: string;
  travelDateTo: string;
  totalPrice: number;
  companyName?: string;
  contactEmail?: string;
  primaryColor?: string;
  accentColor?: string;
}

export default function BookingConfirmationEmail({
  firstName,
  confirmationNumber,
  itemName,
  numberOfTravelers,
  travelDateFrom,
  travelDateTo,
  totalPrice,
  companyName = 'Nambi Uganda Safaris',
  contactEmail = 'info@nambiugandasafaris.com',
  primaryColor = '#059669',
  accentColor = '#3b82f6',
}: BookingConfirmationEmailProps) {
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
  const confirmationBoxStyle = {
    ...confirmationBox,
    backgroundColor: `${primaryColor}15`, // 15 is approx 8% opacity in hex
    borderColor: primaryColor,
  };
  const confirmationNumberStyle = { ...confirmationNumber, color: primaryColor };
  const priceValueStyle = { ...priceValue, color: primaryColor };
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
          <Heading style={h1Style}>Booking Confirmed!</Heading>

          <Text style={greeting}>Dear {firstName},</Text>

          <Text style={paragraph}>
            Thank you for booking with {companyName}! Your safari adventure is confirmed.
          </Text>

          <Section style={confirmationBoxStyle}>
            <Text style={confirmationTitle}>Confirmation Number</Text>
            <Text style={confirmationNumberStyle}>{confirmationNumber}</Text>
            <Text style={confirmationSubtext}>
              Please save this number for your records
            </Text>
          </Section>

          <Heading style={h2}>Your Booking Details</Heading>

          <Section style={detailsBox}>
            <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
              <tr>
                <td>
                  <Text style={detailLabel}>Safari Package/Destination:</Text>
                  <Text style={detailValue}>{itemName}</Text>
                </td>
              </tr>
              <tr>
                <td style={{ paddingTop: '12px' }}>
                  <Text style={detailLabel}>Number of Travelers:</Text>
                  <Text style={detailValue}>{numberOfTravelers} {numberOfTravelers === 1 ? 'person' : 'people'}</Text>
                </td>
              </tr>
              <tr>
                <td style={{ paddingTop: '12px' }}>
                  <Text style={detailLabel}>Travel Dates:</Text>
                  <Text style={detailValue}>
                    {formatDate(travelDateFrom)} to {formatDate(travelDateTo)}
                  </Text>
                </td>
              </tr>
              <tr>
                <td style={{ paddingTop: '12px' }}>
                  <Text style={detailLabel}>Total Price:</Text>
                  <Text style={priceValueStyle}>${totalPrice.toLocaleString()} USD</Text>
                </td>
              </tr>
            </table>
          </Section>

          <Section style={infoBoxStyle}>
            <Text style={infoTitle}>What Happens Next?</Text>
            <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
              <tr>
                <td style={infoText}>
                  1. Our team will review your booking details
                </td>
              </tr>
              <tr>
                <td style={{ ...infoText, paddingTop: '8px' }}>
                  2. We'll send you a detailed itinerary within 48 hours
                </td>
              </tr>
              <tr>
                <td style={{ ...infoText, paddingTop: '8px' }}>
                  3. You'll receive payment instructions
                </td>
              </tr>
              <tr>
                <td style={{ ...infoText, paddingTop: '8px' }}>
                  4. We'll confirm final arrangements 2 weeks before departure
                </td>
              </tr>
            </table>
          </Section>

          <Text style={paragraph}>
            If you have any questions or need to make changes to your booking,
            please contact us at {contactEmail} or reply to this email
            with your confirmation number.
          </Text>

          <Text style={signature}>
            We can't wait to welcome you on this incredible journey!
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
            <Text style={footerText}>
              Confirmation: {confirmationNumber}
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
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 0 24px',
  padding: '0 40px',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#1a1a1a',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '32px 0 16px',
  padding: '0 40px',
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

const confirmationBox = {
  backgroundColor: '#ecfdf5',
  border: '3px solid #059669',
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 40px',
  textAlign: 'center' as const,
};

const confirmationTitle = {
  color: '#065f46',
  fontSize: '14px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  margin: '0 0 8px 0',
};

const confirmationNumber = {
  color: '#059669',
  fontSize: '32px',
  fontWeight: 'bold',
  letterSpacing: '2px',
  margin: '0 0 8px 0',
};

const confirmationSubtext = {
  color: '#065f46',
  fontSize: '12px',
  margin: 0,
};

const detailsBox = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '20px',
  margin: '0 40px 24px',
};

const detailLabel = {
  color: '#6b7280',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  margin: '16px 0 4px 0',
};

const detailValue = {
  color: '#1a1a1a',
  fontSize: '16px',
  margin: '0 0 4px 0',
};

const priceValue = {
  color: '#059669',
  fontSize: '24px',
  fontWeight: 'bold',
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
  fontWeight: 'bold',
  margin: '0 0 12px 0',
};

const infoText = {
  color: '#1e3a8a',
  fontSize: '14px',
  lineHeight: '22px',
  margin: 0,
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
