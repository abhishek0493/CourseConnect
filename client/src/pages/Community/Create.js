import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, Info, Globe2, ShieldCheck, Lock } from 'lucide-react';

import ParentContext from '../../ParentContext';
import { SectionHeading } from '../../components/Common/SectionHeading';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Tooltip } from '../../components/ui/tooltip';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../components/ui/select';
import { cn } from '../../lib/utils';

const accessTypes = [
  { value: '1', icon: Globe2, title: 'Public', desc: 'Anyone can view, post and comment.', disabled: false },
  { value: '2', icon: ShieldCheck, title: 'Restricted', desc: 'Anyone can view; only approved users can post.', disabled: false },
  { value: '3', icon: Lock, title: 'Private', desc: 'Only approved users can view and submit. (Future release)', disabled: true },
];

const CreateCommunity = ({ cmCategories, onCreateCommunity }) => {
  const { baseUrl } = useContext(ParentContext);
  const navigate = useNavigate();
  const [nameAvailability, setNameAvailability] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    category: '',
    accessType: '1',
    description: '',
  });
  const [validationError, setValidationError] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const set = (name, value) => {
    setFormData((p) => ({ ...p, [name]: value }));
    setValidationError(false);
    setValidationMessage('');
  };
  const handleChange = (e) => set(e.target.name, e.target.value);

  const handleNameBlur = async () => {
    try {
      const res = await axios.post(
        `${baseUrl}/api/v1/community/check-availability`,
        { name: formData.name },
        { withCredentials: true }
      );
      setNameAvailability(res.data.exists);
    } catch {
      /* noop */
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${baseUrl}/api/v1/community`, formData);
      if (res.data.success) {
        onCreateCommunity(true);
        navigate(`/dashboard/c/${res.data.data.name}`, { replace: true });
      }
    } catch (err) {
      setValidationError(true);
      setValidationMessage(err?.response?.data?.message || 'Could not create community.');
    }
  };

  const hasErr = (key) => validationError && validationMessage.includes(key);

  return (
    <div className="space-y-6">
      <SectionHeading icon={Users} subtitle="Build a space for people to learn and share">
        Create a community
      </SectionHeading>

      <Card>
        <CardContent className="p-5 sm:p-6">
          <form onSubmit={handleCreate} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Label htmlFor="name">Community name</Label>
                  <Tooltip label="Your community username. 3–20 characters; letters, numbers and hyphens. No spaces.">
                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                  </Tooltip>
                </div>
                <Input id="name" name="name" required value={formData.name}
                  onChange={handleChange} onBlur={handleNameBlur}
                  error={nameAvailability || hasErr('name')} placeholder="e.g. react-devs" />
                {nameAvailability === true && (
                  <p className="text-xs font-medium text-destructive">A community with this name already exists.</p>
                )}
                {hasErr('name') && <p className="text-xs font-medium text-destructive">{validationMessage}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={formData.category ? String(formData.category) : undefined}
                  onValueChange={(v) => set('category', v)}>
                  <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent>
                    {Object.values(cmCategories).map((value) => (
                      <SelectItem key={value.id} value={String(value.id)}>{value.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="title">Title</Label>
                <Tooltip label="A short title for the community. 5–60 characters.">
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </Tooltip>
              </div>
              <Input id="title" name="title" required value={formData.title}
                onChange={handleChange} error={hasErr('title')} placeholder="What is this community about?" />
              {hasErr('title') && <p className="text-xs font-medium text-destructive">{validationMessage}</p>}
            </div>

            <div className="space-y-2.5">
              <Label>Access type</Label>
              <RadioGroup value={formData.accessType} onValueChange={(v) => set('accessType', v)} className="gap-2.5">
                {accessTypes.map((t) => {
                  const Icon = t.icon;
                  const active = formData.accessType === t.value;
                  return (
                    <label key={t.value}
                      className={cn(
                        'flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-all',
                        t.disabled && 'cursor-not-allowed opacity-60',
                        active ? 'border-primary bg-primary/5 ring-2 ring-primary/15' : 'border-border hover:border-primary/40'
                      )}>
                      <RadioGroupItem value={t.value} disabled={t.disabled} />
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold">{t.title}</span>
                        <span className="block text-xs text-muted-foreground">{t.desc}</span>
                      </span>
                    </label>
                  );
                })}
              </RadioGroup>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" required rows={5} value={formData.description}
                onChange={handleChange} error={hasErr('description')} placeholder="Tell people what your community is about…" />
              {hasErr('description') && <p className="text-xs font-medium text-destructive">{validationMessage}</p>}
            </div>

            <Button type="submit" variant="gradient" className="w-full">Create community</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCommunity;
