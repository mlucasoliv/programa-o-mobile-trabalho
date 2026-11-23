// A API não manda os ingredientes numa lista pronta. Ela manda 20 campos soltos
// com os nomes (strIngredient1 até strIngredient20) e outros 20 com as medidas
// (strMeasure1 até strMeasure20). Os que a receita não usa vêm vazios: "", " " ou null.
//
// Esta função junta cada ingrediente com a sua medida e joga fora os vazios.
//
// Uso:
//   montarIngredientes(receita)
//   → [{ ingrediente: 'Chicken', medida: '1 whole' }, { ingrediente: 'Salt', medida: '1 tsp' }, ...]
export function montarIngredientes(receita) {
  if (!receita) {
    return [];
  }

  const lista = [];

  for (let numero = 1; numero <= 20; numero++) {
    // receita[`strIngredient${numero}`] lê o campo pelo nome montado na hora:
    // strIngredient1, strIngredient2, ... (o mesmo vale para strMeasure)
    // "?? ''" troca null por texto vazio, e o trim() tira os espaços das pontas
    const ingrediente = (receita[`strIngredient${numero}`] ?? '').trim();
    const medida = (receita[`strMeasure${numero}`] ?? '').trim();

    // Só entra na lista se tiver nome de ingrediente
    if (ingrediente !== '') {
      lista.push({ ingrediente, medida });
    }
  }

  return lista;
}
