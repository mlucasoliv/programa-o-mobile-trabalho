import { Button, StyleSheet, Text, View } from 'react-native';

// Tela de favoritos (ESQUELETO da A5). A lista de favoritas entra na Fase 3 (Pessoa B).
export default function FavoritosScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Favoritos</Text>
      <Text>Nenhuma receita favorita ainda.</Text>
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
