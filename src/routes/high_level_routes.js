const Router = require("express").Router;
const utils = require("../utils/funcs");
const router = Router();

router.use((req, res, next) => {
  if (req.body.secret === process.env.HIGH_LEVEL_SECRET) {
    console.log("Authorised for Operations");
    next();
  } else {
    console.log("Wrong Auth");
    res.status(401).send("unAuthorised");
  }
});

router.get("/", (req, res) => {
  res.send("Hello OP!");
});

router.post("/add", utils.addContact);

router.put("/update", utils.updateContact);

router.delete("/delete", utils.deleteContact);

module.exports = router;
