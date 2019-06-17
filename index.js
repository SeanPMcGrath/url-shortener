const dns = require("dns");
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

app.post("/api/shorturl/new", (req, res) => {
  const schema = {
    original_url: Joi.string()
      .uri()
      .required()
  };

  console.log(dns.lookup(req.body.original_url)); //Need to work on this more

  const result = Joi.validate(req.body, schema);

  if (result.error) {
    res.sendStatus(400).send(result.error.details[0].message); //details[0].message gives only the key error message
    return;
  }

  const shortcut = {
    original_url: req.body.original_url,
    short_url: shortcuts.length + 1
  };
  shortcuts.push(shortcut);
  res.send(shortcut);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
