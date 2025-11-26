const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  try {
    if (!password || typeof password !== 'string') {
      throw new Error('Password must be a non-empty string');
    }

    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (err) {
    throw new Error(`Password hashing failed: ${err.message}`);
  }
};

const comparePassword = async (password, hashedPassword) => {
  try {
    if (!password || !hashedPassword) {
      throw new Error('Both plain password and hashed password must be provided');
    }

    return await bcrypt.compare(password, hashedPassword);
  } catch (err) {
    throw new Error(`Password comparison failed: ${err.message}`);
  }
};

module.exports = {
  hashPassword,
  comparePassword,
};
