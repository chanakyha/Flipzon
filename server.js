const express = require("express");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

app.use(express.static("public"));
app.use(express.json());

const readJSON = (file_path) => {
  const data = fs.readFileSync(file_path);
  return JSON.parse(data);
};

const writeJSON = (file_path, data, extraData) => {
  if (extraData) {
    data = readJSON(file_path).concat(JSON.parse(data));
  } else {
    data = JSON.parse(data);
  }
  fs.writeFileSync(file_path, JSON.stringify(data, null, 2), (err) => {
    console.log(err);
  });
  console.log("witten");
};

app.post("/customers", (req, res) => {
  getData = req.body;
  if (!getData.send) {
    res.json(readJSON("./public/json/customers.json"));
  } else {
    console.log("Recieving");
    console.log("writing the JSON file");
    console.log(getData.content);
    writeJSON("./public/json/customers.json", getData.content, false);
    res.json({ status: "success" });
  }
});
app.post("/coupons", (req, res) => {
  getData = req.body;
  if (!getData.send) {
    res.json(readJSON("./public/json/coupons.json"));
  } else {
    console.log("Recieving");
    console.log("writing the JSON file");
    console.log(getData.content);
    writeJSON("./public/json/customers.json", getData.content);
    res.json({ status: "success" });
  }
});
app.post("/mobiles", (req, res) => {
  getData = req.body;
  if (!getData.send) {
    res.json(readJSON("./public/json/mobiles.json"));
  } else {
    console.log("Recieving");
    console.log("writing the JSON file");
    console.log(getData.content);
    writeJSON("./public/json/customers.json", getData.content);
    res.json({ status: "success" });
  }
});
