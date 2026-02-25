import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
} from "@react-email/components";

interface SubscribeNotificationEmailProps {
  subscriptionId: number;
  email: string;
  subscribedAt: string;
  companyName?: string;
  contactEmail?: string;
  primaryColor?: string;
  accentColor?: string;
}

export default function SubscribeNotificationEmail({
  subscriptionId,
  email,
  subscribedAt,
  companyName = "Oliotya Uganda Safaris",
  contactEmail = "info@oliotyaugandasafaris.com",
  primaryColor = "#059669",
  accentColor = "#0ea5e9",
}: SubscribeNotificationEmailProps) {
  const formattedDate = new Date(subscribedAt).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const h1Style = { ...h1, color: primaryColor };
  const alertBoxStyle = {
    ...alertBox,
    backgroundColor: `${accentColor}1a`,
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
          <Heading style={h1Style}>New Newsletter Subscription</Heading>

          <Section style={alertBoxStyle}>
            <Text style={alertText}>
              Subscription ID: <strong>#{subscriptionId}</strong>
            </Text>
          </Section>

          <Heading style={h2}>Subscriber Details</Heading>
          <Section style={section}>
            <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
              <tr>
                <td>
                  <Text style={label}>Email</Text>
                  <Text style={value}>
                    <a href={`mailto:${email}`} style={link}>
                      {email}
                    </a>
                  </Text>
                </td>
              </tr>
              <tr>
                <td style={{ paddingTop: "8px" }}>
                  <Text style={label}>Subscribed At</Text>
                  <Text style={value}>{formattedDate}</Text>
                </td>
              </tr>
            </table>
          </Section>

          <Hr style={divider} />

          <Section style={footer}>
            <Text style={footerText}>
              This notification was sent from {companyName} newsletter signup form.
            </Text>
            <Text style={footerText}>Support: {contactEmail}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  WebkitFontSmoothing: "antialiased" as const,
  MozOsxFontSmoothing: "grayscale" as const,
  padding: "0",
  margin: "0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
  width: "100%",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
};

const h1 = {
  color: "#059669",
  fontSize: "24px",
  fontWeight: "bold" as const,
  margin: "40px 0 20px",
  padding: "0 40px",
  textAlign: "center" as const,
};

const h2 = {
  color: "#1a1a1a",
  fontSize: "18px",
  fontWeight: "bold" as const,
  margin: "24px 0 12px",
  padding: "0 40px",
};

const alertBox = {
  backgroundColor: "#e0f2fe",
  border: "2px solid #0ea5e9",
  borderRadius: "8px",
  padding: "16px",
  margin: "0 40px 24px",
  textAlign: "center" as const,
};

const alertText = {
  color: "#075985",
  fontSize: "16px",
  margin: "0",
  fontWeight: "600" as const,
};

const section = {
  padding: "0 40px",
  marginBottom: "16px",
};

const label = {
  color: "#6b7280",
  fontSize: "12px",
  fontWeight: "600" as const,
  textTransform: "uppercase" as const,
  margin: "0 0 4px 0",
  letterSpacing: "0.5px",
};

const value = {
  color: "#1a1a1a",
  fontSize: "16px",
  margin: "0 0 4px 0",
  lineHeight: "22px",
};

const link = {
  color: "#2563eb",
  textDecoration: "underline" as const,
  fontWeight: "500" as const,
};

const divider = {
  borderTop: "2px solid #e5e7eb",
  margin: "32px 40px",
  width: "auto",
};

const footer = {
  padding: "24px 40px 0px",
  marginTop: "0px",
};

const footerText = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "4px 0",
  textAlign: "center" as const,
};
