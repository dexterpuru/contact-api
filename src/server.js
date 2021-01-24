const express = require("express");
const bp = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const dbConnection = require("./utils/db");
dbConnection(process.env.MONGO_URI);

const queryRoutes = require("./routes/low_level_routes");
const operationalRoutes = require("./routes/high_level_routes");

app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.use("/op", operationalRoutes);
app.use("/q", queryRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log("Starting app on port", port);
});
