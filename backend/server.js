const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

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

// Função auxiliar para formatar datas para dd/mm/yyyy
const formatarData = (data) => {
  if (!data) return "";
  const dataObj = new Date(data);
  if (isNaN(dataObj.getTime())) {
    return "";
  }
  const day = String(dataObj.getUTCDate()).padStart(2, "0");
  const month = String(dataObj.getUTCMonth() + 1).padStart(2, "0");
  const year = dataObj.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

// Endpoint para adicionar um novo produto
app.post("/addproduct", (req, res) => {
  const { nome, descricao, valor_venda, quantidade, preco_custo, image } =
    req.body;

  if (
    !nome ||
    !descricao ||
    !valor_venda ||
    !quantidade ||
    !preco_custo ||
    !image
  ) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const imagemBuffer = Buffer.from(image, "base64");

  const sql = `INSERT INTO produtos (nome, descricao, valor_venda, quantidade, preco_custo, imagem) 
               VALUES (?, ?, ?, ?, ?, ?)`;

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
        console.error("Erro ao adicionar produto:", err);
        return res.status(500).json({ error: "Erro ao adicionar produto." });
      }
      res.status(201).json({ message: "Produto adicionado com sucesso!" });

      // Notifica todos os clientes via WebSocket sobre a atualização
      broadcastUpdate("UPDATE_STOCK");
    }
  );
});

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
      telefone,
      pix,
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
        telefone,
        pix,
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

// [Resto do código permanece inalterado]

