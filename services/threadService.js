const threadRepository = require('../repositories/threadRepository');
const communityRepository = require('../repositories/communityRepository');
const AppError = require('../utils/appError');
const { threadCreationSchema } = require('../utils/validation');

// ─── Community Thread Listing ──────────────────────────────────────────────────

const getCommunityUserThreads = async (community, userId, filters) => {
  const { isSaved, isPosted, isCourse } = filters;

  // Verify community access
  const communityInfo = await communityRepository.findWithUserMembership(community, userId);
  let access = true;

  if (
    communityInfo &&
    communityInfo.access_type != 1 &&
    communityInfo.is_author != 1 &&
    communityInfo.status == 0
  ) {
    access = false;
  }

  const threads = await threadRepository.findCommunityThreads(
    community,
    isSaved,
    isCourse,
    isPosted,
    userId
  );

  const userThreadActions = await threadRepository.getUserThreadActions(userId);

  const transformedThreads = threads.map((thread) => {
    const isAuthor = thread.user_id == userId ? 1 : 0;
    const isSavedFlag = userThreadActions.some(
      (a) => a.thread_id === thread.id && a.is_saved
    );
    const isUpvoted = userThreadActions.some(
      (a) => a.thread_id === thread.id && a.is_upvoted
    );
    const isDownvoted = userThreadActions.some(
      (a) => a.thread_id === thread.id && a.is_downvoted
    );

    return {
      ...thread,
      is_author: isAuthor,
      is_saved: isSavedFlag ? 1 : 0,
      is_upvoted: isUpvoted ? 1 : 0,
      is_downvoted: isDownvoted ? 1 : 0,
      is_access: access,
    };
  });

  return { threads: transformedThreads, access };
};

// ─── Create Thread ─────────────────────────────────────────────────────────────

const createThread = async (body, userId) => {
  const { error } = threadCreationSchema.validate(body);
  if (error) throw new AppError(error.details[0].message, 400);

  const id = await threadRepository.create({
    community_id: body.community,
    user_id: userId,
    title: body.title,
    type: body.type,
    source: body.source,
    pricing: body.pricing,
    link: body.link,
    body: body.body,
    is_course_completed: body.is_completed ? 1 : 0,
    author_rating: body.rating,
  });

  const community = await communityRepository.findById(body.community);
  return { id, name: community.name };
};

// ─── Thread Details ────────────────────────────────────────────────────────────

const getThreadDetails = async (id) => {
  const thread = await threadRepository.findById(id);
  if (!thread) throw new AppError('No result found', 404);
  return thread;
};

// ─── Thread + Nested Comments ──────────────────────────────────────────────────

const getThreadWithNestedComments = async (threadId, userId) => {
  // Build nested comment tree
  const commentsData = await threadRepository.getNestedComments(threadId);

  const commentsMap = new Map();
  for (const comment of commentsData) {
    commentsMap.set(comment.id, {
      id: comment.id,
      thread_id: comment.thread_id,
      parent_comment_id: comment.parent_comment_id,
      author: comment.user_name,
      depth: comment.depth,
      created_at: comment.created_at,
      total_upvotes: comment.total_upvotes,
      total_downvotes: comment.total_downvotes,
      comment: comment.comment,
      comments: [],
    });
  }

  const rootComments = [];
  for (const comment of commentsData) {
    if (comment.parent_comment_id === 0) {
      rootComments.push(commentsMap.get(comment.id));
    } else {
      const parent = commentsMap.get(comment.parent_comment_id);
      if (parent) parent.comments.push(commentsMap.get(comment.id));
    }
  }

  // Resolve thread + access
  let thread = await threadRepository.findWithCommunity(threadId);
  const userCommunity = await communityRepository.findUserMembership(userId, thread.community_id);

  let access = true;

  if (thread.access_type != 1) {
    if (!userCommunity) access = false;
    if (userCommunity && userCommunity.status == 0) access = false;
    if (userCommunity && userCommunity.status == 1 && userCommunity.is_author != 1) access = true;
  }

  if (thread.access_type == 1) {
    if (!userCommunity) access = true;
    if (userCommunity && userCommunity.status == 1) access = true;
  }

  if (thread.created_by == userId) access = true;

  const userThreadAction = await threadRepository.getThreadAction(userId, thread.id);
  thread.is_access = access;

  if (userThreadAction) {
    thread = {
      ...thread,
      is_upvoted: userThreadAction.is_upvoted ? 1 : 0,
      is_downvoted: userThreadAction.is_downvoted ? 1 : 0,
      is_saved: userThreadAction.is_saved ? 1 : 0,
    };
  }

  return { thread, comments: rootComments };
};

