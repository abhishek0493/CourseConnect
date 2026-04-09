const db = require('../db');

const findAll = async () => {
  return db.select().from('categories');
};

module.exports = {
  findAll,
};
