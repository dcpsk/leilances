const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

async function main() {

  const db = await open({
    filename: 'leilances.db',
    driver: sqlite3.Database
  });

   await db.exec(`
    CREATE TABLE IF NOT EXISTS usuario (
        usuario_id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        sexo TEXT,
        email TEXT,
        senha TEXT,
        cpf TEXT,
        rg varchar(255),
        telefone TEXT
      );
      
      CREATE TABLE IF NOT EXISTS produto (
        produto_id INTEGER PRIMARY KEY AUTOINCREMENT,
        descricao TEXT,
        categoria TEXT,
        criado_em INTEGER,
        expira_em INTEGER,
        preco REAL,
        usuario_id INTEGER,
        FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id)
      );
      
      CREATE TABLE IF NOT EXISTS lance (
        lance_id INTEGER PRIMARY KEY AUTOINCREMENT,
        valor INTEGER,
        data INTEGER,
        usuario_id INTEGER,
        produto_id INTEGER,
        FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id),
        FOREIGN KEY (produto_id) REFERENCES produto(produto_id)
      );

      CREATE TABLE IF NOT EXISTS log (
        token TEXT,
        email TEXT,
        sala INTEGER,
        data INTEGER
      );
  `);

const httpServer = http.createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  },
});

io.on("connection", (socket) => {
  console.log("Usuário conectado: ", socket.id);

  console.log([socket.handshake.auth.token, socket.handshake.auth.email])

  db.get("SELECT * FROM log WHERE token = ? AND email = ? ORDER BY data DESC LIMIT 1", [socket.handshake.auth.token, socket.handshake.auth.email])
  .then( (res) => {
    if(res){
      db.get("SELECT usuario_id FROM usuario WHERE email = ?", res.email).then((uid) => {
   
        socket.on("entrar_sala", (dado) => {
          socket.join(dado);
          console.log(`${socket.handshake.auth.token} com socket id-${socket.id} entrou na sala ${dado}`);
        });

        /*socket.on("mensagem", (dado) => {
          console.log(dado)
          socket.to(dado[0]).emit("chat_msg", [dado[1], Date.now(), res.user.nome]);
        });*/

        socket.on("dar_lance", (dados) => {
          db.run("INSERT INTO lance (valor, data, usuario_id, produto_id) VALUES (?, ?, ?, ?)", [parseFloat(dados[1]), Date.now(), uid.usuario_id, dados[0]])
          .then((tmp) => {
            if(tmp)
              socket.to(dados[0]).emit("lance_msg", [dados[1], Date.now(), res.email]);
          })
        });

        socket.on("disconnect", () => {
          console.log("Socket desconectado:", socket.id);
          socket.leave()
        });
      })

    } else {
      socket.leave()
    }

  })

});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});
}
main()