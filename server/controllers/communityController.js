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
      this.where('uc.is_author', '=', 1).orWhere('uc.is_approved', '=', 1);
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
    is_approved: 1,
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

module.exports = {
  getCommunityByName,
  createCommunity,
  getUserCommunities,
  checkCommunityNameAvailability,
};
