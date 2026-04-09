const userRepository = require('../repositories/userRepository');
const userCommunityRepository = require('../repositories/userCommunityRepository');
const AppError = require('../utils/appError');
const { userTypes } = require('../utils/constants');
const db = require('../db');

const getAllUsers = async () => {
  return db.select().from('users');
};

const getUserTypes = async () => {
  return userTypes.user;
};

const getCommunityJoinRequests = async (userId, communityName) => {
  return userCommunityRepository.findAllRequests(userId, communityName);
};

const approveRequest = async (requestId) => {
  const request = await userCommunityRepository.findById(requestId);
  if (!request) throw new AppError('Request not found', 400);
  if (request.status == 1) throw new AppError('This request is already approved', 401);

  const result = await userCommunityRepository.updateStatus(requestId, 1);
  return { id: result, message: 'Request approved !!' };
};

const rejectRequest = async (requestId) => {
  const request = await userCommunityRepository.findById(requestId);
  if (!request) throw new AppError('Request not found', 400);
  if (request.status == 1) throw new AppError('This request is already approved', 401);

  const result = await userCommunityRepository.updateStatus(requestId, 2);
  return { id: result, message: 'Request rejected !!' };
};

const getUserStats = async (userId) => {
  return userRepository.getStats(userId);
};

module.exports = {
  getAllUsers,
  getUserTypes,
  getCommunityJoinRequests,
  approveRequest,
  rejectRequest,
  getUserStats,
};
