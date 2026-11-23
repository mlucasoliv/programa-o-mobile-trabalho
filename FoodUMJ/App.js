import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text } from 'react-native';

import { FavoritosProvider } from './src/context/FavoritosContext';
import DetalhesScreen from './src/screens/DetalhesScreen';
import FavoritosScreen from './src/screens/FavoritosScreen';
import HomeScreen from './src/screens/HomeScreen';
import ResultadosScreen from './src/screens/ResultadosScreen';

// Stack = "pilha" de telas: cada navigate() coloca uma tela por cima,
// e o botão voltar tira a de cima, mostrando a anterior.
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // FavoritosProvider fica por fora de tudo: assim TODAS as telas enxergam
    // a mesma lista de favoritos (é o useContext do enunciado)
    <FavoritosProvider>
      {/* NavigationContainer guarda o estado da navegação (em qual tela o usuário está) */}
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName="Inicio"
          // screenOptions vale para TODAS as telas. Aqui ele coloca o botão
          // "❤ Favoritos" no canto direito do cabeçalho.
          screenOptions={({ navigation }) => ({
            headerTintColor: '#E85D04',
            headerTitleStyle: { color: '#222' },
            headerRight: () => (
              <Pressable
                onPress={() => navigation.navigate('Favoritos')}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Abrir favoritos"
              >
                <Text style={styles.botaoFavoritos}>❤ Favoritos</Text>
              </Pressable>
            ),
          })}
        >
          {/* name = nome da rota (o que vai no navigate) | title = texto do cabeçalho */}
          <Stack.Screen name="Inicio" component={HomeScreen} options={{ title: 'FoodUMJ' }} />
          <Stack.Screen name="Resultados" component={ResultadosScreen} options={{ title: 'Resultados' }} />
          <Stack.Screen name="Detalhes" component={DetalhesScreen} options={{ title: 'Receita' }} />
          <Stack.Screen
            name="Favoritos"
            component={FavoritosScreen}
            // Na própria tela de Favoritos o botão não faz sentido, então some
            options={{ title: 'Favoritos', headerRight: () => null }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </FavoritosProvider>
  );
}

const styles = StyleSheet.create({
  botaoFavoritos: {
    color: '#E85D04',
    fontSize: 16,
    fontWeight: '600',
  },
});
