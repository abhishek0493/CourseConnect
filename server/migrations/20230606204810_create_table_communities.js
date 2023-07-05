/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('communities', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.integer('category_id').unsigned().notNullable();
    table.tinyint('access_type').unsigned().notNullable();
    table.text('description');
    table.bigInteger('created_by').unsigned().notNullable();
    table.timestamps(true, true);

    table.foreign('category_id').references('categories.id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('communities');
};
