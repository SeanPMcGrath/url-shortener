const config = require("config");
const helmet = require("helmet");
const dns = require("dns"); //for dns.lookup function
const Joi = require("@hapi/joi"); //Joi is apparently depreciated per the npm Joi webpage. This is the successor
const express = require("express");
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

//set environment - in terminal: export NODE_ENV=development
//use config to get config variables like config.get.serverLocation
console.log("Current config is: " + app.get("env"));

shortcuts = [
  { original_url: "https://www.google.com", short_url: 1 },
  { original_url: "https://www.reddit.com", short_url: 2 }
];

app.get("/api/shorturls", (req, res) => {
  res.send(shortcuts);
});

app.get("/api/shorturl/:id", (req, res) => {
  const schema = {
    id: Joi.string()
      .regex(/\D/, { invert: true })
      .max(20)
      .required()
    //\D is non-digits - invert to not accept any
  };

  const result = Joi.validate(req.params, schema);

  if (result.error) {
    res.status(400).send(result.error.details[0].message); //details[0].message gives only the key error message
    return;
  }

  req.params.id = parseInt(req.params.id, 10); //Id is passed in as a string
  const urlEntry = shortcuts.find(searchEntries => {
    return req.params.id === searchEntries.short_url;
    /*find goes through every object in the array starting at index 0
    Could modify to start at the index of the id and work backwards
    since, while entries could be deleted, entries should never be unshifted further out */
  });
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
    if (!addresses) {
      res.status(400).send("Invalid Domain");
    } else {
      const shortcut = {
        original_url: req.body.original_url,
        short_url: shortcuts.length + 1
      };
      shortcuts.push(shortcut);
      res.send(shortcut);
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
