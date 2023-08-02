const db = require('../db');
const catchAsync = require('../utils/catchAsync');
const { communityCreationSchema } = require('../utils/validation');

const getCommunityByName = catchAsync(async (req, res) => {
  const loggedInUser = req.user.id;
  const community = await db('communities as c')
    .join('users as u', 'u.id', '=', 'c.created_by')
    .select('c.*', 'u.name as author_name')
    .where('c.name', req.params.name)
    .first();

  if (!community) {
    return res.status(400).json({
      success: false,
      message: 'No results found',
    });
  }

  community.is_author = loggedInUser == community.created_by;
  res.status(200).json({
    success: true,
    data: community,
  });
});

const getUserCommunities = catchAsync(async (req, res) => {
  const loggedInUser = req.user.id;

  const communities = await db('user_communities as uc')
    .join('communities as c', 'c.id', 'uc.community_id')
    .where('uc.user_id', '=', loggedInUser)
    .andWhere(function () {
      this.where('uc.is_author', '=', 1).orWhere('uc.status', '=', 1);
    });

  res.status(200).json({
    success: true,
    data: communities,
  });
});

const checkCommunityNameAvailability = catchAsync(async (req, res) => {
  const { name } = req.body;

  const existingCommunity = await db('communities').where('name', name).first();

  if (existingCommunity) {
    return res.status(200).json({
      success: true,
      exists: true,
    });
  }

  return res.status(200).json({
    success: true,
    exists: false,
  });
});

const createCommunity = catchAsync(async (req, res) => {
  const { error } = communityCreationSchema.validate(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });

  const { name, title, category, description, accessType } = req.body;
  const loggedInUser = req.user.id;

  const id = await db('communities').insert({
    name: name,
    title: title,
    category_id: category,
    access_type: accessType,
    description: description,
    created_by: loggedInUser,
  });

  const uc_id = await db('user_communities').insert({
    user_id: loggedInUser,
    community_id: id,
    is_author: 1,
    status: 2,
  });

  res.status(200).json({
    success: true,
    data: {
      id: id,
      user_comm_id: uc_id,
      name: name,
    },
  });
});

const joinCommunity = catchAsync(async (req, res) => {
  const community_id = req.params.id;
  const loggedInUser = req.user.id;

  const whereObj = {
    community_id: community_id,
    user_id: loggedInUser,
  };

  const community = await db('communities').where('id', community_id).first();
  const userCommunity = await db('user_communities').where(whereObj).first();

  /* Check is user is author */
  if (userCommunity && userCommunity.is_author == 1) {
    return res.status(201).json({
      success: false,
      message: 'You are the creator of this community',
    });
  }

  /* Check if user has already joined or is pending request */
  if (userCommunity) {
    if (userCommunity.status == 1) {
      return res.status(201).json({
        success: false,
        message: 'You already are a member of this community',
      });
    }

    if (userCommunity.status == 0) {
      return res.status(201).json({
        success: false,
        message: 'Request to join this community is already created',
      });
    }
  }

  // For Public (open) community
  if (community.access_type == 1) {
    if (userCommunity && userCommunity.status != 1) {
      await db('user_communities').where(whereObj).update('status', 1);
      return res.status(200).json({
        success: true,
        data: 'Community Joined Successfully',
      });
    }

    const newRow = await db('user_communities').insert({
      user_id: loggedInUser,
      community_id: community.id,
      status: 1,
      is_author: 0,
    });

    res.status(200).json({
      success: true,
      data: newRow,
    });
  }

  const request = await db('user_community_requests').insert({
    user_id: loggedInUser,
    community_id: community.id,
  });

  return res.status(200).json({
    success: true,
    data: request,
  });
});

const leaveCommunity = catchAsync(async (req, res) => {
  const loggedInUser = req.user.id;
  const community_id = req.params.id;

  const userCommunity = await db('user_communities')
    .where({
      community_id: community_id,
      user_id: loggedInUser,
    })
    .first();
});

module.exports = {
  getCommunityByName,
  createCommunity,
  getUserCommunities,
  checkCommunityNameAvailability,
  joinCommunity,
};
