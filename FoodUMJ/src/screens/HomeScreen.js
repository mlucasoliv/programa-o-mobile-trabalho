import { Button, StyleSheet, Text, View } from 'react-native';

// Tela inicial (ESQUELETO da A5). O campo de pesquisa entra na A6.
// Toda tela registrada no Stack recebe a prop "navigation", usada para trocar de tela.
export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tela inicial</Text>
      <Button
        title='Buscar "chicken" (teste)'
        // navigate('NomeDaRota', { parâmetros }) abre a tela e leva os dados junto
        onPress={() => navigation.navigate('Resultados', { termo: 'chicken' })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 },
  titulo: { fontSize: 20, fontWeight: '600' },
});
