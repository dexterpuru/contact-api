const Router = require("express").Router;
const utils = require("../utils/funcs");
const router = Router();
require("dotenv").config();

router.use((req, res, next) => {
  if (req.body.secret === process.env.LOW_LEVEL_SECRET) {
    console.log("Authorised for Queries");
    next();
  } else {
    console.log("Wrong Auth");
    res.status(401).send("unAuthorised");
  }
});

router.get("/", (req, res) => {
  res.send("Hello Q!");
});

router.get("/all", utils.readAllContacts);

router.get("/search", utils.searchContacts);

module.exports = router;
