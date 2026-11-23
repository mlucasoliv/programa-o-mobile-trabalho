# FoodUMJ: Receitas — Roteiro do projeto (em dupla)

App em React Native + Expo para **pesquisar receitas**, ver **detalhes** (nome, imagem, ingredientes, modo de preparo) e **salvar favoritas**.

| | Nome | GitHub | Frente |
|---|---|---|---|
| **Pessoa A** | ______________ | @mlucasoliv | 🔎 **Busca**: API, tela inicial, resultados |
| **Pessoa B** | ______________ | @______________ | ❤️ **Receita e Favoritos**: navegação, contexto, detalhes, favoritos |

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

> ⚠️ A TheMealDB está em **inglês**: as buscas funcionam com termos como `chicken`, `pasta`, `cake`, `beef`, `soup`. A interface do app fica em português, e a tela inicial mostra essas sugestões ao usuário.

---

## 2. A API

| O quê | Endpoint |
|---|---|
| Buscar por nome | `https://www.themealdb.com/api/json/v1/1/search.php?s=chicken` |
| Detalhes por id | `https://www.themealdb.com/api/json/v1/1/lookup.php?i=52795` |

- Quando não encontra nada, a API responde `{"meals": null}`. Isso **não é erro**, é uma lista vazia (mensagem "Nenhuma receita encontrada").
- Campos que vamos usar: `idMeal`, `strMeal` (nome), `strMealThumb` (imagem), `strCategory`, `strArea` (origem), `strInstructions` (modo de preparo).
- Os ingredientes vêm "espalhados" em `strIngredient1` até `strIngredient20` e as quantidades em `strMeasure1` até `strMeasure20`. Uma função vai juntar tudo numa lista.

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
| **Resultados** | A | `termo` | `receitas`, `carregando`, `erro` | Busca na API e mostra a lista (imagem + nome). Toque leva aos Detalhes |
| **Detalhes** | B | `id` | `receita`, `carregando`, `erro` | Busca a receita pelo id e mostra imagem, nome, ingredientes, modo de preparo e o botão de favoritar |
| **Favoritos** | B | — (lê do contexto) | — | Lista as favoritas, toque abre Detalhes, botão remover, mensagem quando vazia |

---

## 4. Estrutura do repositório (e quem cuida de cada arquivo)

```
programa-o-mobile-trabalho/
├── ROTEIRO.md                          este arquivo
├── README.md                           [A+B]  Fase 4
└── FoodUMJ/                            o app Expo
    ├── App.js                          [B]    navegação + Provider dos favoritos
    └── src/
        ├── services/
        │   └── api.js                  [A]    buscarReceitas, buscarReceitaPorId
        ├── components/
        │   ├── Carregando.js           [A]    ActivityIndicator + texto
        │   ├── MensagemErro.js         [A]    mensagem + botão "Tentar novamente"
        │   └── ReceitaCard.js          [A]    card com imagem + nome
        ├── screens/
        │   ├── HomeScreen.js           [A]
        │   ├── ResultadosScreen.js     [A]
        │   ├── DetalhesScreen.js       [B]
        │   └── FavoritosScreen.js      [B]
        ├── context/
        │   └── FavoritosContext.js     [B]    lista global de favoritos (useContext)
        └── utils/
            └── ingredientes.js         [B]    junta strIngredientN + strMeasureN
```

**Regra de ouro:** cada um só edita os arquivos da sua frente. Se precisar mexer no arquivo do outro, combinem antes.

---

## 5. Combinados entre a dupla (definidos antes de começar)

Esses "contratos" deixam os dois trabalharem **ao mesmo tempo** sem esperar o outro terminar.

### Nomes das rotas (navegação)
| Rota | Parâmetros |
|---|---|
| `'Inicio'` | — |
| `'Resultados'` | `{ termo }` |
| `'Detalhes'` | `{ id }` |
| `'Favoritos'` | — |

### `api.js` (Pessoa A entrega)
```js
buscarReceitas(termo)    // → Promise com array de receitas ([] se não achar nada). Lança erro se a requisição falhar
buscarReceitaPorId(id)   // → Promise com a receita completa (ou null). Lança erro se a requisição falhar
```

### Componentes (Pessoa A entrega, Pessoa B reutiliza)
```jsx
<Carregando mensagem="Buscando receitas..." />
<MensagemErro mensagem="Não foi possível carregar." onTentarNovamente={funcao} />
<ReceitaCard receita={receita} onPress={funcao} onRemover={funcao} />  // onRemover é opcional: se vier, mostra o botão "Remover"
```

