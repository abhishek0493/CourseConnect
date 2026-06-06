import { FlaskConical, Briefcase, Palette, Sparkles, Languages } from 'lucide-react';

export const Categories = [
  { id: 1, Icon: FlaskConical, label: 'Science & Tech', route: 'science-tech' },
  { id: 2, Icon: Briefcase, label: 'Business & Entrepreneurship', route: 'business-entrepreneurship' },
  { id: 3, Icon: Palette, label: 'Creative Arts', route: 'creative-arts' },
  { id: 4, Icon: Sparkles, label: 'Personal Development', route: 'personal-development' },
  { id: 5, Icon: Languages, label: 'Language Learning', route: 'language-learning' },
];

export const getCategoryIcon = (categoryId) => {
  const match = Categories.find((c) => c.id === Number(categoryId));
  return match ? match.Icon : Sparkles;
};
