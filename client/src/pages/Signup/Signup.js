import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

import image from './Connected world-amico.png';
import ParentContext from '../../ParentContext';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../components/ui/select';

const Signup = ({ userTypes, onSignUpSuccess }) => {
  const { baseUrl } = useContext(ParentContext);
  const location = useLocation();
  const state = location.state;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    type: 0,
    type_value: '',
    consent: state ? 1 : 0,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${baseUrl}/api/v1/auth/signUp`, formData);
      onSignUpSuccess(true);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Sign up failed. Please review your details.');
    } finally {
      setLoading(false);
    }
  };

  const hasErr = (key) => error && error.toLowerCase().includes(key);

  if (!state) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col items-center justify-center px-5 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-warning/15 text-warning">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold">Consent required</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Please read the participant information sheet and provide your consent
          before creating an account.
        </p>
        <Button asChild size="lg" variant="gradient" className="mt-7">
          <Link to="/consent">
            Read & provide consent <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <img src={image} alt="" className="mt-10 w-full max-w-sm opacity-90" />
      </div>
    );
  }

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-brand-gradient lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
        <Logo textClassName="text-white" />
        <div className="relative max-w-md text-white">
          <Sparkles className="h-9 w-9" />
          <h2 className="mt-5 font-display text-4xl font-extrabold leading-tight">
            Join a community of curious learners.
          </h2>
          <ul className="mt-6 space-y-3 text-white/85">
            {['Share and discover great courses', 'Create and join communities', 'Discuss, vote, and grow together'].map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 shrink-0" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-white/60">© 2026 CourseConnect</p>
      </div>

      <div className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md animate-fade-rise">
          <h1 className="font-display text-2xl font-bold">Create your account</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            It only takes a minute to get started.
          </p>

          <form onSubmit={handleSignUp} className="mt-7 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required value={formData.name}
                  onChange={handleChange} error={hasErr('name')} placeholder="Jane Doe" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required value={formData.email}
                  onChange={handleChange} error={hasErr('email')} placeholder="you@example.com" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Profession</Label>
              <Select
                value={formData.type ? String(formData.type) : undefined}
                onValueChange={(v) => setFormData({ ...formData, type: v })}
              >
                <SelectTrigger error={hasErr('type')}>
                  <SelectValue placeholder="Select your profession" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(userTypes || {}).map((value) => (
                    <SelectItem key={value.type_id} value={String(value.type_id)}>
                      {value.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="type_value">University / Company <span className="font-normal text-muted-foreground">(optional)</span></Label>
              <Input id="type_value" name="type_value" value={formData.type_value} onChange={handleChange} placeholder="e.g. Bournemouth University" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required value={formData.password}
                  onChange={handleChange} error={hasErr('password')} placeholder="••••••••" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required value={formData.confirmPassword}
                  onChange={handleChange} error={hasErr('confirm')} placeholder="••••••••" />
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-success/25 bg-success/10 px-3 py-2.5 text-sm text-foreground">
              <CheckCircle2 className="h-4 w-4 text-success" /> Consent received
            </div>

            {error && <p className="text-sm font-medium text-destructive">{error}</p>}

            <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
