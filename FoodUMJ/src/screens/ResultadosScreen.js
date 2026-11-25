import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import Carregando from "../components/Carregando";
import IconeCirculo from "../components/IconeCirculo";
import MensagemErro from "../components/MensagemErro";
import ReceitaCard from "../components/ReceitaCard";
import { buscarReceitas } from "../services/api";
import { cores } from "../theme/cores";

// Tela de resultados: busca na API as receitas do termo digitado na tela inicial.
export default function ResultadosScreen({ navigation, route }) {
  // "route.params" traz o que a tela inicial mandou no navigate('Resultados', { termo })
  const { termo } = route.params;

  // Os três estados do padrão de carregamento (seção 5 do roteiro)
  const [receitas, setReceitas] = useState([]);
  const [carregando, setCarregando] = useState(true); // começa true: a busca já sai ao abrir a tela
  const [erro, setErro] = useState(null);

  async function carregar() {
    // 1. Antes de chamar a API: liga o carregamento e limpa um erro antigo
    setCarregando(true);
    setErro(null);

    try {
      // 2. Deu certo: guarda a lista no estado
      const lista = await buscarReceitas(termo);
      setReceitas(lista);
    } catch (e) {
      // 3. Deu errado (sem internet, API fora do ar): guarda a mensagem de erro
      setErro(
        "Não foi possível carregar as receitas. Confira sua internet e tente de novo.",
      );
    } finally {
      // 4. Dando certo ou errado, o carregamento acaba
      setCarregando(false);
    }
  }

  // useEffect roda depois que a tela aparece. O [termo] no final diz:
  // "rode de novo só se o termo mudar". Na prática, busca uma vez ao abrir.
  useEffect(() => {
    carregar();
  }, [termo]);

  function abrirDetalhes(receita) {
    navigation.navigate("Detalhes", { id: receita.idMeal });
  }

  // Renderização condicional: cada situação mostra uma coisa diferente

  if (carregando) {
    return <Carregando mensagem={`Buscando receitas de "${termo}"...`} />;
  }

  if (erro) {
    // Passa a própria função carregar: o botão "Tentar novamente" repete a busca
    return <MensagemErro mensagem={erro} onTentarNovamente={carregar} />;
  }

  // 5. A busca funcionou, mas não achou nada
  if (receitas.length === 0) {
    return (
      <View style={styles.vazio}>
        <IconeCirculo nome="search-outline" />
        <Text style={styles.vazioTitulo}>
          Nenhuma receita encontrada para "{termo}".
        </Text>
        <Text style={styles.vazioDica}>
          Tente outro nome em inglês, como chicken, cake ou soup.
        </Text>
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.botao,
            pressed && styles.botaoPressionado,
          ]}
        >
          <Text style={styles.textoBotao}>Fazer outra busca</Text>
        </Pressable>
      </View>
    );
  }

  const quantidade =
    receitas.length === 1
      ? "1 receita encontrada"
      : `${receitas.length} receitas encontradas`;

  // FlatList desenha só os itens que aparecem na tela: é a lista certa para dados da API
  return (
    <FlatList
      style={styles.tela}
      contentContainerStyle={styles.lista}
      data={receitas}
      keyExtractor={(receita) => receita.idMeal} // chave única de cada item
      renderItem={({ item }) => (
        <ReceitaCard receita={item} onPress={() => abrirDetalhes(item)} />
      )}
      ListHeaderComponent={
        <Text style={styles.cabecalho}>
          {quantidade} para "{termo}"
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundoSuave, // fundo cinza claro para os cards brancos se destacarem
  },
  lista: {
    paddingVertical: 8,
  },
  cabecalho: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    fontSize: 14,
    color: cores.textoSuave,
  },
  vazio: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: cores.fundoSuave,
  },
  vazioTitulo: {
    marginTop: 16,
    fontSize: 17,
    fontWeight: "600",
    color: cores.textoPrincipal,
    textAlign: "center",
  },
  vazioDica: {
    marginTop: 6,
    fontSize: 15,
    color: cores.textoSuave,
    textAlign: "center",
  },
  botao: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: cores.primaria,
  },
  botaoPressionado: {
    opacity: 0.7,
  },
  textoBotao: {
    color: cores.textoSobrePrimaria,
    fontSize: 16,
    fontWeight: "600",
  },
});
