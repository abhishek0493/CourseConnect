import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, LogOut, LogIn, User, ChevronDown } from 'lucide-react';

import ParentContext from '../ParentContext';
import { Logo } from './Logo';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { toast } from './ui/toaster';

const SearchField = ({ value, onChange, onSubmit, className }) => (
  <div className={className}>
    <div className="relative">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={onChange}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
        placeholder="Search topics or communities…"
        aria-label="Search"
        className="h-10 w-full rounded-full border border-border bg-muted/60 pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/70 focus:border-ring focus:bg-card focus:ring-2 focus:ring-ring/25"
      />
    </div>
  </div>
);

const Header = ({ isLoggedIn, onLogout }) => {
  const { baseUrl, user } = useContext(ParentContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleSearchSubmit = () => {
    if (!searchQuery.trim()) return;
    const q = searchQuery;
    setSearchQuery('');
    setMobileSearchOpen(false);
    navigate(`/dashboard/custom-search?query=${q}`, { replace: true });
  };

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/v1/auth/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        onLogout(true);
        toast.success('Signed out successfully');
        navigate('/', { replace: true });
      }
    } catch {
      toast.error('Could not sign out. Please try again.');
    }
  };

  const displayName = user && user.name ? user.name : 'Account';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border glass">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-4 sm:px-6">
        <Link
          to={isLoggedIn ? '/dashboard' : '/'}
          className="flex items-center transition-opacity hover:opacity-90"
        >
          <Logo textClassName="hidden sm:inline-block" />
        </Link>

        {isLoggedIn && (
          <SearchField
            className="mx-2 hidden flex-1 md:block md:max-w-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSubmit={handleSearchSubmit}
          />
        )}

        <div className="ml-auto flex items-center gap-2">
          {isLoggedIn && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Search"
              onClick={() => setMobileSearchOpen((o) => !o)}
            >
              <Search />
            </Button>
          )}

          <ThemeToggle />

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 rounded-full pl-0.5 pr-2 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarFallback className="text-sm">{initial}</AvatarFallback>
                  </Avatar>
                  <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="normal-case">
                  <p className="text-sm font-semibold text-foreground">{displayName}</p>
                  <p className="text-xs font-normal text-muted-foreground">Signed in</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <User /> Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:bg-destructive/10 [&_svg]:text-destructive"
                >
                  <LogOut /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate('/login', { replace: true })} className="gap-2">
              <LogIn className="h-4 w-4" /> Login
            </Button>
          )}
        </div>
      </div>

      {isLoggedIn && mobileSearchOpen && (
        <div className="border-t border-border px-4 py-3 md:hidden">
          <SearchField
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSubmit={handleSearchSubmit}
          />
        </div>
      )}
    </header>
  );
};

export default Header;
