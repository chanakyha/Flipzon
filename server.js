const express = require("express");
const fs = require("fs");

const app = express();

app.listen(3000, () => console.log("Listening on port 3000"));

app.use(express.static("public"));
app.use(express.json());

const readJSON = (file_path) => {
  const data = fs.readFileSync(file_path);
  return JSON.parse(data);
};

const writeJSON = (file_path, data) => {
  fs.writeFileSync(file_path, JSON.stringify(data, null, 2), (err) => {
    console.log(err);
  });
};

app.post("/customers", (req, res) => {
  getData = req.body;
  if (!getData.send) {
    res.json(readJSON("./public/json/customers.json"));
  } else {
    console.log("write");
  }
});
