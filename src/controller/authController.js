const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const validation = function (data) {
  if (data == undefined || data == null) {
    return false;
  }
  if (typeof data == "string" && data.trim() == 0) {
    return false;
  }
  return true;
};

const validBody = function (data) {
  if (Object.keys(data).length === 0) return false;
  return true;
};

const createUser = async function (req, res) {
  try {
    let data = req.body;
    let { fname, lname, phone, email, password, username } = data;

    if (!validBody(data)) return res.status(400).send({ msg: "Body is empty" });

    if (!validation(fname))
      return res.status(400).send({ msg: "Full name is required" });
    if (!/^[a-z ,.'-]+$/i.test(fname))
      return res
        .status(400)
        .send({ msg: "First name should be alphabetic characters" });
    if (!validation(lname))
      return res.status(400).send({ msg: "Last name is required" });
    if (!/^[a-z ,.'-]+$/i.test(lname))
      return res
        .status(400)
        .send({ msg: "Last name should be alphabetic characters" });

    if (!validation(username))
      return res.status(400).send({ msg: "Username is required" });

    if (!validation(email))
      return res.status(400).send({ msg: "Email ID is required" });
    let fullemail = await userModel.findOne({ email: email });
    if (fullemail)
      return res.status(400).send({ msg: "Email should be unique" });
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res.status(400).send({ msg: "Invalid email format" });
    }
    if (!password) return res.status(400).send({ msg: "Password is required" });

    // Hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    let document = {
      fname: fname.trim(),
      lname: lname.trim(),
      phone: phone,
      email: email.toLowerCase(),
      password: hashedPassword,
      username: username,
    };
    let savedData = await userModel.create(document);
    res.status(201).send({ msg: savedData });
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

const login = async function (req, res) {
  try {
    let username = req.body.username;
    let password = req.body.password;
    if (!validBody(req.body))
      return res.status(400).send({ msg: "Body is empty" });
    if (!validation(username))
      return res.status(400).send({ msg: "Username not provided" });
    if (!validation(password))
      return res.status(400).send({ msg: "Password not provided" });
    let userData = await userModel.findOne({
      username: username,
    });
    if (!userData) {
      return res
        .status(404)
        .send({ status: false, msg: "Incorrect credentials" });
    }
    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      return res
        .status(404)
        .send({ status: false, msg: "Incorrect credentials" });
    }

    let token = jwt.sign(
      {
        userid: userData._id.toString(),
        project: "Assignment",
      },
      "Assignment"
    );
    res.setHeader("x-api-key", token);
    return res.status(201).send({ status: true, msg: token });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

const logout = async function (req, res) {
  try {
    localStorage.removeItem("token"); // Assuming the token is stored in localStorage
    res.status(200).send({ status: true, msg: "Logged out successfully" });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports = { createUser, login, logout };
