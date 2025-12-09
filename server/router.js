const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  // login
  app.post('/login', mid.requiresLogout, async (req, res) => {
    try {
      const result = await controllers.Account.login(req.body); // expects { username, password }
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // signup
  app.post('/signup', mid.requiresLogout, async (req, res) => {
    try {
      const result = await controllers.Account.signup(req.body); // expects { username, password, ... }
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // logout
  app.post('/logout', mid.requiresLogin, (req, res) => {
    controllers.Account.logout(req, res);
    res.json({ success: true });
  });

  // password change
  app.post('/newpassword', mid.requiresLogin, async (req, res) => {
    try {
      const result = await controllers.Account.changePassword(req.body); // expects { username, oldPassword, newPassword }
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // collage maker (domo for now)
  app.get('/maker', mid.requiresLogin, async (req, res) => {
    try {
      const domos = await controllers.Domo.getDomos(req.session.account._id);
      res.json({ domos });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/maker', mid.requiresLogin, async (req, res) => {
    try {
      const domo = await controllers.Domo.makeDomo(req.body, req.session.account._id);
      res.json(domo);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
};

module.exports = router;