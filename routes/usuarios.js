const express = require("express");
const { route, response } = require("../app");
const router = express.Router();
const usuariosController = require('../controllers/usuarios-controller')

router.post("/cadastro", usuariosController.cadastrarUsuario);

router.post('/login', usuariosController.login);


module.exports = router;
