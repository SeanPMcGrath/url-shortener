const config = require("config");
const helmet = require("helmet");
const dns = require("dns"); //for dns.lookup function
const Joi = require("@hapi/joi"); //Joi is apparently depreciated per the npm Joi webpage. This is the successor
const express = require("express");
const mongoose = require("mongoose");
const app = express();

if (app.get("env") === "development") {
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next(); //yes, the next is necessary here
  });
}

app.use(express.json());
app.use(helmet());
app.use(express.static("client/")); //permits showing of static files in client folder (ie html)

/*set environment - in terminal: $env:NODE_ENV="development"
$env:vidly_jwtPrivateKey="mySecureKey"
$env:url_shortener_databasePassword=""
use config to get config variables like config.get("serverLocation")
to set environment variables in heroku, use in terminal
heroku config:set NODE_ENV=development
heroku config:set vidly_jwtPrivateKey=mySecureKey
can check heroku variables with just heroku config*/

console.log("Current config is: " + app.get("env"));

mongoose
  .connect(
    config.get("databaseLocation1") +
      config.get("databasePassword") +
      config.get("databaseLocation2"),
    { useNewUrlParser: true }
  ) //newUrlParser came from decreciation warning
  .then(() => console.log("Connected to database"))
  .catch(err => console.error("Connection to database failed"));
//local mongoDB location = "mongodb://localhost/url-shortener"

const urlSchema = new mongoose.Schema({
  original_url: String
});

const UrlEntry = mongoose.model("UrlEntry", urlSchema);

app.get("/api/shorturls", async (req, res) => {
  const urlEntries = await UrlEntry.find().sort({ _id: -1 });
  res.send(urlEntries);
});

app.get("/api/shorturl/:id", async (req, res) => {
  const schema = {
    id: Joi.string()
      .alphanum()
      .max(25)
      .required()
  };

  const result = Joi.validate(req.params, schema);

  if (result.error) {
    res.status(400).send(result.error.details[0].message); //details[0].message gives only the key error message
    return;
  }

  const urlEntry = await UrlEntry.findById(req.params.id);
  const destinationUrl = urlEntry.original_url;
  res.redirect(302, destinationUrl);
  //without the http this only replaces the id part of the url with destinationUrl
  //301 is a permanent move. 302 is temporary.
});

app.post("/api/shorturl/new", async (req, res) => {
  const schema = {
    original_url: Joi.string()
      .uri()
      .required() //.uri() won't accept uri's without http
  };

  const result = Joi.validate(req.body, schema);

  if (result.error) {
    res.status(400).send("Not a valid Url"); //details[0].message gives only the key error message
    return;
  }

  const linkUrl = req.body.original_url;

  let filteredUrl = "";
  let checkedUrl = "";

  //dns.lookup doesn't take addresses with http or https
  if (linkUrl.startsWith("http://")) {
    filteredUrl = linkUrl.slice(7); // http:// is 7 characters. Takes contents after.
  } else if (linkUrl.startsWith("https://")) {
    filteredUrl = linkUrl.slice(8); // https:// is 8 characters. Takes contents after.
  } else {
    filteredUrl = linkUrl;
  }

  //if filtered url contains a / eliminate the / and everything after for DNS lookup

  if (filteredUrl.includes("/")) {
    checkedUrl = filteredUrl.slice(0, filteredUrl.indexOf("/"));
  } else {
    checkedUrl = filteredUrl;
  }

  dns.lookup(checkedUrl, async function(err, addresses, family) {
    console.log(addresses);
    //No idea what that specific domain is. Only started getting it after started to use MongoDB Atlas.
    if (!addresses || addresses === "92.242.140.2") {
      res.status(400).send("Invalid Domain");
    } else {
      let urlEntry = new UrlEntry({
        original_url: req.body.original_url
      });
      const result = await urlEntry.save();

      console.log(result);

      res.send(result);
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
