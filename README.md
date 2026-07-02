# WALLOFSOLODEV

Fullstack SoloFlix application with a React frontend and Express/Knex backend.

## Struktur Proyek
- `Frontend/`: React client
- `Backend/`: Express API, MySQL, Knex migrations/seeds

## Instalasi

1. Install dependencies di root (opsional, jika ingin jalankan kedua bagian sekaligus):
   ```bash
   npm install
   ```

2. Install dependencies backend:
   ```bash
   cd Backend
   npm install
   ```

3. Install dependencies frontend:
   ```bash
   cd ../Frontend
   npm install
   ```

## Konfigurasi Backend

Buat file `Backend/.env` dengan setelan berikut:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=solo_flix
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
CORS_ORIGIN=http://localhost:5173
```

> `Backend/.gitignore` sudah mengabaikan file `.env`.

## Setup Database

Jalankan migrasi dan seeder di folder `Backend`:

```bash
cd Backend
npx knex migrate:latest
npx knex seed:run
```

## Menjalankan Aplikasi

- Backend:
  ```bash
  cd Backend
  npm run dev
  ```
- Frontend:
  ```bash
  cd Frontend
  npm run dev
  ```

## Shortcut Root Scripts

Dari root repository:

- `npm run backend` → jalankan backend
- `npm run frontend` → jalankan frontend
- `npm run dev` → jalankan frontend + backend bersamaan

## Catatan

Frontend akan menggunakan `VITE_API_BASE_URL` jika tersedia, atau default ke `http://localhost:3000`.


