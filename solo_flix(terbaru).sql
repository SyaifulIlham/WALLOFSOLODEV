-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 01 Bulan Mei 2026 pada 10.08
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `solo_flix`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `admins`
--

CREATE TABLE `admins` (
  `id_admin` int(11) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `admins`
--

INSERT INTO `admins` (`id_admin`, `username`, `password`) VALUES
(1, 'syaiful', '12345');

-- --------------------------------------------------------

--
-- Struktur dari tabel `films`
--

CREATE TABLE `films` (
  `id_film` int(11) NOT NULL,
  `judul_film` varchar(150) DEFAULT NULL,
  `id_kategori` int(11) DEFAULT NULL,
  `genre` varchar(50) DEFAULT NULL,
  `durasi` int(11) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `poster` varchar(255) DEFAULT NULL,
  `trailer_url` varchar(500) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Sedang Tayang',
  `created_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `films`
--

INSERT INTO `films` (`id_film`, `judul_film`, `id_kategori`, `genre`, `durasi`, `deskripsi`, `poster`, `trailer_url`, `status`, `created_by`) VALUES
(33, 'READY OR NOT 2: HERE I COME', 1, 'Action', 120, 'Setelah selamat dari satu permainan maut, Grace (Samara Weaving) dan saudara perempuannya, Faith (Kathryn Newton), kini harus melarikan diri dari empat keluarga saingan yang memperebutkan takhta yang kuat - pemenang akan mendapatkan semuanya.\nProduser\nBradley J. Fischer, William Sherak, James Vanderbilt, Tripp Vinson\nSutradara\nMatt Bettinelli-Olpin, Tyler Gillett\nPenulis\nGuy Busick, R. Christopher Murphy\nProduction\n20th Century Studios', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-images/26RN2H.jpg', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-trailer/26RN2H.mp4', 'Akan Datang', 1),
(34, 'DILAN ITB 1997', 1, 'Drama,Romance', 150, 'Tahun 1997, Dilan (Ariel Noah) menjalin hubungan dengan Ancika (Niken Anjani) sambil berusaha menyelesaikan studi di FSRD ITB dan merintis nama sebagai seniman freelance andal. Di saat hubungan Dilan dan Ancika mulai pergi ke arah yang lebih serius, dua orang wanita datang ke dalam hidup Dilan dan menguji Dilan dan Ancika – salah satunya, dari masa lalu Dilan.\nProduser\nFrederica\nSutradara\nFajar Bustomi, Pidi Baiq\nPenulis\nPidi Baiq, Adhitya Mulya, Ninit Yunita\nProduction\nFalcon Pictures', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-images/16DI97.jpg', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-trailer/16DI97.mp4', 'Sedang Tayang', 1),
(35, 'GHOST IN THE CELL', 1, 'Horror, Comedy', 106, 'Di dalam lapas Labuhan Angsana, para napi hidup dengan masalah setiap hari: penindasan dari pejabat lapas, serta permusuhan dan kekerasan antar sesama tahanan. Suatu hari, seorang napi baru masuk dan satu per satu napi mati dengan cara yang sangat mengerikan. Setelah mengetahui bahwa ada hantu yang membunuh orang dengan aura atau energi yang paling negatif, para napi berlomba-lomba berbuat kebaikan untuk membuat aura mereka tetap positif. Tapi tentunya sangat sulit tetap positif di penjara yang penuh ketidakadilan. Hingga mereka sadar satu satu hal yang sepertinya tak mungkin tapi harus mereka lakukan untuk tetap hidup: bersatu untuk melawan penindas, bahkan hantu sekalipun!\nProduser\nTia Hasibuan\nSutradara\nJoko Anwar\nPenulis\nJoko Anwar\nProduction\nCome and See Pictures', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-images/16GITC.jpg', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-trailer/16GITC.mp4', 'Sedang Tayang', 1),
(36, 'THE DEVIL WEARS PRADA 2', 1, 'Drama, Comedy', 120, 'Saat Miranda Priestly (Meryl Streep) mendekati masa pensiun, ia kembali bekerja sama dengan Andy Sachs (Anne Hathaway) untuk menghadapi mantan asistennya yang kini menjadi saingannya: Emily Charlton (Emily Blunt).\nProduser\nWendy Finerman\nSutradara\nDavid Frankel\nPenulis\nAline Brosh McKenna, Lauren Weisberger\nProduction\n20th Century Studios', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-images/26DWP2.jpg', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-trailer/26DWP2.mp4', 'Sedang Tayang', 1),
(37, 'IKATAN DARAH', 1, 'Action', 120, 'Mega (Livi Ciananta), seorang mantan atlet Pencak Silat yang kini bekerja sebagai pramusaji, harus menyelamatkan kakaknya, Bilal (Derby Romero), yang menjadi buruan para gangster terkejam akibat hutang dan pembunuhan yang tak sengaja ia lakukan.\n\nAksi perburuan membuat kakak beradik itu terjebak di sebuah kampung yang seluruh pintu keluarnya telah ditutup oleh para preman anak buah dari bos gangster, yaitu Primbon (Teuku Rifnu). Kini, Mega dan Bilal harus bekerja sama untuk dapat meloloskan diri dari kejaran para gangster itu meski nyawa menjadi taruhannya.\nProduser\nRyan Santoso\nSutradara\nSidharta Tata\nPenulis\nRifki Ardisha, Sidharta Tata\nProduction\nUwais Pictures', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-images/16IDAH.jpg', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-trailer/16IDAH.mp4', 'Sedang Tayang', 1),
(38, 'LEE CRONIN\'S THE MUMMY', 1, 'Horror', 134, 'Setelah sukses besar dengan film EVIL DEAD RISE yang memecahkan rekor, penulis/sutradara Lee Cronin kembali mengangkat salah satu kisah horor paling ikonik sepanjang masa dengan penceritaan ulang yang berani dan penuh kegelapan lewat LEE CRONIN’S THE MUMMY. Putri muda seorang jurnalis menghilang tanpa jejak di padang pasir—delapan tahun kemudian, keluarga yang hancur itu dikejutkan ketika ia kembali. Namun, apa yang seharusnya menjadi reuni yang penuh sukacita berubah menjadi mimpi buruk yang mengerikan.\nProduser\nJames Wan, Jason Blum, John Keville\nSutradara\nLee Cronin\nPenulis\nLee Cronin\nProduction\nWarner Bros. Pictures', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-images/26LCTM.jpg', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-trailer/26LCTM.mp4', 'Sedang Tayang', 1),
(39, 'TIBA TIBA SETAN', 1, 'Comedy, Horror', 120, 'Kekacauan terjadi ketika kakak beradik tiba di sebuah hotel tua yang terbengkalai tempat mereka percaya ayah mereka telah menyembunyikan sebuah harta karun untuk mereka, tanpa mengetahui bahwa salah satu saudara kandung telah menyewa penjaga hotel untuk berpura pura menjadi hantu agar mereka terbebas dari masalah. Namun tanpa sepengetahuan mereka, penjaga hotel telah membangkitkan roh seorang wanita yang dibunuh dan dikubur di hotel tersebut dan akhirnya menghantui mereka. Sekarang mereka semua menjadi korban dan harus menemukan cara untuk bertahan hidup dari teror tersebut.\nProduser\nSridhar Jetty, Jimmy Lalwani\nSutradara\nEtienne Caesar\nPenulis\nRebecca M. Bath, Ridho Brado\nProduction\nEss Jay Pictures', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-images/16TTSN.jpg', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-trailer/16TTSN.mp4', 'Sedang Tayang', 1),
(40, 'MORTAL KOMBAT II', 1, 'Action, Adventure', 120, 'Dari New Line Cinema hadir film terbaru dari franchise video game blockbuster yang penuh aksi brutal, Mortal Kombat II. Kali ini, para juara favorit penggemar—yang kini juga termasuk Johnny Cage sendiri—saling berhadapan dalam pertempuran pamungkas tanpa aturan dan penuh darah untuk mengalahkan kekuasaan gelap Shao Kahn yang mengancam keberadaan Earthrealm dan para pembelanya.\nProduser\nTodd Garner, E. Bennett Walsh, James Wan, Toby Emmerich, Simon McQuoid\nSutradara\nSimon McQuoid\nPenulis\nJeremy Slater, Ed Boon, John Tobias\nProduction\nWarner Bros. Pictures', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-images/25MKT2.jpg', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-trailer/25MKT2.mp4', 'Akan Datang', 1);

-- --------------------------------------------------------

--
-- Struktur dari tabel `jadwal_film`
--

CREATE TABLE `jadwal_film` (
  `id_jadwal` int(11) NOT NULL,
  `id_film` int(11) DEFAULT NULL,
  `tanggal_tayang` date NOT NULL,
  `jam_tayang` time NOT NULL,
  `harga_tiket` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `kategori`
--

CREATE TABLE `kategori` (
  `id_kategori` int(11) NOT NULL,
  `nama_kategori` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `kategori`
--

INSERT INTO `kategori` (`id_kategori`, `nama_kategori`) VALUES
(1, 'Film Bioskop');

-- --------------------------------------------------------

--
-- Struktur dari tabel `seats`
--

CREATE TABLE `seats` (
  `id_seat` int(11) NOT NULL,
  `nomor_kursi` varchar(10) DEFAULT NULL,
  `baris` varchar(5) DEFAULT NULL,
  `status` enum('tersedia','dipesan') DEFAULT 'tersedia'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `tickets`
--

CREATE TABLE `tickets` (
  `id_tiket` int(11) NOT NULL,
  `id_transaksi` int(11) DEFAULT NULL,
  `id_film` int(11) DEFAULT NULL,
  `id_seat` int(11) DEFAULT NULL,
  `jadwal_tayang` datetime DEFAULT NULL,
  `harga` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `transaksi`
--

CREATE TABLE `transaksi` (
  `id_transaksi` int(11) NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  `tanggal_transaksi` datetime DEFAULT NULL,
  `total_harga` int(11) DEFAULT NULL,
  `status_pembayaran` enum('pending','berhasil') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `nama` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `no_hp` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id_user`, `nama`, `email`, `password`, `no_hp`, `created_at`) VALUES
(1, 'Castoricembg', 'inimahmybini@gmail.com', '$2b$10$w6TnBRX9QB14KcHhf629HuiKC0UpkYeaYPQeKHd9w0S6PPNlwfhvC', '081298335678', '2026-04-15 01:26:59');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id_admin`);

--
-- Indeks untuk tabel `films`
--
ALTER TABLE `films`
  ADD PRIMARY KEY (`id_film`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `id_kategori` (`id_kategori`);

--
-- Indeks untuk tabel `jadwal_film`
--
ALTER TABLE `jadwal_film`
  ADD PRIMARY KEY (`id_jadwal`),
  ADD KEY `jadwal_film_ibfk_films` (`id_film`);

--
-- Indeks untuk tabel `kategori`
--
ALTER TABLE `kategori`
  ADD PRIMARY KEY (`id_kategori`);

--
-- Indeks untuk tabel `seats`
--
ALTER TABLE `seats`
  ADD PRIMARY KEY (`id_seat`);

--
-- Indeks untuk tabel `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id_tiket`),
  ADD KEY `id_transaksi` (`id_transaksi`),
  ADD KEY `id_film` (`id_film`),
  ADD KEY `id_seat` (`id_seat`);

--
-- Indeks untuk tabel `transaksi`
--
ALTER TABLE `transaksi`
  ADD PRIMARY KEY (`id_transaksi`),
  ADD KEY `id_user` (`id_user`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `admins`
--
ALTER TABLE `admins`
  MODIFY `id_admin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `films`
--
ALTER TABLE `films`
  MODIFY `id_film` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT untuk tabel `jadwal_film`
--
ALTER TABLE `jadwal_film`
  MODIFY `id_jadwal` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `kategori`
--
ALTER TABLE `kategori`
  MODIFY `id_kategori` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `seats`
--
ALTER TABLE `seats`
  MODIFY `id_seat` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id_tiket` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `transaksi`
--
ALTER TABLE `transaksi`
  MODIFY `id_transaksi` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `films`
--
ALTER TABLE `films`
  ADD CONSTRAINT `films_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `admins` (`id_admin`),
  ADD CONSTRAINT `films_ibfk_kategori` FOREIGN KEY (`id_kategori`) REFERENCES `kategori` (`id_kategori`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `jadwal_film`
--
ALTER TABLE `jadwal_film`
  ADD CONSTRAINT `jadwal_film_ibfk_films` FOREIGN KEY (`id_film`) REFERENCES `films` (`id_film`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`id_transaksi`) REFERENCES `transaksi` (`id_transaksi`),
  ADD CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`id_film`) REFERENCES `films` (`id_film`),
  ADD CONSTRAINT `tickets_ibfk_3` FOREIGN KEY (`id_seat`) REFERENCES `seats` (`id_seat`);

--
-- Ketidakleluasaan untuk tabel `transaksi`
--
ALTER TABLE `transaksi`
  ADD CONSTRAINT `transaksi_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
