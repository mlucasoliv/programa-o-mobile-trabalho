// Serviço da API TheMealDB.
// Toda a comunicação do app com a internet fica neste arquivo:
// as telas só chamam as funções daqui e não precisam saber os endereços.

const URL_BASE = 'https://www.themealdb.com/api/json/v1/1';

// Faz a requisição e devolve o JSON da resposta.
// Se a internet cair, o próprio fetch lança um erro.
// Se o servidor responder com erro (ex.: 404, 500), nós lançamos um erro também.
// Quem chama essas funções trata o erro com try/catch e mostra a mensagem na tela.
async function requisitar(caminho) {
  const resposta = await fetch(`${URL_BASE}${caminho}`);

  if (!resposta.ok) {
    throw new Error(`A API respondeu com erro ${resposta.status}`);
  }

  return resposta.json();
}

// Busca receitas pelo nome (ex.: "chicken").
// Devolve um array de receitas, ou [] quando não encontra nada.
export async function buscarReceitas(termo) {
  const termoLimpo = termo.trim();

  // Com o termo vazio a API devolve receitas aleatórias, então já respondemos "nada encontrado".
  if (termoLimpo === '') {
    return [];
  }

  // encodeURIComponent protege a URL de espaços e acentos ("chicken curry" vira "chicken%20curry").
  const dados = await requisitar(`/search.php?s=${encodeURIComponent(termoLimpo)}`);

  // Quando não encontra nada, a API manda { meals: null }. Isso não é erro, é lista vazia.
  return Array.isArray(dados.meals) ? dados.meals : [];
}

// Busca uma receita completa pelo id (ex.: "52795").
// Devolve a receita, ou null quando ela não existe.
export async function buscarReceitaPorId(id) {
  const dados = await requisitar(`/lookup.php?i=${encodeURIComponent(id)}`);

  // Id inexistente vem como { meals: null } e id inválido vem como { meals: "Invalid ID" } (um texto!).
  // Por isso conferimos se é mesmo um array antes de pegar o primeiro item.
  if (!Array.isArray(dados.meals) || dados.meals.length === 0) {
    return null;
  }

  return dados.meals[0];
}
