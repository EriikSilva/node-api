const mysql = require("../mysql").pool;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.cadastrarUsuario = (req, res, next) => {
  mysql.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ error: err });
    }

    conn.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [req.body.email],
      (err, result) => {
        if (err) {
          return res.status(500).send({ error: err });
        }

        if (result.length > 0) {
          res.status(401).send({
            message: "Email ja cadastrado",
          });
        } else {
          //req.body     //quantidade para crypt
          bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
            if (errBcrypt) {
              return res.status(500).send({ error: errBcrypt });
            }

            conn.query(
              `INSERT INTO usuarios (email, senha) VALUES (?, ?)`,
              [req.body.email, hash],
              (err, result) => {
                conn.release();

                if (err) {
                  return res.status(500).send({ error: err });
                }

                const response = {
                  message: "Usuario criado com sucesso",
                  usuarioCriado: {
                    id_usuario: result.insertId,
                    email: req.body.email,
                  },
                };

                return res.status(201).send(response);
              }
            );
          });
        }
      }
    );
  });
};

exports.login = (req, res, next) => {
  mysql.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ error: err });
    }

    const query = `SELECT * FROM usuarios WHERE email = ?`;

    conn.query(query, [req.body.email], (err, results, fields) => {
      conn.release();

      if (err) {
        return res.status(500).send({ error: err });
      }

      if (results.length < 1) {
        return res.status(401).send({
          message: "Falha na autenticação",
        });
      }

      bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {
        if (err) {
          return res.status(401).send({
            message: "Falha na autenticação",
          });
        }

        if (result) {
          const token = jwt.sign(
            {
              id_usuario: results[0].id_usuario,
              email: results[0].email,
              // resultado: results
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );

          return res.status(200).send({
            message: "Autenticado com sucesso",
            token: token,
          });
        }

        return res.status(401).send({
          message: "Falha na autenticação",
        });
      });
    });
  });
};
