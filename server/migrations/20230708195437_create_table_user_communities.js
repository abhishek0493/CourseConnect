/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('user_communities', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.integer('community_id').unsigned().notNullable();
    table.tinyint('is_author').notNullable().defaultTo(0);
    table
      .tinyint('status')
      .defaultTo(0)
      .comment('0:Un-approved|1:Approved|-1:Left|2:Rejected');

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
  return knex.schema.dropTable('user_communities');
};
