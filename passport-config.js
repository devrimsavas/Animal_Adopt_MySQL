const LocalStrategy = require('passport-local').Strategy;
const db = require('./models'); // Sequelize models are defined
const UserService = require('./services/UserService'); // check path again to be sure 
const userService = new UserService(db);

function initialize(passport) {
  passport.use(new LocalStrategy({ usernameField: 'username' }, async (username, password, done) => {
    try {
      const user = await userService.getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: 'No user found with that username.' });
      }
      // Directly compare the plain text passwords
      if (password === user.password) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Password incorrect.' });
      }
    } catch (error) {
      return done(error);
    }
  }));

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userService.getUserById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
}

module.exports = initialize;

