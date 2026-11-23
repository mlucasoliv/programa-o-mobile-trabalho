import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

// Card de uma receita: foto pequena, nome e categoria.
// Usado na tela de Resultados e na tela de Favoritos.
//
// Props:
//   receita    → objeto da API (usa idMeal, strMeal, strMealThumb e strCategory)
//   onPress    → função chamada ao tocar no card (ex.: abrir os Detalhes)
//   onRemover  → opcional: se for passada, aparece o botão "Remover" (usado em Favoritos)
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
      <Image source={{ uri: `${receita.strMealThumb}/small` }} style={styles.imagem} />

      <View style={styles.textos}>
        <Text style={styles.nome} numberOfLines={2}>
          {receita.strMeal}
        </Text>
        {receita.strCategory ? <Text style={styles.categoria}>{receita.strCategory}</Text> : null}
      </View>

      {onRemover && (
        <Pressable
          onPress={onRemover}
          accessibilityRole="button"
          accessibilityLabel={`Remover ${receita.strMeal} dos favoritos`}
          hitSlop={8}
          style={({ pressed }) => [styles.botaoRemover, pressed && styles.botaoRemoverPressionado]}
        >
          <Text style={styles.textoRemover}>Remover</Text>
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 16,
    marginVertical: 6,
    // sombra no iPhone
    shadowColor: '#000',
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
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#eee', // aparece enquanto a foto carrega
  },
  textos: {
    flex: 1,
    marginLeft: 12,
  },
  nome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  categoria: {
    marginTop: 4,
    fontSize: 14,
    color: '#777',
  },
  botaoRemover: {
    marginLeft: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E85D04',
  },
  botaoRemoverPressionado: {
    backgroundColor: '#FDEBDD',
  },
  textoRemover: {
    color: '#E85D04',
    fontSize: 14,
    fontWeight: '600',
  },
});
