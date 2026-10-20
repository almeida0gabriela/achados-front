import { useEffect, useState } from "react"
import { Link, Route, Routes } from "react-router-dom"
import api from "./services/api"
import Home from "./pages/Home"
import Detalhe from "./pages/Detalhe"
import Formulario from "./pages/Formulario"

export default function App() {
  const [nome, setNome] = useState("")

  useEffect(() => {
    async function buscarDono() {
      try {
        const resposta = await api.get("/eu")
        setNome(resposta.data.nome)
      } catch (err) {
        setNome("")
      }
    }
    buscarDono()
  }, [])

  return (
    <div>
      <header>
        <Link to="/" className="logo">Achados e Perdidos - IFRN</Link>
        <span>Olá, {nome}</span>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/item/:id" element={<Detalhe />} />
          <Route path="/novo" element={<Formulario />} />
          <Route path="/editar/:id" element={<Formulario />} />
        </Routes>
      </main>
    </div>
  )
}