// Endpoint para editar funcionários (com ID na URL)
app.put("/editarFuncionario/:id", (req, res) => {
  try {
    const { id } = req.params;
    const {
      nome_completo,
      data_nascimento,
      cpf,
      cargo,
      salario,
      data_contratacao,
      email,
      telefone,
      pix,
      image,
    } = req.body;

    if (!isValidDate(data_nascimento) || !isValidDate(data_contratacao)) {
      return res
        .status(400)
        .json({ error: "Formato de data inválido. Use o formato YYYY-MM-DD." });
    }

    const imagemBuffer = image ? Buffer.from(image, "base64") : null;

    const sql = `
      UPDATE funcionarios 
      SET nome_completo = ?, data_nascimento = ?, cpf = ?, cargo = ?, salario = ?, 
          data_contratacao = ?, email = ?, telefone = ?, pix = ?, foto = ?
      WHERE id = ?
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
        telefone,
        pix,
        imagemBuffer,
        id,
      ],
      (err, result) => {
        if (err) {
          console.error("Erro ao editar funcionário:", err);
          return res
            .status(500)
            .json({ error: `Erro ao editar funcionário: ${err.message}` });
        }
        res
          .status(200)
          .json({ message: "Funcionário atualizado com sucesso!" });

        // Notifica todos os clientes via WebSocket
        broadcastUpdate("UPDATE_FUNCIONARIO");
      }
    );
  } catch (error) {
    console.error("Erro inesperado ao processar a requisição:", error);
    res.status(500).json({ error: `Erro inesperado: ${error.message}` });
  }
});

// Endpoint para deletar um funcionário
app.delete("/deleteFuncionario/:id", (req, res) => {
  const { id } = req.params;

  const updateNameSql = `
    UPDATE vendas_historico vh
    JOIN funcionarios f ON vh.funcionario_id = f.id
    SET vh.funcionario_nome = CONCAT(f.nome_completo, ' (Desligado)')
    WHERE f.id = ?;
  `;

  db.query(updateNameSql, [id], (err) => {
    if (err) {
      console.error("Erro ao atualizar nome do funcionário nas vendas:", err);
      return res
        .status(500)
        .json({ error: "Erro ao atualizar nome nas vendas associadas." });
    }

    db.query("DELETE FROM funcionarios WHERE id = ?", [id], (err) => {
      if (err) {
        console.error("Erro ao deletar funcionário:", err);
        return res.status(500).json({ error: "Erro ao deletar funcionário." });
      }
      res.status(200).json({
        message: "Funcionário excluído e vendas atualizadas com sucesso!",
      });

      // Notifica todos os clientes via WebSocket sobre a atualização
      broadcastUpdate("UPDATE_FUNCIONARIO");
    });
  });
});

// Endpoint para buscar o relatório de vendas agrupado por data e produtos
app.get("/salesReport", (req, res) => {
  const sql = `
    SELECT 
      vh.produto_nome AS produto,
      vh.produto_descricao AS descricao,
      vh.quantidade,
      vh.valor_venda * vh.quantidade AS valor_total,
      DATE_FORMAT(vh.data_hora, '%d/%m/%Y') AS data_formatada,
      CASE 
        WHEN vh.funcionario_id IS NULL THEN vh.funcionario_nome
        ELSE f.nome_completo
      END AS funcionario_nome
    FROM vendas_historico vh
    LEFT JOIN funcionarios f ON vh.funcionario_id = f.id
    ORDER BY data_formatada DESC, produto_nome ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar relatório de vendas:", err);
      return res
        .status(500)
        .json({ error: "Erro ao buscar relatório de vendas." });
    }

    const salesByDate = {};
    results.forEach((row) => {
      const date = row.data_formatada;
      if (!salesByDate[date]) {
        salesByDate[date] = { items: [], total: 0 };
      }
      salesByDate[date].items.push({
        produto: row.produto,
        descricao: row.descricao,
        quantidade: row.quantidade,
        valor_total: row.valor_total,
        funcionario_nome: row.funcionario_nome,
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
  const sql = `SELECT id, nome_completo, cargo, salario, cpf, foto, 
                     DATE_FORMAT(data_nascimento, '%Y-%m-%d') as data_nascimento,
                     DATE_FORMAT(data_contratacao, '%Y-%m-%d') as data_contratacao, 
                     email, telefone, pix 
              FROM funcionarios`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar funcionários:", err);
      return res.status(500).json({ error: "Erro ao buscar funcionários." });
    }

    // Formatação das datas e garantia de que o campo não será undefined
    const funcionarios = results.map((funcionario) => ({
      ...funcionario,
      foto: funcionario.foto ? funcionario.foto.toString("base64") : null,
      data_nascimento: formatarData(funcionario.data_nascimento), // Formata a data
      data_contratacao: formatarData(funcionario.data_contratacao), // Formata a data
      telefone: funcionario.telefone || "", // Garante que telefone seja retornado
      pix: funcionario.pix || "", // Garante que o PIX seja retornado
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

  // Exclusão do produto independentemente das vendas
  const deleteProductSql = `DELETE FROM produtos WHERE id = ?`;
  db.query(deleteProductSql, [id], (err) => {
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
  const { items, funcionarioId } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "Nenhum item para processar." });
  }

  if (!funcionarioId) {
    return res.status(400).json({ error: "Funcionário não informado." });
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

          // Inserir na tabela vendas_produtos
          const sqlInsertVenda = `
  INSERT INTO vendas_historico (produto_nome, produto_descricao, quantidade, valor_venda, data_hora, funcionario_id)
  VALUES (?, ?, ?, ?, NOW(), ?)
`;
          db.query(
            sqlInsertVenda,
            [
              item.nome,
              item.descricao,
              item.quantity,
              item.valor_venda,
              funcionarioId,
            ],
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

// Endpoint de login
app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
  }

  // Verifique se o email existe no banco de dados
  const sql = `SELECT * FROM funcionarios WHERE email = ?`;
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("Erro ao buscar funcionário:", err);
      return res.status(500).json({ error: "Erro ao buscar funcionário." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Usuário inexistente" });
    }

    const funcionario = results[0];

    // Verifique se a senha está correta
    bcrypt.compare(senha, funcionario.senha, (err, isMatch) => {
      if (err) {
        console.error("Erro ao comparar senhas:", err);
        return res
          .status(500)
          .json({ error: "Erro ao processar a autenticação." });
      }

      if (!isMatch) {
        return res.status(401).json({ error: "Senha inválida" });
      }

      res.status(200).json({
        message: "Login realizado com sucesso!",
        funcionario: {
          id: funcionario.id,
          nome_completo: funcionario.nome_completo,
          cargo: funcionario.cargo,
        },
      });
    });
  });
});

// Endpoint para verificar e-mail e se a senha está registrada
app.post("/check-email", (req, res) => {
  const { email } = req.body;

  const sql =
    "SELECT senha_registrada, senha_cadastrada FROM funcionarios WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao verificar e-mail." });
    }

    if (results.length === 0) {
      return res.status(200).json({ exists: false }); // E-mail não existe
    }

    const { senha_registrada, senha_cadastrada } = results[0];
    res.status(200).json({ exists: true, senha_registrada, senha_cadastrada });
  });
});

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "samineto@gmail.com", // Seu e-mail
    pass: "dncr oxdo dhoy kbaw", // Sua senha
  },
});

