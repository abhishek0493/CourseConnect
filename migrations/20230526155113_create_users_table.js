/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.increments('id').unsigned().primary();
    table
      .uuid('uuid', { useBinaryUuid: true, primaryKey: true })
      .notNullable()
      .defaultTo(knex.raw('(gen_random_uuid())')); // Use binary(16) UUID and set it as primary key

    table.string('name').notNullable();
    table.string('email').notNullable();
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
