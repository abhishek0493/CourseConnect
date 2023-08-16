/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.increments('id').unsigned().primary();
    table.string('uuid', 255).notNullable().defaultTo(knex.raw('UUID()')); // Use knex.raw to set the default value
    table.string('name', 255).notNullable();
    table.string('email', 255).notNullable();
    table.string('password', 255).notNullable();
    table.tinyint('type').notNullable();
    table.string('type_value', 255).nullable();
    table.integer('reputation_points').defaultTo(0);
    table.integer('total_posts').defaultTo(0);
    table
      .integer('total_upvotes')
      .defaultTo(0)
      .comment('Total Upvotes received');
    table.tinyint('consent').notNullable().defaultTo(0);
    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table
      .timestamp('updated_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
