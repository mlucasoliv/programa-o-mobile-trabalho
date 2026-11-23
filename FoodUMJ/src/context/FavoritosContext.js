import { createContext, useContext, useState } from 'react';

// O Context é uma "caixa" que fica em volta do app inteiro. Qualquer tela lá
// dentro consegue ler e mudar a lista de favoritos, sem precisar passar a lista
// de tela em tela por props ou por route.params.
const FavoritosContext = createContext(null);

// O Provider é quem guarda a lista (com useState) e a entrega para todas as telas.
// No App.js ele envolve o NavigationContainer, por isso vale para o app todo.
export function FavoritosProvider({ children }) {
  // Cada favorito: { idMeal, strMeal, strMealThumb, strCategory }
  const [favoritos, setFavoritos] = useState([]);

  function adicionarFavorito(receita) {
    // Guarda só o que a lista de favoritos precisa mostrar (o mesmo que o ReceitaCard usa)
    const resumo = {
      idMeal: receita.idMeal,
      strMeal: receita.strMeal,
      strMealThumb: receita.strMealThumb,
      strCategory: receita.strCategory,
    };

    // Passar uma função para o setFavoritos garante que ela recebe a lista mais atual
    setFavoritos((listaAtual) => {
      const jaExiste = listaAtual.some((favorito) => favorito.idMeal === receita.idMeal);
      if (jaExiste) {
        return listaAtual; // não deixa a mesma receita entrar duas vezes
      }
      return [resumo, ...listaAtual]; // a mais recente aparece primeiro
    });
  }

  function removerFavorito(idMeal) {
    // filter cria uma lista NOVA sem a receita. No React não se altera o estado
    // direto (nada de splice): sempre se entrega uma lista nova para o setFavoritos.
    setFavoritos((listaAtual) => listaAtual.filter((favorito) => favorito.idMeal !== idMeal));
  }

  function ehFavorito(idMeal) {
    return favoritos.some((favorito) => favorito.idMeal === idMeal);
  }

  // "value" é o que as telas recebem quando usam o contexto
  return (
    <FavoritosContext.Provider value={{ favoritos, adicionarFavorito, removerFavorito, ehFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
}

// Hook para as telas usarem o contexto com uma linha só:
//   const { favoritos, adicionarFavorito, removerFavorito, ehFavorito } = useFavoritos();
export function useFavoritos() {
  const contexto = useContext(FavoritosContext);

  // Se alguma tela usar o hook fora do Provider, o erro já explica o que falta
  if (!contexto) {
    throw new Error('useFavoritos() precisa ser usado dentro do <FavoritosProvider>');
  }

  return contexto;
}
