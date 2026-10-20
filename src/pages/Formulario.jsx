import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "../services/api"
import mensagemErro from "../services/erro"

export default function Form() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [categoria, setCategoria] = useState("")
  const [local, setLocal] = useState("")
  const [data, setData] = useState("")

  const [categorias, setCategorias] = useState([])
  const [locais, setLocais] = useState([])

  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState("")

  useEffect(() => {
    async function carregar() {
      try {
        const cat = await api.get("/categorias")
        const loc = await api.get("/locais")
        setCategorias(cat.data)
        setLocais(loc.data)

        if (id) {
          const resposta = await api.get("/itens/" + id)
          const item = resposta.data
          setNome(item.nome)
          setDescricao(item.descricao)
          setCategoria(item.categoria)
          setLocal(item.local)
          setData(item.data_encontrado.slice(0, 10))
        }
      } catch (err) {
        setErro(mensagemErro(err))
      }
    }
    carregar()
  }, [id])

  async function salvar(e) {
    e.preventDefault()
    setErro("")
    setSucesso("")

    const item = { nome, descricao, categoria, local, data_encontrado: data }

    try {
      if (id) {
        await api.put("/itens/" + id, item)
      } else {
        await api.post("/itens", item)
      }
      setSucesso("Item salvo!")
      setTimeout(() => navigate("/"), 1000)
    } catch (err) {
      setErro(mensagemErro(err))
    }
  }

  return (
    <div>
      <h1>{id ? "Editar item" : "Novo item"}</h1>

      <form onSubmit={salvar} className="caixa">
        <label>Nome</label>
        <input value={nome} onChange={(e) => setNome(e.target.value)} />

        <label>Descrição</label>
        <input value={descricao} onChange={(e) => setDescricao(e.target.value)} />

        <label>Categoria</label>
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="">Selecione...</option>
          {categorias.map((c) => {
            const texto = c.nome || c
            return <option key={texto} value={texto}>{texto}</option>
          })}
        </select>

        <label>Local</label>
        <select value={local} onChange={(e) => setLocal(e.target.value)}>
          <option value="">Selecione...</option>
          {locais.map((l) => {
            const texto = l.nome || l
            return <option key={texto} value={texto}>{texto}</option>
          })}
        </select>

        <label>Data em que foi encontrado</label>
        <input type="date" value={data} onChange={(e) => setData(e.target.value)} />

        {erro && <p className="erro">{erro}</p>}
        {sucesso && <p>{sucesso}</p>}

        <div className="linha">
          <button className="roxo">Salvar</button>
          <Link to="/" className="botao">Cancelar</Link>
        </div>
      </form>
    </div>
  )
}