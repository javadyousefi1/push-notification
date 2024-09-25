const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");
const PushNotifications = require("node-pushnotifications");

const app = express();

// Set static path
app.use(express.static(path.join(__dirname, "client")));

app.use(bodyParser.json());
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader("Access-Control-Allow-Headers", "*");

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

let subscriptions = []

app.post("/subscribe", (req, res) => {
  // Get pushSubscription object
  const subscription = req.body;
  subscriptions.push(subscription);

  const settings = {
    web: {
      vapidDetails: {
        "subject": "mailto:javadyousefi9000@gmail.com",
        "publicKey": "BJN3VH6osLowteGICTF9yynGmAzxIUkIM2zAYz4GhJPpnW0vqRvXNKGNPEIt9WCOZip_FEhqezoWuK9BEjj3clM",
        "privateKey": "PS1323zy8e-VKva5Z6TStHDVBsxvCAEWFFVoXxAvNmk"
      },
      gcmAPIKey: "gcmkey",
      TTL: 2419200,
      contentEncoding: "aes128gcm",
      headers: {},
    },
    isAlwaysUseFCM: false,
  };

  // Send 201 - resource created
  const push = new PushNotifications(settings);


  console.log(req.body)

  // Create payload
  const payload = { title: req.body.keys.title };
  push.send(subscription, payload, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      // console.log("result");
    }
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/main.js", (req, res) => {
  res.sendFile(__dirname + "/main.js");
});
app.get("/sw.js", (req, res) => {
  res.sendFile(__dirname + "/sw.js");
});

const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));
