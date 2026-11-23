import { useState } from 'react';
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

// As receitas da API estão em inglês, então sugerimos termos que trazem bastante resultado.
const SUGESTOES = [
  { termo: 'chicken', traducao: 'frango' },
  { termo: 'beef', traducao: 'carne' },
  { termo: 'cake', traducao: 'bolo' },
  { termo: 'soup', traducao: 'sopa' },
  { termo: 'salad', traducao: 'salada' },
  { termo: 'rice', traducao: 'arroz' },
];

// Tela inicial: campo de pesquisa + sugestões.
export default function HomeScreen({ navigation }) {
  // useState guarda o que está digitado. Cada letra digitada atualiza o estado,
  // e o React redesenha a tela com o valor novo (é um "campo controlado").
  const [termo, setTermo] = useState('');
  // Mensagem mostrada quando o usuário tenta buscar com o campo vazio
  const [aviso, setAviso] = useState('');

  function buscar(texto) {
    const termoLimpo = texto.trim();

    if (termoLimpo === '') {
      setAviso('Digite o nome de uma receita para buscar.');
      return;
    }

    setAviso('');
    Keyboard.dismiss(); // fecha o teclado antes de trocar de tela
    navigation.navigate('Resultados', { termo: termoLimpo });
  }

  function aoDigitar(texto) {
    setTermo(texto);
    if (aviso) setAviso(''); // some com o aviso assim que a pessoa volta a digitar
  }

  function usarSugestao(sugestao) {
    setTermo(sugestao);
    buscar(sugestao);
  }

  return (
    // keyboardShouldPersistTaps="handled": o toque numa sugestão funciona de primeira,
    // mesmo com o teclado aberto
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.emoji}>🍲</Text>
      <Text style={styles.titulo}>O que vamos cozinhar hoje?</Text>
      <Text style={styles.subtitulo}>Pesquise uma receita pelo nome, em inglês.</Text>

      <View style={styles.linhaBusca}>
        <TextInput
          style={[styles.campo, aviso ? styles.campoComAviso : null]}
          value={termo}
          onChangeText={aoDigitar}
          onSubmitEditing={() => buscar(termo)} // o Enter do teclado também busca
          placeholder="Ex.: chicken, cake, soup..."
          placeholderTextColor="#999"
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false} // senão o corretor em português troca "chicken" por outra palavra
          clearButtonMode="while-editing"
          accessibilityLabel="Pesquisar receitas"
        />
        <Pressable
          onPress={() => buscar(termo)}
          accessibilityRole="button"
          style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}
        >
          <Text style={styles.textoBotao}>Buscar</Text>
        </Pressable>
      </View>

      {aviso ? <Text style={styles.aviso}>{aviso}</Text> : null}

      <Text style={styles.tituloSugestoes}>Sugestões</Text>
      <View style={styles.sugestoes}>
        {SUGESTOES.map((sugestao) => (
          <Pressable
            key={sugestao.termo}
            onPress={() => usarSugestao(sugestao.termo)}
            accessibilityRole="button"
            accessibilityLabel={`Buscar ${sugestao.termo}, ${sugestao.traducao}`}
            style={({ pressed }) => [styles.chip, pressed && styles.chipPressionado]}
          >
            <Text style={styles.textoChip}>
              {sugestao.termo} <Text style={styles.traducaoChip}>({sugestao.traducao})</Text>
            </Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  emoji: {
    fontSize: 56,
    textAlign: 'center',
  },
  titulo: {
    marginTop: 12,
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
  },
  subtitulo: {
    marginTop: 6,
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
  },
  linhaBusca: {
    flexDirection: 'row',
    marginTop: 28,
    gap: 8,
  },
  campo: {
    flex: 1,
    height: 48,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    fontSize: 16, // 16 ou mais evita zoom automático em alguns aparelhos
    color: '#222',
    backgroundColor: '#fafafa',
  },
  campoComAviso: {
    borderColor: '#D62828',
  },
  botao: {
    height: 48,
    paddingHorizontal: 18,
    borderRadius: 10,
    justifyContent: 'center',
    backgroundColor: '#E85D04',
  },
  botaoPressionado: {
    opacity: 0.7,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  aviso: {
    marginTop: 8,
    fontSize: 14,
    color: '#D62828',
  },
  tituloSugestoes: {
    marginTop: 32,
    marginBottom: 10,
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
  },
  sugestoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#FDEBDD',
  },
  chipPressionado: {
    opacity: 0.6,
  },
  textoChip: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9A3B00',
  },
  traducaoChip: {
    fontWeight: '400',
    color: '#B5651D',
  },
});
