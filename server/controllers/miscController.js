const db = require('../db');
const catchAsync = require('../utils/catchAsync');
const { communityCreationSchema } = require('../utils/validation');
const constants = require('../utils/constants');
const _ = require('lodash');

const getCategories = catchAsync(async (req, res) => {
  const categories = await db.select().from('categories');

  if (!categories) {
    return res.status(400).json({
      success: false,
      message: 'No results found',
    });
  }

  return res.status(200).json({
    success: true,
    data: categories,
  });
});

const getAccessTypes = catchAsync(async (req, res) => {
  const accessTypes = await constants.accessTypes;
  return res.status(200).json({
    success: true,
    data: accessTypes,
  });
});

module.exports = {
  getCategories,
  getAccessTypes,
};
