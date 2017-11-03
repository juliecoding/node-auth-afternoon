const express = require('express');
const session = require('express-session');
const passport = require('passport');
const strategy = require('./strategy');
const request = require('request');

const app = express();
app.use( session({
  secret: '@nyth!ng y0u w@nT',
  resave: false,
  saveUninitialized: false
}));

app.use( passport.initialize() );
app.use( passport.session() );
passport.use(strategy);

passport.serializeUser( (user, done) => {
  console.log("USER FROM PASSPORT", user);
  let { clientID, email, name, followers_url } = user._json;
  done(JSON.stringify({
    clientID: clientID,
    email: email,
    name: name,
    //followers_url: followers_url
  }), null, 4)
});

passport.deserializeUser( (ob, done) => {
  done(null, obj);
});

app.get('/login', passport.authenticate('auth0', {
    successRedirect: '/followers',
    failureRedirect: '/login',
    failureFlash: true,
    connection: 'github'
  }
));

app.get('/followers', (req, res, next) => {
  //Is there a user on the session?
  if (req.user) {
    console.log("USER", user);
    request({
      url: req.user.followers,
      headers: {
        'User-Agent': req.user.clientID
      }
    }, (error, response, body) => {
      res.status.send(body)
    })
  } else {
    res.redirect('/login');
  }
})


const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}`); } );
