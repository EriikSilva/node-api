const express = require("express");
const { route } = require("../app");
const router = express.Router();
const mysql = require("../mysql").pool;

const login = require('../middleware/login')

//multer para upload de imagem
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb){
      //ERRO  //DIRETORIO
    cb(null, './uploads/');
  }, 
  filename: function(req, file, cb){
      //ERRO  //PROPRIEDADES e regra para n repetir imagem
      let data = new Date().toISOString().replace(/:/g, '-') + '-';
     cb(null, data + file.originalname);
  }
});


const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/pdf'){
    cb(null, true);
  }else{
    console.log('somente png, jpeg e pdf são aceitos')
    cb(null, false);
  }
}

const upload = multer({
  storage: storage,
  limits:{
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});
                      //dest: 'uploads/'

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

        const response = {
          quantidade: result.length,
          produtos: result.map((res) => {
            return {
              id_produto: res.id_produto,
              nome: res.nome,
              preco: res.preco,
              imagem_produto: res.imagem_produto,
              request: {
                tipo: "GET",
                descricao: "Retorna todos os produtos",
                url: "https://localhost:3000/produtos/" + res.id_produto,
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

        if (result.length == 0) {
          return res.status(404).send({
            message: "Produto não existe ou não encontrado",
          });
        }

        const response = {
          produto: {
            id_produto: result[0].id_produto,
            nome: result[0].nome,
            preco: result[0].preco,
            imagem_produto: result[0].imagem_produto,
            request: {
              tipo: "GET",
              descricao: "Retorna um produto por ID",
              url: "https://localhost:3000/produtos/",
            },
          },
        };

        return res.status(200).send(response);
      }
    );
  });
});

//CRIA UM PRODUTO
router.post("/", login.obrigatorio , upload.single('produto_imagem'),  (req, res, next) => {

  console.log('@@Oq veio no arquivo inserido =>>>> ', req.file);

  console.log('@@Oq veio no req.usuario =>>>> ', req.usuario)

  mysql.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({
        message: err,
      });
    }

    conn.query(
      "INSERT INTO produtos (nome, preco, imagem_produto) VALUES (?, ?, ?)",
      [
        req.body.nome,
        req.body.preco,
        req.file.path
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

        const response = {
          message: "Produto Inserido",
          produto: {
            id_produto: result.id_produto,
            nome: req.body.nome,
            preco: req.body.preco,
            imagem_produto: req.file.path,
            request: {
              tipo: "POST",
              descricao: "Insere um produto",
              url: "https://localhost:3000/produtos/",
            },
          },
        };
        return res.status(201).send(response);
      }
    );
  });
});

//ALTERA UM PRODUTO
router.patch("/", login.obrigatorio, (req, res) => {
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
      [req.body.nome, req.body.preco, req.body.id_produto],

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
          message: "Produto Atualizado",
          produtoAtualizado: {
            id_produto: req.body.id_produto,
            nome: req.body.nome,
            preco: req.body.preco,
            request: {
              tipo: "POST",
              descricao: "Atualiza um produto",
              url: "https://localhost:3000/produtos/" + req.body.id_produto,
            },
          },
        };

        return res.status(202).send(response);
      }
    );
  });
});

//DELETAR UM PRODUTO
router.delete("/:id_produto", login.obrigatorio, (req, res) => {
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

        const response = {
          message: "Produto Excluido",
          request: {
            tipo: "DELETE",
            descricao: "deleta um produto",
            url: "https://localhost:3000/produtos/",
            body: {
              nome: "string",
              preco: "number",
            },
          },
        };
        return res.status(202).send(response);
      }
    );
  });
});

module.exports = router;
