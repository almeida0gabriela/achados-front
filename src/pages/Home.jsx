import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"
import mensagemErro from "../services/erro"

export default function Home() {
  const [itens, setItens] = useState([])
  const [categorias, setCategorias] = useState([])
  const [locais, setLocais] = useState([])

  const [busca, setBusca] = useState("")
  const [status, setStatus] = useState("")
  const [categoria, setCategoria] = useState("")
  const [local, setLocal] = useState("")

  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    async function buscarOpcoes() {
      try {
        const cat = await api.get("/categorias")
        const loc = await api.get("/locais")
        setCategorias(cat.data)
        setLocais(loc.data)
      } catch (err) {
        setErro(mensagemErro(err))
      }
    }
    buscarOpcoes()
  }, [])

  useEffect(() => {
    async function buscarItens() {
      setCarregando(true)
      setErro("")
      try {
        const params = {}
        if (busca) params.busca = busca
        if (status) params.status = status
        if (categoria) params.categoria = categoria
        if (local) params.local = local

        const resposta = await api.get("/itens", { params })
        setItens(resposta.data)
      } catch (err) {
        setItens([])
        setErro(mensagemErro(err))
      }
      setCarregando(false)
    }
    buscarItens()
  }, [busca, status, categoria, local])

  return (
    <div>
      <div className="linha">
        <h1>Itens encontrados</h1>
        <Link to="/novo" className="botao roxo">Novo item</Link>
      </div>

      <input
        placeholder="Buscar por nome ou descrição..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <div className="linha">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Status</option>
          <option value="aguardando">aguardando</option>
          <option value="devolvido">devolvido</option>
        </select>

        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="">Categoria</option>
          {categorias.map((c) => {
            const nome = c.nome || c
            return <option key={nome} value={nome}>{nome}</option>
          })}
        </select>

        <select value={local} onChange={(e) => setLocal(e.target.value)}>
          <option value="">Local</option>
          {locais.map((l) => {
            const nome = l.nome || l
            return <option key={nome} value={nome}>{nome}</option>
          })}
        </select>
      </div>

      {carregando && <p>Carregando itens...</p>}
      {erro && <p className="erro">Não foi possível carregar. {erro}</p>}
      {!carregando && !erro && itens.length === 0 && <p>Nenhum item encontrado.</p>}

      {!carregando &&
        itens.map((item) => (
          <Link to={"/item/" + item.id} className="item" key={item.id}>
            <span>{item.nome}</span>
            <span className={item.status === "aguardando" ? "roxo" : ""}>
              {item.status}
            </span>
          </Link>
        ))}
    </div>
  )
}