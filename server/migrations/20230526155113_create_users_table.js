/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.increments('id').primary();
    table.string('uuid').notNullable().unique().defaultTo(knex.raw('(UUID())'));
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.tinyint('type').notNullable();
    table.string('type_value').nullable();
    table.integer('reputation_points').defaultTo(0);
    table.integer('total_posts').defaultTo(0);
    table
      .integer('total_upvotes')
      .defaultTo(0)
      .comment('Total Upvotes received');
    table.tinyint('consent').notNullable().defaultTo(0);
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
