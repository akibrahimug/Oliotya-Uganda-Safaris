import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
} from '@react-email/components';

interface ContactConfirmationEmailProps {
  name: string;
  subject: string;
}

export default function ContactConfirmationEmail({
  name,
  subject,
}: ContactConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Thank You for Contacting Fox Adventures</Heading>

          <Text style={greeting}>Dear {name},</Text>

          <Text style={paragraph}>
            Thank you for reaching out to us regarding "{subject}". We've received your
            message and our team will get back to you within 24 hours.
          </Text>

          <Text style={paragraph}>
            At Fox Adventures, we're passionate about creating unforgettable safari
            experiences. Whether you're dreaming of gorilla trekking in Bwindi,
            witnessing the Big Five, or exploring Uganda's pristine landscapes,
            we're here to make it happen.
          </Text>

          <Section style={infoBox}>
            <Text style={infoTitle}>What's Next?</Text>
            <Text style={infoText}>
              • Our team will review your inquiry<br />
              • We'll respond with personalized recommendations<br />
              • You'll receive a detailed quote tailored to your needs
            </Text>
          </Section>

          <Text style={paragraph}>
            In the meantime, feel free to explore our safari packages and
            destinations on our website.
          </Text>

          <Text style={signature}>
            Best regards,<br />
            <strong>The Fox Adventures Team</strong>
          </Text>

          <Section style={footer}>
            <Text style={footerText}>
              Fox Adventures - Unforgettable Safari Experiences<br />
              Email: info@foxadventures.com
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
