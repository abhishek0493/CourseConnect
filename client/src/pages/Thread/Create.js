import React from 'react';
import { useLocation } from 'react-router-dom';
import { PenSquare } from 'lucide-react';

import CreatePostCard from '../../components/Common/CreatePostCard';
import { SectionHeading } from '../../components/Common/SectionHeading';

const CreateThread = ({ communities }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id') !== null ? searchParams.get('id') : 0;

  return (
    <div className="space-y-6">
      <SectionHeading icon={PenSquare} subtitle="Share a course or start a discussion">
        Create a thread
      </SectionHeading>
      <CreatePostCard communities={communities} selectedId={id} />
    </div>
  );
};

export default CreateThread;
