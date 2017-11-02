
exports.up = function(knex) {
  return knex.schema.createTable('addresses', function(table) {
    table.increments()
    table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE').index()
    table.string('address').notNullable()
    table.string('amount_in_wallet')
    table.timestamps(true, true)
  });
}

exports.down = function(knex) {
  return knex.schema.dropTable('addresses')
};
