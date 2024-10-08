const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const port = 3000;

// Criação do servidor HTTP
const server = http.createServer(app);

// Criação do WebSocket Server
const wss = new WebSocket.Server({ server });

// Função para enviar mensagem via WebSocket para todos os clientes
const broadcastUpdate = (type) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type }));
    }
  });
};

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

app.use(express.json({ limit: "10mb" }));
app.use(cors());

// Função auxiliar para validar formato de data (YYYY-MM-DD)
const isValidDate = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(dateString);
};

// Endpoint para cadastrar funcionários
app.post("/cadastrarFuncionario", (req, res) => {
  try {
    const {
      nome_completo,
      data_nascimento,
      cpf,
      cargo,
      salario,
      data_contratacao,
      email,
      image,
      telefone, // Adiciona o campo telefone
      pix, // Adiciona o campo pix
    } = req.body;

    if (!isValidDate(data_nascimento) || !isValidDate(data_contratacao)) {
      return res
        .status(400)
        .json({ error: "Formato de data inválido. Use o formato YYYY-MM-DD." });
    }

    if (!image) {
      console.error("Erro: Foto não foi recebida.");
      return res.status(400).json({ error: "Erro: Foto não foi recebida." });
    }

    // Decodifica a imagem de base64 para binário
    const imagemBuffer = Buffer.from(image, "base64");

    const sql = `
      INSERT INTO funcionarios (nome_completo, data_nascimento, cpf, cargo, salario, data_contratacao, email, foto, telefone, pix)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        nome_completo,
        data_nascimento,
        cpf,
        cargo,
        parseFloat(salario),
        data_contratacao,
        email,
        imagemBuffer,
        telefone, // Inclui o telefone na query
        pix, // Inclui o pix na query
      ],
      (err, result) => {
        if (err) {
          console.error("Erro ao cadastrar funcionário:", err);
          return res
            .status(500)
            .json({ error: `Erro ao cadastrar funcionário: ${err.message}` });
        }
        res
          .status(201)
          .json({ message: "Funcionário cadastrado com sucesso!" });

        // Notifica todos os clientes via WebSocket sobre a atualização
        broadcastUpdate("UPDATE_FUNCIONARIO");
      }
    );
  } catch (error) {
    console.error("Erro inesperado ao processar a requisição:", error);
    res.status(500).json({ error: `Erro inesperado: ${error.message}` });
  }
});

// Endpoint para salvar o produto no banco de dados
app.post("/addproduct", (req, res) => {
  try {
    const { nome, descricao, valor_venda, quantidade, preco_custo, image } =
      req.body;

    if (!image) {
      console.error("Erro: Imagem não foi recebida.");
      return res.status(400).json({ error: "Erro: Imagem não foi recebida." });
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
            .json({ error: `Erro ao inserir produto: ${err.message}` });
        }
        res.status(201).json({ message: "Produto salvo com sucesso!" });

        // Notifica todos os clientes via WebSocket sobre a atualização de estoque
        broadcastUpdate("UPDATE_STOCK");
      }
    );
  } catch (error) {
    console.error("Erro inesperado ao processar a requisição:", error);
    res.status(500).json({ error: `Erro inesperado: ${error.message}` });
  }
});

// Endpoint para buscar o relatório de vendas agrupado por data e produtos
app.get("/salesReport", (req, res) => {
  const sql = `
    SELECT 
      p.nome AS produto, 
      SUM(v.quantidade) AS quantidade, 
      SUM(v.valor_venda * v.quantidade) AS valor_total, 
      DATE_FORMAT(v.data_hora, '%d/%m/%Y') AS data_formatada
    FROM vendas v
    JOIN produtos p ON v.produto_id = p.id
    GROUP BY data_formatada, p.nome
    ORDER BY data_formatada DESC, p.nome ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar relatório de vendas:", err);
      return res
        .status(500)
        .json({ error: "Erro ao buscar relatório de vendas." });
    }

    // Agrupando os dados por data
    const salesByDate = {};
    results.forEach((row) => {
      const date = row.data_formatada;
      if (!salesByDate[date]) {
        salesByDate[date] = { items: [], total: 0 };
      }
      salesByDate[date].items.push({
        produto: row.produto,
        quantidade: row.quantidade,
        valor_total: row.valor_total,
      });
      salesByDate[date].total += row.valor_total;
    });

    res.status(200).json(salesByDate);
  });
});

// Endpoint para buscar o relatório de estoque
app.get("/inventoryReport", (req, res) => {
  const sql = `SELECT nome, descricao, quantidade FROM produtos ORDER BY nome ASC`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar relatório de estoque:", err);
      return res
        .status(500)
        .json({ error: "Erro ao buscar relatório de estoque." });
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(results);
  });
});

