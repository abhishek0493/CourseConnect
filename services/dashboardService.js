const threadRepository = require('../repositories/threadRepository');
const communityRepository = require('../repositories/communityRepository');

const getRecentCommunities = async () => {
  return threadRepository.getRecentCommunities();
};

const getTrendingThreads = async (userId, filters) => {
  const threads = await threadRepository.getTrendingThreads(userId, filters);

  const userCommunities = await communityRepository.findUserCommunities(userId);

  return threads.map((thread) => {
    const isJoined = userCommunities.some(
      (uc) => uc.community_id == thread.community_id && uc.status == 1 && uc.is_author != 1
    );
    const isRequestPending = userCommunities.some(
      (uc) => uc.community_id == thread.community_id && uc.status == 0 && uc.is_author != 1
    );
    const isAuthor = thread.user_id == userId ? 1 : 0;
    const isCreator = thread.created_by == userId ? 1 : 0;

    return {
      ...thread,
      is_joined: isJoined ? 1 : 0,
      is_request_pending: isRequestPending ? 1 : 0,
      is_author: isAuthor,
      is_creator: isCreator,
    };
  });
};

const getSavedThreads = async (userId) => {
  const threads = await threadRepository.getSavedThreads(userId);

  return threads.map((thread) => ({
    ...thread,
    is_author: thread.user_id == userId ? 1 : 0,
    is_creator: thread.created_by == userId ? 1 : 0,
  }));
};

const searchThreads = async (userId, query) => {
  const threads = await threadRepository.searchThreads(userId, query);
  const userCommunities = await communityRepository.findUserCommunities(userId);

  return threads.map((thread) => {
    const isJoined = userCommunities.some(
      (uc) => uc.community_id == thread.community_id && uc.status == 1 && uc.is_author != 1
    );
    const isRequestPending = userCommunities.some(
      (uc) => uc.community_id == thread.community_id && uc.status == 0 && uc.is_author != 1
    );

    return {
      ...thread,
      is_joined: isJoined ? 1 : 0,
      is_request_pending: isRequestPending ? 1 : 0,
      is_author: thread.user_id == userId ? 1 : 0,
      is_creator: thread.created_by == userId ? 1 : 0,
    };
  });
};

module.exports = {
  getRecentCommunities,
  getTrendingThreads,
  getSavedThreads,
  searchThreads,
};
