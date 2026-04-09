const communityService = require('../services/communityService');
const catchAsync = require('../utils/catchAsync');

const getCommunityByName = catchAsync(async (req, res) => {
  const community = await communityService.getCommunityByName(req.params.name, req.user.id);
  res.status(200).json({ success: true, data: community });
});

const getUserCommunities = catchAsync(async (req, res) => {
  const communities = await communityService.getUserCommunities(req.user.id);
  res.status(200).json({ success: true, data: communities });
});

const checkCommunityNameAvailability = catchAsync(async (req, res) => {
  const result = await communityService.checkNameAvailability(req.body.name);
  res.status(200).json({ success: true, ...result });
});

const createCommunity = catchAsync(async (req, res) => {
  const data = await communityService.createCommunity(req.body, req.user.id);
  res.status(200).json({ success: true, data });
});

const joinCommunity = catchAsync(async (req, res) => {
  const data = await communityService.joinCommunity(req.params.id, req.user.id);
  res.status(200).json({ success: true, data });
});

const leaveCommunity = catchAsync(async (req, res) => {
  const data = await communityService.leaveCommunity(req.params.id, req.user.id);
  res.status(200).json({ success: true, data });
});

const checkCommunityAccess = catchAsync(async (req, res) => {
  const { communityInfo, access } = await communityService.checkAccess(req.params.name, req.user.id);
  res.status(200).json({ success: true, data: communityInfo, access });
});

module.exports = {
  getCommunityByName,
  createCommunity,
  getUserCommunities,
  checkCommunityNameAvailability,
  joinCommunity,
  leaveCommunity,
  checkCommunityAccess,
};
