const db = require('../db');
const catchAsync = require('../utils/catchAsync');
const { communityCreationSchema } = require('../utils/validation');

const getCommunityByName = catchAsync(async (req, res) => {
  const loggedInUser = req.user.id;
  const community = await db('communities as c')
    .join('users as u', 'u.id', '=', 'c.created_by')
    .select('c.*', 'u.name as author_name')
    .where('c.name', req.params.name)
    .first()
    .select(
      db.raw(
        '(SELECT COUNT(*) FROM user_communities WHERE community_id = c.id AND status = 1) as total_joined_users'
      )
    );

  if (!community) {
    return res.status(400).json({
      success: false,
      message: 'No results found',
    });
  }

  community.is_author = loggedInUser == community.created_by;
  community.allow_access = true;

  const userCommunity = await db('user_communities')
    .where({
      user_id: loggedInUser,
      community_id: community.id,
    })
    .first();

  if (community.access_type != 1) {
    if (!userCommunity) {
      community.allow_access = false;
      community.message = 'Join';
    }

    if (userCommunity && userCommunity.status == 0) {
      community.allow_access = false;
      community.message = 'Request pending';
    }

    if (userCommunity && userCommunity.status == 1) {
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
    })
    .orderBy('c.id', 'desc');

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
    return res.status(401).json({
      success: false,
      message: 'You are the creator of this community',
    });
  }

  /* Check if user has already joined or is pending request */
  if (userCommunity) {
    if (userCommunity.status == 1) {
      return res.status(401).json({
        success: false,
        message: 'You already are a member of this community',
      });
    }

    if (userCommunity.status == 0) {
      return res.status(401).json({
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
        data: {
          message: 'Community Joined Successfully',
          name: community.name,
        },
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
      data: {
        message: 'Community Joined Successfully',
        name: community.name,
      },
    });
  } else {
    if (userCommunity && userCommunity.status == -1) {
      await db('user_communities').where(whereObj).update('status', 0);
      return res.status(200).json({
        success: true,
        data: {
          message: 'Request sent to the creator for approval',
          name: community.name,
        },
      });
    }
  }

  const request = await db('user_communities').insert({
    user_id: loggedInUser,
    community_id: community.id,
    is_author: 0,
  });

  return res.status(200).json({
    success: true,
    data: {
      message: 'Request sent to the creator for approval',
      name: community.name,
    },
  });
});

const leaveCommunity = catchAsync(async (req, res) => {
  const loggedInUser = req.user.id;
  const community_id = req.params.id;

  const whereObj = {
    user_id: loggedInUser,
    community_id: community_id,
  };

  const userCommunity = await db('user_communities').where(whereObj).first();

  if (userCommunity) {
    if (userCommunity.status == -1) {
      return res.status(401).json({
        success: false,
        message: 'You have already left the community',
      });
    }

    if (userCommunity.status == 0) {
      return res.status(401).json({
        success: false,
        message: 'Your request has not been approved to join the community yet',
      });
    }

    if (userCommunity.status == 1) {
      await db('user_communities').where(whereObj).update('status', -1);
      return res.status(200).json({
        success: true,
        data: 'Community left successfully',
      });
    }
  }

  res.status(400).json({
    success: false,
    message: 'Oops! Something went wrong',
  });
});

const checkCommunityAccess = catchAsync(async (req, res) => {
  const loggedInUser = req.user.id;
  let access = true;
  const { name } = req.params;

  const communityInfo = await db('communities as c')
    .select('c.*', 'uc.is_author', 'uc.status')
    .leftJoin('user_communities as uc', function () {
      this.on('uc.community_id', '=', 'c.id').andOn(
        'uc.user_id',
        '=',
        loggedInUser
      );
    })
    .where('c.name', name)
    .first();

  if (!communityInfo) {
    res.status(400).json({
      success: false,
      messaga: 'No results found',
    });
  }

  if (
    communityInfo &&
    communityInfo.access_type != 1 &&
    communityInfo.is_author != 1 &&
    communityInfo.status == 0
  ) {
    access = false;
  }

  res.status(200).json({
    success: true,
    data: communityInfo,
    access: access,
  });
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
