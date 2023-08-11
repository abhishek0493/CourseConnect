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
    // <section className="consent">
    //   <div class="container py-4">
    //     <header class="pb-3 mb-4 border-bottom text-center">
    //       <span class="fs-3">Participant Information Sheet</span>
    //     </header>
    //     <div class="p-5 mb-4 bg-light rounded-3">
    //       <div class="container-fluid">
    //         <h2 className="display-6 fw-bold">
    //           CourseConnect - Enhancing online course discussions for
    //           collaborative learning
    //         </h2>
    //         <p className="lead py-4 text-primary-emphasis">
    //           You are being invited to take part in a research project. Before
    //           you decide, it is important for you to understand why the research
    //           is being done and what it will involve. Please read the following
    //           information carefully and feel free to discuss it with others. If
    //           you have any questions or need further information, please ask.
    //           Take your time to decide whether you wish to participate.
    //         </p>
    //         <h3 class="mt-5">Purpose of the Project</h3>
    //         <p>
    //           The purpose of this project is to create a user-centric web
    //           application that addresses the challenges faced by learners in the
    //           current decentralized online learning environment. The project
    //           aims to provide a centralized platform for course sharing,
    //           discussions, and community engagement, enhancing the overall
    //           online learning experience.
    //         </p>
    //         <h3 class="mt-5">Voluntary Participation</h3>
    //         <p>
    //           Participation in this project is entirely voluntary. You have the
    //           right to decide whether or not to take part. Your decision will
    //           not have any consequences on your academic standing or any other
    //           aspect.
    //         </p>
    //         <h3 class="mt-5">Right to Withdraw</h3>
    //         <p>
    //           You have the right to change your mind about participating in this
    //           project at any time. If you decide to withdraw, all of your
    //           information will be promptly removed and no further data will be
    //           collected from you.
    //         </p>
    //         <h3 class="mt-5">Involvement in the Study</h3>
    //         <p>
    //           Taking part in this project would involve activities such as
    //           testing the web application, providing feedback, and potentially
    //           participating in interviews or surveys. The specific tasks and
    //           time commitment will be discussed and agreed upon based on your
    //           availability and preferences.
    //         </p>
    //         <h3 class="mt-5">Reimbursement</h3>
    //         <p>
    //           There will be no reimbursement for participating in the online
    //           interview process.
    //         </p>
    //         <h3 class="mt-5">Advantages and Disadvantages</h3>
    //         <p>
    //           The advantages of participating include the opportunity to
    //           influence the development of a user-centric online learning
    //           platform and contribute to improving the overall online learning
    //           experience. However, there are no direct disadvantages or risks
    //           associated with participation, as the project primarily focuses on
    //           gathering feedback and opinions.
    //         </p>
    //         <h3 class="mt-5">Information Collection</h3>
    //         <p>
    //           During the course of the project, we will seek information from
    //           you related to your experience with online learning, preferences
    //           for course sharing and discussion, and feedback on the web
    //           application's usability and features. This information is
    //           essential for understanding user needs, shaping the platform's
    //           functionalities, and achieving the project's objectives.
    //         </p>
    //         <h3 class="mt-5">Recording and Media Usage</h3>
    //         <p>
    //           There won't be any online interviews required for this research.
    //         </p>
    //         <h3 class="mt-5">Information Management</h3>
    //         <p>
    //           Bournemouth University (BU) is the organization with overall
    //           responsibility for this study and the Data Controller of your
    //           personal information. We handle research data in accordance with
    //           ethical requirements and current data protection laws. Your
    //           personal information will be used only for the purposes of this
    //           study or related uses identified in the Privacy Notice or this
    //           Information Sheet. We will anonymize data whenever possible to
    //           safeguard your rights and protect your privacy.
    //         </p>
    //         <h3 class="mt-5">Publication</h3>
    //         <p>
    //           You will not be able to be identified in any external reports or
    //           publications about the research without your specific consent.
    //           Otherwise, your information will only be included in these
    //           materials in an anonymous form, i.e., you will not be
    //           identifiable.
    //         </p>
    //         <h3 class="mt-5">Security and Access Controls</h3>
    //         <p>
    //           All collected data will be treated with the utmost confidentiality
    //           and stored securely. Access to the data will be restricted to the
    //           research team members involved in the project. Personal
    //           information will be coded and kept separate from research data to
    //           maintain anonymity.
    //         </p>
    //         <h3 class="mt-5">
    //           Sharing Your Personal Information with Third Parties
    //         </h3>
    //         <p>
    //           This research will not share any personal information with any
    //           third parties.
    //         </p>
    //         <h3 class="mt-5">Further Use of Your Information</h3>
    //         <p>
    //           All information collected will be represented in the form of
    //           research output, which can be used for any further research.
    //         </p>{' '}
    //         <h3 class="mt-5">
    //           Keeping Your Information if You Withdraw from the Study
    //         </h3>
    //         <p>
    //           If you withdraw from active participation in the study, we will
    //           keep information that we have already collected from or about you
    //           if it has ongoing relevance or value to the study. As explained
    //           above, your legal rights to access, change, delete, or move this
    //           information are limited as we need to manage your information in
    //           specific ways for the research to be reliable and accurate.
    //           However, if you have concerns about how this will affect you
    //           personally, you can raise these with the research team when you
    //           withdraw from the study.
    //         </p>
    //         <h3 class="mt-5">Retention of Research Data</h3>
    //         <p>
    //           The participant information will be removed from the research once
    //           the requirements are finalized. Project governance documentation,
    //           including copies of signed participant agreements, will be kept
    //           for a 3-month period after completion of the research. Research
    //           results will be anonymized and retained indefinitely for future
    //           research purposes.
    //         </p>
    //         <p>
    //           If you have any questions or would like further information,
    //           please contact:
    //         </p>
    //         <ul>
    //           <li>
    //             Abhishek Padaya (
    //             <a href="mailto:s5511326@bournemouth.ac.uk">
    //               s5511326@bournemouth.ac.uk
    //             </a>
    //             )
    //           </li>
    //           <li>
    //             Festus (
    //             <a href="mailto:fadedoyin@bournemouth.ac.uk">
    //               fadedoyin@bournemouth.ac.uk
    //             </a>
    //             )
    //           </li>
    //         </ul>
    //         <h3 class="mt-5">In Case of Complaints</h3>
    //         <p>
    //           Any concerns about the study should be directed to Bournemouth
    //           University by email to
    //           <a
    //             href="mailto:researchgovernance@bournemouth.ac.uk"
    //             className="mx-1"
    //           >
    //             researchgovernance@bournemouth.ac.uk
    //           </a>
    //           .
    //         </p>
    //         <p>
    //           Thank you for considering taking part in this research project.
    //         </p>
    //       </div>
    //     </div>

    //     <div class="row align-items-md-stretch">
    //       <form onSubmit={handleSubmit}>
    //         <div class="col-md-12">
    //           <div class="h-100 p-5 bg-info-subtle border rounded-3">
    //             <h5>
    //               By checking the box below, I confirm that I have read and
    //               understood the information provided above. I voluntarily agree
    //               to participate in this research study and consent to the use
    //               of my data as described.
    //             </h5>
    //             <div class="form-check mt-3">
    //               <input
    //                 class="form-check-input"
    //                 type="checkbox"
    //                 checked={consentChecked}
    //                 onChange={handleCheckboxChange}
    //                 id="flexCheckDefault"
    //               />
    //               <label class="form-check-label" for="flexCheckDefault">
    //                 I consent to participate in this research study.
    //               </label>
    //             </div>
    //             <button
    //               type="submit"
    //               class="btn btn-primary my-3"
    //               disabled={!consentChecked}
    //             >
    //               Proceed to Sign-up
    //             </button>
    //           </div>
    //         </div>
    //       </form>
    //     </div>

    //     <footer class="pt-3 mt-4 text-muted border-top">© 2023</footer>
    //   </div>
    // </section>
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