// ─── Vote & Save Actions ───────────────────────────────────────────────────────

const upVoteThread = async (threadId, userId) => {
  const threadAction = await threadRepository.getThreadAction(userId, threadId);

  if (!threadAction) {
    await threadRepository.insertThreadAction({ user_id: userId, thread_id: threadId, is_upvoted: 1 });
    await threadRepository.incrementThread(threadId, { total_upvotes: 1 });
    return { toggle: false, message: 'Thread up-voted successfully' };
  }

  if (!threadAction.is_upvoted && threadAction.is_downvoted) {
    await threadRepository.updateThreadAction(userId, threadId, { is_upvoted: 1, is_downvoted: 0 });
    await threadRepository.incrementThread(threadId, { total_upvotes: 1, total_downvotes: -1 });
    return { toggle: true, message: 'Thread up-voted successfully' };
  }

  if (!threadAction.is_upvoted && !threadAction.is_downvoted) {
    await threadRepository.updateThreadAction(userId, threadId, { is_upvoted: 1 });
    await threadRepository.incrementThread(threadId, { total_upvotes: 1 });
    return { toggle: false, message: 'Thread up-voted successfully' };
  }

  throw new AppError('This thread is already up-voted by you', 401);
};

const downVoteThread = async (threadId, userId) => {
  const threadAction = await threadRepository.getThreadAction(userId, threadId);

  if (!threadAction) {
    await threadRepository.insertThreadAction({ user_id: userId, thread_id: threadId, is_downvoted: 1 });
    await threadRepository.incrementThread(threadId, { total_downvotes: 1 });
    return { toggle: false, message: 'Thread down-voted successfully' };
  }

  if (!threadAction.is_downvoted && threadAction.is_upvoted) {
    await threadRepository.updateThreadAction(userId, threadId, { is_downvoted: 1, is_upvoted: 0 });
    await threadRepository.incrementThread(threadId, { total_downvotes: 1, total_upvotes: -1 });
    return { toggle: true, message: 'Thread down-voted successfully' };
  }

  if (!threadAction.is_upvoted && !threadAction.is_downvoted) {
    await threadRepository.updateThreadAction(userId, threadId, { is_downvoted: 1 });
    await threadRepository.incrementThread(threadId, { total_downvotes: 1 });
    return { toggle: false, message: 'Thread down-voted successfully' };
  }

  throw new AppError('This thread is already down-voted by you', 401);
};

const saveThread = async (threadId, userId) => {
  const threadAction = await threadRepository.getThreadAction(userId, threadId);

  if (!threadAction) {
    await threadRepository.insertThreadAction({ user_id: userId, thread_id: threadId, is_saved: 1 });
    return { toggle: false, message: 'Thread saved successfully' };
  }

  const newIsSaved = threadAction.is_saved ? 0 : 1;
  await threadRepository.updateThreadAction(userId, threadId, { is_saved: newIsSaved });
  return { toggle: true, message: 'Thread saved successfully' };
};

module.exports = {
  getCommunityUserThreads,
  createThread,
  getThreadDetails,
  getThreadWithNestedComments,
  upVoteThread,
  downVoteThread,
  saveThread,
};
