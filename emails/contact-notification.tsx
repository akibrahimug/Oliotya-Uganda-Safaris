import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
} from '@react-email/components';

interface ContactNotificationEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
  inquiryId: number;
}

export default function ContactNotificationEmail({
  name,
  email,
  subject,
  message,
  inquiryId,
}: ContactNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Contact Form Submission</Heading>

          <Section style={section}>
            <Text style={label}>Inquiry ID:</Text>
            <Text style={value}>#{inquiryId}</Text>
          </Section>

          <Section style={section}>
            <Text style={label}>From:</Text>
            <Text style={value}>{name}</Text>
          </Section>

          <Section style={section}>
            <Text style={label}>Email:</Text>
            <Text style={value}>
              <a href={`mailto:${email}`} style={link}>
                {email}
              </a>
            </Text>
          </Section>

          <Section style={section}>
            <Text style={label}>Subject:</Text>
            <Text style={value}>{subject}</Text>
          </Section>

          <Section style={section}>
            <Text style={label}>Message:</Text>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Respond to this inquiry by replying to {email}
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
  margin: '40px 0',
  padding: '0 40px',
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
