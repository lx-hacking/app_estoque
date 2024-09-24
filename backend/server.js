const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
const port = 3000;

// Configuração do banco de dados MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Neto010185!",
  database: "appestoque",
});

// Conecta ao banco de dados MySQL
db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    return;
  }
  console.log("Conectado ao banco de dados MySQL.");
});

app.use(express.json({ limit: "10mb" })); // Aumenta o limite de tamanho da requisição para suportar base64
app.use(cors());

// Endpoint para salvar o produto no banco de dados
app.post("/addproduct", (req, res) => {
  try {
    const { nome, descricao, valor_venda, quantidade, preco_custo, image } =
      req.body;

    if (!image) {
      console.error("Erro: Imagem não foi recebida.");
      return res.status(400).send("Erro: Imagem não foi recebida.");
    }

    // Decodifica a imagem de base64 para binário
    const imagemBuffer = Buffer.from(image, "base64");

    const sql = `INSERT INTO produtos (nome, descricao, valor_venda, quantidade, preco_custo, imagem) VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(
      sql,
      [
        nome,
        descricao,
        parseFloat(valor_venda),
        parseInt(quantidade),
        parseFloat(preco_custo),
        imagemBuffer,
      ],
      (err, result) => {
        if (err) {
          console.error("Erro ao inserir produto no banco de dados:", err);
          return res
            .status(500)
            .send(`Erro ao inserir produto: ${err.message}`);
        }
        res.send("Produto salvo com sucesso!");
      }
    );
  } catch (error) {
    console.error("Erro inesperado ao processar a requisição:", error);
    res.status(500).send(`Erro inesperado: ${error.message}`);
  }
});

// Endpoint para buscar todos os produtos
app.get("/products", (req, res) => {
  const sql = `SELECT id, nome, descricao, valor_venda, quantidade, preco_custo, imagem FROM produtos`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar produtos:", err);
      return res.status(500).send(`Erro ao buscar produtos: ${err.message}`);
    }
    // Converte cada imagem BLOB para base64 para exibição correta no frontend
    const produtos = results.map((produto) => ({
      ...produto,
      imagem: produto.imagem ? produto.imagem.toString("base64") : null,
    }));
    res.json(produtos);
  });
});

// Endpoint para atualizar produtos selecionados
app.post("/updateproducts", (req, res) => {
  const { products } = req.body;

  // Verificação se os produtos foram recebidos
  if (!products || products.length === 0) {
    return res.status(400).send("Nenhum produto selecionado para atualizar.");
  }

  let updateErrors = [];
  let processedCount = 0;

  products.forEach((product) => {
    let sql =
      "UPDATE produtos SET nome = ?, descricao = ?, valor_venda = ?, quantidade = ?, preco_custo = ? WHERE id = ?";
    const values = [
      product.nome,
      product.descricao,
      parseFloat(product.valor_venda),
      parseInt(product.quantidade),
      parseFloat(product.preco_custo),
      product.id,
    ];

    // Se uma nova imagem foi fornecida, atualize também o campo de imagem
    if (product.imagem) {
      sql =
        "UPDATE produtos SET nome = ?, descricao = ?, valor_venda = ?, quantidade = ?, preco_custo = ?, imagem = ? WHERE id = ?";
      values.splice(5, 0, Buffer.from(product.imagem, "base64"));
    }

    db.query(sql, values, (err, result) => {
      processedCount++;
      if (err) {
        console.error(`Erro ao atualizar produto ID ${product.id}:`, err);
        updateErrors.push(`Erro no produto ID ${product.id}: ${err.message}`);
      }

      // Verifica se todos os produtos foram processados
      if (processedCount === products.length) {
        if (updateErrors.length > 0) {
          return res
            .status(500)
            .send(`Erros ao atualizar produtos: ${updateErrors.join(", ")}`);
        }
        res.status(200).send("Produtos atualizados com sucesso");
      }
    });
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
