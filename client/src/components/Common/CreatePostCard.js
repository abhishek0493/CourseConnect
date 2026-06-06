import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GraduationCap, MessageSquare, PlusCircle } from 'lucide-react';

import ParentContext from '../../ParentContext';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Rating } from '../ui/rating';
import { toast } from '../ui/toaster';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from '../ui/select';
import { cn } from '../../lib/utils';

const TypeOption = ({ active, icon: Icon, title, desc, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'flex flex-1 items-start gap-3 rounded-xl border p-4 text-left transition-all',
      active ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border hover:border-primary/40'
    )}
  >
    <span className={cn('flex h-9 w-9 items-center justify-center rounded-lg', active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
      <Icon className="h-5 w-5" />
    </span>
    <span>
      <span className="block text-sm font-semibold">{title}</span>
      <span className="mt-0.5 block text-xs text-muted-foreground">{desc}</span>
    </span>
  </button>
);

const CreatePostCard = ({ communities, selectedId }) => {
  const { baseUrl } = useContext(ParentContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    community: selectedId ? selectedId : '',
    type: 1,
    title: '',
    source: '',
    pricing: 0,
    link: '',
    body: '',
    is_completed: false,
    rating: 0,
  });

  const set = (name, value) => setFormData((p) => ({ ...p, [name]: value }));
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    set(name, type === 'checkbox' ? checked : value);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const reqData =
      formData.type == 2
        ? { title: formData.title, body: formData.body, community: formData.community, type: formData.type }
        : formData;
    try {
      const res = await axios.post(`${baseUrl}/api/v1/threads`, reqData, { withCredentials: true });
      if (res.data.success) {
        navigate(`/dashboard/c/${res.data.data.name}`, { replace: true });
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not create thread.');
    }
  };

  const created = Object.values(communities).filter((v) => v.is_author);
  const joined = Object.values(communities).filter((v) => !v.is_author && v.status == 1);

  return (
    <form onSubmit={handleCreate} className="space-y-5">
      {/* Community picker */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1.5">
            <Label>Post to community</Label>
            <Select
              value={formData.community ? String(formData.community) : undefined}
              onValueChange={(v) => set('community', Number(v))}
            >
              <SelectTrigger><SelectValue placeholder="Select a community" /></SelectTrigger>
              <SelectContent>
                {created.length > 0 && (
                  <SelectGroup>
                    <SelectLabel>Created communities</SelectLabel>
                    {created.map((v) => (
                      <SelectItem key={v.community_id} value={String(v.community_id)}>{v.name}</SelectItem>
                    ))}
                  </SelectGroup>
                )}
                {joined.length > 0 && (
                  <SelectGroup>
                    <SelectLabel>Joined communities</SelectLabel>
                    {joined.map((v) => (
                      <SelectItem key={v.community_id} value={String(v.community_id)}>{v.name}</SelectItem>
                    ))}
                  </SelectGroup>
                )}
              </SelectContent>
            </Select>
          </div>
          <span className="hidden text-sm font-semibold text-muted-foreground sm:block sm:pb-2.5">or</span>
          <Button type="button" variant="outline" onClick={() => navigate('/dashboard/create-community', { replace: true })}>
            <PlusCircle className="h-4 w-4" /> Create community
          </Button>
        </CardContent>
      </Card>

      {/* Type picker */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <TypeOption active={formData.type == 1} icon={GraduationCap} title="Share a course"
          desc="Recommend a course you've taken" onClick={() => set('type', 1)} />
        <TypeOption active={formData.type == 2} icon={MessageSquare} title="Ask / Discuss"
          desc="Post a question or an update" onClick={() => set('type', 2)} />
      </div>

      {/* Course form */}
      {formData.type == 1 && (
        <Card>
          <CardContent className="grid gap-4 p-5 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required value={formData.title} onChange={handleChange} placeholder="e.g. The Complete React Developer Course" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="source">Platform</Label>
              <Input id="source" name="source" required value={formData.source} onChange={handleChange} placeholder="Youtube, Udemy, Skillshare…" />
            </div>
            <div className="space-y-1.5">
              <Label>Pricing</Label>
              <Select value={String(formData.pricing)} onValueChange={(v) => set('pricing', v)}>
                <SelectTrigger><SelectValue placeholder="Select pricing" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Free</SelectItem>
                  <SelectItem value="2">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="link">Link to the course</Label>
              <Input id="link" name="link" required value={formData.link} onChange={handleChange} placeholder="https://…" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="body">Text <span className="font-normal text-muted-foreground">(optional)</span></Label>
              <Textarea id="body" name="body" rows={5} value={formData.body} onChange={handleChange} placeholder="Why do you recommend this course?" />
            </div>
            <label className="flex items-center gap-2.5">
              <Checkbox checked={formData.is_completed} onCheckedChange={(v) => set('is_completed', !!v)} />
              <span className="text-sm font-medium">I have completed this course</span>
            </label>
            <div className="space-y-1.5">
              <Label>Your rating</Label>
              <Rating value={Number(formData.rating)} onChange={(v) => set('rating', v)} />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" variant="gradient" className="w-full">Create thread</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Discussion form */}
      {formData.type == 2 && (
        <Card>
          <CardContent className="space-y-4 p-5">
            <div className="space-y-1.5">
              <Label htmlFor="qtitle">Title</Label>
              <Input id="qtitle" name="title" value={formData.title} onChange={handleChange} placeholder="What's your question?" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="qbody">Write something</Label>
              <Textarea id="qbody" name="body" rows={6} value={formData.body} onChange={handleChange} placeholder="Add more details…" />
            </div>
            <Button type="submit" variant="gradient" className="w-full">Create thread</Button>
          </CardContent>
        </Card>
      )}
    </form>
  );
};

export default CreatePostCard;
