const db = require('../config/connect');

const findUserByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows;
};

const createUser = async ({ nama, email, password, no_hp }) => {
  const query = 'INSERT INTO users (nama, email, password, no_hp) VALUES (?, ?, ?, ?)';
  const [result] = await db.query(query, [nama, email, password, no_hp]);
  return result;
};

const findAdminByUsername = async (username) => {
  const [rows] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
  return rows;
};

module.exports = {
  findUserByEmail,
  createUser,
  findAdminByUsername,
};
