const categoryRepository = require('../repositories/categoryRepository');
const { accessTypes } = require('../utils/constants');

const getCategories = async () => {
  const categories = await categoryRepository.findAll();
  if (!categories || categories.length === 0) {
    const AppError = require('../utils/appError');
    throw new AppError('No results found', 400);
  }
  return categories;
};

const getAccessTypes = async () => {
  return accessTypes;
};

module.exports = {
  getCategories,
  getAccessTypes,
};
