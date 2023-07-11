const db = require('../db');
const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');

const getUserThreads = catchAsync(async (req, res) => {});

const createThread = catchAsync(async (req, res) => {
  res.send(req.body);
});

module.exports = {
  getUserThreads,
  createThread,
};
