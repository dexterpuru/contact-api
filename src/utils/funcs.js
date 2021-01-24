const contactModal = require("./contactSchema");

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(email)) {
    return true;
  }
  return false;
}

function validatePhone(phone) {
  if (phone < 1000000000 && phone > 9999999999) {
    return false;
  }
  return true;
}

async function addContact(req, res) {
  if (req.body.contact.phone) {
    if (validatePhone(req.body.contact.phone)) {
      res
        .status(406)
        .send(
          "Phone number can't be less than 1000000000 and greator than 9999999999"
        );
    }
  }

  if (req.body.contact.email) {
    if (validateEmail(req.body.contact.email) === false) {
      res.status(406).send("Email Not Acceptable");
      res.end();
      return;
    }
  } else {
    res.status(406).send("Email is Required");
    res.end();
    return;
  }
  var newContact = new contactModal({
    name: req.body.contact.name,
    phone: req.body.contact.phone || undefined,
    email: req.body.contact.email,
  });

  await newContact.save(function (err, data) {
    if (err) {
      if (err.code === 11000) {
        res.status(406).send("Email Already Exists");
        res.end();
      }
      console.log(err);
    } else {
      console.log("Data Inserted");
      res.send(data);
    }
  });
}

async function deleteContact(req, res) {
  await contactModal.deleteOne(
    {
      email: req.body.contactEmail,
    },
    function (err, data) {
      if (err) {
        console.log(err);
      } else {
        if (data.deletedCount === 0) {
          res.send("No Contact related to requested Email");
        } else {
          res.send("Contact Deleted");
        }
      }
    }
  );
}

async function updateContact(req, res) {
  var updateObject = {};

  if (req.body.contact.name) {
    updateObject["name"] = req.body.contact.name;
  }
  if (req.body.contact.phone) {
    if (validatePhone(req.body.contact.phone)) {
      res
        .status(406)
        .send(
          "Phone number can't be less than 1000000000 and greator than 9999999999"
        );
    }
    updateObject["phone"] = req.body.contact.phone;
  }
  if (req.body.contact.email) {
    if (validateEmail(req.body.contact.email)) {
      updateObject["email"] = req.body.contact.email;
    } else {
      res.status(406).send("Email Not Acceptable");
    }
  }

  await contactModal.findOneAndUpdate(
    { email: req.body.contactEmail },
    { $set: updateObject },
    { new: true },
    function (err, data) {
      if (err) {
        if (err.code === 11000) {
          res.status(406).send("Email Already Exists");
        }
        console.log(err);
      } else {
        console.log("Contact Updated");
        res.status(200).send(data);
      }
    }
  );
}

async function readAll(req, res) {
  await contactModal.find(
    {},
    {},
    {
      skip:
        req.body.page && req.body.page > 1
          ? (req.body.page - 1) * (req.body.limit ? req.body.limit : 10)
          : 0,
      limit: req.body.limit ? req.body.limit : 10,
    },
    function (err, data) {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        console.log(data.length);
        res.send(data);
      }
    }
  );
}

async function search(req, res) {
  switch (req.body.searchCriteria) {
    case "email":
      await contactModal.find(
        {
          email: req.body.value,
        },
        {},
        {
          skip:
            req.body.page && req.body.page > 1
              ? (req.body.page - 1) * (req.body.limit ? req.body.limit : 10)
              : 0,
          limit: req.body.limit ? req.body.limit : 10,
        },
        function (err, data) {
          if (err) {
            console.log(err);
            res.send(err);
          } else {
            res.send(data);
          }
        }
      );
      break;

    case "name":
      await contactModal.find(
        {
          name: req.body.value,
        },
        {},
        {
          skip:
            req.body.page && req.body.page > 1
              ? (req.body.page - 1) * (req.body.limit ? req.body.limit : 10)
              : 0,
          limit: req.body.limit ? req.body.limit : 10,
        },
        function (err, data) {
          if (err) {
            console.log(err);
            res.send(err);
          } else {
            res.send(data);
          }
        }
      );
      break;

    default:
      res
        .status(404)
        .send(
          "Current Search method not available, only Email and Name available"
        );
  }
}

module.exports = {
  addContact: addContact,
  deleteContact: deleteContact,
  updateContact: updateContact,
  readAllContacts: readAll,
  searchContacts: search,
};