// Endpoint para buscar todos os produtos
app.get("/products", (req, res) => {
  const sql = `SELECT id, nome, descricao, valor_venda, quantidade, preco_custo, imagem FROM produtos`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar produtos:", err);
      return res
        .status(500)
        .json({ error: `Erro ao buscar produtos: ${err.message}` });
    }
    // Converte cada imagem BLOB para base64 para exibição correta no frontend
    const produtos = results.map((produto) => ({
      ...produto,
      imagem: produto.imagem ? produto.imagem.toString("base64") : null,
    }));
    res.setHeader("Content-Type", "application/json");
    res.json(produtos);
  });
});

// Endpoint para buscar todos os funcionários cadastrados
app.get("/getFuncionarios", (req, res) => {
  const sql = `SELECT id, nome_completo, cargo, salario, cpf, foto FROM funcionarios`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar funcionários:", err);
      return res.status(500).json({ error: "Erro ao buscar funcionários." });
    }

    // Converte a imagem de BLOB para base64
    const funcionarios = results.map((funcionario) => ({
      ...funcionario,
      foto: funcionario.foto ? funcionario.foto.toString("base64") : null,
    }));

    res.status(200).json(funcionarios);
  });
});

// Endpoint para atualizar múltiplos produtos
app.post("/updateproducts", (req, res) => {
  const { products } = req.body;

  if (!products || products.length === 0) {
    return res.status(400).json({ error: "Nenhum produto para atualizar." });
  }

  const updatePromises = products.map((product) => {
    const {
      id,
      nome,
      descricao,
      quantidade,
      valor_venda,
      preco_custo,
      imagem,
    } = product;
    const imagemBuffer = imagem ? Buffer.from(imagem, "base64") : null;

    const sql = `UPDATE produtos SET nome = ?, descricao = ?, quantidade = ?, valor_venda = ?, preco_custo = ?, imagem = ? WHERE id = ?`;

    return new Promise((resolve, reject) => {
      db.query(
        sql,
        [
          nome,
          descricao,
          quantidade,
          valor_venda,
          preco_custo,
          imagemBuffer,
          id,
        ],
        (err, result) => {
          if (err) {
            console.error("Erro ao atualizar produto:", err);
            return reject(`Erro ao atualizar produto: ${err.message}`);
          }
          resolve();
        }
      );
    });
  });

  Promise.all(updatePromises)
    .then(() => {
      res.json({ message: "Produtos atualizados com sucesso!" });

      // Notifica todos os clientes via WebSocket
      broadcastUpdate("UPDATE_STOCK");
    })
    .catch((error) =>
      res.status(500).json({ error: `Erro ao atualizar produtos: ${error}` })
    );
});

// Endpoint para deletar um produto
app.delete("/deleteproduct/:id", (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM produtos WHERE id = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Erro ao deletar produto:", err);
      return res.status(500).json({ error: "Erro ao deletar produto." });
    }
    res.status(200).json({ message: "Produto deletado com sucesso!" });

    // Notifica todos os clientes via WebSocket
    broadcastUpdate("UPDATE_STOCK");
  });
});

// Endpoint para finalizar a compra e salvar a venda
app.post("/finalizarVenda", (req, res) => {
  const { items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "Nenhum item para processar." });
  }

  const updatePromises = items.map((item) => {
    return new Promise((resolve, reject) => {
      const sqlUpdate = `UPDATE produtos SET quantidade = quantidade - ? WHERE id = ? AND quantidade >= ?`;
      db.query(
        sqlUpdate,
        [item.quantity, item.id, item.quantity],
        (err, result) => {
          if (err) {
            console.error(
              `Erro ao atualizar o estoque do produto ${item.nome}:`,
              err
            );
            return reject(
              `Erro ao atualizar o estoque do produto ${item.nome}`
            );
          }
          if (result.affectedRows === 0) {
            return reject(`Estoque insuficiente para o produto ${item.nome}`);
          }

          const sqlInsertVenda = `INSERT INTO vendas (produto_id, quantidade, valor_venda, data_hora) VALUES (?, ?, ?, NOW())`;
          db.query(
            sqlInsertVenda,
            [item.id, item.quantity, item.valor_venda],
            (err) => {
              if (err) {
                console.error(
                  `Erro ao registrar venda para o produto ${item.nome}:`,
                  err
                );
                return reject(
                  `Erro ao registrar venda para o produto ${item.nome}`
                );
              }
              resolve();
            }
          );
        }
      );
    });
  });

  Promise.all(updatePromises)
    .then(() => {
      res.status(200).json({
        message: "Venda finalizada e estoque atualizado com sucesso.",
      });

      // Notifica todos os clientes via WebSocket sobre a venda
      broadcastUpdate("UPDATE_SALES");
    })
    .catch((error) => {
      res.status(500).json({
        error: `Erro ao processar a venda: ${error}`,
      });
    });
});

// Inicia o servidor HTTP com suporte a WebSocket
server.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
