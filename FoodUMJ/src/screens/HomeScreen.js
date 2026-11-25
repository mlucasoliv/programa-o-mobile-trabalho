import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import IconeCirculo from "../components/IconeCirculo";
import { cores } from "../theme/cores";

// As receitas da API estão em inglês, então sugerimos termos que trazem bastante resultado.
// "icone" é o nome do desenho no MaterialCommunityIcons (lista em https://icons.expo.fyi).
const SUGESTOES = [
  { termo: "chicken", traducao: "frango", icone: "food-drumstick-outline" },
  { termo: "beef", traducao: "carne", icone: "food-steak" },
  { termo: "cake", traducao: "bolo", icone: "cake-variant-outline" },
  { termo: "soup", traducao: "sopa", icone: "pot-steam-outline" },
  { termo: "salad", traducao: "salada", icone: "leaf" },
  { termo: "rice", traducao: "arroz", icone: "rice" },
];

// Agrupa as sugestões de duas em duas: cada par vira uma linha da grade.
// [a, b, c, d, e, f]  →  [[a, b], [c, d], [e, f]]
const LINHAS_SUGESTOES = [];
for (let i = 0; i < SUGESTOES.length; i += 2) {
  LINHAS_SUGESTOES.push(SUGESTOES.slice(i, i + 2));
}

// Tela inicial: campo de pesquisa + sugestões.
export default function HomeScreen({ navigation }) {
  // useState guarda o que está digitado. Cada letra digitada atualiza o estado,
  // e o React redesenha a tela com o valor novo (é um "campo controlado").
  const [termo, setTermo] = useState("");
  // Mensagem mostrada quando o usuário tenta buscar com o campo vazio
  const [aviso, setAviso] = useState("");

  function buscar(texto) {
    const termoLimpo = texto.trim();

    if (termoLimpo === "") {
      setAviso("Digite o nome de uma receita para buscar.");
      return;
    }

    setAviso("");
    Keyboard.dismiss(); // fecha o teclado antes de trocar de tela
    navigation.navigate("Resultados", { termo: termoLimpo });
  }

  function aoDigitar(texto) {
    setTermo(texto);
    if (aviso) setAviso(""); // some com o aviso assim que a pessoa volta a digitar
  }

  function usarSugestao(sugestao) {
    setTermo(sugestao);
    buscar(sugestao);
  }

  return (
    // keyboardShouldPersistTaps="handled": o toque numa sugestão funciona de primeira,
    // mesmo com o teclado aberto
    <ScrollView
      style={styles.tela}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.topo}>
        <IconeCirculo nome="restaurant" tamanho={80} />
        <Text style={styles.titulo}>O que vamos cozinhar hoje?</Text>
        <Text style={styles.subtitulo}>
          Pesquise uma receita pelo nome, em inglês.
        </Text>
      </View>

      <View style={styles.linhaBusca}>
        {/* A lupa e o campo ficam dentro da mesma "caixa", que recebe a borda */}
        <View style={[styles.caixaBusca, aviso ? styles.caixaComAviso : null]}>
          <Ionicons name="search" size={20} color={cores.textoPlaceholder} />
          <TextInput
            style={styles.campo}
            value={termo}
            onChangeText={aoDigitar}
            onSubmitEditing={() => buscar(termo)} // o Enter do teclado também busca
            placeholder="Ex.: chicken, cake, soup..."
            placeholderTextColor={cores.textoPlaceholder}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false} // senão o corretor em português troca "chicken" por outra palavra
            clearButtonMode="while-editing"
            accessibilityLabel="Pesquisar receitas"
          />
        </View>
        <Pressable
          onPress={() => buscar(termo)}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.botao,
            pressed && styles.pressionado,
          ]}
        >
          <Text style={styles.textoBotao}>Buscar</Text>
        </Pressable>
      </View>

      {aviso ? <Text style={styles.aviso}>{aviso}</Text> : null}

      <Text style={styles.tituloSugestoes}>Sugestões</Text>
      {/* Grade de duas colunas: cada linha tem dois cartões com flex: 1,
          então os dois dividem a largura igualmente */}
      <View style={styles.grade}>
        {LINHAS_SUGESTOES.map((linha) => (
          <View key={linha[0].termo} style={styles.linhaGrade}>
            {linha.map((sugestao) => (
              <Pressable
                key={sugestao.termo}
                onPress={() => usarSugestao(sugestao.termo)}
                accessibilityRole="button"
                accessibilityLabel={`Buscar ${sugestao.termo}, ${sugestao.traducao}`}
                style={({ pressed }) => [
                  styles.cartao,
                  pressed && styles.pressionado,
                ]}
              >
                <View style={styles.iconeCartao}>
                  <MaterialCommunityIcons
                    name={sugestao.icone}
                    size={22}
                    color={cores.primaria}
                  />
                </View>
                <View style={styles.textosCartao}>
                  <Text style={styles.termoCartao}>{sugestao.termo}</Text>
                  <Text style={styles.traducaoCartao}>
                    {sugestao.traducao}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundoSuave, // cinza claro: o campo e os cartões brancos se destacam
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 32,
    paddingBottom: 32,
  },
  topo: {
    alignItems: "center",
  },
  titulo: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: "700",
    color: cores.textoPrincipal,
    textAlign: "center",
  },
  subtitulo: {
    marginTop: 6,
    fontSize: 15,
    color: cores.textoSuave,
    textAlign: "center",
  },
  linhaBusca: {
    flexDirection: "row",
    marginTop: 28,
    gap: 8,
  },
  caixaBusca: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 50,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 12,
    backgroundColor: cores.fundo,
  },
  caixaComAviso: {
    borderColor: cores.erro,
  },
  campo: {
    flex: 1,
    height: "100%",
    fontSize: 16, // 16 ou mais evita zoom automático em alguns aparelhos
    color: cores.textoPrincipal,
  },
  botao: {
    height: 50,
    paddingHorizontal: 18,
    borderRadius: 12,
    justifyContent: "center",
    backgroundColor: cores.primaria,
  },
  pressionado: {
    opacity: 0.7,
  },
  textoBotao: {
    color: cores.textoSobrePrimaria,
    fontSize: 16,
    fontWeight: "600",
  },
  aviso: {
    marginTop: 8,
    fontSize: 14,
    color: cores.erro,
  },
  tituloSugestoes: {
    marginTop: 32,
    marginBottom: 12,
    fontSize: 17,
    fontWeight: "700",
    color: cores.textoPrincipal,
  },
  grade: {
    gap: 12, // espaço entre as linhas
  },
  linhaGrade: {
    flexDirection: "row",
    gap: 12, // espaço entre os dois cartões da linha
  },
  cartao: {
    flex: 1, // os dois cartões da linha dividem a largura igualmente
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: cores.fundo,
    // mesma sombra dos cards de receita
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  iconeCartao: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: cores.primariaClara,
  },
  textosCartao: {
    flex: 1,
  },
  termoCartao: {
    fontSize: 15,
    fontWeight: "700",
    color: cores.textoPrincipal,
    textTransform: "capitalize", // mostra "Chicken", mas a busca continua com "chicken"
  },
  traducaoCartao: {
    marginTop: 1,
    fontSize: 13,
    color: cores.textoSuave,
  },
});
