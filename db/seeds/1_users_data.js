
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, username: 'ianh', hash_pass: '$2a$10$VBX3tQbf/dj6Y73TMrOakeNUQe.6u.wtbnpl/w8wFiWtWrzDp.oY6'}
      ]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));"
      )
    })
};
