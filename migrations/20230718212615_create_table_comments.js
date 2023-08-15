/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('comments', (table) => {
    table.increments('id').primary();
    table.integer('thread_id').unsigned().notNullable();
    table.integer('parent_comment_id').unsigned().notNullable().defaultTo(0);
    table.integer('user_id').unsigned().notNullable();
    table.string('comment').notNullable();
    table.integer('total_upvotes').defaultTo(0);
    table.integer('total_downvotes').defaultTo(0);

    table.timestamps(true, true);

    table.foreign('thread_id').references('threads.id');
    table.foreign('user_id').references('users.id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('comments');
};
