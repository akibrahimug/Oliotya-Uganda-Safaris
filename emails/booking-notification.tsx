import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Row,
  Column,
} from '@react-email/components';

interface BookingNotificationEmailProps {
  confirmationNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  itemName: string;
  bookingType: string;
  numberOfTravelers: number;
  travelDateFrom: string;
  travelDateTo: string;
  totalPrice: number;
  specialRequests?: string;
}

export default function BookingNotificationEmail({
  confirmationNumber,
  firstName,
  lastName,
  email,
  phone,
  country,
  itemName,
  bookingType,
  numberOfTravelers,
  travelDateFrom,
  travelDateTo,
  totalPrice,
  specialRequests,
}: BookingNotificationEmailProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Booking Received!</Heading>

          <Section style={alertBox}>
            <Text style={alertText}>
              Confirmation Number: <strong>{confirmationNumber}</strong>
            </Text>
          </Section>

          <Heading style={h2}>Customer Information</Heading>
          <Section style={section}>
            <Row>
              <Column>
                <Text style={label}>Name:</Text>
                <Text style={value}>{firstName} {lastName}</Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={label}>Email:</Text>
                <Text style={value}>
                  <a href={`mailto:${email}`} style={link}>{email}</a>
                </Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={label}>Phone:</Text>
                <Text style={value}>{phone}</Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={label}>Country:</Text>
                <Text style={value}>{country}</Text>
              </Column>
            </Row>
          </Section>

          <Heading style={h2}>Booking Details</Heading>
          <Section style={section}>
            <Row>
              <Column>
                <Text style={label}>Type:</Text>
                <Text style={value}>{bookingType}</Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={label}>{bookingType === 'PACKAGE' ? 'Package' : 'Destination'}:</Text>
                <Text style={value}>{itemName}</Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={label}>Number of Travelers:</Text>
                <Text style={value}>{numberOfTravelers}</Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={label}>Travel Dates:</Text>
                <Text style={value}>
                  {formatDate(travelDateFrom)} - {formatDate(travelDateTo)}
                </Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={label}>Total Price:</Text>
                <Text style={priceValue}>${totalPrice.toLocaleString()}</Text>
              </Column>
            </Row>
          </Section>

          {specialRequests && (
            <>
              <Heading style={h2}>Special Requests</Heading>
              <Section style={section}>
                <Text style={messageText}>{specialRequests}</Text>
              </Section>
            </>
          )}

          <Section style={footer}>
            <Text style={footerText}>
              Reply to this customer at {email}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0 20px',
  padding: '0 40px',
};

const h2 = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '32px 0 16px',
  padding: '0 40px',
};

const alertBox = {
  backgroundColor: '#fef3c7',
  border: '2px solid #fbbf24',
  borderRadius: '8px',
  padding: '16px',
  margin: '0 40px 24px',
};

const alertText = {
  color: '#92400e',
  fontSize: '16px',
  margin: 0,
  textAlign: 'center' as const,
};

const section = {
  padding: '0 40px',
  marginBottom: '16px',
};

const label = {
  color: '#6b7280',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  margin: '0 0 4px 0',
};

const value = {
  color: '#1a1a1a',
  fontSize: '16px',
  margin: '0 0 16px 0',
};

const priceValue = {
  color: '#059669',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
};

const messageText = {
  color: '#1a1a1a',
  fontSize: '16px',
  lineHeight: '24px',
  backgroundColor: '#f9fafb',
  padding: '16px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  whiteSpace: 'pre-wrap' as const,
  margin: '0 40px',
};

const link = {
  color: '#2563eb',
  textDecoration: 'none',
};

const footer = {
  padding: '24px 40px',
  marginTop: '32px',
  borderTop: '1px solid #e5e7eb',
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: 0,
};
