import React from 'react';
import { MonitorSmartphone } from 'lucide-react';

const MobileNotSupported = () => {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <MonitorSmartphone className="h-8 w-8" />
      </div>
      <h1 className="mt-6 font-display text-2xl font-bold">Best on a larger screen</h1>
      <p className="mt-3 text-muted-foreground">
        We apologize, but CourseConnect is currently optimized for desktop and
        laptop devices. Please switch to a larger screen for the best
        experience. We appreciate your understanding!
      </p>
    </div>
  );
};

export default MobileNotSupported;
