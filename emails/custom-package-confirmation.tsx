import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
} from '@react-email/components';

interface CustomPackageConfirmationEmailProps {
  contactName: string;
  name: string;
  numberOfPeople: number;
  duration: string;
}

export default function CustomPackageConfirmationEmail({
  contactName,
  name,
  numberOfPeople,
  duration,
}: CustomPackageConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Custom Package Request Received!</Heading>

          <Text style={greeting}>Dear {contactName},</Text>

          <Text style={paragraph}>
            Thank you for choosing Fox Adventures to create your dream safari experience!
            We've received your custom package request for "{name}".
          </Text>

          <Section style={summaryBox}>
            <Heading style={summaryTitle}>Your Request Summary</Heading>
            <Text style={summaryText}>
              <strong>Package:</strong> {name}<br />
              <strong>Travelers:</strong> {numberOfPeople} {numberOfPeople === 1 ? 'person' : 'people'}<br />
              <strong>Duration:</strong> {duration}
            </Text>
          </Section>

          <Section style={infoBox}>
            <Text style={infoTitle}>What Happens Next?</Text>
            <Text style={infoText}>
              1. Our safari experts will review your custom itinerary<br />
              2. We'll create a personalized quote based on your preferences<br />
              3. You'll receive a detailed proposal within 24-48 hours<br />
              4. We'll work with you to perfect every detail of your adventure
            </Text>
          </Section>

          <Text style={paragraph}>
            We specialize in creating unique, unforgettable safari experiences tailored
            to your interests and budget. Whether you're tracking mountain gorillas,
            seeking the Big Five, or exploring hidden gems, we'll craft the perfect
            journey for you.
          </Text>

          <Text style={paragraph}>
            If you have any immediate questions or would like to discuss your trip,
            feel free to reply to this email or contact us at info@foxadventures.com.
          </Text>

          <Text style={signature}>
            We're excited to help plan your African adventure!<br /><br />
            <strong>The Fox Adventures Team</strong>
          </Text>

          <Section style={footer}>
            <Text style={footerText}>
              Fox Adventures - Unforgettable Safari Experiences<br />
              Email: info@foxadventures.com<br />
              Creating Custom Safaris Since 2024
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
  margin: '40px 0 24px',
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

const summaryBox = {
  backgroundColor: '#eff6ff',
  border: '2px solid #3b82f6',
  borderRadius: '12px',
  padding: '20px',
  margin: '24px 40px',
};

const summaryTitle = {
  color: '#1e40af',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
};

const summaryText = {
  color: '#1e3a8a',
  fontSize: '16px',
  lineHeight: '24px',
  margin: 0,
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
  fontWeight: 'bold',
  margin: '0 0 12px 0',
};

const infoText = {
  color: '#065f46',
  fontSize: '14px',
  lineHeight: '20px',
  margin: 0,
};

const signature = {
  color: '#1a1a1a',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '32px 0 0 0',
  padding: '0 40px',
};

const footer = {
  padding: '24px 40px',
  marginTop: '32px',
  borderTop: '1px solid #e5e7eb',
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: 0,
  textAlign: 'center' as const,
};
