const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  // login
  app.post('/login', mid.requiresLogout, controllers.Account.login);

  // signup
  app.post('/signup', mid.requiresLogout, controllers.Account.signup);

  // logout
  app.post('/logout', mid.requiresLogin, controllers.Account.logout);

  // change password
  app.post('/newpassword', mid.requiresLogin, controllers.Account.changePassword);

  // collage maker!

  // get all collages for logged-in user
  app.get('/maker', mid.requiresLogin, controllers.Collage.getCollages);

  // create or update a collage
  app.post('/maker', mid.requiresLogin, controllers.Collage.upsertCollage);

  // delete a collage by ID
  app.delete('/maker/:id', mid.requiresLogin, controllers.Collage.deleteCollage);
};

module.exports = router;