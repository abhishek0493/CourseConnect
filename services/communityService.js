const communityRepository = require('../repositories/communityRepository');
const AppError = require('../utils/appError');
const { communityCreationSchema } = require('../utils/validation');

const getCommunityByName = async (name, userId) => {
  const community = await communityRepository.findByName(name);

  if (!community) throw new AppError('No results found', 400);

  community.is_author = userId == community.created_by;
  community.allow_access = true;

  const userCommunity = await communityRepository.findUserMembership(userId, community.id);

  if (community.access_type != 1) {
    if (!userCommunity) {
      community.allow_access = false;
      community.message = 'Join';
    }
    if (userCommunity && userCommunity.status == 0) {
      community.allow_access = false;
      community.message = 'Request pending';
    }
    if (userCommunity && userCommunity.status == 1 && userCommunity.is_author != 1) {
      community.allow_access = true;
      community.message = 'Joined';
    }
  }

  if (community.access_type == 1) {
    if (!userCommunity) {
      community.allow_access = true;
      community.message = 'Join';
    }
    if (userCommunity && userCommunity.status == 1) {
      community.allow_access = true;
      community.message = 'Joined';
    }
  }

  if (community.created_by == userId) {
    community.allow_access = true;
    community.message = 'Created by you';
  }

  return community;
};

const getUserCommunities = async (userId) => {
  return communityRepository.findUserCommunities(userId);
};

const checkNameAvailability = async (name) => {
  const exists = await communityRepository.checkNameExists(name);
  return { exists };
};

const createCommunity = async (body, userId) => {
  const { error } = communityCreationSchema.validate(body);
  if (error) throw new AppError(error.details[0].message, 400);

  const { name, title, category, description, accessType } = body;

  const id = await communityRepository.create({
    name,
    title,
    category_id: category,
    access_type: accessType,
    description,
    created_by: userId,
  });

  const uc_id = await communityRepository.addUserCommunity({
    user_id: userId,
    community_id: id,
    is_author: 1,
    status: 1,
  });

  return { id, user_comm_id: uc_id, name };
};

const joinCommunity = async (communityId, userId) => {
  const whereObj = { community_id: communityId, user_id: userId };
  const community = await communityRepository.findById(communityId);
  const userCommunity = await communityRepository.findUserMembership(userId, communityId);

  if (userCommunity && userCommunity.is_author == 1) {
    throw new AppError('You are the creator of this community', 401);
  }

  if (userCommunity) {
    if (userCommunity.status == 1) throw new AppError('You already are a member of this community', 401);
    if (userCommunity.status == 0) throw new AppError('Request to join this community is already created', 401);
  }

  // Public community
  if (community.access_type == 1) {
    if (userCommunity && userCommunity.status != 1) {
      await communityRepository.updateUserCommunity(whereObj, { status: 1 });
      return { message: 'Community Joined Successfully', name: community.name };
    }
    await communityRepository.addUserCommunity({
      user_id: userId,
      community_id: community.id,
      status: 1,
      is_author: 0,
    });
    return { message: 'Community Joined Successfully', name: community.name };
  }

  // Private community
  if (userCommunity && userCommunity.status == -1) {
    await communityRepository.updateUserCommunity(whereObj, { status: 0 });
  } else {
    await communityRepository.addUserCommunity({
      user_id: userId,
      community_id: community.id,
      is_author: 0,
    });
  }

  return { message: 'Request sent to the creator for approval', name: community.name };
};

const leaveCommunity = async (communityId, userId) => {
  const whereObj = { user_id: userId, community_id: communityId };
  const userCommunity = await communityRepository.findUserMembership(userId, communityId);

  if (!userCommunity) throw new AppError('Oops! Something went wrong', 400);

  if (userCommunity.status == -1) throw new AppError('You have already left the community', 401);
  if (userCommunity.status == 0) throw new AppError('Your request has not been approved to join the community yet', 401);

  if (userCommunity.status == 1) {
    await communityRepository.updateUserCommunity(whereObj, { status: -1 });
    return 'Community left successfully';
  }

  throw new AppError('Oops! Something went wrong', 400);
};

const checkAccess = async (name, userId) => {
  const communityInfo = await communityRepository.findWithUserMembership(name, userId);
  if (!communityInfo) throw new AppError('No results found', 400);

  let access = true;
  if (
    communityInfo.access_type != 1 &&
    communityInfo.is_author != 1 &&
    communityInfo.status == 0
  ) {
    access = false;
  }

  return { communityInfo, access };
};

module.exports = {
  getCommunityByName,
  getUserCommunities,
  checkNameAvailability,
  createCommunity,
  joinCommunity,
  leaveCommunity,
  checkAccess,
};
