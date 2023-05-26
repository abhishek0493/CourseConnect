/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('users', function(table) {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('email').notNullable().unique();
        table.tinyint('type').notNullable();
        table.string('type_value').nullable();
        table.integer('reputation_points').defaultTo(0);
        table.integer('total_posts').defaultTo(0);
        table.integer('total_upvotes').defaultTo(0).comment('Total Upvotes received');
        table.timestamps(true, true);
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
