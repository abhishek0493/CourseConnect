import React from 'react';
import { Check, X, Inbox, Users } from 'lucide-react';

import { SectionHeading } from '../Common/SectionHeading';
import { EmptyState } from '../Common/EmptyState';
import { Card } from '../ui/card';
import { Spinner } from '../ui/spinner';
import { Tooltip } from '../ui/tooltip';
import { Avatar, AvatarFallback } from '../ui/avatar';

const RequestsTable = ({ requests, handleApprove, handleReject, isLoading }) => {
  return (
    <div className="space-y-5">
      <SectionHeading icon={Users}>Join Requests</SectionHeading>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner className="h-7 w-7" /></div>
      ) : requests.length === 0 ? (
        <EmptyState icon={Inbox} title="No join requests" description="When people ask to join your communities, they'll appear here." />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3">Community</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Requested</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.map((request) => (
                  <tr key={request.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3 font-semibold">c/{request.name}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-[10px]">
                            {request.request_user?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {request.request_user}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{request.created_at}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Tooltip label="Approve">
                          <button onClick={() => handleApprove(request.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/12 text-success transition-colors hover:bg-success hover:text-success-foreground">
                            <Check className="h-4 w-4" />
                          </button>
                        </Tooltip>
                        <Tooltip label="Reject">
                          <button onClick={() => handleReject(request.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/12 text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground">
                            <X className="h-4 w-4" />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default RequestsTable;
