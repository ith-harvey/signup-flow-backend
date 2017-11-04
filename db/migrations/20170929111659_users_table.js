
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments()
    table.string('name').notNullable()
    table.string('email').notNullable()
    table.string('hash_pass').notNullable()
    table.string('subscription')
    table.timestamps(true, true)
  });
}

exports.down = function(knex) {
  return knex.schema.dropTable('users')
};
