const express = require("express");

const authController = require("./app/controllers/authController");
const projectController = require("./app/controllers/projectController");
const authMiddleware = require('./app/middlewares/auth');

const router = express.Router();

router.get("/", (req,res) => res.status(200).json({api: "online"}));

router.post("/auth/register", authController.register);

router.post("/auth/authenticate", authController.authenticate);

router.post("/forgot-password", authController.forgotPassword);

router.post("/reset-password", authController.resetPassword);

router.get("/projects", authMiddleware, projectController.list); 

router.get("/projects/:userId", authMiddleware, projectController.shownOne); 

router.post("/projects", authMiddleware, projectController.criaProject)

router.put("/projects/:projectId", authMiddleware, projectController.atualizar);

router.delete("/projects/:projectId", authMiddleware, projectController.deleta);

module.exports = router;