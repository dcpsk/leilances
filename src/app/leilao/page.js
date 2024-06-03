import { authOptions } from "../api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"

export default async function Home() {
    const ss = await getServerSession(authOptions)

    return (
        <div class="flex place-content-center">
            <div class="bg-white p-6 rounded-lg shadow-lg">
                <form method="POST" action="/api/anunciar">
                    <textarea 
                        name="descricao" 
                        autofocus 
                        maxLength={250} 
                        placeholder="Descrição do produto" 
                        rows="5" 
                        cols="33" 
                        required />*
                    <br />
                    <input type="number" name="preco" placeholder="Preço inicial" />
                    <br />
                    <input type="text" name="categoria" placeholder="Categoria" />
                    <br />
                    Expira em: <input type="date" name="expira_em" required />*
                    <br />
                    <br />
                    <button type="submit" class={"rounded-lg p-2 bg-blue-200 hover:bg-blue-300"}>Anunciar</button>
                </form>
            </div>
        </div>
    )
}