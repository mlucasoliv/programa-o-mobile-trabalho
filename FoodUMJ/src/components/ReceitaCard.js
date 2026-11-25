import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { cores } from "../theme/cores";

// Card de uma receita: foto pequena, nome e categoria.
// Usado na tela de Resultados e na tela de Favoritos.
//
// Props:
//   receita    → objeto da API (usa idMeal, strMeal, strMealThumb e strCategory)
//   onPress    → função chamada ao tocar no card (ex.: abrir os Detalhes)
//   onRemover  → opcional: se for passada, aparece o botão de lixeira (usado em Favoritos);
//                se não for, aparece uma setinha indicando que o card abre outra tela
//
// Uso: <ReceitaCard receita={receita} onPress={() => abrir(receita)} onRemover={() => remover(receita.idMeal)} />
export default function ReceitaCard({ receita, onPress, onRemover }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Ver receita ${receita.strMeal}`}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressionado]}
    >
      {/* "/small" pede à API a versão pequena da foto (9 KB em vez de ~110 KB) */}
      <Image
        source={{ uri: `${receita.strMealThumb}/small` }}
        style={styles.imagem}
      />

      <View style={styles.textos}>
        <Text style={styles.nome} numberOfLines={2}>
          {receita.strMeal}
        </Text>
        {receita.strCategory ? (
          <Text style={styles.categoria}>{receita.strCategory}</Text>
        ) : null}
      </View>

      {onRemover ? (
        <Pressable
          onPress={onRemover}
          accessibilityRole="button"
          accessibilityLabel={`Remover ${receita.strMeal} dos favoritos`}
          hitSlop={8}
          style={({ pressed }) => [
            styles.botaoRemover,
            pressed && styles.botaoRemoverPressionado,
          ]}
        >
          <Ionicons name="trash-outline" size={20} color={cores.primaria} />
        </Pressable>
      ) : (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={cores.textoPlaceholder}
          style={styles.seta}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: cores.fundo,
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    // sombra no iPhone
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    // sombra no Android
    elevation: 2,
  },
  cardPressionado: {
    opacity: 0.7,
  },
  imagem: {
    width: 76,
    height: 76,
    borderRadius: 10,
    backgroundColor: cores.fundoImagem, // aparece enquanto a foto carrega
  },
  textos: {
    flex: 1,
    marginLeft: 14,
  },
  nome: {
    fontSize: 16,
    fontWeight: "600",
    color: cores.textoPrincipal,
  },
  categoria: {
    alignSelf: "flex-start", // a etiqueta fica do tamanho do texto, não da linha inteira
    marginTop: 6,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
    overflow: "hidden", // necessário para o borderRadius do Text funcionar no iPhone
    backgroundColor: cores.primariaClara,
    color: cores.primariaEscura,
    fontSize: 12,
    fontWeight: "600",
  },
  seta: {
    marginLeft: 8,
  },
  botaoRemover: {
    marginLeft: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: cores.primariaClara,
  },
  botaoRemoverPressionado: {
    opacity: 0.6,
  },
});
