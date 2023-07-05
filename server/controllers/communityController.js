const db = require('../db');
const catchAsync = require('../utils/catchAsync');
const { communityCreationSchema } = require('../utils/validation');
const slugify = require('slugify');

const generateSlug = (name, text) => {
  const string = `${name}-${text}`;
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

const createCommunity = catchAsync(async (req, res) => {
  const { error } = communityCreationSchema.validate(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });

  const { name, category, description, type } = req.body;

  const slug = generateSlug(name, '');

  const id = await db('communities').insert({
    name: name,
    category_id: category,
    description: description,
    created_by: 1,
  });

  res.status(200).json({
    success: true,
    data: id,
  });
});

module.exports = {
  getCommunities,
  createCommunity,
};
