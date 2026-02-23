import { Container, Typography, Box } from '@mui/material';

export default function Privacy() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box>
        <Typography variant="h3" component="h1" gutterBottom>
          Privacy Policy
        </Typography>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Last updated: {new Date().toLocaleDateString()}
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            1. Information We Collect
          </Typography>
          <Typography variant="body1" paragraph>
            When you use Tempsy, we may collect the following information:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ ml: 2 }}>
            <li>Basic profile information from your Google account (name, email address, profile picture) when you sign in with Google</li>
            <li>Learning progress and exercise completion data</li>
            <li>Usage data to improve the application</li>
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            2. How We Use Your Information
          </Typography>
          <Typography variant="body1" paragraph>
            We use the information we collect to:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ ml: 2 }}>
            <li>Provide and maintain the Tempsy learning platform</li>
            <li>Authenticate your account and manage your access</li>
            <li>Track your learning progress and personalize your experience</li>
            <li>Improve our services and develop new features</li>
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            3. Data Storage and Security
          </Typography>
          <Typography variant="body1" paragraph>
            Your data is securely stored on AWS servers. We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            4. Third-Party Services
          </Typography>
          <Typography variant="body1" paragraph>
            We use Google OAuth for authentication. When you sign in with Google, you are also subject to Google's Privacy Policy. We do not share your personal information with third parties except as necessary to provide our services.
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            5. Your Rights
          </Typography>
          <Typography variant="body1" paragraph>
            You have the right to:
          </Typography>
          <Typography variant="body1" component="ul" sx={{ ml: 2 }}>
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your account and associated data</li>
            <li>Withdraw consent for data processing</li>
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            6. Data Retention
          </Typography>
          <Typography variant="body1" paragraph>
            We retain your personal information for as long as your account is active or as needed to provide you services. If you wish to delete your account, please contact us and we will remove your data from our systems.
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            7. Children's Privacy
          </Typography>
          <Typography variant="body1" paragraph>
            Our service is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13.
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            8. Changes to This Privacy Policy
          </Typography>
          <Typography variant="body1" paragraph>
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date.
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            9. Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions about this Privacy Policy, please contact us through the application or via email.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
