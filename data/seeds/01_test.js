exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('table_name')
        .truncate()
        .then(function () {
            // Inserts seed entries
            return knex('users').insert([
                {id: 1, username: 'foo', password: '$2a$10$6D8ALXhT6nedDT0wHXDgZOopYaDV5lFqBQ03jYaP6m7GAtsx4xUUy'},
            ]);
        });
};