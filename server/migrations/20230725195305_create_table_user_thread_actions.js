/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('user_thread_actions', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.integer('thread_id').unsigned().notNullable();
    table.tinyint('is_upvoted').notNullable().defaultTo(0);
    table.tinyint('is_downvoted').notNullable().defaultTo(0);
    table.tinyint('is_saved').notNullable().defaultTo(0);

    table.timestamps(true, true);

    table.foreign('user_id').references('users.id');
    table.foreign('thread_id').references('threads.id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('user_thread_actions');
};