### `FavoritosContext` (Pessoa B entrega)
```js
const { favoritos, adicionarFavorito, removerFavorito, ehFavorito } = useFavoritos();
// favoritos: [{ idMeal, strMeal, strMealThumb, strCategory }, ...]
// adicionarFavorito(receita) | removerFavorito(idMeal) | ehFavorito(idMeal) → true/false
```

### Padrão de carregamento e erro (os dois usam igual)
1. Antes de chamar a API: `carregando = true`, `erro = null`
2. Deu certo: guarda os dados no estado
3. Deu errado (sem internet, resposta com erro): `erro = "Não foi possível carregar..."` e mostra `<MensagemErro>` com **Tentar novamente**
4. No fim (`finally`): `carregando = false`
5. Lista vazia: mostra "Nenhuma receita encontrada para *termo*"

---

## 6. Como trabalhar no Git sem dar conflito

**Primeira vez (só uma vez):**
- **A** adiciona **B** como colaborador: GitHub → *Settings* → *Collaborators* → *Add people*
- **B** aceita o convite (chega por e-mail) e clona:
  ```bash
  git clone https://github.com/mlucasoliv/programa-o-mobile-trabalho.git
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
Aí abre um **Pull Request** no GitHub. **O outro revisa e aprova** antes do merge. Assim os dois conhecem o código inteiro, o que ajuda muito na apresentação.

**Nunca** fazer commit direto na `main`.

---

## 7. Plano de trabalho por fases

### 🟦 Fase 1 — Base do projeto

| Pessoa A | Pessoa B |
|---|---|
| **A1. Criar o projeto Expo** (branch `setup-projeto`) | **B0. Preparar o ambiente** enquanto A cria o projeto |
| **A2. Serviço da API** (branch `api-receitas`) | **B1. Navegação + 4 telas esqueleto** (branch `navegacao`) |
| **A3. Componentes Carregando e MensagemErro** (mesma branch da A2) | |

**A1. Criar o projeto** (antes de tudo, os outros dependem dele)
```bash
npx create-expo-app@latest FoodUMJ --template blank
cd FoodUMJ
npx expo start
```
- ✅ **Pronto quando:** o app abre no celular pelo Expo Go, e o PR foi aprovado e mergeado

**B0. Ambiente** (os dois precisam ter)
- Node.js versão LTS (`node -v` no terminal) e Git
- App **Expo Go** no celular, com celular e computador na **mesma rede Wi-Fi**

**B1. Navegação** (depois que a A1 estiver na `main`)
```bash
cd FoodUMJ
npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
```
- Sempre instalar pacotes com `npx expo install` (e não `npm install`): ele escolhe a versão compatível com o Expo do projeto
- Criar as 4 telas só com um `<Text>` e botões de navegação, usando os nomes de rota da seção 5
- Configurar o Stack no `App.js` e o botão ❤ Favoritos no cabeçalho
- Conceitos: `NavigationContainer`, `Stack.Navigator`, `navigation.navigate('Tela', { params })`, `route.params`
- ✅ **Pronto quando:** dá para ir Início → Resultados → Detalhes, abrir Favoritos e voltar

**A2. API**
- `src/services/api.js` com as duas funções da seção 5
- Conceitos: `fetch`, `async/await`, `response.ok`, `encodeURIComponent`
- ✅ **Pronto quando:** um `console.log` de `buscarReceitas('chicken')` mostra as receitas no terminal

**A3. Componentes de carregamento e erro**
- `Carregando` (ActivityIndicator + texto) e `MensagemErro` (texto + botão)
- ✅ **Pronto quando:** os dois aparecem certinho se colocados temporariamente numa tela

> 🔁 **Fim da Fase 1:** os dois fazem `git checkout main && git pull` antes de começar a Fase 2.

---

### 🟩 Fase 2 — Telas principais (em paralelo)

| Pessoa A | Pessoa B |
|---|---|
| **A4. ReceitaCard** (fazer primeiro, B vai usar na Fase 3) | **B2. Contexto de favoritos** |
| **A5. Tela inicial** | **B3. Função de ingredientes** |
| **A6. Tela de resultados** | **B4. Tela de detalhes** |

**A4. ReceitaCard**
- Imagem + nome + categoria; botão "Remover" só aparece se receber `onRemover`
- ✅ **Pronto quando:** o PR está mergeado (B depende dele na Fase 3)

**A5. Tela inicial**
- `TextInput` controlado por `useState`, botão **Buscar**, Enter do teclado também busca
- Não deixa buscar com o campo vazio (`termo.trim()`)
- Título FoodUMJ e sugestões de termos em inglês
- ✅ **Pronto quando:** digitar "pasta" e buscar abre Resultados recebendo "pasta"

**A6. Tela de resultados**
- `useEffect` chama `buscarReceitas(termo)` quando a tela abre
- Estados `receitas`, `carregando`, `erro`; `FlatList` com `ReceitaCard`
- ✅ **Pronto quando:**
  - "chicken" mostra os cards
  - "xyzabc" mostra "Nenhuma receita encontrada"
  - em **modo avião** aparece o erro, e "Tentar novamente" funciona quando a internet volta

**B2. Contexto de favoritos**
- `createContext` + `FavoritosProvider` com `useState([])` e as funções da seção 5
- Envolver o `NavigationContainer` com o Provider no `App.js`
- Criar o hook `useFavoritos()` para as telas usarem o contexto com uma linha
- ✅ **Pronto quando:** o app continua abrindo e qualquer tela consegue ler `favoritos` (começa `[]`)

**B3. Ingredientes**
- `montarIngredientes(receita)` percorre de 1 a 20 e devolve `[{ ingrediente, medida }]`, ignorando os vazios
- ✅ **Pronto quando:** um `console.log` com uma receita da API mostra a lista limpa

**B4. Tela de detalhes**
- Recebe o `id`, chama `buscarReceitaPorId(id)` com o padrão de carregamento/erro da seção 5
- `ScrollView` com imagem grande, nome, categoria/origem, ingredientes e modo de preparo
- ✅ **Pronto quando:** tocar em qualquer receita dos Resultados mostra todos os dados dela

> 🔁 **Fim da Fase 2:** `git checkout main && git pull` de novo.

---

### 🟨 Fase 3 — Favoritos e acabamento

| Pessoa A | Pessoa B |
|---|---|
| **A7. Identidade visual**: cores, fontes, espaçamentos nas telas de A | **B5. Botão ❤ favoritar na tela de detalhes** |
| **A8. Revisar mensagens** de erro e lista vazia em todo o app | **B6. Tela de favoritos** |

**B5. Botão favoritar**
- Na tela de Detalhes, alterna entre adicionar e remover usando `ehFavorito`
- ✅ **Pronto quando:** o botão muda de "❤ Favoritar" para "Remover dos favoritos" e volta

**B6. Tela de favoritos**
- `FlatList` com `ReceitaCard` (passando `onRemover`), toque abre Detalhes, mensagem quando vazia
- ✅ **Pronto quando:** favoritar em Detalhes faz a receita aparecer em Favoritos; remover em Favoritos faz o ❤ de Detalhes mudar também (prova de que a lista é global)

**A7. Visual**
- Uma paleta de cores só, aplicada nas telas e componentes de A; passar as cores para B usar nas telas dele
- Títulos dos cabeçalhos em português, teclado fecha ao buscar

---

### 🟥 Fase 4 — Entrega (juntos)

- [ ] Testar o app inteiro **no celular dos dois** (de preferência um Android e um iPhone)
- [ ] Teste de modo avião em Resultados e em Detalhes
- [ ] `README.md`: A escreve "Sobre o app" e "API usada"; B escreve "Como rodar" e "Telas" com prints
- [ ] Conferir o checklist da seção 8
- [ ] Gravar o vídeo ou tirar os prints do app funcionando
- [ ] Ensaiar a apresentação: cada um explica a sua frente, mas os dois precisam saber responder sobre tudo

---

## 8. Checklist dos requisitos do enunciado

| Requisito | Onde está | Responsável |
|---|---|---|
| React Native com Expo | Projeto criado com `create-expo-app` | A |
| Consome API externa | `src/services/api.js` (TheMealDB) | A |
| `useState` para os estados | Todas as telas (`termo`, `receitas`, `carregando`, `erro`, `receita`) | A e B |
| `useContext` para favoritos | `src/context/FavoritosContext.js`, usado em Detalhes e Favoritos | B |
| Tela inicial com pesquisa | `HomeScreen.js` | A |
| Tela de resultados | `ResultadosScreen.js` | A |
| Tela de detalhes | `DetalhesScreen.js` | B |
| Tela de favoritos | `FavoritosScreen.js` | B |
| Navegação entre telas | `App.js` (React Navigation) | B |
| Carregamento e erros | `Carregando.js` e `MensagemErro.js`, usados em Resultados e Detalhes | A (usados por A e B) |

---

## 9. Extras (se sobrar tempo)

| Extra | Sugestão |
|---|---|
| Salvar favoritos no aparelho com AsyncStorage (não somem ao fechar o app) | B |
| Mostrar ❤ nos cards da lista de resultados | A |
| Busca por categoria (`categories.php` e `filter.php?c=Dessert`) | A |
| Abas na parte de baixo (Bottom Tabs): Buscar \| Favoritos | B |
| Botão para abrir o vídeo da receita no YouTube (`strYoutube`) | B |
