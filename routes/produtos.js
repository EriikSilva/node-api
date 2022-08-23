const express = require("express");
const { route } = require("../app");
const router = express.Router();
// const mysql = require("../mysql").pool;

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



const ProdutoController = require("../controllers/produtos-controller")

/*************ROTA '/produtos'****************/

//TODOS OS PRODUTOS
router.get("/", ProdutoController.getProdutos);

//PRODUTO POR ID
router.get("/:id_produto", ProdutoController.getUmProduto);

//CRIA UM PRODUTO
router.post("/", login.obrigatorio , upload.single('produto_imagem'), ProdutoController.postProduto);

//ALTERA UM PRODUTO
router.patch("/", login.obrigatorio, ProdutoController.patchProduto);

//DELETAR UM PRODUTO
router.delete("/:id_produto", login.obrigatorio, ProdutoController.deleteProduto);

module.exports = router;
