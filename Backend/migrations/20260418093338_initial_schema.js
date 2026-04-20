/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('admins', function(table) {
      table.increments('id_admin').primary();
      table.string('username', 100);
      table.string('password', 255);
    })
    .createTable('kategori', function(table) {
      table.increments('id_kategori').primary();
      table.string('nama_kategori', 50).notNullable();
    })
    .createTable('films', function(table) {
      table.increments('id_film').primary();
      table.string('judul_film', 150);
      table.integer('id_kategori').unsigned().references('id_kategori').inTable('kategori').onDelete('SET NULL').onUpdate('CASCADE');
      table.string('genre', 50);
      table.integer('durasi');
      table.text('deskripsi');
      table.string('poster', 255);
      table.string('status', 50).defaultTo('Sedang Tayang');
      table.integer('created_by').unsigned().references('id_admin').inTable('admins');
    })
    .createTable('jadwal_film', function(table) {
      table.increments('id_jadwal').primary();
      table.integer('id_film').unsigned().references('id_film').inTable('films').onDelete('CASCADE').onUpdate('CASCADE');
      table.date('tanggal_tayang').notNullable();
      table.time('jam_tayang').notNullable();
      table.decimal('harga_tiket', 10, 2);
    })
    .createTable('users', function(table) {
      table.increments('id_user').primary();
      table.string('nama', 100);
      table.string('email', 100);
      table.string('password', 255);
      table.string('no_hp', 20);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('seats', function(table) {
      table.increments('id_seat').primary();
      table.string('nomor_kursi', 10);
      table.string('baris', 5);
      table.enum('status', ['tersedia', 'dipesan']).defaultTo('tersedia');
    })
    .createTable('transaksi', function(table) {
      table.increments('id_transaksi').primary();
      table.integer('id_user').unsigned().references('id_user').inTable('users');
      table.datetime('tanggal_transaksi');
      table.integer('total_harga');
      table.enum('status_pembayaran', ['pending', 'berhasil']);
    })
    .createTable('tickets', function(table) {
      table.increments('id_tiket').primary();
      table.integer('id_transaksi').unsigned().references('id_transaksi').inTable('transaksi');
      table.integer('id_film').unsigned().references('id_film').inTable('films');
      table.integer('id_seat').unsigned().references('id_seat').inTable('seats');
      table.datetime('jadwal_tayang');
      table.integer('harga');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('tickets')
    .dropTableIfExists('transaksi')
    .dropTableIfExists('seats')
    .dropTableIfExists('users')
    .dropTableIfExists('jadwal_film')
    .dropTableIfExists('films')
    .dropTableIfExists('kategori')
    .dropTableIfExists('admins');
};
