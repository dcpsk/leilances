"use client";
import { useState } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
 
export default function LoginPage() {
  const [tenhoConta, setTenhoConta] = useState(1)
 
  async function handleSubmit(event) {
    event.preventDefault()
 
    const formData = new FormData(event.currentTarget)
    const acao = formData.get('acao')
    const email = formData.get('email')
    const senha = formData.get('senha')

    if(acao === "entrar")
      signIn("credentials", { acao: acao, email: email, senha: senha, callbackUrl: "/"})
    if(acao === "registrar")
      signIn("credentials", { 
        acao: acao, 
        nome: formData.get('nome'), 
        sexo: formData.get('sexo'), 
        email: email, 
        senha: senha, 
        cpf: formData.get('cpf'),
        rg: formData.get('rg'),
        tel: formData.get('tel'),
        callbackUrl: "/entrar"
      })
  }
  
  function Entrar(){
    return (
      <form onSubmit={handleSubmit}>
          <input type="text" name="acao" value="entrar" hidden />
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="senha" placeholder="Senha" required />
          <button type="submit" class={"rounded-lg p-2 bg-blue-200 hover:bg-blue-300"}>Entrar</button>
      </form>
    )
  }
 
  function Registrar(){
    return (
      <form onSubmit={handleSubmit}>
          <p>CADASTRO</p>
          <input type="text" name="acao" value="registrar" hidden />
          <br />
          <input type="text" name="nome" placeholder="Nome" required />*
          <br />
          <input type="text" name="sexo" placeholder="Sexo" required />
          <br />
          <input type="email" name="email" placeholder="Email" required />*
          <br />
          <input type="password" name="senha" placeholder="Senha" required />*
          <br />
          <input type="text" name="cpf" placeholder="CPF" />
          <br />
          <input type="text" name="rg" placeholder="RG" />
          <br />
          <input type="tel" name="tel" pattern="+55[0-9]{13}"  placeholder="Telefone (formato: +5513911111111)" />
          <br />
          <br />
          <button type="submit" class={"rounded-lg p-2 bg-blue-200 hover:bg-blue-300"}>Registrar</button>
      </form>
    )
  }

  return (
    <div class="flex place-content-center">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        {tenhoConta ? 
          <>
          <a class={"underline text-sm"} onClick={() => setTenhoConta(!setTenhoConta)}>Não tenho conta</a>
          <Entrar />
          </> :
          <Registrar />
        }
      </div>
    </div>
  )
}