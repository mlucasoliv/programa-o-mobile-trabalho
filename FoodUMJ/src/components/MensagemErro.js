import { Pressable, StyleSheet, Text, View } from 'react-native';

// Mostra uma mensagem de erro e, se receber a função onTentarNovamente,
// um botão para o usuário repetir a requisição.
// Uso: <MensagemErro mensagem="Não foi possível carregar." onTentarNovamente={carregar} />
export default function MensagemErro({ mensagem = 'Algo deu errado.', onTentarNovamente }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icone}>😕</Text>
      <Text style={styles.texto}>{mensagem}</Text>

      {onTentarNovamente && (
        <Pressable
          onPress={onTentarNovamente}
          accessibilityRole="button"
          style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}
        >
          <Text style={styles.textoBotao}>Tentar novamente</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  icone: {
    fontSize: 48,
    marginBottom: 12,
  },
  texto: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  botao: {
    backgroundColor: '#E85D04',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  botaoPressionado: {
    opacity: 0.7,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
