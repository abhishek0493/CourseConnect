const db = require('../db');
const catchAsync = require('../utils/catchAsync');
const { communityCreationSchema } = require('../utils/validation');
const constants = require('../utils/constants');
const _ = require('lodash');
const icons = [
  'DatabaseTwoTone',
  'BankTwoTone',
  'HighlightTwoTone',
  'SmileTwoTone',
  'AccountBookTwoTone',
];

const getCategories = catchAsync(async (req, res) => {
  const categories = await db.select().from('categories');

  if (!categories) {
    return res.status(400).json({
      success: false,
      message: 'No results found',
    });
  }

  const categoriesWithIcons = _.merge(
    [],
    categories.map((category, index) => ({
      ...category,
      icon: icons[index],
    }))
  );

  console.log(categoriesWithIcons);

  return res.status(200).json({
    success: true,
    data: categoriesWithIcons,
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
