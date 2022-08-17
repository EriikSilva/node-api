const express = require('express');
const { route } = require('../app');
const router = express.Router();


/*************ROTA '/PEDIDOS'****************/

//TODOS OS PEDIDOS
router.get(('/'), (req, res, next) =>{
    res.status(200).send({
        message: 'ROTA DE PEDIDOS'
    });
});

//pedido POR ID
router.get(('/:id_pedido'), (req, res) => {

    const id = req.params.id_pedido;

    res.status(200).send({
        message: 'ROTA DE PEDIDO id',
        id: id
    });
});

//CRIA UM pedido
router.post(('/'), (req, res, next) => {
    
    
    const pedido1 = {
        id_produto: req.body.id_produto,
        quantidade: req.body.quantidade
     };

    res.status(201).send({
        message: 'ROTA DE POST',
        produtoCriado: pedido1
    });
});


//ALTERA UM PEDIDO
router.patch(('/'),(req, res)=> {
    res.status(201).send({
        message: "ROTA PATCH"
    });
});

//DELETAR UM PEDIDO
router.delete(('/:id_pedido'), (req, res)=> {

    const id = req.params.id_pedido;

    res.status(201).send({
        message: 'ROTA DELETE PEDIDO',
        id: id
    });
});

module.exports = router;