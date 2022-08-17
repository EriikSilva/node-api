const express = require("express");
const { route } = require("../app");
const router = express.Router();
const mysql = require("../mysql").pool;

/*************ROTA '/produtos'****************/

//TODOS OS PRODUTOS
router.get("/", (req, res, next) => {
  mysql.getConnection((err, conn) => {
    //CASO ALGUM ERRO ACONTEÇA
    if (err) {
      return res.status(500).send({
        message: err,
      });
    }

    conn.query(
      "SELECT * FROM produtos",
      //CALLBACK
      (err, result, field) => {
        if (err) {
          res.status(500).send({
            error: err,
            response: null,
          });
        }

        return res.status(200).send({
          response: result,
        });
      }
    );
  });

  // res.status(200).send({
  //     message: 'ROTA DE PRODUTOS'
  // });
});

//PRODUTO POR ID
router.get("/:id_produto", (req, res) => {
  //const id = req.params.id_produto;

  mysql.getConnection((err, conn) => {
    //CASO ALGUM ERRO ACONTEÇA
    if (err) {
      return res.status(500).send({
        message: err,
      });
    }

    conn.query(
      "SELECT * FROM produtos WHERE id_produto = ?",
      [req.params.id_produto],
      //CALLBACK
      (err, result, field) => {
        //conn.release();
        if (err) {
          res.status(500).send({
            error: err,
            response: null,
          });
        }

        return res.status(200).send({
          response: result,
        });
      }
    );
  });

  // res.status(200).send({
  //     message: 'ROTA DE PRODUTO id',
  //     id: id
  // });
});

//CRIA UM PRODUTO
router.post("/", (req, res, next) => {
  mysql.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({
        message: err,
      });
    }

    conn.query(
      "INSERT INTO produtos (nome, preco) VALUES (?, ?)",
      [req.body.nome, req.body.preco],

      (err, result, field) => {
        //LIBERA A CONEXÃO
        conn.release();

        if (err) {
          res.status(500).send({
            error: err,
            response: null,
          });
        }
        res.status(201).send({
          message: "Produto Inserido",
          id_produto: result.insertId,
        });
      }
    );
  });
});

//ALTERA UM PRODUTO
router.patch("/", (req, res) => {
    
    mysql.getConnection((err, conn) => {
        if (err) {
          return res.status(500).send({
            message: err,
          });
        }
    
        conn.query(
          `UPDATE produtos 
                SET nome = ?,
                    preco = ?
            WHERE id_produto = ?`,
          [
            req.body.nome,
            req.body.preco,
            req.body.id_produto
          ],
    
          (err, result, field) => {
            //LIBERA A CONEXÃO
            conn.release();
    
            if (err) {
              res.status(500).send({
                error: err,
                response: null,
              });
            }
            res.status(202).send({
              message: "Produto Atualizado",
            //   id_produto: result.insertId,
            });
          }
        );
      });


});

//DELETAR UM PRODUTO
router.delete("/:id_produto", (req, res) => {
    
    mysql.getConnection((err, conn) => {
        if (err) {
          return res.status(500).send({
            message: err,
          });
        }
    
        conn.query(
          `DELETE FROM produtos 
            WHERE id_produto = ?`,
          [req.body.id_produto],
    
          (err, result, field) => {
            //LIBERA A CONEXÃO
            conn.release();
    
            if (err) {
              res.status(500).send({
                error: err,
                response: null,
              });
            }
            res.status(202).send({
              message: "Produto Excluido",
            });
          }
        );
      });


});

module.exports = router;
