import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
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
}: CustomPackageNotificationEmailProps) {
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
          <Heading style={h1}>New Custom Package Request</Heading>

          <Section style={alertBox}>
            <Text style={alertText}>
              Package Request ID: <strong>#{packageId}</strong>
            </Text>
          </Section>

          <Heading style={h2}>Customer Information</Heading>
          <Section style={section}>
            <Text style={label}>Name:</Text>
            <Text style={value}>{contactName}</Text>

            <Text style={label}>Email:</Text>
            <Text style={value}>
              <a href={`mailto:${email}`} style={link}>{email}</a>
            </Text>

            <Text style={label}>Phone:</Text>
            <Text style={value}>{phone}</Text>
          </Section>

          <Heading style={h2}>Package Details</Heading>
          <Section style={section}>
            <Text style={label}>Package Name:</Text>
            <Text style={value}>{name}</Text>

            <Text style={label}>Number of People:</Text>
            <Text style={value}>{numberOfPeople}</Text>

            <Text style={label}>Total Duration:</Text>
            <Text style={value}>{duration}</Text>

            {travelDate && (
              <>
                <Text style={label}>Preferred Travel Date:</Text>
                <Text style={value}>{formatDate(travelDate)}</Text>
              </>
            )}

            {budget && (
              <>
                <Text style={label}>Budget:</Text>
                <Text style={priceValue}>${budget.toLocaleString()} USD</Text>
              </>
            )}
          </Section>

          <Heading style={h2}>Selected Destinations ({destinations.length})</Heading>
          <Section style={section}>
            {destinations.map((dest, index) => (
              <Section key={index} style={destinationBox}>
                <Text style={destinationName}>{dest.name}</Text>
                <Text style={destinationInfo}>
                  {dest.category} • {dest.days} {dest.days === 1 ? 'day' : 'days'}
                </Text>
              </Section>
            ))}
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
              Reply to this customer at {email} to provide a custom quote
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
  backgroundColor: '#dbeafe',
  border: '2px solid #3b82f6',
  borderRadius: '8px',
  padding: '16px',
  margin: '0 40px 24px',
};

const alertText = {
  color: '#1e40af',
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

const destinationBox = {
  backgroundColor: '#f0fdf4',
  border: '1px solid #86efac',
  borderRadius: '6px',
  padding: '12px 16px',
  marginBottom: '8px',
};

const destinationName = {
  color: '#065f46',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 4px 0',
};

const destinationInfo = {
  color: '#059669',
  fontSize: '14px',
  margin: 0,
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
