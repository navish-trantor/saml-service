const fs = require("fs");
const passport = require("passport");
const SamlStrategy = require("passport-saml").Strategy;
const config = require("./config/okta.config");

const passportStratergy = new SamlStrategy(
  {
    issuer: config.saml.issuer,
    protocol: "http://",
    path: "/login/callback",
    entryPoint: config.saml.entryPoint,
    logoutUrl: config.saml.logoutUrl,
    cert: fs.readFileSync(config.saml.cert, "utf-8"),
    privateKey: fs.readFileSync(config.saml.lougoutCert, "utf-8"),
    signatureAlgorithm: "sha256",
  },
  (expressUser, done) => {
    // console.log(JSON.stringify(expressUser));
    if (!users.includes(expressUser)) {
      users.push(expressUser);
    }

    return done(null, expressUser);
  }
);

const users = [];

const findByEmail = (email, fn) => {
  for (let i = 0, len = users.length; i < len; i++) {
    const user = users[i];
    if (user.email === email) {
      return fn(null, user);
    }
  }
  return fn(null, null);
};

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser((id, done) => {
  findByEmail(id, (err, user) => {
    done(err, user);
  });
});

passport.use(passportStratergy);

module.exports = { passport, passportStratergy };