// Endpoint para enviar código de verificação por e-mail
app.post("/enviar-codigo", async (req, res) => {
  const { email, codigo } = req.body;

  const mailOptions = {
    from: "samineto@gmail.com",
    to: email,
    subject: "Código de Verificação",
    text: `Seu código de verificação é: ${codigo}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("E-mail enviado com sucesso."); // Log de sucesso
    res.status(200).send("Código enviado com sucesso.");
  } catch (error) {
    console.error("Erro ao enviar o e-mail:", error); // Log do erro
    res.status(500).send("Erro ao enviar o código.");
  }
});

// Endpoint para salvar o código de verificação na tabela
app.post("/salvar-codigo", (req, res) => {
  const { email, codigo } = req.body;
  const dataEnvio = new Date();

  const sqlCheck = `SELECT * FROM codigos_verificacao WHERE email = ?`;

  db.query(sqlCheck, [email], (err, results) => {
    if (err) {
      console.error("Erro ao verificar código de verificação:", err);
      return res.status(500).json({ error: "Erro ao verificar código." });
    }

    if (results.length > 0) {
      // Se o e-mail já existe, atualize o código
      const sqlUpdate = `UPDATE codigos_verificacao SET codigo = ?, data_envio = ? WHERE email = ?`;
      db.query(sqlUpdate, [codigo, dataEnvio, email], (err) => {
        if (err) {
          console.error("Erro ao atualizar código de verificação:", err);
          return res.status(500).json({ error: "Erro ao atualizar código." });
        }
        return res.status(200).send("Código atualizado com sucesso.");
      });
    } else {
      // Se não existe, insira um novo registro
      const sqlInsert = `INSERT INTO codigos_verificacao (email, codigo, data_envio) VALUES (?, ?, ?)`;
      db.query(sqlInsert, [email, codigo, dataEnvio], (err) => {
        if (err) {
          console.error("Erro ao salvar código de verificação:", err);
          return res.status(500).json({ error: "Erro ao salvar código." });
        }
        return res.status(201).send("Código salvo com sucesso.");
      });
    }
  });
});

app.post("/validar-codigo", (req, res) => {
  const { email, codigo } = req.body;

  const sql =
    "SELECT * FROM codigos_verificacao WHERE email = ? AND codigo = ?";
  db.query(sql, [email, codigo], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, error: "Erro ao validar código." });
    }

    if (results.length > 0) {
      return res.status(200).json({ success: true });
    } else {
      return res
        .status(400)
        .json({ success: false, error: "Código inválido." });
    }
  });
});

// Endpoint para salvar a senha e atualizar senha_cadastrada
app.post("/salvar-senha", (req, res) => {
  const { email, senha } = req.body;

  // Atualiza a tabela funcionarios com a nova senha e altera senha_cadastrada para true
  const sql = `UPDATE funcionarios SET senha = ?, senha_cadastrada = 1 WHERE email = ?`;

  db.query(sql, [senha, email], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar a senha:", err);
      return res
        .status(500)
        .json({ success: false, error: "Erro ao atualizar a senha." });
    }

    if (result.affectedRows > 0) {
      return res.status(200).json({ success: true });
    } else {
      return res
        .status(400)
        .json({ success: false, error: "E-mail não encontrado." });
    }
  });
});
// Endpoint para buscar um funcionário específico pelo ID
app.get("/getFuncionario/:id", (req, res) => {
  const { id } = req.params;

  const sql = `SELECT id, nome_completo, cargo, foto FROM funcionarios WHERE id = ?`;
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Erro ao buscar funcionário:", err);
      return res.status(500).json({ error: "Erro ao buscar funcionário." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Funcionário não encontrado." });
    }

    const funcionario = results[0];
    res.status(200).json({
      id: funcionario.id,
      nome_completo: funcionario.nome_completo,
      cargo: funcionario.cargo,
      foto: funcionario.foto ? funcionario.foto.toString("base64") : null,
    });
  });
});

// Endpoint para buscar as vendas do mês atual por funcionário
app.get("/salesByFuncionario/:funcionarioId", (req, res) => {
  const { funcionarioId } = req.params;
  const currentMonth = new Date().getMonth() + 1; // Mês atual
  const currentYear = new Date().getFullYear(); // Ano atual

  const sql = `
    SELECT 
      DATE_FORMAT(vh.data_hora, '%d/%m/%Y') AS data_formatada,
      SUM(vh.quantidade * vh.valor_venda) AS total_vendas
    FROM vendas_historico vh
    WHERE vh.funcionario_id = ? 
      AND MONTH(vh.data_hora) = ? 
      AND YEAR(vh.data_hora) = ?
    GROUP BY data_formatada
    ORDER BY data_formatada ASC
  `;

  db.query(sql, [funcionarioId, currentMonth, currentYear], (err, results) => {
    if (err) {
      console.error("Erro ao buscar vendas por funcionário:", err);
      return res.status(500).json({ error: "Erro ao buscar vendas." });
    }

    const totalMes = results.reduce((acc, row) => acc + row.total_vendas, 0);

    res.status(200).json({
      vendas: results,
      totalMes: totalMes.toFixed(2), // Total do mês
    });
  });
});

// Inicia o servidor HTTP com suporte a WebSocket
server.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
