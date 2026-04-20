/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('films').del();
  await knex('jadwal_film').del();
  await knex('tickets').del();
  await knex('transaksi').del();
  await knex('seats').del();
  await knex('users').del();
  await knex('kategori').del();
  await knex('admins').del();

  // Inserts seed entries
  await knex('admins').insert([
    { id_admin: 1, username: 'syaiful', password: '12345' }
  ]);

  await knex('kategori').insert([
    { id_kategori: 1, nama_kategori: 'Film Bioskop' }
  ]);

  await knex('films').insert([
    {
      id_film: 22,
      judul_film: 'READY OR NOT 2: HERE I COME',
      id_kategori: 1,
      genre: 'Action',
      durasi: 120,
      deskripsi: 'Sinopsis\nSetelah selamat dari satu permainan maut, Grace (Samara Weaving) dan saudara perempuannya, Faith (Kathryn Newton), kini harus melarikan diri dari empat keluarga saingan yang memperebutkan takhta yang kuat - pemenang akan mendapatkan semuanya.',
      poster: 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-images/26RN2H.jpg',
      status: 'Akan Datang',
      created_by: 1
    },
    {
      id_film: 23,
      judul_film: 'avenjer 1',
      id_kategori: 1,
      genre: 'Action',
      durasi: 120,
      deskripsi: 'perang saudara 1',
      poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSigKkKnGhKDu8Yds2sqgrJCFZGvX3qq2ZzZyXkkwUHmY6o5jvsneApr4RpkrDMayF3XUdI5UuogPel3j72pDALD63t-4vkH5u1iVX3FTse&s=10',
      status: 'Sedang Tayang',
      created_by: 1
    }
  ]);
};
