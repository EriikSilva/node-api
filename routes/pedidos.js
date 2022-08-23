const express = require("express");
const { route } = require("../app");
const router = express.Router();

// const mysql = require("../mysql").pool;


const PedidosController = require('../controllers/pedidos-controller')

/*************ROTA '/PEDIDOS'****************/

//TODOS OS PEDIDOS
router.get("/", PedidosController.getPedidos);

//pedido POR ID
router.get("/:id_pedido", PedidosController.getUmPedido);

//CRIA UM pedido
router.post("/", PedidosController.postPedidos);

//DELETAR UM PEDIDO
router.delete("/:id_pedido", PedidosController.deletePedido);


//ALTERA UM PEDIDO
// router.patch("/", (req, res) => {
//   res.status(201).send({
//     message: "ROTA PATCH",
//   });
// });

module.exports = router;
