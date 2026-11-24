# FoodUMJ: Receitas — Roteiro do projeto (em dupla)

App em React Native + Expo para **pesquisar receitas**, ver **detalhes** (nome, imagem, ingredientes, modo de preparo) e **salvar favoritas**.

| | Nome | GitHub | Parte |
|---|---|---|---|
| **Pessoa A** | ______________ | @mlucasoliv | **Fases 1 e 2**: a base do app (projeto, API, componentes, navegação, contexto e as telas de início, resultados e detalhes) |
| **Pessoa B** | ______________ | @lPedroTl | **Fases 3 e 4**: favoritos, acabamento visual, testes finais e entrega |

As fases são **em sequência**: a Pessoa B começa quando a Fase 2 estiver na `main`. A apresentação é dos dois.

---

## 1. Decisões técnicas

| Item | Escolha | Por quê |
|---|---|---|
| Linguagem | JavaScript | Mais simples de ler e explicar na apresentação |
| Base | Expo (template `blank`) | Roda direto no celular pelo app **Expo Go** |
| Navegação | React Navigation (Native Stack) | Cada tela é um componente explícito, fácil de mostrar |
| API | [TheMealDB](https://www.themealdb.com/api.php) | Gratuita, sem chave, tem busca por nome, detalhes por id, ingredientes e modo de preparo |
| Requisições | `fetch` | Já vem pronto, não precisa instalar nada |
| Estado | `useState` em cada tela + `useContext` para favoritos | Exigido pelo enunciado |

> ⚠️ A TheMealDB está em **inglês**: as buscas funcionam com termos como `chicken`, `beef`, `cake`, `soup`. A interface do app fica em português, e a tela inicial mostra essas sugestões ao usuário.

---

## 2. A API

| O quê | Endpoint |
|---|---|
| Buscar por nome | `https://www.themealdb.com/api/json/v1/1/search.php?s=chicken` |
| Detalhes por id | `https://www.themealdb.com/api/json/v1/1/lookup.php?i=52795` |

- Quando não encontra nada, a API responde `{"meals": null}`. Isso **não é erro**, é uma lista vazia (mensagem "Nenhuma receita encontrada").
- Campos que vamos usar: `idMeal`, `strMeal` (nome), `strMealThumb` (imagem), `strCategory`, `strArea` (origem), `strInstructions` (modo de preparo).
- Os ingredientes vêm "espalhados" em `strIngredient1` até `strIngredient20` e as quantidades em `strMeasure1` até `strMeasure20`. Uma função vai juntar tudo numa lista.
- A foto tem versões menores: `strMealThumb + '/small'` (≈ 9 KB) serve para listas; a original (≈ 110 KB) fica para a tela de detalhes.

---

## 3. Telas e fluxo

```
Início ──(buscar)──▶ Resultados ──(toca no card)──▶ Detalhes ◀──(toca no card)── Favoritos
                                                       │                            ▲
                                                       └──── ❤ favoritar/remover ───┘
                                                              (FavoritosContext)
```

O botão **❤ Favoritos** fica no cabeçalho de todas as telas.

| Tela | Dono | Recebe | Estados (`useState`) | O que faz |
|---|---|---|---|---|
| **Início** | A | — | `termo` | Campo de pesquisa, impede busca vazia, vai para Resultados levando o termo |
| **Resultados** | A | `termo` | `receitas`, `carregando`, `erro` | Busca na API e mostra a lista (foto + nome). Toque leva aos Detalhes |
| **Detalhes** | A (botão ❤: B) | `id` | `receita`, `carregando`, `erro` | Busca a receita pelo id e mostra foto, nome, ingredientes e modo de preparo |
| **Favoritos** | B | — (lê do contexto) | — | Lista as favoritas, toque abre Detalhes, botão remover, mensagem quando vazia |

---

## 4. Estrutura do repositório (e quem cuida de cada arquivo)

```
programa-o-mobile-trabalho/
├── ROTEIRO.md                          este arquivo
├── README.md                           [B]     Fase 4
└── FoodUMJ/                            o app Expo
    ├── App.js                          [A] ✅  navegação + Provider dos favoritos
    └── src/
        ├── services/
        │   └── api.js                  [A] ✅  buscarReceitas, buscarReceitaPorId
        ├── components/
        │   ├── Carregando.js           [A] ✅  ActivityIndicator + texto
        │   ├── MensagemErro.js         [A] ✅  mensagem + botão "Tentar novamente"
        │   └── ReceitaCard.js          [A] ✅  card com foto + nome + categoria
        ├── screens/
        │   ├── HomeScreen.js           [A] ✅  campo de pesquisa + sugestões
        │   ├── ResultadosScreen.js     [A] ✅  busca na API + FlatList de cards
        │   ├── DetalhesScreen.js       [A] ✅  o botão ❤ entra na Fase 3 (B)
        │   └── FavoritosScreen.js      [B]
        ├── context/
        │   └── FavoritosContext.js     [A] ✅  lista global de favoritos (useContext)
        └── utils/
            └── ingredientes.js         [A] ✅  junta strIngredientN + strMeasureN
```

Como as fases são em sequência, não há risco de conflito: na Fase 3 a Pessoa B pode mexer em qualquer arquivo (por exemplo, para colocar o botão ❤ nos Detalhes e aplicar as cores em todas as telas).

---

## 5. O que cada parte entrega (contratos)

Com isso, na Fase 3 a Pessoa B consegue usar tudo sem precisar ler o código inteiro.

### Nomes das rotas (navegação)
| Rota | Parâmetros |
|---|---|
| `'Inicio'` | — |
| `'Resultados'` | `{ termo }` |
| `'Detalhes'` | `{ id }` |
| `'Favoritos'` | — |

### `api.js` ✅
```js
buscarReceitas(termo)    // → Promise com array de receitas ([] se não achar nada). Lança erro se a requisição falhar
buscarReceitaPorId(id)   // → Promise com a receita completa (ou null). Lança erro se a requisição falhar
```

### Componentes ✅
```jsx
<Carregando mensagem="Buscando receitas..." />
<MensagemErro mensagem="Não foi possível carregar." onTentarNovamente={funcao} />
<ReceitaCard receita={receita} onPress={funcao} onRemover={funcao} />  // onRemover é opcional: se vier, mostra o botão "Remover"
```

### `FavoritosContext` (A cria na Fase 2, B usa na Fase 3)
```js
const { favoritos, adicionarFavorito, removerFavorito, ehFavorito } = useFavoritos();
// favoritos: [{ idMeal, strMeal, strMealThumb, strCategory }, ...]
// adicionarFavorito(receita) | removerFavorito(idMeal) | ehFavorito(idMeal) → true/false
```

### Padrão de carregamento e erro (Resultados e Detalhes)
1. Antes de chamar a API: `carregando = true`, `erro = null`
2. Deu certo: guarda os dados no estado
3. Deu errado (sem internet, resposta com erro): `erro = "Não foi possível carregar..."` e mostra `<MensagemErro>` com **Tentar novamente**
4. No fim (`finally`): `carregando = false`
5. Lista vazia: mostra "Nenhuma receita encontrada para *termo*"

---

## 6. Como trabalhar no Git

**Pessoa B, para começar (Fase 3):**
```bash
git clone https://github.com/mlucasoliv/programa-o-mobile-trabalho.git
cd programa-o-mobile-trabalho/FoodUMJ
npm install
npx expo start
```

**Toda tarefa nova:**
```bash
git checkout main
git pull
git checkout -b nome-da-tarefa
```
Trabalha, testa no celular e depois:
```bash
git add .
git commit -m "Descreve o que foi feito"
git push -u origin nome-da-tarefa
```
Aí abre um **Pull Request** no GitHub e faz o merge. De preferência, o outro dá uma olhada antes: ajuda os dois a conhecerem o código inteiro para a apresentação.

**Nunca** fazer commit direto na `main`.

---

## 7. Plano de trabalho por fases

### 🟦 Fase 1 — Base do projeto (Pessoa A)

- ✅ **A1. Criar o projeto Expo** (PR #1)
- ✅ **A2. Serviço da API** (PR #2)
- ✅ **A3. Componentes Carregando e MensagemErro** (PR #2)
- ✅ **A4. ReceitaCard** (PR #3)
- ✅ **A5. Navegação + 4 telas esqueleto** (PR #4)

**A5. Navegação**
```bash
cd FoodUMJ
npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
```
- Sempre instalar pacotes com `npx expo install` (e não `npm install`): ele escolhe a versão compatível com o Expo do projeto
- Criar as 4 telas só com um `<Text>` e botões de navegação, usando os nomes de rota da seção 5
- Configurar o Stack no `App.js` e o botão ❤ Favoritos no cabeçalho
- Conceitos: `NavigationContainer`, `Stack.Navigator`, `navigation.navigate('Tela', { params })`, `route.params`
- ✅ **Pronto quando:** dá para ir Início → Resultados → Detalhes, abrir Favoritos e voltar

---

### 🟩 Fase 2 — Telas principais e contexto (Pessoa A)

✅ **A6. Tela inicial** (PR #5)
- `TextInput` controlado por `useState`, botão **Buscar**, Enter do teclado também busca
- Não deixa buscar com o campo vazio (`termo.trim()`)
- Título FoodUMJ e sugestões de termos em inglês (`chicken`, `beef`, `cake`: `pasta` só traz 1 resultado)
- ✅ **Pronto quando:** digitar "beef" e buscar abre Resultados recebendo "beef"

✅ **A7. Tela de resultados** (PR #6)
- `useEffect` chama `buscarReceitas(termo)` quando a tela abre
- Estados `receitas`, `carregando`, `erro`; `FlatList` com `ReceitaCard`; toque abre Detalhes com o `id`
- ✅ **Pronto quando:**
  - "chicken" mostra os cards
  - "xyzabc" mostra "Nenhuma receita encontrada"
  - em **modo avião** aparece o erro, e "Tentar novamente" funciona quando a internet volta

✅ **A8. Contexto de favoritos** (PR #7)
- `createContext` + `FavoritosProvider` com `useState([])` e as funções da seção 5
- Envolver o `NavigationContainer` com o Provider no `App.js`
- Criar o hook `useFavoritos()` para as telas usarem o contexto com uma linha
- ✅ **Pronto quando:** o app continua abrindo e qualquer tela consegue ler `favoritos` (começa `[]`)

✅ **A9. Ingredientes** (PR #8)
- `montarIngredientes(receita)` percorre de 1 a 20 e devolve `[{ ingrediente, medida }]`, ignorando os vazios
- ✅ **Pronto quando:** com uma receita da API, a função devolve a lista limpa

✅ **A10. Tela de detalhes** (PR #9)
- Recebe o `id`, chama `buscarReceitaPorId(id)` com o padrão de carregamento/erro da seção 5
- `ScrollView` com foto grande, nome, categoria/origem, ingredientes e modo de preparo
- ✅ **Pronto quando:** tocar em qualquer receita dos Resultados mostra todos os dados dela

> 🏁 **Fim da Fase 2:** tudo na `main` → avisar a Pessoa B que pode começar.

---

### 🟨 Fase 3 — Favoritos e acabamento (Pessoa B)

**B0. Ambiente**
- Node.js versão LTS (`node -v` no terminal) e Git
- App **Expo Go** no celular, com celular e computador na **mesma rede Wi-Fi**
- Clonar e rodar o projeto (seção 6)

**B1. Botão favoritar** (na tela de Detalhes)
- Alterna entre adicionar e remover usando `ehFavorito`, `adicionarFavorito` e `removerFavorito` do contexto
- ✅ **Pronto quando:** o botão muda de "❤ Favoritar" para "Remover dos favoritos" e volta

**B2. Tela de favoritos**
- `FlatList` com `ReceitaCard` (passando `onRemover`), toque abre Detalhes, mensagem quando vazia
- ✅ **Pronto quando:** favoritar em Detalhes faz a receita aparecer em Favoritos; remover em Favoritos faz o ❤ de Detalhes mudar também (prova de que a lista é global)

**B3. Identidade visual**
- Uma paleta de cores só (hoje o laranja `#E85D04` está nos componentes), aplicada em todas as telas
- Títulos dos cabeçalhos em português, teclado fecha ao buscar

**B4. Revisar mensagens**
- Conferir todas as mensagens de erro, de carregamento e de lista vazia do app

---

### 🟥 Fase 4 — Entrega (Pessoa B; apresentação com os dois)

- [x] **B5. Testes finais:** o app inteiro no celular (de preferência um Android e um iPhone), incluindo o modo avião em Resultados e em Detalhes (testado no Android com o Expo Go)
- [x] **B6. README.md:** sobre o app, API usada, como rodar e prints das telas
- [x] **B7. Vídeo ou prints** do app funcionando
- [x] **B8. Conferir o checklist** da seção 8
- [ ] **Os dois: ensaiar a apresentação.** Cada um explica a sua parte, mas os dois precisam saber responder sobre tudo

---

## 8. Checklist dos requisitos do enunciado

| Requisito | Onde está | Responsável |
|---|---|---|
| React Native com Expo | Projeto criado com `create-expo-app` | A ✅ |
| Consome API externa | `src/services/api.js` (TheMealDB) | A ✅ |
| `useState` para os estados | Todas as telas (`termo`, `receitas`, `carregando`, `erro`, `receita`) | A ✅ e B |
| `useContext` para favoritos | `src/context/FavoritosContext.js` (A), usado no botão ❤ e na tela de Favoritos (B) | A ✅ e B |
| Tela inicial com pesquisa | `HomeScreen.js` | A ✅ |
| Tela de resultados | `ResultadosScreen.js` | A ✅ |
| Tela de detalhes | `DetalhesScreen.js` | A ✅ |
| Tela de favoritos | `FavoritosScreen.js` | B |
| Navegação entre telas | `App.js` (React Navigation) | A ✅ |
| Carregamento e erros | `Carregando.js` e `MensagemErro.js`, usados em Resultados e Detalhes | A ✅ |

---

## 9. Extras (se sobrar tempo depois da Fase 3)

- Salvar favoritos no aparelho com AsyncStorage (não somem ao fechar o app)
- Mostrar ❤ nos cards da lista de resultados
- Busca por categoria (`categories.php` e `filter.php?c=Dessert`)
- Abas na parte de baixo (Bottom Tabs): Buscar | Favoritos
- Botão para abrir o vídeo da receita no YouTube (`strYoutube`)
