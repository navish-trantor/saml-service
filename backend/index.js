const app = require("express")();
const cookie = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const { passport: auth, passportStratergy: samlStrategy } = require("./auth");
const config = require("./config/okta.config");

const PORT = 3000;
let REDIRECT_ROUTE = ""; // need to save in session

const getRedirectLink = (req, res, next) => {
  console.log("REDIRECT TO: ", req.query.location);
  REDIRECT_ROUTE = req.query.location;
  next();
};

app.use(bodyParser());
app.use(cookie());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(session({ secret: "roomapplication session" }));
app.use(auth.initialize());
app.use(auth.session());

app.get("/", (req, res) => {
  console.log("Do not hit this get route");
  res.send("This is Hello World!!");
});

app.get(
  "/login",
  getRedirectLink,
  auth.authenticate("saml", config.saml.options),
  (req, res) => {
    res.redirect("/");
  }
);

//OKTA Route
app.post(
  "/login/callback",
  auth.authenticate("saml", config.saml.options),
  (req, res) => {
    if (REDIRECT_ROUTE === "")
      return console.log("could not find the redirect url. ", REDIRECT_ROUTE);

    res.redirect(REDIRECT_ROUTE);
  }
);

app.get("/whoami", (req, res, next) => {
  if (!req.isAuthenticated()) {
    console.log("User not authenticated");

    return res.status(401).json({
      message: "Unauthorized",
    });
  } else {
    console.log("User authenticated");

    return res.status(200).json({ user: req.user });
  }
});

app.post("/logout", (req, res) => {
  res.redirect("http://localhost:5173");
});

app.get("/logout", (req, res, next) => {
  samlStrategy.logout(req, (err, url) => {
    if (err) return res.send(new Error(err));
    req.logout((err) => {
      console.log("Loggout: error", err);
      if (err) {
        console.log("Loggout: error", err);
      }
      req.session.destroy(function (err) {
        if (!err) {
          return res.redirect(url);
        } else {
          alert(err);
        }
      });
    });
  });
});

app.listen(PORT, () => console.log("OLA!!"));
