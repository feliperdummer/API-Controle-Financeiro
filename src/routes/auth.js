const express = require("express");
const authController = require('../controllers/auth')
const authMiddleware = require('../middleware/auth')

const router = express.Router();

router.post("/cadastrar", authController.cadastrarUsuario);
router.post("/login", authController.login);
router.get("/me", authMiddleware.validarToken, authController.getMe);

module.exports = router;