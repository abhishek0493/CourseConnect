import React, { useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';

import Sidebar from './Sidebar/Sidebar';
import SecondarySidebar from './Dashboard/SecondarySidebar';
import ParentContext from '../ParentContext';
import { Sheet, SheetContent } from './ui/sheet';
import { Button } from './ui/button';
import { Logo } from './Logo';

const LayoutSecondary = ({ communities }) => {
  const { user } = useContext(ParentContext);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6">
      <div className="flex gap-6 py-6">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-[88px] h-[calc(100vh-112px)] overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <Sidebar communities={communities} />
          </div>
        </aside>

        {/* Mobile drawer */}
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetContent side="left" className="p-0">
            <div className="flex h-14 items-center border-b border-border px-4">
              <Logo />
            </div>
            <div className="h-[calc(100%-3.5rem)]">
              <Sidebar
                communities={communities}
                isMobile
                onClose={() => setDrawerOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>

        {/* Main + right rail */}
        <div className="flex min-w-0 flex-1 gap-6">
          <div className="min-w-0 flex-1 animate-fade-rise">
            <div className="mb-4 lg:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDrawerOpen(true)}
                className="gap-2"
              >
                <Menu className="h-4 w-4" />
                Menu
              </Button>
            </div>
            <Outlet />
          </div>

          <aside className="hidden w-80 shrink-0 xl:block">
            <div className="sticky top-[88px]">
              <SecondarySidebar user={user} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default LayoutSecondary;
