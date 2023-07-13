const db = require('../db');
const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const { threadCreationSchema } = require('../utils/validation');

const getUserThreads = catchAsync(async (req, res) => {});

const createThread = catchAsync(async (req, res) => {
  const { error } = threadCreationSchema.validate(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });

  const data = req.body;
  const loggedInUser = req.user.id;

  const id = await db('threads').insert({
    community_id: data.community,
    user_id: loggedInUser,
    title: data.title,
    type: data.type,
    source: data.source,
    pricing: data.pricing,
    link: data.link,
    body: data.body,
    is_course_completed: data.is_completed ? 1 : 0,
    author_rating: data.rating,
  });

  return res.status(200).json({
    success: true,
    data: id,
  });
});

module.exports = {
  getUserThreads,
  createThread,
};
