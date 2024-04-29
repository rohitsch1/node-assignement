const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const fileModel = require("../models/file");
const mongoose = require("mongoose");
const objectID = mongoose.Types.ObjectId;

const authentication = function (req, res, next) {
  try {
    let token = req.headers["authorization"]; // Extract token from "Authorization" header
    if (!token)
      return res.status(400).send({ status: false, msg: "Token is not found" });

    // Check if the token starts with "Bearer " and extract the token string
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }

    let verify = jwt.verify(token, "Assignment");
    if (!verify)
      return res.status(402).send({ status: false, msg: "Token is not valid" });

    req.userId = verify.userid;
    console.log(req.userId);
    next();
  } catch (err) {
    return res.status(402).send({ status: false, msg: err.message });
  }
};

// Authorisation for all Update and delete API which has userId in params

const authorisation = async function (req, res, next) {
  try {
    let userId = req.params.userId;
    let validUser = await fileModel.findOne({userId});
    console.log(validUser, "rohit")
    if (!validUser)
      return res.status(404).send({ status: true, msg: "User not founds" });

    if (userId != req.userId) {
      return res
        .status(401)
        .send({ status: false, msg: "you are not authorise person " });
    }
    next();
  } catch (err) {
    return res.status(402).send({ status: false, msg: err.message });
  }
};

module.exports = {
  authentication,
  authorisation,
};
