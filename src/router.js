const express = require("express");

const authController = require("./controllers/authController");

const router = express.Router();

router.get("/", (req,res) => res.status(200).json({api: "online"}));

router.post("/register", authController.register);

module.exports = router;