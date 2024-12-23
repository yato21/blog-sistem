const { User } = require('../models');
const bcrypt = require('bcryptjs');

class UserService {
  async createUser(username, password) {
    const passwordHash = await bcrypt.hash(password, 10);
    return User.create({
      username,
      password_hash: passwordHash
    });
  }

  async findUserByUsername(username) {
    return User.findOne({ where: { username } });
  }
}

module.exports = new UserService(); 