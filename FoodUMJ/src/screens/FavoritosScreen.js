import { FlatList, StyleSheet, Text, View } from "react-native";
import ReceitaCard from "../components/ReceitaCard";
import { useFavoritos } from "../context/FavoritosContext";

// Tela de favoritos: mostra a lista global de receitas favoritadas (FavoritosContext).
// Tocar no card abre os Detalhes; o botão "Remover" tira a receita da lista.
export default function FavoritosScreen({ navigation }) {
  const { favoritos, removerFavorito } = useFavoritos();

  // Lista vazia: mostra uma mensagem em vez de uma tela em branco
  if (favoritos.length === 0) {
    return (
      <View style={styles.vazio}>
        <Text style={styles.icone}>❤</Text>
        <Text style={styles.textoVazio}>
          Você ainda não tem receitas favoritas.
        </Text>
        <Text style={styles.dicaVazio}>
          Abra uma receita e toque em "Favoritar" para ela aparecer aqui.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.tela}
      data={favoritos}
      keyExtractor={(item) => item.idMeal}
      contentContainerStyle={styles.lista}
      renderItem={({ item }) => (
        <ReceitaCard
          receita={item}
          onPress={() => navigation.navigate("Detalhes", { id: item.idMeal })}
          onRemover={() => removerFavorito(item.idMeal)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: "#fff",
  },
  lista: {
    paddingVertical: 8,
  },
  vazio: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  icone: {
    fontSize: 48,
    color: "#E85D04",
    marginBottom: 12,
  },
  textoVazio: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    textAlign: "center",
  },
  dicaVazio: {
    marginTop: 8,
    fontSize: 15,
    color: "#666",
    textAlign: "center",
  },
});
