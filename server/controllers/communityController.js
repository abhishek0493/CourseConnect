const db = require('../db');
const catchAsync = require('../utils/catchAsync');
const { communityCreationSchema } = require('../utils/validation');
const slugify = require('slugify');
const helper = require('../utils/helpers');

const generateSlug = (name, id) => {
  const string = `${name}-${id}-cc`;
  const slug = slugify(string, { lower: true, strict: true });
  return slug;
};

const getCommunities = catchAsync(async (req, res) => {
  const communities = await db.select().from('communities');
  if (!communities) {
    return res.status(400).json({
      success: false,
      message: 'No results found',
    });
  }

  return res.status(200).json({
    success: true,
    data: communities,
  });
});

const getUserCommunities = catchAsync(async (req, res) => {
  const loggedInUser = req.user.id;

  const communities = await db('user_communities')
    .join('communities', 'communities.id', 'user_communities.community_id')
    .where('user_communities.user_id', loggedInUser)
    .where('user_communities.is_author', 1)
    .orWhere('user_communities.is_approved', 1);

  res.status(200).json({
    success: true,
    data: communities,
  });
});

const createCommunity = catchAsync(async (req, res) => {
  const { error } = communityCreationSchema.validate(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });

  const { name, category, description, accessType } = req.body;
  const loggedInUser = req.user.id;

  const id = await db('communities').insert({
    name: name,
    category_id: category,
    access_type: accessType,
    description: description,
    created_by: loggedInUser,
  });

  const uc_id = await db('user_communities').insert({
    user_id: loggedInUser,
    community_id: id,
    is_author: 1,
    is_approved: 1,
  });

  res.status(200).json({
    success: true,
    data: {
      id,
      uc_id,
    },
  });
});

module.exports = {
  getCommunities,
  createCommunity,
  getUserCommunities,
};
