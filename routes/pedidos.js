const express = require("express");
const { route } = require("../app");
const router = express.Router();

const mysql = require("../mysql").pool;

/*************ROTA '/PEDIDOS'****************/

//TODOS OS PEDIDOS
router.get("/", (req, res, next) => {
 
  mysql.getConnection((err, conn) => {
    //CASO ALGUM ERRO ACONTEÇA
    if (err) {
      return res.status(500).send({
        message: err,
      });
    }
    conn.query(
        `SELECT 
            pedidos.id_pedido,
            pedidos.quantidade,
            produtos.nome,
            produtos.preco
        FROM pedidos
            INNER JOIN 
        produtos ON 
        produtos.id_produto = pedidos.id_produto`,
      //CALLBACK
      (err, result, field) => {
        if (err) {
          res.status(500).send({ error: err, response: null });
        }

        const response = {
          // quantidade: result.length,
          pedidos: result.map((pedido) => {
            return {
              id_pedido: pedido.id_pedido,
              produto:{
                id_produto: pedido.id_produto,
                nome:pedido.nome,
                preco: pedido.preco
              },
              quantidade: pedido.quantidade,
              request: {
                tipo: "GET",
                descricao: "Retorna todos os pedidos",
                url: "https://localhost:3000/pedidos/" + pedido.id_pedido,
              },
            };
          }),
        };

        return res.status(200).send({
          response: response,
        });
      }
    );
  });
});

//pedido POR ID
router.get("/:id_pedido", (req, res) => {
  mysql.getConnection((err, conn) => {
    //CASO ALGUM ERRO ACONTEÇA
    if (err) {
      return res.status(500).send({
        message: err,
      });
    }

    conn.query(
      "SELECT * FROM pedidos WHERE id_pedido = ?",
      [req.params.id_pedido],
      //CALLBACK
      (err, result, field) => {
        //conn.release();
        if (err) {
          res.status(500).send({
            error: err,
            response: null,
          });
        }

        if (result.length == 0) {
          return res.status(404).send({
            message: "Pedido não existe ou não encontrado",
          });
        }

        const response = {
          pedido: {
            id_pedido: result[0].id_pedido,
            id_produto: result[0].id_produto,
            quantidade: result[0].quantidade,
            request: {
              tipo: "GET",
              descricao: "Retorna um pedido por ID",
              url: "https://localhost:3000/pedidos/",
            },
          },
        };

        return res.status(200).send(response);
      }
    );
  });
});

//CRIA UM pedido
router.post("/", (req, res, next) => {


    mysql.getConnection((err, conn) => {
        if (err) {
          return res.status(500).send({ message: err });
        }
        conn.query(
          "SELECT * FROM produtos WHERE id_produto = ?",
          [req.body.id_produto],
          (err, result, field) => {
              //LIBERA A CONEXÃO
            conn.release();
            if (err) {
              res.status(500).send({ error: err, response: null });
            }
    
            if (result.length == 0) {
              return res.status(404).send({
                message: "id do produto nao encontrado ou não existe",
              });
            }

            conn.query(
                "INSERT INTO pedidos (id_produto, quantidade) VALUES (? , ?)",
                [req.body.id_produto, req.body.quantidade],
          
                (err, result, field) => {   
          
                  if (err) {
                    res.status(500).send({
                      error: err,
                      response: null,
                    });
                  }
          
                  const response = {
                    message: "Pedido Inserido",
                    pedidoCriado: {
                      id_pedido: result.id_pedido,
                      id_produto: req.body.id_produto,
                      quantidade: req.body.quantidade,
                    },
                    request: {
                      tipo: "POST",
                      descricao: "Cria um Pedido",
                      url: "https://localhost:3000/pedidos/",
                    },
                  };
                  return res.status(201).send(response);
                }
              );

          }
        );
      });
    



});

//ALTERA UM PEDIDO
router.patch("/", (req, res) => {
  res.status(201).send({
    message: "ROTA PATCH",
  });
});

//DELETAR UM PEDIDO
router.delete("/:id_pedido", (req, res) => {
  mysql.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({
        message: err,
      });
    }

    conn.query(
      `DELETE FROM pedidos WHERE id_pedido = ?`,
      [req.body.id_pedido],

      (err, result, field) => {
        //LIBERA A CONEXÃO
        conn.release();

        if (err) {
          res.status(500).send({
            error: err,
            response: null,
          });
        }

        const response = {
          message: "Produto Excluido",
          request: {
            tipo: "DELETE",
            descricao: "deleta um pedido",
            url: "https://localhost:3000/pedidos/",
            body: {
              id_produto: "Number",
              quantidade: "number",
            },
          },
        };
        return res.status(202).send(response);
      }
    );
  });
});

module.exports = router;
