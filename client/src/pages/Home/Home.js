import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Users,
  MessageSquare,
  Sparkles,
  Star,
  ThumbsUp,
} from 'lucide-react';

import heroImage from './Connected world-cuate.svg';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';

const features = [
  {
    icon: BookOpen,
    title: 'Share courses',
    desc: 'Recommend the courses that shaped you and discover what others are learning.',
  },
  {
    icon: Users,
    title: 'Build communities',
    desc: 'Create public or private spaces around any topic and grow your circle.',
  },
  {
    icon: MessageSquare,
    title: 'Discuss & vote',
    desc: 'Start threads, reply in nested conversations, and surface the best answers.',
  },
  {
    icon: Sparkles,
    title: 'Learn together',
    desc: 'Connect with like-minded learners and instructors across every field.',
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-brand-gradient opacity-20 blur-[120px]" />

      <section className="mx-auto max-w-7xl px-5 pb-16 pt-12 sm:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="animate-fade-rise text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground shadow-soft">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Where learners meet & grow
            </span>

            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Learn together on{' '}
              <span className="text-gradient">CourseConnect</span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground lg:mx-0 sm:text-lg">
              An online platform that brings together learners and instructors
              from every field. Explore courses, join communities, and embark on
              a journey of continuous learning.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Button size="lg" variant="gradient" onClick={() => navigate('consent')}>
                Get started — it's free
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">I already have an account</Link>
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground lg:justify-start">
              <span className="flex items-center gap-1.5">
                <ThumbsUp className="h-4 w-4 text-primary" /> Community-driven
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-accent" /> Curated courses
              </span>
            </div>
          </div>

          <div className="relative animate-fade-rise">
            <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-brand-gradient opacity-10 blur-2xl" />
            <img
              src={heroImage}
              alt="People connecting and learning together"
              className="mx-auto w-full max-w-lg drop-shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Card key={f.title} interactive className="p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-base font-bold">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA band */}
      <section className="mx-auto max-w-7xl px-5 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-brand-gradient px-6 py-14 text-center shadow-pop sm:px-12">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
          <div className="relative">
            <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
              Start your learning adventure
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/85">
              Join a growing community of curious minds. Unlock endless
              possibilities today.
            </p>
            <Button
              size="lg"
              onClick={() => navigate('consent')}
              className="mt-7 bg-white text-primary hover:bg-white/90"
            >
              Create your account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
