import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Carregando from "../components/Carregando";
import MensagemErro from "../components/MensagemErro";
import { useFavoritos } from "../context/FavoritosContext";
import { buscarReceitaPorId } from "../services/api";
import { cores } from "../theme/cores";
import { montarIngredientes } from "../utils/ingredientes";

// O modo de preparo vem num texto só, com quebras de linha ("\r\n") entre os parágrafos.
// Algumas receitas também têm linhas soltas só com "STEP 1", "STEP 2"...
// Esta função separa o texto em passos e tira essas linhas, porque a tela numera sozinha.
function montarPassos(instrucoes) {
  if (!instrucoes) {
    return [];
  }

  return instrucoes
    .split(/\r?\n/) // quebra o texto em linhas
    .map((linha) => linha.trim())
    .filter((linha) => linha !== "" && !/^step\s*\d+$/i.test(linha)); // tira vazias e "STEP N"
}

// Tela de detalhes: busca a receita completa pelo id e mostra foto, nome,
// categoria/origem, ingredientes e modo de preparo.
export default function DetalhesScreen({ route }) {
  // "route.params" traz o id enviado pela tela de Resultados (ou de Favoritos)
  const { id } = route.params;

  // Mesmo padrão de carregamento da tela de Resultados (seção 5 do roteiro)
  const [receita, setReceita] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Funções da lista global de favoritos (FavoritosContext)
  const { ehFavorito, adicionarFavorito, removerFavorito } = useFavoritos();

  async function carregar() {
    setCarregando(true);
    setErro(null);

    try {
      const dados = await buscarReceitaPorId(id); // receita completa, ou null se o id não existir
      setReceita(dados);
    } catch (e) {
      setErro(
        "Não foi possível carregar a receita. Confira sua internet e tente de novo.",
      );
    } finally {
      setCarregando(false);
    }
  }

  // Busca a receita quando a tela abre (e de novo só se o id mudar)
  useEffect(() => {
    carregar();
  }, [id]);

  if (carregando) {
    return <Carregando mensagem="Carregando a receita..." />;
  }

  if (erro) {
    return <MensagemErro mensagem={erro} onTentarNovamente={carregar} />;
  }

  // A API respondeu, mas não existe receita com esse id: tentar de novo não adianta
  if (!receita) {
    return (
      <MensagemErro mensagem="Receita não encontrada. Volte e escolha outra receita." />
    );
  }

  const ingredientes = montarIngredientes(receita);
  const passos = montarPassos(receita.strInstructions);

  // Já está na lista de favoritos? Define o texto do botão
  const favorita = ehFavorito(receita.idMeal);

  // Se já é favorita, remove; se não é, adiciona (o contexto guarda só os 4 campos do card)
  function alternarFavorito() {
    if (favorita) {
      removerFavorito(receita.idMeal);
    } else {
      adicionarFavorito(receita);
    }
  }

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      {/* Foto grande: aqui usamos a imagem original, sem o "/small" da lista */}
      <Image
        source={{ uri: receita.strMealThumb }}
        style={styles.foto}
        accessibilityLabel={`Foto de ${receita.strMeal}`}
      />

      <View style={styles.corpo}>
        <Text style={styles.nome}>{receita.strMeal}</Text>

        {/* Categoria e origem só aparecem se a API mandar */}
        <View style={styles.etiquetas}>
          {receita.strCategory ? (
            <Text style={styles.etiqueta}>🍽 {receita.strCategory}</Text>
          ) : null}
          {receita.strArea ? (
            <Text style={styles.etiqueta}>🌍 {receita.strArea}</Text>
          ) : null}
        </View>

        {/* Botão que alterna entre favoritar e remover dos favoritos */}
        <Pressable
          onPress={alternarFavorito}
          accessibilityRole="button"
          accessibilityLabel={
            favorita ? "Remover dos favoritos" : "Favoritar receita"
          }
          style={({ pressed }) => [
            styles.botaoFavorito,
            favorita && styles.botaoFavoritoAtivo,
            pressed && styles.botaoFavoritoPressionado,
          ]}
        >
          <Text
            style={[
              styles.textoFavorito,
              favorita && styles.textoFavoritoAtivo,
            ]}
          >
            {favorita ? "Remover dos favoritos" : "❤ Favoritar"}
          </Text>
        </Pressable>

        <Text style={styles.tituloSecao}>
          Ingredientes ({ingredientes.length})
        </Text>
        <View style={styles.caixa}>
          {ingredientes.map((item, indice) => (
            // Uma receita pode repetir o mesmo ingrediente, então a chave usa a posição
            <View
              key={`${indice}-${item.ingrediente}`}
              style={[
                styles.linhaIngrediente,
                indice > 0 && styles.linhaComDivisoria,
              ]}
            >
              <Text style={styles.ingrediente}>{item.ingrediente}</Text>
              <Text style={styles.medida}>{item.medida}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.tituloSecao}>Modo de preparo</Text>
        {passos.map((passo, indice) => (
          <View key={indice} style={styles.passo}>
            <Text style={styles.numeroPasso}>{indice + 1}</Text>
            <Text style={styles.textoPasso}>{passo}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    paddingBottom: 32,
  },
  foto: {
    width: "100%",
    aspectRatio: 4 / 3, // altura proporcional à largura da tela
    backgroundColor: cores.fundoImagem, // aparece enquanto a foto carrega
  },
  corpo: {
    padding: 20,
  },
  nome: {
    fontSize: 24,
    fontWeight: "700",
    color: cores.textoPrincipal,
  },
  etiquetas: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  etiqueta: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
    overflow: "hidden", // necessário para o borderRadius do Text funcionar no iPhone
    backgroundColor: cores.primariaClara,
    color: cores.primariaEscura,
    fontSize: 14,
    fontWeight: "600",
  },
  botaoFavorito: {
    marginTop: 18,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: cores.primaria,
    borderWidth: 1,
    borderColor: cores.primaria,
  },
  botaoFavoritoAtivo: {
    backgroundColor: cores.fundo,
  },
  botaoFavoritoPressionado: {
    opacity: 0.7,
  },
  textoFavorito: {
    color: cores.textoSobrePrimaria,
    fontSize: 16,
    fontWeight: "700",
  },
  textoFavoritoAtivo: {
    color: cores.primaria,
  },
  tituloSecao: {
    marginTop: 28,
    marginBottom: 10,
    fontSize: 19,
    fontWeight: "700",
    color: cores.textoPrincipal,
  },
  caixa: {
    borderRadius: 12,
    backgroundColor: cores.fundoSuave,
    paddingHorizontal: 14,
  },
  linhaIngrediente: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 10,
  },
  linhaComDivisoria: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: cores.borda,
  },
  ingrediente: {
    flex: 1,
    fontSize: 15,
    color: cores.textoPrincipal,
    textTransform: "capitalize", // a API às vezes manda "fenugreek" em minúscula
  },
  medida: {
    flexShrink: 1,
    fontSize: 15,
    color: cores.textoSuave,
    textAlign: "right",
  },
  passo: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  numeroPasso: {
    width: 26,
    height: 26,
    borderRadius: 13,
    overflow: "hidden",
    backgroundColor: cores.primaria,
    color: cores.textoSobrePrimaria,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 26,
  },
  textoPasso: {
    flex: 1,
    fontSize: 15,
    lineHeight: 23,
    color: cores.texto,
  },
});
