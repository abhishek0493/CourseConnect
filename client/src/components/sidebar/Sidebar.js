import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Home,
  PenSquare,
  Bookmark,
  Users,
  Hash,
} from 'lucide-react';

import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

const navItems = [
  { label: 'Home Feed', icon: Home, path: '/dashboard', exact: true },
  { label: 'Create Thread', icon: PenSquare, path: '/dashboard/create-thread' },
  { label: 'Saved Threads', icon: Bookmark, path: '/dashboard/view-all-saved' },
  { label: 'Join Requests', icon: Users, path: '/dashboard/view-all-requests' },
];

const Sidebar = ({ communities, isMobile, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const go = (path) => {
    navigate(path);
    if (isMobile && onClose) onClose();
  };

  const isActive = (item) =>
    item.exact
      ? location.pathname === item.path
      : location.pathname.startsWith(item.path);

  return (
    <nav className="flex h-full flex-col gap-5 p-4">
      <Button variant="gradient" className="w-full" onClick={() => go('/dashboard/create-community')}>
        <PlusCircle className="h-4 w-4" />
        Create Community
      </Button>

      <div className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <button
              key={item.path}
              onClick={() => go(item.path)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-[1.15rem] w-[1.15rem]" />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="mb-2 flex items-center gap-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Hash className="h-3.5 w-3.5" />
          Your Communities
        </div>
        <div className="-mx-1 flex-1 overflow-y-auto px-1">
          {communities && communities.length > 0 ? (
            <div className="flex flex-col gap-0.5">
              {communities.map((item) => {
                const Icon = item.Icon;
                const active = location.pathname === `/dashboard/c/${item.name}`;
                return (
                  <button
                    key={item.id}
                    onClick={() => go(`/dashboard/c/${item.name}`)}
                    className={cn(
                      'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-secondary text-secondary-foreground'
                        : 'text-foreground hover:bg-muted'
                    )}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-gradient text-white">
                      {Icon ? <Icon className="h-4 w-4" /> : item.name?.charAt(0)}
                    </span>
                    <span className="truncate">c/{item.name}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mx-1 rounded-lg border border-dashed border-border bg-muted/40 px-3 py-4 text-center text-xs text-muted-foreground">
              No communities yet. Create or join one to get started!
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
