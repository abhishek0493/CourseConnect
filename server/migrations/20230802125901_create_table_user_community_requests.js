/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('user_community_requests', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.integer('community_id').unsigned().notNullable();
    table
      .tinyint('status')
      .notNullable()
      .defaultTo(0)
      .comment('0:Requested, 1:Approved, 2:Rejected');
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
  return knex.schema.dropTable('user_community_requests');
};
