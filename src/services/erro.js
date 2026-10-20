export default function mensagemErro(err) {
  const detalhe = err.response?.data?.detail

  if (typeof detalhe === "string") 
    return detalhe
  if (Array.isArray(detalhe)) 
    return detalhe.map((d) => d.msg).join(", ")

  return "Não foi possível conectar. Verifique sua chave."
}