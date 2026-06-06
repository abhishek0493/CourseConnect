import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, PencilRuler, Compass } from 'lucide-react';

import { getAccessIcon } from '../Constants/GetAccessIcon';
import { SectionHeading } from '../Common/SectionHeading';
import { EmptyState } from '../Common/EmptyState';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tooltip } from '../ui/tooltip';

const Communities = ({ communities }) => {
  const navigate = useNavigate();

  return (
    <section className="space-y-4">
      <SectionHeading icon={Compass}>Popular Communities</SectionHeading>

      {communities && communities.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No communities yet"
          description="Be the first to create one and start a discussion!"
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {communities &&
            communities.map((community) => {
              const access = getAccessIcon(community.access_type);
              const AccessIcon = access.Icon;
              const CategoryIcon = community.Icon;
              return (
                <Card
                  key={community.id}
                  interactive
                  onClick={() =>
                    navigate(`/dashboard/c/${community.community_name}`, { replace: true })
                  }
                  className="cursor-pointer p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white">
                      {CategoryIcon ? <CategoryIcon className="h-5 w-5" /> : null}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-display text-sm font-bold">
                        c/{community.community_name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {community.category_name}
                      </p>
                    </div>
                    <Tooltip label={access.message}>
                      <span className="ml-auto"><Badge variant={access.tone}><AccessIcon /></Badge></span>
                    </Tooltip>
                  </div>
                  <div className="mt-3 flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" /> {community.total_users} members
                    </span>
                    <span className="flex items-center gap-1.5">
                      <PencilRuler className="h-3.5 w-3.5" /> {community.total_threads} threads
                    </span>
                  </div>
                </Card>
              );
            })}
        </div>
      )}
    </section>
  );
};

export default Communities;
