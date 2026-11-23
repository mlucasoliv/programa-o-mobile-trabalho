import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

// Mostra a "rodinha" girando enquanto o app espera a API responder.
// Uso: <Carregando mensagem="Buscando receitas..." />
export default function Carregando({ mensagem = 'Carregando...' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#E85D04" />
      <Text style={styles.texto}>{mensagem}</Text>
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
  texto: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
  },
});
