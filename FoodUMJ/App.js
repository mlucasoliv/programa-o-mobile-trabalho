import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet } from "react-native";

import {
  FavoritosProvider,
  useFavoritos,
} from "./src/context/FavoritosContext";
import DetalhesScreen from "./src/screens/DetalhesScreen";
import FavoritosScreen from "./src/screens/FavoritosScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ResultadosScreen from "./src/screens/ResultadosScreen";
import { cores } from "./src/theme/cores";

// Stack = "pilha" de telas: cada navigate() coloca uma tela por cima,
// e o botão voltar tira a de cima, mostrando a anterior.
const Stack = createNativeStackNavigator();

// Botão do cabeçalho: só um coração. Ele lê a lista global (useContext):
// fica cheio quando já existe alguma favorita e vazado quando a lista está vazia.
function BotaoFavoritos({ onPress }) {
  const { favoritos } = useFavoritos();
  const temFavoritos = favoritos.length > 0;

  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={`Abrir favoritos (${favoritos.length})`}
      style={({ pressed }) => (pressed ? styles.pressionado : null)}
    >
      <Ionicons
        name={temFavoritos ? "heart" : "heart-outline"}
        size={26}
        color={cores.primaria}
      />
    </Pressable>
  );
}

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
          // screenOptions vale para TODAS as telas. Aqui ele coloca o coração
          // dos favoritos no canto direito do cabeçalho.
          screenOptions={({ navigation }) => ({
            headerTintColor: cores.primaria,
            headerTitleStyle: { color: cores.textoPrincipal, fontWeight: "700" },
            headerShadowVisible: false, // cabeçalho sem a sombra embaixo, mais limpo
            headerRight: () => (
              <BotaoFavoritos onPress={() => navigation.navigate("Favoritos")} />
            ),
          })}
        >
          {/* name = nome da rota (o que vai no navigate) | title = texto do cabeçalho */}
          <Stack.Screen
            name="Inicio"
            component={HomeScreen}
            options={{
              title: "FoodUMJ",
              // Na tela inicial o nome do app aparece em laranja, como uma marca
              headerTitleStyle: {
                color: cores.primaria,
                fontWeight: "800",
                fontSize: 22,
              },
            }}
          />
          <Stack.Screen
            name="Resultados"
            component={ResultadosScreen}
            options={{ title: "Resultados da busca" }}
          />
          <Stack.Screen
            name="Detalhes"
            component={DetalhesScreen}
            options={{ title: "Detalhes da receita" }}
          />
          <Stack.Screen
            name="Favoritos"
            component={FavoritosScreen}
            // Na própria tela de Favoritos o botão não faz sentido, então some
            options={{
              title: "Minhas receitas favoritas",
              headerRight: () => null,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </FavoritosProvider>
  );
}

const styles = StyleSheet.create({
  pressionado: {
    opacity: 0.6,
  },
});
