langkah satu lakukan instalasi pada folder frontend dan backend

1. frontend
npm install axios react-router-dom bootstrap react-bootstrap bootstrap-icons 

2. backend
npm install express mysql2 cors jsonwebtoken bcrypt
npm install -D nodemon

langkah 2 terbaru coba lakukan ini di backend :
Jalankan Migration:

Bash
npx knex migrate:latest
Jalankan Seeder:

Bash
npx knex seed:run


