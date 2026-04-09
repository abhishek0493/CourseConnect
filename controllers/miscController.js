const categoryService = require('../services/categoryService');
const catchAsync = require('../utils/catchAsync');

const getCategories = catchAsync(async (req, res) => {
  const categories = await categoryService.getCategories();
  res.status(200).json({ success: true, data: categories });
});

const getAccessTypes = catchAsync(async (req, res) => {
  const accessTypes = await categoryService.getAccessTypes();
  res.status(200).json({ success: true, data: accessTypes });
});

module.exports = {
  getCategories,
  getAccessTypes,
};
