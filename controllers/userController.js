const userService = require('../services/userService');
const catchAsync = require('../utils/catchAsync');

const getUserTypes = catchAsync(async (req, res) => {
  const types = await userService.getUserTypes();
  res.status(200).json({ success: true, data: types });
});

const getAllUsers = catchAsync(async (req, res) => {
  const users = await userService.getAllUsers();
  res.status(200).json({ success: true, data: users });
});

const getAllCommunityJoinRequests = catchAsync(async (req, res) => {
  const requests = await userService.getCommunityJoinRequests(
    req.user.id,
    req.query.name
  );
  res.status(200).json({ success: true, data: requests });
});

const approveRequest = catchAsync(async (req, res) => {
  const data = await userService.approveRequest(req.params.id);
  res.status(200).json({ success: true, data });
});

const rejectRequest = catchAsync(async (req, res) => {
  const data = await userService.rejectRequest(req.params.id);
  res.status(200).json({ success: true, data });
});

const getUserStats = catchAsync(async (req, res) => {
  const stats = await userService.getUserStats(req.user.id);
  res.status(200).json({ success: true, data: stats });
});

module.exports = {
  getAllUsers,
  getUserTypes,
  getAllCommunityJoinRequests,
  approveRequest,
  rejectRequest,
  getUserStats,
};
