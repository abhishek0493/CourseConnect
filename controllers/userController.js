const knex = require('knex');
const knexConfig = require('../knexfile');
const db = knex(knexConfig.development);

async function getAllUsers() {
  try {
    const users = await db.select().from('users');
    return users;
  } catch (error) {
    console.error('Error retrieving users:', error);
    throw error;
  }
}

async function createUser(user) {
  try {
    const createdUser = await db('users').insert(user);
    return createdUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

async function updateUser(id, user) {
  try {
    const updatedUser = await db('users').where('id', id).update(user);
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

async function deleteUser(id) {
  try {
    const deletedUser = await db('users').where('id', id).del();
    return deletedUser;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
