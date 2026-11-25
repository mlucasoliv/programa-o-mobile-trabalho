// Paleta única do FoodUMJ. Telas e componentes importam daqui,
// em vez de escrever o código da cor direto no estilo.
// Uso: import { cores } from '../theme/cores';  →  backgroundColor: cores.primaria
export const cores = {
  // Laranja da marca: botões, cabeçalho, rodinha de carregamento, números dos passos
  primaria: "#E85D04",
  primariaClara: "#FDEBDD", // fundo das etiquetas, dos círculos dos ícones e da lixeira
  primariaEscura: "#9A3B00", // texto sobre o fundo claro (etiquetas)

  // Erro e avisos
  erro: "#D62828",

  // Fundos
  fundo: "#fff", // cards, campo de pesquisa e cabeçalho
  fundoSuave: "#F6F6F6", // fundo da tela inicial, das listas e da caixa de ingredientes
  fundoImagem: "#eee", // aparece enquanto a foto carrega

  // Linhas e bordas
  borda: "#ddd",

  // Textos
  textoPrincipal: "#222", // títulos e nomes
  texto: "#333", // texto corrido
  textoSuave: "#666", // textos secundários
  textoPlaceholder: "#999", // dica dentro do campo de pesquisa
  textoSobrePrimaria: "#fff", // texto sobre o laranja
};
