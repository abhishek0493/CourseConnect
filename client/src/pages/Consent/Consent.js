import React from 'react';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './consent.css';

import {
  Typography,
  Container,
  Box,
  Paper,
  FormControlLabel,
  Checkbox,
  Button,
  List,
  ListItem,
  ListItemText,
  Grid,
  Divider,
} from '@mui/material';

import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
}));

const Consent = () => {
  const [consentChecked, setConsentChecked] = useState(false);
  const navigate = useNavigate();

  const handleCheckboxChange = (event) => {
    setConsentChecked(event.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (consentChecked) {
      navigate('/sign-up', {
        state: consentChecked,
      });
    } else {
      alert('Consent is required to proceed.');
    }
  };

  return (
    <section className="consent">
      <Container>
        <StyledPaper elevation={3}>
          <Typography variant="h4" align="center" gutterBottom>
            Participant Information Sheet
          </Typography>
          <Divider sx={{ mb: 4 }} />
          <Typography variant="h5" fontWeight="bold">
            CourseConnect - Enhancing online course discussions for
            collaborative learning
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            You are being invited to take part in a research project. Before you
            decide, it is important for you to understand why the research is
            being done and what it will involve. Please read the following
            information carefully and feel free to discuss it with others. If
            you have any questions or need further information, please ask. Take
            your time to decide whether you wish to participate.
          </Typography>
          <Divider sx={{ mb: 4 }} />
          <Typography variant="h5" fontWeight={'bold'}>
            Purpose of the Project
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            The purpose of this project is to create a user-centric web
            application that addresses the challenges faced by learners in the
            current decentralized online learning environment. The project aims
            to provide a centralized platform for course sharing, discussions,
            and community engagement, enhancing the overall online learning
            experience.
          </Typography>
          <Divider sx={{ mb: 4 }} />
          <Typography variant="h5" fontWeight={'bold'}>
            Voluntary Participation
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Participation in this project is entirely voluntary. You have the
            right to decide whether or not to take part. Your decision will not
            have any consequences on your academic standing or any other aspect.
          </Typography>
          <Divider sx={{ mb: 4 }} />
          <Typography variant="h5" fontWeight={'bold'}>
            Right to Withdraw
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            You have the right to change your mind about participating in this
            project at any time. If you decide to withdraw, all of your
            information will be promptly removed and no further data will be
            collected from you.
          </Typography>
          <Divider sx={{ mb: 4 }} />
          <Typography variant="h5" fontWeight={'bold'}>
            Involvement in the study
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Taking part in this project would involve activities such as testing
            the web application, providing feedback, and potentially
            participating in interviews or surveys. The specific tasks and time
            commitment will be discussed and agreed upon based on your
            availability and preferences.
          </Typography>
          <Divider sx={{ mb: 4 }} />
          <Typography variant="h5" fontWeight={'bold'}>
            Reimbursement
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            There will be no reimbursement for participating in the online
            interview process.
          </Typography>
          <Divider sx={{ mb: 4 }} />
          <Typography variant="h5" fontWeight={'bold'}>
            Advantages & Disadvantages
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            The advantages of participating include the opportunity to influence
            the development of a user-centric online learning platform and
            contribute to improving the overall online learning experience.
            However, there are no direct disadvantages or risks associated with
            participation, as the project primarily focuses on gathering
            feedback and opinions.
          </Typography>
          <Divider sx={{ mb: 4 }} />
          <Typography variant="h5" fontWeight={'bold'}>
            Information Collection
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            During the course of the project, we will seek information from you
            related to your experience with online learning, preferences for
            course sharing and discussion, and feedback on the web application's
            usability and features. This information is essential for
            understanding user needs, shaping the platform's functionalities,
            and achieving the project's objectives.
          </Typography>
          <Divider sx={{ mb: 4 }} />
          <Typography variant="h5" fontWeight={'bold'}>
            Recording & Media usage
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            There won't be any online interviews required for this research.
          </Typography>
          <Divider sx={{ mb: 4 }} />
          <Typography variant="h5" fontWeight={'bold'}>
            Information Management
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Bournemouth University (BU) is the organization with overall
            responsibility for this study and the Data Controller of your
            personal information. We handle research data in accordance with
            ethical requirements and current data protection laws. Your personal
            information will be used only for the purposes of this study or
            related uses identified in the Privacy Notice or this Information
            Sheet. We will anonymize data whenever possible to safeguard your
            rights and protect your privacy.
          </Typography>
          <Divider sx={{ mb: 4 }} />
          <Typography variant="h5" fontWeight={'bold'}>
            Publication
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            You will not be able to be identified in any external reports or
            publications about the research without your specific consent.
            Otherwise, your information will only be included in these materials
            in an anonymous form, i.e., you will not be identifiable.
          </Typography>
          <Divider sx={{ mb: 4 }} />
          <Typography variant="h5" fontWeight={'bold'}>
            Security & Access Control
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            All collected data will be treated with the utmost confidentiality
            and stored securely. Access to the data will be restricted to the
            research team members involved in the project. Personal information
            will be coded and kept separate from research data to maintain
            anonymity.
          </Typography>

          <Divider sx={{ mb: 4 }} />
          <Typography variant="h5" fontWeight={'bold'}>
            Sharing Your Personal Information with Third Parties
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            This research will not share any personal information with any third
            parties.
          </Typography>
          <Divider sx={{ mb: 4 }} />
          <Typography variant="h5" fontWeight={'bold'}>
            Use of your information
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            All information collected will be represented in the form of
            research output, which can be used for any further research.
          </Typography>

          <Divider sx={{ mb: 4 }} />
          <Typography variant="h5" fontWeight={'bold'}>
            Keeping Your Information if You Withdraw from the Study
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            If you withdraw from active participation in the study, we will keep
            information that we have already collected from or about you if it
            has ongoing relevance or value to the study. As explained above,
            your legal rights to access, change, delete, or move this
            information are limited as we need to manage your information in
            specific ways for the research to be reliable and accurate. However,
            if you have concerns about how this will affect you personally, you
            can raise these with the research team when you withdraw from the
            study.
          </Typography>
          <Divider sx={{ mb: 4 }} />
          <Typography variant="h5" fontWeight={'bold'}>
            Retention of research data
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            The participant information will be removed from the research once
            the requirements are finalized. Project governance documentation,
            including copies of signed participant agreements, will be kept for
            a 3-month period after completion of the research. Research results
            will be anonymized and retained indefinitely for future research
            purposes.
          </Typography>
          <Divider sx={{ mb: 4 }} />
          <Typography variant="h5" fontWeight={'bold'}>
            If you have any questions or would like further information, please
            contact:
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              columnGap: 3,
              mt: 2,
            }}
          >
            <Box>
              <Typography variant="subtitle1">Abhishek Padaya</Typography>
              <Typography variant="subtitle2">
                <Link to={`mailto:s5511326@bournemouth.ac.uk`}>
                  s5511326@bournemouth.ac.uk
                </Link>
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1">Festus</Typography>
              <Typography variant="subtitle2">
                <Link to={`mailto:fadedoyin@bournemouth.ac.uk`}>
                  fadedoyin@bournemouth.ac.uk
                </Link>
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ mb: 4 }} />
          <Typography variant="h5" fontWeight={'bold'}>
            In Case of Complaints
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Any concerns about the study should be directed to Bournemouth
            University by email to
          </Typography>
          <Link to="mailto:researchgovernance@bournemouth.ac.uk">
            researchgovernance@bournemouth.ac.uk
          </Link>
          <Divider sx={{ mb: 4 }} />
          <Typography variant="h5" fontWeight={'bold'}>
            Thank you for considering taking part in this research project.
          </Typography>
        </StyledPaper>

        <Grid justifyContent="center">
          <Grid item xs={12} md={6}>
            <form onSubmit={handleSubmit}>
              <StyledPaper elevation={3}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  By checking the box below, I confirm that I have read and
                  understood the information provided above. I voluntarily agree
                  to participate in this research study and consent to the use
                  of my data as described.
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={consentChecked}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label="I consent to participate in this research study."
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!consentChecked}
                  sx={{ mt: 3, display: 'block' }}
                >
                  Proceed to Sign-up
                </Button>
              </StyledPaper>
            </form>
          </Grid>
        </Grid>

        <Typography variant="body2" align="center" sx={{ mt: 4 }}>
          © 2023
        </Typography>
      </Container>
    </section>
  );
};

export default Consent;
