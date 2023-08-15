/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('user_comment_actions', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.integer('comment_id').unsigned().notNullable();
    table.tinyint('is_upvoted').notNullable().defaultTo(0);
    table.tinyint('is_downvoted').notNullable().defaultTo(0);
    table.tinyint('is_pinned').notNullable().defaultTo(0);

    table.timestamps(true, true);

    table.foreign('user_id').references('users.id');
    table.foreign('comment_id').references('comments.id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('user_comment_actions');
};
