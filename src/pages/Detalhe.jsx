import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "../services/api"
import mensagemErro from "../services/erro"

export default function Detalhe() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [item, setItem] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  const [devolvendo, setDevolvendo] = useState(false)
  const [nomeRecebeu, setNomeRecebeu] = useState("")
  const [excluindo, setExcluindo] = useState(false)

  async function buscarItem() {
    try {
      const resposta = await api.get("/itens/" + id)
      setItem(resposta.data)
    } catch (err) {
      setErro(mensagemErro(err))
    }
    setCarregando(false)
  }

  useEffect(() => {
    buscarItem()
  }, [id])

  async function devolver(e) {
    e.preventDefault()
    setErro("")
    try {
      await api.patch("/itens/" + id + "/devolver", { devolvido_para: nomeRecebeu })
      setDevolvendo(false)
      buscarItem()
    } catch (err) {
      setErro(mensagemErro(err))
    }
  }

  async function excluir() {
    try {
      await api.delete("/itens/" + id)
      navigate("/")
    } catch (err) {
      setExcluindo(false)
      setErro(mensagemErro(err))
    }
  }

  if (carregando) return <p>Carregando...</p>

  if (!item) {
    return (
      <div>
        <Link to="/">Voltar</Link>
        <p className="erro">{erro}</p>
      </div>
    )
  }

  return (
    <div>
      <Link to="/">Voltar</Link>

      <h1>{item.nome}</h1>
      <p className={item.status === "aguardando" ? "roxo" : ""}>{item.status}</p>

      <p>Descrição: {item.descricao}</p>
      <p>Categoria: {item.categoria}</p>
      <p>Local: {item.local}</p>
      <p>Encontrado em: {item.data_encontrado.slice(0, 10).split("-").reverse().join("/")}</p>
      {item.status === "devolvido" && <p>Devolvido para: {item.devolvido_para}</p>}

      {erro && <p className="erro">{erro}</p>}

      <div className="linha">
        <Link to={"/editar/" + id} className="botao">Editar</Link>
        <button onClick={() => setExcluindo(true)}>Excluir</button>
        {item.status === "aguardando" && (
          <button className="roxo" onClick={() => setDevolvendo(true)}>
            Marcar como devolvido
          </button>
        )}
      </div>

      {excluindo && (
        <div className="caixa">
          <p>Tem certeza que deseja excluir?</p>
          <button className="roxo" onClick={excluir}>Excluir</button>
          <button onClick={() => setExcluindo(false)}>Cancelar</button>
        </div>
      )}

      {devolvendo && (
        <form onSubmit={devolver} className="caixa">
          <label>Nome de quem recebeu</label>
          <input value={nomeRecebeu} onChange={(e) => setNomeRecebeu(e.target.value)} />
          <button className="roxo">Confirmar</button>
        </form>
      )}
    </div>
  )
}