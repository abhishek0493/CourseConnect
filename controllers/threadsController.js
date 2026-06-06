const threadService = require('../services/threadService');
const catchAsync = require('../utils/catchAsync');

const getCommunityUserThreads = catchAsync(async (req, res) => {
  const { threads, access } = await threadService.getCommunityUserThreads(
    req.params.community,
    req.user.id,
    req.query
  );
  res.status(200).json({ success: true, data: threads, access });
});

const createThread = catchAsync(async (req, res) => {
  const data = await threadService.createThread(req.body, req.user.id);
  res.status(200).json({ success: true, data });
});

const getThreadDetails = catchAsync(async (req, res) => {
  const thread = await threadService.getThreadDetails(req.params.id);
  res.status(200).json({ success: true, data: thread });
});

const getThreadWithNestedComments = catchAsync(async (req, res) => {
  const data = await threadService.getThreadWithNestedComments(req.params.id, req.user.id);
  res.status(200).json({ success: true, data });
});

const upVoteThread = catchAsync(async (req, res) => {
  const data = await threadService.upVoteThread(req.params.id, req.user.id);
  res.status(200).json({ success: true, data });
});

const downVoteThread = catchAsync(async (req, res) => {
  const data = await threadService.downVoteThread(req.params.id, req.user.id);
  res.status(200).json({ success: true, data });
});

const saveThread = catchAsync(async (req, res) => {
  const data = await threadService.saveThread(req.params.id, req.user.id);
  res.status(200).json({ success: true, data });
});

module.exports = {
  getCommunityUserThreads,
  getThreadWithNestedComments,
  getThreadDetails,
  createThread,
  upVoteThread,
  downVoteThread,
  saveThread,
};
