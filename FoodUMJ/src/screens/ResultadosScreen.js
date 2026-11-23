import { Button, StyleSheet, Text, View } from 'react-native';

// Tela de resultados (ESQUELETO da A5). A lista de receitas entra na A7.
// "route.params" traz os dados enviados pela tela anterior no navigate().
export default function ResultadosScreen({ navigation, route }) {
  const { termo } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Resultados</Text>
      <Text>Termo recebido: {termo}</Text>
      <Button
        title="Abrir a receita 52795 (teste)"
        onPress={() => navigation.navigate('Detalhes', { id: '52795' })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 },
  titulo: { fontSize: 20, fontWeight: '600' },
});
