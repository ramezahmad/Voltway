require("dotenv").config()
const bcrypt = require("bcrypt");
const saltRounds = process.env.HASH_ROUNDS; // Number of salt rounds for hashing (adjust as needed)

const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
};

const verifyPassword = async (password, hashedPassword) => {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    throw error;
  }
};

module.exports = { hashPassword, verifyPassword };
