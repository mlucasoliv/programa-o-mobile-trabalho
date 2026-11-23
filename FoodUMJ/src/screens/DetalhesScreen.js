import { Button, StyleSheet, Text, View } from 'react-native';

// Tela de detalhes (ESQUELETO da A5). Os dados da receita entram na A10.
export default function DetalhesScreen({ navigation, route }) {
  const { id } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Detalhes</Text>
      <Text>Id recebido: {id}</Text>
      <Button title="Voltar ao início" onPress={() => navigation.popToTop()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 },
  titulo: { fontSize: 20, fontWeight: '600' },
});
