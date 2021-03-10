const express = require("express");

const authController = require("./app/controllers/authController");
const projectController = require("./app/controllers/projectController");
const authMiddleware = require('./app/middlewares/auth');

const router = express.Router();

router.get("/", (req,res) => res.status(200).json({api: "online"}));

router.post("/auth/register", authController.register);

router.post("/auth/authenticate", authController.authenticate);

router.get("/projects", authMiddleware, projectController.test); 

router.post("/forgot-password", authController.forgotPassword);

router.post("/reset-password", authController.resetPassword);

module.exports = router;