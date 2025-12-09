const models = require('../models');

const { Account } = models;

// login
const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ success: true, redirect: '/dashboard' });
  });
};

// signup
const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();

    req.session.account = Account.toAPI(newAccount);
    return res.json({ success: true, redirect: '/dashboard' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username is already in use!' });
    }
    return res.status(500).json({ error: 'An error occurred!' });
  }
};

// logout
const logout = (req, res) => {
  req.session.destroy();
  return res.json({ success: true });
};

// change password
const changePassword = async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;

  if (!username || !oldPassword || !newPassword) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  try {
    const account = await Account.findOne({ username }).exec();
    if (!account) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isValid = await Account.authenticate(username, oldPassword, (err, user) => {
      if (err || !user) return false;
      return true;
    });

    if (!isValid) {
      return res.status(401).json({ error: 'Old password is incorrect' });
    }

    //hsh the new password
    const hash = await Account.generateHash(newPassword);
    account.password = hash;
    await account.save();

    return res.json({ success: true, message: 'Password changed successfully!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'An error occurred while changing password' });
  }
};

module.exports = {
  login,
  signup,
  logout,
  changePassword,
};