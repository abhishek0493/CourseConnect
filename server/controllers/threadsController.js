const db = require('../db');
const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const { threadCreationSchema } = require('../utils/validation');

const getCommunityUserThreads = catchAsync(async (req, res) => {
  const community = req.params.community;

  const threads = await db('threads as t')
    .select(
      't.*',
      'u.name as author',
      'c.category_id',
      'uc.is_author',
      'uc.is_approved',
      'c.name',
      'c.description',
      'c.access_type'
    )
    .join('communities as c', 'c.id', '=', 't.community_id')
    .join('user_communities as uc', 'uc.community_id', '=', 'c.id')
    .join('users as u', 'u.id', '=', 't.user_id')
    .andWhere(function () {
      this.where('uc.is_author', 1).orWhere('uc.is_approved', 1);
    })
    .andWhere('c.name', community)
    .orderBy('t.id', 'desc');

  if (threads) {
    res.status(200).json({
      success: true,
      data: threads,
    });
  }
});

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

  const community = await db('communities').where('id', data.community).first();

  return res.status(200).json({
    success: true,
    data: {
      id: id,
      name: community.name,
    },
  });
});

const getThreadDetails = catchAsync(async (req, res) => {
  const loggedInUser = req.user.id;
  const id = req.params.id;
  const thread = await db('threads').where('id', id).first();

  if (!thread) {
    res.status(401).json({
      success: false,
      message: 'No result found',
    });
  }

  res.status(200).json({
    success: true,
    data: thread,
  });
});

const createThreadComment = catchAsync(async (req, res) => {
  const loggedInUser = req.user.id;
  const id = req.params.id;

  const thread = await db('threads').where('id', id).first();
  const comment = await db('comments').insert({
    thread_id: thread.id,
    user_id: loggedInUser,
    comment: req.body.comment,
  });
  res.status(200).json({
    success: true,
    data: comment,
  });
});

module.exports = {
  getCommunityUserThreads,
  getThreadDetails,
  createThreadComment,
  createThread,
};
