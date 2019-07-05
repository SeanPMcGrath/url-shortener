const dns = require("dns"); //for dns.lookup function
const Joi = require("@hapi/joi"); //Joi is apparently depreciated per the npm Joi webpage. This is the successor
const express = require("express");
const app = express();

app.use(express.json());

shortcuts = [
  { original_url: "www.google.com", short_url: 1 },
  { original_url: "www.reddit.com", short_url: 2 }
];

app.get("/api/shorturls", (req, res) => {
  res.send(shortcuts);
});

app.get("/api/shorturl/:id", (req, res) => {
  req.params.id = parseInt(req.params.id, 10); //Id is passed in as a string
  console.log("Req id: " + req.params.id);
  const urlEntry = shortcuts.find(urlEntry => {
    console.log(
      "Req Id in find: " + req.params.id + ", Type: " + typeof req.params.id
    );
    console.log(
      "short_url id: " +
        urlEntry.short_url +
        ", Type: " +
        typeof urlEntry.short_url
    );
    console.log(req.params.id === urlEntry.short_url);
    return req.params.id === urlEntry.short_url;
  });
  const destinationUrl = urlEntry.original_url;
  console.log("Located destination url: " + destinationUrl);
  //window.location.replace("www.google.com");
  res.sendStatus(200);
});

app.post("/api/shorturl/new", async (req, res) => {
  const schema = {
    original_url: Joi.string().required() //.uri() won't accept uri's without http
  };

  const result = Joi.validate(req.body, schema);

  if (result.error) {
    res.status(400).send(result.error.details[0].message); //details[0].message gives only the key error message
    return;
  }

  const linkUrl = req.body.original_url;

  let filteredUrl = "";

  //dns.lookup doesn't take addresses with http or https
  if (linkUrl.startsWith("http://")) {
    filteredUrl = linkUrl.slice(7); // http:// is 7 characters. Takes contents after.
  } else if (linkUrl.startsWith("https://")) {
    filteredUrl = linkUrl.slice(8); // https:// is 8 characters. Takes contents after.
  } else {
    filteredUrl = linkUrl;
  }

  console.log("filteredUrl: " + filteredUrl);

  dns.lookup(filteredUrl, async function(err, addresses, family) {
    console.log(addresses);
    if (!addresses) {
      res.status(400).send("Bad Request: Site has no IP address");
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
