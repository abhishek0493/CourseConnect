import React, { useState } from 'react';
import { MessageSquareHeart } from 'lucide-react';

import { SectionHeading } from '../../components/Common/SectionHeading';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Label } from '../../components/ui/label';
import { toast } from '../../components/ui/toaster';

const options = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'average', label: 'Average' },
  { value: 'below-average', label: 'Below Average' },
  { value: 'poor', label: 'Poor' },
];

const FeedbackForm = () => {
  const [answers, setAnswers] = useState({ lookAndFeel: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Thanks for your feedback!');
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <SectionHeading icon={MessageSquareHeart} subtitle="Help us make CourseConnect better">
        User Feedback
      </SectionHeading>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h3 className="font-display text-base font-bold">Overall Look & Feel</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                How would you describe the visual appeal of the application?
              </p>
              <RadioGroup
                value={answers.lookAndFeel}
                onValueChange={(v) => setAnswers((p) => ({ ...p, lookAndFeel: v }))}
                className="mt-4 flex flex-wrap gap-2"
              >
                {options.map((o) => (
                  <label key={o.value}
                    className="flex cursor-pointer items-center gap-2 rounded-full border border-border px-3.5 py-2 text-sm font-medium transition-colors hover:border-primary/40 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                    <RadioGroupItem value={o.value} className="h-4 w-4" />
                    {o.label}
                  </label>
                ))}
              </RadioGroup>
            </div>

            <Button type="submit" variant="gradient">Submit feedback</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackForm;
