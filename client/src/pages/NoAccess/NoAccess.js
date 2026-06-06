import React from 'react';
import { Link } from 'react-router-dom';
import { LockKeyhole, ArrowRight, Home } from 'lucide-react';

import { Button } from '../../components/ui/button';

const NoAccess = () => {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col items-center justify-center px-5 py-12 text-center">
      <div className="relative">
        <div className="absolute inset-0 -z-10 rounded-full bg-brand-gradient opacity-20 blur-2xl" />
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-gradient text-white shadow-pop">
          <LockKeyhole className="h-9 w-9" />
        </div>
      </div>
      <h1 className="mt-7 font-display text-3xl font-bold tracking-tight">
        You need to sign in
      </h1>
      <p className="mt-3 text-muted-foreground">
        This page is part of your CourseConnect dashboard. Sign in to continue,
        or head back to the home page.
      </p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="gradient" size="lg">
          <Link to="/login">Sign in <ArrowRight className="h-4 w-4" /></Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/"><Home className="h-4 w-4" /> Go home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NoAccess;
