/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('threads', (table) => {
    table.increments('id').primary();
    table.integer('community_id').unsigned().notNullable();
    table.integer('user_id').unsigned().notNullable();
    table
      .tinyint('type')
      .unsigned()
      .notNullable()
      .comment('1:Course|2:General');

    table.string('title').notNullable();
    table.string('source').nullable();
    table.tinyint('pricing').unsigned().comment('0:Free|1:Paid').nullable();
    table.string('link').nullable();
    table
      .tinyint('is_course_completed')
      .unsigned()
      .defaultTo(0)
      .comment('0:Not Completed|1:Completed');

    table.text('body').nullable();
    table.float('author_rating').unsigned().defaultTo(0);
    table.integer('total_upvotes').unsigned().defaultTo(0);
    table.integer('total_downvotes').unsigned().defaultTo(0);
    table.timestamps(true, true);

    table.foreign('community_id').references('communities.id');
    table.foreign('user_id').references('users.id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('threads');
};
