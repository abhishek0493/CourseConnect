import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

import CreatePostBar from '../../components/Common/CreatePostBar';
import ThreadTitleBar from '../../components/Thread/ThreadTitleBar';
import Filters from '../../components/Common/Filters';
import { Refactor } from '../../components/Constants/Refactor';
import { AddCategoryIcon } from '../../utils/AddCategoryIcon';
import ParentContext from '../../ParentContext';

const ThreadsLayout = ({ triggerUpdate }) => {
  const { baseUrl } = useContext(ParentContext);
  const { name } = useParams();
  const location = useLocation();

  const [threads, setThreads] = useState([]);
  const [isAccess, setIsAccess] = useState(true);
  const [community, setCommunity] = useState([]);
  const [filterState, setFilterState] = useState({
    isSaved: 0,
    isCourse: 0,
    isAuthorPosted: 0,
    isCategory: 0,
  });

  const fetchCommunityDetails = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/v1/community/${name}`, { withCredentials: true });
      if (res.data.success) setCommunity(AddCategoryIcon(Refactor(res.data)));
    } catch {
      /* noop */
    }
  };

  const fetchCommunityThreads = async (filters) => {
    let url = `${baseUrl}/api/v1/threads/${name}/get-threads`;
    if (filters) {
      url += `?${new URLSearchParams(filters).toString()}`;
    }
    try {
      const res = await axios.get(url, { withCredentials: true });
      if (res.data.success) {
        setThreads(AddCategoryIcon(Refactor(res.data)));
        setIsAccess(res.data.access);
      }
    } catch {
      /* noop */
    }
  };

  const setFilter = (key) => (value) =>
    setFilterState((prev) => ({ ...prev, [key]: value }));

  const handleResetFilters = () =>
    setFilterState({ isSaved: 0, isCourse: 0, isAuthorPosted: 0, isCategory: 0 });

  useEffect(() => {
    fetchCommunityThreads(filterState);
    fetchCommunityDetails();
  }, [location, filterState]);

  return (
    <div className="space-y-5">
      <ThreadTitleBar name={name} community={community} isCommunityJoined={triggerUpdate} />
      <CreatePostBar community={community} isAccess={isAccess} />
      <Filters
        filterState={filterState}
        toggleSaved={setFilter('isSaved')}
        toggleCourse={setFilter('isCourse')}
        togglePosted={setFilter('isAuthorPosted')}
        handleReset={handleResetFilters}
      />
      <Outlet context={[threads, setThreads]} />
    </div>
  );
};

export default ThreadsLayout;
