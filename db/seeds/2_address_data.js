
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('addresses').del()
    .then(function () {
      // Inserts seed entries
      return knex('addresses').insert([
        {id: 1, user_id: '1', address:'0x64042ba68b12d4c151651ca2813b7352bd56f08e', amount_in_wallet: '188.27033273'},
        {id: 2, user_id: '1', address:'0x9644d964867ace0534559a5435a1d780a25cf03a', amount_in_wallet: '0'},
      ]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('addresses_id_seq', (SELECT MAX(id) FROM addresses));"
      )
    })
};
