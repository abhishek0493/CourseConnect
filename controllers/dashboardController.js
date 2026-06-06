const dashboardService = require('../services/dashboardService');
const catchAsync = require('../utils/catchAsync');

const getRecentCommunites = catchAsync(async (req, res) => {
  const communities = await dashboardService.getRecentCommunities();
  res.status(200).json({ success: true, data: communities });
});

const getTrendingThreads = catchAsync(async (req, res) => {
  const threads = await dashboardService.getTrendingThreads(req.user.id, req.query);
  res.status(200).json({ success: true, data: threads });
});

const getAllSavedThreads = catchAsync(async (req, res) => {
  const threads = await dashboardService.getSavedThreads(req.user.id);
  res.status(200).json({ success: true, data: threads });
});

const getSearchQueryThreads = catchAsync(async (req, res) => {
  const threads = await dashboardService.searchThreads(req.user.id, req.query.query);
  res.status(200).json({ success: true, data: threads });
});

module.exports = {
  getTrendingThreads,
  getRecentCommunites,
  getAllSavedThreads,
  getSearchQueryThreads,
};
