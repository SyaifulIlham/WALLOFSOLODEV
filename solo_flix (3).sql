-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 27 Jun 2026 pada 08.26
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
(40, 'MORTAL KOMBAT II', 1, 'Action, Adventure', 120, 'Dari New Line Cinema hadir film terbaru dari franchise video game blockbuster yang penuh aksi brutal, Mortal Kombat II. Kali ini, para juara favorit penggemar—yang kini juga termasuk Johnny Cage sendiri—saling berhadapan dalam pertempuran pamungkas tanpa aturan dan penuh darah untuk mengalahkan kekuasaan gelap Shao Kahn yang mengancam keberadaan Earthrealm dan para pembelanya.\nProduser\nTodd Garner, E. Bennett Walsh, James Wan, Toby Emmerich, Simon McQuoid\nSutradara\nSimon McQuoid\nPenulis\nJeremy Slater, Ed Boon, John Tobias\nProduction\nWarner Bros. Pictures', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-images/25MKT2.jpg', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-trailer/25MKT2.mp4', 'Akan Datang', 1),
(42, 'MINIONS & MONSTERS', 1, 'Action, Adventure', 130, 'Petualangan para Minion di Hollywood tahun 1920-an saat mereka mencari makhluk-makhluk menakutkan untuk film-film monster mereka. Para Minion bekerja sama dengan makhluk hijau untuk menyelamatkan planet ini setelah mereka melepaskan monster-monster berbahaya.\nProduser\nChristopher Meledandri, Bill Ryan\nSutradara\nPierre Coffin\nPenulis\nPierre Coffin, Brian Lynch\nProduction\nUniversal Pictures', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-images/26MMOS.jpg', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-trailer/26MMOS.mp4', 'Akan Datang', 1),
(43, 'CINTA LAMA BABAK KEDUA #CLBK', 1, 'Drama, Romance, Comedy', 106, 'Cinta Lama Babak Kedua adalah drama komedi romantis tentang Raka (Iskak Khivano) dan Ambar (Sintya Marisca) yang tengah menyiapkan pernikahan, hingga rencana bahagia itu hancur saat nenek Raka, Sita (Widyawati), mengetahui bahwa kakek Ambar, Aby (Slamet Rahardjo), adalah cinta lamanya yang pernah meninggalkan luka mendalam.\n\nUsaha Ambar untuk mendamaikan keduanya justru memicu konflik baru, bahkan membuat hubungannya dengan Raka ikut retak. Saat Sita dan Aby tak sengaja dipertemukan kembali di Bandung, bara cinta lama justru menyala lagi dan semakin mengacaukan hubungan kedua cucu mereka.\n\nDi tengah kekacauan itu, Sita menyadari bahwa masa lalu tak selalu harus dimiliki kembali. Dengan kebesaran hati, ia memilih melepaskan cinta lamanya demi masa depan Raka dan Ambar, memberi mereka kesempatan kedua untuk memperjuangkan cinta.\nProduser\nYogi Arifiandy, Vladimir Rama\nSutradara\nIvander Tedjasukmana\nPenulis\nIvander Tedjasukmana, Cindy Robertha Biere, Tritya Krissanti\nProduction\nMIR Productions', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-images/16CLBK.jpg', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-trailer/16CLBK.mp4', 'Akan Datang', 1),
(44, 'DUA NAFAS', 1, 'Drama, Family', 93, 'Wati (Adelia Rasya) 30 tahun menitipkan Anto (Auzan Noh Karepesina) 8 tahun kepada emak mertuanya Mariyam (Aty Cancer) 65 tahun yang tinggal di desa terpencil. Anto yang terbiasa dengan kehidupan serba ada di Jakarta, merasa tertekan harus tinggal berdua bersama neneknya di rumah yang sederhana. Anto menemukan teman yang begitu baik dan perhatian bernama Putri (Bilqis Hafsa) 10 tahun dan Udin (Mantra Gurindam Smaratungga) 11 tahun yang jenaka. Enam belas tahun kemudian, Anto (Syakir Daulay) sudah menjadi dokter menemui neneknya di desa. dengan membawa ijazah dokter. Anto ingin menunjukkan ijazah dokternya kepada nenek tercinta. Sampai di rumah nenek, Anto terharu melihat neneknya sudah menyiapkan makanan kesukaannya di meja. Namun tragisnya, Anto menemukan neneknya yang sudah berumur 81 tahun telah meninggal dalam posisi duduk menunggu kehadirannya. Anto menangis sedih memeluk neneknya yang sudah tidak bernyawa.\nProduser\nPark Joung-Kuk, Syakir Daulay\nSutradara\nHasto Broto\nPenulis\nJo Hyeon Suk, Exan Zen\nProduction\nPT. Sunrise Pictures Indonesia', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-images/16DNAS.jpg', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-trailer/16DNAS.mp4', 'Akan Datang', 1),
(45, 'PETAKA GUNUNG WELIRANG', 1, 'Horror', 105, '5 sahabat merayakan kelulusan dengan mendaki Gunung Welirang. Ketika pendakian melewati Alas Lali Jiwo, mereka mendengar suara gamelan. Berbagai peristiwa misteri terjadi, dan mereka terpisah dalam pusaran dimensi teror magis Alas Lali Jiwo!\nProduser\nChand Parwez Servia, Riza, Mithu Nisar\nSutradara\nIndra Gunawan\nPenulis\nUpi\nProduction\nStarvision', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-images/16PGWG.jpg', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-trailer/16PGWG.mp4', 'Akan Datang', 1),
(46, 'THE DEATH OF ROBIN HOOD', 1, 'Action, Drama', 120, 'Bergulat dengan masa lalunya setelah menjalani kehidupan penuh kejahatan dan pembunuhan, Robin Hood (Hugh Jackman) mendapati dirinya terluka parah setelah pertempuran yang ia kira akan menjadi pertempuran terakhirnya. Di tangan seorang wanita misterius, ia ditawari kesempatan untuk diselamatkan.\nProduser\nHugh Jackman, Alexander Black, Aaron Ryder\nSutradara\nMichael Sarnoski\nPenulis\nMichael Sarnoski\nProduction\nA24', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-images/26DORH.jpg', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-trailer/26DORH.mp4', 'Akan Datang', 1),
(47, 'MOANA', 1, 'Adventure, Fantasy', 115, 'Adaptasi live-action dari film animasi Disney tahun 2016 \'Moana.\'\n\nMoana (Catherine Laga‘aia) menjawab panggilan Samudra dan, untuk pertama kalinya, berlayar melampaui terumbu karang pulau Motunui. Bersama dewa setengah manusia yang terkenal, Maui (Dwayne Johnson), dalam perjalanan tak terlupakan untuk mengembalikan kemakmuran bagi rakyatnya.\nProduser\nBeau Flynn, Dany Garcia, Hiram Garcia, Dwayne Johnson\nSutradara\nThomas Kail\nPenulis\nJared Bush, Dana Ledoux Miller\nProduction\nWalt Disney Pictures', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-images/26MOAA.jpg', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-trailer/26MOAA.mp4', 'Akan Datang', 1),
(48, '402 RUMAH SAKIT ANGKER KOREA', 1, 'Horror', 110, 'Demi mendapatkan 3 Juta Penonton, content creator yang dikenal dengan nama Para Pencari Hantu, memilih untuk melakukan live streaming di sebuah rumah sakit paling angker di Korea Selatan. Juna (Arbani Yasiz), Adit (Saputra Kori), Bara (Elang El Gibran), Arum (Diandra Agatha), Yuri (Lea Ciarachel), Tyas (Aylena Fusil), dan Daeho (Jang Han Sol), bukan hanya akan mendapatkan content yang menarik banyak penonton, mereka juga mendapatkan pengalaman paling mengerikan, mencekam bahkan mematikan yang tak pernah mereka bisa bayangkan sebelumnya.\nProduser\nManoj Punjabi\nSutradara\nAnggy Umbara\nPenulis\nLele Laila\nProduction\nMD Pictures, Pichouse Films, Umbara Brothers Film', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-images/164RSA.jpg', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-trailer/164RSA.mp4', 'Akan Datang', 1),
(49, 'FOUFO', 1, 'Comedy, Sci-Fi', 120, 'Di tengah kesulitan ekonomi di Kampung Rombeng, Muslim (Tretan Muslim), seorang pengepul rongsok keturunan Madura terdesak harus segera melunasi sisa biaya ibadah haji ibunya. Situasi berubah ketika ia menemukan bangkai UFO jatuh di pinggiran kota. Alih-alih menjual besi UFO, Muslim justru menyembunyikan UFO dan alien sekarat, lalu ia namai Foufo. Di luar dugaan, teknologi canggih Foufo berhasil menyelesaikan berbagai masalah keluarga Muslim. Namun, konflik memuncak saat tenggat waktu pelunasan haji tiba dan Foufo kehabisan energi. Muslim kini dihadapkan pada dilema krusial: memberangkatkan haji ibunya, atau membantu Foufo pulang ke kapal induknya?\nProduser\nRicky R. Setiyawan\nSutradara\nBayu Skak\nPenulis\nAchmad Faishol\nProduction\nSKAK Studios, Sinemart', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-images/16FOUO.jpg', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-trailer/16FOUO.mp4', 'Akan Datang', 1),
(50, 'JANGAN BUANG IBU', 1, 'Drama, Family', 120, 'Ristiana (Nirina Zubir), seorang ibu tunggal dengan ketiga anaknya Tama (Refal Hady), Dewi (Amanda Manopo), dan Tria (Saputra Kori) setelah ditinggal suaminya (Dwi Sasono) hidup dalam kesederhanaan dan kerja keras namun mampu membesarkan buah hatinya dengan baik dihadapkan pada kenyataan bahwa suaminya meninggalkan hutang yang sedemikian besar.\n\nTerusik dengan keputusan sepihak dari ibunya, Tama, Dewi, dan Tria dilema dengan keadaan dan kondisi yang ada. Mereka yang dulunya dekat, hangat, utuh sebagal keluarga harus merasakan kesenjangan jarak yang membuat kerinduan yang dalam dari Ristiana. Tak putus harapan untuk berbakti pada ibunda, akankah Tama, Dewi, dan Tria mampu mewujudkan itu sebelum terlambat?\nProduser\nAgung Saputra\nSutradara\nHadrah Daeng Ratu\nPenulis\nWidya Arifianti\nProduction\nLeo Pictures', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-images/16JBIU.jpg', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-trailer/16JBIU.mp4', 'Sedang Tayang', 1),
(51, 'TOY STORY 5', 1, 'Animation', 102, 'Woody, Buzz, Jessie, dan anggota geng lainnya kini terancam dengan kehadiran Lilypad. Sebuah tablet pintar milik Bonnie, yang membuat anak-anak lebih tertarik menghabiskan waktu di gadget canggih tersebut.\nProduser\nJessica Choi, Lindsey Collins\nSutradara\nAndrew Stanton\nPenulis\nAndrew Stanton, McKenna Harris\nProduction\nWalt Disney Pictures', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-images/26TSY5.jpg', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-trailer/26TSY5.mp4', 'Sedang Tayang', 1),
(52, 'SUPERGIRL', 1, 'Superhero, Action', 108, 'Saat musuh kejam yang tak terduga menyerang orang-orang terdekatnya, Kara Zor-El (Milly Alcock), alias Supergirl, terpaksa bekerja sama dengan rekan yang tak disangka-sangka dalam sebuah perjalanan antargalaksi yang epik demi pembalasan dan keadilan.\nProduser\nPeter Safran, James Gunn\nSutradara\nCraig Gillespie\nPenulis\nAna Nogueira\nProduction\nWarner Bros. Pictures', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-images/26SUPL.jpg', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-trailer/26SUPL.mp4', 'Sedang Tayang', 1),
(53, 'OBSESSION', 1, 'Romance, Thriller', 109, 'Setelah berhasil matahin \'One Wish Willow\' yang misterius demi memenangkan hati gadis pujaannya, seorang pria romantis yang putus asa mendapati dirinya mendapatkan apa yang ia minta—namun segera menyadari bahwa beberapa keinginan harus dibayar dengan harga yang gelap dan mengerikan.\nProduser\nJames Harris, Haley Nicole Johnson, Christian Mercuri\nSutradara\nCurry Barker\nPenulis\nCurry Barker\nProduction\nUniversal Pictures', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-images/26OBSN.jpg', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-trailer/26OBSN.mp4', 'Sedang Tayang', 1),
(54, 'TANAH RUNTUH', 1, 'Drama, Action', 120, 'Film ini bercerita tentang perjalanan 2 orang kakak beradik, Ringgo (11) dan Kai (9), dimana Ringgo merupakan seorang anak down syndrome. Mereka terpisah dari sang ibu (40) (Sigi Wimala) saat terjadi kerusuhan di Poso, Sulawesi Tengah. Dalam upaya mencari ibu, keduanya bertemu Idham (Vino G. Bastian), seorang anggota kepolisian yang memilih berpihak pada nilai kemanusiaan di tengah situasi yang penuh ketegangan. Tanah Runtuh menghadirkan kisah tentang keluarga, harapan, dan kemanusiaan yang tetap bertahan di tengah runtuhnya perdamaian.\nProduser\nDenny Siregar\nSutradara\nRudi Soedjarwo\nPenulis\nOka Aurora\nProduction\nDenny Siregar Production', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-images/16TRUH.jpg', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-trailer/16TRUH.mp4', 'Sedang Tayang', 1),
(55, 'CERITA LILA', 1, 'Horror', 106, 'Lila (Firzanah Alya), arwah seorang gadis kecil yang masih terikat pada masa lalunya, terus mencari saudari kembarnya yang hilang, Lili. Kehidupannya berubah saat Nia (Myesha Lin) dan ibunya, Tari (Lutesha), pindah ke rumah tempat Lila berada. Persahabatan yang terjalin antara Lila dan Nia membawa mereka pada pencarian yang perlahan membuka rahasia kelam yang lama terkubur.\n\nKetika kehadiran sosok Rahma (Shareefa Daanish) mulai mengancam keselamatan mereka, Nia meminta bantuan Sara (Sara Wijayanto) dan Wisnu (Wisnu Hardana) untuk mengungkap kebenaran di balik tragedi masa lalu.\nProduser\nRaam Punjabi\nSutradara\nBobby Prasetyo\nPenulis\nErwanto Alphadullah, Gea Rexy\nProduction\nMVP Pictures', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-images/16CLIA.jpg', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-trailer/16CLIA.mp4', 'Sedang Tayang', 1),
(56, 'PHI PHONG: THE BLOOD DEMON', 1, 'Horror, Fantasy', 121, 'Mengisahkan tentang sebuah desa di pegunungan terpencil yang dihantui oleh Phi Phong, entitas supernatural menakutkan yang hidup di antara manusia pada siang hari sementara diam-diam memakan darah dan kekuatan hidup mereka di malam hari.\nProduser\nVo Nguyen Dan\nSutradara\nQuoc Trung Do\nProduction\nBlueBell Studios, MockingBird Pictures', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-images/26PPBD.jpg', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-trailer/26PPBD.mp4', 'Sedang Tayang', 1),
(57, 'COLONY', 1, 'Thriller, Horror', 120, 'Seorang profesor, Se-jeong (Gianna Jun), menghadiri konferensi bioteknologi yang berubah menjadi kekacauan akibat pelepasan virus yang bermutasi dengan cepat. Wabah tersebut mengakibatkan transformasi kepada orang yang terinfeksi, membuat pihak berwenang harus menutup fasilitas tersebut dan menjebak para penyintas di dalamnya dengan ancaman yang semakin meningkat.\nProduser\nCharlie Shin, Yang Yoomin Hailey, Sung Joon-ho\nSutradara\nYeon Sang-ho\nPenulis\nYeon Sang-Ho, Choi Gyu-seok\nProduction\nShowbox', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-images/26COLY.jpg', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-trailer/26COLY.mp4', 'Sedang Tayang', 1),
(58, 'TANAH SENGKETA', 1, 'Drama, Thriller, Mystery', 92, 'Niat Yuni (Dara The Virgin), seorang mahasiswi idealis, untuk mendirikan \"Taman Belajar Gratis\" di Kampung Degong justru mengantarkannya ke pusaran teror. Kampung yang sunyi dan tatapan curiga warga seolah menyimpan rahasia rapat-rapat. Peringatan samar dari kepala desa dan warga tentang tanah lapang yang \"bermasalah\" dan \"angker\" tidak dihiraukannya, hingga teror \"gaib\" mulai datang.\n\nBersama Raka (Awan Reyhan), pemuda lokal yang membantunya, Yuni mulai mengusik masa lalu kelam kampung tersebut—tentang Sulastri, seorang wanita yang hilang misterius bertahun-tahun lalu. Ketika selembar sertifikat tanah tua dan sebuah liontin misterius ditemukan, Yuni dan Raka menyadari bahwa mereka bukan sekadar berhadapan dengan takhayul warga, melainkan sebuah konspirasi darah dan keserakahan yang melibatkan orang-orang paling berkuasa di kampung itu.\nProduser\nMuda Saleh\nSutradara\nMuda Saleh, Sadly Fafa Rachman\nPenulis\nSadly Fafa Rachman, Muda Saleh\nProduction\nOcean Production', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-images/16TSEA.jpg', 'https://nos.jkt-1.neo.id/media.cinema21.co.id/movie-trailer/16TSEA.mp4', 'Sedang Tayang', 1);

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

--
-- Dumping data untuk tabel `jadwal_film`
--

INSERT INTO `jadwal_film` (`id_jadwal`, `id_film`, `tanggal_tayang`, `jam_tayang`, `harga_tiket`) VALUES
(4, 34, '2026-04-30', '12:00:00', 50000.00);

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

--
-- Dumping data untuk tabel `seats`
--

INSERT INTO `seats` (`id_seat`, `nomor_kursi`, `baris`, `status`) VALUES
(2, 'A1', 'A', 'dipesan'),
(3, 'A2', 'A', 'tersedia'),
(4, 'A3', 'A', 'tersedia'),
(5, 'A4', 'A', 'tersedia'),
(6, 'A5', 'A', 'tersedia'),
(7, 'A6', 'A', 'tersedia'),
(8, 'A7', 'A', 'tersedia'),
(9, 'A8', 'A', 'tersedia'),
(10, 'A9', 'A', 'tersedia'),
(11, 'A10', 'A', 'tersedia'),
(12, 'B1', 'B', 'tersedia'),
(13, 'B2', 'B', 'tersedia'),
(14, 'B3', 'B', 'tersedia'),
(15, 'B4', 'B', 'tersedia'),
(16, 'B5', 'B', 'tersedia'),
(17, 'B6', 'B', 'tersedia'),
(18, 'B7', 'B', 'tersedia'),
(19, 'B8', 'B', 'tersedia'),
(20, 'B9', 'B', 'tersedia'),
(21, 'B10', 'B', 'tersedia'),
(22, 'C1', 'C', 'tersedia'),
(23, 'C2', 'C', 'tersedia'),
(24, 'C3', 'C', 'dipesan'),
(25, 'C4', 'C', 'dipesan'),
(26, 'C5', 'C', 'tersedia'),
(27, 'C6', 'C', 'tersedia'),
(28, 'C7', 'C', 'tersedia'),
(29, 'C8', 'C', 'tersedia'),
(30, 'C9', 'C', 'tersedia'),
(31, 'C10', 'C', 'tersedia'),
(32, 'D1', 'D', 'tersedia'),
(33, 'D2', 'D', 'tersedia'),
(34, 'D3', 'D', 'tersedia'),
(35, 'D4', 'D', 'tersedia'),
(36, 'D5', 'D', 'tersedia'),
(37, 'D6', 'D', 'tersedia'),
(38, 'D7', 'D', 'tersedia'),
(39, 'D8', 'D', 'tersedia'),
(40, 'D9', 'D', 'tersedia'),
(41, 'D10', 'D', 'tersedia'),
(42, 'E1', 'E', 'dipesan'),
(43, 'E2', 'E', 'tersedia'),
(44, 'E3', 'E', 'tersedia'),
(45, 'E4', 'E', 'tersedia'),
(46, 'E5', 'E', 'tersedia'),
(47, 'E6', 'E', 'tersedia'),
(48, 'E7', 'E', 'tersedia'),
(49, 'E8', 'E', 'tersedia'),
(50, 'E9', 'E', 'tersedia'),
(51, 'E10', 'E', 'dipesan');

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

--
-- Dumping data untuk tabel `tickets`
--

INSERT INTO `tickets` (`id_tiket`, `id_transaksi`, `id_film`, `id_seat`, `jadwal_tayang`, `harga`) VALUES
(14, 6, 34, 42, '2026-04-29 12:00:00', 50000),
(15, 7, 34, 2, '2026-04-29 12:00:00', 50000),
(16, 8, 34, 25, '2026-04-29 12:00:00', 50000),
(17, 9, 34, 24, '2026-04-29 12:00:00', 50000),
(18, 10, 34, 51, '2026-04-29 12:00:00', 50000);

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

--
-- Dumping data untuk tabel `transaksi`
--

INSERT INTO `transaksi` (`id_transaksi`, `id_user`, `tanggal_transaksi`, `total_harga`, `status_pembayaran`) VALUES
(6, 5, '2026-06-13 23:07:49', 50000, 'berhasil'),
(7, 4, '2026-06-13 23:21:35', 50000, 'berhasil'),
(8, 3, '2026-06-13 23:26:18', 50000, 'berhasil'),
(9, 3, '2026-06-13 23:47:45', 50000, 'berhasil'),
(10, 5, '2026-06-15 11:26:28', 50000, 'berhasil');

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
(1, 'Castoricembg', 'inimahmybini@gmail.com', '$2b$10$w6TnBRX9QB14KcHhf629HuiKC0UpkYeaYPQeKHd9w0S6PPNlwfhvC', '081298335678', '2026-04-15 01:26:59'),
(2, 'Budi Santoso', 'budi@gmail.com', '$2b$10$e7ibiyZMOb8Vdi9ICYllEeo/HNihv7lWM4sm6UKW7KTq8s5R7.4.i', '081234567890', '2026-05-02 14:02:25'),
(3, 'syahrul', 'syahrul@gmail.com', '$2b$10$g95r3ra6OYc2NT2KtNIKcOT8JmblB0hYU2yW4ymfqcw0llDvQsGYK', '085782237449', '2026-05-21 07:48:18'),
(4, 'tester1', 'tester1@gmail.com', '$2b$10$iIIxJYoPnyHE5fUJBXU6lum5AbPEx3rqRsMo9LyOgebty0EfM1ufW', '085712345', '2026-06-12 15:52:53'),
(5, 'tester2', 'tester2@gmail.com', '$2b$10$BFh4zX5a1Eb5x3DEMmZiuuNfs1AdoJKRw5lf24OpiXbS5Au1JVcgK', '085712345', '2026-06-12 16:01:01');

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
  MODIFY `id_film` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT untuk tabel `jadwal_film`
--
ALTER TABLE `jadwal_film`
  MODIFY `id_jadwal` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `kategori`
--
ALTER TABLE `kategori`
  MODIFY `id_kategori` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `seats`
--
ALTER TABLE `seats`
  MODIFY `id_seat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT untuk tabel `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id_tiket` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT untuk tabel `transaksi`
--
ALTER TABLE `transaksi`
  MODIFY `id_transaksi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
