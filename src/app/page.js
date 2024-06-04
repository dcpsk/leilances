import { open } from 'sqlite'
const sqlite3 = require("sqlite3")

import Link from 'next/link'
import { authOptions } from './api/auth/[...nextauth]/route'
import { getServerSession } from "next-auth"

const db = await open({
  filename: 'leilances.db',
  driver: sqlite3.Database
});

function Anuncio({props}) {
  return (
    <div class={"p-4 bg-white shadow-md hover:shadow-lg cursor-pointer"}>
        <Link href={"/sala/" + props.id}>
              {props.id}
          <br/>
          <b>{props.descricao}</b>
          <p>Anunciado por: {props.vendedor}</p>
          <p>Lance mínimo: R${props.preco}</p>
          <p>Criado em: {new Date(props.criado_em).toLocaleDateString()}</p>
          <p>Expira em: {new Date(props.expira_em).toLocaleDateString()}</p>
        </Link>
    </div>
  )
}

export default async function Home() {
  const sess = await getServerSession(authOptions)

  let salas = await db.all('SELECT * FROM produto LEFT JOIN usuario ON usuario.usuario_id = produto.usuario_id WHERE expira_em > ? ORDER BY produto_id DESC', Date.now() - 500).then((e) => {return e})

  return (
      <div class={"container mx-auto p-4"}>
          {<button class={"rounded-lg text-sm p-1 bg-blue-300 hover:bg-blue-400"}><Link href={sess ? "/api/auth/signout" : "/entrar"}>{sess ? "SAIR" : "ENTRAR"}</Link></button>}
          {sess && <button class={"rounded-lg text-sm p-1 bg-blue-300 hover:bg-blue-400"}><Link href="/leilao">CRIAR ANÚNCIO</Link></button>}
          {sess && <p>Bem-vindo, {sess.user.email}</p>}
          <h1 class={"text-2xl font-bold"}>LEILÕES ATIVOS</h1>
          <div class={"grid grid-cols-2 gap-4"}>
              {salas.length > 0 ?
                salas.map((e,k) => {
                return <Anuncio key={k} props={
                  {id: e.produto_id, vendedor: e.nome, descricao: e.descricao, preco: e.preco, criado_em: e.criado_em, expira_em: e.expira_em}
                  } />
                }) :
                <h4>Nada por enquanto! Volte mais tarde.</h4>
              }
          </div>
          
      </div>
  )
}
