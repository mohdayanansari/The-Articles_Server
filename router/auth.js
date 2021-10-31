const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate");

require("../db/conn");
const User = require("../models/userSchema");

router.get("/", (req, res) => {
  res.send("Hello there router");
});

// router.post("/register",  (req, res) => {
//   const { name, email, phone, work, password, cpassword } = req.body.message;

//   if (!name || !email || !phone || !work || !password || !cpassword) {
//     return res.status(422).json({ error: "Please fill the required details" });
//   }

// Checking user entering existing
//   User.findOne({ email: email })
//     .then((userExist) => {
//       if (userExist) {
//         return res.status(422).json({ error: "Email already exist! 💁" });
//       }

//       const user = new User({ name, email, phone, work, password, cpassword });

//       user
//         .save()
//         .then(() => {
//           res.status(201).json({ message: "User registered successfully! 😀" });
//         })
//         .catch((e) => {
//           res.status(500).json({ error: "Failed to register" });
//         });
//     })
//     .catch((e) => console.log(e));
// });

router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;

  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "Please fill the required details" });
  }

  try {
    const userExist = await User.findOne({ email: email });

    // Checking user entering existing
    if (userExist) {
      return res.status(422).json({ error: "Email already exist! 💁" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "Password aren't matching! 💁" });
    }
    const userPhoneExist = await User.findOne({ phone: phone });
    if (userPhoneExist) {
      return res.status(422).json({ error: "Phone number already exist! 💁" });
    }

    const user = new User({
      name,
      email,
      phone,
      work,
      password,
      cpassword,
    });

    //todo::: hasing PASSWORD

    await user.save();
    res.status(201).json({ message: "User registered successfully! 😀" });
  } catch (e) {
    console.log(e);
  }
});

// ! ===============================LOGIN==============================

router.post("/signin", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please fill the required details! 💁" });
    }

    const userLogin = await User.findOne({ email: email });
    // console.log(userLogin);
    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      token = await userLogin.generateAuthToken();
      console.log(token);

      // handeling Session time of user
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 3236500000),
        httpOnly: true,
      });

      if (!isMatch) {
        res.status(400).json({ error: "Invalid Credentials! p" });
      } else {
        res.status(201).json({ message: "User Sigin Successful!" });
      }
    } else {
      res.status(400).json({ error: "Invalid Credentials!!" });
    }
  } catch (error) {
    console.log(error);
  }
});

// about us page
router.get("/about", authenticate, (req, res) => {
  console.log("About Page");
  res.send(req.rootUser);
});

// ------------for contact and home page user data
router.get("/getdata", authenticate, (req, res) => {
  res.send(req.rootUser);
});

router.post("/contact", authenticate, async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      console.log("Contact form error");
      return res.json({ error: "Please fill the contact form" });
    }

    const userContact = await User.findOne({ _id: req.userID });

    if (userContact) {
      const userMessage = await userContact.addMessage(
        name,
        email,
        phone,
        message
      );

      await userContact.save();

      res.status(201).json({ message: "message send successfully!!" });
    }
  } catch (error) {
    console.log(error);
  }
});

// ! LOGOUT PAGE
router.get("/logout", (req, res) => {
  console.log("Logout Page💁");
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("user logout");
});
module.exports = router;
