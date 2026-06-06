import { Globe2, Lock, ShieldCheck } from 'lucide-react';

/**
 * Access-type metadata for a community.
 * Returns a lucide icon component (Icon), a human message, a Badge `tone`,
 * and a short `type` label. Theme-agnostic — no hardcoded colors.
 */
export const getAccessIcon = (type) => {
  switch (Number(type)) {
    case 1:
      return {
        Icon: Globe2,
        message: 'This community is open. Anyone can join and post here.',
        tone: 'success',
        type: 'Public',
      };
    case 2:
      return {
        Icon: ShieldCheck,
        message:
          'This community is restricted. Threads are visible, but posting needs creator approval.',
        tone: 'warning',
        type: 'Restricted',
      };
    case 3:
      return {
        Icon: Lock,
        message:
          'This community is private. Viewing and posting require creator approval.',
        tone: 'destructive',
        type: 'Private',
      };
    default:
      return { Icon: Globe2, message: '', tone: 'muted', type: '' };
  }
};
