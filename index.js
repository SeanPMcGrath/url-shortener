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
