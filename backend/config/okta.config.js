const config = {
  saml: {
    cert: "./config/okta.saml.pem",
    entryPoint:
      "https://dev-36669011.okta.com/app/dev-36669011_fiqdev_1/exk5t8y3n891bFjYq5d7/sso/saml/",
    logoutUrl:
      "https://dev-36669011.okta.com/app/dev-36669011_fiqdev_1/exk5t8y3n891bFjYq5d7/slo/saml",
    lougoutCert: "./config/okta.logout.key",
    issuer: "node-saml",
    options: {
      failureRedirect: "/login",
      failureFlash: true,
    },
  },
  server: {
    port: 3000,
  },
  session: {
    resave: false,
    secret: "secret_password",
    saveUninitialized: true,
  },
};

module.exports = config;
