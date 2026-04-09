/**
 * Test database helper.
 *
 * Seeds a minimal set of test data before tests run, and tears it down
 * afterwards. Uses unique identifiers (timestamps + random) so tests can run
 * concurrently or repeatedly without clashing with production data.
 *
 * All IDs are stored on the exported `ctx` object so individual test files
 * can reference them without re-querying.
 */

require('dotenv').config();
const db = require('../../db');
const bcrypt = require('bcrypt');
const { v4: uuid } = require('uuid');

const ctx = {};

const seed = async () => {
  const ts = Date.now();

  // ── Users ─────────────────────────────────────────────────────────────────
  const userUuid = uuid();
  const user2Uuid = uuid();
  const password = await bcrypt.hash('Password123!', 10);

  const [userId] = await db('users').insert({
    uuid: userUuid,
    name: `Test User ${ts}`,
    email: `testuser_${ts}@example.com`,
    password,
    type: 2,
    type_value: '',
    consent: 1,
  });

  const [user2Id] = await db('users').insert({
    uuid: user2Uuid,
    name: `Test User2 ${ts}`,
    email: `testuser2_${ts}@example.com`,
    password,
    type: 2,
    type_value: '',
    consent: 1,
  });

  // ── Category (use first existing one) ─────────────────────────────────────
  const category = await db('categories').first();
  const categoryId = category.id;

  // ── Communities ───────────────────────────────────────────────────────────
  const [communityId] = await db('communities').insert({
    name: `testcomm-${ts}`,
    title: `Test Community ${ts}`,
    category_id: categoryId,
    access_type: 1, // public
    description: 'Integration test community',
    created_by: userId,
  });

  // Community author record
  await db('user_communities').insert({
    user_id: userId,
    community_id: communityId,
    is_author: 1,
    status: 1,
  });

  const [privateCommunityId] = await db('communities').insert({
    name: `testpriv-${ts}`,
    title: `Test Private Community ${ts}`,
    category_id: categoryId,
    access_type: 2, // private
    description: 'Private integration test community',
    created_by: userId,
  });

  await db('user_communities').insert({
    user_id: userId,
    community_id: privateCommunityId,
    is_author: 1,
    status: 1,
  });

  // ── Thread ──────────────────────────────────────────────────────────────
  const [threadId] = await db('threads').insert({
    community_id: communityId,
    user_id: userId,
    title: `Test Thread ${ts}`,
    type: 2, // General
    body: 'Integration test thread body',
  });

  // ── Comment ───────────────────────────────────────────────────────────────
  const [commentId] = await db('comments').insert({
    thread_id: threadId,
    user_id: userId,
    comment: 'Integration test comment',
    parent_comment_id: 0,
  });

  // ── Store in ctx ──────────────────────────────────────────────────────────
  Object.assign(ctx, {
    ts,
    userId,
    userUuid,
    userEmail: `testuser_${ts}@example.com`,
    userPassword: 'Password123!',
    userName: `Test User ${ts}`,
    user2Id,
    user2Uuid,
    user2Email: `testuser2_${ts}@example.com`,
    categoryId,
    communityId,
    communityName: `testcomm-${ts}`,
    privateCommunityId,
    privateCommunityName: `testpriv-${ts}`,
    threadId,
    commentId,
  });
};

const teardown = async () => {
  // Delete in FK-safe order
  await db('user_comment_actions').whereIn('comment_id', [ctx.commentId]).delete();
  await db('comments').where('thread_id', ctx.threadId).delete();
  await db('user_thread_actions').where('thread_id', ctx.threadId).delete();
  await db('threads').where('id', ctx.threadId).delete();
  await db('user_communities').where('community_id', ctx.communityId).delete();
  await db('user_communities').where('community_id', ctx.privateCommunityId).delete();
  await db('communities').whereIn('id', [ctx.communityId, ctx.privateCommunityId]).delete();
  await db('users').whereIn('id', [ctx.userId, ctx.user2Id]).delete();
};

const destroyDb = async () => {
  await db.destroy();
};

module.exports = { ctx, seed, teardown, destroyDb, db };
