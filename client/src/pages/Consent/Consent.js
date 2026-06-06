import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, Mail } from 'lucide-react';

import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { toast } from '../../components/ui/toaster';

const sections = [
  {
    title: 'Purpose of the Project',
    body: 'The purpose of this project is to create a user-centric web application that addresses the challenges faced by learners in the current decentralized online learning environment. The project aims to provide a centralized platform for course sharing, discussions, and community engagement, enhancing the overall online learning experience.',
  },
  {
    title: 'Voluntary Participation',
    body: 'Participation in this project is entirely voluntary. You have the right to decide whether or not to take part. Your decision will not have any consequences on your academic standing or any other aspect.',
  },
  {
    title: 'Right to Withdraw',
    body: 'You have the right to change your mind about participating in this project at any time. If you decide to withdraw, all of your information will be promptly removed and no further data will be collected from you.',
  },
  {
    title: 'Involvement in the study',
    body: 'Taking part in this project would involve activities such as testing the web application, providing feedback, and potentially participating in interviews or surveys. The specific tasks and time commitment will be discussed and agreed upon based on your availability and preferences.',
  },
  {
    title: 'Reimbursement',
    body: 'There will be no reimbursement for participating in the online interview process.',
  },
  {
    title: 'Advantages & Disadvantages',
    body: 'The advantages of participating include the opportunity to influence the development of a user-centric online learning platform and contribute to improving the overall online learning experience. However, there are no direct disadvantages or risks associated with participation, as the project primarily focuses on gathering feedback and opinions.',
  },
  {
    title: 'Information Collection',
    body: "During the course of the project, we will seek information from you related to your experience with online learning, preferences for course sharing and discussion, and feedback on the web application's usability and features. This information is essential for understanding user needs, shaping the platform's functionalities, and achieving the project's objectives.",
  },
  {
    title: 'Recording & Media usage',
    body: "There won't be any online interviews required for this research.",
  },
  {
    title: 'Information Management',
    body: 'Bournemouth University (BU) is the organization with overall responsibility for this study and the Data Controller of your personal information. We handle research data in accordance with ethical requirements and current data protection laws. Your personal information will be used only for the purposes of this study or related uses identified in the Privacy Notice or this Information Sheet. We will anonymize data whenever possible to safeguard your rights and protect your privacy.',
  },
  {
    title: 'Publication',
    body: 'You will not be able to be identified in any external reports or publications about the research without your specific consent. Otherwise, your information will only be included in these materials in an anonymous form, i.e., you will not be identifiable.',
  },
  {
    title: 'Security & Access Control',
    body: 'All collected data will be treated with the utmost confidentiality and stored securely. Access to the data will be restricted to the research team members involved in the project. Personal information will be coded and kept separate from research data to maintain anonymity.',
  },
  {
    title: 'Sharing Your Personal Information with Third Parties',
    body: 'This research will not share any personal information with any third parties.',
  },
  {
    title: 'Use of your information',
    body: 'All information collected will be represented in the form of research output, which can be used for any further research.',
  },
  {
    title: 'Keeping Your Information if You Withdraw from the Study',
    body: 'If you withdraw from active participation in the study, we will keep information that we have already collected from or about you if it has ongoing relevance or value to the study. As explained above, your legal rights to access, change, delete, or move this information are limited as we need to manage your information in specific ways for the research to be reliable and accurate. However, if you have concerns about how this will affect you personally, you can raise these with the research team when you withdraw from the study.',
  },
  {
    title: 'Retention of research data',
    body: 'The participant information will be removed from the research once the requirements are finalized. Project governance documentation, including copies of signed participant agreements, will be kept for a 3-month period after completion of the research. Research results will be anonymized and retained indefinitely for future research purposes.',
  },
];

const contacts = [
  { name: 'Abhishek Padaya', email: 's5511326@bournemouth.ac.uk' },
  { name: 'Festus', email: 'fadedoyin@bournemouth.ac.uk' },
];

const Consent = () => {
  const [consentChecked, setConsentChecked] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (consentChecked) {
      navigate('/sign-up', { state: consentChecked });
    } else {
      toast.error('Consent is required to proceed.');
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <FileText className="h-7 w-7" />
        </div>
        <h1 className="mt-5 font-display text-3xl font-bold tracking-tight">
          Participant Information Sheet
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          CourseConnect — Enhancing online course discussions for collaborative
          learning
        </p>
      </div>

      <Card>
        <CardContent className="space-y-6 p-6 sm:p-8">
          <p className="leading-relaxed text-muted-foreground">
            You are being invited to take part in a research project. Before you
            decide, it is important for you to understand why the research is
            being done and what it will involve. Please read the following
            information carefully and feel free to discuss it with others. If you
            have any questions or need further information, please ask.
          </p>

          {sections.map((s) => (
            <div key={s.title} className="border-t border-border pt-5">
              <h2 className="font-display text-lg font-bold">{s.title}</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}

          <div className="border-t border-border pt-5">
            <h2 className="font-display text-lg font-bold">
              Questions or further information
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {contacts.map((c) => (
                <a
                  key={c.email}
                  href={`mailto:${c.email}`}
                  className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3 transition-colors hover:border-primary/40"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{c.name}</span>
                    <span className="block truncate text-xs text-primary">{c.email}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-5">
            <h2 className="font-display text-lg font-bold">In case of complaints</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Any concerns about the study should be directed to Bournemouth
              University by email to{' '}
              <a
                href="mailto:researchgovernance@bournemouth.ac.uk"
                className="font-medium text-primary hover:underline"
              >
                researchgovernance@bournemouth.ac.uk
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <Card className="mt-6 border-primary/20">
          <CardContent className="p-6 sm:p-8">
            <p className="leading-relaxed text-muted-foreground">
              By checking the box below, I confirm that I have read and
              understood the information provided above. I voluntarily agree to
              participate in this research study and consent to the use of my
              data as described.
            </p>
            <label className="mt-5 flex cursor-pointer items-start gap-3">
              <Checkbox
                checked={consentChecked}
                onCheckedChange={(v) => setConsentChecked(!!v)}
                className="mt-0.5"
              />
              <span className="text-sm font-medium">
                I consent to participate in this research study.
              </span>
            </label>
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              disabled={!consentChecked}
              className="mt-6"
            >
              Proceed to Sign-up <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">© 2026 CourseConnect</p>
    </div>
  );
};

export default Consent;
